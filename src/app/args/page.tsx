'use client'

import { CanvasGL, Mesh } from '@reactive-frames/index'
import { Reactive } from '../../../reactive-frames/src/blocks/FrameChildComponents'
import { range } from 'lodash'
import { defaultFragColor } from '@util/shaders/utilities'
import { bezierN } from '@util/shaders/curve'

export default function Args() {
  return (
    <Reactive className='w-screen h-screen'>
      <CanvasGL name='canvas' className='w-full h-full'>
        <Mesh
          name='mesh'
          attributes={{
            pointIndex: {
              data: range(100),
              numComponents: 1
            },
            lineIndex: {
              data: range(100),
              numComponents: 1
            }
          }}
          // instanceCount={100}
          vertexShader={
            /*glsl*/ `
            in float pointIndex;
            in float lineIndex;
            out float v_pointIndex;
            out float v_lineIndex;

            void main() {
              gl_Position = vec4(0., 0., 0, 0);
              gl_PointSize = 10.;
              v_pointIndex = pointIndex;
              v_lineIndex = lineIndex;
            }
            `
          }
          fragmentShader={
            /*glsl*/ `
            in float v_pointIndex;
            in float v_lineIndex;

            void main() {
              fragColor = vec4(1., 1., 1., 1.);
            }
            `
          }
          drawMode='points'
          draw={self => {
            self.draw()
          }}
        />
      </CanvasGL>
    </Reactive>
  )
}
