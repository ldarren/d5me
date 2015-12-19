var 
  tbl = null;

exports.setup = function(context, cb){
  var mdb = context.db_d5me;
  if (!mdb) return cb('mdb is null');

  mdb.collection('test_insert', function(err, collection){
    tbl = collection;
    cb();
  });
}

exports.findByUserId = function(params, cb){
  tbl.findOne({userid:params['userid']}, function (err, user){
    cb(err, user);
  });
}

exports.createUser = function(params, cb){
  tbl.insert({
      userid:params['userid'],
      password:params['password'],
      name:params['userid']}, function(err, user){
    cb(err, user);
  });
}

