const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
const { cloudinary } = require('../cloudinary');

module.exports = {
    // GET /posts
    async postIndex(req, res, next) {
        let posts = await Post.paginate({}, {
            page: req.query.page || 1,
            limit: 10,
            sort: '-_id'
        });
        posts.page = Number(posts.page);
        res.render('posts/index', { posts, title: 'Posts Index', mapboxToken: process.env.MAPBOX_TOKEN });
    },

    //GET /posts/new
    postNew(req, res, next) {
        res.render('posts/new', {title: 'Posts New'})
    },

    //POST Create /posts
    async postCreate(req, res, next) {
        req.body.post.images = [];
        for(const file of req.files) {
            req.body.post.images.push({
                url: file.secure_url,
                public_id: file.public_id
            });
        }
        let response = await geocodingClient
        .forwardGeocode({
            query: req.body.post.location,
            limit: 1
        })
        .send();
        //use req.body to create a new post
        req.body.post.geometry = response.body.features[0].geometry;
        let post = new Post(req.body.post);
		post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
		await post.save();
        req.session.success = 'Post created successfully!';
        res.redirect(`/posts/${post.id}`);
    },

    //GET posts show /posts/:id
    async postShow(req, res, next) {
        //find posts by id
        let post = await Post.findById(req.params.id).populate({
            path: 'reviews',
            options: { sort: { '_id': -1 }},
            populate: {
                path: 'author',
                model: 'User'
            }
        });
        const floorRating = post.calculateAvgRating();
        res.render('posts/show', { post, floorRating });
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
            // add images to post.images array
            post.images.push({
                url: file.secure_url,
                public_id: file.public_id
            });
        }        
    }
    //check if location was updated
    if (req.body.post.location !== post.location) {
        let response = await geocodingClient
        .forwardGeocode({
            query: req.body.post.location,
            limit: 1
        })
        .send();
        post.geometry = response.body.features[0].geometry;
        post.location = req.body.post.location;
    }
    // update the post with any new properties
    post.title = req.body.post.title;
    post.description = req.body.post.description;
    post.price = req.body.post.price;
    post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
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
        req.session.success = "Post Deleted Successfully";
        res.redirect('/posts');
    }
}