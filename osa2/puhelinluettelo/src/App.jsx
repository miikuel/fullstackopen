import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({message, errorColor}) => {
  if (message === null) {
    return null
  }

  const messageStyle = {
    color: errorColor,
    backgroundColor: 'lightGrey',
    borderStyle: 'solid',
    borderColor: errorColor,
    borderRadius: 6,
    borderWidth: 2,
    fontSize: 24
  }
  return (
    <>
    <div style={messageStyle}>
      {message}
    </div>
    <br />
    </>
  )

}

const Person = ({persons, search, deletePerson}) => {
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <ul>
        {filteredPersons.map((person) =>
        <li key={person.id}>{person.name} {person.number}<button onClick={() => deletePerson(person.id)}>delete</button></li>
        )}
    </ul>
  )
}

const Filter = ({newSearch, handleSearch}) => {
  return (
    <div>
      filter shown with: <input
      value={newSearch}
      onChange={handleSearch}
        />
    </div>
  )
}

const PersonForm = (props) => {
  return (
  <form onSubmit={props.addPerson}>
  <div>
    name: <input
    value={props.newName}
    onChange={props.handlePersonChange}
    />
  </div>
  <div>
  <div>
    number: <input
    value={props.newNumber}
    onChange={props.handleNumberChange}
    />
  </div>
    <button type="submit">add</button>
  </div>
  </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [errorColor, setErrorColor] = useState(null)


  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
      })
  }, [])
  
  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    const isAdded = persons.some(obj => obj.name === newName)
    if (isAdded) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with new one?`)) {
        const oldPerson = persons.find(person => person.name === newName)
        const updatedPerson = {...oldPerson, number: newNumber}
        personService
          .update(oldPerson.id, updatedPerson)
            .then(returnedPerson => {
              setPersons(persons.map(person => person.id != oldPerson.id ? person : returnedPerson))
              setMessage(`Updated number for ${newName}`)
              setTimeout(() => {setMessage(null)}, 5000)
              setErrorColor('green')
            })
            .catch(error => {
              setMessage(`Information of ${newName} has already been removed from server`)
              setTimeout(() => {setMessage(null)}, 5000)
              setPersons(persons.filter(person => person.name != newName))
              setErrorColor('red')
            })
      }
    }
    else {
      personService
        .create(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setMessage(`Added ${newName}`)
            setTimeout(() => {setMessage(null)}, 5000)
            setErrorColor('green')
        })
      
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id) => {
    const name = persons.find(person => person.id === id).name
    if (window.confirm(`delete ${name}`)) {
    personService
      .del(id)
        .then(returnedPerson => {
          setPersons(persons.filter(person => person.id != returnedPerson.id))
          setMessage(`Deleted ${name}`)
          setTimeout(() => {setMessage(null)}, 5000)
          setErrorColor('green')
        })
        .catch(error => {
          setMessage(`Information of ${name} has already been removed from server`)
          setTimeout(() => {setMessage(null)}, 5000)
          setPersons(persons.filter(person => person.name != name))
          setErrorColor('red')
      })
    }
  }
  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setNewSearch(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} errorColor={errorColor}/>
      <Filter newSearch={newSearch} handleSearch={handleSearch}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handlePersonChange={handlePersonChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Person persons={persons} search={newSearch} deletePerson={deletePerson}/>
    </div>
  )

}

export default App