import { useEffect, useRef } from 'react'

const MAX_FIGHTERS = 2
const SPECTATOR_COUNT = 18
const PLAYER_LIVES = 7
const ENEMY_LIVES = 10
const PLAYER_HIT_DAMAGE = 2
const ENEMY_HIT_DAMAGE = 2
const SHIELD_DURATION = 2500
const SHIELD_USES_PER_ROUND = 3
const STONE_SPEED = 14
const STONE_DAMAGE = 1
const STONE_COOLDOWN = 400
const STONE_RADIUS = 10
const GOLD_STONE_COST = 5
const GOLD_STONE_DAMAGE = 7
const GOLD_STONE_RADIUS = 16
const GOLD_STONE_SPEED = 16
const GOLD_STONE_COOLDOWN = 600
const GOLD_BOMB_COST = 5
const GOLD_BOMB_DAMAGE = 5
const GOLD_BOMB_COOLDOWN = 700
const GOLD_BOMB_FUSE_MS = 800
const FISH_COST = 10
const FISH_DAMAGE = 1
const FISH_INTERVAL_MS = 5000
const BOMB_SPEED = 9
const BOMB_DAMAGE = 5
const BOMB_COOLDOWN = 900
const BOMB_RADIUS = 14
const BOMB_FUSE_MS = 1500
const BOMB_BLAST = 110
const BOMB_USES_PER_ROUND = 3
const RESPAWN_LIVES = 10

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
    const stones = []
    const bombs = []
    let shake = 0
    let flash = 0
    let cheer = 0
    let spawnCooldown = 0
    let redCoins = 0
    let blueCoins = 0
    let fish = null // { nextTick }
    let fishButton = { x: 0, y: 0, w: 88, h: 36 }

    const fighters = []
    const spectators = []
    const keys = {
      w: false,
      a: false,
      s: false,
      d: false,
      up: false,
      left: false,
      down: false,
      right: false,
    }

    function makeFighter(x, y, vx, vy, paletteIndex, isPlayer = false) {
      const p = PALETTE[paletteIndex % PALETTE.length]
      const maxLives = isPlayer ? PLAYER_LIVES : ENEMY_LIVES
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
        maxLives,
        lives: maxLives,
        player: isPlayer,
        // red = player1 (WASD), blue = player2 (arrows)
        control: isPlayer ? 'wasd' : paletteIndex === 1 ? 'arrows' : null,
        shieldUntil: 0,
        shieldUses: isPlayer ? SHIELD_USES_PER_ROUND : 0,
        stoneReadyAt: 0,
        bombReadyAt: 0,
        bombUses: !isPlayer && paletteIndex === 1 ? BOMB_USES_PER_ROUND : 0,
        eliminated: false,
      }
    }

    function resetFighters() {
      fighters.length = 0
      stones.length = 0
      bombs.length = 0
      fighters.push(
        makeFighter(cx - arenaR * 0.25, cy, 0, 0, 0, true),
        makeFighter(cx + arenaR * 0.25, cy, 0, 0, 1, false),
      )
      // Blue is also human-controlled
      fighters[1].control = 'arrows'
      fighters[1].bombUses = BOMB_USES_PER_ROUND
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
      ballR = Math.max(36, Math.min(64, arenaR * 0.16))
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

    function throwStone(thrower, options = {}) {
      const now = performance.now()
      const isGold = options.gold === true
      const damage = isGold ? GOLD_STONE_DAMAGE : STONE_DAMAGE
      const speed = isGold ? GOLD_STONE_SPEED : STONE_SPEED
      const radius = isGold ? GOLD_STONE_RADIUS : STONE_RADIUS
      const cooldown = isGold ? GOLD_STONE_COOLDOWN : STONE_COOLDOWN

      if (now < thrower.stoneReadyAt) return
      if (isGold) {
        if (redCoins < GOLD_STONE_COST) return
        redCoins -= GOLD_STONE_COST
      }

      const target = fighters.find((f) => f !== thrower)
      let dx = target ? target.x - thrower.x : thrower.vx
      let dy = target ? target.y - thrower.y : thrower.vy
      let dist = Math.hypot(dx, dy)
      if (dist < 0.01) {
        dx = thrower.face || 1
        dy = 0
        dist = 1
      }
      const nx = dx / dist
      const ny = dy / dist

      stones.push({
        x: thrower.x + nx * (ballR + radius),
        y: thrower.y + ny * (ballR + radius),
        vx: nx * speed + thrower.vx * 0.3,
        vy: ny * speed + thrower.vy * 0.3,
        r: radius,
        life: 2.5,
        owner: thrower,
        spin: 0,
        damage,
        gold: isGold,
      })
      thrower.stoneReadyAt = now + cooldown
      thrower.squash = 0.25
    }

    function updateStones(dt, now) {
      for (let i = stones.length - 1; i >= 0; i -= 1) {
        const stone = stones[i]
        stone.x += stone.vx * dt
        stone.y += stone.vy * dt
        stone.spin += 0.35 * dt
        stone.life -= dt * 0.02

        // Stay roughly in arena or despawn
        const dx = stone.x - cx
        const dy = stone.y - cy
        if (Math.hypot(dx, dy) > arenaR + 40 || stone.life <= 0) {
          stones.splice(i, 1)
          continue
        }

        // Hit opponents
        let hit = false
        for (let j = 0; j < fighters.length; j += 1) {
          const f = fighters[j]
          if (f === stone.owner || f.eliminated) continue
          const d = Math.hypot(f.x - stone.x, f.y - stone.y)
          if (d < ballR + stone.r) {
            f.lives -= stone.damage || STONE_DAMAGE
            f.squash = 0.5
            f.vx += stone.vx * 0.25
            f.vy += stone.vy * 0.25
            spawnBurst(stone.x, stone.y, stone.gold ? 2 : 1)
            shake = Math.min(14, shake + (stone.gold ? 8 : 4))
            hit = true
            break
          }
        }
        if (hit) stones.splice(i, 1)
      }
    }

    function drawStone(stone) {
      ctx.save()
      ctx.translate(stone.x, stone.y)
      ctx.rotate(stone.spin)

      if (stone.gold) {
        const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, stone.r * 2)
        glow.addColorStop(0, 'rgba(255, 220, 100, 0.55)')
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(0, 0, stone.r * 2, 0, Math.PI * 2)
        ctx.fill()

        const body = ctx.createRadialGradient(-4, -4, 2, 0, 0, stone.r)
        body.addColorStop(0, '#fff3b0')
        body.addColorStop(0.45, '#f0c040')
        body.addColorStop(1, '#b8860b')
        ctx.fillStyle = body
        ctx.beginPath()
        ctx.ellipse(0, 0, stone.r, stone.r * 0.85, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#ffe9a0'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.ellipse(0, 0, stone.r, stone.r * 0.85, 0, 0, Math.PI * 2)
        ctx.stroke()
      } else {
        ctx.fillStyle = '#6b5b4a'
        ctx.beginPath()
        ctx.ellipse(0, 0, stone.r, stone.r * 0.85, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#8a7a66'
        ctx.beginPath()
        ctx.ellipse(-stone.r * 0.25, -stone.r * 0.25, stone.r * 0.45, stone.r * 0.35, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#3d342c'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.ellipse(0, 0, stone.r, stone.r * 0.85, 0, 0, Math.PI * 2)
        ctx.stroke()
      }

      ctx.restore()
    }

    function throwBomb(thrower, options = {}) {
      const now = performance.now()
      const isGold = options.gold === true

      if (now < thrower.bombReadyAt) return
      if (isGold) {
        if (blueCoins < GOLD_BOMB_COST) return
        blueCoins -= GOLD_BOMB_COST
      } else if ((thrower.bombUses || 0) <= 0) {
        return
      }

      const target = fighters.find((f) => f !== thrower)
      let dx = target ? target.x - thrower.x : thrower.vx
      let dy = target ? target.y - thrower.y : thrower.vy
      let dist = Math.hypot(dx, dy)
      if (dist < 0.01) {
        dx = -1
        dy = 0
        dist = 1
      }
      const nx = dx / dist
      const ny = dy / dist

      bombs.push({
        x: thrower.x + nx * (ballR + BOMB_RADIUS),
        y: thrower.y + ny * (ballR + BOMB_RADIUS),
        vx: nx * BOMB_SPEED + thrower.vx * 0.2,
        vy: ny * BOMB_SPEED + thrower.vy * 0.2,
        r: isGold ? BOMB_RADIUS * 1.15 : BOMB_RADIUS,
        fuseUntil: now + (isGold ? GOLD_BOMB_FUSE_MS : BOMB_FUSE_MS),
        owner: thrower,
        blink: 0,
        gold: isGold,
        damage: isGold ? GOLD_BOMB_DAMAGE : BOMB_DAMAGE,
        guaranteed: isGold,
        target,
      })
      thrower.bombReadyAt = now + (isGold ? GOLD_BOMB_COOLDOWN : BOMB_COOLDOWN)
      if (!isGold) thrower.bombUses -= 1
      thrower.squash = 0.3
    }

    function explodeBomb(bomb) {
      spawnBurst(bomb.x, bomb.y, bomb.gold ? 3 : 2.4)
      shocks.push({
        x: bomb.x,
        y: bomb.y,
        r: 12,
        max: bomb.guaranteed ? BOMB_BLAST * 1.4 : BOMB_BLAST,
        life: 1,
      })
      shake = Math.min(20, shake + (bomb.gold ? 16 : 12))
      flash = Math.min(0.6, flash + (bomb.gold ? 0.4 : 0.3))
      triggerCheer()

      const now = performance.now()
      const damage = bomb.damage || BOMB_DAMAGE

      for (let j = 0; j < fighters.length; j += 1) {
        const f = fighters[j]
        if (f === bomb.owner || f.eliminated) continue

        if (!bomb.guaranteed) {
          const d = Math.hypot(f.x - bomb.x, f.y - bomb.y)
          if (d > BOMB_BLAST) continue
          if (f.player && now < f.shieldUntil) continue
          f.lives -= damage
          f.squash = 0.65
          const push = (1 - d / BOMB_BLAST) * 8
          const px = (f.x - bomb.x) / (d || 1)
          const py = (f.y - bomb.y) / (d || 1)
          f.vx += px * push
          f.vy += py * push
        } else {
          // 100% hit — always damages the opponent
          if (f.player && now < f.shieldUntil) continue
          f.lives -= damage
          f.squash = 0.7
          const d = Math.hypot(f.x - bomb.x, f.y - bomb.y) || 1
          f.vx += ((f.x - bomb.x) / d) * 10
          f.vy += ((f.y - bomb.y) / d) * 10
        }
      }
    }

    function updateBombs(dt) {
      const now = performance.now()
      for (let i = bombs.length - 1; i >= 0; i -= 1) {
        const bomb = bombs[i]

        // Gold bomb homes onto target for a guaranteed hit feel
        if (bomb.guaranteed && bomb.target && !bomb.target.eliminated) {
          const dx = bomb.target.x - bomb.x
          const dy = bomb.target.y - bomb.y
          const dist = Math.hypot(dx, dy) || 1
          bomb.vx += (dx / dist) * 1.2 * dt
          bomb.vy += (dy / dist) * 1.2 * dt
          const speed = Math.hypot(bomb.vx, bomb.vy)
          const max = 12
          if (speed > max) {
            bomb.vx = (bomb.vx / speed) * max
            bomb.vy = (bomb.vy / speed) * max
          }
        } else {
          bomb.vx *= 0.98
          bomb.vy *= 0.98
        }

        bomb.x += bomb.vx * dt
        bomb.y += bomb.vy * dt
        bomb.blink += dt * 0.25

        const dx = bomb.x - cx
        const dy = bomb.y - cy
        const dist = Math.hypot(dx, dy)
        if (dist > arenaR - 8) {
          const nx = dx / dist
          const ny = dy / dist
          bomb.x = cx + nx * (arenaR - 8)
          bomb.y = cy + ny * (arenaR - 8)
          bomb.vx *= -0.4
          bomb.vy *= -0.4
        }

        // Gold bomb detonates on contact too
        if (bomb.guaranteed && bomb.target && !bomb.target.eliminated) {
          const hitDist = Math.hypot(bomb.target.x - bomb.x, bomb.target.y - bomb.y)
          if (hitDist < ballR + bomb.r) {
            explodeBomb(bomb)
            bombs.splice(i, 1)
            continue
          }
        }

        if (now >= bomb.fuseUntil) {
          explodeBomb(bomb)
          bombs.splice(i, 1)
        }
      }
    }

    function drawBomb(bomb) {
      const remaining = Math.max(0, bomb.fuseUntil - performance.now())
      const urgent = remaining < 450
      const pulse = 0.6 + Math.sin(bomb.blink * (urgent ? 8 : 3)) * 0.4
      ctx.save()
      ctx.translate(bomb.x, bomb.y)

      if (bomb.gold) {
        ctx.fillStyle = `rgba(255, 200, 60, ${0.22 * pulse})`
        ctx.beginPath()
        ctx.arc(0, 0, bomb.r * 2.1, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillStyle = `rgba(255, 80, 40, ${0.15 * pulse})`
        ctx.beginPath()
        ctx.arc(0, 0, bomb.r * 1.8, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.fillStyle = bomb.gold ? '#3a2a08' : '#1a1a1a'
      ctx.beginPath()
      ctx.arc(0, 0, bomb.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = bomb.gold
        ? `rgba(255, 210, 70, ${pulse})`
        : urgent
          ? `rgba(255,60,40,${pulse})`
          : '#2ec8ff'
      ctx.beginPath()
      ctx.arc(0, -bomb.r * 0.15, bomb.r * 0.35, 0, Math.PI * 2)
      ctx.fill()

      // Fuse spark
      ctx.strokeStyle = '#c4a050'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, -bomb.r)
      ctx.quadraticCurveTo(6, -bomb.r - 8, 2, -bomb.r - 14)
      ctx.stroke()
      ctx.fillStyle = `rgba(255, 200, 80, ${pulse})`
      ctx.beginPath()
      ctx.arc(2, -bomb.r - 14, 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
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
      if (ball.eliminated) {
        ball.vx = 0
        ball.vy = 0
        return
      }

      const accel = 0.85 * dt
      let steered = false

      if (ball.control === 'wasd') {
        if (keys.w) ball.vy -= accel
        if (keys.s) ball.vy += accel
        if (keys.a) ball.vx -= accel
        if (keys.d) ball.vx += accel
        steered = true
      } else if (ball.control === 'arrows') {
        if (keys.up) ball.vy -= accel
        if (keys.down) ball.vy += accel
        if (keys.left) ball.vx -= accel
        if (keys.right) ball.vx += accel
        steered = true
      }

      if (steered) {
        ball.vx *= 0.92
        ball.vy *= 0.92

        const other = nearestOther(ball)
        if (other) {
          const dist = Math.hypot(other.x - ball.x, other.y - ball.y) || 1
          ball.anger += ((Math.max(0, 1 - dist / (arenaR * 1.2))) - ball.anger) * 0.1
        } else {
          ball.anger *= 0.95
        }

        const speed = Math.hypot(ball.vx, ball.vy)
        const max = 12
        if (speed > max) {
          ball.vx = (ball.vx / speed) * max
          ball.vy = (ball.vy / speed) * max
        }
      } else {
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
      }

      ball.x += ball.vx * dt
      ball.y += ball.vy * dt
      keepInArena(ball)
      ball.squash *= 0.86
    }

    function collidePair(a, b, now) {
      if (a.eliminated || b.eliminated) return false

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

      // Touch damage: blue -2, red -2 (shield blocks both ways for red)
      const canHurt = now >= a.hitUntil && now >= b.hitUntil
      if (canHurt) {
        const player = a.player ? a : b.player ? b : null
        const enemy = player === a ? b : player === b ? a : null
        if (player && enemy) {
          const shielded = now < player.shieldUntil
          if (!shielded) {
            enemy.lives -= PLAYER_HIT_DAMAGE
            player.lives -= ENEMY_HIT_DAMAGE
          }
        }
        a.hitUntil = now + 500
        b.hitUntil = now + 500
        a.squash = 0.55
        b.squash = 0.55
        spawnBurst((a.x + b.x) / 2, (a.y + b.y) / 2, 1.2)
        shake = Math.min(16, shake + 6)
        flash = Math.min(0.45, flash + 0.2)
        triggerCheer()
      }

      const rvx = a.vx - b.vx
      const rvy = a.vy - b.vy
      const velAlong = rvx * nx + rvy * ny
      if (velAlong > 0) {
        keepInArena(a)
        keepInArena(b)
        return canHurt
      }

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
      if (!canHurt) spawnBurst(mx, my, power)
      a.squash = Math.max(a.squash, 0.55)
      b.squash = Math.max(b.squash, 0.55)
      shake = Math.min(16, shake + power * 5)
      flash = Math.min(0.45, flash + power * 0.18)
      keepInArena(a)
      keepInArena(b)

      return true
    }

    function removeDeadFighters() {
      const now = performance.now()

      for (let i = 0; i < fighters.length; i += 1) {
        const ball = fighters[i]
        if (ball.lives > 0) continue

        spawnBurst(ball.x, ball.y, 2)
        shake = Math.min(18, shake + 8)
        flash = Math.min(0.55, flash + 0.2)
        triggerCheer()

        // Red kills blue → red gold coin; blue kills red → blue gold coin
        if (!ball.player && ball.control === 'arrows') {
          redCoins += 1
          // Fish leaves when blue dies
          fish = null
        } else if (ball.player) {
          blueCoins += 1
        }

        // Come back with 10 lives
        ball.maxLives = RESPAWN_LIVES
        ball.lives = RESPAWN_LIVES
        ball.vx = 0
        ball.vy = 0
        ball.squash = 0
        ball.eliminated = false
        ball.hitUntil = now + 1000
        if (ball.player) {
          ball.control = 'wasd'
          ball.x = cx - arenaR * 0.25
        } else {
          ball.control = 'arrows'
          ball.x = cx + arenaR * 0.25
        }
        ball.y = cy
        keepInArena(ball)
      }
    }

    function drawCoin(x, y, size) {
      ctx.save()
      ctx.translate(x, y)
      const grad = ctx.createRadialGradient(-4, -4, 2, 0, 0, size)
      grad.addColorStop(0, '#ffe9a0')
      grad.addColorStop(0.5, '#f0c040')
      grad.addColorStop(1, '#c49220')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#a87818'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2)
      ctx.stroke()
      ctx.strokeStyle = 'rgba(255, 240, 180, 0.7)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.32, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }

    function drawFishOnBall(ball) {
      const t = performance.now() * 0.008
      const ox = Math.sin(t) * 6
      const oy = Math.cos(t * 1.3) * 4
      ctx.save()
      ctx.translate(ball.x + ballR * 0.55 + ox, ball.y - ballR * 0.35 + oy)
      ctx.rotate(Math.sin(t) * 0.25)

      // Body
      ctx.fillStyle = '#5ec8ff'
      ctx.beginPath()
      ctx.ellipse(0, 0, 14, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      // Tail
      ctx.beginPath()
      ctx.moveTo(-12, 0)
      ctx.lineTo(-22, -8)
      ctx.lineTo(-22, 8)
      ctx.closePath()
      ctx.fill()
      // Eye
      ctx.fillStyle = '#102030'
      ctx.beginPath()
      ctx.arc(6, -2, 2.2, 0, Math.PI * 2)
      ctx.fill()
      // Fin
      ctx.fillStyle = '#3aa8e0'
      ctx.beginPath()
      ctx.moveTo(0, -7)
      ctx.lineTo(4, -14)
      ctx.lineTo(8, -6)
      ctx.closePath()
      ctx.fill()

      ctx.restore()
    }

    function drawFishButton() {
      if (redCoins < FISH_COST || fish) {
        fishButton.w = 0
        fishButton.h = 0
        return
      }

      const rows = Math.ceil(Math.max(1, redCoins) / 8)
      const x = 20
      const y = 28 + rows * 26 + 12
      const w = 100
      const h = 38
      fishButton = { x, y, w, h }

      ctx.save()
      // Button
      const grad = ctx.createLinearGradient(x, y, x, y + h)
      grad.addColorStop(0, '#3ecfff')
      grad.addColorStop(1, '#1a7fbf')
      ctx.fillStyle = grad
      ctx.strokeStyle = '#a8ecff'
      ctx.lineWidth = 2
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, w, h, 8)
      } else {
        ctx.rect(x, y, w, h)
      }
      ctx.fill()
      ctx.stroke()

      // Mini fish icon
      ctx.fillStyle = '#e8faff'
      ctx.beginPath()
      ctx.ellipse(x + 22, y + h / 2, 10, 6, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(x + 14, y + h / 2)
      ctx.lineTo(x + 6, y + h / 2 - 6)
      ctx.lineTo(x + 6, y + h / 2 + 6)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 13px Figtree, sans-serif'
      ctx.textBaseline = 'middle'
      ctx.fillText('FISK', x + 40, y + h / 2)
      ctx.restore()
    }

    function drawGoldCoins() {
      const size = 18
      const gap = 26
      const cols = 8

      // Red coins — top left
      for (let i = 0; i < redCoins; i += 1) {
        const col = i % cols
        const row = Math.floor(i / cols)
        drawCoin(28 + col * gap, 28 + row * gap, size)
      }

      // Blue coins — top right
      for (let i = 0; i < blueCoins; i += 1) {
        const col = i % cols
        const row = Math.floor(i / cols)
        drawCoin(width - 28 - col * gap, 28 + row * gap, size)
      }

      drawFishButton()
    }

    function activateFish() {
      if (redCoins < FISH_COST || fish) return
      const blue = fighters.find((f) => f.control === 'arrows' && !f.eliminated)
      if (!blue) return
      redCoins -= FISH_COST
      fish = { nextTick: performance.now() + FISH_INTERVAL_MS }
    }

    function updateFish(now) {
      if (!fish) return
      const blue = fighters.find((f) => f.control === 'arrows')
      if (!blue || blue.eliminated || blue.lives <= 0) {
        fish = null
        return
      }
      if (now >= fish.nextTick) {
        if (!(blue.player && now < blue.shieldUntil)) {
          blue.lives -= FISH_DAMAGE
          blue.squash = 0.35
          spawnBurst(blue.x, blue.y, 0.8)
        }
        fish.nextTick = now + FISH_INTERVAL_MS
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
      const squash = Math.min(0.45, ball.squash || 0)
      const anger = ball.anger || 0
      const color = ball.color || '#ff4d3a'
      const glowColor = ball.glow || '#ff8a70'

      ctx.save()
      ctx.translate(ball.x, ball.y + r * 0.55)
      ctx.scale(1, 0.35)
      ctx.fillStyle = 'rgba(0,0,0,0.45)'
      ctx.beginPath()
      ctx.arc(0, 0, Math.max(0.5, r * 0.95), 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      ctx.save()
      ctx.translate(ball.x, ball.y)
      ctx.scale(1 + squash * 0.25, Math.max(0.7, 1 - squash * 0.2))

      // Outer glow
      const glow = ctx.createRadialGradient(0, 0, r * 0.15, 0, 0, r * 2.4)
      glow.addColorStop(0, `${glowColor}aa`)
      glow.addColorStop(0.45, `${glowColor}44`)
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(0, 0, Math.max(0.5, r * 2.4), 0, Math.PI * 2)
      ctx.fill()

      // Solid body so they never disappear
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(0, 0, Math.max(1, r), 0, Math.PI * 2)
      ctx.fill()

      // Highlight
      const body = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.05, 0, 0, r)
      body.addColorStop(0, '#ffffff')
      body.addColorStop(0.25, glowColor)
      body.addColorStop(1, color)
      ctx.fillStyle = body
      ctx.beginPath()
      ctx.arc(0, 0, Math.max(1, r), 0, Math.PI * 2)
      ctx.fill()

      // Bright outline for visibility
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = Math.max(3, r * 0.1)
      ctx.beginPath()
      ctx.arc(0, 0, Math.max(1, r), 0, Math.PI * 2)
      ctx.stroke()
      ctx.strokeStyle = color
      ctx.lineWidth = Math.max(2, r * 0.06)
      ctx.beginPath()
      ctx.arc(0, 0, Math.max(1, r * 0.92), 0, Math.PI * 2)
      ctx.stroke()

      // Shield bubble when immortal
      if (ball.player && performance.now() < ball.shieldUntil) {
        const pulse = 0.65 + Math.sin(performance.now() * 0.012) * 0.2
        const shieldR = r * 1.35
        const shieldGlow = ctx.createRadialGradient(0, 0, r * 0.8, 0, 0, shieldR)
        shieldGlow.addColorStop(0, 'rgba(120, 220, 255, 0.08)')
        shieldGlow.addColorStop(0.7, `rgba(80, 200, 255, ${0.2 * pulse})`)
        shieldGlow.addColorStop(1, 'rgba(180, 240, 255, 0)')
        ctx.fillStyle = shieldGlow
        ctx.beginPath()
        ctx.arc(0, 0, shieldR, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = `rgba(160, 235, 255, ${0.75 * pulse})`
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.arc(0, 0, shieldR, 0, Math.PI * 2)
        ctx.stroke()
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 * pulse})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(0, 0, shieldR * 0.88, 0, Math.PI * 2)
        ctx.stroke()
      }

      const eyeY = -r * 0.12
      const eyeSpread = r * 0.28
      ctx.strokeStyle = 'rgba(20,12,28,0.9)'
      ctx.lineWidth = Math.max(2, r * 0.09)
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
        const maxLives = ball.maxLives || PLAYER_LIVES
        const lives = Math.max(0, ball.lives)
        const pipR = Math.max(2.2, r * 0.1)
        const gap = pipR * 2.3
        const totalW = (maxLives - 1) * gap
        const startX = ball.x - totalW / 2
        const pipY = ball.y - r - pipR * 3
        for (let i = 0; i < maxLives; i += 1) {
          ctx.beginPath()
          ctx.arc(startX + i * gap, pipY, pipR, 0, Math.PI * 2)
          if (i < lives) {
            ctx.fillStyle = ball.player ? '#ff5a5a' : '#5ab8ff'
            ctx.fill()
          } else {
            ctx.strokeStyle = 'rgba(255,255,255,0.25)'
            ctx.lineWidth = 1.5
            ctx.stroke()
          }
        }

        // Remaining shield uses (cyan) under life pips for red
        if (ball.player) {
          const uses = Math.max(0, ball.shieldUses || 0)
          const sGap = pipR * 2.6
          const sTotal = (SHIELD_USES_PER_ROUND - 1) * sGap
          const sStart = ball.x - sTotal / 2
          const sY = pipY - pipR * 3
          for (let i = 0; i < SHIELD_USES_PER_ROUND; i += 1) {
            ctx.beginPath()
            ctx.arc(sStart + i * sGap, sY, pipR * 0.9, 0, Math.PI * 2)
            if (i < uses) {
              ctx.fillStyle = '#7ad7ff'
              ctx.fill()
            } else {
              ctx.strokeStyle = 'rgba(122, 215, 255, 0.3)'
              ctx.lineWidth = 1.5
              ctx.stroke()
            }
          }
        }

        // Remaining bomb uses for blue
        if (ball.control === 'arrows') {
          const uses = Math.max(0, ball.bombUses || 0)
          const sGap = pipR * 2.6
          const sTotal = (BOMB_USES_PER_ROUND - 1) * sGap
          const sStart = ball.x - sTotal / 2
          const sY = pipY - pipR * 3
          for (let i = 0; i < BOMB_USES_PER_ROUND; i += 1) {
            ctx.beginPath()
            ctx.arc(sStart + i * sGap, sY, pipR * 0.9, 0, Math.PI * 2)
            if (i < uses) {
              ctx.fillStyle = '#ffb454'
              ctx.fill()
            } else {
              ctx.strokeStyle = 'rgba(255, 180, 84, 0.3)'
              ctx.lineWidth = 1.5
              ctx.stroke()
            }
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

        updateStones(dt, now)
        updateBombs(dt)
        updateFish(now)
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

        // Parasite fish on blue
        if (fish) {
          const blue = fighters.find((f) => f.control === 'arrows')
          if (blue && !blue.eliminated) drawFishOnBall(blue)
        }

        for (let i = 0; i < stones.length; i += 1) {
          drawStone(stones[i])
        }

        for (let i = 0; i < bombs.length; i += 1) {
          drawBomb(bombs[i])
        }

        ctx.restore()

        // HUD: gold coins stay fixed in the left corner
        drawGoldCoins()

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

    function onKeyDown(e) {
      const k = e.key.toLowerCase()
      if (k === 'w' || k === 'a' || k === 's' || k === 'd') {
        keys[k] = true
        e.preventDefault()
        return
      }
      if (e.key === 'ArrowUp') {
        keys.up = true
        e.preventDefault()
        return
      }
      if (e.key === 'ArrowDown') {
        keys.down = true
        e.preventDefault()
        return
      }
      if (e.key === 'ArrowLeft') {
        keys.left = true
        e.preventDefault()
        return
      }
      if (e.key === 'ArrowRight') {
        keys.right = true
        e.preventDefault()
        return
      }
      if (k === 'e' && !e.repeat) {
        e.preventDefault()
        const player = fighters.find((f) => f.player)
        if (
          player &&
          player.shieldUses > 0 &&
          performance.now() >= player.shieldUntil
        ) {
          player.shieldUntil = performance.now() + SHIELD_DURATION
          player.shieldUses -= 1
        }
        return
      }
      if (k === 'q' && !e.repeat) {
        e.preventDefault()
        const player = fighters.find((f) => f.player)
        if (player) throwStone(player)
        return
      }
      if (k === 'z' && !e.repeat) {
        e.preventDefault()
        const player = fighters.find((f) => f.player)
        if (player) throwStone(player, { gold: true })
        return
      }
      if ((k === '1' || e.code === 'Digit1' || e.code === 'Numpad1') && !e.repeat) {
        e.preventDefault()
        const blue = fighters.find((f) => f.control === 'arrows')
        if (blue) throwBomb(blue)
        return
      }
      if ((k === '0' || e.code === 'Digit0' || e.code === 'Numpad0') && !e.repeat) {
        e.preventDefault()
        const blue = fighters.find((f) => f.control === 'arrows')
        if (blue) throwBomb(blue, { gold: true })
      }
    }

    function onKeyUp(e) {
      const k = e.key.toLowerCase()
      if (k === 'w' || k === 'a' || k === 's' || k === 'd') {
        keys[k] = false
        e.preventDefault()
        return
      }
      if (e.key === 'ArrowUp') {
        keys.up = false
        e.preventDefault()
        return
      }
      if (e.key === 'ArrowDown') {
        keys.down = false
        e.preventDefault()
        return
      }
      if (e.key === 'ArrowLeft') {
        keys.left = false
        e.preventDefault()
        return
      }
      if (e.key === 'ArrowRight') {
        keys.right = false
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    function onPointerDown(e) {
      const rect = canvas.getBoundingClientRect()
      const scaleX = width / rect.width
      const scaleY = height / rect.height
      const px = (e.clientX - rect.left) * scaleX
      const py = (e.clientY - rect.top) * scaleY
      if (
        fishButton.w > 0 &&
        px >= fishButton.x &&
        px <= fishButton.x + fishButton.w &&
        py >= fishButton.y &&
        py <= fishButton.y + fishButton.h
      ) {
        activateFish()
      }
    }

    canvas.style.cursor = 'default'
    canvas.addEventListener('pointerdown', onPointerDown)

    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect()
      const scaleX = width / rect.width
      const scaleY = height / rect.height
      const px = (e.clientX - rect.left) * scaleX
      const py = (e.clientY - rect.top) * scaleY
      const over =
        fishButton.w > 0 &&
        px >= fishButton.x &&
        px <= fishButton.x + fishButton.w &&
        py >= fishButton.y &&
        py <= fishButton.y + fishButton.h
      canvas.style.cursor = over ? 'pointer' : 'default'
    }
    canvas.addEventListener('pointermove', onPointerMove)

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
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      delete window.__arena
    }
  }, [])

  return <canvas ref={canvasRef} className="fight-bg" aria-hidden="true" />
}

export default FightingBalls
