const { buildSchema } = require('graphql');

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
  location: String!
  duration: Int!
  maxNumBookings: Int!
  curNumBookings: Int!
  contact: String!
  address: String!
  canceled: Boolean!
}
type User {
  _id: ID!
  email: String!
  password: String
  city: String
  address: String
  phone: String
  firstname: String
  lastname: String
  createdEvents: [Event!]
}
type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}
input EventInput {
  title: String!
  description: String!
  price: Float!
  date: String!
  location: String!
  duration: Int!
  maxNumBookings: Int!
  contact: String!
  address: String!
  canceled: Boolean!
}
input UserInput {
  _id: ID!
  email: String!
  password: String!
  city: String
  address: String
  phone: String
  firstname: String!
  lastname: String!
}
type RootQuery {
    events: [Event!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
    user(userId: ID!): User
}
type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
    cancelEvent(eventId: ID!): Event!
    updateUser(userInput: UserInput): User
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);