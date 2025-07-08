import { useState } from "react"

const Header = ({title}) => <h1>{title}</h1>

const Button = ({text, onClick}) => <button onClick={onClick}>{text}</button>

const Statistics = ({good, neutral, bad, all, average, positive}) => {
  if (all === 0) {
    return (
      <tr colSpan='2'>
        <td>No Feedbacks Given!</td>
      </tr>
    )
  }
  return (
      <>
        <tr>
          <td>Good:</td>
          <td>{good}</td>
        </tr>
        <tr>
          <td>Neutral:</td>
          <td>{neutral}</td>
        </tr>
        <tr>
          <td>Bad:</td>
          <td>{bad}</td>
        </tr>
        <tr>
          <td>Average:</td>
          <td>{average}</td>
        </tr>
        <tr>
          <td>Positive:</td>
          <td>{positive}%</td>
        </tr>
      </>
  )
}
const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

const handleGoodClick = () => {
  setGood(good => good + 1)
}

const handleNeutralClick = () => {
  setNeutral(neutral => neutral + 1)
}

const handleBadClick = () => {
  setBad(bad => bad + 1)
}

const all = good + neutral + bad
const average = all === 0 ? 0 : ((good - bad) / all).toFixed(2)
const positive = all === 0 ? 0 : ((good / all) * 100).toFixed(2)

  return (
    <div>
      <Header title={'Give feedback'}/>
      <Button text={'good'} onClick={handleGoodClick}/>
      <Button text={'neutral'} onClick={handleNeutralClick}/>
      <Button text={'bad'} onClick={handleBadClick}/>
      <Header title={'Statistics'}/>
      <table>
        <tbody>
          <Statistics 
            good={good}
            neutral={neutral}
            bad={bad}
            all={all}
            average={average}
            positive={positive}
        />
        </tbody>
      </table>
    </div>
  )
}

export default App