import { Car } from "./car.ts";
import { getIntersection, lerp } from "./utils.ts";
import { ICoordinates } from "./types.ts";

export class Sensor {
  car: Car;
  rayCount: number = 5;
  rayLength: number = 100;
  raySpread = Math.PI / 2;
  rays: [ICoordinates, ICoordinates][] = [];
  sensorColor: string;
  readings: ({ x: number; y: number; offset: number } | null)[] = [];

  constructor(car: Car, sensorColor = "yellow") {
    this.car = car;
    this.sensorColor = sensorColor;
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1),
        ) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  update(roadBorders: [ICoordinates, ICoordinates][]) {
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders));
    }
  }

  #getReading(
    ray: [ICoordinates, ICoordinates],
    roadBorders: [ICoordinates, ICoordinates][],
  ) {
    let touches = [];
    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1],
      );
      if (touch) {
        touches.push(touch);
      }
    }

    if (touches.length === 0) {
      return null;
    }

    const offsets = touches.map((touch) => touch.offset);
    const minOffset = Math.min(...offsets);
    return touches[offsets.indexOf(minOffset)];
  }

  draw(ctx: CanvasRenderingContext2D) {
    let i = 0;
    for (let _ray of this.rays) {
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i]!;
      }
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.sensorColor;
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      i++;
    }
  }
}
