import { useState, useEffect } from 'react'
import axios from 'axios'
const api_key = import.meta.env.VITE_OPENWEATHERMAP_KEY

const Searchbar = ({search, handleSearch}) => {
  return (
  <div>
    find countries
    <input value={search} onChange={handleSearch}/>
  </div>
  )
}

const Countrylisting = ({countries, search, handleClick}) => {
  if (countries.length > 10 || search === '') {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (countries.length > 1) {
    return (
      <ul>
        {countries.map(country =>
          <li key={country.name.common}>
            {country.name.common}
            <button onClick={() => handleClick(country.name.common)}>show</button>
          </li>)
        }
      </ul>
    )
  } else if (countries.length === 1) {
    const country = countries[0]
    return (
      <>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <p><b>languages:</b></p>
      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags.png} width={'10%'} height={'10%'}/>
      <Weatherinfo lat={country.capitalInfo.latlng[0]} lon={country.capitalInfo.latlng[1]} capital={country.capital}/>
      </>
    )
  }
}

const Weatherinfo = ({lat, lon, capital}) => {
  const [temp, setTemp] = useState(null)
  const [wind, setWind] = useState(null)
  const [weatherCode, setWeatherCode] = useState(null)
  axios
    .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
      .then(response => {
        setTemp(response.data.main.temp)
        setWind(response.data.wind.speed)
        setWeatherCode(response.data.weather[0].icon)
      })
  return (
  <>
    <h2>Weather in {capital}</h2>
    <p>temperature {temp} Celsius</p>
    <img src={`https://openweathermap.org/img/wn/${weatherCode}@2x.png`}/>
    <p>wind {wind} m/s</p>
  </>
  )
}

const App = () => {

  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [countryData, setCountryData] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
        .then(response => setCountryData(response.data))
  }, [])

  const handleSearch = (event) => {
    const newSearch = event.target.value.toLowerCase()
    setSearch(newSearch)
    if (newSearch) {
      setCountries(countryData.filter(country => country.name.common.toLowerCase().includes(newSearch)))
    }
  }

  const handleClick = (countryName) => {
    setCountries(countries.filter(country => country.name.common === countryName))
    setSearch(countryName)
  }

  return (
    <>
    <Searchbar search={search} handleSearch={handleSearch}/>
    <Countrylisting countries={countries} search={search} handleClick={handleClick}/>
    </>
  )
}


export default App
