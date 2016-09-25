var model = angular.module('starter.services', [])

  .factory('Users', function () {
    // Might use a resource here that returns a JSON array

    var users = [];
    // Some fake testing data
    // var users = [{
    //   id: 0,
    //   name: 'Ben Sparrow',
    //   mobile: '15921720506',
    //   birthday: new Date(),
    //   balance: 1000
    // }, {
    //     id: 1,
    //     name: 'Max Lynx',
    //     mobile: '15921720507',
    //     birthday: new Date(),
    //     balance: 2000
    //   }, {
    //     id: 2,
    //     name: 'Adam Bradleyson',
    //     mobile: '15921720508',
    //     birthday: new Date(),
    //     balance: 3000
    //   }, {
    //     id: 3,
    //     name: 'Perry Governor',
    //     mobile: '15921720509',
    //     birthday: new Date(),
    //     balance: 4000
    //   }, {
    //     id: 4,
    //     name: 'Mike Harrington',
    //     mobile: '15921720506',
    //     birthday: new Date(),
    //     balance: 5000
    //   }];

    return {
      all: function () {
        users = [];
        var db = window.sqlitePlugin.openDatabase({ name: 'nail.db', location: 'default' });

        db.transaction(function (tx) {

        tx.executeSql('CREATE TABLE IF NOT EXISTS Users ([id] INTEGER PRIMARY KEY NOT NULL,name,mobile,[birthday] DATE,[addDate] DATE,[editDate] DATE,[balance] INTEGER,extInfo)');
          var query = "SELECT id,name,mobile,birthday,addDate,editDate,balance FROM Users";

          tx.executeSql(query,[], function (tx, resultSet) {
            window.plugins.toast.show("结果: " + resultSet.rows.length, 'long', 'bottom');
            for (var x = 0; x < resultSet.rows.length; x++) {
              var user = {};
              user.id=resultSet.rows.item(x).id;
              user.name = resultSet.rows.item(x).name;
              user.mobile = resultSet.rows.item(x).mobile;
              user.birthday = resultSet.rows.item(x).birthday;
              user.balance = resultSet.rows.item(x).balance;
              users.push(user);
            }
          },function (tx, error) {
              window.plugins.toast.show('SELECT error: ' + error.message, 'long', 'bottom');
            });
        }, function (error) {
          window.plugins.toast.show('transaction error: ' + error.message, 'long', 'bottom');
        }, function () {
          window.plugins.toast.show('transaction ok', 'long', 'bottom');
        });
        return users;
      },
      remove: function (user) {
        users.splice(users.indexOf(user), 1);
      },
      get: function (userId) {
        for (var i = 0; i < users.length; i++) {
          if (users[i].id === parseInt(userId)) {
            return users[i];
          }
        }
        return null;
      }
    };
  });

