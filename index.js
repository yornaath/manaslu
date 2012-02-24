var connection  = require('./lib/connection'),
    entities    = require('./lib/entities')


module.exports.connect = function(options) {
  connection.configure(options)
  entities.setConnection(connection)
  return entities
}






























