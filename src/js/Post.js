export class Post {
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
