import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.DB_CREDS || 'postgres://postgres:postgres@localhost:5556/postgres'
);
