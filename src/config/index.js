export default {
  presistanceType: process.env.PERSISTENCE_TYPE || "memory",
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/contacts",
  port: process.env.NODE_PORT || 8080,
  nodeEnv: process.env.NODE_ENV || "desarrollo",
};
