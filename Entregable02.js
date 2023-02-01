const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }
  idCount = 0;
  addProduct(data) {
    if (
      data.title &&
      data.description &&
      data.price &&
      data.thumbnail &&
      data.code &&
      data.stock
    ) {
      if (
        data.title.toString().trim() &&
        data.description.toString().trim() &&
        data.price.toString().trim() &&
        data.thumbnail.toString().trim() &&
        data.code.toString().trim() &&
        data.stock.toString().trim()
      ) {
        if (fs.existsSync(this.path)) {
          let products = fs.readFileSync(this.path, "utf-8");
          products = JSON.parse(products);
          const exists = this.products.find(
            (element) => element.code === data.code
          );
          if (exists) {
            console.log(
              `El código ${data.code} ya se enccuentra registrado, porfavor verifique y intente nuevamente`
            );
            return;
          }
          data.id = this.idCount++;
          this.products.push(data);
          fs.writeFileSync(this.path, JSON.stringify(this.products));
          console.log(`El producto fue agregado exitosamente`);
          return;
        }
        data.id = this.idCount++;
        this.products.push(data);
        fs.writeFileSync(this.path, JSON.stringify(this.products));
        console.log(`El producto fue agregado exitosamente`);
        return;
      }
      console.log(
        "Error hay una o más keys con valor vacio, porfavor verifique y intente nuevamente"
      );
      return;
    }
    console.log(
      "Error al agregar producto porfavor verifique que los campos sean correctos =====>(title, description, price, thumbnail, code, stock)"
    );
    return;
  }

  getProducts() {
    return fs.existsSync(this.path)
      ? JSON.parse(fs.readFileSync(this.path, "utf-8"))
      : [];
  }

  getProductById(id) {
    const getProductos = this.getProducts();
    const product = getProductos.find((p) => p.id === id);
    if (!product) {
      return "Producto no encontrado";
    }
    return product;
  }

  updateProducts(id, data) {
    let products = fs.readFileSync(this.path, "utf-8");
    products = JSON.parse(products);
    products = products.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          ...data,
          id: p.id,
        };
      }
      return p;
    });
    fs.writeFileSync(this.path, JSON.stringify(products));
    console.log('El producto fue actualizado exitosamente');
    return;
  }
  deleteProductById(id) {
    let products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    const product = products.find((element) => element.id === id);
    if (!product) return console.log(`El producto no encontrado`);
    products = products.filter((p) => p.id !== id);
    fs.writeFileSync(this.path, JSON.stringify(products));
    return console.log(
      `El producto fue eliminado de manera exitosa`
    );
  }
}

//instanciando la clase
const items = new ProductManager("products.json");
console.log(items.getProducts()); // []
console.log("==============>Agregando un nuevo producto<========");
items.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 20,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});
console.log(
  "==============>Agregando un nuevo producto con el codigo repetido para validar que ya se encuentra registrado<========"
);

items.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 20,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});

console.log(
  "==============>Agregando un nuevo producto con el codigo diferente <========"
);
items.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc1234",
  stock: 25,
});

items.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc12345",
  stock: 25,
});

console.log(
  "==============>Agregando un nuevo producto con los campos vacios para validar que no acepten ingresar campos vacios<========"
);

items.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "",
  code: "",
  stock: 25,
});
console.log("==============>Actualizando el producto con id '0'<========");
items.updateProducts(0, {
  title: "Producto Actualizado",
  description: "Este es un producto actualizado",
  price: 400,
  thumbnail: "Imagen actualizada",
  code: "abc123",
  stock: 50,
});

console.log("==============>buscando todos lod productos<========");
console.log(items.getProducts());
console.log('==============>buscando producto por id "1"<========');
console.log(items.getProductById(0));
console.log(
  "==============>Buscando un producto '5' para validar que el codigo no existe<========"
);
console.log(items.getProductById(5));

console.log("==============>Eliminand Producto 1<========");
items.deleteProductById(10);
console.log("==============>buscando todos lod productos<========");
console.log(items.getProducts());