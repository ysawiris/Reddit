//connecting our control with our model
const Post = require('../models/post');


module.exports = (app) => {
  // CREATE
    app.post('/posts/new', (req, res) => {
      // INSTANTIATE INSTANCE OF POST MODEL
      const post = new Post(req.body);

      // SAVE INSTANCE OF POST MODEL TO DB
      post.save((err, post) => {
        console.log(err);
        console.log(post);
        // REDIRECT TO THE ROOT
        return res.redirect(`/`);
      })
  });

  app.get('/', (req, res) => {
    Post.find({})
    .then(posts => {
        res.render("posts-index.handlebars", {posts});
    })
    .catch(err => {
      console.log(err.message);
    });
  });
};