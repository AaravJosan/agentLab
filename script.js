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

// ---------------------------------------------------------------
// Battle!
// Your power = the average of the stat numbers on your card.
// Each side rolls a 50-sided die and adds it to their power.
// Whoever has the bigger total wins.
// ---------------------------------------------------------------

// Grab the pieces of the page we need to change
const battleButton = document.querySelector(".battle-btn");
const arena = document.querySelector(".arena");
const playerName = document.getElementById("player-name");
const playerRoll = document.getElementById("player-roll");
const playerDetail = document.getElementById("player-detail");
const opponentName = document.getElementById("opponent-name");
const opponentRoll = document.getElementById("opponent-roll");
const opponentDetail = document.getElementById("opponent-detail");
const winnerText = document.getElementById("winner");

// Possible opponents and how strong each one is
const opponents = [
  { name: "Final Exam", power: 70 },
  { name: "Merge Conflict Monster", power: 60 },
  { name: "8 a.m. Lecture", power: 55 },
  { name: "Infinite Loop", power: 65 },
  { name: "Segfault", power: 75 },
  { name: "Null Pointer", power: 68 },
  { name: "Off-by-One Error", power: 50 },
  { name: "Group Project Ghost", power: 45 },
  { name: "Printer Out of Toner", power: 40 },
  { name: "Wi-Fi Dead Zone", power: 58 },
  { name: "Midterm Curve", power: 80 },
  { name: "Mystery Dining Hall Meal", power: 52 },
  { name: "Parking Ticket", power: 62 },
  { name: "Unsaved Homework", power: 85 },
];

const ROLL_TIME = 1200; // how long the dice spin, in milliseconds

// Roll a die with 50 sides: a whole number from 1 to 50
function rollDie() {
  return Math.floor(Math.random() * 50) + 1;
}

// Read the stat numbers from the card and return their average
function getMyPower() {
  const statNumbers = document.querySelectorAll(".stats em");
  let total = 0;
  statNumbers.forEach((stat) => {
    total += Number(stat.textContent);
  });
  return Math.round(total / statNumbers.length);
}

// Use the first word of the name on the card, e.g. "Aarav"
const firstName = document.querySelector(".name").textContent.split(" ")[0];

// true while the dice are spinning, so extra clicks are ignored
let isRolling = false;

battleButton.addEventListener("click", () => {
  // Already rolling? Do nothing until this battle finishes
  if (isRolling) return;
  isRolling = true;

  // Pick a random opponent from the list
  const opponent = opponents[Math.floor(Math.random() * opponents.length)];
  const myPower = getMyPower();

  // Lock the button and show that it's busy
  battleButton.disabled = true;
  battleButton.textContent = "🎲 Rolling…";

  // Set up the arena and start the dice spinning
  arena.hidden = false;
  arena.classList.add("rolling");
  playerName.textContent = firstName;
  opponentName.textContent = opponent.name;
  playerDetail.textContent = `Power ${myPower} + 🎲 ?`;
  opponentDetail.textContent = `Power ${opponent.power} + 🎲 ?`;
  winnerText.textContent = "";
  winnerText.classList.remove("show", "lose");

  // Flash random numbers every 60ms so it feels like dice rolling
  const flashing = setInterval(() => {
    playerRoll.textContent = rollDie();
    opponentRoll.textContent = rollDie();
  }, 60);

  // After ROLL_TIME, stop the dice and show the real result
  setTimeout(() => {
    clearInterval(flashing);
    arena.classList.remove("rolling");

    const myRoll = rollDie();
    const theirRoll = rollDie();
    const myTotal = myPower + myRoll;
    const theirTotal = opponent.power + theirRoll;

    playerRoll.textContent = myTotal;
    opponentRoll.textContent = theirTotal;
    playerDetail.textContent = `Power ${myPower} + 🎲 ${myRoll}`;
    opponentDetail.textContent = `Power ${opponent.power} + 🎲 ${theirRoll}`;

    // Decide who won
    if (myTotal > theirTotal) {
      winnerText.textContent = `${firstName.toUpperCase()} WINS!`;
    } else if (myTotal < theirTotal) {
      winnerText.textContent = `${opponent.name.toUpperCase()} WINS!`;
      winnerText.classList.add("lose");
    } else {
      winnerText.textContent = "IT'S A TIE!";
    }

    // Reading offsetWidth makes the browser restart the pop animation
    void winnerText.offsetWidth;
    winnerText.classList.add("show");

    // Unlock the button for the next battle
    isRolling = false;
    battleButton.disabled = false;
    battleButton.textContent = "⚔️ Battle again!";
  }, ROLL_TIME);
});
