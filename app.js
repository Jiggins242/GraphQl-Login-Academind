const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')

const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')

const app = express()

app.use(bodyParser.json())

app.use(isAuth)
// We can now check every request if isAuth is true or not
// If we want a request only to be vaild for authorised users add this in 


// Allows to test the Ql API calls with graphiql
app.use(
    '/graphql', 
    graphqlHttp({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true
    })
);

// ES6 Promise
mongoose.Promise = global.Promise;
//Connect to DB before running the test ----------------------------------------------------------------------------------------------
    // Connect to MongoDB locally
    // Use connection string '127.0.0.1:27017' instead of local host to stop auth errors
    mongoose.connect(`mongodb://127.0.0.1:27017/emisdatabase`, {useNewUrlParser: true})
    .then(() => {
        console.log('--- Connected to Database ---')
        app.listen(3000)
        console.log('--- Listening to port 3000 ---')
    }).catch(err => {
        console.log(err)
    })
    // event listener on connection open to DB. Need the error to handle incase failed to connect, listens to ever error not just once 
// -----------------------------------------------------------------------------------------------------------------------------------