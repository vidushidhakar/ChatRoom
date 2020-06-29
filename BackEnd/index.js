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


        const collection = connection.db('chatroomdb').collection('users');
        
        collection.find({email:req.body.email}).toArray((err,docs)=>{
            if(!err && docs.length>0)
            {
                req.isAlreadyExist =true;
                cb(null, "temp.jpg");
            }
            else{
                req.isAlreadyExist =false;
                const collection = connection.db('chatroomdb').collection('users');


                collection.insert(req.body, (err,result)=>{
                    if(!err)
                    {
                  
                            req.genId=result.insertedIds['0'];
                            req.isInsertedSuccess = true;
                            cb(null, req.body.email+"_"+file.fieldname+".jpg");


                    }
                    else{
                            req.isInsertedSuccess = false;
                            cb(null, "temp.jpg");
                    }
                })


            }
        })


    }
  })
 
  
  var upload = multer({ storage: storage })


  app.post('/images',  upload.single('profile'), 
                      (req,res)=>{  console.log("in last",);  
                      
                      if(req.isAlreadyExist)
                      {

                          res.send({status:'failed', data:"you have already given your data"})
                          
                      }
                      else {
                          res.send({status:"ok"})

                      } 
}
)





app.post('/sign-up', bodyParser.json() ,(req,res)=>{  

        const collection = connection.db('chatroomdb').collection('users');


        collection.insert(req.body, (err,result)=>{
            if(!err)
            {
                res.send({status:"ok", data:"signup successfull for "+req.body.username});
            }
            else{
                res.send({status:"failed", data:"could not register"});
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
    
    collection.update({'email':email},{$push:{friends:{name:friend,status:false,sent:true,recieved:false}}})
    collection.update({'email':friend},{$push:{friends:{name:email,status:false,sent:false,recieved:true}}}
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


// app.post('/update-details', bodyParser.json() ,(req,res)=>{ 



//     const collection = connection.db('chatroomdb').collection('users');
   
   
//     collection.update({"email":req.body.email}, {$set:{"password":req.body.newpassword,"location":req.body.newlocation}}
//             ,(err,result)=>{
//             if(!err)
//             {
//                 res.send({status:"ok"});
//             }
//             else{
//                 res.send({status:"failed", data:"some error occured"});
//             }
//         })
    
// });

    http.listen(3000, ()=>{
    console.log("Server is listening on port 3000");
    // console.log("got to browser and hit 'localhost:3000'");
    })



    io.on('connection', (socket) => {

        let email = socket.handshake.query.email;
        console.log('a user connected ');
        connectedUsers.push({userEmail:email, userSocket:socket})
    
        console.log("connected users List:");
        console.log(connectedUsers);



    
        socket.on('disconnect', () => {
          console.log('user disconnected');
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
      
    
    
    });