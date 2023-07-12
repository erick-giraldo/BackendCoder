import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const request = supertest("http://localhost:8080");

describe("Supertest", function () {
  describe("Product Test", function () {
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

    it("Validamos que el listado de productos sea un array", async function () {
      const {
        statusCode,
        ok,
        _body: { payload },
      } = await request
        .get("/api/products")
        .set("Cookie", `${cookie.name}=${cookie.value}`);
      expect(statusCode).to.equal(200);
      expect(ok).to.equal(true);
      expect(payload).to.not.be.equal(null);
      expect(Array.isArray(payload)).to.be.equal(true);
      expect(Array.isArray(payload)).to.be.ok;
    });
    it("Validamos la busqueda de un producto por id", async function () {
      const {
        statusCode,
        ok,
        _body: { data },
      } = await request
        .get("/api/products/64a714874f505fd1b1e32ab4")
        .set("Cookie", `${cookie.name}=${cookie.value}`);
      expect(statusCode).to.equal(200);
      expect(ok).to.equal(true);
      expect(data).to.be.an("object");
      expect(data).to.be.have.property("_id");
    });
    it("Validamos que al crear un producto sin haber iniciado sesion devuelve un estado 401", async function () {
      const payload = {
        name: "Fat Boy™",
        description:
          "Quo quos exercitationem atque. Distinctio eveniet iste. Occaecati amet architecto fugit quasi rerum maiores.",
        price: 457,
        status: true,
        stock: 3,
        category: "Sports",
        image: "https://picsum.photos/seed/UATvGWR/640/480",
      };
      const {
        statusCode,
        ok,
        _body: error,
      } = await request
        .post("/api/products")
        .send(payload)
        .set("Cookie", `${cookie.name}=${cookie.value}`);

      expect(statusCode).to.equal(500);
      expect(ok).to.equal(false);
      expect(error).to.be.have.property("message");
      expect(error.message).to.be.equal("El campo [ code ] es obligatorio");
    });
  });
});
