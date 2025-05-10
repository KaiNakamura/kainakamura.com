---
title: 'Stair Climbing Robot Dog'
description: 'A comprehensive framework for real-time stair climbing'
image: 'robot-dog/robot-dog.jpg'
preview: 'robot-dog/preview.gif'
media: 'https://www.youtube.com/embed/Pp7WCS7kTgM'
priority: 9
tags:
  - ROS
  - C++
links:
  - text: View Full Report
    href: /robot-dog/report.pdf
---

This project presents a **comprehensive framework for real-time stair climbing**. The major contributions can be broken down into three main parts:

- **Perception Pipeline:** LiDAR used for SLAM and elevation mapping, improving odometry, reducing drift
- **PACE:** Novel integration of terrain data into contact estimation
- **FPOWR:** Developed custom dynamic footstep planner

![System Pipeline](/robot-dog/pipeline.png)

## Perception Pipeline

The robot we're using is the Unitree Go1, but we upgraded it with some additional hardware upgrades:

- **Power supply** for untethered usage
- **Onboard computer** (Intel NUC i7) for running the system pipeline
- **3D LiDAR sensor** (Livox Mid-360) for sensing the environment

![Hardware Upgrades](/robot-dog/lidar-mount.png)

The LiDAR allows us to map the environment and keep track of the robot's location using a process called [SLAM](/project/slam-robot). But we also convert this data into an elevation map, which is then filtered and segmented into planes that represent areas where the robot can step.

![LiDAR Point Cloud Data and Steppable Planes](/robot-dog/long-trajectory.png)

## Perception-Aware Contact Estimation (PACE)

One unique advancement from our team is the use of terrain data to improve contact estimation, which we call **Perception-Aware Contact Estimation** or **PACE** for short. Normal contact estimation methods are capable of recognizing missteps or slips and adjusting accordingly. But with PACE, the robot can proactively make adjustments based on the anticipated terrain variations.

![Terrain Height Variances Around Foothold](/robot-dog/pace.png)

It works by calculating the variances of the terrain height where the robot's about to step. These variances are used to dynamically weight factors like foot height, force, and timing to determine probability of contact. This improves contact estimation which is especially important for ascending and descending stairs.

## Footstep Plan Optimizer for Walking Robots (FPOWR)

Lastly, our team also developed a custom footstep planner called **FPOWR** which stands for **Foostep Plan Optimizer for Walking Robots**. It's designed to generate foot placements dynamically as new terrain data is received. Footstep positions are extracted from a simplified trajectory optimizer and mapped onto the nearest steppable regions.

![FPOWR Example Trajectory and Footstep Plan](/robot-dog/fpowr.png)

Doing this, not only do we get a dynamic footstep plan, but we can also use the simplified trajectory as an initial guess into the robot's main control loop, speeding up computations.

## Final Thoughts

This project was created by Wyatt Harris, Adam Kalayjian, Sean Lendrum, Jared Morgan, Kai Nakamura, and Owen Sullivan.

Overall, our work offers valuable contributions in the field of legged robotics by enhancing the precision and reliability of navigating complex terrains.
