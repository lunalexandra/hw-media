import { isValidCoords } from "./validators";

export class ModalEnterGeolocation {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }

  get markup() {
    return `
     <div class="modal">
                <div class="modal-header">Что-то пошло не так</div>
                <div class="form-body">К сожалению, нам не удалось определить ваше местоположение, пожалуйста, дайте разрешение на использование геолокации, либо введите коррдинаты вручную</div>
                <label for="input-coords">Широта и долгота через запятую</label>
                <input name="input-coords" class="input-coords"></input>
                <div class="form-buttons">
                  <button class="modal-btn cancel-btn">Отмена</button>
                  <button class="modal-btn ok-btn">Ok</button>
                </div>
      </div>
      `;
  }

  render() {
    this.parentEl.insertAdjacentHTML("beforeend", this.markup);
    this.element = this.parentEl.querySelector(".modal");
    this.bindEvents();
  }

  bindEvents() {
    const input = this.element.querySelector(".input-coords");

    input.addEventListener("focus", () => {
      input.value = "";
      input.style.outline = "";
    });

    this.element.querySelector(".ok-btn").addEventListener("click", (e) => {
      e.preventDefault();
      this.onOk();
    });

    this.element.querySelector(".cancel-btn").addEventListener("click", (e) => {
      e.preventDefault();
      this.onCancel();
    });
  }

  getCoords() {
    const input = this.element.querySelector(".input-coords");
    try {
      const coords = isValidCoords(input.value);
      if (!coords) {
        throw new Error("Invalid coordinates format");
      }
      return coords;
    } catch (error) {
      input.style.outline = "3px solid lightblue";
      input.value = error.message;
      return null;
    }
  }

  onOk() {
    const coords = this.getCoords();
    if (coords) {
      this.close();
      return coords;
    }
  }

  onCancel() {
    this.close();
  }

  close() {
    this.element.remove();
  }
}
