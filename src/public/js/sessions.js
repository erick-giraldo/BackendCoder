const API_URL = "/api/auth";

const successMessages = {
  LOGIN: "Bienvenido",
  REGISTER: (email) => `Bienvenido ${email}`,
  LOGOUT: "La sesión se cerró correctamente",
  UPDATEPASS: "Se cambió la contraseña correctamente",
  RESET: "Se ha generado un enlace para restablecer la contraseña. Revisa tu correo electrónico.",
  DOCUMENTS: "Se subió el documento correctamente"
};

const errorMessages = {
  DEFAULT: "Ha ocurrido un error. Por favor, intenta de nuevo más tarde.",
  LOGIN: "No se ha podido iniciar sesión con los datos proporcionados.",
  REGISTER: "No se ha podido crear la cuenta con los datos proporcionados.",
  RESET: "No se ha podido generar el enlace para restablecer la contraseña. Por favor, intenta de nuevo más tarde.",
  LOGOUT: "No se ha podido cerrar la sesión.",
  UPDATEPASS: "No se ha podido cambiar su clave",
  DOCUMENTS: "No se ha podido subir el documento"
};

const postRequest = async (url, body, method = "GET", header) => {
  try {
    const response = await fetch(url, {
      method,
      headers: header || { "Content-Type": "application/json" },
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

const showSuccessMessage = (title, text) => {
  Swal.fire({
    icon: "success",
    title,
    text,
    showConfirmButton: false,
  });
};

const showErrorMessage = (title, text) => {
  Swal.fire({
    icon: "error",
    title,
    text,
    showConfirmButton: false,
  });
};

const login = async (email, password) => {
  const { success, error, data } = await postRequest(`${API_URL}/login`, {
    email,
    password,
  }, "POST");
  if (success) {
    showSuccessMessage("Login ok!!!", successMessages.LOGIN);
    setTimeout(() => {
      window.location.replace("/products");
    }, 2000);
  } else {
    showErrorMessage("Login error!!!", error?.message || errorMessages.LOGIN);
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
    showSuccessMessage("Registro ok!!!", successMessages.REGISTER(email));
    setTimeout(() => {
      window.location.replace("/login");
    }, 2000);
  } else {
    showErrorMessage("Registro error!!!", error?.message || errorMessages.REGISTER);
  }
};

const forgotPassword = async (email) => {
  const { success, error } = await postRequest(`${API_URL}/forgot-password`, {
    email
  }, "POST");
  if (success) {
    showSuccessMessage("Send Link Ok!!!", successMessages.RESET);
    setTimeout(() => {
      window.location.replace("/login");
    }, 3000);
  } else {
    showErrorMessage("Login error!!!", error?.message || errorMessages.RESET);
  }
};

const resetPassword = async (email, password, token) => {
  const { success, error } = await postRequest(`${API_URL}/reset-password`, {
    email,
    password,
    token
  }, "PUT");
  if (success) {
    showSuccessMessage("Pass OK!!", successMessages.UPDATEPASS);
    setTimeout(() => {
      window.location.replace("/login");
    }, 3000);
  } else {
    showErrorMessage("Reset Password error!!!", error?.message || errorMessages.UPDATEPASS);
  }
};

const logout = async () => {
  const { success, error } = await postRequest(`${API_URL}/logout`);
  if (success) {
    showSuccessMessage("Logout ok!!!", successMessages.LOGOUT);
    setTimeout(() => {
      window.location.replace("/");
    }, 2000);
  } else {
    showErrorMessage("Logout error!!!", error?.message || errorMessages.LOGOUT);
  }
};

const uploadDocuments = async (type, userId, formData) => {
    // Convertir FormData a un objeto regular para mostrar en la consola
    const formDataObject = {};
    for (const key of formData.keys()) {
      formDataObject[key] = formData.getAll(key);
    }

    console.log("Contenido de FormData:", formDataObject);

  const { success, error } = await postRequest(`api/users/${userId}/documents?type=${type}`, {
    formData,
  }, "POST", { "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryS8c4lA5nqjYMcQe6a" });
  if (success) {
    showSuccessMessage("Files ok!!!", successMessages.DOCUMENTS);
    setTimeout(() => {
      location.reload();
    }, 2000);
  } else {
    showErrorMessage("Logout error!!!", error?.message || errorMessages.DOCUMENTS);
  }
};

export {
  login,
  register,
  resetPassword,
  forgotPassword,
  logout,
  uploadDocuments
};
