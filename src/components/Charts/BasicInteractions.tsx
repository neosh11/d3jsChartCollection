import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import Card from '../Card'
import { IPoint } from '../../types/dataTypes'

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
interface IData {
  loc: number
  color: string
}

const DrawChart = () => {
  //   const wrapper = d3.select('#wrapper')
  //   const svg = wrapper.append('svg')

  const dimensions = {
    margin: {
      top: 20,
      right: 20,
      bottom: 50,
      left: 50
    }
  }

  const ref = useD3(
    (svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>) => {
      const width = svg.node()?.getBoundingClientRect().width
      const height = svg.node()?.getBoundingClientRect().height
      if (!width || !height) return

      const bounds = svg.select('.bounds')

      const boundedWidth = width - dimensions.margin.left - dimensions.margin.right
      const boundedHeight = height - dimensions.margin.top - dimensions.margin.bottom

      svg.attr('width', width).attr('height', height)
      const data: IData[] = [
        { loc: 0, color: 'red' },
        { loc: 1, color: 'blue' },
        { loc: 2, color: 'green' },
        { loc: 3, color: 'pink' }
      ]

      const yScale = d3.scaleLinear().domain([0, 1]).range([boundedHeight, 0]).nice()
      const xScale = d3.scaleLinear().domain([0, data.length]).range([0, boundedWidth]).nice()

      const barPadding = 10

      const recGroup = bounds.selectAll<SVGRectElement, d3.Bin<number, number>>('rect').data(data)
      recGroup
        .enter()
        .append('rect')

        .attr('x', d => xScale(d.loc))
        .attr('y', d3.max([0, (boundedHeight - xScale(1)) / 2]))
        .attr('height', d3.max([0, xScale(1) - barPadding]))
        .attr('width', d3.max([0, xScale(1) - barPadding]))
        .attr('fill', 'lightgrey')
        .attr('stroke', '#af9358')
        .attr('stroke-width', 2)
        // .dispatch('mouseout')
        .on('mouseenter', function (e, data) {
          console.log(data)
          d3.select(this).style('fill', data.color)
        })
        .on('mouseout', function () {
          d3.select(this).style('fill', 'lightgrey')
        })
    },
    [dimensions]
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
      <g id='tooltip'>test</g>
      <g
        className='bounds'
        style={{
          transform: `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
        }}
      />
    </svg>
  )
}

const BasicInteractions = () => {
  return (
    <Card>
      <h2>Basic Interactions</h2>
      <DrawChart />
    </Card>
  )
}

export default BasicInteractions
