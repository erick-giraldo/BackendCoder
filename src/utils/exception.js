class Exception extends Error {
    constructor(message, statusCode, url) {
      super(message)
      this.statusCode = statusCode
      this.url=url
    }
  }
  
  export default Exception