const Header = ({name}) => {
    return (
    <h2>
      {name}
    </h2>
    )
  }
  
  const Part = ({part}) => {
    return (
      <li>
        {part.name} {part.exercises}
      </li>
    )
  }
  
  const Content = ({parts}) => {
    return (
      <>
      <ul>
        {parts.map(part => <Part key={part.name} part={part}/>)}
      </ul>
      <p>
        <b>total of {parts.reduce((sum, part) => sum += part.exercises, 0)} exercises</b>
      </p>
      </>
    )
  }

const Course = ({courses}) => {
  return (
    courses.map(course =>
      <div key={course.id}>
      <Header name={course.name} />
      <Content parts={course.parts} />
      </div>
    )
  )
}

export default Course