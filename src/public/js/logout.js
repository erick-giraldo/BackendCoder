import { logout, uploadDocuments } from './sessions.js';

let buttonLogout = document.getElementById("btn-logout");
let btnEnviar = document.getElementById("btn-enviar");

buttonLogout.addEventListener("click", (e) => {
  logout();
});

let valueTypes = '';

const checkboxes = document.querySelectorAll('input[name="documentTypes"]');
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', (event) => {
    handleCheckboxChange(event.target.id, () => {
    });
  });
});

function handleCheckboxChange(checkboxId, callback) {
  const checkboxes = document.querySelectorAll('input[name="documentTypes"]');


  checkboxes.forEach((checkbox) => {
    if (checkbox.id !== checkboxId) {
      checkbox.checked = false;
    } else {
      if (checkbox.checked) {
        const checkboxValue = checkbox.value;
        valueTypes = checkboxValue;
        callback();
      }
    }
  });
}

document.querySelector('[name="profile-form"]').addEventListener('submit', e => {
  e.preventDefault()

  const formData = new FormData(e.target)
  const button = e.target[4]
  const userId = button.dataset.userId

  formData.delete('documentTypes')

  uploadDocuments(valueTypes, userId, formData)
})
