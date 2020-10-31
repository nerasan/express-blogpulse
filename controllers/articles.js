let express = require('express')
let db = require('../models')
let router = express.Router()

// POST /articles - create a new post
router.post('/', (req, res) => {
  db.article.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId
  })
  .then((post) => {
    res.redirect('/')
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

// GET /articles/new - display form for creating new articles
router.get('/new', (req, res) => {
  db.author.findAll()
  .then((authors) => {
    res.render('articles/new', { authors: authors })
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

// POST route - create new comment
router.post('/:id/comments', (req, res) => {
  db.comment.create({
    name: req.body.name,
    content: req.body.content,
    articleId: req.body.articleId
  })
  .then((comment)=>{
      // find an article where the article id matches the one in the req.body
      db.article.findOne({
          where: {
              id: req.body.articleId,
          },
          // include the author and comment
          include: [db.author]
      })
      .then(article=>{
          article.addComment(comment)
      })
      res.redirect(`/articles/${req.body.articleId}`)
    })
    .catch((error)=>{
        console.log(error)
    })
})

// GET /articles/:id - display a specific post and its author
router.get('/:id', (req, res) => {
  db.article.findOne({
    where: { id: req.params.id },
    include: [db.author, db.comment]
  })
  .then((article) => {
    if (!article) throw Error()
    console.log(article.author)
    res.render('articles/show', { article: article, comments: article.comments})
  })
  .catch((error) => {
    console.log(error)
    res.status(400).render('main/404')
  })
})



// router.post('/:id', (req, res) => {
//   db.comment.create({
//     name: req.body.name,
//     content: req.body.content,
//     articleId: req.body.id
//   })
//   .then((comment)=>{
//     res.redirect('/:id')
//   })
//   .catch((error)=>{
//     console.log(error)
//   })
// })

module.exports = router
