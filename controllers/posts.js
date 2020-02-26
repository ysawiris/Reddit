//connecting our control with our model
const Post = require('../models/post');
const User = require('../models/user');


module.exports = (app) => {
    // CREATE
    app.post("/posts/new", (req, res) => {
        if (req.user) {
            var post = new Post(req.body);
            post.author = req.user._id;

            post
                .save()
                .then(post => {
                    console.log(`The post: ${post}`)
                    return User.findById(post.author);
                })
                .then(user => {
                    console.log(`The user: ${user}`)
                    user.posts.unshift(post);
                    console.log(`The array: ${user.posts}`)
                    user.save();
                    // REDIRECT TO THE NEW POST
                    res.redirect(`/posts/${post._id}`);
                })
                .catch(err => {
                    console.log(err.message);
                });
        } else {
            return res.status(401); // UNAUTHORIZED
        }
    });

    // INDEX
    app.get('/', (req, res) => {
        const currentUser = req.user;
        // res.render('home', {});
        console.log(req.cookies);
        Post.find().populate('author')
            .then(posts => {
                res.render('posts-index', { posts, currentUser });
                // res.render('home', {});
            }).catch(err => {
                console.log(err.message);
            })
    })

    // SHOW
    app.get("/posts/:id", function(req, res) {
        const currentUser = req.user;
        // LOOK UP THE POST

        Post.findById(req.params.id).populate({ path: 'comments', populate: { path: 'author' } }).populate('author')
            .then(post => {
                res.render("posts-show", { post, currentUser });
            })
            .catch(err => {
                console.log(err.message);
            });
    });
    // SUBREDDIT
    app.get("/n/:subreddit", function(req, res) {
        const currentUser = req.user;
        Post.find({ subreddit: req.params.subreddit }).populate('author')
            .then(posts => {
                res.render("posts-index", { posts, currentUser });
            })
            .catch(err => {
                console.log(err);
            });
    });
};