export class Vector2d {
  constructor(public x: number, public y: number) {}

  add(vector: Vector2d): Vector2d {
    return new Vector2d(this.x + vector.x, this.y + vector.y);
  }

  multiply(scalar: number): Vector2d {
    return new Vector2d(this.x * scalar, this.y * scalar);
  }
}
