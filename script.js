// Theme: saved choice, else system preference
const root = document.documentElement;
const savedTheme = (() => {
  try { return localStorage.getItem("theme"); } catch { return null; }
})();
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
root.dataset.theme = savedTheme || (prefersDark ? "dark" : "light");

document.querySelector(".theme-toggle").addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch { /* storage unavailable */ }
});

// Mobile menu
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// Typing effect in the hero
const typed = document.querySelector(".typed");
const words = typed.dataset.words.split(",");
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const word = words[wordIndex];
  charIndex += deleting ? -1 : 1;
  typed.textContent = word.slice(0, charIndex);

  let delay = deleting ? 50 : 100;
  if (!deleting && charIndex === word.length) {
    deleting = true;
    delay = 1600;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 400;
  }
  setTimeout(type, delay);
}
type();

// Reveal sections on scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Highlight the nav link for the section in view
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`)
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("section[id]").forEach((s) => sectionObserver.observe(s));

// Project filters
const filterButtons = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".card");

filterButtons.forEach((button) =>
  button.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    cards.forEach((card) =>
      card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter)
    );
  })
);

// Contact form validation (front end only; nothing is sent)
const form = document.querySelector(".contact-form");
const status = form.querySelector(".form-status");

function validateField(input) {
  const field = input.closest(".field");
  const error = field.querySelector(".error");
  let message = "";

  if (!input.value.trim()) {
    message = "This field is required.";
  } else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
    message = "Please enter a valid email.";
  }

  field.classList.toggle("invalid", Boolean(message));
  error.textContent = message;
  return !message;
}

form.querySelectorAll("input, textarea").forEach((input) =>
  input.addEventListener("blur", () => validateField(input))
);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputs = [...form.querySelectorAll("input, textarea")];
  const allValid = inputs.map(validateField).every(Boolean);
  if (!allValid) {
    status.textContent = "";
    return;
  }
  // form.name is the form's own name attribute, so look the input up by id
  const name = form.querySelector("#name").value.trim();
  status.textContent = `Thanks, ${name}! Your message has been noted.`;
  form.reset();
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
