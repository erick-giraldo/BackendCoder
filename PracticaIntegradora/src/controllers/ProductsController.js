import isEmpty from 'is-empty';
import ProductModel from '../dao/models/products.js'

class ProductController {

    static async getProducts(req, res) {
        try {
            let response = {};
            let { limit } = req.query;
            const products = await ProductModel.find();
            response = { products };
            if (!isEmpty(limit)) {
                limit = Number(limit);
                if (isNaN(limit)) { throw new Error(JSON.stringify({ limit: 'El límite tiene que ser de tipo numérico' })); }
                response = { products: products.slice(0, limit) };
            };
            return res.json(response);
        } catch (err) {
            return res.status(400).json({
                message: 'Error al listar productos',
                error: JSON.parse(err.message)
            });
        };
    }

    static async getProductById(req, res) {
        try {
            let { pid } = req.params;
            pid = Number(pid);
            if (isNaN(pid)) { throw new Error(JSON.stringify({ id: 'El id tiene que ser de tipo numérico' })) }
            const productById = await ProductModel.findOne({ id: pid })
            if (!productById) return res.status(404).json({ message: 'Producto no encontrado' })
            return res.json({
                message: "Producto encontrado",
                data: productById
            });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al buscar el producto',
                error: JSON.parse(err.message)
            });
        };
    }

    static async addProduct(req, res) {
        try {
            let error = {};
            const productData = req.body;
            const requiredFields = ['description', 'code', 'name','price', 'stock', 'category', 'image'];
            requiredFields.forEach(field => {
                if (!productData.hasOwnProperty(field)) {
                    error[field] = 'El campo es obligatorio';
                }
            });
            const allowedFields = [...requiredFields];
            Object.keys(productData).forEach(field => {
                if (allowedFields.includes(field) && isEmpty(productData[field])) {
                    error[field] = 'El campo no puede estar vacío';
                };
                if (!allowedFields.includes(field)) {
                    error[field] = 'El campo no esta permitido';
                };
            });
            if (!isEmpty(error)) throw new Error(JSON.stringify(error));
            await ProductModel.create(productData).catch(() => {
                throw new Error(JSON.stringify({ detail: 'El tipo de dato no es correcto o el código ya existe' }))
            })
            return res.json({ message: 'El producto fue agregado exitosamente' });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al agregar el producto',
                error: JSON.parse(err.message)
            });
        };
    }

    static async updateProduct(req, res) {
        try {
            let error = {};
            let { pid } = req.params;
            const productData = req.body;
            pid = Number(pid);
            if (isNaN(pid)) throw new Error(JSON.stringify({ id: 'El id tiene que ser de tipo numérico' }))

            if (isEmpty(productData)) throw new Error(JSON.stringify({ detail: 'No se ha ingresado nungún elemento a actualizar' }));

            let productById = await ProductModel.findOne({ id: pid })
            if (isEmpty(productById)) return res.status(404).json({ message: 'El producto a editar no existe' })

            const allowedFields = ['name', 'description', 'code', 'price', 'status', 'stock', 'category', 'image'];
            Object.keys(productData).forEach(field => {
                if (allowedFields.includes(field) && isEmpty(productData[field])) {
                    error[field] = 'El campo no puede estar vacío';
                };
                if (!allowedFields.includes(field)) {
                    error[field] = 'El campo no esta permitido';
                };
            });
            if (!isEmpty(error)) throw new Error(JSON.stringify(error));

            if (!isEmpty(productData.code)) {
                const productByCode = await ProductModel.findOne({ code: productData.code })
                if (!isEmpty(productByCode) && productByCode.id !== pid) {
                    throw new Error(JSON.stringify({ detail: `El código ${productData.code} ya se encuentra regitrado` }));
                };
            }
            await ProductModel.updateOne({ id: pid }, { $set: productData }).catch(() => {
                throw new Error(JSON.stringify({ detail: 'El tipo de dato no es correcto' }))
            })
            return res.json({
                message: 'El producto fue actualizado exitosamente'
            });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al actualizar el producto',
                error: JSON.parse(err.message)
            });
        };
    }

    static async deleteProduct(req, res) {
        try {
            let { pid } = req.params;
            pid = Number(pid);
            if (isNaN(pid)) throw new Error(JSON.stringify({ detail: 'El id tiene que ser de tipo numérico' }));

            const productById = await ProductModel.findOne({ id: pid })
            if (isEmpty(productById)) return res.status(404).json({ message: 'El producto a eliminar no existe' })

            await ProductModel.deleteOne({ id: pid })
            return res.json({
                message: 'El producto fue eliminado exitosamente'
            });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al buscar el producto',
                error: JSON.parse(err.message)
            });
        };
    }

}

export default ProductController;