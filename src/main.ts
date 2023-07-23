import "./main.css";
import { Car } from "./car";
import { Road } from "./road";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 200;

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const road = new Road(canvas.width / 2, canvas.width * 0.9, 3);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);
car.draw(ctx);

animate();
function animate() {
  car.update(road.borders);
  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);

  road.draw(ctx);
  car.draw(ctx);

  ctx.restore();
  requestAnimationFrame(animate);
}
