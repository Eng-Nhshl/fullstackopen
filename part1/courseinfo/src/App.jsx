const Header = ({course}) => <h1>{course.name}</h1>

const Part = ({name, exercises}) => {
  return (
    <>
    <p>{name} {exercises}</p>
    </>
  )
}

const Content = ({course}) => {
  return (
    <div>
      {course.parts.map((part, i) => 
        <Part key={i} name={part.name} exercises={part.exercises}/>
      )}
    </div>
  )
}

const Total = ({course}) => <p>Number of exercises: {course.parts.reduce((sum, part) => sum + part.exercises, 0)}</p>

const App = () => {
  const course = {
    name:  'Half Stack application development',
    parts: [
    {name: 'Fundamentals of React', exercises: 10},
    {name: 'Using props to pass data', exercises: 7},
    {name: 'State of a component', exercises: 14}
  ]
}

  return (
    <div>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
    </div>
  )
}

export default App