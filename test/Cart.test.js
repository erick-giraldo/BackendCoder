import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const request = supertest("http://localhost:8080");

describe("Supertest", function () {
  describe("Cart Test", function () {
    let cookie;

    it("Se debe logear para poder acceder a las rutas protegidas", async function () {
      const credentialsMock = {
        email: "egiraldom1@outlook.com",
        password: "Coder123@",
      };
      const response = await request
        .post("/api/auth/login")
        .send(credentialsMock);
      const cookiesResult = response.headers["set-cookie"][0];
      expect(cookiesResult).to.be.ok;

      cookie = {
        name: cookiesResult.split("=")[0],
        value: cookiesResult.split("=")[1],
      };

      expect(cookie.name).to.be.ok.and.to.equal("token");
      expect(cookie.value).to.be.ok;
    });

    it("Validamos que al buscar un carrito con un id no numérico devuelve un estado 400", async function () {
      const { statusCode, ok, _body: error } = await request.get("/api/carts/sd").set("Cookie", `${cookie.name}=${cookie.value}`);
      expect(statusCode).to.equal(400);
      expect(ok).to.equal(false);
      expect(error).to.be.have.property("message");
      expect(error.error).to.be.equal(
        "El id del carrito tiene que ser de tipo numérico"
      );
    });

    it("Validamos que se actualizen todos los productos de un carrito mediante su cartID", async function () {
      const payload = {
        products: [
          {
            _id: "6426439d69f571391d2dcbd6",
            quantity: 5,
          },
          {
            _id: "6426434a69f571391d2dcbd4",
            quantity: 1,
          },
        ],
      };

      const { statusCode, ok, _body: data } = await request.put("/api/carts/qty/3/products").send(payload).set("Cookie", `${cookie.name}=${cookie.value}`);
        expect(statusCode).to.equal(200);
        expect(ok).to.equal(true);
        expect(data).to.be.an("object");
        expect(data).to.not.have.property("error");
    });

    it('Validamos que se descuente 1 unidad de un producto especifico del carrito mediante su cartID y productID', async function () {
        const { statusCode, ok, _body: data } = await request.put('/api/carts/4/product/6426439d69f571391d2dcbd6').set("Cookie", `${cookie.name}=${cookie.value}`);
        expect(statusCode).to.equal(200)
        expect(ok).to.equal(true);
        expect(data).to.not.be.null;
        expect(data.message).to.be.equal("Se desconto Productos del carrito exitosamente");
    })
  });
});
