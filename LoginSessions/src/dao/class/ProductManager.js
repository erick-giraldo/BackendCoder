import fs from "fs";
import empty from "is-empty";

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }
  idCount = 0;

  async getProducts() {
    const exist = fs.existsSync(this.path);
    if (exist) {
      return await JSON.parse(fs.readFileSync(this.path, "utf-8"));
    }
    return [];
  }

  async getProductById(id) {
    const getProductos = await this.getProducts();
    const product = getProductos.find((p) => p.id === id);
    if (empty(product)) {
      return false;
    }
    return product;
  }

  async findProductCode(data) {
    let products = [];
    let codigoRepetido;
    const getProductos = await this.getProducts();
    const addCode = data
      .map((p) => {
        return p.code;
      })
      .toString();
    for (let i = 0; i < getProductos.length; i++) {
      for (let j = 0; j < getProductos[i].data.length; j++) {
        const code = getProductos[i].data[j].code;
        if (code === addCode) {
          codigoRepetido = addCode;
        }
      }
    }
    return codigoRepetido;
  }
  async addProduct(data) {
    const getProductos = await this.getProducts();
    if (!empty(getProductos)) this.products = getProductos;
    data.id = this.idCount++;
    this.products.push(data);
    fs.writeFileSync(this.path, JSON.stringify(this.products));
    return `El producto fue agregado exitosamente`;
  }

  async updateProducts(id, data) {
    let products = await this.getProducts();
    products = products.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        ...data,
        id,
      };
    });
    await fs.writeFileSync(this.path, JSON.stringify(products));
    return "El producto fue actualizado exitosamente";
  }

  async deleteProductById(title, id) {
    let products = await this.getProducts();
    products = products.map((p) => {
      if (p.title !== title) return p;
      return {
        title: p.title,
        data: p.data.filter((item) => item.id !== id),
      };
    });
    fs.writeFileSync(this.path, JSON.stringify(products));
    return `El producto fue eliminado exitosamente`;
  }
}
export default ProductManager;
