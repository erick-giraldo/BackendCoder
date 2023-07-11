import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const request = supertest('http://localhost:8080');

describe('Product Test', function () {
    it('Validamos que el listado de productos sea un array', async function () {
        const { statusCode, _body: { payload } } = await request.get('/api/products');
        expect(statusCode).to.equal(200)
        expect(payload).to.not.be.equal(null)
        expect(Array.isArray(payload)).to.be.ok;
    })
    it('Validamos la busqueda de un producto por id', async function () {
        const result = await request.get('/api/products/1');
        expect(result.statusCode).to.equal(200)
        expect(result._body.data).to.be.an('object');;
        expect(result._body.data).to.be.have.property('_id');
    })
    it('Validamos que al crear un producto sin haber iniciado sesion devuelve un estado 401', async function () {
        const payload = {
            // "title": "Pulsera Corazones Rosa 2",
            "description": "Pulsera de corazones bañado en oro 2",
            "code": "bElYx37QYVIw74huBnjg 2",
            // "price": 18.32,
            // "stock": 4,
            "category": "Accesorios"
        }
        const { statusCode, _body: { message } } = await request.post('/api/products').send(payload);
        const mess = 'Unauthorized '
        expect(statusCode).to.equal(401)
        expect(mess).to.be.equal(message);
    })
});