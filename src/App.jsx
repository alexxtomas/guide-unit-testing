import './App.css'
import Movies from './Movies'
function App() {
  return (
    <div className="container">
      <Movies url="http://localhost:3000/movies" />
    </div>
  )
}

export default App
