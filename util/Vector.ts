export default class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy(): Vector {
    return new Vector(this.x, this.y);
  }

  set(x: number, y: number): Vector {
    this.x = x;
    this.y = y;
    return this;
  }

  add(other: Vector): Vector {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  sub(other: Vector): Vector {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  scale(scale: number): Vector {
    this.x *= scale;
    this.y *= scale;
    return this;
  }

  div(div: number): Vector {
    this.x /= div;
    this.y /= div;
    return this;
  }

  dot(other: Vector): number {
    return this.x * other.x + this.y * other.y;
  }

  cross(other: Vector): number {
    return this.x * other.y - this.y * other.x;
  }

  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vector {
    this.x /= this.mag();
    this.y /= this.mag();
    return this;
  }

  limit(limit: number): Vector {
    let magnitude = this.mag();
    if (magnitude > limit) {
      this.x /= magnitude;
      this.y /= magnitude;
    }
    return this;
  }

  setMag(mag: number): Vector {
    let oldMag = this.mag();
    this.x = (this.x * mag) / oldMag;
    this.y = (this.y * mag) / oldMag;
    return this;
  }

  dist(other: Vector): number {
    let dx = other.x - this.x;
    let dy = other.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  lerp(other: Vector, t: number) {
    this.scale(t).add(other.copy().scale(1 - t));
    return this;
  }
}
