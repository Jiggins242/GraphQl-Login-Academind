
import React, { Component } from 'react'
import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

const AllPatients_QUERY = gql`
{
    allPatients {
      title
      surname
      forename
      age
      
    }
  }
`


class PatientList extends Component {

    displayPatients(){
      // Comes into the browser as "data" property
        var data = this.props.data
        if(data.loading){
            return(<div>Rome was not built in a day...</div>)
        }
        if(data.error){
            return(<div>Ops we broke it</div>)
        } 
        else {
            return data.allPatients.map(patient => {
                return(
                <div> {patient.title} {patient.surname} {patient.forename} {patient.age}</div>
                )
            }) 
        }
    }

  render() {
    // Is here for debugging issues
    console.log(this.props)
    return (
      <div> 
        <ul id="patient-list">
        { this.displayPatients()}
        </ul>
      </div>
    ) 
  } 
}
//Binds the query to the componet
export default graphql(AllPatients_QUERY) (PatientList)


/*
{patient.doctor.forename} {patient.doctor.surname}
*/