/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/Post.js
class Post {
  constructor(parentEl, innerEl, date, coordinates) {
    this.parentEl = parentEl;
    this.innerEl = innerEl;
    this.date = date;
    this.coordinates = coordinates;
  }
  get markup() {
    return `
      <div class="post-box">
        <div class="circle"></div>
        <div class="date">${this.date}</div>
        <div class="inner"></div>
        <div class="coordinates">
          ${this.coordinates}
          <button type="button" class="eye-btn"></button>
        </div>
      </div>
    `;
  }
  render() {
    this.parentEl.insertAdjacentHTML("afterbegin", this.markup);
    const postBox = this.parentEl.firstElementChild;
    const innerContainer = postBox.querySelector(".inner");
    innerContainer.appendChild(this.innerEl);
    const dateElement = postBox.querySelector(".date");
    if (typeof this.date === "string") {
      dateElement.textContent = this.date;
    }
  }
}
;// CONCATENATED MODULE: ./src/js/getFormattedDate.js
function getFormattedDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
;// CONCATENATED MODULE: ./src/js/coordinates.js
async function findLocation() {
  if (!navigator.geolocation) {
    return "Ваш браузер не дружит с геолокацией...";
  } else {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(data => resolve(data), err => reject(err), {
          enableHighAccuracy: true
        });
      });
      const {
        latitude,
        longitude
      } = position.coords;
      return `[${latitude}, ${longitude}]`;
    } catch (err) {
      console.log(err);
    }
  }
}
;// CONCATENATED MODULE: ./src/js/validators.js
/* eslint-disable */
function isValidCoords(input) {
  input = input.toString().trim();
  input = input.replace(/[\[\]]/g, "");
  let parts = input.split(",").map(part => part.trim());
  if (parts.length !== 2) {
    return null;
  }
  let latitude = parseFloat(parts[0]);
  let longitude = parseFloat(parts[1]);
  if (isNaN(latitude) || isNaN(longitude)) {
    return null;
  }
  return `[${latitude}, ${longitude}]`;
}
;// CONCATENATED MODULE: ./src/js/ModalEnterGeolocation.js

class ModalEnterGeolocation {
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
    this.element.querySelector(".ok-btn").addEventListener("click", e => {
      e.preventDefault();
      this.onOk();
    });
    this.element.querySelector(".cancel-btn").addEventListener("click", e => {
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
;// CONCATENATED MODULE: ./src/js/Audio.js
class Audio {
  constructor(parentEl, btn) {
    this.btn = btn;
    this.parentEl = parentEl;
    this.element = null;
    this.recorder = null;
    this.chunks = [];
    this.audioPlayer = null;
    this.timer = null;
    this.seconds = 0;
    this.minutes = 0;
  }
  get markup() {
    return `
     <div class="audio-box">
          <button class="audio-ok">Ok</button>
          <div class="audio-timer">00:00</div>
          <button class="audio-close">X</button>
      </div>
      <audio class="audio"></audio>
      `;
  }
  render() {
    this.parentEl.insertAdjacentHTML("afterbegin", this.markup);
    this.element = this.parentEl.querySelector(".audio-box");
    this.audioPlayer = this.parentEl.querySelector(".audio");
    this.bindEvents();
    return this.element;
  }
  async startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });
    this.recorder = new MediaRecorder(stream);
    this.chunks = [];
    this.recorder.addEventListener("start", () => {
      console.log("Recorder started");
    });
    this.recorder.addEventListener("dataavailable", event => {
      this.chunks.push(event.data);
    });
    this.recorder.addEventListener("stop", () => {
      const blob = new Blob(this.chunks);
      this.audioPlayer.src = URL.createObjectURL(blob);
    });
    this.recorder.start();
  }
  startTimer() {
    const timerElement = this.element.querySelector(".audio-timer");
    this.seconds = 0;
    this.minutes = 0;
    this.timer = setInterval(() => {
      this.seconds += 1;
      if (this.seconds === 60) {
        this.minutes += 1;
        this.seconds = 0;
      }
      timerElement.textContent = String(this.minutes).padStart(2, "0") + ":" + String(this.seconds).padStart(2, "0");
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.timer);
  }
  bindEvents() {
    const ok = this.element.querySelector(".audio-ok");
    const close = this.element.querySelector(".audio-close");
    ok.addEventListener("click", e => {
      e.preventDefault();
      if (this.recorder) {
        this.recorder.stop();
        this.stopTimer();
        console.log("click - ok");
      }
    });
    close.addEventListener("click", () => {
      if (this.element) {
        this.element.remove();
      }
    });
  }
  close() {
    this.element.remove();
  }
}
;// CONCATENATED MODULE: ./src/js/Timeline.js





class Timeline {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.history = null;
    this.audioBtn = null;
    this.videoBtn = null;
    this.form = null;
    this.audioEl = null;
    this.audioTag = null;
  }
  bindToDOM() {
    this.render();
    this.subscribeOnEvent();
  }
  static get markup() {
    return `
    <div class="timeline-container">
        <div class="line"></div>
        <div class="history"></div>
        <form>
            <textarea name="textarea" class="textarea"></textarea>
            <button class="audio-btn"></button>
            <button class="video-btn"></button>
        </form>
    </div>
      `;
  }
  render() {
    this.parentEl.insertAdjacentHTML("beforeend", Timeline.markup);
    this.history = this.parentEl.querySelector(".history");
  }
  subscribeOnEvent() {
    this.audioBtn = this.parentEl.querySelector(".audio-btn");
    this.videoBtn = this.parentEl.querySelector(".video-btn");
    this.textarea = this.parentEl.querySelector(".textarea");
    this.audioBtn.addEventListener("click", e => this.startRecording(e));
    this.textarea.addEventListener("keydown", e => this.publishTextPost(e));
  }
  startRecording(event) {
    event.preventDefault();
    this.audio = new Audio(this.parentEl, this.audioBtn);
    this.audioEl = this.audio.render();
    this.audio.startRecording();
    this.audio.startTimer();
    this.textarea.insertAdjacentElement("afterend", this.audioEl);
    this.audioBtn.classList.add("hidden");
    this.videoBtn.classList.add("hidden");
    const ok = this.parentEl.querySelector(".audio-ok");
    ok.addEventListener("click", () => this.publishAudioPost());
    const close = this.parentEl.querySelector(".audio-close");
    close.addEventListener("click", () => {
      this.audioBtn.classList.remove("hidden");
      this.videoBtn.classList.remove("hidden");
    });
  }
  async publishAudioPost() {
    const audioBox = this.parentEl.querySelector(".audio-box");
    audioBox.remove();
    const {
      date,
      coords
    } = await this.addInfo();
    if (coords) {
      this.createAudioPost(date, coords);
    }
    this.audioBtn.classList.remove("hidden");
    this.videoBtn.classList.remove("hidden");
  }
  createAudioPost(date, coords) {
    this.audioTag = this.parentEl.querySelector(".audio");
    this.audioTag.setAttribute("controls", "");
    console.log(this.audioEl);
    const post = new Post(this.history, this.audioTag, date, coords);
    post.render();
  }
  async publishTextPost(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const {
        date,
        coords
      } = await this.addInfo();
      if (coords) {
        this.createTextPost(date, coords);
      }
      this.textarea.value = "";
      return;
    }
  }
  async addInfo() {
    const date = getFormattedDate();
    let coords = await findLocation();
    if (!coords) {
      coords = await this.enterGeolocation();
    }
    return {
      date,
      coords
    };
  }
  createTextPost(date, coords) {
    this.history = this.parentEl.querySelector(".history");
    const input = this.textarea.value;
    const text = document.createElement("p");
    text.textContent = input;
    const post = new Post(this.history, text, date, coords);
    post.render();
  }
  enterGeolocation() {
    return new Promise(resolve => {
      const modal = new ModalEnterGeolocation(this.parentEl);
      modal.render();
      modal.element.querySelector(".ok-btn").addEventListener("click", () => {
        const coords = modal.getCoords();
        if (coords) {
          resolve(coords);
        }
      });
      modal.element.querySelector(".cancel-btn").addEventListener("click", () => {
        resolve(null);
      });
    });
  }
}
;// CONCATENATED MODULE: ./src/js/app.js

const container = document.querySelector(".container");
const timeline = new Timeline(container);
timeline.bindToDOM();
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;