var bosses = [
      [13000, 90, [1,50,67]],
      [24500, 250, [7,45,54]],
      [55000, 10, [2,56,3]]
    ],
    hunters = [
      [500, 80],
      [1000, 70],
      [600, 150],
      [850, 100],
      [700, 600],
      [300, 600],
      [500, 700],
      [600, 800],
      [700, 700],
      [640, 760]
    ];

function pick(max){
  return Math.ceil(Math.random()*max);
}

function fight(b, h0, h1, h2, steps, cb){
  process.nextTick(function(){
    if (b[0] <= 0) cb({steps:steps,result:'win',rewards:b[2][pick(b[2].length-1)]});
    else if (h0[0] <= 0 && h1[0] <= 0 && h2[0] <= 0) cb({steps:steps,result:'lose',rewards:0}); 
    else{
      var dmg = 0;
      if (h0[0] > 0){
        dmg = pick(h0[1]);
        b[0] -= dmg;
        steps.push([1, -1, dmg]);
      }else{
        steps.push([1, -1, -1]);
      }
      if (h1[0] > 0){
        dmg = pick(h1[1]);
        b[0] -= dmg;
        steps.push([1, -1, dmg]);
      }else{
        steps.push([2, -1, -1]);
      }
      if (h2[0] > 0){
        dmg = pick(h2[1]);
        b[0] -= dmg;
        steps.push([2, -1, dmg]);
      }else{
        steps.push([2, -1, -1]);
      }
      if (b[0] > 0){
        dmg = pick(b[1]);
        h0[0] -= dmg;
        steps.push([-1, 0, dmg]);
        dmg = pick(b[1]);
        h1[0] -= dmg;
        steps.push([-1, 1, dmg]);
        dmg = pick(b[1]);
        h2[0] -= dmg;
        steps.push([-1, 2, dmg]);
      }

      fight(b, h0, h1, h2, steps, cb);
    }
  });
}

exports.setup = function(context, cb){
  var
    util = require('util'),
    web = context.web,
    mem = context.mem,
    que = context.room1,
    name = 'room1';

  web.setRoute('/onwards', function(req, res){
    req.parseParams(function(fields, file){
      mem.set(fields['key'], fields['value'], 10000, function(err, result){
        if (err) {
          res.render(util.inspect(err), 500);
          return;
        }
        mem.get(fields['key'], function(err, result){
          res.render(util.inspect(result));
        });
      });
    });
  });

  web.setRoute('/fight', function(req, res){
    req.parseParams(function(fields, file){
      var
        b = fields.b || 0,
        h0 = fields.h0 || 0,
        h1 = fields.h1 || 0,
        h2 = fields.h2 || 0;
      fight(
        [bosses[b][0],bosses[b][1],bosses[b][2]],
        [hunters[h0][0], hunters[h0][1]],
        [hunters[h1][0], hunters[h1][1]],
        [hunters[h2][0], hunters[h2][1]],
        [],
        function(result){
        res.render(result);
      });
    });
  });

  web.setRoute('/push', function(req, res){
    req.parseParams(function(fields, file){
      que.push(name, fields.value, function(err, result){
        res.render(util.inspect(result));
      });
    });
  });

  web.setRoute('/pop', function(req, res){
    que.pop(name, function(err, result){
      res.render(util.inspect(result));
    });
  });

  web.setRoute('/popAll', function(req, res){
    que.popAll(name, function(err, result){
      res.render(util.inspect(result));
    });
  });

  que.create(name, {life: 10800, size: 4}, function(err, result){
    cb();
  });

}
