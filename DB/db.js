
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://devansh:devansh@cluster0.hmmqntd.mongodb.net/?retryWrites=true&w=majority' , {useNewUrlParser:true, useUnifiedTopology:true});

const db = mongoose.connection;

db.on("error",console.error.bind(console , "Connection Error") );
db.once("open" , function(){
    console.log("Successfully connected with Mongo");
})
