import React, { Component } from 'react'
import loading from "./loading.gif"
export class Spinner extends Component {
  render() {
    return (
      <div>
        <img src={loading} alt="Loading" style={{ width: "100px", margin: "auto", display: "block" }} />
      </div>
    )
  }
}

export default Spinner
