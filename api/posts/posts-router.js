// implement your posts router here
const Post = require('./posts-model');

const router = require('express').Router();

router.get('/', (req, res) => {
    Post.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(() => res.status(500).json({
            message: `The posts information could not be retrieved`
        }))
})

router.get('/:id', (req, res) => {
    const { id } = req.params;
    Post.findById(id)
        .then(post => {
            (!post)
            ? res.status(404).json({
                message: `The post with the specified ID does not exist`
            })
            : res.status(200).json(post);
        })
        .catch(err => res.status(500).json({
            error: err.message
        }))
})

router.post('/', (req, res) => {
    const newPost = req.body;
    const { title, contents } = newPost;
    (!title || !contents)
    ? res.status(400).json({
        message: `Please provide title and contents for the post`
    })
    : Post.insert(newPost)
        .then(post => {
            const { id } = post;
            Post.findById(id)
                .then(post => res.status(201).json(post))
                .catch(err => res.status(500).json({ message: err.message }))
        })
        .catch(() => res.status(500).json({
            message: `There was an error while saving the post to the database`
        }))
})

router.put('/:id', (req, res) => {
    const updatedPost = req.body;
    const { title, contents } = updatedPost;
    const { id } = req.params;

    (!title || !contents)
    ? res.status(400).json({
        message: `Please provide title and contents for the post`
    })
    : Post.findById(id)
        .then(post => {
            (!post)
            ? res.status(404).json({
                message: `The post with the specified ID does not exist`
            })
            : Post.update(id, updatedPost)
                .then(post => {
                    Post.findById(id - post + 1)
                        .then(post => {
                            res.status(200).json(post);
                        })
                        .catch(err => res.status(500).json(err))
                })
                .catch(() => res.status(500).json({
                    message: `The post information could not be modified`
                }))
        })
        .catch(err => res.status(500).json({ message: err.message }))
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    Post.findById(id)
        .then(deletedPost => {
            (!deletedPost)
            ? res.status(404).json({
                message: `The post with the specified ID does not exist`
            })
            : Post.remove(id)
                .then(post => {
                    (!post)
                    ? res.status(500).json({message: `Something is wrong`})
                    : res.status(200).json(deletedPost);
                })
                .catch(() => res.status(500).json({
                    message: `The post could not be removed`
                }))
        })
        .catch(err => res.status(500).json({ message: err.message }))
})

router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    Post.findById(id)
        .then(post => {
            (!post)
            ? res.status(404).json({
                message: `The post with the specified ID does not exist`
            })
            : Post.findPostComments(id)
                .then(comments => {
                    res.status(200).json(comments);
                })
                .catch(err => res.status(500).json({ message: `The comments information could not be retrieved`, error: err.message }))
        })

})

module.exports = router;