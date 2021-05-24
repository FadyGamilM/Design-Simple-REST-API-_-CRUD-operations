const Blog=require('../models/blog');

//function to be the callback to route that display all blogs
const blog_index= async (req,res)=>{
   try{
      let query={};
      if(req.query.snippet)//if req.query has snippet on it not any rubbish else
      {
         query.snippet=req.query.snippet;
      }
      //once data comes, await resume execution.
      /**remember that when we called function that return promise, and we use .then(callback(value))
       * when the value comes, it fetch the execution of the callback that passed to .then(),
       * in our sentatic suger async-await here, the value that returned, is evaluated and returned in place
       * of await Blog.find(), and then passed to SearchResult, so now Search result has the value.
       */
      let SearchResult=await Blog.find(query);
      res.render('index',{title:'All Blogs',blogs:SearchResult});
   }catch{
      res.send('err');
   }
};

//function to be the callback to route that display details view for each blog individually
const blog_details=async (req,res)=>{
   try{
      const Blog_ID=req.params.id;
      let required_blog=await Blog.findById(Blog_ID);
      res.render('details',{
         title:`${required_blog.title} blog`,
         blog:required_blog,
         error:""         
      });
   }catch{
      res.redirect('blogs');   
   } 
};

//function to be the callback to route that creates a new blog
const blog_create_get=(req,res)=>{
   res.render('create',{title:'Create Blogs',error:""});
};

//function to be the callback to the route that we send POST request to it
const blog_create_post=async (req,res)=>{
   try{
      const blog=new Blog(req.body);
      let savedBlog=await blog.save();
      //render user to /blogs to view all blogs after adding a new blog
      res.redirect('/blogs');
   }catch{
      res.render('create',{
         title:'Create Blogs',
         error:"Can't Add a new Blog"
      });   
   }
};

const blog_delete=async(req,res)=>{
   let deleted_blog;
   try{
      const Blog_ID=req.params.id;
      deleted_blog= await Blog.findByIdAndDelete(Blog_ID);
      res.json({redirect:'/blogs'});
   }catch{
      res.render('details',{
         title:`${deleted_blog.title} blog`,
         blog:deleted_blog,
         error:"We Cannot Delete This Blog Now, Try Later!" 
      })
   }
};

const blog_edit=async(req,res)=>{
   let blog_toBeModified;
   try{
      blog_toBeModified=await Blog.findById(req.params.id);
      res.render('edit',{
         title:'Edit Blog',
         error:"",
         blog:blog_toBeModified});
   }catch{
      res.render('details',{
         title:`${blog_toBeModified.title} blog`,
         blog:blog_toBeModified,
         error:"We Cannot Delete This Blog Now, Try Later!"
      });
   }

};

const blog_delete_new=(req,res)=>{
   res.send('delete blog'+req.params.id);
};



const blog_updateHandler= (req,res)=>{
   if(!req.body){
      res.send("user doesn't edit any values");
   }
   const id=req.params.id;
   Blog.findByIdAndUpdate(id,req.body,{useFindAndModify:false})
   .then((data)=>{
      if(!data){
      res.send("error in ipdating");
   }else{
      res.send(data);
   }})
   .catch((Err)=>{res.send(Err);})
};
//    // create new Blog object that holds the new modified data, notice that i put the value of each field that viewed to user by old value of each field, so if user didn't change any thing, we won't change any thing also in db as all the following parameters will be the same 
//    let modifiedBlog=new Blog({
//       title:req.body.title,
//       snippet:req.body.snippet,
//       body:req.body.body
//    });
//    try{
//       // modifiedBlog after the following line will be equales the old data, but we will make sure of 2 things:
//          //[1]==> we found this blog in DB
//          //[2]==> we make that modifiedBlog a Blog variable which has props. like .title, .snippet, and .body
//       modifiedBlog=await Blog.findById(req.params.id);
//       // // add the new updated value to modifiedBlog.Fields
//       // modifiedBlog.title=req.body.title;
//       // modifiedBlog.snippet=req.body.snippet;
//       // modifiedBlog.body=req.body.body;
//       await modifiedBlog.save();
//       res.redirect('details');   
//    }catch{
//       res.send('error happend');
//       // res.render('details',{
//       //    title:`${modifiedBlog.title} blog`,
//       //    blog:modifiedBlog,
//       //    error:"Cannot Update Now, Try Later!"
//       // });    
//    }

// };


module.exports={
   blog_index,
   blog_details,
   blog_create_get,
   blog_create_post,
   blog_delete,
   blog_edit,
   blog_delete_new,
   blog_updateHandler
};