class ProductManager {
  constructor() {
    this.products = [];
    this.idCount = 0;
  }
  getProducts() {
    return this.products;
  }
  addProduct(data) {
    const existsProduct = this.products.find((p) => p.code === data.code);
    if (existsProduct) {
      throw new Error("El codigo del producto ya existe");
    }
    data.id = this.idCount++;
    this.products.push(data);
  }
  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  }
}
//instanciando la clase
const items = new ProductManager();
console.log(items.getProducts()); // []
console.log('Agregando un nuevo producto------- OK') 
items.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});
console.log('listando todos los productos')
console.log(items.getProducts());
console.log('Agregando un producto con controlador de errores "try", el cual captura la respuesta de error si el código se repite')
try {
    items.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  });
} catch (error) {
  console.log(error.message); // "El codigo del producto ya existe"
}
console.log('buscando producto por id "0"')
console.log(items.getProductById(0));

console.log("Buscando un producto '1' con controlador de errores 'try', el cual captura la respuesta de error si el código no existe")
try {
  console.log(items.getProductById(1));
} catch (error) {
  console.log(error.message); // "Producto no encontrado"
}
