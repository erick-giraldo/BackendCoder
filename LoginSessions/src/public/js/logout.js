import { logout } from './sessions.mjs'

let buttonLogout = document.getElementById("btn-logout");

buttonLogout.addEventListener("click", (e) => {
    logout();
});

