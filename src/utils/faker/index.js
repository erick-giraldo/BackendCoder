import { faker } from '@faker-js/faker'

export const generateProduct = () => ({
    name:faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    code: faker.string.alphanumeric({ length: 5 , casing: 'upper'}),
    price: parseFloat(faker.commerce.price()),
    status: faker.helpers.arrayElement([ true, false]),
    stock: parseInt(faker.string.numeric()),
    category: faker.commerce.department(),
    image: faker.image.url(),
    id: faker.database.mongodbObjectId(),
})