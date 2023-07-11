import chai from 'chai';
import mongoose from 'mongoose';
import User from "../src/dao/users/mongo.js";

const expect = chai.expect;

describe('Pruebas al modulo de users dao with Chai.', function() {

  before(async function() {
    this.usersDao = new User();
    await mongoose.connect(`mongodb+srv://egiraldo:coder123@ecommerce.4uz8ssl.mongodb.net/ecommerce?retryWrites=true&w=majority&ssl=true`);
  })

  
  // beforeEach(async function() {
  //   await mongoose.connection.collections.users.drop();
  //   this.timeout(5000);
  // })

  after(async function() {
    await mongoose.connection.close();
  })

  afterEach(function() {
  })



  it('Debe crear un usuario de forma exitosa.', async function() {
    const result = await this.usersDao.create({
      first_name: 'Ernesto',
      last_name: 'Rojas',
      age: 25,
      email: 'ernesto20145@gmail.com',
      password: 'qwerty',
    });

    // expect(result).to.be.have.property('_id');
    // expect(result).to.be.have.property('pets');
    // expect(Array.isArray(result)).to.be.ok;
    // expect(result).to.be.deep.equal([]);
    // expect(result).to.be.have.property('email', 'ernesto20145@gmail.com');
  })

  // it('Debe obtener un usuario por email de forma exitosa.', async function() {
  //   await this.usersDao.save({
  //     first_name: 'Ernesto',
  //     last_name: 'Rojas',
  //     email: 'ernesto20145@gmail.com',
  //     password: 'qwerty',
  //   });

  //   const user = await this.usersDao.getBy({email: 'ernesto20145@gmail.com'})

  //   expect(user).to.be.a('object');
  //   expect(user).to.be.have.property('_id');
  //})

  it('Esperamos que el resultado de llamado a la función get sea un array.', async function() {
    const users = await this.usersDao.get();
    console.log("🚀 ~ file: User.test.js:29 ~ it ~ users:", users)
    expect(users).to.be.deep.equal([]);
    expect(users).to.have.lengthOf(0);
    expect(Array.isArray(users)).to.be.equal(true);
    expect(Array.isArray(users)).to.be.ok;
  })
  
})