import React from "react";
import numeral from "numeral";
import {Circle, Popup} from "react-leaflet"

const casesTypeColors = {
  cases: {
    option:{color:"#2531e2",fillColor:"#2531e2"},
    multiplier: 800,
  },
  recovered: {
    option:{color:"#7DD71D",fillColor:"#7DD71D"},
    multiplier: 1200,
  },
  deaths: {
    option:{color:"#CC1034",fillColor:"#CC1034"},
    multiplier: 3000,
  }
}

export const sortData = (data) => {
  const sortedData = [...data];
  return sortedData.sort((a,b) => a.cases < b.cases);
};

export const prettyPrintStat = (stat) => 
  stat ? `+${numeral(stat).format("0.0a")}` : "+0"

export const showDataOnMap = (data,casesType) =>
  data.map(country=>(
    <Circle
      center = {[country.countryInfo.lat,country.countryInfo.long]}
      fillOpacity={0.4}
      pathOptions={casesTypeColors[casesType].option}
      radius={
        Math.sqrt(country[casesType]) / 3 * casesTypeColors[casesType].multiplier
      }
    >
    <Popup>
      <div className="info-container">
        <div className="info-flag" style={{backgroundImage: `url(${country.countryInfo.flag})`}}/>
        <div className="info-name">{country.country}</div>
        <div className="info-confirmed">Total Cases: {numeral(country.cases).format("0,0")}</div>
        <div className="info-recovered">Total Recovered: {numeral(country.recovered).format("0,0")}</div>
        <div className="info-deaths">Total Deaths: {numeral(country.deaths).format("0,0")}</div>
      </div>
    </Popup>
    </Circle>
));
  