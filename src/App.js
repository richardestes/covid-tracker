import React,{useEffect, useState} from "react";
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from "@material-ui/core"
import InfoBox from './InfoBox'
import "./InfoBox.css"
import Map from './Map'
import Table from './Table'
import LineGraph from "./LineGraph"
import {sortData,prettyPrintStat} from "./util"
import "leaflet/dist/leaflet.css";

function App() {
  
  const [countries, setCountries] = useState([]);
  const [country,setCountry] = useState('worldwide');
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);
  const [mapCenter,setMapCenter] = useState({lat:34.80746,lng:-40.4796});
  const [mapZoom,setMapZoom] = useState(3);
  const [mapCountries,setMapCountries] = useState([]);
  const [casesType,setCasesType] = useState("cases");
  const [countryInfoYesterday,setCountryInfoYesterday] = useState({});
  const [dataDifference, setDataDifference] = useState({});
  
  // Initial API call for worldwide
  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response=>response.json())
    .then(data=>{
      setCountryInfo(data);
    })
  },[])
  
  useEffect(()=>{
    const getCountriesData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then(data=>{
        const countries = data.map((country)=>(
          {
            name: country.country, // United Kingdom, United States, France, etc.
            value: country.countryInfo.iso2 // UK, USA, FR, etc.
          }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData();
  },[]);
  
  useEffect(()=>{
    const comparisonUrl = 'https://disease.sh/v3/covid-19/all?yesterday=true'; // Worldwide data
    const getCountriesDataYesterday = async () => {
    await fetch(comparisonUrl)
    .then(response=>response.json())
    .then(data=> {
      setCountryInfoYesterday(data);
      const difference = 
      {
        "cases": countryInfo.todayCases - countryInfoYesterday.todayCases,
        "recovered": countryInfo.todayRecovered - countryInfoYesterday.todayRecovered,
        "deaths": countryInfo.todayDeaths - countryInfoYesterday.todayDeaths
      }
      console.log(difference);
      setDataDifference(difference);
      });
    };
    getCountriesDataYesterday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  
  const onCountryChange = async (event) => {
    const countryCode=event.target.value;
    setCountry(countryCode);
    
    const url = 
      countryCode === 'worldwide'
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url)
    .then(response=>response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
    })
    
    const comparisonUrl = 
      countryCode === 'worldwide'
      ? 'https://disease.sh/v3/covid-19/all?yesterday=true'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}?yesterday=true`
    
    await fetch(comparisonUrl)
    .then(response=>response.json())
    .then(data=> {
      setCountry(countryCode);
      setCountryInfoYesterday(data);
      const difference = 
      {
        "cases": countryInfo.todayCases - countryInfoYesterday.todayCases,
        "recovered": countryInfo.todayRecovered - countryInfoYesterday.todayRecovered,
        "deaths": countryInfo.todayDeaths - countryInfoYesterday.todayDeaths
      }
      console.log(difference);
      setDataDifference(difference);
      countryCode === "worldwide"
        ? setMapCenter([34.80746, -40.4796])
        : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
    
  }
  
  //API RESULTS DEBUG AREA
  
  console.log("COUNTRY INFO >>>",countryInfo);
  console.log("COUNTRY INFO YESTERDAY >>> ",countryInfoYesterday);
  console.log("DATA DIFFERENCE >>>",dataDifference);
  //
  
  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 PROGRESS TRACKER</h1>
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
          <InfoBox
            className="infoBox_cases"
            isBlue
            active={casesType==='cases'}
            onClick={e=>setCasesType('cases')}
            title="Cases Reported Today"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
            difference={prettyPrintStat(dataDifference.cases)} 
          />
          <InfoBox
            isGreen
            className="infoBox_recovered"
            active={casesType==='recovered'}
            onClick={e=>setCasesType('recovered')}
            title="Recovered Today"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
            difference={prettyPrintStat(dataDifference.recovered)} 
          />
          <InfoBox
            className="infoBox_deaths"
            isRed
            active={casesType==='deaths'}
            onClick={e=>setCasesType('deaths')}
            title="Deaths Today"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total ={prettyPrintStat(countryInfo.deaths)}
            difference={prettyPrintStat(dataDifference.deaths)} 
          />
        </div>
        
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
        
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
          <h3 className="app_graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app_graph" casesType={casesType} />
        </CardContent>
      </Card>
    
    </div>
  );
}

export default App;
