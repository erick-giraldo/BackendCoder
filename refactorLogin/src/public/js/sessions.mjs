export const login = async ( email, password ) => {  
  try {
    const response = await fetch(`/api/sessions/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    console.log("🚀 ~ file: sessions.mjs:5 ~ login ~ response:", response)

    if (response.status === 500) {
      const error = await response.json();
      Swal.fire({
        icon: "error",
        title: "Login error!!!",
        text: error.message,
        showConfirmButton: false,
      });
    }
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Login ok!!!",
        text: "Bienvenido",
        showConfirmButton: false,
      });
      setTimeout(() => {
        window.location.replace("/products");
      }, 2000); 
    }
  } catch (error) {
    console.error(error);
  }
}

export const register = async ( email, password ) => {  
  try {
    const response = await fetch(`/api/sessions/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    console.log("🚀 ~ file: sessions.mjs:41 ~ register ~ response:", response)

    if (response.status === 500) {
      const error = await response.json();
      Swal.fire({
        icon: "error",
        title: "Registro error!!!",
        text: error.message,
        confirmButtonText: "OK",
      });
    }
 
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Registro ok!!!",
        text: `Bienvenido ${email}`,
        confirmButtonText: "OK",
      });
      // setTimeout(() => {
      //   window.location.replace("/login");
      // }, 2000); 
    }

   
  } catch (error) {
    console.error(error);
  }
}

export const reset = async ( email, password ) => {  
  try {
    const response = await fetch(`/api/sessions/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const responseMessage = await response.text();
    const message = JSON.parse(responseMessage);
    if (response.status === 400) {
      Swal.fire({
        icon: "error",
        title: "Login error!!!",
        text: message.message,
        showConfirmButton: false,
      });
    }
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Reset Pass ok!!!",
        text: message.message,
        showConfirmButton: false,
      });
      setTimeout(() => {
        window.location.replace("/login");
      }, 2000); 
    }
  } catch (error) {
    console.error(error);
  }
}

export const logout = async () => {
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
