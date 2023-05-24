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

const pagar = async (cid, total) => {
  try {
    const response = await fetch(`/api/carts/${cid}/purchase/${total}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      });
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "¡Bien hecho!",
        text: "Pedido Generado exitosamente",
        showConfirmButton: false
      });
      setTimeout(() => {
        window.location.replace("/invoice");
      }, 2000);
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "¡Error!",
      text: "No se puede generar el pedido",
      showConfirmButton: false
    });
    console.error(error);
  }
}

const redirectToProducts = () =>{
  window.location.replace("/products");
}