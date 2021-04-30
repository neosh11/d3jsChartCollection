import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const useD3 = (renderChartFn: (svg: any) => void, dependencies: React.DependencyList | undefined) => {
  const ref = useRef(null)

  useEffect(() => {
    renderChartFn(d3.select(ref.current))
    return () => {
      return
    }
  }, [renderChartFn, dependencies])
  return ref
}

const DrawChart = () => {
  interface IPoint {
    x: number
    y: number
  }
  type TData = IPoint[]

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

  const yAccessor = (d: IPoint) => d.y
  const xAccessor = (d: IPoint) => d.x

  //   const wrapper = d3.select('#wrapper')
  //   const svg = wrapper.append('svg')

  const dimensions = {
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60
    }
  }

  const ref = useD3(
    (svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>) => {
      console.log(svg.node()?.getBoundingClientRect().width)

      const width = svg.node()?.getBoundingClientRect().width
      const height = svg.node()?.getBoundingClientRect().height
      if (!width || !height) return

      const boundedWidth = width - dimensions.margin.left - dimensions.margin.right
      const boundedHeight = height - dimensions.margin.top - dimensions.margin.bottom

      svg.attr('width', width).attr('height', height)

      const yScale = d3.scaleLinear().domain(d3.extent(data, yAccessor)).range([boundedHeight, 0])

      const freezingTemperatures = svg
        .select('.bounds')
        .append('rect')
        .attr('x', 0)
        .attr('width', boundedWidth)
        .attr('y', 0)
        .attr('height', boundedHeight)
        .attr('fill', '#e0f3f3')

      const xScale = d3.scaleLinear().domain(d3.extent(data, xAccessor)).range([0, boundedWidth])

      const lineGenerator = d3
        .line<IPoint>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))

      const line = svg
        .select('.bounds')
        .append('path')
        .attr('d', lineGenerator(data))
        .attr('fill', 'none')
        .attr('stroke', '#af9358')
        .attr('stroke-width', 2)

      const yAxisGenerator = d3.axisLeft(yScale)
      const yAxis = svg.select('.bounds').append('g').call(yAxisGenerator)

      const xAxisGenerator = d3.axisBottom(xScale)
      const xAxis = svg.select('.bounds').append('g').call(xAxisGenerator)
    },
    [data.length, dimensions]
  )

  return (
    <svg
      ref={ref}
      style={{
        height: 500,
        width: '100%',
        marginRight: '0px',
        marginLeft: '0px'
      }}
    >
      <g
        className='bounds'
        style={{
          transform: `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
        }}
      />
    </svg>
  )
}

const Chart = () => {
  return (
    <>
      <h1>Chart</h1>
      <DrawChart />
    </>
  )
}

export default Chart
