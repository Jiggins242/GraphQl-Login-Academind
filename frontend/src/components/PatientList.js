
import React, { Component } from 'react'
import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

const GETALLPATIENT_QUERY = gql`
{
    patients {
      title
      forename
      surname
      age
    }
  }
`


class PatientList extends Component {

    displayPatients(){
        var data = this.props.data
        if(data.loading){
            return(<div>Rome was not built in a day...</div>)
        }
        if(data.error){
            return(<div>Ops we broke it</div>)
        } 
        else {
            return data.patients.map(patient => {
                return(
                <div>{patient.forename} {patient.surname}</div>
                )
            })
        }
    }

  render() {
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
export default graphql(GETALLPATIENT_QUERY) (PatientList)