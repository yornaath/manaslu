var req         = require('request'),
    xml2js      = require('xml2js');


var XMLparser;

var config;

config = {}

module.exports.configure = function(conf) {
  for(var key in conf) {
    config[key] = conf[key]
  }
}

module.exports.auth = function(cb) {
  var opts,
      req;
  opts = {
    host: config.get('baseUrl'),
    port: 443,
    path: '/',
    method: 'POST',
    auth: config.get('token')+':X',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  req = https.get(opts, function(res) {
    res.setEncoding('utf8')
    res.on('data', function(data) {
      cb(null, data)
    })
  }).on('error', function(err) {
    cb(err)
  })
}

module.exports.request = {
  json: function(resource, method, data, cb) {
    req({
      method: method,
      uri: 'https://'+config['baseUrl']+'/'+resource+'.json',
      body: data,
      headers: {
        'Authorization': 'Basic ' + new Buffer(config['token'] + ':X').toString('base64'),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }, function(err, res, body) {
      if(err) {
        return cb(err)
      }
      else if(body) {
        cb(null, JSON.parse(body)) 
      }
    })
  },
  xml: function(resource, method, data, cb) {
    if(!XMLparser) {
      XMLparser = new xml2js.Parser()
    }
    req({
      method: method,
      uri: 'https://'+config['baseUrl']+'/'+resource+'.xml',
      body: data,
      headers: {
        'Authorization': 'Basic ' + new Buffer(config['token'] + ':X').toString('base64'),
        'Accept': 'application/xml',
        'Content-Type': 'application/xml'
      }
    }, function(err, res, body) {
      if(err) {
        return cb(err)
      }
      else if(body) {
        XMLparser.parseString(body, function(err, json) {
          if(json && json['error']) {
            return cb(json['error'])
          }
          return cb(null)
        })
      }
      else {
        return cb(null)
      }
    })
  }
}






























