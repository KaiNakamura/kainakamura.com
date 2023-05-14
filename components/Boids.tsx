"use client";

import { MouseMove, Setup, Update, useCanvas } from "@hooks/useCanvas";
import Boid from "@util/Boid";
import Cursor from "@util/Cursor";

const NUM_BOIDS = 80;

const cursor = new Cursor();
const boids = new Array<Boid>(NUM_BOIDS);

let hasSetup = false;

const Boids = () => {
  const { canvasRef, canvasParentRef } = useCanvas(
    setup,
    update,
    onMouseMove,
    onMouseDown,
    onMouseUp,
    onResize
  );

  function setup({ context, canvas }: Setup) {
    if (!hasSetup) {
      console.log("setup");
      for (let i = 0; i < NUM_BOIDS; i++) {
        boids[i] = new Boid();
      }
      boids.forEach((boid) => boid.setup({ context, canvas }));
      hasSetup = true;
    }
  }

  function update({ context, canvas }: Update) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    cursor.update({ context, canvas });
    boids.forEach((boid) => boid.flock(boids, cursor));
    boids.forEach((boid) => boid.update({ context, canvas }));
  }

  function onMouseMove({ context, canvas, point }: MouseMove) {
    cursor.onMouseMove({ context, canvas, point });
  }

  function onMouseDown() {
    cursor.onMouseDown();
  }

  function onMouseUp() {
    cursor.onMouseUp();
  }

  function onResize(width: number, height: number) {
    console.log("Resize:", width, height);
    canvasRef.current?.setAttribute("width", width.toString());
    canvasRef.current?.setAttribute("height", height.toString());
  }

  return (
    <div ref={canvasParentRef} className="boids absolute w-full h-full">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Boids;
