const Post = require('../models/post');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dmcponkuf',
    api_key: '534365149354957',
    api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = {
    // GET /posts
    async postIndex(req, res, next) {
        let posts = await Post.find({});
        res.render('posts/index', { posts });
    },

    //GET /posts/new
    postNew(req, res, next) {
        res.render('posts/new')
    },

    //POST Create /posts
    async postCreate(req, res, next) {
        req.body.post.images = [];
        for(const file of req.files) {
            let image = await cloudinary.v2.uploader.upload(file.path);
            req.body.post.images.push({
                url: image.secure_url,
                public_id: image.public_id
            });
        }
        //use req.body to create a new post
        let post = await Post.create(req.body.post);
        res.redirect(`/posts/${post.id}`);
    },

    //GET posts show /posts/:id
    async postShow(req, res, next) {
        //find posts by id
        let post = await Post.findById(req.params.id);
        res.render('posts/show', { post });
    },

    //GET posts edit /posts/:id/edit
    async postEdit(req, res, next) {
        let post = await Post.findById(req.params.id);
        res.render('posts/edit', { post });
    },

    // PUT posts index /posts/:id
    async postUpdate(req, res, next) {
        let post = await Post.findByIdAndUpdate(req.params.id, req.body.post);
        res.redirect(`/posts/${post.id}`);
    },

    // DELETE posts destroy /posts/:id
    async postDestroy(req, res, next) {
        await Post.findByIdAndRemove(req.params.id);
        res.redirect('/posts');
    }
}