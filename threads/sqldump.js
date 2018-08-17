const mysqldump = require('mysqldump');
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
require('console-color-mr');

const updateNodes = function upN(){

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

setInterval(updateNodes,miscSettings.SQLDelay);

console.error("**NODE SQL Backup SYSTEM** is now Online.");
