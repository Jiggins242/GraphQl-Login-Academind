const { buildSchema } = require('graphql')

module.exports = buildSchema(`

type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

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
    forename: String!
    surname: String!
    age: Int!
    creator: User!
}

type User {
    _id: ID!
    username: String!
    password: String
    # Password can be null as we should never want to return the password from the DB to the user 
    createdEvents: [Event!]
    createdPatients: [Patient!]
}


type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
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
    forename: String!
    surname: String!
    age: Int!
}

input UserInput {
    username: String!
    password: String!
}

type RootQuery {
    events: [Event!]!
    patients: [Patient!]!
    bookings: [Booking!]!
    login(username: String!, password: String!): AuthData!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createPatient(patientInput: PatientInput): Patient
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)