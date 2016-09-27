var model = angular.module('starter.services', [])

  /********************************************************************************
   Users
   ********************************************************************************/
  .factory('Users', function (toast,$cordovaSQLite) {
    // Might use a resource here that returns a JSON array

    var users = [{
        id:999,
        name:'臧莹',
        mobile:'15890198396',
        birthday:new Date(),
        balance:1000
    },{
        id:998,
        name:'jyma1991',
        mobile:'15890198396',
        birthday:new Date(),
        balance:1000
    }];
    return {
      all: function () {
        // users = [];
        // var db = window.sqlitePlugin.openDatabase({ name: 'nail.db', location: 'default' });

        // db.transaction(function (tx) {
        //   var query = "SELECT uid,name,mobile,birthday,addDate,editDate,balance,avatar FROM Users";

        //   tx.executeSql(query, [], function (tx, resultSet) {
        //     //toast.show("结果: " + resultSet.rows.length, 'long', 'bottom');
        //     for (var x = 0; x < resultSet.rows.length; x++) {
        //       var user = {};
        //       user.id = resultSet.rows.item(x).uid;
        //       user.name = resultSet.rows.item(x).name;
        //       user.mobile = resultSet.rows.item(x).mobile;
        //       user.birthday = resultSet.rows.item(x).birthday;
        //       user.balance = resultSet.rows.item(x).balance;
        //       user.avatar = resultSet.rows.item(x).avatar;
        //       user.addDate=resultSet.rows.item(x).addDate;
        //       user.editDate = resultSet.rows.item(x).editDate;
        //       users.push(user);
        //     }
        //   });
        // });
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
      },

      add:function(user){
        // 打开数据库
        var db = window.sqlitePlugin.openDatabase({ name: 'nail.db', location: 'default' });
        //开启事务
        db.transaction(function (tx) {
            var query = "INSERT INTO Users (name,mobile,birthday,addDate,editDate,balance,avatar) VALUES (?,?,?,?,?,?,?)";

            tx.executeSql(query, [user.name, user.mobile, user.birthday, new Date(), new Date(), user.balance, user.avatar]);
        }, function (error) {
            toast.show('transaction error: ' + error.message, 'long', 'bottom');
        }, function () {
            //toast.show('transaction ok', 'short', 'bottom');
        });
        return null;
      },

      update:function(user) {

        var db = window.sqlitePlugin.openDatabase({ name: 'nail.db', location: 'default' });
        db.transaction(function (tx) {

            var query = "UPDATE Users set (name,mobile,birthday,addDate,editDate,balance,avatar) VALUES (?,?,?,?,?,?,?) Where uid=" + user.id;

            tx.executeSql(query, [user.name, user.mobile, user.birthday, new Date(), new Date(), user.balance, user.avatar], function (tx, res) {
                if (user.amount) {
                    //插入流水
                    var query = "INSERT INTO Record (userId,inDate,inOut,amount) VALUES (?,?,?,?)";

                    tx.executeSql(query, [user.id, new Date(), user.inOut, user.amount]);
                }
            }, function (tx, error) {
                toast.show('更新出错: ' + error.message, 'long', 'bottom');
            });
        }, function (error) {
            toast.show('transaction error: ' + error.message, 'long', 'bottom');
        });
    }

    };
  });

/********************************************************************************
 Dash
 ********************************************************************************/
model.factory('dash', function (toast,$cordovaSQLite) {
  var records=[];
  return {
    all:  function () {
        records = [];
        var db = window.sqlitePlugin.openDatabase({ name: 'nail.db', location: 'default' });

        db.transaction(function (tx) {
          var query = "select * from ((select rid,userId,inDate,inOut,amount from Record where inDate>datetime('now')) r left join Users on r.userId = Users.uid) order by inDate desc";

          tx.executeSql(query, [], function (tx, resultSet) {
            toast.show("结果: " + resultSet.rows.length, 'long', 'bottom');
            for (var x = 0; x < resultSet.rows.length; x++) {
              var record = {};
              var user={};
              record.id = resultSet.rows.item(x).rid;
              user.id =resultSet.rows.item(x).userId;
              user.name = resultSet.rows.item(x).name;
              user.mobile = resultSet.rows.item(x).mobile;
              user.birthday = resultSet.rows.item(x).birthday;
              user.balance = resultSet.rows.item(x).balance;
              record.amount = resultSet.rows.item(x).amount;
              user.inOut=resultSet.rows.item(x).inOut;
              record.inDate = resultSet.rows.item(x).rid;
              user.avatar = resultSet.rows.item(x).inDate;
              record.user=user;
              records.push(record);
            }
          }, function (tx, error) {
            toast.show('SELECT error: ' + error.message, 'long', 'bottom');
            alert('SELECT error: ' +error.message);
          });
        }, function (error) {
          toast.show('transaction error: ' + error.message, 'long', 'bottom');
          alert('transaction error: ' +error.message);
        }, function () {
          toast.show('transaction ok', 'long', 'bottom');
        });
        return records;
      }
  }
})


/********************************************************************************
 Toast
 ********************************************************************************/
model.factory('toast', function () {

  var toastShow = function (toastMsg) {
    window.plugins.toast.show(toastMsg, 'long', 'bottom');
  }

  return {
    show: toastShow
  }
})