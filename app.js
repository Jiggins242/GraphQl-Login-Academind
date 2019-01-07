const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')

const Event = require('./models/event')

const app = express()

app.use(bodyParser.json())

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type Patient {
            _id: ID!
            title: String!
            forname: String!
            surname: String!
            age: Int!
        }

        #
        # Input is the required input for the create Mutations
        #

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input PatientInput {
            title: String!
            forname: String!
            surname: String!
            age: Int!
        }

        type RootQuery {
            events: [Event!]!
            patient: [Patient!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createPatient(patientInput: PatientInput): Patient
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: { 
        events: () => {
            return events
        },

        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            return event.save()
            .then( result => {
                console.log(result)
                return { ...result._doc}
            }).catch( err => { 
                console.log(err)
                throw err
            })

        }
    },
    
    graphiql: true
    })
)

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