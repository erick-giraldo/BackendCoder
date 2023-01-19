class ProductManager {
  constructor() {
    this.products = [];
  }
  idCount = 0;
  addProduct(data) {
    if (
      data.hasOwnProperty("title") &&
      data.hasOwnProperty("description") &&
      data.hasOwnProperty("price") &&
      data.hasOwnProperty("thumbnail") &&
      data.hasOwnProperty("code") &&
      data.hasOwnProperty("stock")
    ) {
      if (
        data.title.trim() &&
        data.description.trim() &&
        data.price.toString().trim() &&
        data.thumbnail.trim() &&
        data.code.trim() &&
        data.stock.toString().trim()
      ) {
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
        console.log(
          `El producto fue agregado exitosamente`
        );
        return;
      }
      console.log("Error hay una o más keys con valor vacio, porfavor verifique y intente nuevamente");
      return;
    }
    console.log(
      "Error al agregar producto porfavor verifique que los campos sean correctos =====>(title, description, price, thumbnail, code, stock)"
    );
    return;
  }

  getProducts() {
    return this.products;
  }
  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      return "Producto no encontrado"
    }
    return product;
  }
}
//instanciando la clase
const items = new ProductManager();
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
console.log("==============>Agregando un nuevo producto con el codigo repetido para validar que ya se encuentra registrado<========");

items.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});

console.log("==============>Agregando un nuevo producto con el codigo diferente <========");
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

console.log("==============>Agregando un nuevo producto con los campos vacios para validar que no acepten ingresar campos vacios<========");

items.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "",
  code: "",
  stock: 25,
});

console.log('==============>buscando todos lod productos<========')
console.log(items.getProducts());
console.log('==============>buscando producto por id "1"<========')
console.log(items.getProductById(1));
console.log("==============>Buscando un producto '5' para validar que el codigo no existe<========")
console.log(items.getProductById(5));
