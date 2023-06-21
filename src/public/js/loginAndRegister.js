import { login, register, forgotPassword } from "./sessions.js";

const loginId = document.querySelector("#login");
const registerId = document.querySelector("#register");
const resetId = document.querySelector("#reset");

const buttonLogin = document.querySelector("#btn-log-submit");
buttonLogin.addEventListener("click", handleLogin);

const buttonRegister = document.querySelector("#btn-reg-submit");
buttonRegister.addEventListener("click", handleRegister);

const buttonReset = document.querySelector("#btn-reset-submit");
const spinnerReset = document.querySelector(".spinnerReset");
const btnSubmitReset = document.querySelector(".reg-submit-reset");

buttonReset.addEventListener("click", handleReset);

const buttonGitHub = document.querySelector("#GitHubId");
buttonGitHub.addEventListener("click", handleGitHub);

document.querySelector("#register-btn").addEventListener("click", viewRegister);
document.querySelector("#login-btn").addEventListener("click", viewLogin);
document
  .querySelector("#login-reset-btn")
  .addEventListener("click", viewLoginReset);
document.querySelector("#reset-btn").addEventListener("click", viewReset);
document
  .querySelector("#reset-btn-reg")
  .addEventListener("click", viewResetReg);

function handleLogin(e) {
  e.preventDefault();
  const email = document.querySelector("#user").value;
  const password = document.querySelector("#pass").value;
  login(email, password);
}

function handleRegister(e) {
  e.preventDefault();
  const email = document.querySelector("#user-reg").value;
  const password = document.querySelector("#pass-reg").value;
  const admin = document.getElementById("role");
  const role = admin.checked ? "admin" : undefined;
  register(email, password, role);
}

function handleReset(e) {
  e.preventDefault();
  const email = document.querySelector("#user-reset").value;
  if(email){
    btnSubmitReset.style.display = "none";
    spinnerReset.style.display = "block";
  }
  forgotPassword(email);
}

function handleGitHub() {
  window.location.replace("/api/sessions/auth/github");
}

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
