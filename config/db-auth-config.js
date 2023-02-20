// DB connection Postgress
const {Pool} = require ("pg");
const connectionString = process.env.POSTGRESQL_CONNECTION;

const connectOptions = {
    connectionString
}

const pool = new Pool(connectOptions);

module.exports = pool;

