import React,{useEffect, useState} from "react";
import './App.css';
import {MenuItem,FormControl,Select,Card,CardContent} from "@material-ui/core"
import InfoBox from './InfoBox'
import Map from './Map'

function App() {
  
  const [countries, setCountries] = useState([]);
  const [country,setCountry] = useState('worldwide');
  
  useEffect(()=>{
    const getCountriesData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries = data.map((country)=>(
          {
            name: country.country, // United Kingdom, United States, France, etc.
            value: country.countryInfo.iso2 // UK, USA, FR, etc.
          }));
        setCountries(countries);
      });
    };
    getCountriesData();
  },[]);
  
  const onCountryChange = async (event) => {
    const countryCode=event.target.value;
    setCountry(countryCode);
  }
  
  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID Tracker</h1>
          <FormControl className="app_dropdown">
            <Select
            onChange={onCountryChange}
            variant="outlined"
            value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
              
            </Select>
          </FormControl>
        </div>
        
        <div className="app_stats">
          <InfoBox title="Coronavirus Cases" cases={123} total={2000} />
          <InfoBox title="Recovered" cases={124} total={3000} />
          <InfoBox title="Deaths"cases={125} total ={4000}/>
        </div>
        <Map />
        
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          {/* Table */}
          <h3>Worldwide New Cases</h3>
          {/* Graph */}
        </CardContent>
      </Card>
    
    </div>
  );
}

export default App;
