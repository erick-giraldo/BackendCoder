const API_URL = "/api/auth";

const successMessages = {
  LOGIN: "Bienvenido",
  REGISTER: (email) => `Bienvenido ${email}`,
  LOGOUT: "La sesión se cerró correctamente",
  RESET: "La contraseña ha sido restablecida correctamente",
};

const errorMessages = {
  DEFAULT: "Ha ocurrido un error. Por favor, intenta de nuevo más tarde.",
  LOGIN: "No se ha podido iniciar sesión con los datos proporcionados.",
  REGISTER: "No se ha podido crear la cuenta con los datos proporcionados.",
  RESET:
    "No se ha podido restablecer la contraseña con los datos proporcionados.",
  LOGOUT: "No se ha podido cerrar la sesión.",
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
    email,
    password,
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

const reset = async (email, password) => {
  const { success, error } = await postRequest(`${API_URL}/reset-password`, {
    email,
    password,
  }, "POST");
  if (success) {
    Swal.fire({
      icon: "success",
      title: "Reset Pass ok!!!",
      text: successMessages.RESET,
      showConfirmButton: false,
    });
    setTimeout(() => {
      window.location.replace("/login");
    }, 2000);
  } else {
    Swal.fire({
      icon: "error",
      title: "Login error!!!",
      text: error?.message || errorMessages.RESET,
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

export { login, register, reset, logout };
