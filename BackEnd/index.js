const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);


const bodyParser = require('body-parser');
const cors  = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const multer = require('multer');
const path = require('path');
var nodemailer = require('nodemailer');








// var client = new MongoClient('mongodb://localhost:27017/chatroom', {useNewUrlParser:true})
// mongodb+srv://Vidushi:<password>@chatroomdb-x1owu.mongodb.net/<dbname>?retryWrites=true&w=majority
var client = new MongoClient('mongodb+srv://Vidushi:12345@chatroomdb-x1owu.mongodb.net/chatroomdb?retryWrites=true&w=majority', {useNewUrlParser:true})

var connection;
client.connect((err, con)=>{
        if(!err)
        {
            connection=con;
            console.log("database connected successfully");
        }
        else{
            console.log("database could not connect");
        }
})



let connectedUsers = new Array();



app.use(cors());

app.use(express.static(path.join(__dirname,'uploads')));



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("in destination");
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
          console.log("in up load ");
          console.log(req.body);
                            cb(null, req.body.email+".jpg");

    }
  })
 
  
  var upload = multer({ storage: storage })


  app.post('/images',  upload.single('profile'), 
                      (req,res)=>{  console.log("in last",);  
                                         
                          res.send({status:"ok"})
                      
}
)





app.post('/sign-up', bodyParser.json() ,(req,res)=>{  

        const collection = connection.db('chatroomdb').collection('users');

        collection.find({email:req.body.email}).toArray((err,docs)=>{
            if(!err && docs.length>0)
            {
                console.log(docs);
                res.send({status:"failed", data:"already exist"});
            }
            else{
                 collection.insert(req.body, (err,result)=>{
                     if(!err)
                    {   sendMail("swipechatapp@gmail.com", "ncmttctqtpaxldvg" , req.body.email, "Welcome to swipechat", `<h3>Hi ${req.body.firstname}</h3><br><p>Signup succesful!Welcome to swipechat. </p><br><h5>Thank You!</h5>` )
                res.send({status:"ok", data:"signup successfull for "+req.body.username});
                    }
                    else{
                res.send({status:"failed", data:"could not register"});
                 }
            })

            }
    })
});


app.post('/sign-in', bodyParser.json() ,(req,res)=>{ 



    const collection = connection.db('chatroomdb').collection('users');


    collection.find(req.body).toArray((err,docs)=>{
        if(!err && docs.length>0)
        {

            res.send({status:"ok", data:docs});
        }
        else{
            res.send({status:"failed", data:"some error occured"});
        }
    })

    });

app.post('/add-friend', bodyParser.json() ,(req,res)=>{ 



    const collection = connection.db('chatroomdb').collection('users');
    var friend=req.body.friend;
    var email=req.body.email;
    
    collection.updateOne({'email':email},{$push:{friends:{name:friend,status:false,sent:true,recieved:false}}})
    collection.updateOne({'email':friend},{$push:{friends:{name:email,status:false,sent:false,recieved:true}}}
            ,(err,result)=>{
            if(!err)
            {
                res.send({status:"ok"});
            }
            else{
                res.send({status:"failed", data:"some error occured"});
            }
        })
    
        });


app.post('/get-notif', bodyParser.json() ,(req,res)=>{ 



    const collection = connection.db('chatroomdb').collection('users');


    collection.find(req.body).toArray((err,docs)=>{
        if(!err)
        {
            res.send({status:"ok", data:docs});
        }
        else{
            res.send({status:"failed", data:"some error occured"});
        }
    })

    });

app.post('/accept-request', bodyParser.json() ,(req,res)=>{ 



        const collection = connection.db('chatroomdb').collection('users');
        var friend=req.body.friendEmail;
        var email=req.body.email;
      
        collection.update({"email":email,"friends":{$elemMatch:{"name":friend}}}, {$set:{"friends.$.status":true}})
        collection.update({"email":friend,"friends":{$elemMatch:{"name":email}}}, {$set:{"friends.$.status":true}}
                ,(err,result)=>{
                if(!err)
                {
                    res.send({status:"ok"});
                }
                else{
                    res.send({status:"failed", data:"some error occured"});
                }
            })
        
});

app.post('/delete-account', bodyParser.json() ,(req,res)=>{ 



    const collection = connection.db('chatroomdb').collection('users');


    collection.remove(req.body,(err,result)=>{
        if(!err)
        {
            res.send({status:"ok"});
        }
        else{
            res.send({status:"failed", data:"some error occured"});
        }
    })

});


app.post('/update-details', bodyParser.json() ,(req,res)=>{ 



    const collection = connection.db('chatroomdb').collection('users');
   
    collection.update({"email":req.body.email}, {$set:{"password":req.body.newpassword,"location":req.body.newlocation}}
            ,(err,result)=>{
            if(!err)
            {
                res.send({status:"ok"});
            }
            else{
                res.send({status:"failed", data:"some error occured"});
            }
        })
    
});

    http.listen(3000, ()=>{
    console.log("Server is listening on port 3000");
    // console.log("got to browser and hit 'localhost:3000'");
    })


    
function sendMail(from, appPassword, to, subject,  htmlmsg)
{
    let transporter=nodemailer.createTransport(
        {
            host:"smtp.gmail.com",
            port:587,
            secure:false,
            auth:
            {
             //  user:"weforwomen01@gmail.com",
             //  pass:""
             user:from,
              pass:appPassword
              
    
            }
        }
      );
    let mailOptions=
    {
       from:from ,
       to:to,
       subject:subject,
       html:htmlmsg
    };
    transporter.sendMail(mailOptions ,function(error,info)
    {
      if(error)
      {
        console.log(error);
      }
      else
      {
        console.log('Email sent:'+info.response);
      }
    });
}



    io.on('connection', (socket) => {

        let email = socket.handshake.query.email;
        console.log('a user connected ');
        connectedUsers.push({userEmail:email, userSocket:socket})
    
        console.log("connected users List:");
        console.log(connectedUsers);


        socket.emit('connectedUsersEmail', connectedUsers.map((uu)=>{ return uu.userEmail}) );


        connectedUsers.forEach((u)=>{
                u.userSocket.emit('newUserLoggedIn', email);
        })

          
        socket.on('disconnect', () => {
            connectedUsers.forEach((u)=>{
                u.userSocket.emit('disconnectedUser',email);
        })
           
          console.log(email+' disconnected');
        });


        socket.on('newMsg', (d)=>{

            console.log(d);

            connectedUsers.forEach((u)=>{
                if(u.userEmail==d.to)
                {
                    u.userSocket.emit('newMsg', { from:d.from , text:d.text })
                }
            })
          
            console.log("i got a msg from a client");
                     
        })

        socket.on('newNotif', (d)=>{

            console.log(d);

            connectedUsers.forEach((u)=>{
                if(u.userEmail==d.to)
                {   
                    u.userSocket.emit('newNotif', { from:d.from })
                }
            })
          
            console.log("i got a notif a client");
                     
        })
      
    
    
    });