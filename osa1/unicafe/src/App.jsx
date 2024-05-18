import { useState } from 'react'

const Header = () => {
  return (
    <h1>give feedback</h1>
  )
}

const StatisticLine = (props) => {
  if (props.text === "average") {
    return (
      <tr>
        <td>{props.text}</td>
        <td>{props.value / props.count}</td>
      </tr>
    )
    }
    else if (props.text === "positive") {
      return (
        <tr>
          <td>{props.text}</td>
          <td>{props.value / props.count * 100} %</td>
        </tr>
      )
      }
  else {
    return (
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
    )
  }

}

const Statistics = (props) => {
  if (props.count > 0) {
  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={props.good} count={props.count}/>
          <StatisticLine text="neutral" value={props.neutral} count={props.count}/>
          <StatisticLine text="bad" value={props.bad} count={props.count}/>
          <StatisticLine text="all" value={props.count}/>
          <StatisticLine text="average" value={props.good + props.bad * -1} count={props.count}/>
          <StatisticLine text="positive" value={props.good} count={props.count}/>
        </tbody>
      </table>
    </div>
  )
  }
  else {
    return (
      <div>
        <h1>statistics</h1>
        <p>no feedback given</p>
      </div>
    )
  }

}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}


const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [count, setCount] = useState(0)

  const increaseGood = () => {
    setGood(good + 1)
    setCount(good + 1 + neutral + bad)
  }

  const increaseNeutral = () => {
    setNeutral(neutral + 1)
    setCount(good + neutral + 1 + bad)
  }

  const increaseBad = () => {
    setBad(bad + 1)
    setCount(good + neutral + 1 + bad)
  }

  return (
    <div>
      <Header />
      <Button handleClick={increaseGood} text="good"/>
      <Button handleClick={increaseNeutral} text="neutral"/>
      <Button handleClick={increaseBad} text="bad"/>
      <Statistics good={good} neutral={neutral} bad={bad} count={count}/>
    </div>
  )
}

export default App