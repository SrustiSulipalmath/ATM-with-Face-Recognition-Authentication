const MySQLStore = require('express-mysql-session')(session);
const dbConfig = require('./config/dbConfig');

module.exports = new MySQLStore({
  host: dbConfig.host,
  port: 3306,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database
});