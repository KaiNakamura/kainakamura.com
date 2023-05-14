import Canvas from "@util/Canvas";
import Point from "@util/Point";
import { useEffect, useRef } from "react";
import { useInterval } from "usehooks-ts";

export interface Setup {
  context: CanvasRenderingContext2D;
  canvas: Canvas;
}

export interface Update {
  context: CanvasRenderingContext2D;
  canvas: Canvas;
}

export interface MouseMove {
  context: CanvasRenderingContext2D;
  canvas: Canvas;
  point: Point;
}

export const useCanvas = (
  setup: ({ context }: Setup) => void,
  update: ({ context }: Update) => void,
  onMouseMove: ({ context, point }: MouseMove) => void,
  onMouseDown: () => void,
  onMouseUp: () => void,
  onResize: (width: number, height: number) => void
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasParentRef = useRef<HTMLDivElement>(null);

  const getContext = (): CanvasRenderingContext2D | null => {
    return canvasRef.current ? canvasRef.current.getContext("2d") : null;
  };

  const getCanvas = (): Canvas | null => {
    return canvasRef.current
      ? { width: canvasRef.current.width, height: canvasRef.current.height }
      : null;
  };

  const resize = () => {
    const canvasParent = canvasParentRef.current;
    if (canvasParent) {
      onResize(canvasParent.clientWidth, canvasParent.clientHeight);
    }
  };

  useEffect(() => {
    const context = getContext();
    const canvas = getCanvas();
    if (context && canvas) {
      resize();
      setup({ context, canvas });
    }
  }, [false]);

  useInterval(() => {
    const context = getContext();
    const canvas = getCanvas();
    if (context && canvas) {
      update({ context, canvas });
    }
  }, 20);

  useEffect(() => {
    const mouseMoveHandler = (e: MouseEvent) => {
      const context = getContext();
      const canvas = getCanvas();
      const point = getMouseEventPoint(e);
      if (context && canvas && point) {
        onMouseMove({ context, canvas, point });
      }
    };

    const getMouseEventPoint = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        return { x, y };
      }
    };

    const touchStartHandler = (e: TouchEvent) => {
      const context = getContext();
      const canvas = getCanvas();
      const point = getTouchEventPoint(e);
      if (context && canvas && point) {
        onMouseDown();
        onMouseMove({ context, canvas, point });
      }
    };

    const touchMoveHandler = (e: TouchEvent) => {
      const context = getContext();
      const canvas = getCanvas();
      const point = getTouchEventPoint(e);
      if (context && canvas && point) {
        onMouseMove({ context, canvas, point });
      }
    };

    const getTouchEventPoint = (e: TouchEvent) => {
      const canvas = canvasRef.current;
      if (canvas && e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;

        return { x, y };
      }
    };

    // Add event listeners
    window.addEventListener("mousemove", mouseMoveHandler);
    canvasRef.current?.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", touchMoveHandler);
    canvasRef.current?.addEventListener("touchstart", touchStartHandler);
    window.addEventListener("touchend", onMouseUp);
    window.addEventListener("resize", resize);

    // Remove event listeners
    return () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
      canvasRef.current?.removeEventListener("mousedown", mouseMoveHandler);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", touchMoveHandler);
      canvasRef.current?.removeEventListener("touchstart", touchStartHandler);
      window.removeEventListener("touchend", onMouseUp);
      window.removeEventListener("resize", resize);
    };
  }, [onMouseMove]);

  return { canvasRef, canvasParentRef };
};
