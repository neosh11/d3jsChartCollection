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

  const data2: TData = [
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
      top: 20,
      right: 20,
      bottom: 70,
      left: 70
    }
  }

  const ref = useD3(
    (svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>) => {
      const width = svg.node()?.getBoundingClientRect().width
      const height = svg.node()?.getBoundingClientRect().height
      if (!width || !height) return

      const boundedWidth = width - dimensions.margin.left - dimensions.margin.right
      const boundedHeight = height - dimensions.margin.top - dimensions.margin.bottom

      svg.attr('width', width).attr('height', height)

      const yScale = d3.scaleLinear().domain(d3.extent(data, yAccessor)).range([boundedHeight, 0]).nice()

      const freezingTemperatures = svg
        .select('.bounds')
        .append('rect')
        .attr('x', 0)
        .attr('width', boundedWidth)
        .attr('y', 0)
        .attr('height', boundedHeight)
        .attr('fill', '#e0f3f3')

      const xScale = d3.scaleLinear().domain(d3.extent(data, xAccessor)).range([0, boundedWidth]).nice()

      const drawDots = (dat, col) => {
        const dots = svg.select('.bounds').selectAll<SVGCircleElement, d3.BaseType>('circle').data<IPoint>(dat)
        dots
          .enter()
          .append('circle')
          .merge(dots)
          .attr('cx', d => xScale(xAccessor(d)))
          .attr('cy', d => yScale(yAccessor(d)))
          .attr('r', 5)
          .attr('fill', col)
      }

      // testcircle
      drawDots(data, 'red')
      drawDots(data2, 'cornflowerblue')

      // y axis label
      const yAxisGenerator = d3.axisLeft(yScale).ticks(4)
      const yAxis = svg.select('.bounds').append('g').call(yAxisGenerator)

      const yAxisLabel = yAxis
        .append('text')
        .attr('x', -boundedHeight / 2)
        .attr('y', "-3em")
        .attr('fill', 'black')
        .style('font-size', '1.4em')
        .text('Relative humidity')
        .style('transform', 'rotate(-90deg)')
        .style('text-anchor', 'middle')

      // x axis label

      const xAxisGenerator = d3.axisBottom(xScale)
      const xAxis = svg
        .select('.bounds')
        .append('g')
        .call(xAxisGenerator)
        .style('transform', `translateY(${boundedHeight}px)`)
      const xAxisLabel = xAxis
        .append('text')
        .attr('x', boundedWidth / 2)
        .attr('y', dimensions.margin.bottom - 10)
        .attr('fill', 'black')
        .style('font-size', '1.4em')
        .html('Potato (&deg;C)')
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

const ScatterChart = () => {
  return (
    <div className='flex flex-col justify-center'>
      <h2>Scatter Chart</h2>
      <DrawChart />
    </div>
  )
}

export default ScatterChart
