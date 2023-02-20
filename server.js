require('newrelic');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const http = require("http");
const app = require("./app");
const port = process.env.PORT || 5001;
const server = http.createServer(app);
server.listen(port, () => console.log(`Running Server On Port ${port}...`));
