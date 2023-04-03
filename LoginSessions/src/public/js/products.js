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
        title: "Bien Hecho!!",
        text: "El producto fue Agregado al Carrito",
        confirmButtonText: "Save",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error!!",
      text: "El producto no pudo ser Agregado al Carrito",
      confirmButtonText: "Save",
    });
    console.error(error);
  }
};
