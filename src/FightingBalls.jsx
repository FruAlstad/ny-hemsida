import { useEffect, useRef } from 'react'

const MAX_FIGHTERS = 5
const SPECTATOR_COUNT = 18
const START_LIVES = 7

const PALETTE = [
  { color: '#ff4d3a', glow: '#ff8a70' },
  { color: '#2ec8ff', glow: '#7ae0ff' },
  { color: '#7dff6a', glow: '#b6ff9a' },
  { color: '#ffd24a', glow: '#ffe38a' },
  { color: '#ff6ad5', glow: '#ff9ae4' },
  { color: '#a78bfa', glow: '#c4b5fd' },
  { color: '#fb923c', glow: '#fdba74' },
]

function FightingBalls() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let raf = 0
    let width = 0
    let height = 0
    let dpr = 1
    let cx = 0
    let cy = 0
    let arenaR = 0
    let ballR = 40
    let spectatorR = 18

    const particles = []
    const shocks = []
    let shake = 0
    let flash = 0
    let cheer = 0
    let spawnCooldown = 0

    const fighters = []
    const spectators = []

    function makeFighter(x, y, vx, vy, paletteIndex) {
      const p = PALETTE[paletteIndex % PALETTE.length]
      return {
        x,
        y,
        vx,
        vy,
        color: p.color,
        glow: p.glow,
        anger: 0,
        squash: 0,
        face: Math.random() > 0.5 ? 1 : -1,
        coolUntil: 0,
        hitUntil: 0,
        lives: START_LIVES,
      }
    }

    function resetFighters() {
      fighters.length = 0
      fighters.push(
        makeFighter(cx - arenaR * 0.25, cy, 6, -3, 0),
        makeFighter(cx + arenaR * 0.25, cy, -6, 3, 1),
      )
    }

    function placeSpectators() {
      spectators.length = 0
      for (let i = 0; i < SPECTATOR_COUNT; i += 1) {
        const angle = (i / SPECTATOR_COUNT) * Math.PI * 2 + 0.2
        const dist = arenaR + 55 + (i % 3) * 28
        const p = PALETTE[(i + 2) % PALETTE.length]
        spectators.push({
          baseX: cx + Math.cos(angle) * dist,
          baseY: cy + Math.sin(angle) * dist,
          x: 0,
          y: 0,
          bob: Math.random() * Math.PI * 2,
          hop: 0,
          wave: Math.random() * Math.PI * 2,
          color: p.color,
          glow: p.glow,
          face: i % 2 === 0 ? 1 : -1,
        })
        spectators[i].x = spectators[i].baseX
        spectators[i].y = spectators[i].baseY
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(320, window.innerWidth)
      height = Math.max(320, window.innerHeight)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      cx = width * 0.5
      cy = height * 0.5
      arenaR = Math.min(width, height) * 0.48
      ballR = Math.max(22, Math.min(48, arenaR * 0.12))
      spectatorR = Math.max(12, Math.min(22, arenaR * 0.055))
      resetFighters()
      placeSpectators()
    }

    function spawnBurst(x, y, power) {
      const count = 8 + Math.floor(power * 10)
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2
        const speed = 2 + Math.random() * power * 7
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.02 + Math.random() * 0.03,
          size: 2 + Math.random() * 4,
        })
      }
      shocks.push({ x, y, r: 10, max: 50 + power * 60, life: 1 })
    }

    function spawnFighter(x, y) {
      if (fighters.length >= MAX_FIGHTERS) return false
      if (spawnCooldown > 0) return false

      const angle = Math.random() * Math.PI * 2
      const speed = 3 + Math.random() * 4
      const offset = ballR * 1.2
      const nx = x + Math.cos(angle) * offset
      const ny = y + Math.sin(angle) * offset
      const baby = makeFighter(
        nx,
        ny,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        fighters.length,
      )
      baby.coolUntil = performance.now() + 350
      fighters.push(baby)
      keepInArena(baby)
      spawnCooldown = 0.2
      return true
    }

    function triggerCheer() {
      cheer = 1
      spectators.forEach((s) => {
        s.hop = 0.7 + Math.random() * 0.8
        s.bob += Math.random() * 2
      })
    }

    function keepInArena(ball) {
      const limit = Math.max(16, arenaR - ballR - 6)
      const dx = ball.x - cx
      const dy = ball.y - cy
      const dist = Math.hypot(dx, dy) || 1
      if (dist <= limit) return

      const nx = dx / dist
      const ny = dy / dist
      ball.x = cx + nx * limit
      ball.y = cy + ny * limit

      const hit = ball.vx * nx + ball.vy * ny
      if (hit > 0) {
        ball.vx -= hit * 1.8 * nx
        ball.vy -= hit * 1.8 * ny
      }
      ball.squash = 0.4
    }

    function nearestOther(ball) {
      let best = null
      let bestDist = Infinity
      for (let i = 0; i < fighters.length; i += 1) {
        const other = fighters[i]
        if (other === ball) continue
        const d = Math.hypot(other.x - ball.x, other.y - ball.y)
        if (d < bestDist) {
          bestDist = d
          best = other
        }
      }
      return best
    }

    function updateFighter(ball, dt, now) {
      const other = nearestOther(ball)
      if (other) {
        const dx = other.x - ball.x
        const dy = other.y - ball.y
        const dist = Math.hypot(dx, dy) || 1
        const charge = Math.max(0, 1 - dist / (arenaR * 1.2))
        ball.vx += (dx / dist) * (0.28 + charge * 0.55) * dt
        ball.vy += (dy / dist) * (0.28 + charge * 0.55) * dt
        ball.anger += (charge - ball.anger) * 0.1
      } else {
        ball.anger *= 0.95
      }

      ball.vx += Math.sin(now * 0.0015 + ball.face) * 0.05 * dt
      ball.vy += Math.cos(now * 0.0018 - ball.face) * 0.05 * dt
      ball.vx *= 0.99
      ball.vy *= 0.99

      const speed = Math.hypot(ball.vx, ball.vy)
      const max = 10
      if (speed > max) {
        ball.vx = (ball.vx / speed) * max
        ball.vy = (ball.vy / speed) * max
      }

      ball.x += ball.vx * dt
      ball.y += ball.vy * dt
      keepInArena(ball)
      ball.squash *= 0.86
    }

    function collidePair(a, b, now) {
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy) || 1
      const min = ballR * 2
      if (dist >= min) return false

      const nx = dx / dist
      const ny = dy / dist
      const overlap = (min - dist) * 0.5
      a.x -= nx * overlap
      a.y -= ny * overlap
      b.x += nx * overlap
      b.y += ny * overlap

      const rvx = a.vx - b.vx
      const rvy = a.vy - b.vy
      const velAlong = rvx * nx + rvy * ny
      if (velAlong > 0) return false

      const canSpawn = now >= a.coolUntil && now >= b.coolUntil
      const canHurt = now >= a.hitUntil && now >= b.hitUntil

      const impulse = -1.35 * velAlong
      a.vx += impulse * nx
      a.vy += impulse * ny
      b.vx -= impulse * nx
      b.vy -= impulse * ny
      a.vx -= nx * 1.5
      a.vy -= ny * 1.5
      b.vx += nx * 1.5
      b.vy += ny * 1.5

      const power = Math.min(2.5, Math.abs(velAlong) / 4.5)
      const mx = (a.x + b.x) / 2
      const my = (a.y + b.y) / 2
      spawnBurst(mx, my, power)
      a.squash = 0.55
      b.squash = 0.55
      shake = Math.min(16, shake + power * 5)
      flash = Math.min(0.45, flash + power * 0.18)
      keepInArena(a)
      keepInArena(b)

      if (canHurt && power > 0.25) {
        a.lives -= 1
        b.lives -= 1
        a.hitUntil = now + 450
        b.hitUntil = now + 450
      }

      if (canSpawn && power > 0.15) {
        if (spawnFighter(mx, my)) triggerCheer()
      }

      return true
    }

    function removeDeadFighters() {
      for (let i = fighters.length - 1; i >= 0; i -= 1) {
        const ball = fighters[i]
        if (ball.lives > 0) continue
        spawnBurst(ball.x, ball.y, 2)
        fighters.splice(i, 1)
        shake = Math.min(18, shake + 8)
        flash = Math.min(0.55, flash + 0.2)
        triggerCheer()
      }
      if (fighters.length === 0) {
        resetFighters()
      }
    }

    function updateSpectators(dt, now) {
      cheer *= 0.92
      for (let i = 0; i < spectators.length; i += 1) {
        const s = spectators[i]
        s.bob += (0.08 + cheer * 0.25) * dt
        s.wave += (0.1 + cheer * 0.35) * dt
        s.hop *= 0.94

        const jump = Math.max(0, s.hop) * 28 * Math.abs(Math.sin(s.bob * 2))
        const sway = Math.sin(s.wave) * (3 + cheer * 10)
        s.x = s.baseX + sway
        s.y = s.baseY - jump - Math.sin(s.bob) * (2 + cheer * 6)

        // Excited wiggle when cheering
        if (cheer > 0.2) {
          s.x += Math.sin(now * 0.02 + i) * cheer * 4
        }
      }
    }

    function drawArena(time) {
      ctx.fillStyle = '#07060a'
      ctx.fillRect(0, 0, width, height)

      for (let i = 6; i >= 1; i -= 1) {
        const r = arenaR + i * Math.min(width, height) * 0.045
        ctx.beginPath()
        ctx.arc(cx, cy, Math.max(1, r), 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(180, 70, 50, ${0.04 + i * 0.015})`
        ctx.lineWidth = Math.min(width, height) * 0.03
        ctx.stroke()
      }

      const pulse = 0.5 + Math.sin(time * 0.002) * 0.1
      ;[-0.55, 0, 0.55].forEach((offset) => {
        const sx = cx + arenaR * offset
        const sy = cy - arenaR * 1.35
        const g = ctx.createRadialGradient(sx, sy, 0, cx, cy, arenaR * 1.3)
        g.addColorStop(0, `rgba(255, 230, 170, ${0.14 * pulse})`)
        g.addColorStop(0.6, `rgba(255, 180, 80, ${0.04 * pulse})`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(cx - arenaR * 0.9, cy + arenaR * 0.9)
        ctx.lineTo(cx + arenaR * 0.9, cy + arenaR * 0.9)
        ctx.closePath()
        ctx.fill()
      })

      ctx.beginPath()
      ctx.arc(cx, cy, arenaR + 28, 0, Math.PI * 2)
      const wall = ctx.createRadialGradient(cx, cy, arenaR, cx, cy, arenaR + 28)
      wall.addColorStop(0, '#6a4e34')
      wall.addColorStop(1, '#2a1c12')
      ctx.fillStyle = wall
      ctx.fill()

      ctx.beginPath()
      ctx.arc(cx, cy, arenaR, 0, Math.PI * 2)
      const floor = ctx.createRadialGradient(cx, cy, 0, cx, cy, arenaR)
      floor.addColorStop(0, '#4a3f34')
      floor.addColorStop(0.7, '#2e2720')
      floor.addColorStop(1, '#1a1612')
      ctx.fillStyle = floor
      ctx.fill()

      ctx.strokeStyle = 'rgba(255, 210, 140, 0.28)'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(cx, cy, Math.max(1, arenaR * 0.28), 0, Math.PI * 2)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(cx - arenaR * 0.7, cy)
      ctx.lineTo(cx + arenaR * 0.7, cy)
      ctx.moveTo(cx, cy - arenaR * 0.7)
      ctx.lineTo(cx, cy + arenaR * 0.7)
      ctx.strokeStyle = 'rgba(255, 210, 140, 0.16)'
      ctx.lineWidth = 2
      ctx.stroke()

      const posts = []
      for (let i = 0; i < 8; i += 1) {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2
        posts.push([
          cx + Math.cos(a) * (arenaR + 6),
          cy + Math.sin(a) * (arenaR + 6),
        ])
      }

      ;[0, 1, 2].forEach((level) => {
        const lift = 18 + level * 16
        ctx.strokeStyle = level === 1 ? '#e8c56a' : '#d4553a'
        ctx.lineWidth = 4
        ctx.beginPath()
        posts.forEach(([px, py], i) => {
          if (i === 0) ctx.moveTo(px, py - lift)
          else ctx.lineTo(px, py - lift)
        })
        ctx.closePath()
        ctx.stroke()
      })

      posts.forEach(([px, py]) => {
        ctx.fillStyle = '#c4a050'
        ctx.fillRect(px - 6, py - 58, 12, 64)
        ctx.beginPath()
        ctx.arc(px, py - 58, 8, 0, Math.PI * 2)
        ctx.fillStyle = '#ffe6a0'
        ctx.fill()
      })

      ctx.beginPath()
      ctx.arc(cx, cy, Math.max(1, arenaR - 2), 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255, 220, 160, 0.35)'
      ctx.lineWidth = 4
      ctx.stroke()
    }

    function drawBall(ball, r, happy) {
      const squash = ball.squash || 0
      const anger = ball.anger || 0

      ctx.save()
      ctx.translate(ball.x, ball.y + r * 0.55)
      ctx.scale(1, 0.35)
      ctx.fillStyle = 'rgba(0,0,0,0.3)'
      ctx.beginPath()
      ctx.arc(0, 0, Math.max(0.5, r * 0.9), 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      ctx.save()
      ctx.translate(ball.x, ball.y)
      ctx.scale(1 + squash * 0.3, 1 - squash * 0.25)

      const glow = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 2)
      glow.addColorStop(0, `${ball.glow}66`)
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(0, 0, Math.max(0.5, r * 2), 0, Math.PI * 2)
      ctx.fill()

      const body = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r)
      body.addColorStop(0, '#ffffff')
      body.addColorStop(0.2, ball.glow)
      body.addColorStop(1, ball.color)
      ctx.fillStyle = body
      ctx.beginPath()
      ctx.arc(0, 0, Math.max(0.5, r), 0, Math.PI * 2)
      ctx.fill()

      const eyeY = -r * 0.12
      const eyeSpread = r * 0.28
      ctx.strokeStyle = 'rgba(20,12,28,0.75)'
      ctx.lineWidth = Math.max(1.5, r * 0.08)
      ctx.lineCap = 'round'

      if (happy) {
        // Smile brows
        ctx.beginPath()
        ctx.moveTo(-eyeSpread - r * 0.15, eyeY - r * 0.2)
        ctx.quadraticCurveTo(-eyeSpread, eyeY - r * 0.35, -eyeSpread + r * 0.15, eyeY - r * 0.2)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(eyeSpread + r * 0.15, eyeY - r * 0.2)
        ctx.quadraticCurveTo(eyeSpread, eyeY - r * 0.35, eyeSpread - r * 0.15, eyeY - r * 0.2)
        ctx.stroke()
      } else {
        const browTilt = 0.25 + anger * 0.5
        ctx.beginPath()
        ctx.moveTo(-eyeSpread - r * 0.2, eyeY - r * 0.28)
        ctx.lineTo(-eyeSpread + r * 0.15, eyeY - r * 0.28 + browTilt * r * 0.2)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(eyeSpread + r * 0.2, eyeY - r * 0.28)
        ctx.lineTo(eyeSpread - r * 0.15, eyeY - r * 0.28 + browTilt * r * 0.2)
        ctx.stroke()
      }

      ctx.fillStyle = '#141018'
      const eyeH = Math.max(1, (happy ? 5 : 6) * (r / 40) + (happy ? 0 : anger * 1.5))
      const eyeW = Math.max(1, 5 * (r / 40))
      ctx.beginPath()
      ctx.ellipse(-eyeSpread, eyeY, eyeW, eyeH, 0, 0, Math.PI * 2)
      ctx.ellipse(eyeSpread, eyeY, eyeW, eyeH, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      if (happy || cheer > 0.25) {
        ctx.moveTo(-r * 0.22, r * 0.18)
        ctx.quadraticCurveTo(0, r * 0.45 + cheer * r * 0.1, r * 0.22, r * 0.18)
      } else if (anger > 0.4) {
        ctx.moveTo(-r * 0.25, r * 0.28)
        ctx.quadraticCurveTo(0, r * 0.1 - anger * r * 0.2, r * 0.25, r * 0.28)
      } else {
        ctx.moveTo(-r * 0.22, r * 0.3)
        ctx.quadraticCurveTo(0, r * 0.4, r * 0.22, r * 0.3)
      }
      ctx.stroke()

      ctx.restore()

      // Life pips above fighters
      if (typeof ball.lives === 'number') {
        const lives = Math.max(0, ball.lives)
        const pipR = Math.max(2.5, r * 0.12)
        const gap = pipR * 2.4
        const totalW = (START_LIVES - 1) * gap
        const startX = ball.x - totalW / 2
        const pipY = ball.y - r - pipR * 3
        for (let i = 0; i < START_LIVES; i += 1) {
          ctx.beginPath()
          ctx.arc(startX + i * gap, pipY, pipR, 0, Math.PI * 2)
          if (i < lives) {
            ctx.fillStyle = '#ff5a5a'
            ctx.fill()
          } else {
            ctx.strokeStyle = 'rgba(255,255,255,0.25)'
            ctx.lineWidth = 1.5
            ctx.stroke()
          }
        }
      }
    }

    let last = performance.now()

    function frame(now) {
      raf = requestAnimationFrame(frame)
      try {
        if (!width || !arenaR) return

        const dt = Math.min(32, now - last) / 16.67
        last = now
        spawnCooldown = Math.max(0, spawnCooldown - dt / 60)

        for (let i = 0; i < fighters.length; i += 1) {
          updateFighter(fighters[i], dt, now)
        }

        for (let i = 0; i < fighters.length; i += 1) {
          for (let j = i + 1; j < fighters.length; j += 1) {
            collidePair(fighters[i], fighters[j], now)
          }
        }

        removeDeadFighters()

        updateSpectators(dt, now)

        shake *= 0.85
        flash *= 0.88

        const ox = (Math.random() - 0.5) * shake
        const oy = (Math.random() - 0.5) * shake

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, width, height)

        ctx.save()
        ctx.translate(ox, oy)
        drawArena(now)

        // Spectators behind / around (outside ring)
        for (let i = 0; i < spectators.length; i += 1) {
          drawBall(spectators[i], spectatorR, true)
        }

        for (let i = shocks.length - 1; i >= 0; i -= 1) {
          const s = shocks[i]
          s.r += (s.max - s.r) * 0.14
          s.life *= 0.88
          if (s.life < 0.05) {
            shocks.splice(i, 1)
            continue
          }
          ctx.beginPath()
          ctx.arc(s.x, s.y, Math.max(0.5, s.r), 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255,244,196,${s.life * 0.75})`
          ctx.lineWidth = Math.max(1, 3 * s.life)
          ctx.stroke()
        }

        for (let i = particles.length - 1; i >= 0; i -= 1) {
          const p = particles[i]
          p.x += p.vx * dt
          p.y += p.vy * dt
          p.vx *= 0.97
          p.vy *= 0.97
          p.life -= p.decay * dt
          if (p.life <= 0) {
            particles.splice(i, 1)
            continue
          }
          ctx.fillStyle = `rgba(255,244,196,${p.life})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, Math.max(0.5, p.size * p.life), 0, Math.PI * 2)
          ctx.fill()
        }

        for (let i = 0; i < fighters.length; i += 1) {
          drawBall(fighters[i], ballR, false)
        }

        ctx.restore()

        if (flash > 0.02) {
          ctx.fillStyle = `rgba(255,250,230,${flash * 0.35})`
          ctx.fillRect(0, 0, width, height)
        }
      } catch (err) {
        console.warn('fight frame', err)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(frame)

    // Debug hook for runtime checks
    window.__arena = {
      get fighters() {
        return fighters.length
      },
      get spectators() {
        return spectators.length
      },
      get cheer() {
        return cheer
      },
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      delete window.__arena
    }
  }, [])

  return <canvas ref={canvasRef} className="fight-bg" aria-hidden="true" />
}

export default FightingBalls
