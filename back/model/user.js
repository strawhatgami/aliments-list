import sequelizeImport from 'sequelize';
const { DataTypes } = sequelizeImport;
import sequelize from "./connection.js";
import bcrypt from "bcrypt";

const instanceMethods = {
  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  verifyPassword(pw) {
    return bcrypt.compareSync(pw, this.password);
  },
}

const Model = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    unique: true,
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
}, {}, {
  timestamps: false,
  sequelize,
});

const getDescriptors = (methods) => {
  return Object.keys(methods).reduce((descriptors, key) => {
    descriptors[key] = Object.getOwnPropertyDescriptor(methods, key);
    return descriptors;
  }, {});
}

const augmentPrototype = (classObj, methods) => {
  Object.defineProperties(classObj.prototype, getDescriptors(methods));
}

augmentPrototype(Model, instanceMethods);

sequelize.sync();

export default Model;
