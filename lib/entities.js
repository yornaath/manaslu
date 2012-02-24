

var connection,
    Person,
    Project,
    TimeEntry,
    TodoList;

function setConnection(con) {
  connection = con
}

Person = (function() {
  
  function Person(data) {
    var key;
    for(key in data) {
      this[key] = data[key]
    }
  }

  Person.me = function(cb) {
    var me;
    connection.request.json('me', 'GET', null, function(err, data) {
      if(err) {
        cb(err)
      } 
      else {
        me = new Person(data)
        cb(null, me)
      }
    })
  }

  return Person
})();


Project = (function() {
  
  function Project (data) {
    var key;
    for(key in data) {
      this[key] = data[key]
    }
  }

  Project.all = function(cb) {
    var projects,
        project,
        i;
    connection.request.json('projects', 'GET', null, function(err, data) {
      if(err) {
        cb(err)
      } 
      else {
        projects = []
        for(i = 0; i < data.records.length; i++) {
          project = new Project(data.records[i])
          projects.push(project)
        }
        return cb(null, projects)
      }
    })
  }

  Project.findByName = function(projectname, cb) {
    this.all(function(err, projects) {
      var project;
      if(err) {
        return cb(err)
      }
      for (var i = projects.length - 1; i >= 0; i--) {
        if(projects[i]['name'].toLowerCase() == projectname.toLowerCase()) {
          project = projects[i]
          break
        }
      }
      if(!project) {
        return cb({
          error: 'could not find the project'
        })
      }
      return cb(null, project)
    })
  }

  Project.prototype.todoLists = function(cb) {
    var self,
        todolist,
        i;
    self = this
    self.todoLists = []
    connection.request.json('projects/'+this.id+'/todo_lists', 'GET', null, function(err, data) {
      if(err) {
        return cb(err)
      }
      for(i = 0; i < data.records.length; i++) {
        self.todoLists.push((new TodoList(data.records[i])))
      }
      cb(null, self.todoLists)
    })
  }

  Project.prototype.trackTime = function(person, date, hours, desc, cb) {
    var timeEntry,
        data,
        xml;
    timeEntry = new TimeEntry({
      'person-id': person['id'],
      'date': date || new Date(),
      'hours': hours,
      'description': desc || 'Yay i worked. for realz'
    })
    connection.request.xml('projects/'+this.id+'/time_entries', 'POST', timeEntry.toXML(), function(err) {
      if(err) {
        cb(err)
      }
      else {
        cb(null)
      }
    })
  }
  return Project
})();


TodoList = (function(){
  
  function TodoList(data) {
    var key;
    for(key in data) {
      this[key] = data[key]
    }
  }

  return TodoList
})()


TimeEntry = (function() {
  
  function TimeEntry (data) {
    var key;
    for(key in data) {
      this[key] = data[key]
    }
  }

  TimeEntry.prototype.toXML = function() {
    return ([
      "<time-entry>",
        "\t<person-id>"+this['person-id']+"</person-id>",
        "\t<date>"+this['date']+"</date>",
        "\t<hours>"+this['hours']+"</hours>",
        "\t<description>"+this['description']+"</description>",
      "</time-entry>"
    ]).join('\n')
  }

  return TimeEntry
})();


module.exports = {
  setConnection: setConnection,
  Person: Person,
  Project: Project,
  TimeEntry: TimeEntry,
  TodoList: TodoList
}

