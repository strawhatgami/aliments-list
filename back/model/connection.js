import config from '../modules/config.js';
const { db } = config;
import sequelizeImport from 'sequelize';
const { Sequelize } = sequelizeImport;

const { name, user, password, host } = db;
const sequelize = new Sequelize(name, user, password, {
  dialect: 'mysql',
  host,
  logging: true,
  define: {
    charset: 'utf8mb4',
    dialectOptions: {
      collate: 'utf8mb4_general_ci'
    },
    freezeTableName: true
  }
});

export default sequelize;
