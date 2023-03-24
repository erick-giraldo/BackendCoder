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
  document.getElementById("productForm").reset();
  const productList = document.getElementById("containerProducts");
  let items = "";
  data.forEach((product) => {
    items = items +
      ` <div>
            <p class="p-titulo">${product.category}</p>
            <p>Descubre algunos de los modelos más recientes.</p>
            <div class="card-container">
            <div class="row productos-section">
            <div
              class="card col-lg-2 col-md-6 col-sm-12"
              style="width: 20rem"
            >
            <div class="delete" onclick='deleteProduct(${product.id})'>x</div>
              <img
                src=${product.image}
                class="d-block w-100"
                alt=${product.name}
              />
              <div class="card-body">
                <h5 class="card-title card-name">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <div class="card-inv">
                  <p class="card-title card-price">$ ${product.price}</p>
                  <p class="card-title card-stock">Stock:
                  ${product.stock}</p>
                </div>
                <a
                  type="button"
                  class="btn btn-outline-dark"
                  href=""
                >Ver Detalles</a>
              </div>
            </div>
          </div>
               </div>
        </div>`;
  });
  productList.innerHTML = items;
});



socket.on("notification", (data) => {
  if (data.token === token) {
    toastr[data.type](data.message);
  }
});
