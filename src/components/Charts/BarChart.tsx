import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { colors } from '../../constants/colors'
import { IPoint } from '../../types/dataTypes'
import Card from '../Card'
import Button from '../Button'

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

const DrawChart = (props: { data: number[]; init: boolean }) => {
  const data = props.data
  const bucketSize = 4
  const binsGenerator = d3
    .bin<number, number>()
    .domain([0, d3.max(props.data)])
    .thresholds(bucketSize)

  const bins = binsGenerator(data)

  const yAccessor = (d: d3.Bin<number, number>) => d.length
  const xAccessor = (d: number) => d

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

      const barPadding = 10

      const updateTransition = d3.transition().duration(600).ease(d3.easeBackIn)

      // const binsGroup = bounds.append('g')
      const xAxisGenerator = d3.axisBottom(xScale)
      const yAxisGenerator = d3.axisLeft(yScale).ticks(4)
      const mean = d3.mean(data)
      const binGroups = bounds.selectAll<SVGRectElement, d3.Bin<number, number>>('rect').data(bins)

      // create a tooltip
      const tooltipG = svg.select('.tooltipG').append('g').style('opacity', 0)

      tooltipG.append('rect').attr('height', 50).attr('width', 100).attr('x', 0).attr('y', -25).attr('fill', colors.sec)

      const tooltip = tooltipG
        .append('text')
        .attr('class', 'tooltip')
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-width', '2px')
        .style('border-radius', '5px')
        .attr('x', 20)
        .attr('y', 25 / 2)

      const mouseover = function (e, d) {
        tooltipG.attr('transform', 'translate(' + (d3.pointer(e)[0] - 10) + ',' + (d3.pointer(e)[1] - 10) + ')')
        tooltip.html('Total: ' + d.length)
        d3.select(this).style('fill', colors.ter)
        d3.select(this).style('stroke', 'black').style('opacity', 1)
        tooltipG.style('opacity', 1)
      }
      const mousemove = function (e, d) {
        tooltipG.attr('transform', 'translate(' + (d3.pointer(e)[0] - 10) + ',' + (d3.pointer(e)[1] - 10) + ')')
        tooltip.html('Total: ' + d.length)
      }
      const mouseleave = function () {
        tooltipG.style('opacity', 0)
        d3.select(this).style('fill', colors.sec)
        d3.select(this).style('stroke', 'none').style('opacity', 0.8)
      }

      const updateBars = () => {
        // barRects
        binGroups
          .enter()
          .append('rect')
          .on('mouseenter', mouseover)
          .on('mouseout', mouseleave)
          .on('mousemove', mousemove)
          .style('fill', colors.sec)
          .merge(binGroups)
          .transition(updateTransition)
          .attr('x', d => xScale(d.x0) + barPadding)
          .attr('y', d => yScale(yAccessor(d)))
          .attr('height', d => d3.max([boundedHeight - yScale(yAccessor(d))]))
          .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))

        // x-axis
        bounds.select<SVGGElement>('.x-axis').transition(updateTransition).call(xAxisGenerator)
        // yAxis
        bounds.select<SVGGElement>('.y-axis').transition(updateTransition).call(yAxisGenerator)

        // meanLineLabel
        bounds.select<SVGTextElement>('.meanLineLabel').transition(updateTransition).attr('x', xScale(mean))
        // meanline
        bounds
          .select<SVGLineElement>('.meanLine')
          .transition(updateTransition)
          .attr('x1', xScale(mean))
          .attr('x2', xScale(mean))
      }

      if (props.init == true) {
        const yAxis = bounds.append('g').attr('class', 'y-axis').call(yAxisGenerator)

        // yAxisLabel
        yAxis
          .append('text')
          .attr('x', -boundedHeight / 2)
          .attr('y', '-3em')
          .attr('fill', 'black')
          .style('font-size', '1.4em')
          .text('Tomato')
          .style('transform', 'rotate(-90deg)')
          .style('text-anchor', 'middle')

        // x axis label

        const xAxis = bounds
          .append('g')
          .attr('class', 'x-axis')
          .call(xAxisGenerator)
          .style('transform', `translateY(${boundedHeight}px)`)

        // xAxisLabel
        xAxis
          .append('text')
          .attr('x', boundedWidth / 2)
          .attr('y', dimensions.margin.bottom - 10)
          .attr('fill', 'black')
          .style('font-size', '1.4em')
          .html('Potato')

        // mean line

        // meanLine
        bounds
          .append('line')
          .attr('class', 'meanLine')
          .attr('x1', xScale(mean))
          .attr('x2', xScale(mean))
          .attr('y1', -15)
          .attr('y2', boundedHeight)
          .attr('stroke', 'maroon')
          .attr('stroke-dasharray', '2px 4px')

        //  meanLabel
        bounds
          .append('text')
          .attr('class', 'meanLineLabel')
          .attr('x', xScale(mean))
          .attr('y', -20)
          .text('mean')
          .attr('fill', 'maroon')
          .style('font-size', '12px')
          .style('text-anchor', 'middle')
      }
      updateBars()
    },
    [data]
  )

  return (
    <svg
      ref={ref}
      style={{
        height: 500,
        width: '100%',
        marginRight: '0px',
        marginLeft: '0px',
        overflow: 'visible'
      }}
    >
      <g
        className='bounds'
        style={{
          transform: `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
        }}
      />
      <g className='tooltipG' />
    </svg>
  )
}

const BarChart = (props: Props) => {
  const [data, setData] = useState({ data: props.data.map(x => x.x), metric: 'x', init: true })

  const onClick = () => {
    if (data.metric === 'x') setData({ data: props.data.map(x => x.y), metric: 'y', init: false })
    else setData({ data: props.data.map(x => x.x), metric: 'x', init: false })
  }
  return (
    <Card>
      <h2>Bar Chart</h2>
      <div className='flex md:flex-row flex-col h-full'>
        <div className='md:w-3/4 space-y-2'>
          <h3>{data.metric} map</h3>
          <DrawChart data={data.data} init={data.init} />
        </div>
        <div className='md:w-1/4 h-full content-center flex justify-center flex-wrap'>
          <Button onClick={onClick} color='blue'>
            Change axis
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default BarChart
