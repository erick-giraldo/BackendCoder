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
      return {
        success: false,
        error: errorResponse.error.error || "Error en la solicitud",
        title: errorResponse.error.message || "Error en la solicitud",
      };
    }
  } catch (error) {
    return { success: false, error: "Error en la solicitud" };
  }
};

const showSuccessMessage = (title, message, shouldReload = true) => {
  Swal.fire({
    icon: "success",
    title,
    text: message,
    showConfirmButton: false,
  });
  if (shouldReload) {
    location.reload();
  }
};

const showErrorMessage = (title, message) => {
  if (message === "Forbidden") {
    Swal.fire({
      icon: "error",
      title,
      text: "No tiene Permiso para acceder a esta página",
      showConfirmButton: false,
    });
  } else {
    Swal.fire({
      icon: "error",
      title,
      text: message,
      showConfirmButton: false,
    });
  }
  // setTimeout(() => {
  //   location.reload();
  // }, 1000);
};

const addProductCart = async (id) => {
  const { success, error, title } = await fetchApi(
    `/carts/product/${id}`,
    "POST"
  );
  if (success) {
    showSuccessMessage("¡Bien Hecho!", "El producto fue Agregado al Carrito");
  } else {
    showErrorMessage(
      title,
      error || "El producto no pudo ser Agregado al Carrito"
    );
  }
};

const deleteProductCartById = async (_id) => {
  const { success, error } = await fetchApi(
    `/deletecarts/product/${_id}`,
    "DELETE"
  );
  if (success) {
    showSuccessMessage("Bien Hecho!!", "El producto fue eliminado del Carrito");
  } else {
    showErrorMessage(
      title,
      error || "El producto no pudo ser eliminado del Carrito"
    );
  }
};

const pagar = async (cid, total) => {
  const { success, error } = await fetchApi(
    `/api/carts/${cid}/purchase/${total}`,
    "POST"
  );
  if (success) {
    showSuccessMessage("¡Bien hecho!", "Pedido generado exitosamente", false);
    setTimeout(() => {
      window.location.replace("/invoice");
    }, 2000);
  } else {
    showErrorMessage(title, error || "No se puede generar el pedido");
  }
};

const redirectToProducts = () => {
  window.location.replace("/products");
};
