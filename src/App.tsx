import React from 'react'
import './App.css'
import LineChart from './components/Charts/LineChart'
import BarChart from './components/Charts/BarChart'
import ScatterChart from './components/Charts/ScatterChart'
import { TData } from './types/dataTypes'

function App() {
  const data: TData = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 4 },
    { x: 4, y: 5 },
    { x: 5, y: 4 },
    { x: 7, y: 2 },
    { x: Math.random() * 100, y: Math.random() * 100 },
    { x: Math.random() * 100, y: Math.random() * 100 },
    { x: Math.random() * 100, y: Math.random() * 100 },
    { x: Math.random() * 100, y: Math.random() * 100 },
    { x: Math.random() * 100, y: Math.random() * 100 },
    { x: Math.random() * 100, y: Math.random() * 100 },
    { x: Math.random() * 100, y: Math.random() * 100 },
    { x: Math.random() * 100, y: Math.random() * 100 },
    { x: Math.random() * 100, y: Math.random() * 100 }
  ]

  return (
    <div className="space-y-5">
      <div className='shadow-lg p-5 flex items-stretch bg-sec justify-center'>
        <h1 className='text-prim'>Hello D3JS</h1>
      </div>
      <BarChart data={data} />
      <ScatterChart data={data} />
      <LineChart />
    </div>
  )
}

export default App
