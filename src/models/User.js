import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING(255),
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: false,
        validate: {
            len: [2, 50],
        },
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'lector',
        field: 'rol',
        validate: {
            isIn: [['admin', 'lector']],
        },
    },
}, {
    tableName: 'users',
    timestamps: true,
});

export default User;
