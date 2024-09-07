'use client'

import { Drawing } from '@reactive-frames/frames/Canvas2D'
import { Html } from '@reactive-frames/frames/Div'
import Score, { Line } from '@reactive-frames/frames/scoring/Scoring'
import { G } from '@reactive-frames/frames/Svg'
import { CanvasGL, Mesh, MeshCurve, Reactive } from '@reactive-frames/index'
import { generateShape } from '@reactive-frames/utilities/layer'
import { defaultVert2DNoResolution } from '@reactive-frames/utilities/shaders'
import { defaultFragColor, defaultVert2D } from '@util/shaders/utilities'
import _ from 'lodash'

import { getProject, types } from '@theatre/core'
import studio from '@theatre/studio'
import { useVal } from '@theatre/react'

studio.initialize()

const demoSheet = getProject('Demo Project').sheet('Demo Sheet')
const scene1 = demoSheet.object('Progress', {
  // Note that the rotation is in radians
  // (full rotation: 2 * Math.PI)
  progress: types.number(0, { range: [0, 1] }),
  curves: types.compound(
    {
      x0: 0.3,
      y0: 0.3,
      x1: 1,
      y1: 0.7,
      x2: 1,
      y2: 1
    },
    { range: [-1, 1] }
  ),
  text: types.compound({ left: 0, top: 0, play: types.number(1) })
})
const scene2 = demoSheet.object('zone2', {
  text: types.compound({
    left: 0,
    top: 0,
    scale: 1
  }),
  play: types.number(1)
})

const demoSheet2 = getProject('Demo Project').sheet('Demo Sheet 2')



export default function ScoringTool() {
  return (
    <Score>
      <Line>
        <Mesh
          name='mesh'
          drawMode='points'
          vertexShader={/*glsl*/ defaultVert2DNoResolution}
          fragmentShader={defaultFragColor(1, 1, 1, 1)}
          attributes={{
            position: {
              data: _.range(100).map(x => Math.random() * 2 - 1),
              numComponents: 2
            }
          }}
        />
        <MeshCurve
          name='curves'
          subdivisions={100}
          curves={[
            [
              { start: [0.3, 0.3], direction: [0.1, 0.5], width: 0 },
              { start: [1, 0.7], direction: [0, 0], width: 0.1 }
            ]
          ]}
          draw={self => {
            const val = scene1.value.curves
            self.draw([
              [
                {
                  start: [val.x0, val.y0],
                  direction: [val.x1, val.y1],
                  width: 0
                },
                { start: [val.x2, val.y2], direction: [0, 0], width: 0.1 }
              ]
            ])
          }}
        />
        <Html
          name='myHTML'
          className='absolute'
          draw={self => {
            console.log(scene1.value.text.play)

            if (!scene1.value.text.play) {
              self.style.display = 'hidden'
            } else self.style.display = 'block'
            self.style.left = `${scene1.value.text.left}px`
            self.style.top = `${scene1.value.text.top}px`
          }}>
          what is the world
        </Html>
      </Line>
      <Line>
        <Html
          name='html2'
          draw={self => {
            self.style.transform = `translate(${scene2.value.text.left}px, ${scene2.value.text.top}px) scale(${scene2.value.text.scale})`
          }}>
          but a holistic mess of inputs
        </Html>
      </Line>
    </Score>
  )
}

// export default function ScoringTool() {
//   return (
//     <Reactive>
//       <CanvasGL name='gl'>
//         <Mesh
//           name='mesh'
//           drawMode='points'
//           vertexShader={
//             /*glsl*/ `
//             in vec2 position;
//             void main() {
//               gl_Position = vec4(position, 1, 1);
//               gl_PointSize = 10.0;
//             }`
//           }
//           fragmentShader={defaultFragColor(1, 1, 1, 1)}
//           attributes={{
//             position: {
//               data: _.range(100).map(x => Math.random()),
//               numComponents: 2
//             }
//           }}
//           draw={self => self.draw()}
//         />
//       </CanvasGL>
//     </Reactive>
//   )
// }
