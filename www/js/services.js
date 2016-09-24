angular.module('starter.services', [])

.factory('Users', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var users = [{
    id: 0,
    name: 'Ben Sparrow',
    mobile: '15921720506',
    birthday: '1992-01-02',
    balance:'1000'
  }, {
    id: 1,
    name: 'Max Lynx',
    mobile: '15921720507',
    birthday: '1992-01-02',
    balance:'2000'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    mobile: '15921720508',
    birthday: '1992-01-02',
    balance:'3000'
  }, {
    id: 3,
    name: 'Perry Governor',
    mobile: '15921720509',
    birthday: '1992-01-02',
    balance:'4000'
  }, {
    id: 4,
    name: 'Mike Harrington',
    mobile: '15921720506',
    birthday: '1992-01-02',
    balance:'5000'
  }];

  return {
    all: function() {
      return users;
    },
    remove: function(user) {
      users.splice(users.indexOf(user), 1);
    },
    get: function(userId) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === parseInt(userId)) {
          return users[i];
        }
      }
      return null;
    }
  };
});
