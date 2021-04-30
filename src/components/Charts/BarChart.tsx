import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { colors } from '../../constants/colors'
import { IPoint } from '../../types/dataTypes'
import Card from '../Card'

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

interface Props {
  data: IPoint[]
}

const DrawChart = (props: Props) => {
  const data = props.data
  const bucketSize = 4
  const binsGenerator = d3
    .bin<IPoint, number>()
    .domain([0, d3.max(props.data, d => d.x)])
    .value(d => d.x)
    .thresholds(bucketSize)

  const bins = binsGenerator(data)
  console.log(data)

  console.log(bins)

  const yAccessor = (d: d3.Bin<IPoint, number>) => d.length
  const xAccessor = (d: IPoint) => d.x

  //   const wrapper = d3.select('#wrapper')
  //   const svg = wrapper.append('svg')

  const dimensions = {
    margin: {
      top: 30,
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

      // For reaccess
      const bounds = svg.select('.bounds')

      const boundedWidth = width - dimensions.margin.left - dimensions.margin.right
      const boundedHeight = height - dimensions.margin.top - dimensions.margin.bottom

      svg.attr('width', width).attr('height', height)

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(bins, yAccessor)])
        .range([boundedHeight, 0])
        .nice()
      const xScale = d3.scaleLinear().domain(d3.extent(data, xAccessor)).range([0, boundedWidth]).nice()

      const binsGroup = bounds.append('g')
      const binGroups = binsGroup.selectAll('g').data(bins).enter().append('g')
      const barPadding = 10

      const barRects = binGroups
        .append('rect')
        .attr('x', d => xScale(d.x0) + barPadding / 2)
        .attr('y', d => yScale(yAccessor(d)))

        .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
        .attr('height', d => boundedHeight - yScale(yAccessor(d)))
        .attr('fill', colors.sec)

      // Bar text
      const barText = binGroups
        .filter(d => yAccessor(d) != 0)
        .append('text')
        .attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
        .attr('y', d => yScale(yAccessor(d)) - 5)
        .text(yAccessor)
        .style('text-anchor', 'middle')
        .attr('fill', 'darkgrey')
        .style('font-size', '12px')
        .style('font-family', 'sans-serif')

      // y axis label
      const yAxisGenerator = d3.axisLeft(yScale).ticks(4)
      const yAxis = svg.select('.bounds').append('g').call(yAxisGenerator)

      const yAxisLabel = yAxis
        .append('text')
        .attr('x', -boundedHeight / 2)
        .attr('y', '-3em')
        .attr('fill', 'black')
        .style('font-size', '1.4em')
        .text('Tomato')
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
        .html('Potato')

      // mean line
      const mean = d3.mean(data, d => d.x)

      const meanLine = bounds
        .append('line')
        .attr('x1', xScale(mean))
        .attr('x2', xScale(mean))
        .attr('y1', -15)
        .attr('y2', boundedHeight)
        .attr('stroke', 'maroon')
        .attr('stroke-dasharray', '2px 4px')

      const meanLabel = bounds
        .append('text')
        .attr('x', xScale(mean))
        .attr('y', -20)
        .text('mean')
        .attr('fill', 'maroon')
        .style('font-size', '12px')
        .style('text-anchor', 'middle')
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

const BarChart = (props: Props) => {
  return (
    <Card>
      <h2>Bar Chart</h2>
      <DrawChart data={props.data} />
    </Card>
  )
}

export default BarChart
