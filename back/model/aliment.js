import sequelizeImport from 'sequelize';
const { DataTypes } = sequelizeImport;
import sequelize from "./connection.js";

const classMethods = {
  associate: ({Aliment, AlimentList}) => {
// TODO move "foreignKey" & "as" in constants
    Model.belongsToMany(Aliment, {
      through: AlimentList,
      as: "aliments",
      //foreignKey: "list_id"
    });
  },
}

// TODO move model name in constants
const Model = sequelize.define("Aliment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  label: {
    unique: true,
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
}, {}, {
  timestamps: false,
  sequelize,
});

Object.assign(Model, classMethods);

export default Model;
