import { Post } from "./Post";
import { getFormattedDate } from "./getFormattedDate";
import { findLocation } from "./coordinates";
import { ModalEnterGeolocation } from "./modalEnterGeolocation";
import { Audio } from "./Audio";

export class Timeline {
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
    this.audioBtn.addEventListener("click", (e) => this.startRecording(e));
    this.textarea.addEventListener("keydown", (e) => this.publishTextPost(e));
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
    const { date, coords } = await this.addInfo();
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
      const { date, coords } = await this.addInfo();
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
    return { date, coords };
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
    return new Promise((resolve) => {
      const modal = new ModalEnterGeolocation(this.parentEl);
      modal.render();

      modal.element.querySelector(".ok-btn").addEventListener("click", () => {
        const coords = modal.getCoords();
        if (coords) {
          resolve(coords);
        }
      });

      modal.element
        .querySelector(".cancel-btn")
        .addEventListener("click", () => {
          resolve(null);
        });
    });
  }
}
