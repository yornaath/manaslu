var connection  = require('./lib/connection'),
    entities    = require('./lib/entities')


function connect(options) {
  connection.configure(options)
  entities.setConnection(connection)
  return entities
}

module.exports = {
  connect: connect
}






























