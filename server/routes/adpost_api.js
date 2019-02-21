var express=require('express');
var router=express.Router();
var mongojs=require('mongojs');
var local=require('../models/adpost.js');
var multer=require('multer');
var fs=require('fs');
var filename1=[];
//npm install multer in node folder
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/')
    },
    filename:function(req,file,cb){
        var _fname = mongojs.ObjectId()+file.originalname;
        filename1.push({imagepic:_fname,Originalname:file.originalname,_id:mongojs.ObjectId()});
        cb(null,_fname);
    }
});
var upload=multer({storage:storage});



router.post('/add',upload.array("uploads[]",12),function(req,res){
    console.log('/add----------------------------');
   console.log(req.body);
   console.log(upload.array("uploads[]",12));
   
       
       
   var s=[];
   
   
       var data= {
           _id:mongojs.ObjectId(),
           item_name:req.body.item_name,
           price:req.body.price, 
           state_name:req.body.state_name,  
           city_name:req.body.city_name,
           name:req.body.name,
           date:req.body.date,
           brand:req.body.brand,
           condition:req.body.condition,
           status:"Active",
           
           
           images:filename1,
           phone:req.body.phone,
           email:req.body.email,
           area:req.body.area,
        
        description:req.body.description,
        category:req.body.category





        //    subcategories:JSON.parse(req.body.subarr),
       }
    


   var newrecord=new local(data);
   newrecord.save(function(err,result){
       filename1.length=0;
       if(err){
           throw(err);
       }
       res.status(200).send({msg:"Success"});
   });
   
   
   
   });

router.get('/listing',function(req,res){
    console.log("Listing Called");
    
    
    local.find({'status':"Active"},function(err,docs){
        
        if(err) return console.log(err);
        else{
        //console.log(docs);
        res.send(JSON.stringify(docs));
        };
        res.end();
        });

});
router.get('/loadAll',function(req,res){
    console.log("loadAll Called");
    
    
    local.find({},function(err,docs){
        
        if(err) return console.log(err);
        else{
        //console.log(docs);
        res.send(JSON.stringify(docs));
        };
        res.end();
        });

});

router.post('/search',function(req,res){
    console.log("Listing Called");
    console.log(req.body.obj);
    
    
    local.find({'item_name': {'$regex': req.body.obj.item_name,'$options': 'i'},'city_name':req.body.obj.city_name,'state_name':req.body.obj.state_name,'status':"Active"},function(err,docs){
        
        if(err) return console.log(err);
        else{
        //console.log(docs);
        res.send(JSON.stringify(docs));
        };
        res.end();
        });

});
router.get('/listingspecific/:name',function(req,res){
    console.log("Listing Specific Called");
    console.log(req.body.obj);
    
    
    local.find({'category': {'$regex': req.params.name,'$options': 'i'},'status':"Active"},function(err,docs){
        
        if(err) return console.log(err);
        else{
        //console.log(docs);
        res.send(JSON.stringify(docs));
        };
        res.end();
        });

});
router.post('/page1/',function(req,res){
    console.log("page1 Called");
    console.log(req.body.data);
    var page=1;
    if(req.body.data.Page != undefined)
        page=req.body.data.Page;
    
    var cursor=local.find({'category': {'$regex': req.body.data.s,'$options': 'i'},'status':"Active"},).skip((page-1)*2).limit(2);
   cursor.exec(function(err,docs){
        
        if(err) return console.log(err);
        else
       
        res.json(docs);
        
        

});
});

router.post('/page',function(req,res){
    console.log('/page');
      console.log(req.body.data);
      var page=1;
      if(req.body.data.Page != undefined)
          page=req.body.data.Page;
      var cursor=local.find({'status':"Active"}).skip((page-1)*2).limit(2);
    //       { $lookup:{
    //       from:'ads',
    //       localField:'Country_id',
    //       foreignField:'_id',
          
          
    //       as:'country_docs'
    //       }
    //   }
         
          
          cursor.exec(function(err,docs){
          res.json(docs);
          });
  });
  
  
  
  
  
  
  router.get('/calc',function(req,res){
   local.find({},function(err,docs){
      if(err) return console.log(err);
      else{
      console.log(docs);
      res.send(JSON.stringify(docs));
      };
     // res.end();
      });
  
  
  });

  router.get('/calc1/:name',function(req,res){
    local.find({'category': {'$regex': req.param.name,'$options': 'i'},'status':"Active"},function(err,docs){
       if(err) return console.log(err);
       else{
       console.log(docs);
       res.send(JSON.stringify(docs));
       };
      // res.end();
       });
   
   
   });




router.get('/list1/:id',function(req,res){
    console.log("Myads Called");
    console.log(req.params.id);
    
    local.find({'email':req.params.id},function(err,docs){
        
        if(err) return console.log(err);
        else{
        //console.log(docs);
        res.send(JSON.stringify(docs));
        };
        res.end();
        });

});



router.get('/single/:id',function(req,res){
    console.log("Myads Called");
    console.log(req.params.id);
    
    local.find({'_id':req.params.id},function(err,docs){
        
        if(err) return console.log(err);
        else{
        //console.log(docs);
        res.send(JSON.stringify(docs));
        };
        res.end();
        });

});
router.get('/adedit/:id',function(req,res){
    console.log("Myads Called");
    console.log(req.params.id);
    
    local.find({'_id':req.params.id},function(err,docs){
        
        if(err) return console.log(err);
        else{
        //console.log(docs);
        res.send(JSON.stringify(docs));
        };
        res.end();
        });

});



router.post('/sold/:id',function(req,res){
    
    var new_password;
    // bcrypt.hash(req.body.new_password, 10, function(err, hash) {
    //     new_password=hash;
    //     console.log("hash");
    //     console.log(hash);
    //     console.log("New Password");
    //     console.log(new_password);
    //   });
   
    console.log("sold called");
    console.log(req.params.id);
   

    
   
        local.update({"_id":req.params.id}, {$set:{"status":"Sold"}},function(err,docs){
    
            if(err) throw err
            console.log("Changed bro");
            // res.send({success:true,token:auth.createJWT(result)});
            console.log(docs);
        });

        console.log("Username Found");
    });















   router.post('/update',upload.array("uploads[]",12),function(req,res){
       console.log("req.body");
       console.log(req.body);

       console.log("Old Images");
       console.log(req.body.oldimages);
       //var id=req.body._id;   //update id
       var query={'_id':mongojs.ObjectId(req.body._id)};
   
       var _newfile = JSON.parse(req.body.oldimages);
       console.log("Here is _new File before push");
       console.log(_newfile);
      
   
   
   if(filename1.length>0){
       for(var i=0;i<filename1.length;i++){
           _newfile.push({imagepic:filename1[i].imagepic,Originalname:filename1[i].originalname,_id:mongojs.ObjectId()});
       }
           console.log("Here is _newfile After Push");
           console.log(_newfile);
       //_newfile = filename1;
       //fs.unlink('./uploads/'+req.body.imagepic,function(){});
   }
   
       var update={
        
        item_name:req.body.item_name,
        price:req.body.price, 
        state_name:req.body.state_name,  
        city_name:req.body.city_name,
        name:req.body.name,
        images:filename1,
        date:req.body.date,
        brand:req.body.brand,
        condition:req.body.condition,
        phone:req.body.phone,
        email:req.body.email,
        area:req.body.area,
        images:_newfile,
     description:req.body.description,
     category:req.body.category
       //    subcategories:JSON.parse(req.body.subarr),
           };
           console.log('--------------update-------');
           console.log(update);
           console.log(query);
       local.findOneAndUpdate(query,update,function(err,docs){
           if(err) throw err;
           console.log("Success");
           filename1=null;
         filename1=[];
           res.send({msg:"Success"});
       });
          
   });
   
   
   
   router.post('/removeimgs',function(req,res){
       console.log('Here is Body');
   console.log(req.body.data);
   var query={'images._id':mongojs.ObjectId(req.body.data._id)};
   console.log(query);
   local.findOne({'images._id':req.body.data._id},function(err,result){
       
       if(err) throw err;
       result.images.id(req.body.data._id).remove();
       result.save();
          res.json(result);
       });
   });
   
   router.post('/delete',function(req,res){
       fs.unlink('./uploads/'+req.body.data.images.imagepic,function(){});
       
   console.log(mongojs.ObjectId(req.body.data._id));
   var query={'_id':mongojs.ObjectId(req.body.data._id)};
   console.log(query);
   local.findByIdAndRemove(mongojs.ObjectId(req.body.data._id),function(err){
   
       if(err) res.send(err);
       else
       res.send({Message:'Success'}) ;
   });

});

module.exports = router;




