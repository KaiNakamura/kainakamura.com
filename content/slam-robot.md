---
title: 'Autonomous Mapping Robot'
description: 'An implementation of SLAM (Simultaneous Localization and Mapping)'
image: 'rbe3002/rbe3002.jpg'
preview: 'rbe3002/preview.gif'
media: 'https://www.youtube.com/embed/xqjVTE7QvOg'
priority: 8
tags:
  - ROS
  - Python
---

This project is an implementation of SLAM (Simultaneous Localization and Mapping). The robot uses a LIDAR sensor to scan its environment and search out new areas of the map to explore.

The video above covers SLAM, how a LIDAR sensor works, frontier exploration, pathfinding, pure pursuit, obstacle avoidance, and Monte Carlo localization.

This project was part, for one of my robotics courses, RBE 3002 - Unified Robotics IV.

Below are some code snippets for various ROS messages and nodes used to make this project.

### Frontier.msg

ROS message for a frontier that keeps track of its size in grid cells and its centroid as a point.

```
uint32 size
geometry_msgs/Point centroid
```

### FrontierList.msg

ROS message for a list of frontiers.

```
lab4/Frontier[] frontiers
```

### frontier_search.py

ROS node that constantly checks for new frontiers and publishes them using [Expanding Wavefront Frontier Detection](https://opus.lib.uts.edu.au/bitstream/10453/30533/1/quinACRA2014.pdf).

```python
#!/usr/bin/env python3

from path_planner import PathPlanner
from nav_msgs.msg import OccupancyGrid
from lab4.msg import Frontier, FrontierList


class FrontierSearch:
    @staticmethod
    def search(
        mapdata: OccupancyGrid,
        start: "tuple[int, int]",
        include_frontier_cells: bool = False,
    ) -> "tuple[FrontierList, list[tuple[int, int]]]":
        MIN_FRONTIER_SIZE = 8  # Number of cells

        # Create queue for breadth-first search
        queue = []
        queue.append(start)

        # Initialize dictionaries for keeping track of visited and frontier cells
        visited = {}
        is_frontier = {}
        visited[start] = True

        # Initialize list of frontiers
        frontiers = []

        # Initialize list of frontier cells
        frontier_cells = []

        while queue:
            current = queue.pop(0)
            for neighbor in PathPlanner.neighbors_of_4(mapdata, current):
                neighbor_value = PathPlanner.get_cell_value(mapdata, neighbor)
                if neighbor_value >= 0 and not neighbor in visited:
                    visited[neighbor] = True
                    queue.append(neighbor)
                elif FrontierSearch.is_new_frontier_cell(
                    mapdata, neighbor, is_frontier
                ):
                    # Mark as frontier
                    is_frontier[neighbor] = True

                    # Build new frontier
                    new_frontier, new_frontier_cells = (
                        FrontierSearch.build_new_frontier(
                            mapdata,
                            neighbor,
                            is_frontier,
                            include_frontier_cells,
                        )
                    )
                    if new_frontier.size >= MIN_FRONTIER_SIZE:
                        frontiers.append(new_frontier)
                        if include_frontier_cells:
                            frontier_cells.extend(new_frontier_cells)

        return (FrontierList(frontiers=frontiers), frontier_cells)

    @staticmethod
    def build_new_frontier(
        mapdata: OccupancyGrid,
        initial_cell: "tuple[int, int]",
        is_frontier: dict,
        include_frontier_cells: bool = False,
    ) -> "tuple[Frontier, list[tuple[int, int]]]":
        # Initialize frontier fields
        size = 1
        centroid_x = initial_cell[0]
        centroid_y = initial_cell[1]

        # Create queue for breadth-first search
        queue = []
        queue.append(initial_cell)

        # Initialize list of frontier cells
        frontier_cells = []

        # Breadth-first search for frontier cells
        while queue:
            current = queue.pop(0)

            if include_frontier_cells:
                frontier_cells.append(current)

            for neighbor in PathPlanner.neighbors_of_8(mapdata, current):
                if FrontierSearch.is_new_frontier_cell(mapdata, neighbor, is_frontier):
                    # Mark as frontier
                    is_frontier[neighbor] = True

                    # Update size and centroid
                    size += 1
                    centroid_x += neighbor[0]
                    centroid_y += neighbor[1]
                    queue.append(neighbor)

        # Calculate centroid by taking the average
        centroid_x /= size
        centroid_y /= size

        # Make and return new frontier
        centroid = PathPlanner.grid_to_world(
            mapdata, (int(centroid_x), int(centroid_y))
        )
        return (
            Frontier(size=size, centroid=centroid),
            frontier_cells,
        )

    @staticmethod
    def is_new_frontier_cell(
        mapdata: OccupancyGrid, cell: "tuple[int, int]", is_frontier: dict
    ) -> bool:
        # Cell must be unknown and not already a frontier
        if PathPlanner.get_cell_value(mapdata, cell) != -1 or cell in is_frontier:
            return False

        # Cell should have at least one connected cell that is free
        WALKABLE_THRESHOLD = 50
        for neighbor in PathPlanner.neighbors_of_4(mapdata, cell):
            neighbor_value = PathPlanner.get_cell_value(mapdata, neighbor)
            if neighbor_value >= 0 and neighbor_value < WALKABLE_THRESHOLD:
                return True

        return False
```

### frontier_exploration.py

ROS node that listens for a FrontierList published by the FrontierSearch node and picks one to explore.

It uses a combination of A\* cost and frontier size to decide which frontier is the best.

Once a frontier has been selected, this node publishs a path to reach the frontier using the PathPlanner class.

```python
#!/usr/bin/env python3

import os
import rospy
import rospkg
import threading
import subprocess
import numpy as np
from typing import Union
from path_planner import PathPlanner
from frontier_search import FrontierSearch
from nav_msgs.msg import OccupancyGrid, Path, GridCells, Odometry
from geometry_msgs.msg import Pose, Point, Quaternion
from lab4.msg import FrontierList
from tf import TransformListener
from tf.transformations import euler_from_quaternion

class FrontierExploration:
def **init**(self):
"""
Class constructor
"""
rospy.init_node("frontier_exploration")

        # Set if in debug mode
        self.is_in_debug_mode = (
            rospy.has_param("~debug") and rospy.get_param("~debug") == "true"
        )

        # Publishers
        self.pure_pursuit_pub = rospy.Publisher(
            "/pure_pursuit/path", Path, queue_size=10
        )

        if self.is_in_debug_mode:
            self.frontier_cells_pub = rospy.Publisher(
                "/frontier_exploration/frontier_cells", GridCells, queue_size=10
            )
            self.start_pub = rospy.Publisher(
                "/frontier_exploration/start", GridCells, queue_size=10
            )
            self.goal_pub = rospy.Publisher(
                "/frontier_exploration/goal", GridCells, queue_size=10
            )
            self.cspace_pub = rospy.Publisher("/cspace", GridCells, queue_size=10)
            self.cost_map_pub = rospy.Publisher(
                "/cost_map", OccupancyGrid, queue_size=10
            )

        # Subscribers
        rospy.Subscriber("/odom", Odometry, self.update_odometry)
        rospy.Subscriber("/map", OccupancyGrid, self.update_map)

        self.tf_listener = TransformListener()
        self.lock = threading.Lock()
        self.pose = None
        self.map = None

        self.NUM_EXPLORE_FAILS_BEFORE_FINISH = 30
        self.no_path_found_counter = 0
        self.no_frontiers_found_counter = 0
        self.is_finished_exploring = False

    def update_odometry(self, msg: "Union[Odometry, None]" = None):
        """
        Updates the current pose of the robot.
        """
        try:
            (trans, rot) = self.tf_listener.lookupTransform(
                "/map", "/base_footprint", rospy.Time(0)
            )
        except:
            return

        self.pose = Pose(
            position=Point(x=trans[0], y=trans[1]),
            orientation=Quaternion(x=rot[0], y=rot[1], z=rot[2], w=rot[3]),
        )

    def update_map(self, msg: OccupancyGrid):
        """
        Updates the current map.
        This method is a callback bound to a Subscriber.
        :param msg [OccupancyGrid] The current map information.
        """
        self.map = msg

    def save_map(self):
        # Get the path of the current package
        rospack = rospkg.RosPack()
        package_path = rospack.get_path("lab4")

        # Construct the path to the map
        map_path = os.path.join(package_path, "map/map")
        if not os.path.exists(os.path.dirname(map_path)):
            os.makedirs(os.path.dirname(map_path))

        # Run map_saver
        subprocess.call(["rosrun", "map_server", "map_saver", "-f", map_path])

        self.update_odometry()

        if self.pose is None:
            rospy.logerr("Failed to get pose")
            return

        # Save the robot's position and orientation
        position = self.pose.position
        orientation = self.pose.orientation
        roll, pitch, yaw = euler_from_quaternion(
            [orientation.x, orientation.y, orientation.z, orientation.w]
        )
        with open(os.path.join(package_path, "map/pose.txt"), "w") as f:
            f.write(f"{position.x} {position.y} {position.z} {yaw} {pitch} {roll}\n")

    @staticmethod
    def get_top_frontiers(frontiers, n):
        # Sort the frontiers by size in descending order
        sorted_frontiers = sorted(
            frontiers, key=lambda frontier: frontier.size, reverse=True
        )

        # Return the top n frontiers
        return sorted_frontiers[:n]

    def publish_cost_map(self, mapdata: OccupancyGrid, cost_map: np.ndarray):
        # Create an OccupancyGrid message
        grid = OccupancyGrid()
        grid.header.stamp = rospy.Time.now()
        grid.header.frame_id = "map"
        grid.info.resolution = mapdata.info.resolution
        grid.info.width = cost_map.shape[1]
        grid.info.height = cost_map.shape[0]
        grid.info.origin = mapdata.info.origin

        # Normalize the cost map to the range [0, 100] and convert it to integers
        cost_map_normalized = (cost_map / np.max(cost_map) * 100).astype(np.int8)

        # Flatten the cost map and convert it to a list
        grid.data = cost_map_normalized.flatten().tolist()

        # Publish the OccupancyGrid message
        self.cost_map_pub.publish(grid)

    def check_if_finished_exploring(self):
        # Publish empty path to stop the robot
        self.pure_pursuit_pub.publish(Path())

        # If no frontiers or paths are found for a certain number of times, finish exploring
        if (
            self.no_frontiers_found_counter >= self.NUM_EXPLORE_FAILS_BEFORE_FINISH
            or self.no_path_found_counter >= self.NUM_EXPLORE_FAILS_BEFORE_FINISH
        ):
            rospy.loginfo("Done exploring!")
            self.save_map()
            rospy.loginfo("Saved map")
            self.is_finished_exploring = True

    def explore_frontier(self, frontier_list: FrontierList):
        # If finished exploring, no pose, no map, or no frontier list, return
        if self.is_finished_exploring or self.pose is None or self.map is None:
            return

        frontiers = frontier_list.frontiers

        # If no frontiers are found, check if finished exploring
        if not frontiers:
            rospy.loginfo("No frontiers")
            self.no_frontiers_found_counter += 1
            self.check_if_finished_exploring()
            return
        else:
            self.no_frontiers_found_counter = 0

        A_STAR_COST_WEIGHT = 10.0
        FRONTIER_SIZE_COST_WEIGHT = 1.0

        # Calculate the C-space
        cspace, cspace_cells = PathPlanner.calc_cspace(self.map, self.is_in_debug_mode)
        # if cspace_cells is not None:
        #     self.cspace_pub.publish(cspace_cells)

        # Calculate the cost map
        cost_map = PathPlanner.calc_cost_map(self.map)
        if self.is_in_debug_mode:
            self.publish_cost_map(self.map, cost_map)

        # Get the start
        start = PathPlanner.world_to_grid(self.map, self.pose.position)

        # Execute A* for every frontier
        lowest_cost = float("inf")
        best_path = None

        # Check only the top frontiers in terms of size
        MAX_NUM_FRONTIERS_TO_CHECK = 8
        top_frontiers = FrontierExploration.get_top_frontiers(
            frontiers, MAX_NUM_FRONTIERS_TO_CHECK
        )

        starts = []
        goals = []

        # Log how many frontiers are being explored
        rospy.loginfo(f"Exploring {len(top_frontiers)} frontiers")

        for frontier in top_frontiers:
            # Get goal
            goal = PathPlanner.world_to_grid(self.map, frontier.centroid)

            # Execute A*
            path, a_star_cost, start, goal = PathPlanner.a_star(
                cspace, cost_map, start, goal
            )

            # If in debug mode, append start and goal
            if self.is_in_debug_mode:
                starts.append(start)
                goals.append(goal)

            if path is None or a_star_cost is None:
                continue

            # Calculate cost
            cost = (A_STAR_COST_WEIGHT * a_star_cost) + (
                FRONTIER_SIZE_COST_WEIGHT / frontier.size
            )

            # Update best path
            if cost < lowest_cost:
                lowest_cost = cost
                best_path = path

        # If in debug mode, publish the start and goal
        if self.is_in_debug_mode:
            self.start_pub.publish(PathPlanner.get_grid_cells(self.map, starts))
            self.goal_pub.publish(PathPlanner.get_grid_cells(self.map, goals))

        # If a path was found, publish it
        if best_path:
            rospy.loginfo(f"Found best path with cost {lowest_cost}")
            start = best_path[0]
            path = PathPlanner.path_to_message(self.map, best_path)
            self.pure_pursuit_pub.publish(path)
            self.no_path_found_counter = 0
        # If no path was found, check if finished exploring
        else:
            rospy.loginfo("No paths found")
            self.no_path_found_counter += 1
            self.check_if_finished_exploring()

    def run(self):
        rate = rospy.Rate(20)  # Hz
        while not rospy.is_shutdown():
            if self.pose is None or self.map is None:
                continue

            # Get the start position of the robot
            start = PathPlanner.world_to_grid(self.map, self.pose.position)

            # Get frontiers
            frontier_list, frontier_cells = FrontierSearch.search(
                self.map, start, self.is_in_debug_mode
            )

            if frontier_list is None:
                continue

            # Publish frontier cells if in debug mode
            if self.is_in_debug_mode:
                self.frontier_cells_pub.publish(
                    PathPlanner.get_grid_cells(self.map, frontier_cells)
                )

            self.explore_frontier(frontier_list)

            rate.sleep()

if **name** == "**main**":
FrontierExploration().run()

```

### path_planner.py

Helper class used to perform an A\* search on a grid cell map.

```python
#!/usr/bin/env python3

import rospy
import math
import cv2
import numpy as np
from typing import Union
from std_msgs.msg import Header
from nav_msgs.msg import GridCells, OccupancyGrid, Path
from geometry_msgs.msg import Point, Quaternion, Pose, PoseStamped
from priority_queue import PriorityQueue
from tf.transformations import quaternion_from_euler


DIRECTIONS_OF_4 = [(-1, 0), (1, 0), (0, -1), (0, 1)]
DIRECTIONS_OF_8 = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]


class PathPlanner:

    @staticmethod
    def grid_to_index(mapdata: OccupancyGrid, p: "tuple[int, int]") -> int:
        """
        Returns the index corresponding to the given (x,y) coordinates in the occupancy grid.
        :param p [(int, int)] The cell coordinate.
        :return  [int] The index.
        """
        return p[1] * mapdata.info.width + p[0]

    @staticmethod
    def get_cell_value(mapdata: OccupancyGrid, p: "tuple[int, int]") -> int:
        """
        Returns the cell corresponding to the given (x,y) coordinates in the occupancy grid.
        :param p [(int, int)] The cell coordinate.
        :return  [int] The cell.
        """
        return mapdata.data[PathPlanner.grid_to_index(mapdata, p)]

    @staticmethod
    def euclidean_distance(
        p1: "tuple[float, float]", p2: "tuple[float, float]"
    ) -> float:
        """
        Calculates the Euclidean distance between two points.
        :param p1 [(float, float)] first point.
        :param p2 [(float, float)] second point.
        :return   [float]          distance.
        """
        return math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2)

    @staticmethod
    def grid_to_world(mapdata: OccupancyGrid, p: "tuple[int, int]") -> Point:
        """
        Transforms a cell coordinate in the occupancy grid into a world coordinate.
        :param mapdata [OccupancyGrid] The map information.
        :param p [(int, int)] The cell coordinate.
        :return        [Point]         The position in the world.
        """
        x = (p[0] + 0.5) * mapdata.info.resolution + mapdata.info.origin.position.x
        y = (p[1] + 0.5) * mapdata.info.resolution + mapdata.info.origin.position.y
        return Point(x, y, 0)

    @staticmethod
    def world_to_grid(mapdata: OccupancyGrid, wp: Point) -> "tuple[int, int]":
        """
        Transforms a world coordinate into a cell coordinate in the occupancy grid.
        :param mapdata [OccupancyGrid] The map information.
        :param wp      [Point]         The world coordinate.
        :return        [(int,int)]     The cell position as a tuple.
        """
        x = int((wp.x - mapdata.info.origin.position.x) / mapdata.info.resolution)
        y = int((wp.y - mapdata.info.origin.position.y) / mapdata.info.resolution)
        return (x, y)

    @staticmethod
    def path_to_poses(
        mapdata: OccupancyGrid, path: "list[tuple[int, int]]"
    ) -> "list[PoseStamped]":
        """
        Converts the given path into a list of PoseStamped.
        :param mapdata [OccupancyGrid] The map information.
        :param  path   [[(int,int)]]   The path as a list of tuples (cell coordinates).
        :return        [[PoseStamped]] The path as a list of PoseStamped (world coordinates).
        """
        poses = []
        for i in range(len(path) - 1):
            cell = path[i]
            next_cell = path[i + 1]
            if i != len(path) - 1:
                angle_to_next = math.atan2(
                    next_cell[1] - cell[1], next_cell[0] - cell[0]
                )
            q = quaternion_from_euler(0, 0, angle_to_next)
            poses.append(
                PoseStamped(
                    header=Header(frame_id="map"),
                    pose=Pose(
                        position=PathPlanner.grid_to_world(mapdata, cell),
                        orientation=Quaternion(q[0], q[1], q[2], q[3]),
                    ),
                )
            )
        return poses

    @staticmethod
    def is_cell_in_bounds(mapdata: OccupancyGrid, p: "tuple[int, int]") -> bool:
        width = mapdata.info.width
        height = mapdata.info.height
        x = p[0]
        y = p[1]

        if x < 0 or x >= width:
            return False
        if y < 0 or y >= height:
            return False
        return True

    @staticmethod
    def is_cell_walkable(mapdata: OccupancyGrid, p: "tuple[int, int]") -> bool:
        """
        A cell is walkable if all of these conditions are true:
        1. It is within the boundaries of the grid;
        2. It is free (not occupied by an obstacle)
        :param mapdata [OccupancyGrid] The map information.
        :param p       [(int, int)]    The coordinate in the grid.
        :return        [bool]          True if the cell is walkable, False otherwise
        """
        if not PathPlanner.is_cell_in_bounds(mapdata, p):
            return False

        WALKABLE_THRESHOLD = 50
        return PathPlanner.get_cell_value(mapdata, p) < WALKABLE_THRESHOLD

    @staticmethod
    def neighbors(
        mapdata: OccupancyGrid,
        p: "tuple[int, int]",
        directions: "list[tuple[int, int]]",
        must_be_walkable: bool = True,
    ) -> "list[tuple[int, int]]":
        """
        Returns the neighbors cells of (x,y) in the occupancy grid given directions to check.
        :param mapdata           [OccupancyGrid] The map information.
        :param p                 [(int, int)]    The coordinate in the grid.
        :param directions        [[(int,int)]]   A list of directions to check for neighbors.
        :param must_be_walkable  [bool]          Whether or not the cells must be walkable
        :return                  [[(int,int)]]   A list of 4-neighbors.
        """
        neighbors = []
        for direction in directions:
            candidate = (p[0] + direction[0], p[1] + direction[1])
            if (
                must_be_walkable and PathPlanner.is_cell_walkable(mapdata, candidate)
            ) or (
                not must_be_walkable
                and PathPlanner.is_cell_in_bounds(mapdata, candidate)
            ):
                neighbors.append(candidate)
        return neighbors

    @staticmethod
    def neighbors_of_4(
        mapdata: OccupancyGrid, p: "tuple[int, int]", must_be_walkable: bool = True
    ) -> "list[tuple[int, int]]":
        return PathPlanner.neighbors(mapdata, p, DIRECTIONS_OF_4, must_be_walkable)

    @staticmethod
    def neighbors_of_8(
        mapdata: OccupancyGrid, p: "tuple[int, int]", must_be_walkable: bool = True
    ) -> "list[tuple[int, int]]":
        return PathPlanner.neighbors(mapdata, p, DIRECTIONS_OF_8, must_be_walkable)

    @staticmethod
    def neighbors_and_distances(
        mapdata: OccupancyGrid,
        p: "tuple[int, int]",
        directions: "list[tuple[int, int]]",
        must_be_walkable: bool = True,
    ) -> "list[tuple[tuple[int, int], float]]":
        """
        Returns the neighbors cells of (x,y) in the occupancy grid given directions to check and their distances.
        :param mapdata           [OccupancyGrid] The map information.
        :param p                 [(int, int)]    The coordinate in the grid.
        :param directions        [[(int,int)]]   A list of directions to check for neighbors.
        :param must_be_walkable  [bool]          Whether or not the cells must be walkable
        :return                  [[(int,int)]]   A list of 4-neighbors.
        """
        neighbors = []
        for direction in directions:
            candidate = (p[0] + direction[0], p[1] + direction[1])
            if not must_be_walkable or PathPlanner.is_cell_walkable(mapdata, candidate):
                distance = PathPlanner.euclidean_distance(direction, (0, 0))
                neighbors.append((candidate, distance))
        return neighbors

    @staticmethod
    def neighbors_and_distances_of_4(
        mapdata: OccupancyGrid, p: "tuple[int, int]", must_be_walkable: bool = True
    ) -> "list[tuple[tuple[int, int], float]]":
        return PathPlanner.neighbors_and_distances(
            mapdata, p, DIRECTIONS_OF_4, must_be_walkable
        )

    @staticmethod
    def neighbors_and_distances_of_8(
        mapdata: OccupancyGrid, p: "tuple[int, int]", must_be_walkable: bool = True
    ) -> "list[tuple[tuple[int, int], float]]":
        return PathPlanner.neighbors_and_distances(
            mapdata, p, DIRECTIONS_OF_8, must_be_walkable
        )

    @staticmethod
    def get_grid_cells(
        mapdata: OccupancyGrid, cells: "list[tuple[int, int]]"
    ) -> GridCells:
        world_cells = []
        for cell in cells:
            world_cells.append(PathPlanner.grid_to_world(mapdata, cell))
        resolution = mapdata.info.resolution
        return GridCells(
            header=Header(frame_id="map"),
            cell_width=resolution,
            cell_height=resolution,
            cells=world_cells,
        )

    @staticmethod
    def calc_cspace(
        mapdata: OccupancyGrid, include_cells: bool
    ) -> "tuple[OccupancyGrid, Union[GridCells, None]]":
        """
        Calculates the C-Space, i.e., makes the obstacles in the map thicker.
        Publishes the list of cells that were added to the original map.
        :param mapdata [OccupancyGrid] The map data.
        :return        [OccupancyGrid] The C-Space.
        """
        PADDING = 5  # The number of cells around the obstacles

        # Create numpy grid from mapdata
        width = mapdata.info.width
        height = mapdata.info.height
        map = np.array(mapdata.data).reshape(width, height).astype(np.uint8)

        # Get mask of unknown areas
        unknown_area_mask = cv2.inRange(
            map, 255, 255
        )  # -1 overflows to 255 when cast to uint8
        kernel = np.ones((PADDING, PADDING), dtype=np.uint8)
        unknown_area_mask = cv2.erode(unknown_area_mask, kernel, iterations=1)

        # Change unknown areas to free space
        map[map == 255] = 0

        # Inflate the obstacles where necessary
        kernel = np.ones((PADDING, PADDING), np.uint8)
        obstacle_mask = cv2.dilate(map, kernel, iterations=1)
        cspace_data = cv2.bitwise_or(obstacle_mask, unknown_area_mask)
        cspace_data = np.array(cspace_data).reshape(width * height).tolist()

        # Return the C-space
        cspace = OccupancyGrid(
            header=mapdata.header, info=mapdata.info, data=cspace_data
        )

        # Return the cells that were added to the original map
        cspace_cells = None
        if include_cells:
            cells = []

            # Find the indices of the obstacle cells
            obstacle_indices = np.where(obstacle_mask > 0)

            # Convert the indices to cell coordinates and append them to cells
            for y, x in zip(*obstacle_indices):
                cells.append((x, y))

            cspace_cells = PathPlanner.get_grid_cells(mapdata, cells)

        return (cspace, cspace_cells)

    @staticmethod
    def get_cost_map_value(cost_map: np.ndarray, p: "tuple[int, int]") -> int:
        return cost_map[p[1]][p[0]]

    @staticmethod
    def show_map(name: str, map: np.ndarray):
        normalized = cv2.normalize(
            map, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8U
        )
        cv2.imshow(name, normalized)
        cv2.waitKey(0)

    @staticmethod
    def calc_cost_map(mapdata: OccupancyGrid) -> np.ndarray:
        rospy.loginfo("Calculating cost map")

        # Create numpy array from mapdata
        width = mapdata.info.width
        height = mapdata.info.height
        map = np.array(mapdata.data).reshape(height, width).astype(np.uint8)
        map[map == 255] = 100

        # Iteratively dilate the walls until no changes are made
        cost_map = np.zeros_like(map)
        dilated_map = map.copy()
        iterations = 0
        kernel = np.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]], np.uint8)
        while np.any(dilated_map == 0):
            # Increase iterations
            iterations += 1

            # Dilate the map
            next_dilated_map = cv2.dilate(dilated_map, kernel, iterations=1)

            # Get the difference between the next dilated map and the current one to get an outline
            difference = next_dilated_map - dilated_map

            # Assign all non-zero cells in the outline their cost
            difference[difference > 0] = iterations

            # Add the outline to the cost map
            cost_map = cv2.bitwise_or(cost_map, difference)

            # Update dilated map
            dilated_map = next_dilated_map

        # PathPlanner.show_map("wall_dilation", cost_map)

        # Turn the cost map into a mask of only the middle of the hallways
        # All cells that are not in the middle of the hallways will have a cost of 0
        # Cells that are in the middle of the hallways will have a cost of 1
        cost_map = PathPlanner.create_hallway_mask(mapdata, cost_map, iterations // 4)

        # PathPlanner.show_map("hallway_mask", cost_map)

        # Iteratively dilate the hallway mask until no changes are made
        dilated_map = cost_map.copy()
        cost = 1
        for i in range(iterations):
            # Increase cost
            cost += 1

            # Dilate the map
            next_dilated_map = cv2.dilate(dilated_map, kernel, iterations=1)

            # Get the difference between the next dilated map and the current one to get an outline
            difference = next_dilated_map - dilated_map

            # Assign all non-zero cells in the outline their cost
            difference[difference > 0] = cost

            # Add the outline to the cost map
            cost_map = cv2.bitwise_or(cost_map, difference)

            # Update dilated map
            dilated_map = next_dilated_map

        # Subtract 1 from all non-zero values in cost map
        cost_map[cost_map > 0] -= 1

        # PathPlanner.show_map("cost_map", cost_map)

        return cost_map

    @staticmethod
    def create_hallway_mask(
        mapdata: OccupancyGrid, cost_map: np.ndarray, threshold: int
    ) -> np.ndarray:
        """
        Create a mask of the cost_map that only contains cells that are hallway cells.
        """
        # Initialize the mask with the same shape as the cost_map and all values set to False
        mask = np.zeros_like(cost_map, dtype=bool)

        # Get the indices of the non-zero cells in the cost_map
        non_zero_indices = np.nonzero(cost_map)

        # Iterate over the non-zero cells in the cost_map
        for y, x in zip(*non_zero_indices):
            # If the cell is a hallway cell, set the corresponding cell in the mask to True
            if PathPlanner.is_hallway_cell(mapdata, cost_map, (x, y), threshold):
                mask[y][x] = 1

        return mask.astype(np.uint8)

    @staticmethod
    def is_hallway_cell(
        mapdata: OccupancyGrid,
        cost_map: np.ndarray,
        p: "tuple[int, int]",
        threshold: int,
    ) -> bool:
        """
        Determine whether a cell is a "hallway cell" meaning it has a cost
        greater than or equal to all of its neighbors
        """
        cost_map_value = PathPlanner.get_cost_map_value(cost_map, p)
        for neighbor in PathPlanner.neighbors_of_8(mapdata, p, False):
            neighbor_cost_map_value = PathPlanner.get_cost_map_value(cost_map, neighbor)
            if (
                neighbor_cost_map_value < threshold
                or neighbor_cost_map_value > cost_map_value
            ):
                return False
        return True

    @staticmethod
    def get_first_walkable_neighbor(
        mapdata, start: "tuple[int, int]"
    ) -> "tuple[int, int]":
        """
        Helper function for a_star that gets the first walkable neighbor from
        the start cell in case it is not already walkable
        :param mapdata [OccupancyGrid] The map data.
        :param padding [start]         The start cell.
        :return        [(int, int)]    The first walkable neighbor.
        """
        # Create queue for breadth-first search
        queue = []
        queue.append(start)

        # Initialize dictionary for keeping track of visited cells
        visited = {}

        while queue:
            current = queue.pop(0)
            if PathPlanner.is_cell_walkable(mapdata, current):
                return current

            for neighbor in PathPlanner.neighbors_of_4(mapdata, current, False):
                visited[neighbor] = True
                queue.append(neighbor)

        # If nothing found, just return original start cell
        return start

    @staticmethod
    def a_star(
        mapdata: OccupancyGrid,
        cost_map: np.ndarray,
        start: "tuple[int, int]",
        goal: "tuple[int, int]",
    ) -> "tuple[Union[list[tuple[int, int]], None], Union[float, None], tuple[int, int], tuple[int, int]]":
        COST_MAP_WEIGHT = 1000

        # If the start cell is not walkable, get the first walkable neighbor instead
        if not PathPlanner.is_cell_walkable(mapdata, start):
            start = PathPlanner.get_first_walkable_neighbor(mapdata, start)

        # Likewise, if the goal cell is not walkable, get the first walkable neighbor instead
        if not PathPlanner.is_cell_walkable(mapdata, goal):
            goal = PathPlanner.get_first_walkable_neighbor(mapdata, goal)

        pq = PriorityQueue()
        pq.put(start, 0)

        cost_so_far = {}
        distance_cost_so_far = {}
        cost_so_far[start] = 0
        distance_cost_so_far[start] = 0
        came_from = {}
        came_from[start] = None

        while not pq.empty():
            current = pq.get()

            if current == goal:
                break

            for neighbor, distance in PathPlanner.neighbors_and_distances_of_8(
                mapdata, current
            ):
                added_cost = (
                    distance
                    + COST_MAP_WEIGHT
                    * PathPlanner.get_cost_map_value(cost_map, neighbor)
                )
                new_cost = cost_so_far[current] + added_cost
                if not neighbor in cost_so_far or new_cost < cost_so_far[neighbor]:
                    cost_so_far[neighbor] = new_cost
                    distance_cost_so_far[neighbor] = (
                        distance_cost_so_far[current] + distance
                    )
                    priority = new_cost + PathPlanner.euclidean_distance(neighbor, goal)
                    pq.put(neighbor, priority)
                    came_from[neighbor] = current

        path = []
        cell = goal

        while cell:
            path.insert(0, cell)

            if cell in came_from:
                cell = came_from[cell]
            else:
                return (None, None, start, goal)

        # Prevent paths that are too short
        MIN_PATH_LENGTH = 12
        if len(path) < MIN_PATH_LENGTH:
            return (None, None, start, goal)

        # Truncate the last few poses of the path
        POSES_TO_TRUNCATE = 8
        path = path[:-POSES_TO_TRUNCATE]

        return (path, distance_cost_so_far[goal], start, goal)

    @staticmethod
    def path_to_message(mapdata: OccupancyGrid, path: "list[tuple[int, int]]") -> Path:
        """
        Takes a path on the grid and returns a Path message.
        :param path [[(int,int)]] The path on the grid (a list of tuples)
        :return     [Path]        A Path message (the coordinates are expressed in the world)
        """
        poses = PathPlanner.path_to_poses(mapdata, path)
        return Path(header=Header(frame_id="map"), poses=poses)
```

### pure_pursuit.py

ROS node that listens for a Path from the FrontierExploration node and follows it using [Pure Pursuit](https://www.ri.cmu.edu/pub_files/pub3/coulter_r_craig_1992_1/coulter_r_craig_1992_1.pdf).

```python
#!/usr/bin/env python3

import math
import rospy
import numpy as np
from path_planner import PathPlanner
from std_msgs.msg import Header, Bool
from nav_msgs.msg import Path, Odometry, GridCells, OccupancyGrid
from geometry_msgs.msg import Point, PointStamped, Twist, Vector3, Pose, Quaternion
from tf.transformations import euler_from_quaternion
from tf import TransformListener


class PurePursuit:
    def __init__(self):
        """
        Class constructor
        """
        rospy.init_node("pure_pursuit")

        # Set if in debug mode
        self.is_in_debug_mode = (
            rospy.has_param("~debug") and rospy.get_param("~debug") == "true"
        )

        # Publishers
        self.cmd_vel = rospy.Publisher("/cmd_vel", Twist, queue_size=10)
        self.lookahead_pub = rospy.Publisher(
            "/pure_pursuit/lookahead", PointStamped, queue_size=10
        )

        if self.is_in_debug_mode:
            self.fov_cells_pub = rospy.Publisher(
                "/pure_pursuit/fov_cells", GridCells, queue_size=100
            )
            self.close_wall_cells_pub = rospy.Publisher(
                "/pure_pursuit/close_wall_cells", GridCells, queue_size=100
            )

        # Subscribers
        rospy.Subscriber("/odom", Odometry, self.update_odometry)
        rospy.Subscriber("/map", OccupancyGrid, self.update_map)
        rospy.Subscriber("/pure_pursuit/path", Path, self.update_path)
        rospy.Subscriber("/pure_pursuit/enabled", Bool, self.update_enabled)

        # Pure pursuit parameters
        self.LOOKAHEAD_DISTANCE = 0.18  # m
        self.WHEEL_BASE = 0.16  # m
        self.MAX_DRIVE_SPEED = 0.1  # m/s
        self.MAX_TURN_SPEED = 1.25  # rad/s
        self.TURN_SPEED_KP = 1.25
        self.DISTANCE_TOLERANCE = 0.1  # m

        # Obstacle avoidance parameters
        self.OBSTACLE_AVOIDANCE_GAIN = 0.3
        self.OBSTACLE_AVOIDANCE_MAX_SLOW_DOWN_DISTANCE = 0.16  # m
        self.OBSTACLE_AVOIDANCE_MIN_SLOW_DOWN_DISTANCE = 0.12  # m
        self.OBSTACLE_AVOIDANCE_MIN_SLOW_DOWN_FACTOR = 0.25
        self.FOV = 200  # degrees
        self.FOV_DISTANCE = 25  # Number of grid cells
        self.FOV_DEADZONE = 80  # degrees
        self.SMALL_FOV = 300  # degrees
        self.SMALL_FOV_DISTANCE = 10  # Number of grid cells

        self.tf_listener = TransformListener()
        self.pose = None
        self.map = None
        self.path = Path()
        self.alpha = 0
        self.enabled = True
        self.reversed = False
        self.closest_distance = float("inf")

    def update_odometry(self, msg: Odometry):
        """
        Updates the current pose of the robot.
        """
        try:
            (trans, rot) = self.tf_listener.lookupTransform(
                "/map", "/base_footprint", rospy.Time(0)
            )
        except:
            return

        self.pose = Pose(
            position=Point(x=trans[0], y=trans[1]),
            orientation=Quaternion(x=rot[0], y=rot[1], z=rot[2], w=rot[3]),
        )

    def update_map(self, msg: OccupancyGrid):
        """
        Updates the current map.
        This method is a callback bound to a Subscriber.
        :param msg [OccupancyGrid] The current map information.
        """
        self.map = msg

    def update_path(self, msg: Path):
        self.path = msg

    def update_enabled(self, msg: Bool):
        self.enabled = msg.data

    def calculate_steering_adjustment(self) -> float:
        if self.pose is None or self.map is None:
            return 0

        orientation = self.pose.orientation
        roll, pitch, yaw = euler_from_quaternion(
            [orientation.x, orientation.y, orientation.z, orientation.w]
        )
        yaw = float(np.rad2deg(yaw))

        # Get the grid cell of the robot
        robot_cell = PathPlanner.world_to_grid(self.map, self.pose.position)

        weighted_sum_of_angles = 0
        total_weight = 0
        self.closest_distance = float("inf")

        # Get all wall cells near the robot within the distance
        fov_cells = []
        wall_cells = []
        wall_cell_count = 0
        for dx in range(-self.FOV_DISTANCE, self.FOV_DISTANCE + 1):
            for dy in range(-self.FOV_DISTANCE, self.FOV_DISTANCE + 1):
                cell = (robot_cell[0] + dx, robot_cell[1] + dy)
                distance = PathPlanner.euclidean_distance(robot_cell, cell)

                # If the cell is out of bounds, ignore it
                if not PathPlanner.is_cell_in_bounds(self.map, cell):
                    continue

                is_wall = not PathPlanner.is_cell_walkable(self.map, cell)
                if is_wall and distance < self.closest_distance:
                    self.closest_distance = distance

                # Calculate the angle of the cell relative to the robot
                angle = float(np.rad2deg(np.arctan2(dy, dx))) - yaw

                # If reversed, add 180 to the angle
                if self.reversed:
                    angle += 180

                # Keep angle in the range of -180 to 180
                if angle < -180:
                    angle += 360
                elif angle > 180:
                    angle -= 360

                # Ignore scans that are outside the field of view
                is_in_fov = (
                    distance <= self.FOV_DISTANCE
                    and angle >= -self.FOV / 2
                    and angle <= self.FOV / 2
                    and not abs(angle) < self.FOV_DEADZONE / 2
                )
                is_in_small_fov = (
                    distance <= self.SMALL_FOV_DISTANCE
                    and angle >= -self.SMALL_FOV / 2
                    and angle <= self.SMALL_FOV / 2
                )
                if not is_in_fov and not is_in_small_fov:
                    continue

                # If in debug mode, add the cell to the field of view
                if self.is_in_debug_mode:
                    fov_cells.append(cell)

                # If cell is not a wall, ignore it
                if not is_wall:
                    continue

                weight = 1 / (distance**2) if distance != 0 else 0

                weighted_sum_of_angles += weight * angle
                total_weight += weight

                wall_cell_count += 1

                if self.is_in_debug_mode:
                    wall_cells.append(cell)

        # If in debug mode, publish the wall cells
        if self.is_in_debug_mode:
            self.fov_cells_pub.publish(PathPlanner.get_grid_cells(self.map, fov_cells))
            self.close_wall_cells_pub.publish(
                PathPlanner.get_grid_cells(self.map, wall_cells)
            )

        if total_weight == 0:
            return 0

        # Calculate the average angle (weighted sum of angles divided by total weight)
        average_angle = weighted_sum_of_angles / total_weight

        # Calculate the steering adjustment based on the average angle
        steering_adjustment = (
            -self.OBSTACLE_AVOIDANCE_GAIN * average_angle / wall_cell_count
        )
        return steering_adjustment

    @staticmethod
    def distance(x0, y0, x1, y1) -> float:
        return math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2)

    def get_distance_to_waypoint_index(self, i: int) -> float:
        if self.pose is None or self.path.poses is None:
            return -1

        position = self.pose.position
        waypoint = self.path.poses[i].pose.position
        return PurePursuit.distance(position.x, position.y, waypoint.x, waypoint.y)

    def find_nearest_waypoint_index(self) -> int:
        nearest_waypoint_index = -1
        if self.path.poses is None:
            return nearest_waypoint_index

        closest_distance = float("inf")
        for i in range(len(self.path.poses) - 1):
            distance = self.get_distance_to_waypoint_index(i)
            if distance and distance < closest_distance:
                closest_distance = distance
                nearest_waypoint_index = i
        return nearest_waypoint_index

    def find_lookahead(self, nearest_waypoint_index, lookahead_distance) -> Point:
        if self.path.poses is None:
            return Point()

        i = nearest_waypoint_index
        while (
            i < len(self.path.poses)
            and self.get_distance_to_waypoint_index(i) < lookahead_distance
        ):
            i += 1
        return self.path.poses[i - 1].pose.position

    def get_goal(self) -> Point:
        if self.path.poses is None:
            return Point()

        poses = self.path.poses
        return poses[len(poses) - 1].pose.position

    def send_speed(self, linear_speed: float, angular_speed: float):
        """
        Sends the speeds to the motors.
        :param linear_speed  [float] [m/s]   The forward linear speed.
        :param angular_speed [float] [rad/s] The angular speed for rotating around the body center.
        """
        twist = Twist(linear=Vector3(x=linear_speed), angular=Vector3(z=angular_speed))
        self.cmd_vel.publish(twist)

    def stop(self):
        self.send_speed(0, 0)

    def run(self):
        rospy.sleep(5)

        while not rospy.is_shutdown():
            if self.pose is None:
                continue

            # If not enabled, do nothing
            if not self.enabled:
                continue

            # If no path, stop
            if self.path is None or not self.path.poses:
                self.stop()
                continue

            goal = self.get_goal()

            nearest_waypoint_index = self.find_nearest_waypoint_index()
            lookahead = self.find_lookahead(
                nearest_waypoint_index, self.LOOKAHEAD_DISTANCE
            )

            self.lookahead_pub.publish(
                PointStamped(header=Header(frame_id="map"), point=lookahead)
            )

            # Calculate alpha (angle between target and current position)
            position = self.pose.position
            orientation = self.pose.orientation
            roll, pitch, yaw = euler_from_quaternion(
                [orientation.x, orientation.y, orientation.z, orientation.w]
            )
            x = position.x
            y = position.y
            dx = lookahead.x - x
            dy = lookahead.y - y
            self.alpha = float(np.arctan2(dy, dx) - yaw)
            if self.alpha > np.pi:
                self.alpha -= 2 * np.pi
            elif self.alpha < -np.pi:
                self.alpha += 2 * np.pi

            # If the lookahead is behind the robot, follow the path backwards
            self.reversed = abs(self.alpha) > np.pi / 2

            # Calculate the lookahead distance and center of curvature
            lookahead_distance = PurePursuit.distance(x, y, lookahead.x, lookahead.y)
            radius_of_curvature = float(lookahead_distance / (2 * np.sin(self.alpha)))

            # Calculate drive speed
            drive_speed = (-1 if self.reversed else 1) * self.MAX_DRIVE_SPEED

            # Stop if at goal
            distance_to_goal = PurePursuit.distance(x, y, goal.x, goal.y)
            if distance_to_goal < self.DISTANCE_TOLERANCE:
                self.stop()
                continue

            # Calculate turn speed
            turn_speed = self.TURN_SPEED_KP * drive_speed / radius_of_curvature

            # Obstacle avoicance
            turn_speed += self.calculate_steering_adjustment()

            # Clamp turn speed
            turn_speed = max(-self.MAX_TURN_SPEED, min(self.MAX_TURN_SPEED, turn_speed))

            # Slow down if close to obstacle
            if self.closest_distance < self.OBSTACLE_AVOIDANCE_MAX_SLOW_DOWN_DISTANCE:
                drive_speed *= float(
                    np.interp(
                        self.closest_distance,
                        [
                            self.OBSTACLE_AVOIDANCE_MIN_SLOW_DOWN_DISTANCE,
                            self.OBSTACLE_AVOIDANCE_MAX_SLOW_DOWN_DISTANCE,
                        ],
                        [self.OBSTACLE_AVOIDANCE_MIN_SLOW_DOWN_FACTOR, 1],
                    )
                )

            # Send speed
            self.send_speed(drive_speed, turn_speed)


if __name__ == "__main__":
    PurePursuit().run()
```