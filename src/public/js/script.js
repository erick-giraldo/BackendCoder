const fetchApi = async (url, method, body = null) => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (response.status === 200) {
      return { success: true, data: await response.json() };
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.error || errorResponse.message || "Error en la solicitud";
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    return { success: false, error: "Error en la solicitud" };
  }
};

  
  const showSuccessMessage = (title, message, shouldReload = true) => {
    Swal.fire({
      icon: "success",
      title,
      html: message,
      showConfirmButton: false,
    });
    if (shouldReload) {
      setTimeout(() => {
        location.reload();
      }, 3000);
    }
  };
  
  const showErrorMessage = (title, message) => {
   if(message === 'Forbidden'){
    Swal.fire({
      icon: "error",
      title,
      text: 'No tiene Permiso para acceder a esta página',
      showConfirmButton: false,
    });
   }else{
    Swal.fire({
      icon: "error",
      title,
      html: message,
      showConfirmButton: false,
    });
   }
    // setTimeout(() => {
    //   location.reload();
    // }, 2000);
  };
  
  const updateRoleById = async (id, email) => { 
    const { success, error } = await fetchApi(`/api/users/premium/${id}`, "PUT");
    if (success) {
      showSuccessMessage("Bien Hecho!!", `Se cambio el rol del usuario <strong>${email}</strong> exitosamente"`);
    } else {
      showErrorMessage("Error!!", error || "No se pudo cambiar el rol del usuario");
    }
  };

  const deleteUserById = async (id, email) => {
    const { success, error } = await fetchApi(`/api/users/delete/${id}`, "DELETE");
    if (success) {
      showSuccessMessage("Bien Hecho!!", `El usuario  <strong>${email}</strong> fue eliminado exitosamente"`);
    } else {
      showErrorMessage("Error!!", error || "No se pudo eliminar el usuario");
    }
  };
