import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../initializers/db';

class User extends Model {}

User.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    email: {
      unique: true,
      type: DataTypes.TEXT,
      nullable: false,
    },
    password: {
      type: DataTypes.TEXT,
      nullable: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: 'users',
  }
);

export default User;
