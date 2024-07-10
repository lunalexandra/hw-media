import { Timeline } from "./Timeline";

const container = document.querySelector(".container");

const timeline = new Timeline(container);

timeline.bindToDOM();
