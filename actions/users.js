exports.setup = function(context, cb){
  var
    web = context.web,
    storage = context.s3_d5me,
    userTbl = require('../models/test_insert');

  web.setRoute('/who', function(req, res){
    res.render('d5me');
  });
  
  web.setRoute('/signin', function(req, res){
    req.parseParams(function(fields, file){
      userTbl.findByUserId(fields, function(err, user){
        if (user != null){
          res.render({status:'OK', name: user['name']});                                       
        }else{
          res.render({status:'KO'}, 404);
        }
      });
    });
  });
  
  web.setRoute('/signup', function(req, res){
    req.parseParams(function(fields, file){
      userTbl.create(fields, function(err, user){
        if (user != null){
          res.render({status:'OK', name: user['name']});
        }else{
          res.render({status:'KO'}, 404);
        }
      });
    });
  });
  
  web.setRoute('/isuser', function(req, res){
    req.parseParams(function(fields, file){
      userTbl.findByUserId(fields, function (err, user){
        if (user != null){ res.render({status:'OK'});}
        else{res.render({status:'KO'}, 404);}
      });
    });
  });
  
  web.setRoute('/upload', function(req, res){
    req.parseParams(function(fields, file){
      storage.upload(file.upload, function(err, fname){
        res.render(fname+' uploaded');
      });
    });
  });

  cb();
}
