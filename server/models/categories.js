var mongoose=require('mongoose');





var Schema = mongoose.Schema;

var local=new Schema({
_id: Schema.ObjectId,
categories:String,
subcategories:[{
    _id:Schema.ObjectId,
    Subnames:String,
}]

}, {versionKey:false});

module.exports=mongoose.model('categorie',local);