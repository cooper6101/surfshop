const express = require('express');
const router = express.Router({mergeParams: true});
const { asyncErrorHandler } = require('../middleware');
const { 
    reviewCreate,
    reviewUpdate,
    reviewDestroy
} = require('../controllers/reviews');

/* POST reviews create /posts/:id/reviews */
router.post('/', asyncErrorHandler(reviewCreate));

/* PUT reviews index /reviews/:review_id */
router.put('/:review_id', (req, res, next) => {
    res.send('PUT /posts/:id/reviews/:review_id');
});

/* DELETE reviews destroy /reviews/:review_id */
router.delete('/:review_id', (req, res, next) => {
    res.send('DELETE /posts/:id/reviews/:review_id');
});
  
module.exports = router;