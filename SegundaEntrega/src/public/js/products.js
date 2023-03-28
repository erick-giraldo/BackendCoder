const socket = io();

const generateToken = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

let token = "";
token = generateToken();

const onSubmitForm = () => {
  const category = document.forms["productForm"]["category"].value;
  const name = document.forms["productForm"]["name"].value;
  const image = document.forms["productForm"]["image"].value;
  const description = document.forms["productForm"]["description"].value;
  const code = document.forms["productForm"]["code"].value;
  const stock = Number(document.forms["productForm"]["stock"].value);
  const price = Number(document.forms["productForm"]["price"].value);
  const status = document.forms["productForm"]["status"].value;

  const product = {
        category:category,
        name: name,
        image: image,
        description: description,
        code: code,
        stock: stock,
        price: price,
        status: status
  };

  socket.emit("addProduct", {
    token,
    product
  });
};

const deleteProduct = ( id) => {
  socket.emit("deleteProduct", {
    token,
    id
  });
};



socket.on("products", (data) => {
  const productList = document.getElementById("containerProducts");
  let items = "";
  data.forEach((product) => {
    console.log("🚀 ~ file: products.js:55 ~ data.forEach ~ product:", product)
    items = items +
    `<tr>
    <th scope="row">${product.id}</th>
    <td>${product.category}</td>
    <td>${product.code}</td>
    <td>${product.name}</td>
    <td>${product.description}</td>
    <td><img style="width: 15rem;" src=${product.image} /></td>
    <td>${product.price}</td>
    <td>${product.stock}</td>
    <td>${product.status}</td>
    <td>
      <div class="actions">
        <a href="#" id="add" rel="noopener noreferrer" title="Agregar"><span class="material-symbols-outlined">add_circle</span></a>
        <a href="#" id="edit" rel="noopener noreferrer" title="Editar"><span class="material-symbols-outlined">edit</span></a>
        <a href="#" id="delete" rel="noopener noreferrer" title="Eliminar"><span class="material-symbols-outlined">delete</span></a>
      </div>
      </i>
    </td>
    </tr>`;
  });
  productList.innerHTML = items;
});


socket.on("notification", (data) => {
  if (data.token === token) {
    toastr[data.type](data.message);
  }
});
