(function() {
  const socket = io();

  const formMessage = document.getElementById('form-message');
  const inputFullname= document.getElementById('input-fullname');
  const inputMessage = document.getElementById('input-message');
  const listMessages = document.getElementById('list-messages');

  function showMessage(data) {
    const li = document.createElement('li');
    li.innerHTML = `<p><strong>${data.nombre}</strong>: ${data.mensaje}</p>`;
    listMessages.appendChild(li);
  }

  formMessage.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
      nombre: inputFullname.value,
      mensaje: inputMessage.value,
    };
    socket.emit('new-message', data);
    inputMessage.value = '';
    inputMessage.focus();
  });

  socket.on('connect', () => {
    console.log('Conectados al servidor');
  });

  socket.on('notification', (data) => {
    console.log('data', data);
    showMessage(data);
  });

})();