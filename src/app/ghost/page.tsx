'use client'

import { Line } from '@reactive-frames/frames/scoring/Scoring'
import { Canvas2D, Reactive } from '@reactive-frames/index'
import { CurveInterpolator } from 'curve-interpolator'

export default function Ghost() {
  return (
    <>
      <Reactive showInfo>
        <Canvas2D
          name='2d'
          setup={(c, { props }) => {
            c.scale(c.canvas.width, c.canvas.height)
            c.strokeStyle = 'white'
            c.lineWidth = 1 / c.canvas.width

            const points = [
              [0.377, 0.069],
              [0.258, 0.237],
              [0.403, 0.453],
              [0.305, 0.672],
              [0.372, 0.953]
            ]
            const points2 = [
              [0.5, 0.059],
              [0.609, 0.244],
              [0.516, 0.553],
              [0.691, 0.775],
              [0.583, 0.919]
            ]

            const curve1 = new CurveInterpolator(points, {
              tension: 0.01
            }).getPoints(100) as [number, number][]
            const curve2 = new CurveInterpolator(points2, {
              tension: 0.01
            }).getPoints(100) as [number, number][]
            props.curve1 = curve1
            props.curve2 = curve2
          }}
          draw={(c, { props }) => {
            for (let i = 0; i < 100; i++) {
              c.beginPath()
              c.moveTo(props.curve1[i][0], props.curve1[i][1])
              c.lineTo(props.curve2[i][0], props.curve2[i][1])
              c.stroke()
            }
          }}></Canvas2D>
      </Reactive>
      <p>it's sorry</p>
      <p>a morning-after: the clock</p>
      <p>making reasons to tick, making</p>
      <p>waves in a morning-dew sort of pain. our weight,</p>
      <p>scuttled out from the shore</p>
    </>
  )
}
