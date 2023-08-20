import { Setup, Update } from '@hooks/useCanvas';
import Vector from '@util/Vector';
import Canvas from '@util/Canvas';
import Cursor, { CURSOR_RADIUS } from '@util/Cursor';

const PERCEPTION_RADIUS = 75;
const ALIGNMENT_STRENGTH = 1.2;
const COHESION_STRENGTH = 0.8;
const SEPARATION_STRENGTH = 1.0;
const MAX_ACCELERATION = 0.4;
const MAX_SPEED = 3;
const BOID_SIZE = 20;

export default class Boid {
  position: Vector;
  velocity: Vector;
  acceleration: Vector;
  heading: Vector;
  size: number;

  constructor() {
    this.position = new Vector(0, 0);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.heading = new Vector(0, 0);
    this.size = BOID_SIZE;
  }

  setup({ canvas }: Setup) {
    this.position.set(
      Math.random() * canvas.width,
      Math.random() * canvas.height
    );
    this.velocity.set(Math.random(), Math.random());
  }

  update({ context, canvas }: Update) {
    this.position.add(this.velocity);
    this.acceleration.limit(MAX_ACCELERATION);
    this.velocity.add(this.acceleration);
    this.velocity.limit(MAX_SPEED);
    this.acceleration.set(0, 0);
    this.wrapAroundEdges(canvas);

    this.heading.lerp(this.velocity.copy().normalize(), 0.8).normalize();

    context.strokeStyle = '#646464';
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(
      this.position.x + this.size * this.heading.x,
      this.position.y + this.size * this.heading.y
    );
    context.lineTo(
      this.position.x - (this.size * this.heading.y) / 3.0,
      this.position.y + (this.size * this.heading.x) / 3.0
    );
    context.lineTo(
      this.position.x + (this.size * this.heading.y) / 3.0,
      this.position.y - (this.size * this.heading.x) / 3.0
    );
    context.lineTo(
      this.position.x + this.size * this.heading.x,
      this.position.y + this.size * this.heading.y
    );
    context.stroke();
  }

  flock(boids: Array<Boid>, cursor: Cursor) {
    let alignment = new Vector(0, 0);
    let cohesion = new Vector(0, 0);
    let separation = new Vector(0, 0);
    let total = 0;
    let cursorDistance = this.position.dist(cursor.position);
    if (cursorDistance < CURSOR_RADIUS && cursorDistance > 0) {
      if (cursor.mouseDown) {
        cohesion.add(cursor.position);
        cohesion.sub(this.position);
      } else {
        let difference = this.position.copy().sub(cursor.position);
        difference.div(cursorDistance);
        separation.add(difference);
      }
    } else {
      boids.forEach((other) => {
        let distance = this.position.dist(other.position);
        if (other !== this && distance < PERCEPTION_RADIUS && distance > 0) {
          alignment.add(other.velocity);
          cohesion.add(other.position);
          let difference = this.position.copy().sub(other.position);
          difference.div(distance);
          separation.add(difference);
          total++;
        }
      });
    }
    if (total > 0) {
      alignment.setMag(MAX_SPEED);
      alignment.sub(this.velocity);
      alignment.limit(MAX_ACCELERATION);
      alignment.scale(ALIGNMENT_STRENGTH);

      cohesion.div(total);
      cohesion.sub(this.position);
      cohesion.setMag(MAX_SPEED);
      cohesion.sub(this.velocity);
      cohesion.limit(MAX_ACCELERATION);
      cohesion.scale(COHESION_STRENGTH);

      separation.div(total);
      separation.setMag(MAX_SPEED);
      separation.sub(this.velocity);
      separation.limit(MAX_ACCELERATION);
      separation.scale(SEPARATION_STRENGTH);
    }

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  wrapAroundEdges(canvas: Canvas) {
    if (this.position.x > canvas.width + this.size) {
      this.position.x = -this.size;
    } else if (this.position.x < -this.size) {
      this.position.x = canvas.width + this.size;
    }

    if (this.position.y > canvas.height + this.size) {
      this.position.y = -this.size;
    } else if (this.position.y < -this.size) {
      this.position.y = canvas.height + this.size;
    }
  }
}
