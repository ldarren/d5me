require('./../pico/main.js').createContext(process.argv, function(context){
  var 
    util = require('util'),
    web = context.web,
    mdb = context.mdb,
    storage = context.storage,
    tbl = null;

  mdb.collection('test_insert', function(err, collection){
    tbl = collection;
  });

  web.setRoute('/who', function(req, res){
    res.render(200, 'd5me');
  });
  
  web.setRoute('/signin', function(req, res){
    tbl.find({userid:req.POST['userid']}, function(err, cursor){
      cursor.nextObject(function(err, user){
//console.log('userid: '+req.POST['userid']+' password: '+req.POST['password']);
//console.log(util.inspect(user));
        if (user != null){
          res.render(200,{status:'OK', name: user['name']});                                       
        }else{
          res.render(200,{status:'KO'});
        }
      });
    });
  });
  
  web.setRoute('/signup', function(req, res){
    tbl.insert({userid:req.GET['userid'],password:req.GET['password'],name:req.GET['userid']}, function(err, user){
      if (user != null){
        res.render(200,{status:'OK', name: user['name']});
      }else{
        res.render(200,{status:'KO'});
      }
    });
  });
  
  web.setRoute('/isuser', function(req, res){
    tbl.findOne({userid:req.GET['userid']}, function (err, user){
      if (user != null){ res.render(200,{status:'OK'});}else{res.render(200,{status:'KO'});}
    });
  });
  
  web.setRoute('/upload', function(req, res){
    storage.upload(req.FILES.upload, function(err, fname){
      res.render(200, fname+' uploaded');
    });
  });
});
