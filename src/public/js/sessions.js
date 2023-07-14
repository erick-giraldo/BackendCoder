const API_URL = "/api/auth";

const successMessages = {
  LOGIN: "Bienvenido",
  REGISTER: (email) => `Bienvenido ${email}`,
  LOGOUT: "La sesión se cerró correctamente",
  UPDATEPASS:"Se cambio la contraseña correctamente",
  RESET: "Se ha generado un link para restablecer la contraseña. Revisa tu correo electrónico.",
  DOCUMENTS: "Se subio el documento correctamente"
};

const errorMessages = {
  DEFAULT: "Ha ocurrido un error. Por favor, intenta de nuevo más tarde.",
  LOGIN: "No se ha podido iniciar sesión con los datos proporcionados.",
  REGISTER: "No se ha podido crear la cuenta con los datos proporcionados.",
  RESET:
    "No se ha podido generar el link para restablecer la contraseña. Por favor, intenta de nuevo más tarde",
  LOGOUT: "No se ha podido cerrar la sesión.",
  UPDATEPASS:"No se ha podido cambiar su clave",
  DOCUMENTS: "No se ha podido subir el documento"
};

const postRequest = async (url, body, method = "GET") => {
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      return { success: true, data: await response.json() };
    } else {
      return { success: false, error: await response.json() };
    }
  } catch (error) {
    return { success: false, error };
  }
};

const login = async (email, password) => {
  const { success, error, data } = await postRequest(`${API_URL}/login`, {
    email,
    password,
  }, "POST");
  if (success) {
    Swal.fire({
      icon: "success",
      title: "Login ok!!!",
      text: successMessages.LOGIN,
      showConfirmButton: false,
    });
    setTimeout(() => {
      window.location.replace("/products");
    }, 2000);
  } else {
    Swal.fire({
      icon: "error",
      title: "Login error!!!",
      text: error?.message || errorMessages.LOGIN,
      showConfirmButton: false,
    });
  }
};

const register = async (email, password, role) => {
  const { success, error } = await postRequest(`${API_URL}/register`, {
    password,
    first_name: "Jorge",
    last_name: "Perez",
    email,
    age: 20,
    role,
  }, "POST");
  if (success) {
    Swal.fire({
      icon: "success",
      title: "Registro ok!!!",
      text: successMessages.REGISTER(email),
      confirmButtonText: "OK",
    });
    setTimeout(() => {
      window.location.replace("/login");
    }, 2000);
  } else {
    Swal.fire({
      icon: "error",
      title: "Registro error!!!",
      text: error?.message || errorMessages.REGISTER,
      confirmButtonText: "OK",
    });
  }
};

const forgotPassword = async (email) => {
  const { success, error } = await postRequest(`${API_URL}/forgot-password`, {
    email
  }, "POST");
  if (success) {
    Swal.fire({
      icon: "success",
      title: "Send Link Ok!!!",
      text: successMessages.RESET,
      showConfirmButton: false,
    });
    setTimeout(() => {
      window.location.replace("/login");
    }, 3000);
  } else {
    Swal.fire({
      icon: "error",
      title: "Login error!!!",
      text: error?.message || errorMessages.RESET,
      showConfirmButton: false,
    });
  }
};


const resetPassword = async (email, password, token) => {
  const { success, error } = await postRequest(`${API_URL}/reset-password`, {
    email, 
    password,
    token
  }, "PUT");
  if (success) {
    Swal.fire({
      icon: "success",
      title: "Pass OK!!",
      text: successMessages.UPDATEPASS,
      showConfirmButton: false,
    });
    setTimeout(() => {
      window.location.replace("/login");
    }, 3000);
  } else {
    Swal.fire({
      icon: "error",
      title: "Reset Password error!!!",
      text: error?.message || errorMessages.UPDATEPASS,
      showConfirmButton: false,
    });
  }
};

const logout = async () => {                      
  const { success, error } = await postRequest(`${API_URL}/logout`);
  if (success) {
    Swal.fire({
      icon: "success",
      title: "Logout ok!!!",
      text: successMessages.LOGOUT,
      showConfirmButton: false,
    });
    setTimeout(() => {
      window.location.replace("/");
    }, 2000);
  } else {
    Swal.fire({
      icon: "error",
      title: "Logout error!!!",
      text: error?.message || errorMessages.LOGOUT,
      showConfirmButton: false,
    });
  }
};

const uploadDocuments = async ( type , userId, files ) => {                      
  const { success, error } = await postRequest(`api/users/${userId}/documents`,
  {
    type,
    files,
  }, "POST");
  if (success) {
    Swal.fire({
      icon: "success",
      title: "Files ok!!!",
      text: successMessages.DOCUMENTS,
      showConfirmButton: false,
    });
    setTimeout(() => {
      localtion.reload();
    }, 2000);
  } else {
    Swal.fire({
      icon: "error",
      title: "Logout error!!!",
      text: error?.message || errorMessages.DOCUMENTS,
      showConfirmButton: false,
    });
  }
};

export { login, register, resetPassword, forgotPassword, logout, uploadDocuments };
