export class Controls {
  forward: boolean = false;
  backward: boolean = false;
  left: boolean = false;
  right: boolean = false;

  constructor() {
    this.#addKeyboardListeners();
  }

  #addKeyboardListeners() {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "w":
        case "ArrowUp":
          this.forward = true;
          break;
        case "s":
        case "ArrowDown":
          this.backward = true;
          break;
        case "a":
        case "ArrowLeft":
          this.left = true;
          break;
        case "d":
        case "ArrowRight":
          this.right = true;
          break;
      }
    });

    document.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "w":
        case "ArrowUp":
          this.forward = false;
          break;
        case "s":
        case "ArrowDown":
          this.backward = false;
          break;
        case "a":
        case "ArrowLeft":
          this.left = false;
          break;
        case "d":
        case "ArrowRight":
          this.right = false;
          break;
      }
    });
  }
}
