import { login, register, reset } from "./sessions.mjs";

const loginId = document.querySelector("#login");
const registerId = document.querySelector("#register");
const resetId = document.querySelector("#reset");
let buttonLogin = document.getElementById("btn-log-submit");
let buttonRegister = document.getElementById("btn-reg-submit");
let buttonReset = document.getElementById("btn-reset-submit");
let buttonGitHub = document.getElementById("GitHub");

document.querySelector("#register-btn").addEventListener("click", viewRegister);
document.querySelector("#login-btn").addEventListener("click", viewLogin);
document.querySelector("#login-reset-btn").addEventListener("click", viewLoginReset);
document.querySelector("#reset-btn").addEventListener("click", viewReset);
document.querySelector("#reset-btn-reg").addEventListener("click", viewResetReg);
const form = document.querySelector("form");

buttonGitHub.addEventListener("click", (e) => {
  authGitHub()
});

buttonLogin.addEventListener("click", (e) => {
  const email = document.querySelector("#user").value;
  const password = document.querySelector("#pass").value;
  login(email, password);
});

buttonRegister.addEventListener("click", (e) => {
  const email = document.querySelector("#user-reg").value;
  const password = document.querySelector("#pass-reg").value;
  register(email, password);
});

buttonReset.addEventListener("click", (e) => {
  const email = document.querySelector("#user-reset").value;
  const password = document.querySelector("#pass-reset").value;
  reset(email, password);
});

function viewLogin() {
  registerId.style.display = "none";
  loginId.style.display = "block";
}

function viewLoginReset() {
  resetId.style.display = "none";
  loginId.style.display = "block";
}

function viewRegister() {
  loginId.style.display = "none";
  registerId.style.display = "block";
}

function viewReset() {
  loginId.style.display = "none";
  resetId.style.display = "block";
}

function viewResetReg() {
  registerId.style.display = "none";
  resetId.style.display = "block";
}

function authGitHub() {
  window.location.replace("/auth/github");
}

