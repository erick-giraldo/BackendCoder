// //////////

// //Declaramos variables para el cambio login y Registro
// const loginId = document.querySelector("#login");
// const registerId = document.querySelector("#register");
// const spinnerReg = document.querySelector(".spinnerReg");
// const spinnerLog = document.querySelector(".spinnerLog");
// document.querySelector("#register-btn").addEventListener("click", viewRegister);
// document.querySelector("#login-btn").addEventListener("click", viewLogin);


// function viewLogin() {
//   registerId.style.display = "none";
//   loginId.style.display = "block";
// }

// function viewRegister() {
//   loginId.style.display = "none";
//   registerId.style.display = "block";
// }

// const login = () =>{
//   try {
//     const cartId = 1;
//     const response = await fetch(`/api/sessions/logout`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     console.log("🚀 ~ file: sessions.js:62 ~ logout ~ response:", response.status )

//     if (response.status == 200) {
//       Swal.fire({
//         icon: "success",
//         title: "Logout ok!!!",
//         text: "La sesión se cerro correctamente",
//         confirmButtonText: "Save",
//       });
//       setTimeout(() => {
//         window.location.replace("http://localhost:8080/login");
//       }, 2000);
      
//     }
//   } catch (error) {
//     Swal.fire({
//       icon: "error",
//       title: "Error!!",
//       text: "El producto no pudo ser Agregado al Carrito",
//       confirmButtonText: "Save",
//     });
//     console.error(error);
//   }
// }
const logout = async () => {
  try {
    const response = await fetch(`/api/sessions/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Logout ok!!!",
        text: "La sesión se cerró correctamente",
        confirmButtonText: "OK",
      });

      setTimeout(() => {
        window.location.replace("http://localhost:8080/login");
      }, 2000);
    } else {
      throw new Error("Error al destruir la sesión");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Logout error!!!",
      text: error.message,
      confirmButtonText: "OK",
    });

    console.error(error);
  }
};

