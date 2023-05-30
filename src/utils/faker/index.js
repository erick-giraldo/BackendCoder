import { faker } from '@faker-js/faker'

export const generateProduct = (id) => ({
    _id: faker.database.mongodbObjectId(),
    name:faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    code: faker.string.alphanumeric({ length: 5 , casing: 'upper'}),
    price: parseFloat(faker.commerce.price()),
    status: faker.helpers.arrayElement([ true, false]),
    stock: parseInt(faker.string.numeric()),
    category: faker.commerce.department(),
    image: faker.image.url(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    __v: 0,
    id,
})