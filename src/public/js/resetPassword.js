import { resetPassword } from "./sessions.js";

const email = document.getElementById("email")
const password = document.getElementById("password")
const confirm_password = document.getElementById("confirmPassword");

let buttonReset = document.getElementById("submitButton");

buttonReset.addEventListener("click", (e) => {
  validateSignupForm()
});


document.getElementById('signupLogo').src = "https://res.cloudinary.com/dwlf0cuu6/image/upload/v1680559638/logo_celer7.webp";
enableSubmitButton();

function validateEmptyPassword() {
  if (password.value == "" || confirm_password.value == "") {
    confirm_password.setCustomValidity("Completa este campo!");
    return false;
  } else {
    confirm_password.setCustomValidity('');
    return true;
  }
}

function validatePassword() {
  if (password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Las contraseñas no coiniciden");
    return false;
  } else {
    confirm_password.setCustomValidity('');
    return true;
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;

function enableSubmitButton() {
  document.getElementById('submitButton').disabled = false;
  document.getElementById('loader').style.display = 'none';
}

function disableSubmitButton() {
  document.getElementById('submitButton').disabled = true;
  document.getElementById('loader').style.display = 'unset';
}

function validateSignupForm() {
  if (!validateEmptyPassword()) {
    return false;
  }
  if (!validatePassword()) {
    return false;
  }
  const payload = {
    email: email.value,
    password: password.value,
  }
  resetPassword(payload);
  disableSubmitButton();

  setTimeout(function () {
    enableSubmitButton();
  }, 1000);
}

