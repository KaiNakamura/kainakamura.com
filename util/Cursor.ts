import { MouseMove, Setup, Update } from "@hooks/useCanvas";
import Point from "@util/Point";

const ANIMATION_FRAMES = 12.0;
const RADIUS = 100;

export default class Cursor {
  position: Point;
  mouseDown: boolean;
  animationFrame: number;

  constructor() {
    // Start cursor off canvas
    this.position = { x: -RADIUS, y: -RADIUS };

    this.mouseDown = false;

    this.animationFrame = 0;
  }

  setup({ context }: Setup) {}

  update({ context }: Update) {
    if (this.mouseDown && this.animationFrame < ANIMATION_FRAMES) {
      this.animationFrame++;
    } else if (!this.mouseDown && this.animationFrame > 0) {
      this.animationFrame--;
    }

    let position = this.getPosition();
    let ease = this.easeInOutQuad();
    let r = RADIUS / 8.0 + 2 * ease;
    let endAngle = 2 * Math.PI;

    context.strokeStyle = "#646464";
    context.fillStyle = "rgba(0, 0, 0, 0)";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(position.x, position.y, RADIUS - ease, 0, endAngle);
    context.stroke();

    context.fillStyle = "#646464";
    context.beginPath();
    context.ellipse(position.x, position.y, r, r, 0, 0, endAngle);
    context.fill();
  }

  onMouseMove({ point }: MouseMove) {
    this.position = point;
  }

  onMouseDown() {
    this.mouseDown = true;
  }

  onMouseUp() {
    this.mouseDown = false;
  }

  getPosition(): Point {
    const isMobile = () => {
      const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
      ];

      return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
      });
    };

    if (isMobile() && !this.mouseDown) {
      return { x: -RADIUS, y: -RADIUS };
    } else {
      return this.position;
    }
  }

  easeInOutQuad(): number {
    let t = this.animationFrame / ANIMATION_FRAMES;
    return (
      (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2) * ANIMATION_FRAMES
    );
  }
}
