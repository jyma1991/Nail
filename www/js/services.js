var model = angular.module('starter.services', [])

  /********************************************************************************
   Users
   ********************************************************************************/
  .factory('Users', function (toast) {
    // Might use a resource here that returns a JSON array

    var users = [{
      id: 999,
      name: '臧莹',
      mobile: '15890198396',
      birthday: '1991/01/24',
      balance: 1000
    }, {
        id: 998,
        name: 'jyma1991',
        mobile: '15890198396',
        birthday: '1992/01/02',
        balance: 1000
      }];
    return {
      all: function () {
        users = [];
        var db = window.sqlitePlugin.openDatabase({ name: 'nail.db', location: 'default' });

        db.transaction(function (tx) {
          var query = "SELECT uid,name,mobile,birthday,addDate,editDate,balance,avatar FROM Users order by editDate desc";

          tx.executeSql(query, [], function (tx, resultSet) {
            //toast.show("结果: " + resultSet.rows.length, 'long', 'bottom');
            for (var x = 0; x < resultSet.rows.length; x++) {
              var user = {};
              user.id = resultSet.rows.item(x).uid;
              user.name = resultSet.rows.item(x).name;
              user.mobile = resultSet.rows.item(x).mobile;
              user.birthday = resultSet.rows.item(x).birthday;
              user.balance = resultSet.rows.item(x).balance;
              user.avatar = resultSet.rows.item(x).avatar;
              user.addDate=resultSet.rows.item(x).addDate;
              user.editDate = resultSet.rows.item(x).editDate;
              users.push(user);
            }
          });
        });
        return users;
      },

      remove: function (user) {
        users.splice(users.indexOf(user), 1);
      },

      get: function (userId) {
        for (var i = 0; i < users.length; i++) {
          if (users[i].id === parseInt(userId)) {
            users[i].sum=0;
            //获取user的所有消费记录
            var records = [];
            var db = window.sqlitePlugin.openDatabase({ name: 'nail.db', location: 'default' });
            db.transaction(function (tx) {
              var query = "select rid,userId,inDate,inOut,amount from Record where userId= ? order by inDate desc";

              tx.executeSql(query, [users[i].id], function (tx, resultSet) {
                toast.show(resultSet.rows.length);
                for (var x = 0; x < resultSet.rows.length; x++) {
                  var record = {};
                  record.id = resultSet.rows.item(x).rid;
                  record.inOut = resultSet.rows.item(x).inOut;
                  record.amount = parseInt(resultSet.rows.item(x).amount);
                  record.inDate = resultSet.rows.item(x).inDate;
                  records.push(record);
                  users[i].sum+=record.amount;
                }
              }, function (tx, error) {
                toast.show('查询记录出错: ' + error.message);
                alert('查询记录出错: ' + error.message);
              });
            });
            users[i].records = records;
            return users[i];
          }
        }
        return null;
      },

      add: function (user) {
        // 打开数据库
        var db = window.sqlitePlugin.openDatabase({ name: 'nail.db', location: 'default' });
        //开启事务
        db.transaction(function (tx) {
          var query = "INSERT INTO Users (name,mobile,birthday,addDate,editDate,balance,avatar) VALUES (?,?,?,?,?,?,?)";

          tx.executeSql(query, [user.name, user.mobile, user.birthday, new Date(), new Date(), parseInt(user.balance), parseInt(user.avatar)], function (tx, res) {
            var query = "INSERT INTO Record (userId,inDate,inOut,amount) VALUES (?,?,?,?)";

          //第一次加入会员 充值记录
          tx.executeSql(query, [user.id, new Date(), 1, parseInt(user.balance)]),function (tx, res) {
            alert(JSON.stringify(res))
          };
          });
        });
        return null;
      },

      update: function (user) {

        var db = window.sqlitePlugin.openDatabase({ name: 'nail.db', location: 'default' });
        db.transaction(function (tx) {
          //编辑资料
          var query = "UPDATE Users set (name,mobile,birthday,editDate,avatar,balance) VALUES (?,?,?,?,?,?) Where uid=" + user.id;
          //更新金额
          if (user.amount) {
            if (user.inOut) {
              //充值
              user.balance = parseInt(user.amount) + parseInt(user.balance);
            } else {
              user.balance = parseInt(user.balance) - parseInt(user.amount);
            }
          }
          tx.executeSql(query, [user.name, user.mobile, user.birthday, new Date(), user.avatar, parseInt(user.balance)], function (tx, res) {
            if (user.amount) {
              //插入流水
              var query = "INSERT INTO Record (userId,inDate,inOut,amount) VALUES (?,?,?,?)";

              tx.executeSql(query, [user.id, new Date(), user.inOut, parseInt(user.amount)]);
            }
          }, function (tx, error) {
            toast.show('更新出错: ' + error.message);
            alert("信息更新出错！" + error.message);
          });
        }, function (error) {
          toast.show('transaction error: ' + error.message);
        });
      }

    };
  });

/********************************************************************************
 Dash
 ********************************************************************************/
model.factory('dash', function (toast, $cordovaSQLite) {
  var addList = [];
  var subList = [];
  var dailyAdds = 0;
  var dailySub = 0;
  var status = {
    subList: subList,
    addList: addList,
    dailyAdds: dailyAdds,
    dailySub: dailySub
  };
  return {
    all: function () {
      addList = [];
      subList = [];
      dailyAdds = 0;
      dailySub = 0;
      var db = window.sqlitePlugin.openDatabase({ name: 'nail.db', location: 'default' });

      db.transaction(function (tx) {
        var query = "select * from ((select rid,userId,inDate,inOut,amount from Record where inDate>datetime('now')) r left join Users on r.userId = Users.uid) order by inDate desc";

        tx.executeSql(query, [], function (tx, resultSet) {
          toast.show("结果: " + resultSet.rows.length);
          for (var x = 0; x < resultSet.rows.length; x++) {
            var record = {};
            var user = {};
            record.id = resultSet.rows.item(x).rid;
            user.id = resultSet.rows.item(x).userId;
            user.name = resultSet.rows.item(x).name;
            user.mobile = resultSet.rows.item(x).mobile;
            user.birthday = resultSet.rows.item(x).birthday;
            user.balance = parseInt(resultSet.rows.item(x).balance);
            record.amount = parseInt(resultSet.rows.item(x).amount);
            user.inOut = resultSet.rows.item(x).inOut;
            record.inDate = resultSet.rows.item(x).inDate;
            user.avatar = resultSet.rows.item(x).avatar;
            record.user = user;
            if (user.inOut) {
              dailyAdds += parseInt(record.amount);
              addList.push(record);
            } else {
              dailySub += parseInt(record.amount);
              subList.push(record);
            }
          }
        }, function (tx, error) {
          toast.show('SELECT error: ' + error.message);
          alert('SELECT error: ' + error.message);
        });
      });
      alert(JSON.stringify(status));
      return status;
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