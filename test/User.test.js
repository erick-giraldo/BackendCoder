import mongoose from "mongoose";
import User from "../src/dao/users/mongo.js";
import Assert from "assert";

mongoose.connect(
  "mongodb+srv://egiraldo:coder123@ecommerce.4uz8ssl.mongodb.net/ecommerce?retryWrites=true&w=majority&ssl=true"
);

const assert = Assert.strict;

describe("Pruebas al modulo de users dao", () => {
  before(async () => {
    console.log('[before] Antes de la prueba')
  });

  beforeEach(async () => {
    console.log('[beforeEach] Antes de la prueba')
  });

  describe("Pruebas al crear usuario", () => {
    it("Deberia crear un usuario de forma exitosa", async () => {});

    it("Deberia fallar al intertar crear un usuario por falta de parametro email", async () => {});
  });

  describe("Pruebas al obtener usuario", () => {
    it("Debe obtener un usuario por su id exitosamente", async () => {});

    it("Debe fallar al obtener un usuario con un id que no existe", async () => {});
  });
 after(() => {
    console.log('[after] Despues de la prueba')
 });

 afterEach(() => {
    console.log('[afterEach] Despues de la prueba')
 });

});
