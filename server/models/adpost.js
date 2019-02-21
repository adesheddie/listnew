var mongoose=require('mongoose');





var Schema = mongoose.Schema;

var local=new Schema({
_id: Schema.ObjectId,
item_name: String,
price:String,
imagepic:String,
area:String,
state_name:String,
city_name:String,
name:String,
phone:String,
email:String,
status:String,
category:String,
date:String,
brand:String,
condition:String,
description:String,
images:[{imagepic:String,
_id:Schema.ObjectId,
Originalname:String,
}],


subcategories:[
    
]
    
}, {versionKey:false});

module.exports=mongoose.model('ad',local);