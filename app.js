const express = require("express");
const app = express();
const morgan = require("morgan");
const webRoutes = require("./api/router/router");
const errorHandler = require("./api/middleware/errorHandler");
const useragent = require("express-useragent")
const cors = require("cors");
//API Spec
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "A simple Express Library API"
        },
        basePath: '/',
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        servers: [
            {
                url: "http://localhost:5001"
            },
            {
                url: "https://api-nodeflux.lokasi.dev/auth"
            }
        ]
    },
    apis: ['./api/controllers/*.js', './api/express-error']
};

const apiSpec = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec));

//API Spec End

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(useragent.express());

app.use("/", webRoutes);

app.use((req, res, next) => {
    req.header("Access-Control-Allow-Origin", "*");
    req.header(
        "Access-Control-Allow-Origin",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        req.header("Access-Control-Allow-Method", "PUT, POST, DELETE, PATCH, GET");
        return res.status(200).json({});
    }
    next();
});

app.use(errorHandler)

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;