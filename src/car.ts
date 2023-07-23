import { Controls } from "./controls.ts";
import { Sensor } from "./sensor.ts";
import { ICoordinates } from "./types.ts";

export class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  controls: Controls;
  speed: number = 0;
  acceleration: number = 0.2;
  maxSpeed: number = 5;
  friction: number = 0.05;
  angle: number = 0;
  sensor = new Sensor(this);

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.controls = new Controls();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.restore();
    this.sensor.draw(ctx);
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.backward) {
      this.speed -= this.acceleration;
    }

    this.speed = Math.min(this.speed, this.maxSpeed);
    this.speed = Math.max(this.speed, -this.maxSpeed / 2);

    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1;

      if (this.controls.left) {
        this.angle -= -0.03 * flip;
      }
      if (this.controls.right) {
        this.angle += -0.03 * flip;
      }
    }

    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }

    this.x -= this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);
  }

  update(roadBorders: [ICoordinates, ICoordinates][]) {
    this.#move();
    this.sensor.update(roadBorders);
  }
}
