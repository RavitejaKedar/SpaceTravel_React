import React, { Component } from "react";
import DestinationItem from "../DestinationItem/index";

var idList = [1, 2, 3, 4];
class DestinationItemsContainer extends Component {
  state = {
    renderPlanetsData: [],
    renderVehiclesData: [],
    allTheDataSelectedByUser: [],
    isPlanetSelected: false,
    time: 0,
    isFindDisabled: true,
    reset: false,
  };

  componentDidMount = () => {
    this.getVehicleDetails();
    this.getPlanetDetails();
  };

  componentDidUpdate(prevProps, prevState) {
    // Once all user data upate : we have final data so we can calcul time
    if (
      prevState.allTheDataSelectedByUser !== this.state.allTheDataSelectedByUser
    ) {
      let time = 0;
      let count = 0;
      this.state.allTheDataSelectedByUser.forEach((element) => {
        if (element.vehicleSpeed) {
          count++;
          time += element.planetDistance / element.vehicleSpeed;
        }
      });
      // this below will enable when all data seelcted spo find button to be enabled
      if (count === idList.length) {
        this.setState({ time, isFindDisabled: false });
      } else {
        this.setState({ time });
      }
    }
  }

  getVehicleDetails = async () => {
    const response = await fetch("https://findfalcone.herokuapp.com/vehicles", {
      method: "GET",
    });
    const data = await response.json();
    response.ok
      ? this.setState({ renderVehiclesData: data })
      : this.onFailure();
  };

  getPlanetDetails = async () => {
    const response = await fetch("https://findfalcone.herokuapp.com/planets", {
      method: "GET",
    });
    const data = await response.json();
    response.ok ? this.setState({ renderPlanetsData: data }) : this.onFailure();
  };

  onSelectPlanet = async (
    selectedPlanet,
    planetDistance,
    destinationItemId
  ) => {
    /*
    `1. get selected planet 
    2. create planet data structe 
    3, push to sttate
    **/
    const userSelectedPlanetInfo = {
      destinationItemId: destinationItemId,
      planetName: selectedPlanet,
      planetDistance: planetDistance,
    };

    const newUserSelected = this.state.allTheDataSelectedByUser.filter(
      (record) => record.destinationItemId !== destinationItemId
    );

    this.setState((prevState) => ({
      allTheDataSelectedByUser: [...newUserSelected, userSelectedPlanetInfo],
      isPlanetSelected: true,
    }));
  };

  onSelectVehicle = (currentVechile, data) => {
    /*
    `1. get selected vechile 
    2.. add new selected vechile datails fields on allTheDataSelectedByUser
    3, updated in state
    **/
    const userData = Object.assign([], this.state.allTheDataSelectedByUser);
    const findIndex = this.state.allTheDataSelectedByUser.findIndex(
      (r) => r.destinationItemId === data.destinationItemId
    );
    if (findIndex !== -1) {
      userData[findIndex] = {
        ...userData[findIndex],
        ...data,
      };
    }

    // when

    if (data.reset) {
      this.setState({
        renderVehiclesData: currentVechile,
      });
    } else {
      this.setState({
        renderVehiclesData: currentVechile,
        allTheDataSelectedByUser: userData,
      });
    }
  };

  render() {
    const {
      renderPlanetsData,
      renderVehiclesData,
      isPlanetSelected,
      allTheDataSelectedByUser,
      time,
      isFindDisabled,
      reset,
    } = this.state;
    return (
      <React.Fragment>
        <h1>{time}</h1>
        {renderPlanetsData.length > 0 && !reset ? (
          <ul>
            {idList.map((eachItemID) => (
              <DestinationItem
                key={eachItemID}
                planetsDetails={renderPlanetsData}
                vehiclesDetails={renderVehiclesData}
                destinationItemId={eachItemID}
                showTheDropDown={isPlanetSelected}
                onSelectVehicle={this.onSelectVehicle}
                onSelectPlanet={this.onSelectPlanet}
                allTheDataSelectedByUser={allTheDataSelectedByUser}
                reset={reset}
              />
            ))}
          </ul>
        ) : (
          <p>Loading...</p>
        )}
        <button disabled={isFindDisabled}>Find</button>
        <button
          onClick={() => {
            this.setState(
              {
                reset: true,
                allTheDataSelectedByUser: [],
                isPlanetSelected: false,
                time: 0,
                isFindDisabled: true,
              },
              () => {
                setTimeout(() => {
                  this.setState({ reset: false });
                }, 0);
              }
            );
          }}
        >
          Reset
        </button>
      </React.Fragment>
    );
  }
}

export default DestinationItemsContainer;
