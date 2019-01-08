const { buildSchema } = require('graphql')

module.exports = buildSchema(`

type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
}

type Patient {
    _id: ID!
    title: String!
    forname: String!
    surname: String!
    age: Int!
}

type User {
    _id: ID!
    username: String!
    email: String!
    password: String
    # Password can be null as we should never want to return the password from the DB to the user 
    createdEvents: [Event!]
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

input UserInput {
    username: String!
    email: String!
    password: String!
}

type RootQuery {
    events: [Event!]!
    patients: [Patient!]!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createPatient(patientInput: PatientInput): Patient
    createUser(userInput: UserInput): User
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)