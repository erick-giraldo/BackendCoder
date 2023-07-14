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
      getValueTypes(valueTypes);
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


function getValueTypes(value) {
  // Lógica para manejar el valor de los tipos de documentos seleccionados
  console.log(value);
  btnEnviar.addEventListener("click", (e) => {

    let inputFiles = document.getElementById('documents');
    const files = inputFiles.files[0];

    const userId = btnEnviar.value
    uploadDocuments(value, userId , files)
  });
}
