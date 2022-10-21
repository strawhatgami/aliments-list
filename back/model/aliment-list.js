import sequelize from "./connection.js";

// TODO move model name in constants
const Model = sequelize.define("AlimentList", {}, {}, {
  timestamps: false,
  sequelize,
});

export default Model;
