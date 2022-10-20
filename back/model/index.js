import services from "./services";

export { default as sequelize } from "./connection.js";
export { default as User, ensureAdmin, ensureGeneratePlaylists } from "./user.js";

const models = { User };

Object.values(models).forEach((model) => model.associate && model.associate(models));

export const multipart = services(models);
