import { login, register } from "./sessions.mjs";

const loginId = document.querySelector("#login");
const registerId = document.querySelector("#register");
let buttonLogin = document.getElementById("btn-log-submit");
let buttonRegister = document.getElementById("btn-reg-submit");

document.querySelector("#register-btn").addEventListener("click", viewRegister);
document.querySelector("#login-btn").addEventListener("click", viewLogin);
const form = document.querySelector("form");

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

function viewLogin() {
  registerId.style.display = "none";
  loginId.style.display = "block";
}

function viewRegister() {
  loginId.style.display = "none";
  registerId.style.display = "block";
}
