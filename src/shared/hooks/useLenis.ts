import { useEffect } from 'react'
import Lenis from 'lenis'

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 })

    let frameId: number
    function raf(time: number) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }
    frameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [])
}
