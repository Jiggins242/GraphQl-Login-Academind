## To Create Patient

You can return: ID, Title, Forname, Surname, Age

---------------------------------------------------------------------------------------------
mutation {
  createPatient(patientInput: {title: "Mr", forname: "Homer", surname: "Simpson", age: 39}) {
    title
    forname
  }
}

---------------------------------------------------------------------------------------------



## To Create a User

You should not return the password but, is no set to null in the return so will only display null

If this was not set to null it would send back the hashed password

---------------------------------------------------------------------------------------------
mutation{
  createUser(userInput:{username:"test", email:"test.com", password:"test"}){
    _id
    username
    email
  }
}

---------------------------------------------------------------------------------------------

## To Book an event

---------------------------------------------------------------------------------------------
mutation {
  bookEvent(eventId: "...") {
    _id
    createdAt
    user{
      email
    }
  }
}

---------------------------------------------------------------------------------------------

## To cancel a booking 

---------------------------------------------------------------------------------------------
mutation{
  cancelBooking(bookingId:"..."){
    title
    creator{
      username
    }
  }
}

---------------------------------------------------------------------------------------------