import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize('login_seguro', process.env.usuario, process.env.contrasenia, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

export default sequelize;
