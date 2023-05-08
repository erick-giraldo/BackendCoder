import { logout } from './sessions.js'

let buttonLogout = document.getElementById("btn-logout");

buttonLogout.addEventListener("click", (e) => {
    logout();
});

