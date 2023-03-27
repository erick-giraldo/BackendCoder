import ProductManager from '../dao/class/ProductManager.js';
import ProductsModel from "../dao/models/products.js"

// const items = new ProductManager("products.json");

class ViewController {

    static async home(req, res) {
        try {
            const response = await ProductsModel.find().lean();
            return res.render('home', {
                style: 'style.css',
                products: response
            })
        } catch (err) {
            return res.status(400).json({
                message: 'Error al listar productos',
                error: JSON.parse(err.message)
            });
        };
    }
    static realtimeproducts(req, res) {
        return res.render('realtimeproducts', {
            style: 'style.css',
        })
    }

        static products(req, res) {
        return res.render('products', {
            style: 'style.css',
        })
    }

};

export default ViewController;