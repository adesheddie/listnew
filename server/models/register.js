var mongoose=require('mongoose');
var Schema = mongoose.Schema;
bcrypt=require('bcryptjs');






var userschema=new Schema({
name: String,
email: String,
phone: String,
status:String,
code:String,
pass_code:String,
created:{type:Date},
updated:{type:Date},
username:{type:String,unique:true},
password:{type:String,select:false},

state_name: String,
city_name: String,
}, {versionKey:false});



userschema.pre('save',function(next){
    now=new Date();
    this.updated=now;
    if(!this.created){
        this.created=now;
    }
    var user=this;
    if(!user.isModified('password')){
        return next();
    }

    bcrypt.genSalt(10,function(err,Salt){
        bcrypt.hash(user.password,Salt,function(err,hash){
            user.password=hash;

            next();
        });

    });




 });


 userschema.methods.comparepassword=function(password,done){
     bcrypt.compare(password,this.password,function(err,isMatch){       
         //Password:-> string pass, this.password-> saved password
        done(err,isMatch);
     });
 }



module.exports=mongoose.model('register',userschema);