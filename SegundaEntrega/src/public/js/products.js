
const addProductCart = async  (_id) => {
  try {
    const cartId = 5;
    const response = await fetch(`/carts/${cartId}/product/${_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    console.log("🚀 ~ file: products.js:9 ~ addProductCart ~ response:", response)
    if(response.status === 200){
      Swal.fire({
        icon: "success",
        title: "Bien Hecho!!",
        text: "El producto fue Agregado al Carrito",
        confirmButtonText: "Save",
      })
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
    
};

