'use client'

import { Processing, Reactive } from '@reactive-frames'
import { ReactiveContext } from '@reactive-frames/types'

export default function Client() {
  type Context = ReactiveContext<{}, { rotation: number }>
  return (
    <Reactive className='h-screen w-screen'>
      <Processing
        className='!h-full !w-full'
        type='p2d'
        name='p5'
        setup={(p, { props }: Context) => {}}
        draw={(p, { props, time }: Context) => {
          p.clear()
          p.colorMode(p.HSL, 1)
          p.stroke(1, 0.2)
          p.noFill()
          p.strokeWeight(10)
          p.angleMode(p.RADIANS)

          const currentTime = time * 0.02
          for (let i = 0; i < 70; i++) {
            const origin = p.createVector(
              p.noiseBetter([i, currentTime]) * p.width,
              p.noiseBetter([i + 0.4829, currentTime]) * p.height
            )

            for (let j = 0; j < 100; ) {
              const rampEquation =
                j < 10 ? j / 10 : j > 90 ? 1 - (j - 90) / 10 : 1
              const size =
                p.noiseBetter([j / 100, time]) * 20 * rampEquation + 1
              const circleEquation = origin
                .copy()
                .add(
                  (100 +
                    (p.noiseBetter([(j + i * 100) / 20, time / 2]) * 50 - 25) *
                      rampEquation) *
                    p.sin((j / 100) * p.TWO_PI),
                  (100 +
                    (p.noiseBetter([(j + i * 100) / 20, time / 2]) * 50 - 25) *
                      rampEquation) *
                    p.cos((j / 100) * p.TWO_PI)
                )
              p.strokeWeight(size)
              p.point(circleEquation)
              j += (size / (100 * p.PI)) * 10
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
        }}></Processing>
    </Reactive>
  )
}
