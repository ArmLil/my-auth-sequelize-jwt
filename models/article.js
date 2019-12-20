"use strict";
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    "Article",
    {
      id: {
        type: DataTypes.UUID,
        autoIncrement: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      title: {
        type: DataTypes.STRING
      },
      content: {
        type: DataTypes.TEXT,
        defaultValue: "Default content ......."
      },
      author: {
        type: DataTypes.STRING,
        defaultValue: "Default author"
      },
      userId: DataTypes.UUID
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: false,
      tableName: "articles"
    }
  );
  Article.associate = function(models) {
    Article.belongsTo(models.User, {
      as: "user",
      targetKey: "id",
      foreignKey: "userId"
    });
  };
  return Article;
};
