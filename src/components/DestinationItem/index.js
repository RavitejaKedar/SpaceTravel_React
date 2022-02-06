import { Component } from "react";
import RadioButton from "../RadioButton/RadioButton";

class DestinationItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlanetSelected: this.props.showTheDropDown,
      currentPlanetSelected: {},
      dropdownList: this.props.planetsDetails,
      // radioList: {},
      selectedRadio: null,
      lastSelectedIndex: null,
    };
    this.updateUniquePlanetData = this.updateUniquePlanetData.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { allTheDataSelectedByUser } = this.props;
    //
    if (prevProps.allTheDataSelectedByUser !== allTheDataSelectedByUser) {
      this.updateUniquePlanetData();
    }
//reset to tihs component
    if (prevProps.reset !== this.props.reset && this.props.reset) {
      this.setState({
        isPlanetSelected: this.props.showTheDropDown,
        currentPlanetSelected: {},
        dropdownList: this.props.planetsDetails,
        // radioList: {},
        selectedRadio: null,
        lastSelectedIndex: null,
      });
    }
  }

  updateUniquePlanetData() {
    const {  planetsDetails, allTheDataSelectedByUser } =
      this.props;
    const { currentPlanetSelected } = this.state;
    const hashUserSelection = allTheDataSelectedByUser.reduce((acc, item) => {
      if (currentPlanetSelected.name !== item.planetName) {
        acc[item.planetName] = 1;
      }
      return acc;
    }, {});
    const uniquePlanetList = planetsDetails.filter(
      (eachPlanetItem) => !(eachPlanetItem.name in hashUserSelection)
    );

    this.setState({
      dropdownList: uniquePlanetList,
    });
  }

  planetSelected = (event) => {
    const { destinationItemId, onSelectPlanet, vehiclesDetails } = this.props;
    const { currentPlanetSelected } = this.state;
    const selectedPlanet = event.target.value;
    var planetDistance = "";
    let newCurrentPlanetSelected = Object.assign({}, currentPlanetSelected);
    this.props.planetsDetails.forEach((eachItem) => {
      if (eachItem.name === selectedPlanet) {
        planetDistance = eachItem.distance;
        newCurrentPlanetSelected = eachItem;
      }
    });

    onSelectPlanet(selectedPlanet, planetDistance, destinationItemId);

    // const creatingRadioList = vehiclesDetails.filter(
    //   (eachVehicle) =>
    //     eachVehicle.max_distance * eachVehicle.speed > planetDistance &&
    //     eachVehicle.total_no > 0
    // );


    //need to update vechile details when planet is modifed to original state
    //restting vechkie count to its original total count
    const { lastSelectedIndex } = this.state;
    const currentVechile = Object.assign([], this.props.vehiclesDetails);



    if (lastSelectedIndex !== null) {
      currentVechile[lastSelectedIndex].total_no += 1;
    }

    this.props.onSelectVehicle(currentVechile, {
      destinationItemId,
      reset: true,
    });

    //done

    this.setState({
      isPlanetSelected: true,
      currentPlanetSelected: newCurrentPlanetSelected,
      // radioList: creatingRadioList,
      selectedRadio: null,
      lastSelectedIndex: null,
    });
  };

  vehicleSelected = (event) => {
    const { lastSelectedIndex } = this.state;
    const { onSelectVehicle, destinationItemId } = this.props;
    const selectedVechicle = event.target.value;
    var vehicleRange = "";
    var vehicleSpeed = "";
    var vehicleCount = "";
    let index = null;
    const currentVechile = Object.assign([], this.props.vehiclesDetails);

    if (lastSelectedIndex !== null) {
      currentVechile[lastSelectedIndex].total_no += 1;
    }

    currentVechile.forEach((eachItem, i) => {
      if (eachItem.name === selectedVechicle) {
        vehicleRange = eachItem.max_distance;
        vehicleSpeed = eachItem.speed;
        vehicleCount = eachItem.total_no;
        eachItem.total_no -= 1;
        index = i;
      }
    });

    onSelectVehicle(currentVechile, {
      vehicleRange,
      vehicleSpeed,
      vehicleCount,
      destinationItemId,
      vehicleName: selectedVechicle,
    });

    this.setState({
      selectedRadio: selectedVechicle,
      lastSelectedIndex: index,
    });
  };

  renderPlanetsDropdown = () => {
    const { dropdownList } = this.state;
    return (
      <select defaultValue={"DEFAULT"} onChange={this.planetSelected}>
        <option value="DEFAULT" hidden disabled key={"select"}>
          Select
        </option>
        {dropdownList.map((eachPlanet) => (
            <option value={eachPlanet.name} key={eachPlanet.name}>
              {eachPlanet.name}
            </option>
          ))}
      </select>
    );
  };

  render() {
    const { destinationItemId, vehiclesDetails } = this.props;

    return (
      <li key={destinationItemId}>
        <p> DestinationItem - {destinationItemId}</p>
        {this.renderPlanetsDropdown()}
        {this.state.isPlanetSelected ? (
          <ul>
            <RadioButton
              key={`Radio-${destinationItemId}`}
              vehiclesDetails={vehiclesDetails}
              destinationItemId={destinationItemId}
              currentPlanetSelected={this.state.currentPlanetSelected}
              state={this.state}
              vehicleSelected={this.vehicleSelected}
            />
          </ul>
        ) : (
          ""
        )}
      </li>
    );
  }
}

export default DestinationItem;
