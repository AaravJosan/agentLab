const card = document.querySelector(".card");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const MAX_TILT = 12; // degrees

// Flip on click, tap, Enter or Space
function flip() {
  const flipped = card.classList.toggle("flipped");
  card.setAttribute("aria-pressed", flipped);
}

card.addEventListener("click", flip);
card.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    flip();
  }
});

// Tilt toward the pointer and move the shiny highlight with it
function tilt(event) {
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width; // 0 to 1
  const y = (event.clientY - rect.top) / rect.height;

  card.style.setProperty("--ry", `${(x - 0.5) * 2 * MAX_TILT}deg`);
  card.style.setProperty("--rx", `${(0.5 - y) * 2 * MAX_TILT}deg`);
  card.style.setProperty("--mx", `${x * 100}%`);
  card.style.setProperty("--my", `${y * 100}%`);
}

function resetTilt() {
  card.style.setProperty("--rx", "0deg");
  card.style.setProperty("--ry", "0deg");
}

if (!reduceMotion) {
  card.addEventListener("pointermove", tilt);
  card.addEventListener("pointerleave", resetTilt);
  card.addEventListener("pointerup", (event) => {
    // Touch has no hover, so settle the card after a tap
    if (event.pointerType === "touch") resetTilt();
  });
}
