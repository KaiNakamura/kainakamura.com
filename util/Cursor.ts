import { MouseMove, Update } from '@hooks/useCanvas';
import Vector from '@util/Vector';
import isMobile from '@util/isMobile';

export const CURSOR_RADIUS = 100;
const ANIMATION_FRAMES = 12.0;

export default class Cursor {
  position: Vector;
  mouseDown: boolean;
  animationFrame: number;

  constructor() {
    // Start cursor off canvas
    this.position = new Vector(-CURSOR_RADIUS, -CURSOR_RADIUS);

    this.mouseDown = false;

    this.animationFrame = 0;
  }

  update({ context }: Update) {
    this.updatePositionIfMobile();

    if (this.mouseDown && this.animationFrame < ANIMATION_FRAMES) {
      this.animationFrame++;
    } else if (!this.mouseDown && this.animationFrame > 0) {
      this.animationFrame--;
    }

    let ease = this.easeInOutQuad();
    let r = CURSOR_RADIUS / 8.0 + 2 * ease;
    let endAngle = 2 * Math.PI;

    context.strokeStyle = '#646464';
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(
      this.position.x,
      this.position.y,
      CURSOR_RADIUS - ease,
      0,
      endAngle
    );
    context.stroke();

    context.fillStyle = '#646464';
    context.beginPath();
    context.ellipse(this.position.x, this.position.y, r, r, 0, 0, endAngle);
    context.fill();
  }

  onMouseMove({ point }: MouseMove) {
    this.position.set(point.x, point.y);
  }

  onMouseDown() {
    this.mouseDown = true;
  }

  onMouseUp() {
    this.mouseDown = false;
  }

  updatePositionIfMobile() {
    if (isMobile() && !this.mouseDown) {
      this.position.set(-CURSOR_RADIUS, -CURSOR_RADIUS);
    }
  }

  easeInOutQuad(): number {
    let t = this.animationFrame / ANIMATION_FRAMES;
    return (
      (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2) * ANIMATION_FRAMES
    );
  }
}
