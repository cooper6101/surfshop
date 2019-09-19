const express = require('express');
const router = express.Router({mergeParams: true});

/* GET reviews index /posts/:id/reviews */
router.get('/', (req, res, next) => {
    res.send('INDEX /posts/:id/reviews');
});

/* POST reviews create /posts/:id/reviews */
router.post('/', (req, res, next) => {
    res.send('CREATE /posts/:id/reviews');
});

/* GET reviews edit /reviews/:id/edit */
router.get('/:review_id/edit', (req, res, next) => {
    res.send('GET /posts/:id/reviews/:review_id/edit');
});

/* PUT reviews index /reviews/:review_id */
router.put('/:review_id', (req, res, next) => {
    res.send('PUT /posts/:id/reviews/:review_id');
});

/* DELETE reviews destroy /reviews/:review_id */
router.delete('/:review_id', (req, res, next) => {
    res.send('DELETE /posts/:id/reviews/:review_id');
});
  
module.exports = router;