// implement your server here
// require your posts router and connect it here
const express = require('express');
const server = express();

server.use(express.json());

const postsRouter = require('./posts/posts-router');

server.use('/api/posts', postsRouter);

server.get('*', (req, res) => {
    res.status(404).send(`
      <h2>Lambda Shelter API</h>
      <p>Oops, we cannot find that resource</p>
    `);
});
  
module.exports = server;