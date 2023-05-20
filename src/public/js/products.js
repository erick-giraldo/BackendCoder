const addProductCart = async (_id) => {
  try {
    const cartId = 1;
    const response = await fetch(`/carts/${cartId}/product/${_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "¡Bien Hecho!",
        text: "El producto fue Agregado al Carrito",
        showConfirmButton: false
      });
      location.reload();
    } else {
      const errorResponse = await response.json();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorResponse.message || "El producto no pudo ser Agregado al Carrito",
        showConfirmButton: false
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "El producto no pudo ser Agregado al Carrito",
      showConfirmButton: false
    });
    console.error(error);
  }
};



const deleteProductCartById = async (_id) => {
  try {
    const cartId = 1;
    const response = await fetch(`/deletecarts/${cartId}/product/${_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Bien Hecho!!",
        text: "El producto fue Agregado al Carrito",
        showConfirmButton: false
      });
      location.reload();
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error!!",
      text: "El producto no pudo ser Agregado al Carrito",
      showConfirmButton: false
    });
    console.error(error);
  }
};