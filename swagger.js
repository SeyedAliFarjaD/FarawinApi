const swaggerAutogen = require('swagger-autogen')()


const doc = {
    info: {
        version: "1.0.0",
        title: "Farawin Test API",
        description: "برای استفاده آزمایشی..."
    },
    host: "farawinapi.onrender.com",
    basePath: "/",
    schemes: ['https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    // tags: [
    //     {
    //         "name": "User",
    //         "description": "Endpoints"
    //     }
    // ],
    // securityDefinitions: {
    //     apiKeyAuth:{
    //         type: "apiKey",
    //         in: "header",       // can be "header", "query" or "cookie"
    //         name: "X-API-KEY",  // name of the header, query parameter or cookie
    //         description: "any description..."
    //     }
    // },
    // definitions: {
    //     Parents: {
    //         father: "Simon Doe",
    //         mother: "Marie Doe"
    //     },
    //     User: {
    //         name: "Jhon Doe",
    //         age: 29,
    //         parents: {
    //             $ref: '#/definitions/Parents'
    //         },
    //         diplomas: [
    //             {
    //                 school: "XYZ University",
    //                 year: 2020,
    //                 completed: true,
    //                 internship: {
    //                     hours: 290,
    //                     location: "XYZ Company"
    //                 }
    //             }
    //         ]
    //     },
    //     AddUser: {
    //         $name: "Jhon Doe",
    //         $age: 29,
    //         about: ""
    //     }
    // }
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./src/index.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./src/index')           // Your project's root file
})