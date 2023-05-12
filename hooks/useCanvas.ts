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
  onMouseUp: () => void
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getContext = (): CanvasRenderingContext2D | null => {
    return canvasRef.current ? canvasRef.current.getContext("2d") : null;
  };

  const getCanvas = (): Canvas | null => {
    return canvasRef.current
      ? { width: canvasRef.current.width, height: canvasRef.current.height }
      : null;
  };

  useEffect(() => {
    const context = getContext();
    const canvas = getCanvas();
    if (context && canvas) {
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
    const handler = (e: MouseEvent) => {
      const context = getContext();
      const canvas = getCanvas();
      const point = getCanvasPoint(e);
      if (context && canvas && point) {
        onMouseMove({ context, canvas, point });
      }
    };

    const getCanvasPoint = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return null;
      }

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return { x, y };
    };

    // Add event listeners
    canvasRef.current?.addEventListener("mousemove", handler);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Remove event listeners
    return () => {
      canvasRef.current?.removeEventListener("mousemove", handler);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove]);

  return { canvasRef };
};
