import { logout, uploadDocuments } from './sessions.js';

let buttonLogout = document.getElementById("btn-logout");
let btnEnviar = document.getElementById("btn-enviar");

buttonLogout.addEventListener("click", (e) => {
  logout();
});

let valueTypes = '';

// Obtener los checkboxes por su clase o selector
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

btnEnviar.addEventListener("click", (e) => {
  try {
    const fileInput = document.getElementById('documents');
    const files = Array.from(fileInput.files);  
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', file);
    });
    const userId = btnEnviar.value;
    uploadDocuments(valueTypes, userId, formData);
  } catch (error) {
    
  }

});
