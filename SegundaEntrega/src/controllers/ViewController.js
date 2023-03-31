import ProductManager from "../dao/class/ProductManager.js";
import ProductsModel from "../dao/models/products.js";
import CartModel from "../dao/models/carts.js"
import CommonsUtil from '../utils/Commons.js'
import isEmpty from 'is-empty';

// const items = new ProductManager("products.json");

class ViewController {
  static async home(req, res) {
    try {
      const response = await ProductsModel.find().lean();
      return res.render("home", {
        style: "style.css",
        products: response,
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al listar productos",
        error: JSON.parse(err.message),
      });
    }
  }
  static realtimeproducts(req, res) {
    return res.render("realtimeproducts", {
      style: "style.css",
    });
  }

  static async products(req, res) {
    try {
        const { query} = req;
        const { limit = 3, page = 1, sort } = query
        const opts = { limit, page }
        if (sort === 'asc' || sort === 'desc') {
          opts.sort = { price: sort }   
        }
      let response = await ProductsModel.paginate(CommonsUtil.getFilter(query), opts);
      const newResponse = JSON.stringify(CommonsUtil.buidResponse( response ))
      response = JSON.parse(newResponse)
      return res.render("products", {
        style: "style.css",
        products: response
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al listar productos",
        error: JSON.parse(err.message),
      }); 
    }
  }

   static async getCart(req, res) {
        try {
            let { cid } = req.params;
            cid = Number(cid);
            if (isNaN(cid)) throw new Error(JSON.stringify({ detail: 'El id tiene que ser de tipo numérico' }));

            const cartById = await CartModel.findOne({ id: cid }).populate('products._id')
            if (isEmpty(cartById)) return res.status(404).json({ message: 'Carrito no encontrado' })

            const newProducts = cartById.products.map((product) => {
                return {
                    ...product._id._doc,
                    quantity: product._doc.quantity,
                    totalPrice: (product._doc.quantity * product._id.price).toFixed(2)
                }
            })
            const total = (newProducts.reduce((accumulator, current) => accumulator + Number(current.totalPrice), 0)).toFixed(2);
            return res.render('cart', {
                style: 'style.css',
                products: newProducts,
                total
            })
        } catch (err) {
            return res.status(400).json({
                message: 'Error al mostrar Carrito',
                error: JSON.parse(err.message)
            });
        }

    }
  static async addProductCartById(req, res) {
    try {
        let { cid, pid } = req.params;

        cid = Number(cid);
        if (isNaN(cid)) throw new Error(JSON.stringify({ detail: 'El id del carrito tiene que ser de tipo numérico' }));

        let cartById = await CartModel.findOne({ id: cid })
        if (!cartById) return res.status(404).json({ message: `No se encontró un carrito con el id ${cid}` })

        const productById = await ProductsModel.findOne({ _id: pid })
        if (!productById) return res.status(404).json({ message: `No se encontró un producto con el id ${pid}` })

        let listProduct = cartById.products;
        const searchProductByIdInCart = listProduct.find(data => data._id.toString() === pid);
        if (!isEmpty(searchProductByIdInCart)) {
            listProduct = listProduct.map((item) => {
              if (item._id.toString() !== pid) return item;
                return {
                  _id: item._id,
                  quantity: ++item.quantity
                }
            })
        }
        else {
            listProduct.push({
              _id: pid,
              quantity: 1
            })
        }
        await CartModel.updateOne({ id: cid }, { $set: { products: listProduct } })
        return res.json({
            message: 'El producto fue agregado al carrito exitosamente'
        });
    } catch (err) {
        return res.status(400).json({
            message: 'Error al insertar un producto en el carrito',
            error: (err.message)
        });
    }
}

}

export default ViewController;
