"use strict";

let db = require("../models");
const jwt = require("jsonwebtoken");

async function getArticles(req, res) {
  try {
    let articles = await db.Article.findAndCountAll({
      include: [
        {
          model: db.User,
          as: "user"
        }
      ]
    });

    let count = articles.count;

    articles = articles.rows.map(article => {
      if (article.dataValues.user) {
        delete article.dataValues.user.dataValues.password;
      }
      return article;
    });

    res.json({
      articles,
      count
    });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function getArticleById(req, res) {
  console.log("function getArticleById");
  try {
    let article = await db.Article.findByPk(req.params.id, {
      include: [
        {
          model: db.User,
          as: "user"
        }
      ]
    });
    if (!article) {
      throw new Error("validationError: Article with this id is not found!");
    }

    if (article.dataValues.user) {
      delete article.dataValues.user.dataValues.password;
    }

    res.json({ article });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function createArticle(req, res) {
  console.log("function createArticle");
  try {
    const articles = await db.Article.findAndCountAll();

    if (articles.count !== 0) {
      const findArticleByTitle = await db.Article.findOne({
        where: { title: req.body.title }
      });
      if (findArticleByTitle) {
        throw new Error(
          "validationError: Article with this title already exists!"
        );
      }
    }
    let user_id;
    if (req.user) {
      user_id = req.user.data.id;
    } else if (req.body.user_id) {
      user_id = req.body.user_id;
    }

    let options = {};
    if (req.body.title) options.title = req.body.title;
    if (req.body.content) options.content = req.body.content;
    if (req.body.author) options.author = req.body.author;
    options.user_id = user_id;
    console.log({ options });

    const article = await db.Article.findOrCreate({
      where: options
    });

    res.json({ article });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function updateArticle(req, res) {
  console.log("function updateArticle");
  try {
    const article = await db.Article.findByPk(req.params.id);
    if (!article)
      throw new Error("validationError: Article by this id is not found!");

    //check title
    //do not let article to update his title with an title which already exists
    const findArticleByTitle = await db.Article.findOne({
      where: { title: req.body.title }
    });
    if (article.title !== req.body.title && findArticleByTitle) {
      throw new Error(
        "validationError: Article with this title already exists!"
      );
    }

    if (req.body.title) article.title = req.body.title;
    if (req.body.content) article.content = req.body.content;
    if (req.body.author) article.author = req.body.author;
    if (req.body.user_id) article.user_id = req.body.user_id;

    await article.save();
    res.json({ article });
  } catch (err) {
    console.error(err);
    res.json({ errorMessage: err.message });
  }
}

async function deleteArticle(req, res) {
  console.log("function deleteArticles");
  try {
    const article = await db.Article.findByPk(req.params.id);
    if (!article) {
      throw new Error("validationError: Article by this id is not found!");
    }
    await article.destroy();
    res.json({ massage: `article ${article.title}, ${article.id} is deleted` });
  } catch (error) {
    console.error(error);
    res.json({ errorMessage: error.message });
  }
}

module.exports = {
  getArticles: getArticles,
  getArticleById: getArticleById,
  createArticle: createArticle,
  updateArticle: updateArticle,
  deleteArticle: deleteArticle
};
