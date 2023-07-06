export default class ProductDTO {
  constructor(product) {
    this.name = product.name;
    this.description = product.description;
    this.code = product.code;
    this.price = product.price;
    this.status = product.status;
    this.stock = product.stock;
    this.category = product.category;
    this.image = product.image;
    this.id = product.id;
    this.owner = product.owner;
  }
}
