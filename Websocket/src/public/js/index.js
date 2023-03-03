
const socket = io();

const generateId = () => {
    const length = 8;
    let id = '';
    for (let i = 0; i < length; i++) {
        id += Math.floor(Math.random() * 10);
    }
    return id;
}

let user = '';
user = generateId();

const onSubmitForm = () => {
    const title = document.forms["productForm"]["title"].value;
    const description = document.forms["productForm"]["description"].value;
    const category = document.forms["productForm"]["category"].value;
    const code = document.forms["productForm"]["code"].value;
    const stock = Number(document.forms["productForm"]["stock"].value);
    const price = Number(document.forms["productForm"]["price"].value);
    const product = {
        title,
        description,
        category,
        code,
        stock,
        price,
        status: true
    };
    socket.emit('addProduct', {
        user,
        product
    })
}

const deleteProduct = (id) => {
    socket.emit('deleteProduct', {
        user,
        id
    })
}

socket.on('products', data => {
    console.log("🚀 ~ file: index.js:46 ~ data:", data)
    document.getElementById("productForm").reset();
    const productList = document.getElementById('containerProducts');
    let elements = '';
    data.forEach(product => {
        elements = elements + `
            <div class="product">
                <div class="delete" onclick='deleteProduct(${product.id})'>x</div>
                <h3>${product.title}</h3>
                <p>Código: ${product.code}</p>
                <p>Categoría: ${product.category}</p>
                <p>Descripción: ${product.description}</p>
                ${product.status ?
                `<p>Stock: ${product.stock}</p>
                    <p class="price">Precio: S/. ${product.price}</p>`
                :
                `<p class="no_product">Producto no disponible</p>`
            }
            </div>
        `
    })
    productList.innerHTML = elements;
})

socket.on('notification', data => {
    if (data.user === user) {
        toastr[data.type](data.message);
    }
})