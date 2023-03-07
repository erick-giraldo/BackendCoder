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
    const title = document.forms["productForm"]["title"].value;
    const description = document.forms["productForm"]["description"].value;
    const category = document.forms["productForm"]["category"].value;
    const code = document.forms["productForm"]["code"].value;
    const stock = Number(document.forms["productForm"]["stock"].value);
    const price = Number(document.forms["productForm"]["price"].value);

    const product = {
        title,
        data: [name, description, image, code, stock, price],
    };
    socket.emit("addProduct", {
        token,
        product,
    });
};

const deleteProduct = (title, id) => {
    socket.emit("deleteProduct", {
        token,
        title,
        id,
    });
};

const listItem = (title, data) => {
    let textHtml = "";
    for (let i = 0; i < data.length; i++) {
        let listCards = `<div class="row productos-section">
                <div class="card col-lg-2 col-md-6 col-sm-12" style="width: 20rem">
                 <div class="delete" onclick='deleteProduct("${title}",${data[i].id})'>x</div>
                    <img src=${data[i].image} class="d-block w-100" alt=${data[i].name} />
                    <div class="card-body">
                        <h5 class="card-title card-name">${data[i].name} </h5>
                        <p class="card-text">${data[i].description}</p>
                        <div class="card-inv">
                            <p class="card-title card-price">$ ${data[i].price}</p>
                            <p class="card-title card-stock">Stock: ${data[i].stock}</p>
                        </div>
                        <a type="button" class="btn btn-outline-dark" href="">Ver Detalles</a>
                    </div>
                </div>
                </div>
        </div>`;
        textHtml = textHtml + listCards;
    }
    return textHtml;
};

socket.on("products", (data) => {
    document.getElementById("productForm").reset();
    const productList = document.getElementById("containerProducts");
    let items = "";
    data.map((product) => {
        items =
            items +
            ` <div>
            <p class="p-titulo">${product.title}</p>
            <p>Descubre algunos de los modelos más recientes.</p>
               ${listItem(product.title, product.data)}
        </div>`;
    });
    productList.innerHTML = items;
});

socket.on("notification", (data) => {
    if (data.token === token) {
        toastr[data.type](data.message);
    }
});
