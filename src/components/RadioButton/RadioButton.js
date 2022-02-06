import React from 'react';

const RadioButton = ({vehiclesDetails, destinationItemId , state, vehicleSelected, currentPlanetSelected}) => {
    return vehiclesDetails.map((eachVehicle) => {
        const isChecked = state.selectedRadio === eachVehicle.name;
        const checkDistanceLogic = currentPlanetSelected.distance > eachVehicle.max_distance
        const isDisabled = (state.selectedRadio!==eachVehicle.name && eachVehicle.total_no===0)  || (checkDistanceLogic)
        // console.log({currentPlanetSelected,eachVehicle,state: state.selectedRadio, isDisabled })
        const id = `${eachVehicle.name}-${destinationItemId}`
        return (
            <li key={id}>
              <input
                id={id}
                type="radio"
                value={eachVehicle.name}
                name={`${destinationItemId}`}
                onChange={vehicleSelected}
                checked={isChecked}
                disabled={isDisabled}
              />
              <label htmlFor={id} style={isDisabled ? {color: 'gray'}: null}>
                {eachVehicle.name} ({eachVehicle.total_no})
              </label>
            </li>
          )
    });
};

RadioButton.propTypes = {};

export default RadioButton;
