var express=require('express');
var router=express.Router();

var local=require('../models/categories.js');






router.get('/list',function(req,res){
  

    local.find({},function(err,docs){
    if(err) return console.log(err);
    else{
    //console.log(docs);
    res.send(JSON.stringify(docs));
    };
    res.end();
    });
});


module.exports = router;