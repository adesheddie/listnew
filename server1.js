const express=require('express');
const bodyParser=require('body-parser');
const path=require('path');


var router=express.Router();
var mongojs=require('mongojs');
var local=require('./server/models/register.js');

const nodemailer = require('nodemailer');
var cors = require('cors');
app.options('*', cors())


const app=express();


// app.use(express.static(__dirname+ '/dist/classified'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));


// var mongoose=require('mongoose');
mongoose.connect('mongodb://adesh:gaming619@ds337985.mlab.com:37985/classified');

app.use(function(req,res,next){

    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
    next();

});

app.post('/contactemail', (req, res) => {
    console.log(req.body.obj);
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${req.body.obj.name}</li>
        <li>Email: ${req.body.obj.email}</li>
        <li>Phone: ${req.body.obj.phone}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.obj.message}</p>
    `;
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: 'sysqo.listing2010@gmail.com', // generated ethereal user
          pass: 'gaming619'  // generated ethereal password
      },
      tls:{
        rejectUnauthorized:false
      }
    });
  
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Enquiry For R.K. Tects" <rktects@gmail.com>', // sender address
        to: 'sysqo.listing2010@gmail.com', // list of receivers
        subject: 'Sysqo Enquiry Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        res.send({msg:'Email has been sent'});
    });
    });


var rand,mailOptions,host,link,receiver;


app.post('/resend', (req, res) => {


    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'sysqo.listing2010@gmail.com', // generated ethereal user
            pass: 'gaming619'  // generated ethereal password
        },
        tls:{
          rejectUnauthorized:false
        }
      });

    console.log(req.body.obj);
    receiver=req.body.obj.email;
    rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
    
    local.update({email:receiver}, {$set: {code:rand+"?mail="+receiver}},function(err,docs){

        if(err) throw err
        console.log("Resent bro");
        console.log(docs);
    });

    link="http://"+req.get('host')+"/verify?id="+rand+"?mail="+receiver;
    mailOptions={
        to : req.body.obj.email,
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
  
        res.send({msg:'Email has been sent'});
    });
    });

    app.post('/passcode', (req, res) => {
        var rand1,mailOptions1,host1,link1,receiver1;


        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'sysqo.listing2010@gmail.com', // generated ethereal user
                pass: 'gaming619'  // generated ethereal password
            },
            tls:{
              rejectUnauthorized:false
            }
          });
    
        console.log(req.body.obj);
        receiver=req.body.obj.email;
        rand=Math.floor((Math.random() * 100) + 54)+"a";
        host=req.get('host');
        
        local.update({email:receiver}, {$set: {pass_code:rand}},function(err,docs){
    
            if(err) throw err
            console.log("Resent bro");
            console.log(docs);
        });
 
    
        link="http://"+req.get('host')+"/verify?id="+rand+"?mail="+receiver1;
        mailOptions={
            to : req.body.obj.email,
            subject : "Change Password",
            html : "Hello,<br> Please enter the code given below to change your password.<br>"+rand 
        }
        
        console.log(mailOptions);  

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);   
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      
            res.send({msg:'Email has been sent'});
        });
        });

    app.get('/verify',function(req,res){
        var myEmail;
        str=req.query.id;

        for(let i=0;i<str.length;i++){
            
            if(str[i]=='='){
                for(let j=i+1;j<str.length;j++){
                    
                    if(myEmail==undefined){
                        myEmail=str[j];
                    }
                    else{
                    myEmail=myEmail+str[j];
                }
                }
            }
        }
      
        console.log("my email");
        console.log(myEmail);
       local.find({email:myEmail},function(err,docs){
           if(err) throw err
           console.log("here is returned data");
           console.log(docs[0].code);
           host=req.get('host');
     
        console.log(req.protocol+":/"+req.get('host'));
        if((req.protocol+"://"+req.get('host'))==("http://"+host))
        {
            console.log("Domain is matched. Information is from Authentic email");
            console.log(req.query.id);

            if(req.query.id==docs[0].code)
            {
                
               
                local.update({email:myEmail}, {$set: {status:"Active"}},function(err,docs){

                    if(err) throw err
                    console.log("Updated bro");
                    console.log(docs);
                });
                        
                console.log("email is verified");
              
                res.redirect('http://'+req.get('host')+'/verified');
            }
            else
            {
                console.log("email is not verified");
                res.end("<h1>Bad Request</h1>");
            }
        }
        else
        {
            res.end("<h1>Request is from unknown source");
        }
        });
    });




const userroutes=require('./server/routes/categories_api');
app.use('/categories',userroutes);

const userroutes2=require('./server/routes/register_api');
app.use('/register',userroutes2);


const userroutes1=require('./server/routes/adpost_api');
app.use('/ads',userroutes1);
module.exports = router;

app.get('/', (req, res) => {
    res.send('Node Working');
  });
app.listen(process.env.PORT || 3001);




console.log('http://localhost:3001/');


