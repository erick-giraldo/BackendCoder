

const addProductCart = async  (_id) => {

  try {
    const cartId = 2;
    const response = await fetch(`/api/carts//${cartId}/product/${_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({ campo1: campo1Valor, campo2: campo2Valor })
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
    
};

// const deleteProduct = (id) => {
//   socket.emit("deleteProduct", {
//     token,
//     id,
//   });
// };
