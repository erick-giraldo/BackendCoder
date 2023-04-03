class ProductManager {
  constructor(path) {
    this.path = path;
    this.idCounter = 0;
  }

  // Method to add a new product
  async addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      console.log("All fields are required");
      return;
    }
    // Assign an id
    product.id = ++this.idCounter;
    await this._saveProduct(product);
  }

  // Method to get all products
  async getProducts() {
    return await this._readProducts();
  }

  // Method to get a product by id
  async getProductById(id) {
    const products = await this._readProducts();
    const product = products.find((product) => product.id === id);

    if (!product) {
      console.log("Not found");
      return;
    }
    return product;
  }

  // Method to update a product
  async updateProduct(id, product) {
    let products = await this._readProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      console.log("Product not found");
      return;
    }

    products[index] = { ...products[index], ...product };
    await this._saveProducts(products);
  }

  // Method to delete a product
  async deleteProduct(id) {
    let products = await this._readProducts();
    products = products.filter((p) => p.id !== id);
    await this._saveProducts(products);
  }

  // Helper method to save product to file
  async _saveProduct(product) {
    let products = await this._readProducts();
    products.push(product);
    await this._saveProducts(products);
  }

  // Helper method to read products from file
  async _readProducts() {
    try {
      const products = await fetch(this.path);
      return await products.json();
    } catch (err) {
      return [];
    }
  }

  // Helper method to save products to file
  async _saveProducts(products) {
    await fetch(this.path, {
      method: "PUT",
      body: JSON.stringify(products),
    });
  }
}

////////////////////////////

const productManager = new ProductManager("products.json");

// Add product
productManager.addProduct({
    title: "Product 1",
    description: "Description 1",
    price: 10,
    thumbnail: "thumbnail1.jpg",
    code: "code1",
    stock: 5
});

// Get all products
console.log(productManager.getProducts());

// Get product by id
const product = productManager.getProductById(1);
console.log(product);

// Update product
productManager.updateProduct(1, { price: 15 });
console.log(productManager.getProductById(1));

// Delete product
productManager.deleteProduct(1);
console.log(productManager.getProducts());