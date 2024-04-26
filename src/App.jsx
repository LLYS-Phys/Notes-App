import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Notes from './components/Notes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Notes />}>
            <Route path="*" element={<Notes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
