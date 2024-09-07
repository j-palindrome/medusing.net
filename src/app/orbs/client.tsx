'use client'

import {
  Canvas2D,
  CanvasGL,
  Mesh,
  Processing,
  Reactive
} from '@reactive-frames'
import { ReactiveContext } from '@reactive-frames/types'
import { noiseBetter } from '@util/canvas'
import { Pt } from 'pts'
import _ from 'lodash'
import { snoise3D } from '@util/shaders/noise'
import { createNoise2D } from 'simplex-noise'

const noise = createNoise2D()

export default function Client() {
  type Context = ReactiveContext<{}, { rotation: number }>
  const instanceCount = 10
  return (
    <Reactive className='h-screen w-screen'>
      <CanvasGL name='p4' className='h-full w-full'>
        <Mesh
          name='mesh'
          drawMode='points'
          attributes={{
            point: {
              numComponents: 1,
              data: _.range(1000)
            },
            origin: {
              numComponents: 2,
              data: _.range(instanceCount).flatMap(i => {
                const origin = [Math.random() * 2 - 1, Math.random() * 2 - 1]
                return origin
              }),
              divisor: 1
            }
          }}
          vertexShader={
            /*glsl*/ `
            #define TWO_PI 3.14159 * 2.
            in float point;
            uniform float currentTime;
            uniform float amount;
            in vec2 origin;
            
            ${snoise3D}

            void main() {
              float variation = 10.;
              float minimum = 20.;
              gl_PointSize = snoise(vec3(point / amount * 10., 30, currentTime / 2.)) * variation + minimum;
              vec2 start = vec2(sin(point / amount * TWO_PI), cos(point / amount * TWO_PI)) * 0.7 + origin;
              vec2 noise = vec2(
                snoise(vec3(point / amount * 10., 0., currentTime / 2.)),
                snoise(vec3(point / amount * 10. + 10.2953, 0., currentTime / 2.))
              );
              gl_Position = vec4(start * (1. + noise * 0.05), 1, 1);
            }`
          }
          fragmentShader={
            /*glsl*/ `
            void main() {
              fragColor = vec4(1, 1, 1, 0.1);
            }`
          }
          instanceCount={instanceCount}
          draw={(self, parent, { time }) => {
            self.draw(
              {
                currentTime: time,
                amount: 1000
              },
              {
                origin: {
                  numComponents: 2,
                  data: _.range(instanceCount).flatMap(i => {
                    const origin = [
                      noise(i, time * 0.05),
                      noise(i + 100, time * 0.05)
                    ]
                    return origin
                  }),
                  divisor: 1
                }
              }
            )
          }}
        />
      </CanvasGL>
      <Canvas2D
        className='!h-full !w-full'
        name='p5'
        setup={(p, { props }: Context) => {}}
        draw={(self, { props, time }: Context) => {
          self.clearRect(0, 0, self.canvas.width, self.canvas.height)
          self.fillStyle = 'white'

          const currentTime = time * 0.02
          for (let i = 0; i < 70; i++) {
            self.globalAlpha = noiseBetter([i, time / 2]) / 4
            const origin = new Pt(
              noiseBetter([i, currentTime]) * self.canvas.width,
              noiseBetter([i + 0.4829, currentTime]) * self.canvas.height
            )

            let lastOrigin: Pt
            const AMT = 100
            for (let j = 0; j < AMT; ) {
              const rampEquation =
                j < AMT / 10
                  ? j / (AMT / 10)
                  : j > AMT - AMT / 10
                    ? 1 - (j - (AMT - AMT / 10)) / (AMT / 10)
                    : 1
              const size =
                noiseBetter([j / AMT, time, i]) * 20 * rampEquation + 1
              const circleEquation = origin.$add(
                (AMT +
                  ((noiseBetter([(j + i * AMT) / 20, time / 2]) * AMT) / 2 -
                    AMT / 4) *
                    rampEquation) *
                  Math.sin((j / AMT) * Math.PI * 2),
                (AMT +
                  ((noiseBetter([(j + i * AMT) / 20, time / 2]) * AMT) / 2 -
                    AMT / 4) *
                    rampEquation) *
                  Math.cos((j / AMT) * Math.PI * 2)
              )
              self.beginPath()
              self.arc(circleEquation.x, circleEquation.y, size, 0, 360)
              self.fill()

              lastOrigin = circleEquation
              j += 0.5
            }
          }

          // for (let i = 0; i < p.height; i += 500) {
          //   // @
          //   p.drawCurveBetween(
          //     [
          //       [0, i],
          //       // @
          //       p.noiseBetween(
          //         [
          //           [p.width / 3, i + 400],
          //           [p.width / 3, i - 400]
          //         ],
          //         { seed: i }
          //       ),
          //       // @
          //       p.noiseBetween(
          //         [
          //           [(p.width / 3) * 2, i + 400],
          //           [(p.width / 3) * 2, i - 400]
          //         ],
          //         { seed: i + 250 }
          //       ),
          //       [p.width, i]
          //     ],
          //     {
          //       curveScaleX: p.width / 3 / 100,
          //       curveScaleY: 300,
          //       seed: i * 3,
          //       speed: 4
          //     }
          //   )
          // }

          // for (let i = 0; i < 10; i++) {
          //   p.drawCurve({
          //     start: [p.width / 2, p.height / 2],
          //     jitter: 1,
          //     width: 1,
          //     length: 500,
          //     curveScale: 1000 * (p.sin(time + i) / 2 + 0.5 + 0.25),
          //     seed: i,
          //     strokeWidth: [0, 10]
          //   })
          // }
        }}></Canvas2D>
    </Reactive>
  )
}
