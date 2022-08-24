import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../initializers/db.mjs';

class Link extends Model {}

Link.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hash: {
      unique: true,
      type: DataTypes.TEXT,
      nullable: false,
    },
    link: {
      type: DataTypes.TEXT,
      nullable: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      nullable: false,
      foreignKey: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: 'link',
  }
);

export default Link;
