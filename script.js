const words = {
  Animals: ["elephant", "giraffe", "alligator", "penguin", "kangaroo"],
  Programming: ["javascript", "typescript", "algorithm", "function", "variable"],
  Space: ["galaxy", "asteroid", "supernova", "blackhole", "satellite"],
  Movies: ["inception", "gladiator", "avatar", "interstellar"]
};

const maxWrong = 6;
let selectedWord = "";
let category = "";
let guessed = [];
let wrong = 0;

const canvas = document.getElementById("hangman");
const ctx = canvas.getContext("2d");

const wordEl = document.getElementById("word");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const categoryEl = document.getElementById("category");

const sounds = {
  correct: document.getElementById("correctSound"),
  wrong: document.getElementById("wrongSound"),
  win: document.getElementById("winSound"),
  lose: document.getElementById("loseSound")
};

let stats = JSON.parse(localStorage.getItem("hangmanStats")) || { wins: 0, losses: 0 };

function saveStats() {
  localStorage.setItem("hangmanStats", JSON.stringify(stats));
  document.getElementById("wins").textContent = `Wins: ${stats.wins}`;
  document.getElementById("losses").textContent = `Losses: ${stats.losses}`;
}

function pickWord() {
  const categories = Object.keys(words);
  category = categories[Math.floor(Math.random() * categories.length)];
  selectedWord = words[category][Math.floor(Math.random() * words[category].length)];
}

function drawWord() {
  wordEl.textContent = selectedWord
    .split("")
    .map(l => (guessed.includes(l) ? l : "_"))
    .join(" ");
}

function createKeyboard() {
  keyboard.innerHTML = "";
  "abcdefghijklmnopqrstuvwxyz".split("").forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.onclick = () => guess(letter, btn);
    keyboard.appendChild(btn);
  });
}

function guess(letter, btn) {
  btn.disabled = true;
  if (selectedWord.includes(letter)) {
    guessed.push(letter);
    btn.classList.add("correct");
    sounds.correct.play();
  } else {
    wrong++;
    btn.classList.add("wrong");
    sounds.wrong.play();
    drawHangman();
  }
  drawWord();
  checkGame();
}

function checkGame() {
  if (!wordEl.textContent.includes("_")) {
    message.textContent = "🎉 You Win!";
    sounds.win.play();
    stats.wins++;
    endGame();
  }
  if (wrong >= maxWrong) {
    message.textContent = `💀 You Lost! Word was "${selectedWord}"`;
    sounds.lose.play();
    stats.losses++;
    endGame();
  }
  saveStats();
}

function endGame() {
  [...keyboard.children].forEach(b => b.disabled = true);
}

function drawHangman() {
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#fff";

  const steps = [
    () => { ctx.moveTo(50,280); ctx.lineTo(200,280); },
    () => { ctx.moveTo(125,280); ctx.lineTo(125,40); },
    () => { ctx.lineTo(180,40); ctx.lineTo(180,70); },
    () => { ctx.arc(180,95,25,0,Math.PI*2); },
    () => { ctx.moveTo(180,120); ctx.lineTo(180,190); },
    () => { ctx.moveTo(180,140); ctx.lineTo(150,170); ctx.moveTo(180,140); ctx.lineTo(210,170); }
  ];

  steps[wrong - 1]?.();
  ctx.stroke();
}

function resetGame() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  guessed = [];
  wrong = 0;
  message.textContent = "";
  pickWord();
  categoryEl.textContent = `Category: ${category}`;
  drawWord();
  createKeyboard();
}

document.getElementById("newGame").onclick = resetGame;
document.getElementById("toggleTheme").onclick = () =>
  document.body.classList.toggle("light");

saveStats();
resetGame();
