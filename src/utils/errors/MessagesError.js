export const generatorProdError = (data) => {
  return `One or more of the following fields are invalid or incomplete.
  List of required fields:
  - name        : ${data.name}
  - description  : ${data.description}
  - code         : ${data.code}
  - price        : ${data.price}
  - status       : ${data.status}
  - stock        : ${data.stock}
  - category     : ${data.category}
  - image        : ${data.image}
    `
  }