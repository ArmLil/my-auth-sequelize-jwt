'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    id: {
      type: DataTypes.UUID,
      autoIncrement: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      defaultValue: 'Default title'
    },
    content: {
      type: DataTypes.TEXT,
      defaultValue: 'Default content .......'
    },
    author: {
      type: DataTypes.STRING,
      defaultValue: 'Default author'
    },
    user_id: DataTypes.UUID
  }, {
    timestamps: false
  });
  Article.associate = function(models) {
    Article.belongsTo(models.User, {as: 'user', targetKey: "id", foreignKey: "user_id"})
  };
  return Article;
};
