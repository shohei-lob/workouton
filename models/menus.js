'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Menu = loader.database.define(
  'menus',
  {
    menuId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    menuName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    scheduleId: {
      type: Sequelize.UUID,
      allowNull: false
    }
  },
  {
    freezeTableName:  true,
    timestamps: false,
    indexes: [
      {
        fields: ['scheduleId']
      }
    ]
  }
);

module.exports = Menu;