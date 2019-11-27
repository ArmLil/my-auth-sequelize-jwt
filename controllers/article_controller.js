"use strict"

let db = require('../models');


async function getArticles(req, res) {
  console.log('function getArticle');
  try {
    const articles = await db.Article.findAndCountAll({
      include: [{
          model: db.User,
          as: "user"
        }]
    });
    res.json({
      articles: articles.rows,
      count: articles.count
    });
  } catch(error) {
    console.error(error)
    res.json({
      errorMessage: error.message
    })
  }

}

async function getArticleById(req, res) {
  console.log('function getArticleById');
  try {
    const article = await db.Article.findByPk(req.params.id, {
      include: [{
          model: db.User,
          as: "user"
        }]
    });
    if (!article) {
        throw new Error('validationError: Article with this id is not found!')
    }
    res.json({article})
  } catch(error) {
    console.error(error)
    res.json({
      errorMessage: error.message
    })
  }
}

async function createArticle(req, res) {
  console.log('function createArticle');
  try {
    //check title
    //do not let article to update his title with a title which already exists
    const findArticleByTitle = await db.Article.findOne({where:{title: req.body.title}})
    if (findArticleByTitle) {
        throw new Error('validationError: Article with this title already exists!')
    }

    const article = await db.Article.findOrCreate({
      where: {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        user_id: req.body.user_id}
    })

    res.json({article});

  } catch(error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    })
  }
}

async function updateArticle(req, res) {
  try {
    const article = await db.Article.findByPk(req.params.id);
    if(!article) throw new Error('validationError: Article by this id is not found!')

    console.log('article=', article.toJSON(), 'req.body=', req.body);

    //check title
    //do not let article to update his title with an title which already exists
    const findArticleByTitle = await db.Article.findOne({where:{title: req.body.title}})
    if (article.title !== req.body.title && findArticleByTitle) {
      throw new Error('validationError: Article with this title already exists!')
    }

    if (req.body.title) article.title = req.body.title;
    if (req.body.content) article.content = req.body.content;
    if (req.body.author) article.author = req.body.author;
    if (req.body.user_id) article.user_id = req.body.user_id;


    await article.save()
    res.json({article})

  } catch (err) {
    console.error(err);
    res.json({errorMessage: err.message})
  }
}


async function deleteArticle(req, res) {
  console.log('function deleteArticles');
  try {
    const article = await db.Article.findByPk(req.params.id);
    if(!article) {
      throw new Error('validationError: Article by this id is not found!')
    }
    await article.destroy();
    res.json({"massage": `article ${article.title}, ${article.id} is deleted`})
  } catch(error) {
    console.error(error)
    res.json({errorMessage: error.message})
  }
}

module.exports = {
  getArticles: getArticles,
  getArticleById: getArticleById,
  createArticle: createArticle,
  updateArticle: updateArticle,
  deleteArticle: deleteArticle
}
