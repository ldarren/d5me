var
  HOST = null,
  PORT = 1337;

var
  starttime = (new Date()).getTime(),
  mem = process.memoryUsage();

setInterval(function(){ mem = process.memoryUsage();}, 10*1000);

var
  web = require('../pico/web.js'),
  mdb = require('mongodb'),
  url = require('url'),
  sys = require('sys');

var db = mdb.Db, svr = mdb.Server, test_tbl;

var client = new db('d5me', new svr("localhost", 27017, {}));
client.open(function(err, p_client){
  p_client.collection('test_insert', function(err, collection){
    test_tbl = collection;
  });
});

web.listen(Number(process.env.PORT || PORT), HOST);

web.setRoute('/who', function(req, res){
  res.render(200, 'd5me');
});

web.setRoute('/signin', function(req, res){
  test_tbl.find({userid:req.POST['userid']}, function(err, cursor){
    cursor.nextObject(function(err, user){
      console.log('userid: '+req.POST['userid']+' password: '+req.POST['password']);
      if (user != null){
        res.render(200,{status:'OK', name: user['name']});
      }else{
        res.render(200,{status:'KO'});
      }
    });
  });
});

web.setRoute('/signup', function(req, res){
  test_tbl.insert({userid:req.GET['userid'],password:req.GET['password'],name:req.GET['userid']}, function(err, user){
    if (user != null){
      res.render(200,{status:'OK', name: user['name']});
    }else{
      res.render(200,{status:'KO'});
    }
  });
});

web.setRoute('/isuser', function(req, res){
  test_tbl.findOne({userid:req.GET['userid']}, function (err, user){
    if (user != null){ res.render(200,{status:'OK'});}else{res.render(200,{status:'KO'});}
  });
});

web.setRoute('/upload', function(req, res){
    res.render(200, sys.inspect({fields:req.POST, files:req.FILES}));
});
