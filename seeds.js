const faker = require('faker');
const Post = require('./models/post');

async function seedPosts() {
    await Post.deleteMany({});
    for(const i of new Array(40)) {
        const post = {
            title: faker.lorem.word(),
            description: faker.lorem.text(),
            author: {
                "_id" : "5d8b522488322f39ac8286eb",
                "username" : "trey"
              }
        }
        await Post.create(post);
    }
    console.log('40 new posts created');
}

module.exports = seedPosts;