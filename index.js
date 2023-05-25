// requiring express and creating port
const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
const app = express();
const port= process.env.PORT || 8000;
const path=require('path')
const expressLayout = require('express-ejs-layouts');
// set view engine
app.set('view engine','ejs');
app.set('views','./views');
// DB Path
app.set('views',path.join(__dirname,'views'));
// extract style and scripts from subpages to layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
//Use router
app.use(express.static('./assets'));
app.use(expressLayout);

// Body Parser middleware.
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// using router
app.use('/',require('./routes/index'));
app.post('/someRoute', (req, res) => {
    console.log(req.body);
    res.send({ status: 'SUCCESS' });
});

//------------ DB Configuration ------------//
const db = require('./config/key').MongoURI;

//------------ Mongo Connection ------------//
mongoose.connect(db, { useNewUrlParser: true, 
    useUnifiedTopology: true, 
    retryWrites: true,
    w: "majority",})
.then(() => console.log("Successfully connected to MongoDB"))
.catch(err => console.log(err));

app.use(function (req, res) {
    res.setHeader('Content-Type', 'text/plain')
    res.write('you posted:\n')
    res.end(JSON.stringify(req.body, null, 2))
  })
// port where server listens
app.listen(port,function(err){
    if(err){
        console.log(`Error in starting the server : ${err}`);
        return ;
    }
    console.log(`Server is up and running on port : ${port}`);
})


