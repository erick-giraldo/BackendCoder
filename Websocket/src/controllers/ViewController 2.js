import ProductManager from '../class/ProductManager.js';

const items = new ProductManager("products.json");

class ViewController {

    static async home(req, res) {
        try {
            const response = await items.getProducts();
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
            style: 'home.css',
        })
    }

};

export default ViewController;