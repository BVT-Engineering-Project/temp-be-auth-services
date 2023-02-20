//API Spec (Swagger)
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
          title: "Library API",
          version: "1.0.0",
          description: "A simple Express Library API"
        },
        servers: [
          {
            url: "http://localhost:5001"
          },
          {
            url: "https://api-nodeflux.lokasi.dev/"
          }
        ]
      },
    apis: ['./router/users.js', './express-error.js']
};

const apiSpec = swaggerJsDoc(swaggerOptions);

module.exports = apiSpec;
