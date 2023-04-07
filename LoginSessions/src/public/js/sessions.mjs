export const login = async ( email, password ) => {  
  try {
    const response = await fetch(`/api/sessions/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 400) {
      const errorText = await response.text();
      const error = JSON.parse(errorText);
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

    if (response.status === 400) {
      const errorText = await response.text();
      const error = JSON.parse(errorText);
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
