export class Audio {
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
      audio: true,
    });
    this.recorder = new MediaRecorder(stream);
    this.chunks = [];

    this.recorder.addEventListener("start", () => {
      console.log("Recorder started");
    });

    this.recorder.addEventListener("dataavailable", (event) => {
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
      timerElement.textContent =
        String(this.minutes).padStart(2, "0") +
        ":" +
        String(this.seconds).padStart(2, "0");
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  bindEvents() {
    const ok = this.element.querySelector(".audio-ok");
    const close = this.element.querySelector(".audio-close");

    ok.addEventListener("click", (e) => {
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
