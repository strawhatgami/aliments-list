import User from "./user.js";
import List from "./list.js";
import AlimentList from "./aliment-list.js";
import Aliment from "./aliment.js";

import sequelize from "./connection.js";

export { default as sequelize } from "./connection.js";
export { default as User } from "./user.js";
export { default as Aliment } from "./aliment.js";
export { default as List } from "./list.js";

export const models = { User, Aliment, List, AlimentList };

Object.values(models).forEach((model) => model.associate && model.associate(models));

sequelize.sync();
