// load required modules
var express = require("express"),
    app = express(),
    fs = require("fs"),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    formidable = require('formidable'),
    util = require('util'),
    fs   = require('fs-extra'),
    qt   = require('quickthumb'),
    socketio = require("socket.io"),
    async=require("async"),
    path=require("path")
    
    
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
    
app.get("/", function (req, res) {
  res.redirect("/blank.html#html_dom");
});

app.use(express.static(__dirname + '/Javascript'));

var users=[];
var comments=[];
var commentCount={}
MongoClient.connect('mongodb://weiv:unoriginality@ds023000.mlab.com:23000/p2', function(err, db) {
if(!err) {
  console.log("Connected to database");

       // create or connect to collection users
	users = db.collection('users')
	comments = db.collection('comments')
	//comments.drop() //uncomment this and restart server to clear db
}
});

app.post('/create', function( req, res ){
    // parse request and create user object
    var user={
      name:req.body.name,
      pass:req.body.pass,
      gend:req.body.gend,
      av: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
      stat: '',
      cb:[], //car builder, each is stored as an array 
      t:req.body.t, //theme
      udata:['','',''], //location, interests, birthday
      proflay:['','','','','',''] // bgcolor, text color, header color, font, font size, border
    }
    // check to see if user already exists in DB
    users.findOne({name:user.name},function(err,item){
      if(err)
        return res.send('err')
        //return res.send(err)
    
      if(item)
        return res.send('taken')
          
      insert(user,res)
      
    }) 
})

app.post('/write',function(req, res){
  //need to add ID call stuff
  //cookieValid(req.body.cookie)
  var comment={
    _id:String('comment'+commentCount[req.body.page]),
    name:req.body.name,
    text:req.body.text,
    type:req.body.type,
    uId:req.body.uID,
    parentId:'none',
    time:Date().toString()
  }
  // ok now do it for profiles.
  comments.update({_id:req.body.page},{$push:{docComments:comment}}, function(err,result){
    if(err)
      return res.send( 'Error commenting.')
    res.send(comment)
    numOfComments(req.body.page)
  })
})

app.post('/writeReply',function(req,res){
  var commentReply={
    _id: String('comment'+commentCount[req.body.page]),
    name:req.body.name,
    text:req.body.text,
    type:req.body.type,
    uId:req.body.uID,
    parentId:req.body.parentID,
    time:Date().toString()
  }
  console.log(req.body)
  comments.update({_id:req.body.page},{$push:{docComments:commentReply}}, function(err,result){
    if(err)
      return res.send( 'Error commenting.')
    res.send(commentReply)
    numOfComments(req.body.page)
  })
})

app.post('/delCom',function(req,res){
  //deletes a comment. objectID string thing is required to make it work. nice.
  comments.update({_id:'domWS',docComments:{$elemMatch:{_id:String(req.body.ID)}}}, {$set:{"docComments.$.name":"[deleted]","docComments.$.text":"[deleted]","docComments.$.type":"guest"}},{}, function(err, result) {
    if(err)
    console.log(err)
  });
  res.send('Comment Deleted')
})

app.post('/getComs',function(req,res){
  //loads all current comments.
    comments.findOne({ "_id":req.body.page },function(err, items) {
      if(err)
        console.log(err)
      res.send(items)
      //items is array of docs(another array) [doc id,name,comment text,[children],time]
    });
})

app.post('/allowComs',function(req,res){
    //loads all current comments.
  console.log(req.body.page)
    comments.findOneAndUpdate({ "_id":req.body.page }, //make this work with update.
    {$set:{"state":req.body.state}},function(err, items) {
      if(err)
        console.log(err)
      console.log(items+' items')
      
      if(items.value==null){
          comments.findAndModify(
          { "_id":req.body.page },
          {},
          { "_id":req.body.page,"state":req.body.state, docComments:[]},
          {upsert: true},function(err, itemss) {
            if(err)
              console.log(err)
            res.send(itemss)
          }
      )} else{
        res.send(items)
      }
    });
})

function insert(user, res){
    // insert the new user
    users.insert( user, function(err, result){	
      if(err)
        return res.send( 'error inserting user' )
        //return res.send(err)

      res.send(result)
    })      
}

app.post( '/login', function(req,res){

    // parse request and create object
    var user={
      name:req.body.name,
      pass:req.body.pass
    }
  
    // get one user by username
    users.findOne({name:user.name},function(err,item){
      if(err)
        return res.send('err')
        
      if(!item)
        return res.send('nf')

      if(user.pass != item.pass)
        return res.send('invp')
        
      res.send(item)
    })  
})

/*
app.post('/getUserByName', function(req,res){
  users.findOne({name:req.body.name},function(err,item){
      if(err)
        return res.send('err')
        
      if(!item)
        return res.send('nf')
      
      res.send(item)
    })  
})
*/

app.post('/getUserById', function(req,res){
  users.findOne({"_id" : ObjectId(String(req.body.id))},function(err,item){
    if(err)
      return res.send('err')
    if(!item)
      return res.send('nf')
    res.send(item) 
  })  
})

app.post('/updateLoginInfo', function(req,res){

    var rb = req.body,
      id = ObjectId(rb.id),
      newpass=rb.pass
    
    users.update({_id:id}, 
      { $set: {pass: newpass} }, function( err, result ){
      if(err)
          return res.send('error updating pass')
          //return res.send(err)
        res.send(result)
    })    
    
    users.update({_id:id}, 
      { $set: {gend: newgend} }, function( err, result ){
      if(err)
          return res.send('error updating gend')
          //return res.send(err)
        res.send(result)
    })
})

app.post('/updateTheme', function(req,res){
    var rb = req.body,
      id = ObjectId(rb.id),
      newtheme=rb.t
    users.update({_id:id},
      { $set: {t: newtheme} }, function( err, result ){
      if(err)
          return res.send('err')
          //return res.send(err)
        res.send(result)
    })    
})

app.post('/updateStatus', function(req,res){
    var rb = req.body,
      id = ObjectId(rb.id),
      stat=rb.stat
    users.update({_id:id}, 
      { $set: {stat: stat} }, function( err, result ){
      if(err)
          return res.send('err')
          //return res.send(err)
        res.send(result)
    })    
})

app.post('/updateStats', function(req,res){
    var rb = req.body,
      id = ObjectId(rb.id),
      stat=rb.stat,
      gend=rb.gend,
      udata=[rb.udata[0],rb.udata[1],rb.udata[2]]
    users.update({_id:id}, 
    { $set:
      {"stat": stat,
      "gend": gend,
      "udata":udata
      }
    }, function( err, result ){
      if(err)
          return res.send('err')
          //return res.send(err)
        res.send(result)
    })    
})

app.post('/uploadAvatar', function (req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    res.end(util.inspect({fields: fields, files: files}));
  });

  form.on('end', function(fields, files) {
    //Temporary location of our uploaded file
    var temp_path = this.openedFiles[0].path;
    // The file name of the uploaded file
    var file_name = this.openedFiles[0].name;
    // Location where we want to copy the uploaded file
    var new_location = 'user_avatars/';

    fs.copy(temp_path, new_location + file_name, function(err) {  
      if (err) {
        console.error(err);
      } else {
        console.log("Success uploading avatar.")
      }
    });
  });
});


app.post('/remove', function(req,res){
    
    // use ObjectId to delete
    var id = ObjectId(req.body.id)
    
    users.remove({'_id':ObjectId(id)}, function(err,result){		
      if(err)
        return res.send('error removing user')
        //return res.send(err)
    
      res.send(result)
    })  
})

app.get('/functions.js')

//hosts web server/socket connections
var http=require("http").Server(app)
var io = require('socket.io')(http)

http.listen(process.env.PORT, function () {
  var host = http.address().address;
  var port = http.address().port;
});

//socket.io stuff. still learning.
var sockets={}
var partners
io.on('connection',function(socket){
   var address = socket.handshake.headers['x-forwarded-for']
  console.log('New connection from ' + address);
  
  socket.on('disconnect',function(name){
    console.log('a user disconnected')
  })
    
  socket.on('cookies', function(name){
    var info=name.split('; ')
    var temp={}
    for(var i=0;i<info.length;i++){
      var infoo=(info[i].split('='))
      temp[infoo[0]]=infoo[1]
    }
      sockets[temp.name]={
        times:[],
        socket:socket,
        name:temp.name,
        ip:address,
        chatBanned:false,
        admin:false
      }
      if(temp.admin=='flarf'){
        sockets[temp.name].socket.join('Admins')
        sockets[temp.name].admin=true
      }
    console.log(temp.name+' has connected')
  })
  socket.on('alert',function(stuff){
    console.log(stuff)
    io.sockets.emit('alert', stuff);
  })
  
  //*PONG YO*//
  socket.on('pongCollision',function(who,opponent,x,y){
    sockets[who].socket.emit('pongCollision',x,y)
    sockets[opponent].socket.emit('pongCollision',x,y)
  })
  
  socket.on('pongLeft',function(who,opponent,x){
    sockets[who].socket.emit('enemyMove',opponent,x)
  })
  
  socket.on('pongRight',function(who,opponent,x){
    sockets[who].socket.emit('enemyMove',opponent,x)
  })
  
  socket.on('join',function(name,user){
    sockets[name].socket.emit('prompt',user)
  })
  
  socket.on('noPong',function(who,opponent){
    sockets[who].socket.emit('response',false,opponent) //sends no to requester
  })
  socket.on('yesPong',function(who,opponent){
    sockets[who].socket.emit('response',true,opponent,who) //sends yes to requester
    sockets[opponent].socket.emit('response',true,who,opponent)
  })
  
  //*CHAT ROOM*//
  socket.on('chatJoin',function(who){
    sockets[who].socket.join('chatRoom')
    io.to('chatRoom').emit('message','SYSTEM',who+' has joined the chat room.')
  })
  
  socket.on('message',function(who,msg){
    if(sockets[who].chatBanned==false){
      sockets[who].times.unshift(Date.now())
      if(sockets[who].times.length>4){
        sockets[who].times.length=4
        var avg= sockets[who].times[0]-sockets[who].times[3]
        if(avg<10000){
          sockets[who].socket.emit('alert','you must wait before sending another message.')
        } else {
            io.to('chatRoom').emit('message',who,msg)
        }
      } else{
        io.to('chatRoom').emit('message',who,msg)
      }
    }else if(sockets[who].chatBanned==true){
      sockets[who].socket.emit('alert','You have been banned from the chat.','m')
    }
  })
  
  socket.on('whisper',function(who,msg,whisperTo){
    if(sockets[who].chatBanned==false  && who!=whisperTo){
      sockets[whisperTo].socket.emit('whisper',who,msg,whisperTo)
      sockets[who].socket.emit('whisper',who,msg,whisperTo)
      io.to('Admins').emit('whisper',who,msg,whisperTo)
    }else if(sockets[who].chatBanned==true){
      sockets[who].socket.emit('alert','You have been banned from the chat.','m')
    }
  })
  
  socket.on('chatDisconnect',function(who){
    io.to('chatRoom').emit('message','SYSTEM',who+' has left the chat room.')
    sockets[who].socket.leave('chatRoom')
  })
  
  socket.on('chatBan',function(admin,user){
    sockets[user].chatBanned=true
    io.to('chatRoom').emit('message','SYSTEM',user+' was banned from the chat by '+admin)
  })
  
  socket.on('unChatBan',function(admin,user){
    sockets[user].chatBanned=false
    io.to('chatRoom').emit('message','SYSTEM',user+' was unbanned from the chat by '+admin)
  })
})

function numOfComments(page){
  //works mostly i think.
  comments.aggregate([{ $match: { _id: page } },{$project:{comments_count:{$size: "$docComments"}}}],function(err,items){
    if (err) console.log(err)
    else{
    commentCount[page]=items[0]['comments_count']
    }
  })
}

/*PAGES AND STUFF*/
app.get('/pages',function(req,res){
  console.log(req.query)
  res.sendFile(path.join(__dirname+'/Javascript/'+req.query.id+'.html'))
})
