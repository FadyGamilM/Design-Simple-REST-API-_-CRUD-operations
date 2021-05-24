const express=require('express');
const router=express.Router();
// const Blog=require('../models/blog');
const blogController=require('../controllers/blogController');
const Blog = require('../models/blog');

//home route, to display all blogs
router.get('/blogs',blogController.blog_index);

// handle the POST request to /blogs 
router.post('/blogs',blogController.blog_create_post);

// route to handle the get request to the create page
router.get('/blogs/create',blogController.blog_create_get);

// very tricky note.. if we put the /blogs/create after /blogs/:id, it will give us an error because JS code is executed from top to bottom, so when we click to New Blog link which will fire a get request to /blogs/create, this will cacth the /blogs/:id first and will try to find in database a blog with id=create and this is not right.. awsome!
// details route, that display the details page for each blog

// this GET request comes when we press the link that in index.ejs that has href="/blogs/blog._id"
router.get('/blogs/:id',blogController.blog_details);

//handle the delete request
// router.delete('/blogs/:id',blogController.blog_delete);
router.delete('/blogs/:id',blogController.blog_delete_new);

//handle get request to /blogs/edit
router.get('/blogs/:id/edit',blogController.blog_edit);

//PUT or UPDATE request that comes from edit.ejs form
router.put('/blogs/:id',blogController.blog_updateHandler);
module.exports=router;