import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const request = supertest("http://localhost:8080");

describe("Supertest", function () {
  describe("Session's test", function () {
    let email;
    let cookie;

    before(async function () {
      email = `egiraldom${Date.now()}@gmail.com`;
    });

    it("se Debe registar un usuario de forma correcta.", async function () {
      const userMock = {
        first_name: "Erick",
        last_name: "Giraldo",
        age: 25,
        email,
        password: "Coder123@",
        role: "admin",
      };

      const response = await request.post("/api/auth/register").send(userMock);

      expect(response._body).to.be.ok;
    });

    it("Se debe logear el usuario creado satisfactoriamente.", async function () {
      const credentialsMock = {
        email,
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

    it("Current debe mostrar los datos del usuario actual.", async function () {
      const { statusCode, ok, _body: { data } } = await request.get("/api/auth/current").set("Cookie", `${cookie.name}=${cookie.value}`);

      expect(ok).to.equal(true);
      expect(statusCode).to.equal(200);
      expect(data.email).to.be.ok.and.to.equal(email);
      //console.log("current", data);
    });

    it("Debe mostrar un error si el usuario no existe.", async function () {
      const credentialsMock = {
        email: "noexiste@example.com",
        password: "Contraseña123@",
      };
      const {
        statusCode,
        ok,
        _body: body,
      } = await request.post("/api/auth/login").send(credentialsMock);

    expect(ok).to.equal(false);
    expect(statusCode).to.equal(500);
    expect(body.message).to.equal(
      "Usuario no encontrado, por favor intente nuevamente"
    );
  });

  it("Debe Listar todos los usuarios y esperamos que el resultado de llamado a la función get sea un array ", async function () {
    const { statusCode, ok, _body: data } = await request.get("/api/users/").set("Cookie", `${cookie.name}=${cookie.value}`);
    expect(ok).to.equal(true);
    expect(statusCode).to.equal(200);
    expect(Array.isArray(data)).to.be.equal(true);
    expect(Array.isArray(data)).to.be.ok;
    //console.log("_body", data);
  });


});
});
