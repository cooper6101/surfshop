const Post = require('../models/post');
const Review = require('../models/review');

module.exports = {

    //POST reviews Create
    async reviewCreate(req, res, next) {
        //find post by id
        let post = await Post.findById(req.params.id);
        //create review
        req.body.review.author = req.user._id;
        let review = await Review.create(req.body.review);
        //asign review to post
        post.reviews.push(review);
        //save the post
        post.save();
        //redirect to the post
        req.session.success = "Review Created Successfully!";
        res.redirect(`/posts/${post.id}`);
    },

    // PUT reviews Update
    async reviewUpdate(req, res, next) {
        //find review by id and update
        await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
        req.session.success = 'Review Updated Successfully';
        res.redirect(`/posts/${req.params.id}`);
    },

    // DELETE reviews Destroy
    async reviewDestroy(req, res, next) {

    }
}