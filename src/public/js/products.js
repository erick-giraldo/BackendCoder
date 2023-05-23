const addProductCart = async (_id) => {
  try {
    const response = await fetch(`/carts/product/${_id}`, {
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
    const response = await fetch(`/deletecarts/product/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Bien Hecho!!",
        text: "El producto fue eliminado al Carrito",
        showConfirmButton: false
      });
      location.reload();
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error!!",
      text: "El producto no pudo ser eliminado al Carrito",
      showConfirmButton: false
    });
    console.error(error);
  }
};

const pagar = async () => {
  try {
    const response = await fetch(`/1/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "¡Bien hecho!",
        text: "El producto fue eliminado del carrito",
        showConfirmButton: false
      });
      location.reload();
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "¡Error!",
      text: "El producto no pudo ser eliminado del carrito",
      showConfirmButton: false
    });
    console.error(error);
  }
}
