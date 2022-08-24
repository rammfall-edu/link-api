'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('link', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      hash: {
        unique: true,
        type: Sequelize.TEXT,
        nullable: false,
      },
      link: {
        nullable: false,
        type: Sequelize.TEXT,
      },
    });
    await queryInterface.addColumn('link', 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('link');
  },
};
