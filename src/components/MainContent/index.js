import { Component } from "react";

import DestinationItemsContainer from "../DestinationItemsContainer/index";

class MainContent extends Component {
  state = { vehicleDetails: [], planetDetails: [] };
  onFailure = () => (
    <div>
      <h1>onFailure</h1>
    </div>
  );

  componentDidMount = () => {
    this.getTheToken();
  };

  getTheToken = async () => {
    const apiUrl = `https://findfalcone.herokuapp.com/token`;
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(apiUrl, options);
    const data = await response.json();

    if (response.ok === true) {
      console.log(data.token);
    } else {
      this.onFailure();
    }
  };

  render() {
    const { planetDetails, vehicleDetails } = this.state;
    return (
      <div>
        <h1>Select planet you want to search in:</h1>
        <DestinationItemsContainer
          planetData={planetDetails}
          vehicleData={vehicleDetails}
        />
      </div>
    );
  }
}
export default MainContent;
