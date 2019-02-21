var auth=require('../auth/auth.js');
var express=require('express');
var router=express.Router();
bcrypt=require('bcryptjs');

var local1=require('../models/register.js');

const nodemailer = require('nodemailer');


var rand,mailOptions,host,link,receiver;


 router.post('/register',function(req,res){
    local1.findOne({$or:[{username:req.body.data.username},{email:req.body.data.email}]},function(err,existinguser){
    if(existinguser){
        return res.status(409).send({message:'Username/Email already exists'});
    }
    receiver=req.body.data.email;
    rand=Math.floor((Math.random() * 100) + 54);
    var local=new local1({
   username:req.body.data.username,
   name:req.body.data.name,
   email:req.body.data.email,
   code:rand+"?mail="+receiver,
   password:req.body.data.password,
   phone:req.body.data.phone,
   status:'false',
   
   state_name:req.body.data.state_name,
   city_name:req.body.data.city_name,
   });
   console.log(local);



   let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'adesh.eddie@gmail.com', // generated ethereal user
        pass: 'batmanrocks7*'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });
console.log(req.body.data);

host=req.get('host');
    link="http://"+req.get('host')+"/verify?id="+rand+"?mail="+receiver;
mailOptions={
    to : receiver,
    subject : "Please confirm your Email account",
    html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
}
console.log(mailOptions);

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);   
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

});







   local.save(function(err,result){
    if(err){
       res.send({message:err.message});
    }
    res.send({success:true,token:auth.createJWT(result)});
    console.log("result");
    console.log(result);
});





 
});
});

router.post('/login',function(req,res){
    console.log("login called");
    console.log(req.body);
    local1.findOne({email:req.body.email},'+password',function (err,user) {
        
        if(!user){
            return res.json({error:false,message:"Username is incorrect"});
        }
        user.comparepassword(req.body.password,function(err,isMatch){
           
        if(!isMatch){
            return res.json({success:false,message:"Wrong password"});
        }
        res.json({success:true,token:auth.createJWT(user),username:user.username,_id:user._id,email:user.email,name:user.name,phone:user.phone,status:user.status});
        
        console.log(auth.createJWT(user));
    });


});

});
router.post('/verify',function(req,res){
    console.log("verify called");
    console.log(req.body);
    local1.findOne({username:req.body.username},function (err,user) {
       
        res.json({success:true,username:user.username,_id:user._id,email:user.email,name:user.name,phone:user.phone,status:user.status});
        
        console.log(auth.createJWT(user));
    });
});

//focusout check password
    router.post('/passchange',function(req,res){
        console.log("verify called");
        console.log(req.body);
        local1.findOne({username:req.body.username},'+password',function (err,user) {
            if(!user){
                return res.json({error:false,message:"Username is incorrect"});
            }

            user.comparepassword(req.body.password,function(err,isMatch){
           
                if(!isMatch){
                    return res.json({success:false,message:"Wrong password"});
                }
           
            res.json({success:true});
            
            //console.log(auth.createJWT(user));
       
    });
});
});

router.post('/codecheck',function(req,res){
    
    var new_password;
    // bcrypt.hash(req.body.new_password, 10, function(err, hash) {
    //     new_password=hash;
    //     console.log("hash");
    //     console.log(hash);
    //     console.log("New Password");
    //     console.log(new_password);
    //   });
    let hash = bcrypt.hashSync(req.body.new_password, 10);
    var pass_code= req.body.passcode;
    console.log("here is passcode");
    console.log(pass_code);
    console.log("codecheck called");
    console.log(req.body);
   

    
   
        local1.update({$and: [{"username":req.body.username},{"pass_code":pass_code}]}, {$set:{"password":hash}},function(err,docs){
    
            if(err){
               throw err
            }
            console.log("Changed bro");
            if(!docs.nModified==1){
            return res.json({success:false,message:"Password Not Changed"});
            }
            console.log(docs);
            return res.json({success:true,message:"Password Changed"});
            // res.send({success:true,token:auth.createJWT(result)});
            console.log(docs);
        });

        console.log("Username Found");
    });


    router.post('/changefinal',function(req,res){
    
        var new_password;
        // bcrypt.hash(req.body.new_password, 10, function(err, hash) {
        //     new_password=hash;
        //     console.log("hash");
        //     console.log(hash);
        //     console.log("New Password");
        //     console.log(new_password);
        //   });
        let hash = bcrypt.hashSync(req.body.new_password, 10);
       
        console.log("codecheck called");
        console.log(req.body);
       
    
        
       
            local1.update({"username":req.body.username}, {$set:{"password":hash}},function(err,docs){
        
                if(err) throw err
                console.log("Changed bro");
                // res.send({success:true,token:auth.createJWT(result)});
                console.log(docs);
            });
    
            console.log("Username Found");
        });

        
   
        
        //console.log(auth.createJWT(user));
   





module.exports = router;