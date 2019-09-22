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

    // PUT posts update /posts/:id
    async postUpdate(req, res, next) {
    //   find the post by id
    let post = await Post.findById(req.params.id);
    //   check if there's any images for deletion
    if (req.body.deleteImages && req.body.deleteImages.length) {
        // assign deletImages from req.body to its own variable
        let deleteImages = req.body.deleteImages;
        // loop over deleteImages
        for(const public_id of deleteImages) {
            // delete images from cloudinary
            await cloudinary.v2.uploader.destroy(public_id);
            // delete image from post.images
            for (const image of post.images) {
                if (image.public_id === public_id) {
                    let index = post.images.indexOf(image);
                    post.images.splice(index, 1);
                }
            }
        }
    }
    // check if there are any new images for upload
    if (req.files) {
        // upload images        
        for(const file of req.files) {
            let image = await cloudinary.v2.uploader.upload(file.path);
            // add images to post.images array
            post.images.push({
                url: image.secure_url,
                public_id: image.public_id
            });
        }        
    }
    // update the post with any new properties
    post.title = req.body.post.title;
    post.description = req.body.post.description;
    post.price = req.body.post.price;
    post.location = req.body.post.location;
    // save the update post into the db
    post.save();
    // redirect to show page
        res.redirect(`/posts/${post.id}`);
    },

    // DELETE posts destroy /posts/:id
    async postDestroy(req, res, next) {
        let post = await Post.findById(req.params.id);
        for(const image of post.images) {
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        await post.remove();
        res.redirect('/posts');
    }
}