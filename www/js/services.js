var model = angular.module('starter.services', [])

  /********************************************************************************
   Users
   ********************************************************************************/
  .factory('Users', function (toast) {
    // Might use a resource here that returns a JSON array

    var users = [];
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
              user.addDate = resultSet.rows.item(x).addDate;
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

      getbymobile: function (mobile) {

      },

      get: function (userId) {
        userId = parseInt(userId);
        for (var i = 0; i < users.length; i++) {
          if (users[i].id === userId) {
            var user = users[i];
            user.sum = 0;
            //获取user的所有消费记录
            var records = [];
            var db = window.sqlitePlugin.openDatabase({ name: 'nail.db', location: 'default' });
            db.transaction(function (tx) {
              var query = "select rid,userId,inDate,inOut,amount,remark from Record where userId=? order by inDate desc";

              tx.executeSql(query, [userId], function (tx, resultSet) {
                //alert(JSON.stringify(resultSet.rows.item(0)));
                for (var x = 0; x < resultSet.rows.length; x++) {
                  var record = {};
                  record.id = resultSet.rows.item(x).rid;
                  record.inOut = resultSet.rows.item(x).inOut;
                  record.amount = resultSet.rows.item(x).amount;
                  record.inDate = new Date(resultSet.rows.item(x).inDate).toLocaleString();
                  record.remark = resultSet.rows.item(x).remark;
                  records.push(record);
                  if (record.inOut) {
                    user.sum += record.amount;
                  }
                }
              });
            });
            user.records = records;
            return user;
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

            var query = "INSERT INTO Record (userId,inDate,inOut,amount,remark) VALUES (?,?,?,?,?)";
            //第一次加入会员 充值记录
            tx.executeSql(query, [res.insertId, new Date(), 1, parseInt(user.balance), '首次充值'])
          });
        });
        return null;
      },

      update: function (user) {

        var db = window.sqlitePlugin.openDatabase({ name: 'nail.db', location: 'default' });
        db.transaction(function (tx) {
          //编辑资料
          var query = "UPDATE Users set name=?,mobile=?,birthday=?,editDate=?,avatar=?,balance=? Where uid=?";
          //更新金额
          if (user.amount) {
            if (user.inOut) {
              //充值
              user.balance = parseInt(user.amount) + parseInt(user.balance);
            } else {
              user.balance = parseInt(user.balance) - parseInt(user.amount);
            }
          }
          tx.executeSql(query, [user.name, user.mobile, user.birthday, new Date(), user.avatar, user.balance, user.id], function (tx, res) {
            if (user.amount) {
              //插入流水
              var query = "INSERT INTO Record (userId,inDate,inOut,amount,remark) VALUES (?,?,?,?,?)";

              tx.executeSql(query, [user.id, new Date(), user.inOut, user.amount, user.remark]);
            }
          });
        });
      },
    };
  });

/********************************************************************************
 Dash
 ********************************************************************************/
model.factory('dash', function (toast) {
  var status = {
    subList: [],
    addList: [],
    dailyAdds: 0,
    dailySub: 0
  };
  return {
    all: function () {
      status = {
        subList: [],
        addList: [],
        dailyAdds: 0,
        dailySub: 0
      };
      var db = window.sqlitePlugin.openDatabase({ name: 'nail.db', location: 'default' });

      db.transaction(function (tx) {
        var query = "select * from ((select rid,userId,inDate,inOut,amount,remark from Record where inDate>datetime('now')) r left join Users on r.userId = Users.uid) order by inDate desc";

        tx.executeSql(query, [], function (tx, resultSet) {

          for (var x = 0; x < resultSet.rows.length; x++) {
            var record = {};
            var user = {};
            //alert(JSON.stringify(resultSet.rows.item(x)));
            user.id = resultSet.rows.item(x).userId;
            user.name = resultSet.rows.item(x).name;
            user.mobile = resultSet.rows.item(x).mobile;
            user.birthday = resultSet.rows.item(x).birthday;
            user.balance = resultSet.rows.item(x).balance;
            user.avatar = resultSet.rows.item(x).avatar;
            user.addDate = new Date(resultSet.rows.item(x).addDate).toLocaleDateString();

            record.id = resultSet.rows.item(x).rid;
            record.amount = resultSet.rows.item(x).amount;
            record.inOut = resultSet.rows.item(x).inOut;
            record.inDate = new Date(resultSet.rows.item(x).inDate).toLocaleDateString();
            record.remark = resultSet.rows.item(x).remark;
            record.user = user;
            if (record.inOut) {
              status.dailyAdds = status.dailyAdds + record.amount;
              status.addList.push(record);
              //alert(record.inOut +"&&"+dailyAdds+JSON.stringify(addList));
            } else {
              status.dailySub = status.dailySub + record.amount;
              status.subList.push(record);
              //alert(record.inOut +"&&"+dailySub+JSON.stringify(subList));
            }
          }
        });
      });
      //alert(JSON.stringify(status));
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