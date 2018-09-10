const mysqldump = require('mysqldump');
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
require('console-color-mr');

const dumpsql = function dsql(){

mysqldump({
    connection: {
      host: botSettings.mysqlip,
      user: botSettings.mysqluser,
      password: botSettings.mysqlpass,
      database: botSettings.mysqldb
    },
    dumpToFile: 'C:\\Users\\Administrator\\Desktop\\EGEMSQLBACKUPS\\backup.sql',
})
console.info("SQL database backed up to google drive.");
};

setInterval(dumpsql,miscSettings.SQLDelay);

const dumpsql2 = function dsql(){

mysqldump({
    connection: {
      host: botSettings.mysqlip,
      user: botSettings.mysqluser,
      password: botSettings.mysqlpass,
      database: botSettings.mysqldb
    },
    dumpToFile: 'C:\\Users\\Administrator\\Desktop\\EGEMSQLBACKUPS\\backup-3hour.sql',
})
console.info("3 hour SQL database backed up to google drive.");
};

setInterval(dumpsql2,miscSettings.SQL2Delay);

console.error("**NODE SQL Backup SYSTEM** is now Online.");
