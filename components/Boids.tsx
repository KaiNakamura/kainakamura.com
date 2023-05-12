"use client";

import { MouseMove, Setup, Update, useCanvas } from "@hooks/useCanvas";
import Cursor from "@util/Cursor";
import { useState } from "react";

const cursor = new Cursor();

const Boids = () => {
  const { canvasRef } = useCanvas(
    setup,
    update,
    onMouseMove,
    onMouseDown,
    onMouseUp
  );

  function setup({ context, canvas }: Setup) {
    cursor.setup({ context, canvas });
  }

  function update({ context, canvas }: Update) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    cursor.update({ context, canvas });
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

  return (
    <div className="boids absolute">
      <canvas ref={canvasRef} width={750} height={750} />
    </div>
  );
};

export default Boids;
