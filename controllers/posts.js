const Post = require('../models/post');

module.exports = {
    // GET /posts
    async getPosts(req, res, next) {
        let posts = await Post.find({});
        res.render('posts/index', { posts });
    },

    //GET /posts/new
    newPost(req, res, next) {
        res.render('posts/new')
    },

    //POST Create /posts
    async createPost(req, res, next) {
        //use req.body to create a new post
        let post = await Post.create(req.body);
        res.redirect(`/posts/${post.id}`);
    },

    //GET posts show /posts/:id
    async showPost(req, res, next) {
        //find posts by id
        let post = await Post.findById(req.params.id);
        res.render('posts/show', { post });
    }
}