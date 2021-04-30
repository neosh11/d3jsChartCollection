import React from 'react'
import './App.css'
import LineChart from './components/Charts/LineChart'
import ScatterChart from './components/Charts/ScatterChart'

function App() {
  return (
    <div className='App'>
      <div className='flex items-stretch bg-sec justify-center'>
        <h1 className='text-prim'>Hello D3JS</h1>
      </div>
      <LineChart />
      <ScatterChart />
    </div>
  )
}

export default App
