/*
 * Run the project and access the documentation at: http://localhost:3000/doc
 *
 * Use the command below to generate the documentation without starting the project:
 * $ npm start
 *
 * Use the command below to generate the documentation at project startup:
 * $ npm run start-gendoc
 */


const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger-output.json')
const express = require('express')
const app = express()
const cors = require('cors');

/* Routes */
const router = require('./routes')

app.use(express.json({ type: '*/*' }));

/* Middlewares */
app.use(router)
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.get('/', (req, res) => {
  res.redirect('/doc');
});

// app.use(cors({
//   origin: '*'
// }));

app.use(cors())

app.listen(3000, () => {
  console.log("Server is running!\nAPI documentation: http://localhost:3000/doc")
})

app.listen(443, () => {
  console.log("Server is running!\nAPI documentation: http://localhost:3000/doc")
})

app.listen(80, () => {
  console.log("Server is running!\nAPI documentation: http://localhost:3000/doc")
})
