import { useEffect, useRef } from 'react'

const MAX_FIGHTERS = 2
const SPECTATOR_COUNT = 18
const PLAYER_LIVES = 23
const ENEMY_LIVES = 26
const PLAYER_HIT_DAMAGE = 3
const ENEMY_HIT_DAMAGE = 2
const SHIELD_DURATION = 2500
const SHIELD_USES_PER_ROUND = 3
const STONE_SPEED = 14
const STONE_DAMAGE = 1
const STONE_COOLDOWN = 400
const STONE_RADIUS = 10
const STONE_USES = 30
const GOLD_STONE_COST = 3
const GOLD_STONE_DAMAGE = 7
const GOLD_STONE_RADIUS = 16
const GOLD_STONE_SPEED = 16
const GOLD_STONE_COOLDOWN = 600
const LIFE_DRINK_COST = 3
const LIFE_DRINK_HEAL = 5
const SWORD_DAMAGE = 8
const SWORD_SPEED = 17
const SWORD_COOLDOWN = 650
const SWORD_LENGTH = 28
const GOLD_BOMB_COST = 4
const GOLD_BOMB_DAMAGE = 5
const GOLD_BOMB_COOLDOWN = 700
const GOLD_BOMB_FUSE_MS = 800
const BODYGUARD_COST = 5
const BODYGUARD_DURATION_MS = 6700
const BODYGUARD_DAMAGE = 1
const BODYGUARD_TICK_MS = 1000
const BODYGUARD_SPEED = 11
const BODYGUARD_RADIUS = 18

function rollKillCoins() {
  const r = Math.random()
  // 1%: 10, 9%: 3, 30%: 5, 30%: 2, remaining 30%: 0
  // User: 30% chance for 5 gold; keep other rarities smaller
  if (r < 0.01) return 10
  if (r < 0.1) return 3
  if (r < 0.4) return 5
  if (r < 0.7) return 2
  return 0
}
const BOMB_SPEED = 18
const BOMB_DAMAGE = 5
const BOMB_COOLDOWN = 900
const BOMB_RADIUS = 14
const BOMB_FUSE_MS = 200
const BOMB_BLAST = 110
const BOMB_USES_PER_ROUND = 3
const RESPAWN_LIVES = 23
const RESPAWN_LIVES_BLUE = 26
const RESPAWN_COUNTDOWN_MS = 3000
const WIN_SCORE = 30
const BOSS_SCORE = 15
const SHOP_UNLOCK_SCORE = 5
const BOSS_HP = 167
const BOSS_DAMAGE = 3
const BOSS_TOUCH_DAMAGE = 2
const BOSS_RESPAWNS = 5
const BOSS_BOMBS = 5
const BOSS_SCALE = 1.5
const BOSS_MAX_SPEED = 4.2
const BOSS_ACCEL = 0.32
const BOSS_KILL_REWARD = 50
const BOSS_SKIP_REWARD = 10

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
    const bodyguards = []
    let shake = 0
    let flash = 0
    let cheer = 0
    let spawnCooldown = 0
    let redCoins = 0
    let blueCoins = 0
    let redScore = 0
    let blueScore = 0
    let winner = null // 'red' | 'blue'
    let winnerUntil = 0
    let bossMode = false
    let bossRespawnsLeft = BOSS_RESPAWNS
    let bossDamageRed = 0
    let bossDamageBlue = 0
    let lastBossKiller = null // 'red' | 'blue'
    let bossTriggeredThisMatch = false
    let shopOpen = false
    let shopPausedAt = 0
    let shopButton = { x: 0, y: 0, w: 120, h: 42 }
    const shopHits = []
    const inventory = {
      goldStone: 0,
      lifeDrinkRed: 0,
      lifeDrinkBlue: 0,
      goldBomb: 0,
    }

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
        stoneUses: isPlayer ? STONE_USES : 0,
        bombReadyAt: 0,
        bombUses: !isPlayer && paletteIndex === 1 ? BOMB_USES_PER_ROUND : 0,
        eliminated: false,
        respawnAt: 0,
      }
    }

    function resetFighters() {
      fighters.length = 0
      stones.length = 0
      bombs.length = 0
      bodyguards.length = 0
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
      if (!thrower || thrower.eliminated || thrower.lives <= 0) return
      const now = performance.now()
      const isGold = options.gold === true
      const isSword = options.sword === true
      const damage = isSword
        ? SWORD_DAMAGE
        : isGold
          ? GOLD_STONE_DAMAGE
          : STONE_DAMAGE
      const speed = isSword ? SWORD_SPEED : isGold ? GOLD_STONE_SPEED : STONE_SPEED
      const radius = isSword ? SWORD_LENGTH * 0.45 : isGold ? GOLD_STONE_RADIUS : STONE_RADIUS
      const cooldown = isSword
        ? SWORD_COOLDOWN
        : isGold
          ? GOLD_STONE_COOLDOWN
          : STONE_COOLDOWN

      if (now < thrower.stoneReadyAt) return
      if (isSword) {
        return // svärd borttaget från spelet
      } else if (isGold) {
        if (inventory.goldStone <= 0) return
        inventory.goldStone -= 1
      } else {
        // Vanlig sten — röd har begränsat antal
        if ((thrower.stoneUses || 0) <= 0) return
        thrower.stoneUses -= 1
      }

      const target = bossMode
        ? fighters.find((f) => f.isBoss && !f.eliminated)
        : fighters.find((f) => f !== thrower && !f.eliminated)
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
        spin: Math.atan2(ny, nx),
        damage,
        gold: isGold,
        sword: isSword,
        angle: Math.atan2(ny, nx),
      })
      thrower.stoneReadyAt = now + cooldown
      thrower.squash = 0.25
    }

    function updateStones(dt, now) {
      for (let i = stones.length - 1; i >= 0; i -= 1) {
        const stone = stones[i]
        stone.x += stone.vx * dt
        stone.y += stone.vy * dt
        if (stone.sword) {
          stone.angle = Math.atan2(stone.vy, stone.vx)
          stone.spin = stone.angle
        } else {
          stone.spin += 0.35 * dt
        }
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
          if (d < getRadius(f) + stone.r) {
            // I boss-läge: stenar träffar bara bossen (inte lagkamraten)
            if (bossMode && !f.isBoss) continue
            const dmg = stone.damage || STONE_DAMAGE
            f.lives -= dmg
            if (f.isBoss) addBossDamage(stone.owner, dmg)
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

      if (stone.sword) {
        // Blade
        const len = SWORD_LENGTH
        const grad = ctx.createLinearGradient(-len, 0, len, 0)
        grad.addColorStop(0, '#9aa3ad')
        grad.addColorStop(0.45, '#f2f5f8')
        grad.addColorStop(1, '#c0c8d0')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.moveTo(len, 0)
        ctx.lineTo(len * 0.15, -5)
        ctx.lineTo(-len * 0.35, -3.5)
        ctx.lineTo(-len * 0.35, 3.5)
        ctx.lineTo(len * 0.15, 5)
        ctx.closePath()
        ctx.fill()
        // Guard
        ctx.fillStyle = '#d4a017'
        ctx.fillRect(-len * 0.38, -9, 6, 18)
        // Handle
        ctx.fillStyle = '#6b3f1f'
        ctx.fillRect(-len * 0.72, -3, len * 0.35, 6)
        // Pommel
        ctx.beginPath()
        ctx.arc(-len * 0.75, 0, 4, 0, Math.PI * 2)
        ctx.fillStyle = '#e0b43a'
        ctx.fill()
        // Shine
        ctx.strokeStyle = 'rgba(255,255,255,0.55)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(len * 0.85, -1.5)
        ctx.lineTo(-len * 0.2, -1.5)
        ctx.stroke()
      } else if (stone.gold) {
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
      if (!thrower || thrower.eliminated || thrower.lives <= 0) return
      const now = performance.now()
      const isGold = options.gold === true

      if (now < thrower.bombReadyAt) return
      if (isGold) {
        if (inventory.goldBomb <= 0) return
        inventory.goldBomb -= 1
      } else if ((thrower.bombUses || 0) <= 0) {
        return
      }

      const target = bossMode
        ? fighters.find((f) => f.isBoss && !f.eliminated)
        : fighters.find((f) => f !== thrower && !f.eliminated)
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
        if (bossMode && !f.isBoss) continue

        if (!bomb.guaranteed) {
          const d = Math.hypot(f.x - bomb.x, f.y - bomb.y)
          if (d > BOMB_BLAST) continue
          if (f.player && now < f.shieldUntil) continue
          f.lives -= damage
          if (f.isBoss) addBossDamage(bomb.owner, damage)
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
          if (f.isBoss) addBossDamage(bomb.owner, damage)
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

    function getRadius(ball) {
      if (ball && ball.isBoss) return ballR * BOSS_SCALE
      return ballR
    }

    function keepInArena(ball) {
      const r = getRadius(ball)
      const limit = Math.max(16, arenaR - r - 6)
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
        if (other === ball || other.eliminated) continue
        // Boss jagar spelare, spelare undviker bossen
        if (ball.isBoss && other.isBoss) continue
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
        const bossAi = !!ball.isBoss
        const accelScale = bossAi ? BOSS_ACCEL : 1
        const maxSpeed = bossAi ? BOSS_MAX_SPEED : 10
        if (other) {
          const dx = other.x - ball.x
          const dy = other.y - ball.y
          const dist = Math.hypot(dx, dy) || 1
          const charge = Math.max(0, 1 - dist / (arenaR * 1.2))
          ball.vx += (dx / dist) * (0.28 + charge * 0.55) * accelScale * dt
          ball.vy += (dy / dist) * (0.28 + charge * 0.55) * accelScale * dt
          ball.anger += (charge - ball.anger) * 0.1
        } else {
          ball.anger *= 0.95
        }

        if (!bossAi) {
          ball.vx += Math.sin(now * 0.0015 + ball.face) * 0.05 * dt
          ball.vy += Math.cos(now * 0.0018 - ball.face) * 0.05 * dt
        }
        ball.vx *= bossAi ? 0.96 : 0.99
        ball.vy *= bossAi ? 0.96 : 0.99

        const speed = Math.hypot(ball.vx, ball.vy)
        if (speed > maxSpeed) {
          ball.vx = (ball.vx / speed) * maxSpeed
          ball.vy = (ball.vy / speed) * maxSpeed
        }
      }

      ball.x += ball.vx * dt
      ball.y += ball.vy * dt
      keepInArena(ball)
      ball.squash *= 0.86
    }

    function collidePair(a, b, now) {
      if (a.eliminated || b.eliminated) return false

      const ra = getRadius(a)
      const rb = getRadius(b)
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy) || 1
      const min = ra + rb
      if (dist >= min) return false

      const nx = dx / dist
      const ny = dy / dist
      const overlap = (min - dist) * 0.5
      a.x -= nx * overlap
      a.y -= ny * overlap
      b.x += nx * overlap
      b.y += ny * overlap

      const canHurt = now >= a.hitUntil && now >= b.hitUntil
      if (canHurt) {
        if (a.isBoss || b.isBoss) {
          const boss = a.isBoss ? a : b
          const hero = a.isBoss ? b : a
          const shielded =
            hero.control === 'wasd' && now < hero.shieldUntil
          if (!shielded) {
            hero.lives -= BOSS_DAMAGE
          }
          const touchDmg =
            hero.control === 'wasd' || hero.player
              ? PLAYER_HIT_DAMAGE
              : BOSS_TOUCH_DAMAGE
          boss.lives -= touchDmg
          addBossDamage(hero, touchDmg)
          boss.anger = 1
        } else if (bossMode) {
          // Lagkamrater skadar inte varandra under bossfight
        } else {
          // Touch damage: blue -2, red -2 (shield blocks both ways for red)
          const player = a.player ? a : b.player ? b : null
          const enemy = player === a ? b : player === b ? a : null
          if (player && enemy) {
            const shielded = now < player.shieldUntil
            if (!shielded) {
              enemy.lives -= PLAYER_HIT_DAMAGE
              player.lives -= ENEMY_HIT_DAMAGE
            }
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

    function addBossDamage(attacker, amount) {
      if (!bossMode || !attacker || amount <= 0) return
      if (attacker.isBoss) return
      if (attacker.player || attacker.control === 'wasd' || attacker._bossSide === 'red') {
        bossDamageRed += amount
        lastBossKiller = 'red'
      } else if (attacker.control === 'arrows' || attacker._bossSide === 'blue') {
        bossDamageBlue += amount
        lastBossKiller = 'blue'
      }
    }

    function allHeroesDefeated() {
      return fighters.every(
        (f) =>
          f.isBoss ||
          (f.eliminated &&
            (f.bossRespawnsLeft || 0) <= 0 &&
            !(f.respawnAt > 0)),
      )
    }

    function reviveFighter(ball, now) {
      const isRed = ball.player || ball._bossSide === 'red'
      ball.maxLives = isRed ? PLAYER_LIVES : ENEMY_LIVES
      ball.lives = ball.maxLives
      ball.vx = 0
      ball.vy = 0
      ball.squash = 0
      ball.anger = 0
      ball.eliminated = false
      ball.respawnAt = 0
      ball.hitUntil = now + 1000
      ball.shieldUntil = 0
      ball.stoneReadyAt = 0
      ball.bombReadyAt = 0

      if (bossMode) {
        if (isRed) {
          ball.control = 'wasd'
          ball.player = true
          ball._bossSide = 'red'
          ball.shieldUses = SHIELD_USES_PER_ROUND
          ball.stoneUses = STONE_USES
          ball.bombUses = 0
          ball.x = cx - arenaR * 0.3
        } else {
          ball.control = 'arrows'
          ball.player = false
          ball._bossSide = 'blue'
          ball.shieldUses = 0
          ball.stoneUses = 0
          ball.x = cx + arenaR * 0.3
        }
        ball.y = cy
        keepInArena(ball)
        spawnBurst(ball.x, ball.y, 1.2)
        return
      }

      if (ball.player) {
        ball.control = 'wasd'
        ball.shieldUses = SHIELD_USES_PER_ROUND
        ball.stoneUses = STONE_USES
        ball.bombUses = 0
        ball.x = cx - arenaR * 0.25
      } else {
        ball.control = 'arrows'
        ball.shieldUses = 0
        ball.stoneUses = 0
        ball.bombUses = BOMB_USES_PER_ROUND
        ball.x = cx + arenaR * 0.25
      }
      ball.y = cy
      keepInArena(ball)
      spawnBurst(ball.x, ball.y, 1.2)
    }

    function endBossFight(playerWon) {
      if (playerWon) {
        // Den som tar sista slaget får belöningen
        if (lastBossKiller === 'red') {
          redCoins += BOSS_KILL_REWARD
        } else if (lastBossKiller === 'blue') {
          blueCoins += BOSS_KILL_REWARD
        } else if (bossDamageRed >= bossDamageBlue) {
          redCoins += BOSS_KILL_REWARD
        } else {
          blueCoins += BOSS_KILL_REWARD
        }
      }
      spawnBurst(cx, cy, playerWon ? 3 : 1.5)
      shake = Math.min(22, shake + 12)
      flash = Math.min(0.7, flash + 0.35)
      triggerCheer()
      bossMode = false
      bossRespawnsLeft = BOSS_RESPAWNS
      bossDamageRed = 0
      bossDamageBlue = 0
      lastBossKiller = null
      shopOpen = false
      shopPausedAt = 0
      stones.length = 0
      bombs.length = 0
      bodyguards.length = 0
      clearKeys()
      // Behåll poäng/guld — fortsätt mot 30
      resetFighters()
    }

    function startBossFight() {
      bossMode = true
      winner = null
      winnerUntil = 0
      bossRespawnsLeft = BOSS_RESPAWNS
      bossDamageRed = 0
      bossDamageBlue = 0
      lastBossKiller = null
      stones.length = 0
      bombs.length = 0
      bodyguards.length = 0
      fighters.length = 0
      clearKeys()

      const red = makeFighter(cx - arenaR * 0.3, cy, 0, 0, 0, true)
      red._bossSide = 'red'
      red.maxLives = PLAYER_LIVES
      red.lives = PLAYER_LIVES
      red.bossRespawnsLeft = BOSS_RESPAWNS
      red.control = 'wasd'
      red.player = true
      red.shieldUses = SHIELD_USES_PER_ROUND
      red.stoneUses = STONE_USES
      red.bombUses = 0
      red.eliminated = false

      const blue = makeFighter(cx + arenaR * 0.3, cy, 0, 0, 1, false)
      blue._bossSide = 'blue'
      blue.maxLives = ENEMY_LIVES
      blue.lives = ENEMY_LIVES
      blue.bossRespawnsLeft = BOSS_RESPAWNS
      blue.control = 'arrows'
      blue.player = false
      blue.shieldUses = 0
      blue.stoneUses = 0
      blue.bombUses = BOSS_BOMBS
      blue.eliminated = false

      const boss = makeFighter(cx, cy - arenaR * 0.2, 0, 0, 5, false)
      boss.isBoss = true
      boss.control = null
      boss.player = false
      boss.maxLives = BOSS_HP
      boss.lives = BOSS_HP
      boss.color = '#3b0a5c'
      boss.glow = '#ff2d6a'
      boss.anger = 1
      boss.bombUses = 0
      boss.shieldUses = 0
      boss.eliminated = false

      fighters.push(red, blue, boss)
      keepInArena(red)
      keepInArena(blue)
      keepInArena(boss)
      spawnBurst(boss.x, boss.y, 2)
      triggerCheer()
    }

    function removeDeadFighters() {
      const now = performance.now()

      for (let i = 0; i < fighters.length; i += 1) {
        const ball = fighters[i]

        // Finish countdown → come back to life
        if (ball.eliminated && ball.respawnAt > 0 && now >= ball.respawnAt) {
          reviveFighter(ball, now)
          continue
        }

        if (ball.lives > 0 || ball.eliminated) continue

        // Just died
        spawnBurst(ball.x, ball.y, 2)
        shake = Math.min(18, shake + 8)
        flash = Math.min(0.55, flash + 0.2)
        triggerCheer()

        if (bossMode) {
          if (ball.isBoss) {
            ball.lives = 0
            ball.vx = 0
            ball.vy = 0
            ball.eliminated = true
            ball.control = null
            endBossFight(true)
            return
          }

          ball.lives = 0
          ball.vx = 0
          ball.vy = 0
          ball.eliminated = true
          ball.control = null

          if ((ball.bossRespawnsLeft || 0) > 0) {
            ball.bossRespawnsLeft -= 1
            ball.respawnAt = now + RESPAWN_COUNTDOWN_MS
          } else {
            ball.respawnAt = 0
            if (allHeroesDefeated()) {
              endBossFight(false)
              return
            }
          }
          continue
        }

        const reward = rollKillCoins()
        if (!ball.player && ball.control === 'arrows') {
          redCoins += reward
          redScore += 1
          ball.lives = 0
          ball.vx = 0
          ball.vy = 0
          ball.eliminated = true
          ball.respawnAt = now + RESPAWN_COUNTDOWN_MS
          ball.control = null
          if (redScore >= WIN_SCORE && !bossMode) {
            winner = 'red'
            winnerUntil = now + 3000
            return
          }
          if (redScore >= BOSS_SCORE && !bossMode && !bossTriggeredThisMatch) {
            bossTriggeredThisMatch = true
            startBossFight()
            return
          }
          continue
        } else if (ball.player) {
          blueCoins += reward
          blueScore += 1
          ball.lives = 0
          ball.vx = 0
          ball.vy = 0
          ball.eliminated = true
          ball.respawnAt = now + RESPAWN_COUNTDOWN_MS
          ball.control = null
          if (blueScore >= WIN_SCORE && !bossMode) {
            winner = 'blue'
            winnerUntil = now + 3000
            return
          }
          if (blueScore >= BOSS_SCORE && !bossMode && !bossTriggeredThisMatch) {
            bossTriggeredThisMatch = true
            startBossFight()
            return
          }
          continue
        }

        ball.lives = 0
        ball.vx = 0
        ball.vy = 0
        ball.eliminated = true
        ball.respawnAt = now + RESPAWN_COUNTDOWN_MS
        ball.control = null
      }
    }

    function drawRespawnCountdowns(now = performance.now()) {
      for (let i = 0; i < fighters.length; i += 1) {
        const ball = fighters[i]
        if (!ball.eliminated || !ball.respawnAt) continue

        const left = Math.max(0, ball.respawnAt - now)
        const n = Math.max(1, Math.ceil(left / 1000))
        const pulse = 0.85 + Math.sin(now * 0.02) * 0.15

        ctx.save()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = `bold ${Math.floor(72 * pulse)}px Syne, sans-serif`
        ctx.fillStyle = ball.player ? '#ff6b5a' : '#5ec8ff'
        ctx.strokeStyle = 'rgba(0,0,0,0.55)'
        ctx.lineWidth = 8
        ctx.strokeText(String(n), ball.x, ball.y)
        ctx.fillText(String(n), ball.x, ball.y)
        ctx.restore()
      }
    }

    function shiftPausedTimers(ms) {
      if (ms <= 0) return
      for (let i = 0; i < fighters.length; i += 1) {
        const f = fighters[i]
        if (f.respawnAt > 0) f.respawnAt += ms
        if (f.shieldUntil > 0) f.shieldUntil += ms
        if (f.hitUntil > 0) f.hitUntil += ms
        if (f.coolUntil > 0) f.coolUntil += ms
        if (f.stoneReadyAt > 0) f.stoneReadyAt += ms
      }
      for (let i = 0; i < bombs.length; i += 1) {
        if (bombs[i].fuseUntil > 0) bombs[i].fuseUntil += ms
      }
      for (let i = 0; i < bodyguards.length; i += 1) {
        bodyguards[i].expiresAt += ms
        bodyguards[i].nextTick += ms
      }
      if (winnerUntil > 0) winnerUntil += ms
    }


    function shopUnlocked() {
      return redScore >= SHOP_UNLOCK_SCORE || blueScore >= SHOP_UNLOCK_SCORE
    }

    function openShop() {
      if (shopOpen || winner || bossMode) return
      if (!shopUnlocked()) return
      clearKeys()
      shopPausedAt = performance.now()
      shopOpen = true
    }

    function closeShop() {
      if (!shopOpen) return
      if (shopPausedAt > 0) {
        shiftPausedTimers(performance.now() - shopPausedAt)
        shopPausedAt = 0
      }
      shopOpen = false
    }

    function drawShopButton() {
      const w = 120
      const h = 42
      const x = width * 0.5 - w * 0.5
      const y = Math.max(96, cy - arenaR - 58)
      shopButton = { x, y, w, h }
      const unlocked = shopUnlocked()

      ctx.save()
      const grad = ctx.createLinearGradient(x, y, x, y + h)
      if (unlocked) {
        grad.addColorStop(0, '#f0c040')
        grad.addColorStop(1, '#c49220')
        ctx.strokeStyle = '#ffe9a0'
        ctx.fillStyle = '#2a1c08'
      } else {
        grad.addColorStop(0, '#6b7280')
        grad.addColorStop(1, '#4b5563')
        ctx.strokeStyle = '#9ca3af'
        ctx.fillStyle = '#e5e7eb'
      }
      ctx.fillStyle = grad
      ctx.lineWidth = 2
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, w, h, 10)
      else ctx.rect(x, y, w, h)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = unlocked ? '#2a1c08' : '#e5e7eb'
      ctx.font = 'bold 20px Syne, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(unlocked ? 'SHOP' : 'SHOP 🔒', x + w * 0.5, y + h * 0.5)
      if (!unlocked) {
        ctx.font = '600 11px Figtree, sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.fillText(`låses vid ${SHOP_UNLOCK_SCORE} kills`, x + w * 0.5, y + h + 14)
      }
      ctx.restore()
    }

    function drawShop() {
      shopHits.length = 0
      if (!shopOpen) return

      const panelW = Math.min(420, width * 0.9)
      const panelH = Math.min(520, height * 0.82)
      const px = width * 0.5 - panelW * 0.5
      const py = height * 0.5 - panelH * 0.5

      ctx.save()
      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = '#1a1520'
      ctx.strokeStyle = '#f0c040'
      ctx.lineWidth = 3
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') ctx.roundRect(px, py, panelW, panelH, 14)
      else ctx.rect(px, py, panelW, panelH)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#ffe9a0'
      ctx.font = 'bold 28px Syne, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText('SHOP', width * 0.5, py + 18)

      ctx.font = '14px Figtree, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.65)'
      ctx.fillText(`Röd: ${redCoins} 🪙   Blå: ${blueCoins} 🪙`, width * 0.5, py + 54)

      const items = [
        {
          id: 'goldStone',
          title: 'Guldsten',
          desc: `Z · ${GOLD_STONE_DAMAGE} skada`,
          cost: GOLD_STONE_COST,
          side: 'Röd',
          owned: inventory.goldStone,
          canBuy: redCoins >= GOLD_STONE_COST,
        },
        {
          id: 'lifeDrinkRed',
          title: 'Livedryck',
          desc: `R · +${LIFE_DRINK_HEAL} liv`,
          cost: LIFE_DRINK_COST,
          side: 'Röd',
          owned: inventory.lifeDrinkRed,
          canBuy: redCoins >= LIFE_DRINK_COST,
        },
        {
          id: 'shield',
          title: 'Extra sköld',
          desc: 'E · +1 sköld',
          cost: 3,
          side: 'Röd',
          owned: fighters.find((f) => f.player)?.shieldUses ?? 0,
          canBuy: redCoins >= 3,
        },
        {
          id: 'goldBomb',
          title: 'Guldbomb',
          desc: `0 · ${GOLD_BOMB_DAMAGE} skada 100%`,
          cost: GOLD_BOMB_COST,
          side: 'Blå',
          owned: inventory.goldBomb,
          canBuy: blueCoins >= GOLD_BOMB_COST,
        },
        {
          id: 'lifeDrinkBlue',
          title: 'Livedryck',
          desc: `2 · +${LIFE_DRINK_HEAL} liv`,
          cost: LIFE_DRINK_COST,
          side: 'Blå',
          owned: inventory.lifeDrinkBlue,
          canBuy: blueCoins >= LIFE_DRINK_COST,
        },
        {
          id: 'bombUse',
          title: 'Extra bomb',
          desc: '1 · +1 vanlig bomb',
          cost: 2,
          side: 'Blå',
          owned: fighters.find((f) => f.control === 'arrows')?.bombUses ?? 0,
          canBuy: blueCoins >= 2,
        },
        {
          id: 'bodyguardRed',
          title: 'Bodyguard',
          desc: 'Lila · 1/sek · 6.7s',
          cost: BODYGUARD_COST,
          side: 'Röd',
          owned: bodyguards.filter((g) => g.owner?.player).length,
          canBuy: redCoins >= BODYGUARD_COST,
        },
        {
          id: 'bodyguardBlue',
          title: 'Bodyguard',
          desc: 'Lila · 1/sek · 6.7s',
          cost: BODYGUARD_COST,
          side: 'Blå',
          owned: bodyguards.filter((g) => g.owner && !g.owner.player).length,
          canBuy: blueCoins >= BODYGUARD_COST,
        },
      ]

      const startY = py + 88
      const rowH = 44
      items.forEach((item, i) => {
        const y = startY + i * rowH
        const bx = px + panelW - 108
        const by = y + 6
        const bw = 88
        const bh = 34

        ctx.textAlign = 'left'
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 16px Figtree, sans-serif'
        ctx.fillText(`${item.title} (${item.side})`, px + 24, y + 4)
        ctx.font = '13px Figtree, sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.55)'
        ctx.fillText(`${item.desc} · äger ${item.owned}`, px + 24, y + 24)

        ctx.fillStyle = item.canBuy ? '#f0c040' : '#4b5563'
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') ctx.roundRect(bx, by, bw, bh, 8)
        else ctx.rect(bx, by, bw, bh)
        ctx.fill()
        ctx.fillStyle = item.canBuy ? '#2a1c08' : '#9ca3af'
        ctx.font = 'bold 14px Figtree, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(`${item.cost} 🪙`, bx + bw * 0.5, by + bh * 0.5)

        shopHits.push({ x: bx, y: by, w: bw, h: bh, id: item.id })
      })

      const cxBtn = width * 0.5
      const cyBtn = py + panelH - 36
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 22px Syne, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('✕', cxBtn, cyBtn)
      shopHits.push({ x: cxBtn - 16, y: cyBtn - 4, w: 32, h: 32, id: 'close' })
      ctx.restore()
    }

    function drawWinner() {
      if (!winner) return
      ctx.save()
      ctx.fillStyle = 'rgba(0,0,0,0.45)'
      ctx.fillRect(0, 0, width, height)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = 'bold 64px Syne, sans-serif'
      ctx.fillStyle = winner === 'red' ? '#ff6b5a' : '#5ec8ff'
      ctx.strokeStyle = 'rgba(0,0,0,0.5)'
      ctx.lineWidth = 10
      const label = winner === 'red' ? 'RÖD VINNER!' : 'BLÅ VINNER!'
      ctx.strokeText(label, width * 0.5, height * 0.45)
      ctx.fillText(label, width * 0.5, height * 0.45)
      ctx.font = '600 20px Figtree, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      ctx.fillText('Ny match startar snart…', width * 0.5, height * 0.55)
      ctx.restore()
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

    function buyShopItem(id) {
      if (!shopUnlocked()) return
      if (id === 'goldStone') {
        if (redCoins < GOLD_STONE_COST) return
        redCoins -= GOLD_STONE_COST
        inventory.goldStone += 1
      } else if (id === 'lifeDrinkRed') {
        if (redCoins < LIFE_DRINK_COST) return
        redCoins -= LIFE_DRINK_COST
        inventory.lifeDrinkRed += 1
      } else if (id === 'lifeDrinkBlue') {
        if (blueCoins < LIFE_DRINK_COST) return
        blueCoins -= LIFE_DRINK_COST
        inventory.lifeDrinkBlue += 1
      } else if (id === 'goldBomb') {
        if (blueCoins < GOLD_BOMB_COST) return
        blueCoins -= GOLD_BOMB_COST
        inventory.goldBomb += 1
      } else if (id === 'shield') {
        const red = fighters.find((f) => f.player)
        if (!red || redCoins < 3) return
        redCoins -= 3
        red.shieldUses = Math.min(SHIELD_USES_PER_ROUND, (red.shieldUses || 0) + 1)
      } else if (id === 'bombUse') {
        const blue = fighters.find((f) => f.control === 'arrows')
        if (!blue || blueCoins < 2) return
        blueCoins -= 2
        const maxBombs = bossMode ? BOSS_BOMBS : BOMB_USES_PER_ROUND
        blue.bombUses = Math.min(maxBombs, (blue.bombUses || 0) + 1)
      } else if (id === 'bodyguardRed') {
        if (redCoins < BODYGUARD_COST) return
        const red = fighters.find((f) => f.player && !f.eliminated)
        const target = bossMode
          ? fighters.find((f) => f.isBoss && !f.eliminated)
          : fighters.find((f) => f.control === 'arrows' && !f.eliminated)
        if (!red || !target) return
        redCoins -= BODYGUARD_COST
        spawnBodyguard(red, target)
      } else if (id === 'bodyguardBlue') {
        if (blueCoins < BODYGUARD_COST) return
        const blue = fighters.find((f) => f.control === 'arrows' && !f.eliminated)
        const target = bossMode
          ? fighters.find((f) => f.isBoss && !f.eliminated)
          : fighters.find((f) => f.player && !f.eliminated)
        if (!blue || !target) return
        blueCoins -= BODYGUARD_COST
        spawnBodyguard(blue, target)
      }
    }

    function spawnBodyguard(owner, target) {
      // Om shoppen är pausad: använd fryst tid så duration blir rätt efter closeShop()
      const now = shopOpen && shopPausedAt > 0 ? shopPausedAt : performance.now()
      const dx = target.x - owner.x
      const dy = target.y - owner.y
      const dist = Math.hypot(dx, dy) || 1
      bodyguards.push({
        x: owner.x + (dx / dist) * (ballR + BODYGUARD_RADIUS),
        y: owner.y + (dy / dist) * (ballR + BODYGUARD_RADIUS),
        vx: 0,
        vy: 0,
        r: BODYGUARD_RADIUS,
        owner,
        target,
        expiresAt: now + BODYGUARD_DURATION_MS,
        nextTick: now + BODYGUARD_TICK_MS,
        squash: 0,
      })
    }

    function updateBodyguards(dt, now) {
      for (let i = bodyguards.length - 1; i >= 0; i -= 1) {
        const g = bodyguards[i]
        if (now >= g.expiresAt || !g.target || g.target.eliminated || g.target.lives <= 0) {
          spawnBurst(g.x, g.y, 0.8)
          bodyguards.splice(i, 1)
          continue
        }

        const dx = g.target.x - g.x
        const dy = g.target.y - g.y
        const dist = Math.hypot(dx, dy) || 1
        g.vx += (dx / dist) * 0.55 * dt
        g.vy += (dy / dist) * 0.55 * dt
        g.vx *= 0.94
        g.vy *= 0.94
        const speed = Math.hypot(g.vx, g.vy)
        if (speed > BODYGUARD_SPEED) {
          g.vx = (g.vx / speed) * BODYGUARD_SPEED
          g.vy = (g.vy / speed) * BODYGUARD_SPEED
        }
        g.x += g.vx * dt
        g.y += g.vy * dt
        g.squash *= 0.88

        // Keep roughly in arena
        const adx = g.x - cx
        const ady = g.y - cy
        const adist = Math.hypot(adx, ady)
        const limit = arenaR - g.r
        if (adist > limit) {
          g.x = cx + (adx / adist) * limit
          g.y = cy + (ady / adist) * limit
        }

        if (now >= g.nextTick) {
          const near = Math.hypot(g.target.x - g.x, g.target.y - g.y)
          if (near < ballR + g.r + 8) {
            const shielded =
              g.target.player && now < g.target.shieldUntil
            if (!shielded) {
              g.target.lives -= BODYGUARD_DAMAGE
              g.target.squash = 0.4
              if (g.target.isBoss) addBossDamage(g.owner, BODYGUARD_DAMAGE)
              spawnBurst(g.x, g.y, 0.6)
            }
            g.squash = 0.35
          }
          g.nextTick = now + BODYGUARD_TICK_MS
        }
      }
    }

    function drawBodyguard(g) {
      const squash = Math.min(0.4, g.squash || 0)
      ctx.save()
      ctx.translate(g.x, g.y)
      ctx.scale(1 + squash * 0.2, Math.max(0.75, 1 - squash * 0.2))

      const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, g.r * 2.2)
      glow.addColorStop(0, 'rgba(200, 120, 255, 0.55)')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(0, 0, g.r * 2.2, 0, Math.PI * 2)
      ctx.fill()

      const body = ctx.createRadialGradient(-g.r * 0.3, -g.r * 0.3, 2, 0, 0, g.r)
      body.addColorStop(0, '#f0d0ff')
      body.addColorStop(0.35, '#c084fc')
      body.addColorStop(1, '#7c3aed')
      ctx.fillStyle = body
      ctx.beginPath()
      ctx.arc(0, 0, g.r, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = '#e9d5ff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(0, 0, g.r, 0, Math.PI * 2)
      ctx.stroke()

      // Angry little face
      ctx.fillStyle = '#2e1065'
      ctx.beginPath()
      ctx.arc(-5, -2, 2.2, 0, Math.PI * 2)
      ctx.arc(5, -2, 2.2, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#2e1065'
      ctx.lineWidth = 1.8
      ctx.beginPath()
      ctx.moveTo(-5, 5)
      ctx.quadraticCurveTo(0, 9, 5, 5)
      ctx.stroke()

      ctx.restore()
    }

    function drawScores() {
      ctx.save()
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.font = 'bold 64px Syne, sans-serif'

      ctx.fillStyle = '#ff5a5a'
      ctx.strokeStyle = 'rgba(0,0,0,0.45)'
      ctx.lineWidth = 6
      ctx.strokeText(String(redScore), width * 0.28, 18)
      ctx.fillText(String(redScore), width * 0.28, 18)

      ctx.fillStyle = '#5ab8ff'
      ctx.strokeText(String(blueScore), width * 0.72, 18)
      ctx.fillText(String(blueScore), width * 0.72, 18)

      ctx.font = 'bold 16px Figtree, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.fillText(`först till ${WIN_SCORE} · boss vid ${BOSS_SCORE}`, width * 0.5, 28)
      ctx.restore()
    }

    function drawBossHud() {
      if (!bossMode) return
      const red = fighters.find((f) => f._bossSide === 'red')
      const blue = fighters.find((f) => f._bossSide === 'blue')
      const redLeft = red ? red.bossRespawnsLeft ?? 0 : 0
      const blueLeft = blue ? blue.bossRespawnsLeft ?? 0 : 0
      ctx.save()
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.font = 'bold 16px Figtree, sans-serif'
      ctx.fillStyle = 'rgba(255,200,220,0.9)'
      ctx.fillText(
        `Boss · respawn R:${redLeft} B:${blueLeft} · skada R:${bossDamageRed} B:${bossDamageBlue}`,
        width * 0.5,
        56,
      )
      ctx.restore()
    }

    function resetMatch() {
      redScore = 0
      blueScore = 0
      // Guldpengar behålls mellan matcher
      winner = null
      winnerUntil = 0
      bossMode = false
      bossTriggeredThisMatch = false
      bossRespawnsLeft = BOSS_RESPAWNS
      bossDamageRed = 0
      bossDamageBlue = 0
      lastBossKiller = null
      shopOpen = false
      shopPausedAt = 0
      stones.length = 0
      bombs.length = 0
      bodyguards.length = 0
      inventory.goldStone = 0
      inventory.lifeDrinkRed = 0
      inventory.lifeDrinkBlue = 0
      inventory.goldBomb = 0
      resetFighters()
    }

    function drawGoldCoins() {
      const size = 18
      const gap = 26
      const cols = 8

      // Red coins — top left
      for (let i = 0; i < redCoins; i += 1) {
        const col = i % cols
        const row = Math.floor(i / cols)
        drawCoin(28 + col * gap, 28 + row * gap + 70, size)
      }

      // Blue coins — top right
      for (let i = 0; i < blueCoins; i += 1) {
        const col = i % cols
        const row = Math.floor(i / cols)
        drawCoin(width - 28 - col * gap, 28 + row * gap + 70, size)
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
        const pipY = ball.y - r - pipR * 3

        if (ball.isBoss || maxLives > 15) {
          ctx.save()
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.font = `bold ${Math.max(16, Math.floor(r * 0.35))}px Syne, sans-serif`
          ctx.fillStyle = '#ff6b9a'
          ctx.strokeStyle = 'rgba(0,0,0,0.55)'
          ctx.lineWidth = 4
          const label = `${lives}`
          ctx.strokeText(label, ball.x, pipY)
          ctx.fillText(label, ball.x, pipY)
          ctx.restore()
        } else {
          const gap = pipR * 2.3
          const totalW = (maxLives - 1) * gap
          const startX = ball.x - totalW / 2
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

          // Stone count (Q)
          const stonesLeft = Math.max(0, ball.stoneUses || 0)
          ctx.save()
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.font = `bold ${Math.max(11, Math.floor(r * 0.22))}px Figtree, sans-serif`
          ctx.fillStyle = '#d4d4d8'
          ctx.fillText(`sten ${stonesLeft}`, ball.x, sY - pipR * 3.2)
          ctx.restore()
        }

        // Remaining bomb uses for blue
        if (ball.control === 'arrows') {
          const uses = Math.max(0, ball.bombUses || 0)
          const maxBombs = bossMode ? BOSS_BOMBS : BOMB_USES_PER_ROUND
          const sGap = pipR * 2.6
          const sTotal = Math.max(0, maxBombs - 1) * sGap
          const sStart = ball.x - sTotal / 2
          const sY = pipY - pipR * 3
          for (let i = 0; i < maxBombs; i += 1) {
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

        if (winner) {
          last = now
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          ctx.clearRect(0, 0, width, height)
          drawArena(now)
          for (let i = 0; i < fighters.length; i += 1) {
            drawBall(fighters[i], getRadius(fighters[i]), false)
          }
          drawScores()
          drawShopButton()
          drawGoldCoins()
          drawWinner()
          if (now >= winnerUntil) resetMatch()
          return
        }

        if (shopOpen) {
          last = now
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          ctx.clearRect(0, 0, width, height)
          drawArena(now)
          for (let i = 0; i < spectators.length; i += 1) {
            drawBall(spectators[i], spectatorR, true)
          }
          for (let i = 0; i < fighters.length; i += 1) {
            drawBall(fighters[i], getRadius(fighters[i]), false)
          }
          for (let i = 0; i < stones.length; i += 1) {
            drawStone(stones[i])
          }
          for (let i = 0; i < bombs.length; i += 1) {
            drawBomb(bombs[i])
          }
          for (let i = 0; i < bodyguards.length; i += 1) {
            drawBodyguard(bodyguards[i])
          }
          drawScores()
          drawShopButton()
          drawGoldCoins()
          drawRespawnCountdowns(shopPausedAt || now)
          drawBossHud()
          drawShop()
          return
        }

        for (let i = 0; i < fighters.length; i += 1) {
          updateFighter(fighters[i], dt, now)
        }

        for (let i = 0; i < fighters.length; i += 1) {
          for (let j = i + 1; j < fighters.length; j += 1) {
            collidePair(fighters[i], fighters[j], now)
          }
        }

        updateStones(dt, now)
        updateBombs(dt)
        updateBodyguards(dt, now)
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
          drawBall(fighters[i], getRadius(fighters[i]), false)
        }

        for (let i = 0; i < stones.length; i += 1) {
          drawStone(stones[i])
        }

        for (let i = 0; i < bombs.length; i += 1) {
          drawBomb(bombs[i])
        }

        for (let i = 0; i < bodyguards.length; i += 1) {
          drawBodyguard(bodyguards[i])
        }

        ctx.restore()

        // HUD
        drawScores()
        drawShopButton()
        drawGoldCoins()
        drawRespawnCountdowns()
        drawBossHud()
        drawShop()

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

    function useLifeDrink(fighter, side) {
      if (!fighter || fighter.eliminated || fighter.lives <= 0) return
      if (side === 'red') {
        if (inventory.lifeDrinkRed <= 0) return
        inventory.lifeDrinkRed -= 1
      } else {
        if (inventory.lifeDrinkBlue <= 0) return
        inventory.lifeDrinkBlue -= 1
      }
      fighter.lives += LIFE_DRINK_HEAL
      fighter.squash = 0.35
      spawnBurst(fighter.x, fighter.y, 1.1)
    }

    function clearKeys() {
      keys.w = false
      keys.a = false
      keys.s = false
      keys.d = false
      keys.up = false
      keys.down = false
      keys.left = false
      keys.right = false
    }

    function onKeyDown(e) {
      const k = e.key.toLowerCase()
      if (k === 'escape') {
        closeShop()
        return
      }
      if (shopOpen) return
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
          !player.eliminated &&
          player.lives > 0 &&
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
      if (k === 'r' && !e.repeat) {
        e.preventDefault()
        const player = fighters.find((f) => f.player)
        if (player) useLifeDrink(player, 'red')
        return
      }
      if ((k === '1' || e.code === 'Digit1' || e.code === 'Numpad1') && !e.repeat) {
        e.preventDefault()
        const blue = fighters.find((f) => f.control === 'arrows')
        if (blue) throwBomb(blue)
        return
      }
      if ((k === '2' || e.code === 'Digit2' || e.code === 'Numpad2') && !e.repeat) {
        e.preventDefault()
        const blue = fighters.find((f) => f.control === 'arrows')
        if (blue) useLifeDrink(blue, 'blue')
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

    function canvasPos(e) {
      const rect = canvas.getBoundingClientRect()
      return {
        x: (e.clientX - rect.left) * (width / rect.width),
        y: (e.clientY - rect.top) * (height / rect.height),
      }
    }

    function hitRect(px, py, r) {
      return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h
    }

    function onPointerDown(e) {
      const { x: px, y: py } = canvasPos(e)

      if (shopOpen) {
        for (let i = shopHits.length - 1; i >= 0; i -= 1) {
          const hit = shopHits[i]
          if (!hitRect(px, py, hit)) continue
          if (hit.id === 'close') closeShop()
          else buyShopItem(hit.id)
          return
        }
        closeShop()
        return
      }

      if (winner || bossMode) return

      if (hitRect(px, py, shopButton)) {
        openShop()
      }
    }

    function onPointerMove(e) {
      const { x: px, y: py } = canvasPos(e)
      let over = hitRect(px, py, shopButton)
      if (shopOpen) {
        over = shopHits.some((h) => hitRect(px, py, h))
      }
      canvas.style.cursor = over ? 'pointer' : 'default'
    }

    canvas.addEventListener('pointerdown', onPointerDown)
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
