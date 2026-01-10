import { toRaw } from 'vue'
import confetti from 'canvas-confetti'

export function useConfetti() {
  const fire = (options: confetti.Options = {}) => {
    return confetti(toRaw(options))
  }

  const fireRealistic = (count = 200, defaults = { origin: { y: 0.7 } }) => {
    const fireEffect = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      })
    }

    fireEffect(0.25, { spread: 26, startVelocity: 55 })
    fireEffect(0.2, { spread: 60 })
    fireEffect(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fireEffect(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fireEffect(0.1, { spread: 120, startVelocity: 45 })
  }

  const fireFireworks = (duration = 15 * 1000) => {
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) return clearInterval(interval)

      const particleCount = 50 * (timeLeft / duration)
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
    }, 250)
  }

  const fireSnow = (duration = 15 * 1000) => {
    const animationEnd = Date.now() + duration
    let skew = 1

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    ;(function frame() {
      const timeLeft = animationEnd - Date.now()
      const ticks = Math.max(200, 500 * (timeLeft / duration))
      skew = Math.max(0.8, skew - 0.001)

      confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: ticks,
        origin: {
          x: Math.random(),
          y: (Math.random() * skew) - 0.2
        },
        colors: ['#ffffff'],
        shapes: ['circle'],
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.4, 1),
        drift: randomInRange(-0.4, 0.4)
      })

      if (timeLeft > 0) requestAnimationFrame(frame)
    }())
  }

  const firePride = (duration = 15 * 1000) => {
    const end = Date.now() + duration
    const colors = ['#bb0000', '#ffffff']

    ;(function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }())
  }

  const fireStars = () => {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
    } as confetti.Options

    function shoot() {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ['star']
      })

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ['circle']
      })
    }

    setTimeout(shoot, 0)
    setTimeout(shoot, 100)
    setTimeout(shoot, 200)
  }

  return {
    fire,
    fireRealistic,
    fireFireworks,
    fireSnow,
    firePride,
    fireStars
  }
}
