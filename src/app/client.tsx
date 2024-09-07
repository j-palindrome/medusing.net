'use client'

import Image from 'next/image'
import { Processing, Reactive, Svg } from '@reactive-frames'
import { useRef } from 'react'
import { ReactiveContext } from '@reactive-frames/types'

export default function Client() {
  const savedValues = useRef('')
  type Context = ReactiveContext<{}, { rotation: number }>
  return (
    <Reactive className='h-screen w-screen'>
      <Processing
        className='!h-full !w-full'
        type='p2d'
        name='p5'
        setup={(p, { props }: Context) => {
          props.rotation = 0
        }}
        draw={(p, { props, time }: Context) => {
          p.clear()
          props.rotation += 0.01

          p.stroke('white')
          p.noFill()
          p.strokeWeight(1)

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

          for (let i = 0; i < 10; i++) {
            p.drawCurve({
              start: [p.width / 2, p.height / 2],
              jitter: 1,
              width: 1,
              length: 500,
              curveScale: 1000 * (p.sin(time + i) / 2 + 0.5 + 0.25),
              seed: i,
              strokeWidth: [0, 10]
            })
          }
        }}></Processing>
    </Reactive>
  )
}
