//////////

//Declaramos variables para el cambio login y Registro
const loginId = document.querySelector("#login");
const registerId = document.querySelector("#register");
const spinnerReg = document.querySelector(".spinnerReg");
const spinnerLog = document.querySelector(".spinnerLog");
document.querySelector("#register-btn").addEventListener("click", viewRegister);
document.querySelector("#login-btn").addEventListener("click", viewLogin);

//Declaramos variables para el ingeso de datos del Registro
const userReg = document.getElementById("user-reg");
const passReg = document.getElementById("pass-reg");
let buttonRegister = document.getElementById("btn-reg-submit");
//Declaramos variables para el ingeso de datos del login
const userLog = document.getElementById("user");
const passLog = document.getElementById("pass");
let buttonLogin = document.getElementById("btn-log-submit");

buttonRegister.addEventListener("click", (e) => {
  e.preventDefault();
  const dataRegister = {
    usuario: userReg.value,
    password: passReg.value,
  };
  register(dataRegister);
});

buttonLogin.addEventListener("click", (e) => {
  e.preventDefault();
  const dataLogin = {
    user: userLog.value,
    pass: passLog.value,
  };
  login(dataLogin);
});

function toLogin() {
  window.location.href = "./";
}

function toStart() {
  window.location.href = "./pages/start.html";
}

function viewLogin() {
  registerId.style.display = "none";
  loginId.style.display = "block";
}

function viewRegister() {
  loginId.style.display = "none";
  registerId.style.display = "block";
}