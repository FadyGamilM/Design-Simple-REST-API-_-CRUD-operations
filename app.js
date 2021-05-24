///////////////////////// Entry File //////////////////////////

// define requirments
const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
// const Blog=require('./models/blog');
const blogRoutes=require('./routes/blogRoutes');
const { render } = require('ejs');
const methodOverride=require('method-override');


// Fire express 
let app=express();

// Connect to DB using this connection string
const DBURI=`mongodb+srv://FadyG:Fady+Gamil+MongoDB1@cluster0.pxdzk.mongodb.net/sample_mern?retryWrites=true&w=majority`;
/**NOTES:
    *NOTE[1]: mongoose.connect() returns a promise, so we can pass
               a callback function to be fired when connection is ready.

    *NOTE[2]: we don't need to listen to the server requests befor our 
               connection is being established, so we will put the app.listen(3000) within the body
               of callback function the passed to .then method as following ==> .then(callback{app.listen()})   
    */
mongoose.connect(DBURI,{useNewUrlParser:true,useUnifiedTopology:true})
   .then((result)=>{
      // listen to specific port only when connection is established
      app.listen(3000);
      console.log('connection is done to Atlas..');
   })
   .catch((err)=>{console.log(err)});



/**After firing the express and setting the express app, we 
 * need to use template engine, so we write the following line 
*/
app.set('view engine','ejs');

// to use static files (like images and css styles..), we need to use this middleware..
app.use(express.static('./public'));
/**to handle some actions on POST method
 * this middleware do the following:
 * --> it grap all data that attached to the POST request
 *       and attach it to the request object, so we can handle 
 *       and use the data with some database operations */ 
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

// handle GET requests to our domain
   // Handling get request for root page '/'
app.get('/',(req,res)=>{
   /** To send the respond with dynamic html pages (views), we
    * won't use res.sendFile() any more, instead of that we will
    * use res.render() as shown following:
    */

   /**
    * Note[1]: when we use .render() express will look by default
    *          views folder to find our passed file on it.
    */
   
   res.redirect('/blogs');

});
   
   // Handling get request for about page '/about'
app.get('/about',(req,res)=>{
   res.status(200).render('about',{title:'About'});
});

   // NOTE[2]: Redirect Concept
      // we can redirect user from the url he/she writes to another url.
app.get('/about-us',(req,res)=>{
   res.redirect('/about');
});

// to use all blogRoutes and attach it to our main express app, we will use the app.use() middleware
app.use(blogRoutes);

   //Handling get request for any other page will get an error
app.all('*',(req,res)=>{
   res.status(404).render('error',{title:'404 Not Found'});
});

