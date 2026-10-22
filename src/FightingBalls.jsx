import { useEffect, useRef } from 'react'

const MAX_FIGHTERS = 2
const SPECTATOR_COUNT = 18
const PLAYER_LIVES = 10
const ENEMY_LIVES = 10
const PLAYER_HIT_DAMAGE = 3
const ENEMY_HIT_DAMAGE = 2
const SHIELD_DURATION = 2500
const SHIELD_USES_PER_ROUND = 3
const MC_SHIELD_COST = 50
const MC_SHIELD_DURATION = 6000
const LIFE_DRINK_COST = 3
const KILLSTREAK_SEGMENTS = [
  { id: 'coins8', label: '+8 🪙', rarity: 'common', color: '#6b7280' },
  { id: 'coins15', label: '+15 🪙', rarity: 'common', color: '#78716c' },
  { id: 'lifeDrink', label: 'Livedryck', rarity: 'good', color: '#22c55e' },
  { id: 'sus', label: 'Sus', rarity: 'good', color: '#16a34a' },
  { id: 'mcShield', label: 'MC-sköld', rarity: 'good', color: '#0ea5e9' },
  { id: 'bodyguard', label: 'Bodyguard', rarity: 'better', color: '#a855f7' },
  { id: 'mogger', label: 'Mogger', rarity: 'better', color: '#111827' },
  { id: 'sus100', label: '100 SUS', rarity: 'jackpot', color: '#f0c040' },
]
const LIFE_DRINK_HEAL = 5
const KNIFE_DAMAGE = 4
const KNIFE_COOLDOWN = 450
const KNIFE_SWING_MS = 280
const KNIFE_REACH = 58
const MELEE_HIT_PAD = 22
const MELEE_ARC = 1.15 // radianer · träff-vinkel under sving
const PROJECTILE_HIT_PAD = 30
const KNIFE_COST = 5
const MATERIAL_TIERS = ['wood', 'stone', 'iron', 'diamond']
const MATERIAL_LABELS = {
  wood: 'Trä',
  stone: 'Sten',
  iron: 'Järn',
  diamond: 'Diamant',
}
const MATERIAL_COLORS = {
  wood: { blade: '#8b5a2b', tip: '#c4a574', edge: '#5c3a1a' },
  stone: { blade: '#7a7f88', tip: '#b0b5be', edge: '#4a4e56' },
  iron: { blade: '#c0c8d0', tip: '#f4f7fa', edge: '#6a727a' },
  diamond: { blade: '#5eead4', tip: '#ccfbf1', edge: '#0f766e' },
}
const UPGRADE_BASE_COST = 5 // 5 → 10 → 20 → 40
const MAX_MATERIAL_LEVEL = 4 // trä + 4 köp (sista kostar 40); utseende cap på diamant
const SWORD_DAMAGE = 3
const SWORD_COOLDOWN = 420
const SWORD_SWING_MS = 280
const SWORD_REACH = 96
const BOW_DAMAGE = 2 // Lv0=2, uppgraderingar → 3,4,5,6,7,8
const BOW_MAX_LEVEL = 6 // 2 + 6 = 8 dmg
const BOW_COOLDOWN = 700
const BOW_DRAW_MS = 200
const BOW_ARROW_SPEED = 10
const BOW_ARROW_RADIUS = 10
const NOKIA_COST = 1000
const NOKIA_HIT_DAMAGE = 5 // första träffen / explosionen
const NOKIA_FIRE_DAMAGE = 1 // eld-DoT på spelaren
const NOKIA_FIRE_TICK_MS = 500
const NOKIA_FIRE_DURATION_MS = 5000
const NOKIA_SPEED = 9
const NOKIA_RADIUS = 14
const NOKIA_PROXIMITY = 70 // exploderar nära fiende
const NOKIA_BLAST = 95
const NOKIA_DIAL_CODE = '112'
const LEON_DIAL_CODE = '123'
const LEON_MAX_SAFE_CALLS = 1 // 1:a gången mot fiende · 2:a+ mot dig
const LEON_FOOTBALL_DAMAGE = 100
const LEON_SPEED = 9
const LEON_RADIUS = 28
const LEON_BALL_SPEED = 18
const LEON_BALL_RADIUS = 14
const LEON_KICK_RANGE = 175 // sparkar på avstånd · ingen kroppskontakt
const LEON_KICK_WINDUP_MS = 280
const POLICE_REWARD = 9999
const POLICE_SPEED = 10
const POLICE_RADIUS = 26
const POLICE_CATCH = 42
const KIDNAP_ESCAPE_MS = 10000
const PISTOL_DAMAGE = 1 // Lv0=1 … Lv4=5; Lv5+ RPG; Lv9 sniper
const PISTOL_MAX_LEVEL = 9
const PISTOL_RPG_LEVEL = 5
const PISTOL_SNIPER_LEVEL = 9
const PISTOL_COST = 20
const PISTOL_COOLDOWN = 320
const PISTOL_DRAW_MS = 160
const PISTOL_SPEED = 16
const PISTOL_RADIUS = 8
const KNIFE_SHOP_COST = KNIFE_COST
const OTIS_CODE = 'ötis'
const OTIS_DAMAGE = 100
const NERMIN_CODE = 'nermin'
const NERMIN_DAMAGE = 100
const NERMIN_SCALE = 1.55
const ALI_CODE = 'ali'
const GRON_BOSS_CODE = 'grön boss'
const MJOLK_CODE = 'mjölk'
const RED_COINS_CODE = '000'
const RED_COINS_CODE_REWARD = 500
const RPG_DAMAGE = 5 // Lv5=5, Lv6=6, Lv7=7, Lv8=8
const RPG_FIRE_DAMAGE = 1 // eld per sekund
const RPG_FIRE_TICK_MS = 1000
const RPG_FIRE_DURATION_MS = 3100 // 3 sek → 3 ticks à 1
const RPG_SPEED = 8
const RPG_RADIUS = 12
const RPG_PROXIMITY = 75
const RPG_BLAST = 110
const RPG_COOLDOWN = 1400
const RPG_DRAW_MS = 320
const SNIPER_DAMAGE = 50 // belöning från grön boss
const SNIPER_COOLDOWN = 6000
const SNIPER_DRAW_MS = 420
const SNIPER_SPEED = 24
const SNIPER_RADIUS = 7
const LIMB_COOLDOWN = 380
const LIMB_SWING_MS = 300
const LIMB_REACH = 78
const FOOT_COST = 10
const FOOT_DAMAGE = 3
const FOOT_COOLDOWN = 500
const FOOT_SWING_MS = 280
const FOOT_REACH = 64
const PING_COST = 10
const PING_DAMAGE = 2
const PING_COOLDOWN = 400
const PING_SPEED = 15
const PING_RADIUS = 12
const SPEAR_DAMAGE = 3
const SPEAR_COOLDOWN = 500
const SPEAR_SWING_MS = 420
// Visuell + hitbox: tip = r*(SPEAR_BASE + thrustPeak*sin), samma som draw
const SPEAR_BASE = 3.2
const SPEAR_THRUST = 0.55
const SPEAR_WIDTH = 78
const GOLD_BOMB_DAMAGE = 5
const GOLD_BOMB_COOLDOWN = 700
const GOLD_BOMB_FUSE_MS = 800
const BODYGUARD_DURATION_MS = 6700
const BODYGUARD_DAMAGE = 1
const BODYGUARD_TICK_MS = 1000
const BODYGUARD_SPEED = 11
const BODYGUARD_RADIUS = 18
const BODYGUARD_COST = 5
const SUS_COST = 25
const SUS_DAMAGE = 5
const SUS_TICK_MS = 1000
const SUS_DURATION_MS = 10000
const MOGGER_COST = 25
const MOGGER_DURATION_MS = 15000
const MOGGER_DAMAGE = 5
const MOGGER_TICK_MS = 1000
function rollKillCoins() {
  // 65%: 7, 34%: 8, 1%: 30
  const r = Math.random()
  if (r < 0.01) return 30
  if (r < 0.35) return 8
  return 7
}
const BOMB_SPEED = 18
const BOMB_DAMAGE = 5
const BOMB_COOLDOWN = 900
const BOMB_RADIUS = 14
const BOMB_FUSE_MS = 200
const BOMB_BLAST = 110
const BOMB_USES_PER_ROUND = 3
const RESPAWN_LIVES = 10
const RESPAWN_LIVES_BLUE = 10
const RESPAWN_COUNTDOWN_MS = 3000
const WIN_SCORE = 100
const BOSS_SCORE = 15
const SHOP_MILESTONE_START = 10
const SHOP_MILESTONE_STEP = 5
const SHOP_MILESTONE_MAX = 100
const WIN_COIN_REWARD = 999
const SECRET_CODE = '6655'
const SECRET_CODE_REWARD = 30
const SECRET_CODE_MAX_USES = 3
const BOSS_HP = 500
const BOSS_DAMAGE = 3
const BOSS_TOUCH_DAMAGE = 2
const BOSS_RESPAWNS = 5
const BOSS_BOMBS = 5
const BOSS_SCALE = 1.5
const BOSS_MAX_SPEED = 4.2
const BOSS_ACCEL = 0.32
const BOSS_KILL_REWARD = 50
const BOSS_SKIP_REWARD = 10
const BOSS_FLASK_COOLDOWN = 2000
const BOSS_FLASK_SPEED = 9
const BOSS_FLASK_RADIUS = 10
const BOSS_POOL_DURATION_MS = 4000
const BOSS_POOL_RADIUS = 348
const BOSS_POOL_DAMAGE = 5
const BOSS_POOL_TICK_MS = 500
const BOSS_COLOR = '#16a34a'
const BOSS_GLOW = '#86efac'
const EVENT_PISTOL_AT = 5
const EVENT_PISTOL_END = 10
const EVENT_PISTOL_DAMAGE = 2
const SCORE_WHEEL_AT = 10
const SCORE_REWARD_LOSE_AT = 14
const HAMMER_DAMAGE = 5
const HAMMER_COOLDOWN = 420
const HAMMER_SWING_MS = 300
const HAMMER_REACH = 78
const WALL_LEN = 78
const WALL_THICK = 18
const SCORE_WHEEL_SEGMENTS = [
  { id: 'nuke', label: 'NUKE', rarity: 'jackpot', color: '#ef4444' },
  { id: 'hammer', label: 'Hammare', rarity: 'better', color: '#a16207' },
  { id: 'coins25', label: '+25 🪙', rarity: 'good', color: '#eab308' },
  { id: 'lifeDrink', label: 'Livedryck', rarity: 'good', color: '#22c55e' },
  { id: 'sus', label: 'Sus', rarity: 'common', color: '#16a34a' },
  { id: 'mcShield', label: 'MC-sköld', rarity: 'common', color: '#0ea5e9' },
]

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
    let spectatorR = 22

    const particles = []
    const shocks = []
    const bombs = []
    const pingBalls = []
    const arrows = []
    const bodyguards = []
    const farts = []
    const policeUnits = []
    const leonUnits = []
    const footballs = []
    const poisonFlasks = []
    const poisonPools = []
    const walls = []
    let leonCallsRed = 0
    let leonCallsBlue = 0
    let eventPistolActive = false
    let eventPistolGranted = false
    let scoreWheelOpen = false
    let scoreWheelSide = null
    const scoreWheelHits = []
    let swAngle = 0
    let swSpinning = false
    let swSpinStart = 0
    let swSpinDuration = 3200
    let swFromAngle = 0
    let swToAngle = 0
    let swPending = null
    let swResultLabel = ''
    let swResultUntil = 0
    let swNeedSpin = false
    let pendingScoreWheel = null
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
    let pendingBossAfterShop = false
    let pendingWinAfterShop = null // 'red' | 'blue' | null
    let moggerUntil = 0
    let moggerNextTick = 0
    let moggerOwner = null // 'red' | 'blue' | null — köparen tar ingen skada
    let shopButton = { x: 0, y: 0, w: 120, h: 42 }
    const shopHits = []
    let weaponSelectOpen = true
    let weaponSelectPausedAt = performance.now()
    const weaponSelectHits = []
    let pickRed = null // 'bow' | 'sword' | null
    let pickBlue = null
    let codesOpen = false
    let codesButton = { x: 0, y: 0, w: 120, h: 42 }
    let codesInput = ''
    let codesMessage = ''
    let codesMessageUntil = 0
    let killstreakMessage = ''
    let killstreakMessageUntil = 0
    let killstreakOpen = false
    let killstreakSide = null // 'red' | 'blue'
    const killstreakHits = []
    let ksWheelAngle = 0
    let ksSpinning = false
    let ksSpinStart = 0
    let ksSpinDuration = 3400
    let ksFromAngle = 0
    let ksToAngle = 0
    let ksPendingPrize = null
    let ksResultLabel = ''
    let ksResultUntil = 0
    let codeUsesLeft = SECRET_CODE_MAX_USES
    let shopFree = false
    let otisPower = false
    let nerminPower = false
    let codesLockedExceptBoss = false
    let nokiaDialOpen = false
    let nokiaDialSide = null // 'red' | 'blue'
    let nokiaDialInput = ''
    let nokiaDialMessage = ''
    let nokiaDialMessageUntil = 0
    let nokiaDialButtonRed = { x: 0, y: 0, w: 88, h: 34 }
    let nokiaDialButtonBlue = { x: 0, y: 0, w: 88, h: 34 }
    const nokiaDialHits = []
    const inventory = {
      weaponRed: null, // 'bow' | 'sword' | 'knife' | 'foot' | 'nokia' | 'pistol' | 'rpg' | 'sniper'
      weaponBlue: null, // 'bow' | 'sword' | 'knife' | 'ping' | 'nokia' | 'pistol' | 'rpg' | 'sniper'
      startWeaponRed: null, // 'bow' | 'sword'
      startWeaponBlue: null,
      knifeOwnedRed: false,
      knifeOwnedBlue: false,
      swordLevelRed: 0, // 0=trä … 3=diamant (+ ev. högre dmg)
      swordLevelBlue: 0,
      bowLevelRed: 0, // pil-nivå 0..6 → dmg 2..8
      bowLevelBlue: 0,
      nokiaRed: false,
      nokiaBlue: false,
      pistolRed: false,
      pistolBlue: false,
      pistolUnlockedRed: false, // shop efter polis-kidnap
      pistolUnlockedBlue: false,
      pistolLevelRed: 0, // 0..9 · Lv5 RPG · Lv9 sniper
      pistolLevelBlue: 0,
      rpgRed: false,
      rpgBlue: false,
      sniperRed: false,
      sniperBlue: false,
      mcShieldRed: 0,
      mcShieldBlue: 0,
      killstreakKillsRed: 0,
      killstreakKillsBlue: 0,
      killstreakSpinsRed: 0,
      killstreakSpinsBlue: 0,
      footLevel: 0,
      pingLevel: 0,
      lifeDrinkRed: 0,
      lifeDrinkBlue: 0,
      susRed: 0,
      susBlue: 0,
      scoreRewardRed: null, // 'nuke' | 'hammer' | ...
      scoreRewardBlue: null,
      scoreWheelDoneRed: false,
      scoreWheelDoneBlue: false,
      nukeUsedRed: false,
      nukeUsedBlue: false,
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
        shieldKind: null, // 'basic' | 'mc'
        shieldUses: isPlayer ? SHIELD_USES_PER_ROUND : 0,
        bombReadyAt: 0,
        bombUses: 0,
        knifeEquipped: false,
        knifeReadyAt: 0,
        knifeSwingUntil: 0,
        knifeAngle: 0,
        spearEquipped: false,
        spearReadyAt: 0,
        spearSwingUntil: 0,
        spearAngle: 0,
        spearDidHit: false,
        meleeDidHit: false,
        eliminated: false,
        respawnAt: 0,
        burnUntil: 0,
        burnNextTick: 0,
        burnOwner: null,
        burnDamage: NOKIA_FIRE_DAMAGE,
        burnTickMs: NOKIA_FIRE_TICK_MS,
        burnLeaveOne: false,
        kidnapped: false,
        kidnapUntil: 0,
        flaskReadyAt: 0,
      }
    }

    function resetFighters() {
      fighters.length = 0
      bombs.length = 0
      pingBalls.length = 0
      arrows.length = 0
      bodyguards.length = 0
      farts.length = 0
      policeUnits.length = 0
      leonUnits.length = 0
      footballs.length = 0
      fighters.push(
        makeFighter(cx - arenaR * 0.25, cy, 0, 0, 0, true),
        makeFighter(cx + arenaR * 0.25, cy, 0, 0, 1, false),
      )
      // Blue is also human-controlled
      fighters[1].control = 'arrows'
      fighters[1].bombUses = 0
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
      arenaR = Math.min(width, height) * 0.78
      ballR = Math.max(36, Math.min(58, arenaR * 0.16))
      spectatorR = Math.max(16, Math.min(28, arenaR * 0.07))
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

    function throwBomb(thrower, options = {}) {
      if (!thrower || thrower.eliminated || thrower.lives <= 0) return
      const now = performance.now()
      const isGold = options.gold === true

      if (now < thrower.bombReadyAt) return
      if (isGold) {
        return
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
          if (isShielded(f, now)) continue
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
          if (isShielded(f, now)) continue
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
      if (nerminPower && ball && !ball.isBoss) return ballR * NERMIN_SCALE
      return ballR
    }

    function isShielded(ball, now = performance.now()) {
      return !!(ball && !ball.eliminated && now < (ball.shieldUntil || 0))
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
      if (ball.kidnapped) {
        ball.vx = 0
        ball.vy = 0
        ball.squash *= 0.86
        return
      }

      const accel = 0.52 * dt
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
        const max = 7.5
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
      resolveWallCollisions(ball)
      keepInArena(ball)
      ball.squash *= 0.86

      if (ball.knifeSwingUntil && now >= ball.knifeSwingUntil) {
        ball.knifeSwingUntil = 0
        ball.knifeEquipped = false
        ball.meleeDidHit = false
      } else if (
        ball.knifeSwingUntil &&
        now < ball.knifeSwingUntil &&
        !ball.meleeDidHit &&
        !ball.eliminated &&
        !ball.isBoss
      ) {
        const mk = ball.meleeKind
        if (
          mk === 'knife' ||
          mk === 'sword' ||
          mk === 'hammer' ||
          mk === 'foot' ||
          mk === 'limb'
        ) {
          updateMeleeHit(ball, now)
        }
      }
      if (
        !ball.eliminated &&
        !ball.isBoss &&
        getSideWeapon(ball) === 'ping'
      ) {
        ball.knifeAngle = aimAtOpponent(ball)
        ball.face = Math.cos(ball.knifeAngle) >= 0 ? 1 : -1
        ball.meleeKind = 'ping'
      }
      if (ball.spearSwingUntil && now >= ball.spearSwingUntil) {
        ball.spearSwingUntil = 0
        ball.spearEquipped = false
        ball.spearDidHit = false
      } else if (
        ball.spearSwingUntil &&
        now < ball.spearSwingUntil &&
        !ball.spearDidHit
      ) {
        updateSpearHit(ball, now)
      }

      if (ball.isBoss && !ball.eliminated) tryBossFlaskThrow(ball, now)
    }

    function randomArenaGroundPoint() {
      const ang = Math.random() * Math.PI * 2
      const rad = Math.random() * Math.max(40, arenaR * 0.72)
      return { x: cx + Math.cos(ang) * rad, y: cy + Math.sin(ang) * rad }
    }

    function tryBossFlaskThrow(boss, now = performance.now()) {
      if (!boss || !boss.isBoss || boss.eliminated) return
      if (now < (boss.flaskReadyAt || 0)) return
      boss.flaskReadyAt = now + BOSS_FLASK_COOLDOWN
      const target = randomArenaGroundPoint()
      const dx = target.x - boss.x
      const dy = target.y - boss.y
      const dist = Math.hypot(dx, dy) || 1
      poisonFlasks.push({
        x: boss.x,
        y: boss.y,
        vx: (dx / dist) * BOSS_FLASK_SPEED,
        vy: (dy / dist) * BOSS_FLASK_SPEED,
        r: BOSS_FLASK_RADIUS,
        life: 2.8,
        tx: target.x,
        ty: target.y,
      })
      boss.squash = Math.max(boss.squash, 0.25)
    }

    function landPoisonFlask(f) {
      poisonPools.push({
        x: f.tx ?? f.x,
        y: f.ty ?? f.y,
        r: BOSS_POOL_RADIUS,
        expiresAt: performance.now() + BOSS_POOL_DURATION_MS,
        nextTick: performance.now() + BOSS_POOL_TICK_MS,
      })
      spawnBurst(f.tx ?? f.x, f.ty ?? f.y, 0.9)
    }

    function updatePoisonFlasks(dt) {
      for (let i = poisonFlasks.length - 1; i >= 0; i -= 1) {
        const f = poisonFlasks[i]
        f.x += f.vx * dt
        f.y += f.vy * dt
        f.life -= dt / 60
        const toTarget = Math.hypot(f.tx - f.x, f.ty - f.y)
        if (toTarget < 14 || f.life <= 0) {
          landPoisonFlask(f)
          poisonFlasks.splice(i, 1)
        }
      }
    }

    function updatePoisonPools(dt, now = performance.now()) {
      for (let i = poisonPools.length - 1; i >= 0; i -= 1) {
        const p = poisonPools[i]
        if (now >= p.expiresAt) {
          poisonPools.splice(i, 1)
          continue
        }
        if (now < p.nextTick) continue
        p.nextTick = now + BOSS_POOL_TICK_MS
        for (let j = 0; j < fighters.length; j += 1) {
          const f = fighters[j]
          if (!f || f.eliminated || f.isBoss || f.lives <= 0) continue
          if (Math.hypot(f.x - p.x, f.y - p.y) > p.r + getRadius(f)) continue
          if (isShielded(f, now)) continue
          f.lives -= BOSS_POOL_DAMAGE
          f.squash = Math.max(f.squash, 0.35)
        }
      }
    }

    function drawPoisonFlasks() {
      for (let i = 0; i < poisonFlasks.length; i += 1) {
        const f = poisonFlasks[i]
        ctx.save()
        ctx.translate(f.x, f.y)
        ctx.rotate(Math.atan2(f.vy, f.vx))
        ctx.fillStyle = '#22c55e'
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(-f.r * 0.7, -f.r * 1.2, f.r * 1.4, f.r * 2.2, 4)
        } else {
          ctx.rect(-f.r * 0.7, -f.r * 1.2, f.r * 1.4, f.r * 2.2)
        }
        ctx.fill()
        ctx.fillStyle = '#bbf7d0'
        ctx.beginPath()
        ctx.arc(0, -f.r * 1.05, f.r * 0.35, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    function drawPoisonPools(now = performance.now()) {
      for (let i = 0; i < poisonPools.length; i += 1) {
        const p = poisonPools[i]
        const life = Math.max(0, (p.expiresAt - now) / BOSS_POOL_DURATION_MS)
        const pulse = 1 + Math.sin(now * 0.01 + p.x) * 0.04
        ctx.save()
        ctx.fillStyle = `rgba(34, 197, 94, ${0.22 + life * 0.28})`
        ctx.beginPath()
        ctx.ellipse(p.x, p.y, p.r * pulse, p.r * 0.72 * pulse, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = `rgba(187, 247, 208, ${0.35 + life * 0.4})`
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.restore()
      }
    }

    function distPointToSegment(px, py, ax, ay, bx, by) {
      const abx = bx - ax
      const aby = by - ay
      const apx = px - ax
      const apy = py - ay
      const ab2 = abx * abx + aby * aby || 1
      let t = (apx * abx + apy * aby) / ab2
      t = Math.max(0, Math.min(1, t))
      return Math.hypot(px - (ax + abx * t), py - (ay + aby * t))
    }

    function spearSwingProgress(attacker, now = performance.now()) {
      const left = Math.max(0, (attacker.spearSwingUntil || 0) - now)
      return 1 - left / SPEAR_SWING_MS
    }

    function spearTipLength(attacker, now = performance.now()) {
      const r = getRadius(attacker)
      const swingT = spearSwingProgress(attacker, now)
      const thrust = Math.sin(Math.max(0, Math.min(1, swingT)) * Math.PI) * r * SPEAR_THRUST
      return r * SPEAR_BASE + thrust
    }

    function spearHitsTarget(attacker, target, angle, now = performance.now()) {
      const ar = getRadius(attacker)
      const tr = getRadius(target)
      const nx = Math.cos(angle)
      const ny = Math.sin(angle)
      const tipLen = spearTipLength(attacker, now)
      const hitPad = SPEAR_WIDTH + tr * 0.7 + MELEE_HIT_PAD

      // Skaft från bollens framkant till spets (samma som draw)
      const ax = attacker.x + nx * (ar * 0.35)
      const ay = attacker.y + ny * (ar * 0.35)
      const bx = attacker.x + nx * tipLen
      const by = attacker.y + ny * tipLen

      const toTx = target.x - attacker.x
      const toTy = target.y - attacker.y
      const along = toTx * nx + toTy * ny
      if (along < -tr * 0.6) return false
      if (along > tipLen + tr + hitPad) return false

      const shaftDist = distPointToSegment(target.x, target.y, ax, ay, bx, by)
      if (shaftDist <= hitPad) return true
      return Math.hypot(target.x - bx, target.y - by) <= hitPad
    }

    function applySpearDamage(attacker, target, angle, now) {
      if (target.isBoss) {
        target.lives -= SPEAR_DAMAGE
        addBossDamage(attacker, SPEAR_DAMAGE)
      } else {
        target.lives -= SPEAR_DAMAGE
      }
      target.squash = 0.55
      target.vx += Math.cos(angle) * 8
      target.vy += Math.sin(angle) * 8
      spawnBurst(target.x, target.y, 1.4)
      shake = Math.min(16, shake + 6)
      flash = Math.min(0.4, flash + 0.15)
      triggerCheer()
      attacker.spearDidHit = true
    }

    function updateSpearHit(attacker, now) {
      if (!attacker || attacker.eliminated || attacker.spearDidHit) return
      const candidates = fighters.filter(
        (f) => f !== attacker && !f.eliminated && (bossMode ? f.isBoss : !f.isBoss),
      )
      // Lås om lätt mot närmaste mål under svingen så träffen följer rörelse
      let angle = attacker.spearAngle || 0
      let best = null
      let bestDist = Infinity
      for (let i = 0; i < candidates.length; i += 1) {
        const t = candidates[i]
        const d = Math.hypot(t.x - attacker.x, t.y - attacker.y)
        if (d < bestDist) {
          bestDist = d
          best = t
        }
      }
      if (best) {
        const aim = Math.atan2(best.y - attacker.y, best.x - attacker.x)
        let delta = aim - angle
        while (delta > Math.PI) delta -= Math.PI * 2
        while (delta < -Math.PI) delta += Math.PI * 2
        angle += Math.max(-0.35, Math.min(0.35, delta))
        attacker.spearAngle = angle
      }
      for (let i = 0; i < candidates.length; i += 1) {
        const target = candidates[i]
        if (spearHitsTarget(attacker, target, angle, now)) {
          applySpearDamage(attacker, target, angle, now)
          return
        }
      }
    }

    function getSideWeapon(attacker) {
      if (!attacker) return 'bow'
      if (eventPistolActive) return 'pistol'
      const side = isRedSide(attacker) ? 'red' : 'blue'
      const reward = side === 'red' ? inventory.scoreRewardRed : inventory.scoreRewardBlue
      if (reward === 'hammer') return 'hammer'
      if (attacker.player || attacker.control === 'wasd' || attacker._bossSide === 'red') {
        return inventory.weaponRed || 'bow'
      }
      return inventory.weaponBlue || 'bow'
    }

    function isRedSide(attacker) {
      return !!(attacker && (attacker.player || attacker.control === 'wasd' || attacker._bossSide === 'red'))
    }

    function materialTierLevel(side, kind) {
      if (kind === 'sword') {
        return side === 'red' ? inventory.swordLevelRed : inventory.swordLevelBlue
      }
      return side === 'red' ? inventory.bowLevelRed : inventory.bowLevelBlue
    }

    function materialTierName(level) {
      const idx = Math.max(0, Math.min(MATERIAL_TIERS.length - 1, level))
      return MATERIAL_TIERS[idx]
    }

    function materialColorsFor(level) {
      return MATERIAL_COLORS[materialTierName(level)] || MATERIAL_COLORS.wood
    }

    function materialDamage(base, level) {
      return base + Math.max(0, level)
    }

    function swordDamageFor(attacker) {
      if (nerminPower || otisPower) return NERMIN_DAMAGE
      const side = isRedSide(attacker) ? 'red' : 'blue'
      return materialDamage(SWORD_DAMAGE, materialTierLevel(side, 'sword'))
    }

    function bowDamageFor(attacker) {
      if (nerminPower || otisPower) return NERMIN_DAMAGE
      const side = isRedSide(attacker) ? 'red' : 'blue'
      const weapon = getSideWeapon(attacker)
      if (weapon === 'nokia') return NOKIA_HIT_DAMAGE
      return materialDamage(BOW_DAMAGE, materialTierLevel(side, 'bow'))
    }

    function weaponUpgradeCost(baseCost, level) {
      // level 0 → 5, level 1 → 10, level 2 → 20, level 3 → 40 …
      return baseCost * 2 ** Math.max(0, level)
    }

    function linearWeaponUpgradeCost(level) {
      // Kniv/svärd & pilbåge: 20 → 40 → 60 …
      return 20 * (Math.max(0, level) + 1)
    }

    function canUpgradeMaterial(level) {
      return level < MAX_MATERIAL_LEVEL
    }

    function canUpgradeBow(level) {
      return level < BOW_MAX_LEVEL
    }

    function nextMaterialLabel(level) {
      if (!canUpgradeMaterial(level)) return 'MAX'
      return MATERIAL_LABELS[materialTierName(level + 1)]
    }

    function materialUpgradeTitle(kind, level) {
      const nowLabel = MATERIAL_LABELS[materialTierName(level)]
      const prefix = kind === 'sword' ? 'Svärd' : 'Pil'
      if (kind === 'bow') {
        const dmg = BOW_DAMAGE + Math.max(0, level)
        if (!canUpgradeBow(level)) return `${prefix} ${dmg} dmg MAX`
        return `${prefix} ${dmg}→${dmg + 1} dmg`
      }
      if (!canUpgradeMaterial(level)) return `${prefix} ${nowLabel} MAX`
      if (level >= MATERIAL_TIERS.length - 1) return `${prefix} ${nowLabel} +1 dmg`
      return `${prefix} ${nowLabel}→${nextMaterialLabel(level)}`
    }

    function footDamage() {
      if (inventory.footLevel <= 0) return FOOT_DAMAGE
      return FOOT_DAMAGE + (inventory.footLevel - 1)
    }

    function pingDamage() {
      if (inventory.pingLevel <= 0) return PING_DAMAGE
      return PING_DAMAGE + (inventory.pingLevel - 1)
    }

    function meleeStats(kind, attacker) {
      if (kind === 'limb' || (nerminPower && (kind === 'sword' || kind === 'knife' || kind === 'foot'))) {
        return {
          damage: NERMIN_DAMAGE,
          cooldown: LIMB_COOLDOWN,
          swingMs: LIMB_SWING_MS,
          reach: LIMB_REACH,
        }
      }
      if (kind === 'foot') {
        return {
          damage: nerminPower ? NERMIN_DAMAGE : footDamage(),
          cooldown: FOOT_COOLDOWN,
          swingMs: FOOT_SWING_MS,
          reach: FOOT_REACH,
        }
      }
      if (kind === 'sword') {
        return {
          damage: swordDamageFor(attacker),
          cooldown: SWORD_COOLDOWN,
          swingMs: SWORD_SWING_MS,
          reach: SWORD_REACH,
        }
      }
      if (kind === 'hammer') {
        return {
          damage: HAMMER_DAMAGE,
          cooldown: HAMMER_COOLDOWN,
          swingMs: HAMMER_SWING_MS,
          reach: HAMMER_REACH,
        }
      }
      return {
        damage: nerminPower ? NERMIN_DAMAGE : KNIFE_DAMAGE,
        cooldown: KNIFE_COOLDOWN,
        swingMs: KNIFE_SWING_MS,
        reach: KNIFE_REACH,
      }
    }

    function aimAtOpponent(attacker) {
      const target = bossMode
        ? fighters.find((f) => f.isBoss && !f.eliminated)
        : fighters.find((f) => f !== attacker && !f.eliminated)
      let angle = (attacker.face || 1) > 0 ? 0 : Math.PI
      if (target) {
        angle = Math.atan2(target.y - attacker.y, target.x - attacker.x)
      } else if (attacker.vx !== 0 || attacker.vy !== 0) {
        angle = Math.atan2(attacker.vy, attacker.vx)
      }
      return angle
    }

    function tryReturnPingBall(attacker, kind) {
      if (!attacker || attacker.eliminated) return false
      const reachExtra =
        kind === 'foot'
          ? FOOT_REACH + 28
          : kind === 'ping'
            ? 60
            : kind === 'sword' || kind === 'hammer' || kind === 'knife' || kind === 'limb'
              ? 48
              : 0
      if (!reachExtra) return false
      const ar = getRadius(attacker)
      let best = null
      let bestD = Infinity
      for (let i = 0; i < pingBalls.length; i += 1) {
        const b = pingBalls[i]
        const d = Math.hypot(b.x - attacker.x, b.y - attacker.y)
        if (d < ar + b.r + reachExtra && d < bestD) {
          best = b
          bestD = d
        }
      }
      if (!best) return false

      const angle = aimAtOpponent(attacker)
      const speed = PING_SPEED * (kind === 'foot' ? 1.25 : 1.15)
      best.vx = Math.cos(angle) * speed + attacker.vx * 0.25
      best.vy = Math.sin(angle) * speed + attacker.vy * 0.25
      best.owner = attacker
      best.life = 2.5
      best.damage = kind === 'foot' ? footDamage() : pingDamage()
      best.spin += 0.8
      spawnBurst(best.x, best.y, kind === 'foot' ? 1.3 : 0.9)
      shake = Math.min(14, shake + (kind === 'foot' ? 6 : 3))
      return true
    }

    function shootPingPong(attacker) {
      if (!attacker || attacker.eliminated || attacker.lives <= 0) return
      if (attacker.control !== 'arrows') return
      const now = performance.now()
      if (now < (attacker.knifeReadyAt || 0)) return

      const angle = aimAtOpponent(attacker)
      const nx = Math.cos(angle)
      const ny = Math.sin(angle)
      const dmg = pingDamage()
      attacker.knifeReadyAt = now + PING_COOLDOWN
      attacker.knifeEquipped = true
      attacker.knifeSwingUntil = now + 180
      attacker.meleeKind = 'ping'
      attacker.knifeAngle = angle
      attacker.squash = 0.35
      attacker.face = nx >= 0 ? 1 : -1

      // Returnera boll i luften istället för att skjuta en ny
      if (tryReturnPingBall(attacker, 'ping')) return

      pingBalls.push({
        x: attacker.x + nx * (getRadius(attacker) + PING_RADIUS),
        y: attacker.y + ny * (getRadius(attacker) + PING_RADIUS),
        vx: nx * PING_SPEED + attacker.vx * 0.25,
        vy: ny * PING_SPEED + attacker.vy * 0.25,
        r: PING_RADIUS,
        life: 2.5,
        spin: 0,
        owner: attacker,
        damage: dmg,
      })
      spawnBurst(attacker.x + nx * getRadius(attacker), attacker.y + ny * getRadius(attacker), 0.4)
    }

    function shootBow(attacker) {
      if (!attacker || attacker.eliminated || attacker.lives <= 0) return
      if (attacker.control !== 'arrows' && attacker.control !== 'wasd') return
      const now = performance.now()
      if (now < (attacker.knifeReadyAt || 0)) return

      const angle = aimAtOpponent(attacker)
      const nx = Math.cos(angle)
      const ny = Math.sin(angle)
      const side = isRedSide(attacker) ? 'red' : 'blue'
      const level = materialTierLevel(side, 'bow')
      const weapon = getSideWeapon(attacker)
      const isNokia = weapon === 'nokia'
      const dmg = isNokia ? NOKIA_HIT_DAMAGE : bowDamageFor(attacker)
      const speed = isNokia ? NOKIA_SPEED : BOW_ARROW_SPEED
      const ar = isNokia ? NOKIA_RADIUS : BOW_ARROW_RADIUS

      attacker.knifeReadyAt = now + BOW_COOLDOWN
      attacker.knifeEquipped = true
      attacker.knifeSwingUntil = now + BOW_DRAW_MS
      attacker.meleeKind = isNokia ? 'nokia' : 'bow'
      attacker.knifeAngle = angle
      attacker.squash = 0.3
      attacker.face = nx >= 0 ? 1 : -1

      arrows.push({
        x: attacker.x + nx * (getRadius(attacker) + ar + 4),
        y: attacker.y + ny * (getRadius(attacker) + ar + 4),
        vx: nx * speed + attacker.vx * 0.2,
        vy: ny * speed + attacker.vy * 0.2,
        r: ar,
        angle,
        life: 2.8,
        owner: attacker,
        damage: dmg,
        level,
        nokia: isNokia,
      })
      spawnBurst(attacker.x + nx * getRadius(attacker), attacker.y + ny * getRadius(attacker), 0.35)
    }

    function pistolLevelFor(attacker) {
      const side = isRedSide(attacker) ? 'red' : 'blue'
      return side === 'red' ? inventory.pistolLevelRed : inventory.pistolLevelBlue
    }

    function pistolFormForLevel(level) {
      if (level >= PISTOL_SNIPER_LEVEL) return 'sniper'
      if (level >= PISTOL_RPG_LEVEL) return 'rpg'
      return 'pistol'
    }

    function pistolDamageFor(attacker) {
      const level = Math.min(4, Math.max(0, pistolLevelFor(attacker)))
      return PISTOL_DAMAGE + level
    }

    function rpgDamageForLevel(level) {
      // Lv5→5 … Lv8→8
      return Math.max(5, Math.min(8, level))
    }

    function canUpgradePistol(level) {
      return level < PISTOL_MAX_LEVEL
    }

    function pistolUpgradeCost(level) {
      // Dubbelt mot vanlig uppgraderingspris
      return weaponUpgradeCost(UPGRADE_BASE_COST, level) * 2
    }

    function equipPistolForm(side) {
      const level = side === 'red' ? inventory.pistolLevelRed : inventory.pistolLevelBlue
      const form = pistolFormForLevel(level)
      if (side === 'red') {
        inventory.rpgRed = level >= PISTOL_RPG_LEVEL
        inventory.sniperRed = level >= PISTOL_SNIPER_LEVEL
        inventory.weaponRed = form
      } else {
        inventory.rpgBlue = level >= PISTOL_RPG_LEVEL
        inventory.sniperBlue = level >= PISTOL_SNIPER_LEVEL
        inventory.weaponBlue = form
      }
    }

    function pistolShopPreview(level) {
      if (level >= PISTOL_SNIPER_LEVEL) {
        return {
          title: 'Sniper',
          desc: `${SNIPER_DAMAGE} dmg · ${SNIPER_COOLDOWN / 1000}s laddning`,
          dmg: SNIPER_DAMAGE,
        }
      }
      if (level >= PISTOL_RPG_LEVEL) {
        const dmg = rpgDamageForLevel(level)
        return {
          title: `RPG Lv${level}`,
          desc: `${dmg} träff + eld ${RPG_FIRE_DAMAGE}/s · 3s`,
          dmg,
        }
      }
      const dmg = PISTOL_DAMAGE + Math.min(4, level)
      return {
        title: level >= 4 ? `Pistol+ Lv${level}` : `Pistol Lv${level}`,
        desc: `${dmg} dmg · snabb`,
        dmg,
      }
    }

    function nextPistolUpgradeLabel(level) {
      const next = level + 1
      if (next === PISTOL_RPG_LEVEL) {
        return `→ RPG ${rpgDamageForLevel(next)} dmg + eld`
      }
      if (next === PISTOL_SNIPER_LEVEL) {
        return `→ Sniper ${SNIPER_DAMAGE} dmg · ${SNIPER_COOLDOWN / 1000}s`
      }
      if (next > PISTOL_RPG_LEVEL && next < PISTOL_SNIPER_LEVEL) {
        return `RPG ${rpgDamageForLevel(level)}→${rpgDamageForLevel(next)} träff`
      }
      if (next <= 3) {
        return `Pistol ${PISTOL_DAMAGE + level}→${PISTOL_DAMAGE + next} dmg`
      }
      if (next === 4) {
        return `Pistol+ ${PISTOL_DAMAGE + 4} dmg · nytt utseende`
      }
      return `Uppgradera`
    }

    function shootPistol(attacker) {
      if (!attacker || attacker.eliminated || attacker.lives <= 0) return
      if (attacker.control !== 'arrows' && attacker.control !== 'wasd') return
      const now = performance.now()
      if (now < (attacker.knifeReadyAt || 0)) return

      const angle = aimAtOpponent(attacker)
      const nx = Math.cos(angle)
      const ny = Math.sin(angle)
      const event = eventPistolActive
      const level = event ? 0 : pistolLevelFor(attacker)
      const dmg = event ? EVENT_PISTOL_DAMAGE : pistolDamageFor(attacker)

      attacker.knifeReadyAt = event ? now : now + PISTOL_COOLDOWN
      attacker.knifeEquipped = true
      attacker.knifeSwingUntil = now + PISTOL_DRAW_MS
      attacker.meleeKind = 'pistol'
      attacker.knifeAngle = angle
      attacker.knifeLevel = level
      attacker.squash = 0.25
      attacker.face = nx >= 0 ? 1 : -1

      arrows.push({
        x: attacker.x + nx * (getRadius(attacker) + PISTOL_RADIUS + 6),
        y: attacker.y + ny * (getRadius(attacker) + PISTOL_RADIUS + 6),
        vx: nx * PISTOL_SPEED + attacker.vx * 0.15,
        vy: ny * PISTOL_SPEED + attacker.vy * 0.15,
        r: PISTOL_RADIUS,
        angle,
        life: event ? 3.2 : 2.2,
        owner: attacker,
        damage: dmg,
        level,
        pistol: true,
        homing: event,
      })
      spawnBurst(attacker.x + nx * getRadius(attacker), attacker.y + ny * getRadius(attacker), 0.25)
    }

    function spawnFireExplosion(x, y) {
      const fireColors = [
        [255, 60, 20],
        [255, 120, 30],
        [255, 180, 40],
        [255, 230, 80],
        [180, 30, 10],
      ]
      for (let i = 0; i < 42; i += 1) {
        const angle = Math.random() * Math.PI * 2
        const speed = 3 + Math.random() * 14
        const c = fireColors[i % fireColors.length]
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2 - Math.random() * 4,
          life: 1,
          decay: 0.018 + Math.random() * 0.03,
          size: 4 + Math.random() * 9,
          color: c,
          fire: true,
        })
      }
      for (let ring = 0; ring < 3; ring += 1) {
        shocks.push({
          x,
          y,
          r: 8 + ring * 6,
          max: 70 + ring * 45,
          life: 1 - ring * 0.12,
          color: ring === 0 ? [255, 220, 80] : ring === 1 ? [255, 120, 30] : [255, 50, 10],
        })
      }
    }

    function applyBurn(target, owner, now, opts = {}) {
      if (!target || target.eliminated) return
      const duration = opts.durationMs ?? NOKIA_FIRE_DURATION_MS
      const tickMs = opts.tickMs ?? NOKIA_FIRE_TICK_MS
      const damage = opts.damage ?? NOKIA_FIRE_DAMAGE
      target.burnUntil = now + duration
      target.burnNextTick = now + tickMs
      target.burnOwner = owner
      target.burnDamage = damage
      target.burnTickMs = tickMs
      target.burnLeaveOne = !!opts.leaveAtLeast
    }

    function explodeNokia(a) {
      const now = performance.now()
      spawnFireExplosion(a.x, a.y)
      shake = Math.min(24, shake + 14)
      flash = Math.min(0.7, flash + 0.4)
      // Första träffen: 5 skada, sedan brinner spelaren (inte marken)
      const hitDmg = NOKIA_HIT_DAMAGE
      for (let j = 0; j < fighters.length; j += 1) {
        const f = fighters[j]
        if (f === a.owner || f.eliminated) continue
        if (bossMode && !f.isBoss) continue
        const d = Math.hypot(f.x - a.x, f.y - a.y)
        if (d > NOKIA_BLAST + getRadius(f)) continue
        if (!isShielded(f, now)) {
          f.lives -= hitDmg
          if (f.isBoss) addBossDamage(a.owner, hitDmg)
        }
        applyBurn(f, a.owner, now, { leaveAtLeast: 1 })
        f.squash = 0.75
        const ang = Math.atan2(f.y - a.y, f.x - a.x)
        f.vx += Math.cos(ang) * 12
        f.vy += Math.sin(ang) * 12
      }
    }

    function updateBurns(dt, now) {
      for (let i = 0; i < fighters.length; i += 1) {
        const f = fighters[i]
        if (!f.burnUntil || f.eliminated || f.lives <= 0) continue
        if (now >= f.burnUntil) {
          f.burnUntil = 0
          f.burnNextTick = 0
          f.burnOwner = null
          f.burnDamage = NOKIA_FIRE_DAMAGE
          f.burnTickMs = NOKIA_FIRE_TICK_MS
          f.burnLeaveOne = false
          continue
        }
        // Eldpartiklar på spelaren
        if (Math.random() < 0.45) {
          particles.push({
            x: f.x + (Math.random() - 0.5) * getRadius(f),
            y: f.y + (Math.random() - 0.5) * getRadius(f),
            vx: (Math.random() - 0.5) * 1.2,
            vy: -2 - Math.random() * 3,
            life: 0.8,
            decay: 0.045,
            size: 3 + Math.random() * 5,
            color: Math.random() > 0.5 ? [255, 140, 30] : [255, 60, 15],
            fire: true,
          })
        }
        if (now < f.burnNextTick) continue
        const tickMs = f.burnTickMs || NOKIA_FIRE_TICK_MS
        const dmg = f.burnDamage || NOKIA_FIRE_DAMAGE
        f.burnNextTick = now + tickMs
        if (!isShielded(f, now)) {
          if (f.burnLeaveOne) {
            if (f.lives <= 1) continue
            const applied = Math.min(dmg, f.lives - 1)
            f.lives -= applied
            if (f.isBoss) addBossDamage(f.burnOwner, applied)
          } else {
            f.lives -= dmg
            if (f.isBoss) addBossDamage(f.burnOwner, dmg)
          }
        }
        f.squash = Math.max(f.squash, 0.3)
      }
    }

    function shootRpg(attacker) {
      if (!attacker || attacker.eliminated || attacker.lives <= 0) return
      if (attacker.control !== 'arrows' && attacker.control !== 'wasd') return
      const now = performance.now()
      if (now < (attacker.knifeReadyAt || 0)) return

      const angle = aimAtOpponent(attacker)
      const nx = Math.cos(angle)
      const ny = Math.sin(angle)
      const level = Math.max(PISTOL_RPG_LEVEL, pistolLevelFor(attacker))
      const dmg = rpgDamageForLevel(level)

      attacker.knifeReadyAt = now + RPG_COOLDOWN
      attacker.knifeEquipped = true
      attacker.knifeSwingUntil = now + RPG_DRAW_MS
      attacker.meleeKind = 'rpg'
      attacker.knifeAngle = angle
      attacker.knifeLevel = level
      attacker.squash = 0.35
      attacker.face = nx >= 0 ? 1 : -1

      arrows.push({
        x: attacker.x + nx * (getRadius(attacker) + RPG_RADIUS + 6),
        y: attacker.y + ny * (getRadius(attacker) + RPG_RADIUS + 6),
        vx: nx * RPG_SPEED + attacker.vx * 0.15,
        vy: ny * RPG_SPEED + attacker.vy * 0.15,
        r: RPG_RADIUS,
        angle,
        life: 3.2,
        owner: attacker,
        damage: dmg,
        level,
        rpg: true,
      })
      spawnBurst(attacker.x + nx * getRadius(attacker), attacker.y + ny * getRadius(attacker), 0.5)
    }

    function shootSniper(attacker) {
      if (!attacker || attacker.eliminated || attacker.lives <= 0) return
      if (attacker.control !== 'arrows' && attacker.control !== 'wasd') return
      const now = performance.now()
      if (now < (attacker.knifeReadyAt || 0)) return

      const angle = aimAtOpponent(attacker)
      const nx = Math.cos(angle)
      const ny = Math.sin(angle)

      attacker.knifeReadyAt = now + SNIPER_COOLDOWN
      attacker.knifeEquipped = true
      attacker.knifeSwingUntil = now + SNIPER_DRAW_MS
      attacker.meleeKind = 'sniper'
      attacker.knifeAngle = angle
      attacker.knifeLevel = PISTOL_SNIPER_LEVEL
      attacker.squash = 0.3
      attacker.face = nx >= 0 ? 1 : -1

      arrows.push({
        x: attacker.x + nx * (getRadius(attacker) + SNIPER_RADIUS + 8),
        y: attacker.y + ny * (getRadius(attacker) + SNIPER_RADIUS + 8),
        vx: nx * SNIPER_SPEED + attacker.vx * 0.1,
        vy: ny * SNIPER_SPEED + attacker.vy * 0.1,
        r: SNIPER_RADIUS,
        angle,
        life: 3.5,
        owner: attacker,
        damage: SNIPER_DAMAGE,
        level: PISTOL_SNIPER_LEVEL,
        sniper: true,
      })
      spawnBurst(attacker.x + nx * getRadius(attacker), attacker.y + ny * getRadius(attacker), 0.45)
      shake = Math.min(10, shake + 4)
    }

    function explodeRpg(a) {
      const now = performance.now()
      spawnFireExplosion(a.x, a.y)
      spawnBurst(a.x, a.y, 3)
      shake = Math.min(26, shake + 16)
      flash = Math.min(0.75, flash + 0.45)
      const hitDmg = a.damage || RPG_DAMAGE
      for (let j = 0; j < fighters.length; j += 1) {
        const f = fighters[j]
        if (f === a.owner || f.eliminated) continue
        if (bossMode && !f.isBoss) continue
        const d = Math.hypot(f.x - a.x, f.y - a.y)
        if (d > RPG_BLAST + getRadius(f)) continue
        if (!isShielded(f, now)) {
          f.lives -= hitDmg
          if (f.isBoss) addBossDamage(a.owner, hitDmg)
        }
        // Eld: 1 skada / sekund i 3 sekunder
        applyBurn(f, a.owner, now, {
          damage: RPG_FIRE_DAMAGE,
          tickMs: RPG_FIRE_TICK_MS,
          durationMs: RPG_FIRE_DURATION_MS,
        })
        f.squash = 0.8
        const ang = Math.atan2(f.y - a.y, f.x - a.x)
        f.vx += Math.cos(ang) * 14
        f.vy += Math.sin(ang) * 14
      }
    }

    function openNokiaDial(side) {
      if (nokiaDialOpen || shopOpen || codesOpen || weaponSelectOpen || winner) return
      if (side === 'red' && !inventory.nokiaRed) return
      if (side === 'blue' && !inventory.nokiaBlue) return
      clearKeys()
      nokiaDialSide = side
      nokiaDialInput = ''
      nokiaDialMessage = ''
      nokiaDialOpen = true
    }

    function closeNokiaDial() {
      nokiaDialOpen = false
      nokiaDialSide = null
      nokiaDialInput = ''
    }

    function spawnPolice(ownerSide) {
      const owner =
        ownerSide === 'red'
          ? fighters.find((f) => f.player && !f.eliminated)
          : fighters.find((f) => f.control === 'arrows' && !f.eliminated)
      const target = bossMode
        ? fighters.find((f) => f.isBoss && !f.eliminated)
        : fighters.find((f) => f !== owner && !f.eliminated && !f.isBoss)
      if (!owner || !target) {
        nokiaDialMessage = 'Ingen att kidnappa'
        nokiaDialMessageUntil = performance.now() + 2000
        return false
      }
      const ang = Math.random() * Math.PI * 2
      policeUnits.push({
        x: cx + Math.cos(ang) * (arenaR * 0.85),
        y: cy + Math.sin(ang) * (arenaR * 0.85),
        vx: 0,
        vy: 0,
        r: POLICE_RADIUS,
        owner,
        ownerSide,
        target,
        phase: 'chase',
        rewarded: false,
      })
      spawnBurst(owner.x, owner.y, 1.2)
      triggerCheer()
      return true
    }

    function submitNokiaDial() {
      const typed = nokiaDialInput.trim()
      if (typed === NOKIA_DIAL_CODE) {
        if (spawnPolice(nokiaDialSide)) {
          nokiaDialMessage = `112! Polis ute · +${POLICE_REWARD} 🪙`
          nokiaDialMessageUntil = performance.now() + 2500
          if (nokiaDialSide === 'red') redCoins += POLICE_REWARD
          else blueCoins += POLICE_REWARD
          nokiaDialInput = ''
          closeNokiaDial()
        } else {
          nokiaDialInput = ''
        }
        return
      }
      if (typed === LEON_DIAL_CODE) {
        if (spawnLeon(nokiaDialSide)) {
          nokiaDialInput = ''
          closeNokiaDial()
        } else {
          nokiaDialInput = ''
        }
        return
      }
      nokiaDialMessage = 'Fel nummer'
      nokiaDialMessageUntil = performance.now() + 1500
      nokiaDialInput = ''
    }

    function spawnLeon(ownerSide) {
      const owner =
        ownerSide === 'red'
          ? fighters.find((f) => (f.player || f.control === 'wasd') && !f.eliminated)
          : fighters.find((f) => f.control === 'arrows' && !f.eliminated)
      if (!owner) {
        nokiaDialMessage = 'Ingen Leon-ägare'
        nokiaDialMessageUntil = performance.now() + 2000
        return false
      }
      const calls = ownerSide === 'red' ? leonCallsRed : leonCallsBlue
      const angry = calls >= LEON_MAX_SAFE_CALLS
      if (ownerSide === 'red') leonCallsRed += 1
      else leonCallsBlue += 1

      let target = null
      if (angry) {
        target = owner
        nokiaDialMessage = 'Leon arg! Boll på DIG'
        nokiaDialMessageUntil = performance.now() + 2800
      } else {
        target = bossMode
          ? fighters.find((f) => f.isBoss && !f.eliminated)
          : fighters.find((f) => f !== owner && !f.eliminated && !f.isBoss)
        if (!target) {
          nokiaDialMessage = 'Ingen att sparka på'
          nokiaDialMessageUntil = performance.now() + 2000
          if (ownerSide === 'red') leonCallsRed = Math.max(0, leonCallsRed - 1)
          else leonCallsBlue = Math.max(0, leonCallsBlue - 1)
          return false
        }
        nokiaDialMessage = '123! Leon · Messi-tröja'
        nokiaDialMessageUntil = performance.now() + 2800
      }

      const ang = Math.atan2(owner.y - cy, owner.x - cx) + Math.PI
      const spawnAng = ang + (Math.random() - 0.5) * 0.6
      leonUnits.push({
        x: cx + Math.cos(spawnAng) * (arenaR * 0.92),
        y: cy + Math.sin(spawnAng) * (arenaR * 0.92),
        vx: 0,
        vy: 0,
        r: LEON_RADIUS,
        owner,
        ownerSide,
        target,
        angry,
        phase: 'run',
        face: 1,
        life: 8,
      })
      spawnBurst(owner.x, owner.y, 1.4)
      triggerCheer()
      flash = Math.min(0.55, flash + 0.2)
      return true
    }

    function kickFootball(leon) {
      if (!leon || !leon.target || leon.target.eliminated) return
      const t = leon.target
      const dx = t.x - leon.x
      const dy = t.y - leon.y
      const dist = Math.hypot(dx, dy) || 1
      const nx = dx / dist
      const ny = dy / dist
      // Boll startar vid Leons fot · flyger mot målet (inte kroppsslag)
      footballs.push({
        x: leon.x + nx * (leon.r * 0.35),
        y: leon.y + ny * (leon.r * 0.35) + leon.r * 0.45,
        vx: nx * LEON_BALL_SPEED,
        vy: ny * LEON_BALL_SPEED,
        r: LEON_BALL_RADIUS,
        damage: LEON_FOOTBALL_DAMAGE,
        owner: leon.owner,
        angry: !!leon.angry,
        life: 5,
        spin: 0,
        // Kort immunitet så bollen hinner lämna Leon innan träff-check
        armAt: performance.now() + 80,
      })
      spawnBurst(leon.x + nx * leon.r * 0.6, leon.y + ny * leon.r * 0.6 + leon.r * 0.4, 0.9)
      shake = Math.min(10, shake + 3)
    }

    function updateLeon(dt) {
      const now = performance.now()
      for (let i = leonUnits.length - 1; i >= 0; i -= 1) {
        const L = leonUnits[i]
        L.life -= dt * 0.02
        if (L.life <= 0 || !L.target || L.target.eliminated) {
          leonUnits.splice(i, 1)
          continue
        }
        if (L.phase === 'run') {
          const aimX = L.target.x
          const aimY = L.target.y
          const dx = aimX - L.x
          const dy = aimY - L.y
          const dist = Math.hypot(dx, dy) || 1
          // Håll avstånd · spring inte in i målet
          if (dist > LEON_KICK_RANGE) {
            L.vx += (dx / dist) * 0.75 * dt
            L.vy += (dy / dist) * 0.75 * dt
            const sp = Math.hypot(L.vx, L.vy)
            if (sp > LEON_SPEED) {
              L.vx = (L.vx / sp) * LEON_SPEED
              L.vy = (L.vy / sp) * LEON_SPEED
            }
            L.x += L.vx * dt
            L.y += L.vy * dt
          } else {
            L.vx *= 0.5
            L.vy *= 0.5
            L.phase = 'windup'
            L.kickAt = now + LEON_KICK_WINDUP_MS
            L.face = dx >= 0 ? 1 : -1
            L.knifeAngle = Math.atan2(dy, dx)
          }
          L.face = L.vx >= 0 ? 1 : -1
        } else if (L.phase === 'windup') {
          L.vx *= 0.7
          L.vy *= 0.7
          const dx = L.target.x - L.x
          const dy = L.target.y - L.y
          L.face = dx >= 0 ? 1 : -1
          if (now >= (L.kickAt || 0)) {
            kickFootball(L)
            L.phase = 'leave'
            L.leaveAng = Math.atan2(L.y - cy, L.x - cx)
            L.life = Math.min(L.life, 2.2)
          }
        } else if (L.phase === 'leave') {
          const ang = L.leaveAng || Math.atan2(L.y - cy, L.x - cx)
          L.vx = Math.cos(ang) * LEON_SPEED * 1.35
          L.vy = Math.sin(ang) * LEON_SPEED * 1.35
          L.x += L.vx * dt
          L.y += L.vy * dt
          L.face = L.vx >= 0 ? 1 : -1
          if (Math.hypot(L.x - cx, L.y - cy) > arenaR + 80) {
            leonUnits.splice(i, 1)
          }
        }
      }
    }

    function updateFootballs(dt) {
      for (let i = footballs.length - 1; i >= 0; i -= 1) {
        const b = footballs[i]
        const prevX = b.x
        const prevY = b.y
        b.x += b.vx * dt
        b.y += b.vy * dt
        b.spin += 0.55 * dt
        b.life -= dt * 0.02
        if (Math.hypot(b.x - cx, b.y - cy) > arenaR + 60 || b.life <= 0) {
          footballs.splice(i, 1)
          continue
        }
        if (performance.now() < (b.armAt || 0)) continue
        let hit = false
        for (let j = 0; j < fighters.length; j += 1) {
          const f = fighters[j]
          if (f.eliminated) continue
          // Arg Leon: träffa ägaren. Annars: alla utom ägaren (boss-läge: boss)
          if (b.angry) {
            if (f !== b.owner) continue
          } else if (bossMode) {
            if (!f.isBoss) continue
          } else if (f === b.owner || f.isBoss) {
            continue
          }
          const prox = getRadius(f) + b.r + 8
          const dNow = Math.hypot(f.x - b.x, f.y - b.y)
          const dSweep = distPointToSegment(f.x, f.y, prevX, prevY, b.x, b.y)
          if (dNow < prox || dSweep < prox) {
            if (!isShielded(f)) {
              f.lives -= b.damage
              if (f.isBoss) addBossDamage(b.owner, b.damage)
            }
            f.squash = 0.75
            f.vx += b.vx * 0.45
            f.vy += b.vy * 0.45
            spawnBurst(b.x, b.y, 1.8)
            shake = Math.min(18, shake + 8)
            flash = Math.min(0.55, flash + 0.25)
            triggerCheer()
            hit = true
            break
          }
        }
        if (hit) footballs.splice(i, 1)
      }
    }

    function drawLeon(L) {
      const r = L.r
      ctx.save()
      ctx.translate(L.x, L.y)
      ctx.scale(L.face || 1, 1)
      // Hud
      const skin = ctx.createRadialGradient(-r * 0.2, -r * 0.25, r * 0.1, 0, 0, r)
      skin.addColorStop(0, '#f5d0a9')
      skin.addColorStop(0.65, '#d4a574')
      skin.addColorStop(1, '#a67c52')
      ctx.fillStyle = skin
      ctx.beginPath()
      ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.fill()
      // Messi-tröja (blå/vit Argentina-ish)
      ctx.fillStyle = L.angry ? '#7f1d1d' : '#74acdf'
      ctx.beginPath()
      ctx.ellipse(0, r * 0.22, r * 0.78, r * 0.58, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(-r * 0.72, r * 0.02, r * 1.44, r * 0.14)
      ctx.fillStyle = L.angry ? '#fca5a5' : '#0f172a'
      ctx.font = `bold ${Math.max(9, Math.floor(r * 0.32))}px Figtree, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Messi', 0, r * 0.28)
      // Hår
      ctx.fillStyle = '#1c1917'
      ctx.beginPath()
      ctx.ellipse(0, -r * 0.55, r * 0.62, r * 0.32, 0, Math.PI, Math.PI * 2)
      ctx.fill()
      // Ögon
      ctx.fillStyle = '#111'
      ctx.beginPath()
      ctx.arc(-r * 0.22, -r * 0.1, r * 0.09, 0, Math.PI * 2)
      ctx.arc(r * 0.22, -r * 0.1, r * 0.09, 0, Math.PI * 2)
      ctx.fill()
      // Fotboll vid foten · synlig tills han sparkar
      if (L.phase === 'run' || L.phase === 'windup') {
        ctx.save()
        const kickLift = L.phase === 'windup' ? -r * 0.15 : 0
        ctx.translate(r * 0.55, r * 0.65 + kickLift)
        ctx.rotate(L.phase === 'windup' ? -0.6 : 0.2)
        drawFootballIcon(LEON_BALL_RADIUS * 0.75)
        ctx.restore()
      }
      ctx.restore()
    }

    function drawFootballIcon(r) {
      ctx.fillStyle = '#f5f5f4'
      ctx.beginPath()
      ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#1c1917'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.fillStyle = '#1c1917'
      ctx.beginPath()
      for (let i = 0; i < 5; i += 1) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2
        const x = Math.cos(a) * r * 0.35
        const y = Math.sin(a) * r * 0.35
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()
      ctx.beginPath()
      ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2)
      ctx.strokeStyle = '#44403c'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    function drawFootball(b) {
      ctx.save()
      ctx.translate(b.x, b.y)
      ctx.rotate(b.spin || 0)
      drawFootballIcon(b.r)
      ctx.restore()
    }

    function givePistol(fighter) {
      if (!fighter) return
      // Polis-kidnap → pistol + uppgraderingar i shopen för den som blev kidnappad
      if (isRedSide(fighter)) {
        inventory.pistolUnlockedRed = true
        inventory.pistolRed = true
        equipPistolForm('red')
      } else {
        inventory.pistolUnlockedBlue = true
        inventory.pistolBlue = true
        equipPistolForm('blue')
      }
    }

    function releaseKidnap(p) {
      const target = p.target
      if (!target) return
      target.kidnapped = false
      target.kidnapUntil = 0
      const ang = Math.atan2(target.y - cy, target.x - cx) || 0
      target.x = cx + Math.cos(ang) * (arenaR * 0.72)
      target.y = cy + Math.sin(ang) * (arenaR * 0.72)
      target.vx = -Math.cos(ang) * 4
      target.vy = -Math.sin(ang) * 4
      keepInArena(target)
      givePistol(target)
      spawnBurst(target.x, target.y, 1.6)
      shake = Math.min(14, shake + 5)
      triggerCheer()
    }

    function updatePolice(dt) {
      const now = performance.now()
      for (let i = policeUnits.length - 1; i >= 0; i -= 1) {
        const p = policeUnits[i]
        if (!p.target || p.target.eliminated) {
          if (p.target) {
            p.target.kidnapped = false
            p.target.kidnapUntil = 0
          }
          policeUnits.splice(i, 1)
          continue
        }
        if (p.phase === 'chase') {
          const dx = p.target.x - p.x
          const dy = p.target.y - p.y
          const dist = Math.hypot(dx, dy) || 1
          p.vx += (dx / dist) * 0.7 * dt
          p.vy += (dy / dist) * 0.7 * dt
          const sp = Math.hypot(p.vx, p.vy)
          if (sp > POLICE_SPEED) {
            p.vx = (p.vx / sp) * POLICE_SPEED
            p.vy = (p.vy / sp) * POLICE_SPEED
          }
          p.x += p.vx * dt
          p.y += p.vy * dt
          if (dist < POLICE_CATCH + getRadius(p.target)) {
            p.phase = 'kidnap'
            p.kidnapUntil = now + KIDNAP_ESCAPE_MS
            p.target.kidnapped = true
            p.target.kidnapUntil = p.kidnapUntil
            p.target.vx = 0
            p.target.vy = 0
            spawnBurst(p.x, p.y, 1.5)
            shake = Math.min(14, shake + 6)
          }
        } else if (p.phase === 'kidnap') {
          // Dra ut och håll kvar tills 10s gått → slipper ut med pistol
          const ang = Math.atan2(p.y - cy, p.x - cx)
          const outDist = Math.hypot(p.x - cx, p.y - cy)
          if (outDist < arenaR + 55) {
            p.vx = Math.cos(ang) * POLICE_SPEED * 1.2
            p.vy = Math.sin(ang) * POLICE_SPEED * 1.2
            p.x += p.vx * dt
            p.y += p.vy * dt
          } else {
            p.vx = 0
            p.vy = 0
          }
          p.target.x = p.x + Math.cos(ang) * (p.r + 8)
          p.target.y = p.y + Math.sin(ang) * (p.r + 8)
          p.target.vx = 0
          p.target.vy = 0
          if (now >= (p.kidnapUntil || 0)) {
            releaseKidnap(p)
            policeUnits.splice(i, 1)
            spawnBurst(p.x, p.y, 1.4)
          }
        }
      }
    }

    function drawPolice(p) {
      const r = p.r
      ctx.save()
      ctx.translate(p.x, p.y)
      // Grön polisboll
      const body = ctx.createRadialGradient(-r * 0.25, -r * 0.3, r * 0.1, 0, 0, r)
      body.addColorStop(0, '#86efac')
      body.addColorStop(0.6, '#22c55e')
      body.addColorStop(1, '#166534')
      ctx.fillStyle = body
      ctx.beginPath()
      ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3
      ctx.stroke()
      // Uniform / badge
      ctx.fillStyle = '#1e3a5f'
      ctx.beginPath()
      ctx.ellipse(0, r * 0.15, r * 0.72, r * 0.55, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#f0c040'
      ctx.beginPath()
      ctx.moveTo(0, -r * 0.05)
      ctx.lineTo(r * 0.18, r * 0.2)
      ctx.lineTo(-r * 0.18, r * 0.2)
      ctx.closePath()
      ctx.fill()
      // Polis-mössa
      ctx.fillStyle = '#1e3a5f'
      ctx.beginPath()
      ctx.ellipse(0, -r * 0.55, r * 0.7, r * 0.28, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#111827'
      ctx.fillRect(-r * 0.75, -r * 0.62, r * 1.5, r * 0.12)
      ctx.fillStyle = '#f0c040'
      ctx.fillRect(-r * 0.12, -r * 0.78, r * 0.24, r * 0.2)
      // Ögon
      ctx.fillStyle = '#111'
      ctx.beginPath()
      ctx.arc(-r * 0.22, -r * 0.12, r * 0.1, 0, Math.PI * 2)
      ctx.arc(r * 0.22, -r * 0.12, r * 0.1, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    function drawNokiaDialButtons() {
      nokiaDialButtonRed = { x: -999, y: -999, w: 0, h: 0 }
      nokiaDialButtonBlue = { x: -999, y: -999, w: 0, h: 0 }
      if (inventory.nokiaRed) {
        const bx = 28
        const by = 140
        nokiaDialButtonRed = { x: bx, y: by, w: 88, h: 34 }
        ctx.fillStyle = nokiaDialOpen && nokiaDialSide === 'red' ? '#f0c040' : '#2a3540'
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') ctx.roundRect(bx, by, 88, 34, 8)
        else ctx.rect(bx, by, 88, 34)
        ctx.fill()
        ctx.fillStyle = nokiaDialOpen && nokiaDialSide === 'red' ? '#2a1c08' : '#9fe8ff'
        ctx.font = 'bold 13px Figtree, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('NOKIA', bx + 44, by + 17)
      }
      if (inventory.nokiaBlue) {
        const bx = width - 116
        const by = 140
        nokiaDialButtonBlue = { x: bx, y: by, w: 88, h: 34 }
        ctx.fillStyle = nokiaDialOpen && nokiaDialSide === 'blue' ? '#f0c040' : '#2a3540'
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') ctx.roundRect(bx, by, 88, 34, 8)
        else ctx.rect(bx, by, 88, 34)
        ctx.fill()
        ctx.fillStyle = nokiaDialOpen && nokiaDialSide === 'blue' ? '#2a1c08' : '#9fe8ff'
        ctx.font = 'bold 13px Figtree, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('NOKIA', bx + 44, by + 17)
      }
    }

    function drawNokiaDial() {
      nokiaDialHits.length = 0
      if (!nokiaDialOpen) return
      const panelW = Math.min(320, width * 0.85)
      const panelH = 340
      const px = width * 0.5 - panelW * 0.5
      const py = height * 0.5 - panelH * 0.5
      ctx.save()
      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = '#1a1f24'
      ctx.strokeStyle = '#7ec8ff'
      ctx.lineWidth = 3
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') ctx.roundRect(px, py, panelW, panelH, 14)
      else ctx.rect(px, py, panelW, panelH)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#9fe8ff'
      ctx.font = 'bold 22px Syne, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText(`NOKIA (${nokiaDialSide === 'red' ? 'Röd' : 'Blå'})`, width * 0.5, py + 16)
      ctx.fillStyle = '#0b1220'
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(px + 28, py + 56, panelW - 56, 44, 8)
      } else ctx.rect(px + 28, py + 56, panelW - 56, 44)
      ctx.fill()
      ctx.fillStyle = '#86efac'
      ctx.font = 'bold 26px Figtree, sans-serif'
      ctx.textBaseline = 'middle'
      ctx.fillText(nokiaDialInput || '…', width * 0.5, py + 78)
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.font = '13px Figtree, sans-serif'
      ctx.textBaseline = 'top'
      ctx.fillText('112 polis · 123 Leon', width * 0.5, py + 112)
      if (nokiaDialMessage && performance.now() < nokiaDialMessageUntil) {
        ctx.fillStyle =
          nokiaDialMessage.startsWith('112') || nokiaDialMessage.startsWith('123')
            ? '#86efac'
            : '#fca5a5'
        ctx.font = '600 14px Figtree, sans-serif'
        ctx.fillText(nokiaDialMessage, width * 0.5, py + 134)
      }
      // Knappmatta 1-9, 0
      const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK']
      const startX = px + 40
      const startY = py + 165
      const kw = 70
      const kh = 36
      const gap = 10
      keys.forEach((key, i) => {
        const col = i % 3
        const row = Math.floor(i / 3)
        const kx = startX + col * (kw + gap)
        const ky = startY + row * (kh + gap)
        ctx.fillStyle = key === 'OK' ? '#22c55e' : key === '⌫' ? '#4b5563' : '#334155'
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') ctx.roundRect(kx, ky, kw, kh, 8)
        else ctx.rect(kx, ky, kw, kh)
        ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 16px Figtree, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(key, kx + kw * 0.5, ky + kh * 0.5)
        nokiaDialHits.push({ x: kx, y: ky, w: kw, h: kh, id: key })
      })
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 20px Syne, sans-serif'
      ctx.fillText('✕', width * 0.5, py + panelH - 28)
      nokiaDialHits.push({ x: width * 0.5 - 16, y: py + panelH - 40, w: 32, h: 32, id: 'close' })
      ctx.restore()
    }

    function updateArrows(dt) {
      for (let i = arrows.length - 1; i >= 0; i -= 1) {
        const a = arrows[i]
        if (a.homing && a.owner && !a.owner.eliminated) {
          let target = null
          let best = Infinity
          for (let j = 0; j < fighters.length; j += 1) {
            const f = fighters[j]
            if (f === a.owner || f.eliminated || f.isBoss) continue
            const d = Math.hypot(f.x - a.x, f.y - a.y)
            if (d < best) {
              best = d
              target = f
            }
          }
          if (target) {
            const desired = Math.atan2(target.y - a.y, target.x - a.x)
            const speed = Math.hypot(a.vx, a.vy) || PISTOL_SPEED
            let cur = Math.atan2(a.vy, a.vx)
            let delta = desired - cur
            while (delta > Math.PI) delta -= Math.PI * 2
            while (delta < -Math.PI) delta += Math.PI * 2
            cur += Math.max(-0.2, Math.min(0.2, delta)) * dt
            a.vx = Math.cos(cur) * speed
            a.vy = Math.sin(cur) * speed
            a.angle = cur
          }
        }
        const prevX = a.x
        const prevY = a.y
        a.x += a.vx * dt
        a.y += a.vy * dt
        a.life -= dt * 0.02
        if (Math.hypot(a.x - cx, a.y - cy) > arenaR + 50 || a.life <= 0) {
          if (a.nokia) explodeNokia(a)
          else if (a.rpg) explodeRpg(a)
          arrows.splice(i, 1)
          continue
        }
        // RPG-rökspår
        if (a.rpg && Math.random() < 0.5) {
          particles.push({
            x: a.x - Math.cos(a.angle || 0) * a.r,
            y: a.y - Math.sin(a.angle || 0) * a.r,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2 - 0.5,
            life: 0.7,
            decay: 0.05,
            size: 3 + Math.random() * 4,
            color: [180, 180, 180],
            fire: false,
          })
        }
        let hit = false
        for (let j = 0; j < fighters.length; j += 1) {
          const f = fighters[j]
          if (f === a.owner || f.eliminated) continue
          if (bossMode && !f.isBoss) continue
          const fr = getRadius(f)
          const prox = a.nokia
            ? NOKIA_PROXIMITY + fr + PROJECTILE_HIT_PAD * 0.35
            : a.rpg
              ? RPG_PROXIMITY + fr + PROJECTILE_HIT_PAD * 0.35
              : fr + a.r + PROJECTILE_HIT_PAD
          const dNow = Math.hypot(f.x - a.x, f.y - a.y)
          const dSweep = distPointToSegment(f.x, f.y, prevX, prevY, a.x, a.y)
          if (dNow < prox || dSweep < prox) {
            if (a.nokia) {
              explodeNokia(a)
            } else if (a.rpg) {
              explodeRpg(a)
            } else {
              if (!isShielded(f)) {
                f.lives -= a.damage
                if (f.isBoss) addBossDamage(a.owner, a.damage)
              }
              f.squash = 0.55
              f.vx += a.vx * 0.18
              f.vy += a.vy * 0.18
              spawnBurst(a.x, a.y, a.sniper ? 1.3 : a.pistol ? 0.7 : 1.0)
              shake = Math.min(14, shake + (a.sniper ? 7 : a.pistol ? 3 : 4))
            }
            hit = true
            break
          }
        }
        if (hit) arrows.splice(i, 1)
      }
    }

    function drawArrow(a) {
      if (a.sniper) {
        ctx.save()
        ctx.translate(a.x, a.y)
        ctx.rotate(a.angle || 0)
        ctx.fillStyle = '#dfe6e9'
        ctx.beginPath()
        ctx.ellipse(0, 0, a.r * 2.4, a.r * 0.55, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#74b9ff'
        ctx.beginPath()
        ctx.arc(a.r * 1.2, 0, a.r * 0.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
        return
      }
      if (a.pistol) {
        ctx.save()
        ctx.translate(a.x, a.y)
        ctx.rotate(a.angle || 0)
        ctx.fillStyle = '#f0c040'
        ctx.beginPath()
        ctx.ellipse(0, 0, a.r * 1.8, a.r * 0.7, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#fff8dc'
        ctx.beginPath()
        ctx.arc(a.r * 0.9, 0, a.r * 0.45, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
        return
      }
      if (a.rpg) {
        ctx.save()
        ctx.translate(a.x, a.y)
        ctx.rotate(a.angle || 0)
        // RPG-raket
        ctx.fillStyle = '#4a5a3a'
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(-a.r * 2.2, -a.r * 0.45, a.r * 3.4, a.r * 0.9, 3)
        } else {
          ctx.rect(-a.r * 2.2, -a.r * 0.45, a.r * 3.4, a.r * 0.9)
        }
        ctx.fill()
        ctx.fillStyle = '#c0392b'
        ctx.beginPath()
        ctx.moveTo(a.r * 1.2, 0)
        ctx.lineTo(a.r * 0.2, -a.r * 0.55)
        ctx.lineTo(a.r * 0.2, a.r * 0.55)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = '#f0c040'
        ctx.fillRect(-a.r * 2.2, -a.r * 0.35, a.r * 0.55, a.r * 0.7)
        // Eld bak
        ctx.fillStyle = 'rgba(255, 140, 40, 0.85)'
        ctx.beginPath()
        ctx.moveTo(-a.r * 2.2, -a.r * 0.25)
        ctx.lineTo(-a.r * 3.1, 0)
        ctx.lineTo(-a.r * 2.2, a.r * 0.25)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
        return
      }
      if (a.nokia) {
        ctx.save()
        ctx.translate(a.x, a.y)
        ctx.rotate(a.angle || 0)
        // Nokia-telefon
        const w = a.r * 1.6
        const h = a.r * 2.6
        ctx.fillStyle = '#2a2a2a'
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') ctx.roundRect(-w * 0.5, -h * 0.5, w, h, 4)
        else ctx.rect(-w * 0.5, -h * 0.5, w, h)
        ctx.fill()
        ctx.fillStyle = '#7ec8ff'
        ctx.fillRect(-w * 0.32, -h * 0.38, w * 0.64, h * 0.28)
        ctx.fillStyle = '#444'
        for (let row = 0; row < 3; row += 1) {
          for (let col = 0; col < 3; col += 1) {
            ctx.fillRect(
              -w * 0.28 + col * w * 0.22,
              -h * 0.02 + row * h * 0.18,
              w * 0.16,
              h * 0.12,
            )
          }
        }
        ctx.fillStyle = '#666'
        ctx.beginPath()
        ctx.arc(0, -h * 0.42, w * 0.08, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
        return
      }
      const colors = materialColorsFor(a.level || 0)
      ctx.save()
      ctx.translate(a.x, a.y)
      ctx.rotate(a.angle || 0)
      // Glow
      ctx.fillStyle = 'rgba(255, 230, 160, 0.35)'
      ctx.beginPath()
      ctx.arc(a.r * 0.4, 0, a.r * 2.2, 0, Math.PI * 2)
      ctx.fill()
      // Shaft
      ctx.strokeStyle = '#6b3f1f'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(-a.r * 2.8, 0)
      ctx.lineTo(a.r * 1.8, 0)
      ctx.stroke()
      // Tip
      ctx.fillStyle = colors.tip
      ctx.strokeStyle = colors.edge
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(a.r * 3.0, 0)
      ctx.lineTo(a.r * 1.4, -a.r * 0.85)
      ctx.lineTo(a.r * 1.4, a.r * 0.85)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      // Fletching
      ctx.fillStyle = colors.blade
      ctx.beginPath()
      ctx.moveTo(-a.r * 2.8, 0)
      ctx.lineTo(-a.r * 1.4, -a.r * 0.9)
      ctx.lineTo(-a.r * 1.7, 0)
      ctx.lineTo(-a.r * 1.4, a.r * 0.9)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    function updatePingBalls(dt) {
      for (let i = pingBalls.length - 1; i >= 0; i -= 1) {
        const b = pingBalls[i]
        const prevX = b.x
        const prevY = b.y
        b.x += b.vx * dt
        b.y += b.vy * dt
        b.spin += 0.4 * dt
        b.life -= dt * 0.02
        if (Math.hypot(b.x - cx, b.y - cy) > arenaR + 40 || b.life <= 0) {
          pingBalls.splice(i, 1)
          continue
        }
        let hit = false
        for (let j = 0; j < fighters.length; j += 1) {
          const f = fighters[j]
          if (f === b.owner || f.eliminated) continue
          if (bossMode && !f.isBoss) continue
          const prox = getRadius(f) + b.r + PROJECTILE_HIT_PAD
          const dNow = Math.hypot(f.x - b.x, f.y - b.y)
          const dSweep = distPointToSegment(f.x, f.y, prevX, prevY, b.x, b.y)
          if (dNow < prox || dSweep < prox) {
            if (!isShielded(f)) {
              f.lives -= b.damage
              if (f.isBoss) addBossDamage(b.owner, b.damage)
            }
            f.squash = 0.5
            f.vx += b.vx * 0.2
            f.vy += b.vy * 0.2
            spawnBurst(b.x, b.y, 1.1)
            shake = Math.min(12, shake + 4)
            hit = true
            break
          }
        }
        if (hit) pingBalls.splice(i, 1)
      }
    }

    function drawPingBall(b) {
      ctx.save()
      ctx.translate(b.x, b.y)
      ctx.rotate(b.spin)
      ctx.fillStyle = '#f5f5f5'
      ctx.beginPath()
      ctx.arc(0, 0, b.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#e85d04'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(0, 0, b.r, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(0, 0, b.r * 0.55, -0.8, 0.8)
      ctx.stroke()
      ctx.restore()
    }

    function swingMelee(attacker) {
      if (!attacker || attacker.eliminated || attacker.lives <= 0) return
      if (attacker.control !== 'arrows' && attacker.control !== 'wasd') return
      let kind = getSideWeapon(attacker)
      // Nermin: ingen kniv — bara armar/ben (båge/nokia/pistol/rpg/sniper får fortfarande skjuta)
      if (
        nerminPower &&
        kind !== 'bow' &&
        kind !== 'nokia' &&
        kind !== 'pistol' &&
        kind !== 'rpg' &&
        kind !== 'sniper' &&
        kind !== 'ping' &&
        kind !== 'hammer'
      ) {
        kind = 'limb'
      } else if (kind === 'ping') {
        shootPingPong(attacker)
        return
      } else if (kind === 'sniper') {
        shootSniper(attacker)
        return
      } else if (kind === 'rpg') {
        shootRpg(attacker)
        return
      } else if (kind === 'pistol') {
        shootPistol(attacker)
        return
      } else if (kind === 'bow' || kind === 'nokia') {
        shootBow(attacker)
        return
      } else if (kind === 'hammer') {
        // fall through to melee swing
      }
      if (nerminPower) kind = 'limb'
      const now = performance.now()
      if (now < (attacker.knifeReadyAt || 0)) return
      const stats = meleeStats(kind, attacker)
      const angle = aimAtOpponent(attacker)

      attacker.knifeReadyAt = now + stats.cooldown
      attacker.knifeSwingUntil = now + stats.swingMs
      attacker.knifeEquipped = true
      attacker.meleeKind = kind
      attacker.knifeAngle = angle
      attacker.meleeDidHit = false
      attacker.squash = 0.45
      attacker.face = Math.cos(angle) >= 0 ? 1 : -1

      // Spark / returnera pingisboll i luften
      const returned = tryReturnPingBall(attacker, kind)
      if (!returned) {
        spawnBurst(
          attacker.x + Math.cos(angle) * ballR * 1.15,
          attacker.y + Math.sin(angle) * ballR * 1.15,
          0.55,
        )
      }
      updateMeleeHit(attacker, now)
    }

    function updateMeleeHit(attacker, now = performance.now()) {
      if (!attacker || attacker.eliminated || attacker.meleeDidHit) return
      const kind = attacker.meleeKind || 'knife'
      if (
        kind !== 'knife' &&
        kind !== 'sword' &&
        kind !== 'hammer' &&
        kind !== 'foot' &&
        kind !== 'limb'
      ) {
        return
      }
      const stats = meleeStats(kind, attacker)
      const candidates = fighters.filter(
        (f) => f !== attacker && !f.eliminated && (bossMode ? f.isBoss : !f.isBoss),
      )
      let angle =
        typeof attacker.knifeAngle === 'number'
          ? attacker.knifeAngle
          : (attacker.face || 1) > 0
            ? 0
            : Math.PI
      let best = null
      let bestDist = Infinity
      for (let i = 0; i < candidates.length; i += 1) {
        const t = candidates[i]
        const d = Math.hypot(t.x - attacker.x, t.y - attacker.y)
        if (d < bestDist) {
          bestDist = d
          best = t
        }
      }
      if (best) {
        const aim = Math.atan2(best.y - attacker.y, best.x - attacker.x)
        let delta = aim - angle
        while (delta > Math.PI) delta -= Math.PI * 2
        while (delta < -Math.PI) delta += Math.PI * 2
        angle += Math.max(-0.45, Math.min(0.45, delta))
        attacker.knifeAngle = angle
      }
      const ar = getRadius(attacker)
      for (let i = 0; i < candidates.length; i += 1) {
        const target = candidates[i]
        const tr = getRadius(target)
        const dx = target.x - attacker.x
        const dy = target.y - attacker.y
        const dist = Math.hypot(dx, dy)
        const reach = ar + tr + stats.reach + MELEE_HIT_PAD
        if (dist > reach) continue
        const aim = Math.atan2(dy, dx)
        let delta = aim - angle
        while (delta > Math.PI) delta -= Math.PI * 2
        while (delta < -Math.PI) delta += Math.PI * 2
        if (Math.abs(delta) > MELEE_ARC) continue

        if (target.isBoss) {
          target.lives -= stats.damage
          addBossDamage(attacker, stats.damage)
        } else if (!isShielded(target, now)) {
          target.lives -= stats.damage
        }
        const kick = kind === 'foot'
        target.squash = kick ? 0.55 : 0.7
        target.vx += Math.cos(angle) * (kick ? 14 : 10)
        target.vy += Math.sin(angle) * (kick ? 14 : 10)
        spawnBurst(target.x, target.y, kick ? 1.8 : 2.2)
        shake = Math.min(20, shake + (kick ? 8 : 10))
        flash = Math.min(0.55, flash + (kick ? 0.18 : 0.25))
        triggerCheer()
        attacker.meleeDidHit = true
        return
      }
    }

    function swingKnife(attacker) {
      swingMelee(attacker)
    }


    function swingSpear(attacker) {
      if (!attacker || attacker.eliminated || attacker.lives <= 0) return
      if (!attacker.player && attacker.control !== 'wasd') return
      const now = performance.now()
      if (now < (attacker.spearReadyAt || 0)) return

      const target = bossMode
        ? fighters.find((f) => f.isBoss && !f.eliminated)
        : fighters.find((f) => f !== attacker && !f.eliminated)

      let angle = (attacker.face || 1) > 0 ? 0 : Math.PI
      if (target) {
        angle = Math.atan2(target.y - attacker.y, target.x - attacker.x)
      } else if (attacker.vx !== 0 || attacker.vy !== 0) {
        angle = Math.atan2(attacker.vy, attacker.vx)
      }

      attacker.spearReadyAt = now + SPEAR_COOLDOWN
      attacker.spearSwingUntil = now + SPEAR_SWING_MS
      attacker.spearEquipped = true
      attacker.spearDidHit = false
      attacker.spearAngle = angle
      attacker.squash = 0.4
      attacker.face = Math.cos(angle) >= 0 ? 1 : -1

      const tipLen = spearTipLength(attacker)
      spawnBurst(
        attacker.x + Math.cos(angle) * tipLen * 0.75,
        attacker.y + Math.sin(angle) * tipLen * 0.75,
        0.5,
      )
      updateSpearHit(attacker, now)
    }

    function collidePair(a, b, now) {
      if (a.eliminated || b.eliminated || a.kidnapped || b.kidnapped) return false

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
      const vsBoss = !!(a.isBoss || b.isBoss)
      const pvpTouch = !vsBoss && !bossMode

      if (canHurt && vsBoss) {
        const boss = a.isBoss ? a : b
        const hero = a.isBoss ? b : a
        // Boss gör ingen touch-skada — bara spelaren skadar bossen
        const touchDmg =
          hero.control === 'wasd' || hero.player
            ? PLAYER_HIT_DAMAGE
            : BOSS_TOUCH_DAMAGE
        boss.lives -= touchDmg
        addBossDamage(hero, touchDmg)
        boss.anger = 1
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
        return canHurt && vsBoss
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

      if (!pvpTouch) {
        const power = Math.min(2.5, Math.abs(velAlong) / 4.5)
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2
        if (!canHurt) spawnBurst(mx, my, power)
        a.squash = Math.max(a.squash, 0.55)
        b.squash = Math.max(b.squash, 0.55)
        shake = Math.min(16, shake + power * 5)
        flash = Math.min(0.45, flash + power * 0.18)
      }
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
      ball.shieldKind = null
      ball.bombReadyAt = 0
      ball.knifeEquipped = false
      ball.knifeReadyAt = 0
      ball.knifeSwingUntil = 0
      ball.meleeDidHit = false
      ball.spearEquipped = false
      ball.spearReadyAt = 0
      ball.spearSwingUntil = 0

      if (bossMode) {
        if (isRed) {
          ball.control = 'wasd'
          ball.player = true
          ball._bossSide = 'red'
          ball.shieldUses = SHIELD_USES_PER_ROUND
          ball.bombUses = 0
          ball.x = cx - arenaR * 0.3
        } else {
          ball.control = 'arrows'
          ball.player = false
          ball._bossSide = 'blue'
          ball.shieldUses = 0
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
        ball.bombUses = 0
        ball.x = cx - arenaR * 0.25
      } else {
        ball.control = 'arrows'
        ball.shieldUses = 0
        ball.bombUses = 0
        ball.x = cx + arenaR * 0.25
      }
      ball.y = cy
      keepInArena(ball)
      spawnBurst(ball.x, ball.y, 1.2)
    }

    function grantBossSniper(side) {
      if (side === 'red') {
        inventory.pistolUnlockedRed = true
        inventory.pistolRed = true
        inventory.pistolLevelRed = Math.max(inventory.pistolLevelRed, PISTOL_SNIPER_LEVEL)
        inventory.sniperRed = true
        inventory.rpgRed = true
        inventory.weaponRed = 'sniper'
      } else {
        inventory.pistolUnlockedBlue = true
        inventory.pistolBlue = true
        inventory.pistolLevelBlue = Math.max(inventory.pistolLevelBlue, PISTOL_SNIPER_LEVEL)
        inventory.sniperBlue = true
        inventory.rpgBlue = true
        inventory.weaponBlue = 'sniper'
      }
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
        // Båda får sniper (50 dmg · 6s)
        grantBossSniper('red')
        grantBossSniper('blue')
        killstreakMessage = `Boss besegrad! Sniper ${SNIPER_DAMAGE} dmg · ${SNIPER_COOLDOWN / 1000}s`
        killstreakMessageUntil = performance.now() + 3500
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
      bombs.length = 0
      pingBalls.length = 0
      bodyguards.length = 0
      farts.length = 0
      policeUnits.length = 0
      leonUnits.length = 0
      footballs.length = 0
      poisonFlasks.length = 0
      poisonPools.length = 0
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
      bombs.length = 0
      pingBalls.length = 0
      bodyguards.length = 0
      farts.length = 0
      policeUnits.length = 0
      leonUnits.length = 0
      footballs.length = 0
      poisonFlasks.length = 0
      poisonPools.length = 0
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
      blue.bombUses = 0
      blue.knifeEquipped = false
      blue.eliminated = false

      const boss = makeFighter(cx, cy - arenaR * 0.2, 0, 0, 5, false)
      boss.isBoss = true
      boss.control = null
      boss.player = false
      boss.maxLives = BOSS_HP
      boss.lives = BOSS_HP
      boss.color = BOSS_COLOR
      boss.glow = BOSS_GLOW
      boss.anger = 1
      boss.bombUses = 0
      boss.shieldUses = 0
      boss.eliminated = false
      boss.flaskReadyAt = performance.now() + 800

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
        const respawnDelay = eventPistolActive ? 0 : RESPAWN_COUNTDOWN_MS
        if (!ball.player && ball.control === 'arrows') {
          // Blå dog → röd får snurr, blå tappar streak (odds tillbaka till dåliga)
          redCoins += reward
          redScore += 1
          ball.lives = 0
          ball.vx = 0
          ball.vy = 0
          ball.eliminated = true
          ball.respawnAt = now + respawnDelay
          ball.control = null
          const lost = inventory.killstreakKillsBlue
          resetKillstreak('blue', { announce: false })
          addKillstreakKill('red')
          if (lost > 0) {
            killstreakMessage = `Blå dog · ×${lost} streak borta! · Röd snurr +1`
            killstreakMessageUntil = now + 2800
          }
          handleScoreMilestone('red', redScore, now)
          continue
        } else if (ball.player) {
          // Röd dog → blå får snurr, röd tappar streak
          blueCoins += reward
          blueScore += 1
          ball.lives = 0
          ball.vx = 0
          ball.vy = 0
          ball.eliminated = true
          ball.respawnAt = now + respawnDelay
          ball.control = null
          const lost = inventory.killstreakKillsRed
          resetKillstreak('red', { announce: false })
          addKillstreakKill('blue')
          if (lost > 0) {
            killstreakMessage = `Röd dog · ×${lost} streak borta! · Blå snurr +1`
            killstreakMessageUntil = now + 2800
          }
          handleScoreMilestone('blue', blueScore, now)
          continue
        }

        ball.lives = 0
        ball.vx = 0
        ball.vy = 0
        ball.eliminated = true
        ball.respawnAt = now + respawnDelay
        ball.control = null
      }
    }

    function drawRespawnCountdowns(now = performance.now()) {
      for (let i = 0; i < fighters.length; i += 1) {
        const ball = fighters[i]
        if (ball.kidnapped && ball.kidnapUntil > now) {
          const left = Math.max(0, ball.kidnapUntil - now)
          const n = Math.max(1, Math.ceil(left / 1000))
          const pulse = 0.9 + Math.sin(now * 0.025) * 0.1
          ctx.save()
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.font = `bold ${Math.floor(48 * pulse)}px Syne, sans-serif`
          ctx.fillStyle = '#86efac'
          ctx.strokeStyle = 'rgba(0,0,0,0.55)'
          ctx.lineWidth = 6
          ctx.strokeText(String(n), ball.x, ball.y - getRadius(ball) - 28)
          ctx.fillText(String(n), ball.x, ball.y - getRadius(ball) - 28)
          ctx.font = 'bold 12px Figtree, sans-serif'
          ctx.fillStyle = 'rgba(255,255,255,0.85)'
          ctx.fillText('fri + pistol', ball.x, ball.y - getRadius(ball) - 52)
          ctx.restore()
        }
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
        if (f.knifeReadyAt > 0) f.knifeReadyAt += ms
        if (f.knifeSwingUntil > 0) f.knifeSwingUntil += ms
        if (f.flaskReadyAt > 0) f.flaskReadyAt += ms
      }
      for (let i = 0; i < bombs.length; i += 1) {
        if (bombs[i].fuseUntil > 0) bombs[i].fuseUntil += ms
      }
      for (let i = 0; i < bodyguards.length; i += 1) {
        bodyguards[i].expiresAt += ms
        bodyguards[i].nextTick += ms
      }
      for (let i = 0; i < farts.length; i += 1) {
        if (farts[i].expiresAt > 0) farts[i].expiresAt += ms
        if (farts[i].nextTick > 0) farts[i].nextTick += ms
      }
      for (let i = 0; i < fighters.length; i += 1) {
        const f = fighters[i]
        if (f.burnUntil > 0) f.burnUntil += ms
        if (f.burnNextTick > 0) f.burnNextTick += ms
        if (f.kidnapUntil > 0) f.kidnapUntil += ms
      }
      for (let i = 0; i < policeUnits.length; i += 1) {
        if (policeUnits[i].kidnapUntil > 0) policeUnits[i].kidnapUntil += ms
      }
      for (let i = 0; i < poisonPools.length; i += 1) {
        if (poisonPools[i].expiresAt > 0) poisonPools[i].expiresAt += ms
        if (poisonPools[i].nextTick > 0) poisonPools[i].nextTick += ms
      }
      if (winnerUntil > 0) winnerUntil += ms
      if (moggerUntil > 0) moggerUntil += ms
      if (moggerNextTick > 0) moggerNextTick += ms
    }


    function isShopMilestone(score) {
      return (
        score >= SHOP_MILESTONE_START &&
        score <= SHOP_MILESTONE_MAX &&
        (score - SHOP_MILESTONE_START) % SHOP_MILESTONE_STEP === 0
      )
    }

    function handleScoreMilestone(side, score, now) {
      if (bossMode) return

      // Poäng 5: alla får homing-pistol (ingen CD, 2 dmg)
      if (score >= EVENT_PISTOL_AT && !eventPistolGranted) {
        eventPistolGranted = true
        eventPistolActive = true
        killstreakMessage = `Poäng ${EVENT_PISTOL_AT}! Alla får pistol · 2 dmg · följer · ingen CD`
        killstreakMessageUntil = now + 3200
      }

      // Poäng 10: förlora event-pistol + belöningshjul
      if (score >= EVENT_PISTOL_END && eventPistolActive) {
        eventPistolActive = false
        killstreakMessage = `Poäng ${EVENT_PISTOL_END}! Event-pistolen borta`
        killstreakMessageUntil = now + 2500
      }
      if (score >= SCORE_WHEEL_AT) {
        if (side === 'red' && !inventory.scoreWheelDoneRed) {
          inventory.scoreWheelDoneRed = true
          if (isShopMilestone(score)) pendingScoreWheel = 'red'
          else openScoreWheel('red')
        } else if (side === 'blue' && !inventory.scoreWheelDoneBlue) {
          inventory.scoreWheelDoneBlue = true
          if (isShopMilestone(score)) pendingScoreWheel = 'blue'
          else openScoreWheel('blue')
        }
      }

      // Poäng 14: förlora hjul-belöning
      if (score >= SCORE_REWARD_LOSE_AT) {
        clearScoreReward(side)
      }

      const atShop = isShopMilestone(score)
      const atBoss = score >= BOSS_SCORE && !bossTriggeredThisMatch
      const atWin = score >= WIN_SCORE

      if (atWin) {
        shopFree = true
        if (side === 'red') redCoins += WIN_COIN_REWARD
        else blueCoins += WIN_COIN_REWARD
      }

      if (atShop) {
        if (atBoss) {
          bossTriggeredThisMatch = true
          pendingBossAfterShop = true
        }
        if (atWin) pendingWinAfterShop = side
        openShop()
        return
      }

      if (atWin) {
        winner = side
        winnerUntil = now + 3000
        return
      }

      if (atBoss) {
        bossTriggeredThisMatch = true
        startBossFight()
      }
    }

    function clearScoreReward(side) {
      const prev = side === 'red' ? inventory.scoreRewardRed : inventory.scoreRewardBlue
      if (!prev) return
      if (side === 'red') inventory.scoreRewardRed = null
      else inventory.scoreRewardBlue = null
      if (prev === 'hammer') {
        const w = side === 'red' ? inventory.weaponRed : inventory.weaponBlue
        if (w === 'hammer') {
          if (side === 'red') inventory.weaponRed = inventory.startWeaponRed || 'bow'
          else inventory.weaponBlue = inventory.startWeaponBlue || 'bow'
        }
      }
      killstreakMessage = `${side === 'red' ? 'Röd' : 'Blå'} förlorade ${prev} (poäng ${SCORE_REWARD_LOSE_AT})`
      killstreakMessageUntil = performance.now() + 2800
    }

    function openScoreWheel(side) {
      if (scoreWheelOpen || swSpinning || killstreakOpen) return
      if (!shopOpen && !shopPausedAt) {
        clearKeys()
        shopPausedAt = performance.now()
      }
      scoreWheelSide = side
      scoreWheelOpen = true
      swPending = null
      swResultLabel = ''
      swNeedSpin = true
    }

    function closeScoreWheel() {
      if (swSpinning) return
      scoreWheelOpen = false
      scoreWheelSide = null
      swPending = null
      swNeedSpin = false
      if (shopPausedAt > 0 && !shopOpen && !killstreakOpen) {
        shiftPausedTimers(performance.now() - shopPausedAt)
        shopPausedAt = 0
      }
    }

    function startScoreWheelSpin() {
      if (!scoreWheelOpen || !scoreWheelSide || swSpinning) return
      const n = SCORE_WHEEL_SEGMENTS.length
      const idx = Math.floor(Math.random() * n)
      const prize = SCORE_WHEEL_SEGMENTS[idx]
      const slice = (Math.PI * 2) / n
      const segmentCenter = idx * slice + slice * 0.5
      const extraTurns = 5 + Math.floor(Math.random() * 3)
      const current = ((swAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
      const desired = ((-Math.PI / 2 - segmentCenter) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)
      let delta = desired - current
      if (delta < 0) delta += Math.PI * 2
      swFromAngle = swAngle
      swToAngle = swAngle + extraTurns * Math.PI * 2 + delta
      swPending = prize
      swSpinning = true
      swSpinStart = performance.now()
      swResultLabel = ''
    }

    function applyScoreWheelPrize(side, prize) {
      if (!prize) return
      if (prize.id === 'nuke' || prize.id === 'hammer') {
        if (side === 'red') inventory.scoreRewardRed = prize.id
        else inventory.scoreRewardBlue = prize.id
        if (prize.id === 'hammer') {
          if (side === 'red') inventory.weaponRed = 'hammer'
          else inventory.weaponBlue = 'hammer'
        }
      } else if (prize.id === 'coins25') {
        if (side === 'red') redCoins += 25
        else blueCoins += 25
      } else if (prize.id === 'lifeDrink') {
        if (side === 'red') inventory.lifeDrinkRed += 1
        else inventory.lifeDrinkBlue += 1
      } else if (prize.id === 'sus') {
        if (side === 'red') inventory.susRed += 1
        else inventory.susBlue += 1
      } else if (prize.id === 'mcShield') {
        if (side === 'red') inventory.mcShieldRed += 1
        else inventory.mcShieldBlue += 1
      }
    }

    function updateScoreWheelSpin(now = performance.now()) {
      if (!swSpinning) return
      const t = Math.min(1, (now - swSpinStart) / swSpinDuration)
      const ease = 1 - (1 - t) ** 3
      swAngle = swFromAngle + (swToAngle - swFromAngle) * ease
      if (t < 1) return
      swSpinning = false
      swAngle = swToAngle
      const prize = swPending
      swPending = null
      if (prize && scoreWheelSide) {
        applyScoreWheelPrize(scoreWheelSide, prize)
        swResultLabel = prize.label
        swResultUntil = now + 2500
        killstreakMessage = `${scoreWheelSide === 'red' ? 'Röd' : 'Blå'} fick ${prize.label}!`
        killstreakMessageUntil = now + 2800
        spawnBurst(cx, cy, prize.id === 'nuke' ? 2.2 : 1.2)
      }
    }

    function drawScoreWheel() {
      scoreWheelHits.length = 0
      if (!scoreWheelOpen || !scoreWheelSide) return
      if (swNeedSpin && !swSpinning) {
        swNeedSpin = false
        startScoreWheelSpin()
      }
      updateScoreWheelSpin()
      const side = scoreWheelSide
      const panelW = Math.min(440, width * 0.92)
      const panelH = Math.min(500, height * 0.88)
      const px = width * 0.5 - panelW * 0.5
      const py = height * 0.5 - panelH * 0.5
      ctx.save()
      ctx.fillStyle = 'rgba(0,0,0,0.75)'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = '#1a1520'
      ctx.strokeStyle = side === 'red' ? '#ff6b5a' : '#5ec8ff'
      ctx.lineWidth = 3
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') ctx.roundRect(px, py, panelW, panelH, 16)
      else ctx.rect(px, py, panelW, panelH)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#ffe9a0'
      ctx.font = 'bold 26px Syne, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText(`POÄNG ${SCORE_WHEEL_AT}-HJUL`, width * 0.5, py + 14)
      ctx.font = '14px Figtree, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.fillText(
        `${side === 'red' ? 'Röd' : 'Blå'} · belöning till poäng ${SCORE_REWARD_LOSE_AT}`,
        width * 0.5,
        py + 46,
      )
      const cxW = width * 0.5
      const cyW = py + panelH * 0.48
      const radius = Math.min(panelW, panelH) * 0.28
      const n = SCORE_WHEEL_SEGMENTS.length
      const slice = (Math.PI * 2) / n
      ctx.save()
      ctx.translate(cxW, cyW)
      ctx.rotate(swAngle)
      for (let i = 0; i < n; i += 1) {
        const seg = SCORE_WHEEL_SEGMENTS[i]
        const a0 = i * slice
        const a1 = a0 + slice
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, radius, a0, a1)
        ctx.closePath()
        ctx.fillStyle = seg.color
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.35)'
        ctx.lineWidth = 2
        ctx.stroke()
        const mid = a0 + slice * 0.5
        ctx.save()
        ctx.rotate(mid)
        ctx.fillStyle = '#fff'
        ctx.font = `bold ${Math.max(11, Math.floor(radius * 0.1))}px Figtree, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(seg.label, radius * 0.62, 0)
        ctx.restore()
      }
      ctx.beginPath()
      ctx.arc(0, 0, radius * 0.16, 0, Math.PI * 2)
      ctx.fillStyle = '#0f0b14'
      ctx.fill()
      ctx.restore()
      ctx.fillStyle = '#ffe9a0'
      ctx.beginPath()
      ctx.moveTo(cxW, cyW - radius - 4)
      ctx.lineTo(cxW - 12, cyW - radius - 28)
      ctx.lineTo(cxW + 12, cyW - radius - 28)
      ctx.closePath()
      ctx.fill()
      if (swResultLabel && performance.now() < swResultUntil) {
        ctx.fillStyle = '#f0c040'
        ctx.font = 'bold 22px Syne, sans-serif'
        ctx.fillText(`Du fick: ${swResultLabel}`, width * 0.5, cyW + radius + 28)
      }
      const btnW = 130
      const btnH = 40
      const btnY = py + panelH - 56
      const closeX = width * 0.5 - btnW * 0.5
      if (!swSpinning) {
        ctx.fillStyle = '#2a2433'
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'
        ctx.lineWidth = 2
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') ctx.roundRect(closeX, btnY, btnW, btnH, 10)
        else ctx.rect(closeX, btnY, btnW, btnH)
        ctx.fill()
        ctx.stroke()
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 16px Figtree, sans-serif'
        ctx.textBaseline = 'middle'
        ctx.fillText('OK', closeX + btnW * 0.5, btnY + btnH * 0.5)
        scoreWheelHits.push({ x: closeX, y: btnY, w: btnW, h: btnH, id: 'close' })
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.55)'
        ctx.font = '15px Figtree, sans-serif'
        ctx.fillText('Snurrar…', width * 0.5, btnY + 20)
      }
      ctx.restore()
    }

    function useNuke(side) {
      const reward = side === 'red' ? inventory.scoreRewardRed : inventory.scoreRewardBlue
      const used = side === 'red' ? inventory.nukeUsedRed : inventory.nukeUsedBlue
      if (reward !== 'nuke' || used) return false
      const owner =
        side === 'red'
          ? fighters.find((f) => (f.player || f.control === 'wasd') && !f.eliminated)
          : fighters.find((f) => f.control === 'arrows' && !f.eliminated)
      if (!owner) return false
      if (side === 'red') inventory.nukeUsedRed = true
      else inventory.nukeUsedBlue = true
      if (side === 'red') inventory.scoreRewardRed = null
      else inventory.scoreRewardBlue = null
      flash = 1
      shake = 22
      spawnBurst(cx, cy, 4)
      for (let i = 0; i < fighters.length; i += 1) {
        const f = fighters[i]
        if (f === owner || f.eliminated) continue
        f.lives = 0
      }
      killstreakMessage = `${side === 'red' ? 'Röd' : 'Blå'} NUKE!`
      killstreakMessageUntil = performance.now() + 3000
      return true
    }

    function placeWall(fighter) {
      if (!fighter || fighter.eliminated) return false
      const side = isRedSide(fighter) ? 'red' : 'blue'
      const reward = side === 'red' ? inventory.scoreRewardRed : inventory.scoreRewardBlue
      if (reward !== 'hammer') return false
      const ang =
        typeof fighter.knifeAngle === 'number'
          ? fighter.knifeAngle
          : (fighter.face || 1) > 0
            ? 0
            : Math.PI
      const dist = getRadius(fighter) + WALL_LEN * 0.55
      const mx = fighter.x + Math.cos(ang) * dist
      const my = fighter.y + Math.sin(ang) * dist
      walls.push({
        x: mx,
        y: my,
        ang,
        w: WALL_LEN,
        h: WALL_THICK,
        owner: side,
      })
      spawnBurst(mx, my, 0.6)
      return true
    }

    function resolveWallCollisions(ball) {
      if (!ball || ball.eliminated || walls.length === 0) return
      const r = getRadius(ball)
      for (let i = 0; i < walls.length; i += 1) {
        const w = walls[i]
        const cos = Math.cos(-w.ang)
        const sin = Math.sin(-w.ang)
        const dx = ball.x - w.x
        const dy = ball.y - w.y
        const lx = dx * cos - dy * sin
        const ly = dx * sin + dy * cos
        const hx = w.w * 0.5 + r
        const hy = w.h * 0.5 + r
        if (Math.abs(lx) > hx || Math.abs(ly) > hy) continue
        const ox = hx - Math.abs(lx)
        const oy = hy - Math.abs(ly)
        let nlx = lx
        let nly = ly
        if (ox < oy) nlx = lx > 0 ? hx : -hx
        else nly = ly > 0 ? hy : -hy
        const wx = nlx * Math.cos(w.ang) - nly * Math.sin(w.ang)
        const wy = nlx * Math.sin(w.ang) + nly * Math.cos(w.ang)
        ball.x = w.x + wx
        ball.y = w.y + wy
        ball.vx *= 0.4
        ball.vy *= 0.4
      }
    }

    function drawWalls() {
      for (let i = 0; i < walls.length; i += 1) {
        const w = walls[i]
        ctx.save()
        ctx.translate(w.x, w.y)
        ctx.rotate(w.ang)
        ctx.fillStyle = '#92400e'
        ctx.strokeStyle = '#fbbf24'
        ctx.lineWidth = 2
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(-w.w * 0.5, -w.h * 0.5, w.w, w.h, 4)
        } else {
          ctx.rect(-w.w * 0.5, -w.h * 0.5, w.w, w.h)
        }
        ctx.fill()
        ctx.stroke()
        ctx.restore()
      }
    }

    function resetKillstreak(side, opts = {}) {
      const prev =
        side === 'red' ? inventory.killstreakKillsRed : inventory.killstreakKillsBlue
      if (side === 'red') {
        inventory.killstreakKillsRed = 0
        inventory.killstreakSpinsRed = 0
      } else {
        inventory.killstreakKillsBlue = 0
        inventory.killstreakSpinsBlue = 0
      }
      if (prev > 0 && opts.announce !== false) {
        killstreakMessage = `${side === 'red' ? 'Röd' : 'Blå'} dog · killstreak borta!`
        killstreakMessageUntil = performance.now() + 2500
      }
      if (killstreakOpen && killstreakSide === side && !ksSpinning) {
        closeKillstreak()
      }
    }

    function addKillstreakKill(side) {
      if (side === 'red') {
        inventory.killstreakKillsRed += 1
        inventory.killstreakSpinsRed += 1
        killstreakMessage = `Röd killstreak ×${inventory.killstreakKillsRed} · snurr +1`
      } else {
        inventory.killstreakKillsBlue += 1
        inventory.killstreakSpinsBlue += 1
        killstreakMessage = `Blå killstreak ×${inventory.killstreakKillsBlue} · snurr +1`
      }
      killstreakMessageUntil = performance.now() + 2200
    }

    function killstreakWeight(seg, kills) {
      const k = Math.max(0, kills)
      // Efter död / låg streak: nästan bara mid/commons. Hög streak → bra grejer.
      if (k <= 1) {
        if (seg.rarity === 'common') return 42
        if (seg.rarity === 'good') return 4
        if (seg.rarity === 'better') return 0.35
        return 0.12 // jackpot ~0.1%
      }
      if (seg.rarity === 'common') return Math.max(3, 36 - k * 5.5)
      if (seg.rarity === 'good') return 4 + k * 1.5
      if (seg.rarity === 'better') return 0.4 + k * k * 0.4
      // jackpot: k=2 ≈1%, k=5 ≈10%+, k=8 ≈20%+
      return 0.15 + k * k * 0.5
    }

    function jackpotChancePct(kills) {
      const k = Math.max(0, kills)
      let total = 0
      let jack = 0
      for (let i = 0; i < KILLSTREAK_SEGMENTS.length; i += 1) {
        const w = killstreakWeight(KILLSTREAK_SEGMENTS[i], k)
        total += w
        if (KILLSTREAK_SEGMENTS[i].id === 'sus100') jack = w
      }
      return total > 0 ? Math.round((jack / total) * 1000) / 10 : 0
    }

    function pickKillstreakPrize(kills) {
      let total = 0
      const weights = []
      for (let i = 0; i < KILLSTREAK_SEGMENTS.length; i += 1) {
        const w = killstreakWeight(KILLSTREAK_SEGMENTS[i], kills)
        weights.push(w)
        total += w
      }
      let r = Math.random() * total
      for (let i = 0; i < weights.length; i += 1) {
        r -= weights[i]
        if (r <= 0) return i
      }
      return KILLSTREAK_SEGMENTS.length - 1
    }

    function applyKillstreakPrize(side, prize) {
      if (!prize) return
      if (prize.id === 'coins8') {
        if (side === 'red') redCoins += 8
        else blueCoins += 8
      } else if (prize.id === 'coins15') {
        if (side === 'red') redCoins += 15
        else blueCoins += 15
      } else if (prize.id === 'lifeDrink') {
        if (side === 'red') inventory.lifeDrinkRed += 1
        else inventory.lifeDrinkBlue += 1
      } else if (prize.id === 'sus') {
        if (side === 'red') inventory.susRed += 1
        else inventory.susBlue += 1
      } else if (prize.id === 'mcShield') {
        if (side === 'red') inventory.mcShieldRed += 1
        else inventory.mcShieldBlue += 1
      } else if (prize.id === 'bodyguard') {
        const owner =
          side === 'red'
            ? fighters.find((f) => (f.player || f.control === 'wasd') && !f.eliminated)
            : fighters.find((f) => f.control === 'arrows' && !f.eliminated)
        const target = bossMode
          ? fighters.find((f) => f.isBoss && !f.eliminated)
          : fighters.find((f) => f !== owner && !f.eliminated && !f.isBoss)
        if (owner && target) spawnBodyguard(owner, target)
      } else if (prize.id === 'mogger') {
        startMoggerFace(side)
      } else if (prize.id === 'sus100') {
        if (side === 'red') inventory.susRed += 100
        else inventory.susBlue += 100
      }
    }

    function openKillstreak(side) {
      if (killstreakOpen || ksSpinning) return
      killstreakSide = side
      killstreakOpen = true
      ksResultLabel = ''
      ksPendingPrize = null
    }

    function closeKillstreak() {
      if (ksSpinning) return
      killstreakOpen = false
      killstreakSide = null
      ksResultLabel = ''
      ksPendingPrize = null
    }

    function startKillstreakSpin() {
      if (!killstreakOpen || !killstreakSide || ksSpinning) return
      const side = killstreakSide
      const spins =
        side === 'red' ? inventory.killstreakSpinsRed : inventory.killstreakSpinsBlue
      const kills =
        side === 'red' ? inventory.killstreakKillsRed : inventory.killstreakKillsBlue
      if (spins <= 0) return

      if (side === 'red') inventory.killstreakSpinsRed -= 1
      else inventory.killstreakSpinsBlue -= 1

      const idx = pickKillstreakPrize(kills)
      const prize = KILLSTREAK_SEGMENTS[idx]
      const n = KILLSTREAK_SEGMENTS.length
      const slice = (Math.PI * 2) / n
      // Pekare uppåt (−π/2): mitt på segment idx ska landa där
      const segmentCenter = idx * slice + slice * 0.5
      const extraTurns = 4 + Math.floor(Math.random() * 3)
      const current = ((ksWheelAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
      const desired = ((-Math.PI / 2 - segmentCenter) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)
      let delta = desired - current
      if (delta < 0) delta += Math.PI * 2

      ksFromAngle = ksWheelAngle
      ksToAngle = ksWheelAngle + extraTurns * Math.PI * 2 + delta
      ksPendingPrize = prize
      ksSpinning = true
      ksSpinStart = performance.now()
      ksResultLabel = ''
    }

    function updateKillstreakSpin(now = performance.now()) {
      if (!ksSpinning) return
      const t = Math.min(1, (now - ksSpinStart) / ksSpinDuration)
      const ease = 1 - (1 - t) ** 3
      ksWheelAngle = ksFromAngle + (ksToAngle - ksFromAngle) * ease
      if (t < 1) return
      ksSpinning = false
      ksWheelAngle = ksToAngle
      const prize = ksPendingPrize
      ksPendingPrize = null
      if (prize && killstreakSide) {
        applyKillstreakPrize(killstreakSide, prize)
        ksResultLabel = prize.label
        ksResultUntil = now + 2800
        killstreakMessage = `${killstreakSide === 'red' ? 'Röd' : 'Blå'} fick ${prize.label}!`
        killstreakMessageUntil = now + 2800
        spawnBurst(cx, cy, prize.id === 'sus100' ? 2.4 : 1.2)
        if (prize.id === 'sus100') {
          flash = Math.min(0.8, flash + 0.45)
          shake = Math.min(18, shake + 10)
        }
      }
    }

    function drawKillstreakWheel() {
      killstreakHits.length = 0
      if (!killstreakOpen || !killstreakSide) return
      updateKillstreakSpin()

      const side = killstreakSide
      const kills =
        side === 'red' ? inventory.killstreakKillsRed : inventory.killstreakKillsBlue
      const spins =
        side === 'red' ? inventory.killstreakSpinsRed : inventory.killstreakSpinsBlue
      const jackPct = jackpotChancePct(kills)

      const panelW = Math.min(460, width * 0.92)
      const panelH = Math.min(520, height * 0.9)
      const px = width * 0.5 - panelW * 0.5
      const py = height * 0.5 - panelH * 0.5

      ctx.save()
      ctx.fillStyle = 'rgba(0,0,0,0.72)'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = '#1a1520'
      ctx.strokeStyle = side === 'red' ? '#ff6b5a' : '#5ec8ff'
      ctx.lineWidth = 3
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') ctx.roundRect(px, py, panelW, panelH, 16)
      else ctx.rect(px, py, panelW, panelH)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#ffe9a0'
      ctx.font = 'bold 28px Syne, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText('KILLSTREAK-HJUL', width * 0.5, py + 14)
      ctx.font = '14px Figtree, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.fillText(
        `${side === 'red' ? 'Röd' : 'Blå'} · kills ${kills} · snurr ${spins} · jackpot ~${jackPct}%`,
        width * 0.5,
        py + 48,
      )

      const cxW = width * 0.5
      const cyW = py + panelH * 0.48
      const radius = Math.min(panelW, panelH) * 0.28
      const n = KILLSTREAK_SEGMENTS.length
      const slice = (Math.PI * 2) / n

      ctx.save()
      ctx.translate(cxW, cyW)
      ctx.rotate(ksWheelAngle)
      for (let i = 0; i < n; i += 1) {
        const seg = KILLSTREAK_SEGMENTS[i]
        const a0 = i * slice
        const a1 = a0 + slice
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, radius, a0, a1)
        ctx.closePath()
        ctx.fillStyle = seg.color
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.35)'
        ctx.lineWidth = 2
        ctx.stroke()

        const mid = a0 + slice * 0.5
        ctx.save()
        ctx.rotate(mid)
        ctx.fillStyle = seg.rarity === 'jackpot' ? '#1a1208' : '#ffffff'
        ctx.font = `bold ${Math.max(11, Math.floor(radius * 0.11))}px Figtree, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(seg.label, radius * 0.62, 0)
        ctx.restore()
      }
      ctx.beginPath()
      ctx.arc(0, 0, radius * 0.18, 0, Math.PI * 2)
      ctx.fillStyle = '#0f0b14'
      ctx.fill()
      ctx.restore()

      // Pekare
      ctx.fillStyle = '#ffe9a0'
      ctx.beginPath()
      ctx.moveTo(cxW, cyW - radius - 4)
      ctx.lineTo(cxW - 12, cyW - radius - 28)
      ctx.lineTo(cxW + 12, cyW - radius - 28)
      ctx.closePath()
      ctx.fill()

      if (ksResultLabel && performance.now() < ksResultUntil) {
        ctx.fillStyle = '#f0c040'
        ctx.font = 'bold 22px Syne, sans-serif'
        ctx.fillText(`Du fick: ${ksResultLabel}`, width * 0.5, cyW + radius + 28)
      } else if (spins <= 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.55)'
        ctx.font = '15px Figtree, sans-serif'
        ctx.fillText('Döda någon för att få en snurr', width * 0.5, cyW + radius + 28)
      }

      const btnW = 120
      const btnH = 40
      const spinX = width * 0.5 - btnW - 10
      const closeX = width * 0.5 + 10
      const btnY = py + panelH - 58
      const canSpin = spins > 0 && !ksSpinning

      ctx.fillStyle = canSpin ? '#f0c040' : '#3a3344'
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') ctx.roundRect(spinX, btnY, btnW, btnH, 10)
      else ctx.rect(spinX, btnY, btnW, btnH)
      ctx.fill()
      ctx.fillStyle = canSpin ? '#2a1c08' : 'rgba(255,255,255,0.4)'
      ctx.font = 'bold 16px Figtree, sans-serif'
      ctx.textBaseline = 'middle'
      ctx.fillText(ksSpinning ? 'Snurrar…' : 'SNURR', spinX + btnW * 0.5, btnY + btnH * 0.5)
      if (canSpin) killstreakHits.push({ x: spinX, y: btnY, w: btnW, h: btnH, id: 'spin' })

      ctx.fillStyle = '#2a2433'
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'
      ctx.lineWidth = 2
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') ctx.roundRect(closeX, btnY, btnW, btnH, 10)
      else ctx.rect(closeX, btnY, btnW, btnH)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#ffffff'
      ctx.fillText('STÄNG', closeX + btnW * 0.5, btnY + btnH * 0.5)
      if (!ksSpinning) killstreakHits.push({ x: closeX, y: btnY, w: btnW, h: btnH, id: 'close' })

      ctx.restore()
    }

    function shopPrice(cost) {
      return shopFree ? 0 : cost
    }

    function sideCoins(side) {
      return side === 'red' ? redCoins : blueCoins
    }

    function canAfford(side, cost) {
      const price = shopPrice(cost)
      if (price <= 0) return true
      return sideCoins(side) >= price
    }

    function payCoins(side, cost) {
      const price = shopPrice(cost)
      if (price <= 0) return true
      if (side === 'red') {
        if (redCoins < price) return false
        redCoins -= price
        return true
      }
      if (blueCoins < price) return false
      blueCoins -= price
      return true
    }

    function openShop() {
      if (shopOpen || codesOpen || weaponSelectOpen || winner || bossMode) return
      clearKeys()
      shopPausedAt = performance.now()
      shopOpen = true
    }

    function closeShop() {
      if (!shopOpen) return
      if (killstreakOpen) closeKillstreak()
      if (ksSpinning) return
      if (shopPausedAt > 0) {
        shiftPausedTimers(performance.now() - shopPausedAt)
        shopPausedAt = 0
      }
      shopOpen = false

      const winSide = pendingWinAfterShop
      const startBoss = pendingBossAfterShop
      pendingWinAfterShop = null
      pendingBossAfterShop = false

      if (winSide) {
        winner = winSide
        winnerUntil = performance.now() + 3000
        return
      }
      if (pendingScoreWheel) {
        const side = pendingScoreWheel
        pendingScoreWheel = null
        openScoreWheel(side)
        return
      }
      if (startBoss && !bossMode && !winner) {
        startBossFight()
      }
    }

    function drawShopButton() {
      const w = 120
      const h = 42
      const gap = 12
      const shopX = width * 0.5 - w - gap * 0.5
      const codesX = width * 0.5 + gap * 0.5
      const y = Math.max(96, cy - arenaR - 58)
      shopButton = { x: shopX, y, w, h }
      codesButton = { x: codesX, y, w, h }

      ctx.save()
      // SHOP (öppnas automatiskt vid milestones; knappen går alltid att klicka)
      const grad = ctx.createLinearGradient(shopX, y, shopX, y + h)
      grad.addColorStop(0, '#f0c040')
      grad.addColorStop(1, '#c49220')
      ctx.strokeStyle = '#ffe9a0'
      ctx.fillStyle = grad
      ctx.lineWidth = 2
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') ctx.roundRect(shopX, y, w, h, 10)
      else ctx.rect(shopX, y, w, h)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#2a1c08'
      ctx.font = 'bold 20px Syne, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('SHOP', shopX + w * 0.5, y + h * 0.5)

      // CODES
      const cGrad = ctx.createLinearGradient(codesX, y, codesX, y + h)
      cGrad.addColorStop(0, '#a78bfa')
      cGrad.addColorStop(1, '#6d28d9')
      ctx.fillStyle = cGrad
      ctx.strokeStyle = '#ddd6fe'
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') ctx.roundRect(codesX, y, w, h, 10)
      else ctx.rect(codesX, y, w, h)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#f5f3ff'
      ctx.fillText('CODES', codesX + w * 0.5, y + h * 0.5)

      ctx.font = '600 11px Figtree, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.fillText('auto-shop 10→100', width * 0.5, y + h + 14)
      ctx.restore()
    }

    function openCodes() {
      if (codesOpen || shopOpen || weaponSelectOpen || winner || bossMode) return
      clearKeys()
      shopPausedAt = performance.now()
      codesOpen = true
      codesInput = ''
      codesMessage = ''
      codesMessageUntil = 0
    }

    function openWeaponSelect() {
      clearKeys()
      pickRed = null
      pickBlue = null
      inventory.weaponRed = null
      inventory.weaponBlue = null
      inventory.startWeaponRed = null
      inventory.startWeaponBlue = null
      weaponSelectPausedAt = performance.now()
      weaponSelectOpen = true
    }

    function closeWeaponSelect() {
      if (!weaponSelectOpen) return
      if (weaponSelectPausedAt > 0) {
        shiftPausedTimers(performance.now() - weaponSelectPausedAt)
        weaponSelectPausedAt = 0
      }
      weaponSelectOpen = false
    }

    function applyWeaponPick(side, weapon) {
      if (weapon !== 'bow' && weapon !== 'sword') return
      if (side === 'red') {
        pickRed = weapon
        inventory.weaponRed = weapon
        inventory.startWeaponRed = weapon
        inventory.swordLevelRed = 0
        inventory.bowLevelRed = 0
      } else {
        pickBlue = weapon
        inventory.weaponBlue = weapon
        inventory.startWeaponBlue = weapon
        inventory.swordLevelBlue = 0
        inventory.bowLevelBlue = 0
      }
    }

    function confirmWeaponSelect() {
      if (!weaponSelectOpen) return
      // Saknad spelare får pilbåge som standard
      if (!pickRed) applyWeaponPick('red', 'bow')
      if (!pickBlue) applyWeaponPick('blue', 'bow')
      closeWeaponSelect()
    }

    function drawWeaponSelect() {
      weaponSelectHits.length = 0
      if (!weaponSelectOpen) return

      ctx.save()
      ctx.fillStyle = 'rgba(0,0,0,0.78)'
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = '#ffe9a0'
      ctx.font = 'bold 44px Syne, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('VÄLJ VAPEN', width * 0.5, height * 0.1)

      ctx.font = '600 16px Figtree, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.75)'
      ctx.fillText('Pilbåge skjuter · Svärd slår · Enter / Starta för att köra', width * 0.5, height * 0.155)

      const cardW = Math.min(300, width * 0.42)
      const cardH = Math.min(340, height * 0.56)
      const gap = Math.min(40, width * 0.05)
      const leftX = width * 0.5 - cardW - gap * 0.5
      const rightX = width * 0.5 + gap * 0.5
      const cardY = height * 0.5 - cardH * 0.48

      function drawPickCard(x, y, w, h, side, picked) {
        const isRed = side === 'red'
        ctx.fillStyle = '#1a1520'
        ctx.strokeStyle = isRed ? '#ff6b5a' : '#5ec8ff'
        ctx.lineWidth = 3
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, w, h, 16)
        else ctx.rect(x, y, w, h)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = isRed ? '#ff6b5a' : '#5ec8ff'
        ctx.font = 'bold 26px Syne, sans-serif'
        ctx.fillText(isRed ? 'RÖD' : 'BLÅ', x + w * 0.5, y + 34)

        ctx.fillStyle = 'rgba(255,255,255,0.55)'
        ctx.font = '13px Figtree, sans-serif'
        ctx.fillText(isRed ? 'Q = båge · E = svärd' : '1 = båge · 2 = svärd', x + w * 0.5, y + 58)

        const btnW = w - 40
        const btnH = 64
        const bowY = y + 90
        const swordY = y + 170

        const options = [
          {
            id: `${side}-bow`,
            weapon: 'bow',
            label: 'Pilbåge',
            sub: 'Skjuter pilar på avstånd',
            by: bowY,
          },
          {
            id: `${side}-sword`,
            weapon: 'sword',
            label: 'Svärd',
            sub: 'Slår i närstrid · 3 dmg',
            by: swordY,
          },
        ]

        options.forEach((opt) => {
          const bx = x + 20
          const chosen = picked === opt.weapon
          const grad = ctx.createLinearGradient(bx, opt.by, bx, opt.by + btnH)
          if (chosen) {
            grad.addColorStop(0, isRed ? '#ff8a70' : '#7ae0ff')
            grad.addColorStop(1, isRed ? '#ff4d3a' : '#2ec8ff')
          } else {
            grad.addColorStop(0, '#2a2433')
            grad.addColorStop(1, '#1f1a28')
          }
          ctx.fillStyle = grad
          ctx.strokeStyle = chosen ? '#ffe9a0' : 'rgba(255,255,255,0.22)'
          ctx.lineWidth = chosen ? 3 : 1.5
          ctx.beginPath()
          if (typeof ctx.roundRect === 'function') ctx.roundRect(bx, opt.by, btnW, btnH, 12)
          else ctx.rect(bx, opt.by, btnW, btnH)
          ctx.fill()
          ctx.stroke()

          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 22px Figtree, sans-serif'
          ctx.fillText(opt.label, x + w * 0.5, opt.by + 24)
          ctx.fillStyle = 'rgba(255,255,255,0.7)'
          ctx.font = '13px Figtree, sans-serif'
          ctx.fillText(opt.sub, x + w * 0.5, opt.by + 46)

          weaponSelectHits.push({ x: bx, y: opt.by, w: btnW, h: btnH, id: opt.id })
        })

        ctx.fillStyle = picked ? '#86efac' : 'rgba(255,255,255,0.45)'
        ctx.font = 'bold 15px Figtree, sans-serif'
        ctx.fillText(
          picked ? `Valt: ${picked === 'bow' ? 'Pilbåge' : 'Svärd'}` : 'Välj ett vapen',
          x + w * 0.5,
          y + h - 24,
        )
      }

      drawPickCard(leftX, cardY, cardW, cardH, 'red', pickRed)
      drawPickCard(rightX, cardY, cardW, cardH, 'blue', pickBlue)

      // Start-knapp
      const startW = Math.min(280, width * 0.5)
      const startH = 54
      const startX = width * 0.5 - startW * 0.5
      const startY = Math.min(height - 70, cardY + cardH + 24)
      const ready = !!(pickRed || pickBlue)
      const sGrad = ctx.createLinearGradient(startX, startY, startX, startY + startH)
      if (ready) {
        sGrad.addColorStop(0, '#f0c040')
        sGrad.addColorStop(1, '#c49220')
      } else {
        sGrad.addColorStop(0, '#4b5563')
        sGrad.addColorStop(1, '#374151')
      }
      ctx.fillStyle = sGrad
      ctx.strokeStyle = ready ? '#ffe9a0' : '#6b7280'
      ctx.lineWidth = 2
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') ctx.roundRect(startX, startY, startW, startH, 12)
      else ctx.rect(startX, startY, startW, startH)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = ready ? '#2a1c08' : '#d1d5db'
      ctx.font = 'bold 22px Syne, sans-serif'
      ctx.fillText(ready ? 'STARTA' : 'Välj minst ett vapen', width * 0.5, startY + startH * 0.5)
      if (ready) {
        weaponSelectHits.push({ x: startX, y: startY, w: startW, h: startH, id: 'start' })
      }

      ctx.restore()
    }

    function closeCodes() {
      if (!codesOpen) return
      if (shopPausedAt > 0 && !shopOpen) {
        shiftPausedTimers(performance.now() - shopPausedAt)
        shopPausedAt = 0
      }
      codesOpen = false
      codesInput = ''
      codesMessage = ''
    }

    function submitCode() {
      const typed = codesInput.trim().toLowerCase()
      if (typed === MJOLK_CODE) {
        codesLockedExceptBoss = true
        otisPower = false
        nerminPower = false
        codesMessage = 'Mjölk! Alla koder borta · bara grön boss kvar'
        codesMessageUntil = performance.now() + 3500
        codesInput = ''
        spawnBurst(cx, cy, 1.8)
        triggerCheer()
        return
      }
      if (typed === GRON_BOSS_CODE) {
        if (bossMode) {
          codesMessage = 'Boss redan igång'
          codesMessageUntil = performance.now() + 2000
          codesInput = ''
          return
        }
        closeCodes()
        bossTriggeredThisMatch = true
        startBossFight()
        codesMessage = 'Grön boss!'
        codesMessageUntil = performance.now() + 3000
        spawnBurst(cx, cy, 2.5)
        triggerCheer()
        flash = Math.min(0.8, flash + 0.5)
        shake = Math.min(18, shake + 10)
        return
      }
      if (codesLockedExceptBoss) {
        codesMessage = 'Koden är avstängd (mjölk)'
        codesMessageUntil = performance.now() + 2000
        codesInput = ''
        return
      }
      if (typed === RED_COINS_CODE) {
        redCoins += RED_COINS_CODE_REWARD
        codesMessage = `Röd +${RED_COINS_CODE_REWARD} coins`
        codesMessageUntil = performance.now() + 2500
        codesInput = ''
        spawnBurst(cx, cy, 1.6)
        triggerCheer()
        return
      }
      if (typed === SECRET_CODE) {
        if (codeUsesLeft <= 0) {
          codesMessage = 'Koden är slut (0 kvar)'
          codesMessageUntil = performance.now() + 2000
          codesInput = ''
          return
        }
        codeUsesLeft -= 1
        redCoins += SECRET_CODE_REWARD
        blueCoins += SECRET_CODE_REWARD
        codesMessage = `+${SECRET_CODE_REWARD} guld · ${codeUsesLeft} kvar`
        codesMessageUntil = performance.now() + 2500
        codesInput = ''
        spawnBurst(cx, cy, 1.5)
        triggerCheer()
        return
      }
      if (typed === OTIS_CODE) {
        otisPower = true
        codesMessage = `Ötis! Pilbåge & svärd = ${OTIS_DAMAGE} dmg`
        codesMessageUntil = performance.now() + 3000
        codesInput = ''
        spawnBurst(cx, cy, 2)
        triggerCheer()
        flash = Math.min(0.7, flash + 0.4)
        return
      }
      if (typed === NERMIN_CODE) {
        nerminPower = true
        // Ta bort kniv — bara armar/ben
        inventory.knifeOwnedRed = false
        inventory.knifeOwnedBlue = false
        if (inventory.weaponRed === 'knife') {
          inventory.weaponRed = inventory.startWeaponRed || null
        }
        if (inventory.weaponBlue === 'knife') {
          inventory.weaponBlue = inventory.startWeaponBlue || null
        }
        for (let i = 0; i < fighters.length; i += 1) {
          const f = fighters[i]
          if (f.meleeKind === 'knife') f.meleeKind = 'limb'
          if (f.knifeEquipped && f.meleeKind === 'knife') f.knifeEquipped = false
        }
        codesMessage = `Nermin! Tjockis · armar/ben · ${NERMIN_DAMAGE} dmg`
        codesMessageUntil = performance.now() + 3500
        codesInput = ''
        spawnBurst(cx, cy, 2.4)
        triggerCheer()
        flash = Math.min(0.75, flash + 0.45)
        shake = Math.min(16, shake + 8)
        return
      }
      if (typed === ALI_CODE) {
        inventory.pistolUnlockedRed = true
        inventory.pistolUnlockedBlue = true
        inventory.pistolRed = true
        inventory.pistolBlue = true
        inventory.pistolLevelRed = Math.max(inventory.pistolLevelRed, PISTOL_RPG_LEVEL)
        inventory.pistolLevelBlue = Math.max(inventory.pistolLevelBlue, PISTOL_RPG_LEVEL)
        equipPistolForm('red')
        equipPistolForm('blue')
        codesMessage = `Ali! RPG · ${rpgDamageForLevel(PISTOL_RPG_LEVEL)} träff + eld ${RPG_FIRE_DAMAGE}/s · 3s`
        codesMessageUntil = performance.now() + 3500
        codesInput = ''
        spawnBurst(cx, cy, 2.2)
        triggerCheer()
        flash = Math.min(0.7, flash + 0.35)
        shake = Math.min(14, shake + 6)
        return
      }
      codesMessage = 'Fel kod'
      codesMessageUntil = performance.now() + 1500
      codesInput = ''
    }

    function drawCodes() {
      if (!codesOpen) return
      const panelW = Math.min(360, width * 0.88)
      const panelH = 240
      const px = width * 0.5 - panelW * 0.5
      const py = height * 0.5 - panelH * 0.5
      const now = performance.now()

      ctx.save()
      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = '#1a1520'
      ctx.strokeStyle = '#a78bfa'
      ctx.lineWidth = 3
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') ctx.roundRect(px, py, panelW, panelH, 14)
      else ctx.rect(px, py, panelW, panelH)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#ddd6fe'
      ctx.font = 'bold 28px Syne, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText('CODES', width * 0.5, py + 20)

      ctx.font = '14px Figtree, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.6)'
      ctx.fillText(
        `Skriv kod · Enter = OK · Esc = stäng · ${codeUsesLeft} användningar kvar`,
        width * 0.5,
        py + 58,
      )

      // Input box
      const ix = px + 36
      const iy = py + 100
      const iw = panelW - 72
      const ih = 48
      ctx.fillStyle = '#0f0b14'
      ctx.strokeStyle = '#c4b5fd'
      ctx.lineWidth = 2
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') ctx.roundRect(ix, iy, iw, ih, 10)
      else ctx.rect(ix, iy, iw, ih)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 28px Syne, sans-serif'
      ctx.textBaseline = 'middle'
      const display = codesInput.length ? codesInput : '····'
      ctx.fillStyle = codesInput.length ? '#ffffff' : 'rgba(255,255,255,0.25)'
      ctx.fillText(display, width * 0.5, iy + ih * 0.5)

      if (codesMessage && now < codesMessageUntil) {
        ctx.fillStyle =
          codesMessage.startsWith('+') || codesMessage.startsWith('Ötis')
            ? '#86efac'
            : '#fca5a5'
        ctx.font = '600 16px Figtree, sans-serif'
        ctx.fillText(codesMessage, width * 0.5, iy + ih + 36)
      }

      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.font = 'bold 22px Syne, sans-serif'
      ctx.fillText('✕', width * 0.5, py + panelH - 28)
      ctx.restore()
    }

    function drawShop() {
      shopHits.length = 0
      if (!shopOpen) return

      const panelW = Math.min(760, width * 0.96)
      const panelH = Math.min(640, height * 0.94)
      const px = width * 0.5 - panelW * 0.5
      const py = height * 0.5 - panelH * 0.5
      const midX = px + panelW * 0.5
      const colPad = 16
      const colW = panelW * 0.5 - colPad * 1.5

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
      ctx.fillText('SHOP', width * 0.5, py + 12)

      ctx.font = '13px Figtree, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.65)'
      ctx.fillText(
        shopFree
          ? `Blå: ${blueCoins} 🪙   ·   Röd: ${redCoins} 🪙   · GRATIS`
          : `Blå: ${blueCoins} 🪙   ·   Röd: ${redCoins} 🪙`,
        width * 0.5,
        py + 44,
      )

      const swordCostRed = shopPrice(linearWeaponUpgradeCost(inventory.swordLevelRed))
      const swordCostBlue = shopPrice(linearWeaponUpgradeCost(inventory.swordLevelBlue))
      const bowCostRed = shopPrice(linearWeaponUpgradeCost(inventory.bowLevelRed))
      const bowCostBlue = shopPrice(linearWeaponUpgradeCost(inventory.bowLevelBlue))
      const items = []

      // Startvapen låser: svärd/kniv ↔ pilbåge
      const redCanSword = inventory.startWeaponRed !== 'bow'
      const blueCanSword = inventory.startWeaponBlue !== 'bow'
      const redCanBow = inventory.startWeaponRed !== 'sword'
      const blueCanBow = inventory.startWeaponBlue !== 'sword'

      if (redCanSword) {
        items.push({
          id: 'swordRed',
          title: materialUpgradeTitle('sword', inventory.swordLevelRed),
          desc: `R · Q · ${swordDamageFor({ player: true })} dmg`,
          cost: canUpgradeMaterial(inventory.swordLevelRed) ? swordCostRed : 0,
          side: 'Röd',
          owned: inventory.swordLevelRed,
          canBuy:
            (canUpgradeMaterial(inventory.swordLevelRed) && canAfford('red', swordCostRed)) ||
            inventory.weaponRed !== 'sword',
        })
      }
      if (blueCanSword) {
        items.push({
          id: 'swordBlue',
          title: materialUpgradeTitle('sword', inventory.swordLevelBlue),
          desc: `B · 1 · ${swordDamageFor({ control: 'arrows' })} dmg`,
          cost: canUpgradeMaterial(inventory.swordLevelBlue) ? swordCostBlue : 0,
          side: 'Blå',
          owned: inventory.swordLevelBlue,
          canBuy:
            (canUpgradeMaterial(inventory.swordLevelBlue) && canAfford('blue', swordCostBlue)) ||
            inventory.weaponBlue !== 'sword',
        })
      }
      if (redCanBow) {
        items.push({
          id: 'bowRed',
          title: materialUpgradeTitle('bow', inventory.bowLevelRed),
          desc: `R · Q · pil ${BOW_DAMAGE + inventory.bowLevelRed} dmg`,
          cost: canUpgradeBow(inventory.bowLevelRed) ? bowCostRed : 0,
          side: 'Röd',
          owned: inventory.bowLevelRed,
          canBuy:
            (canUpgradeBow(inventory.bowLevelRed) && canAfford('red', bowCostRed)) ||
            (inventory.weaponRed !== 'bow' && inventory.weaponRed !== 'nokia'),
        })
        items.push({
          id: 'nokiaRed',
          title: inventory.nokiaRed ? 'Nokia (utrustad)' : 'Nokia-pilbåge',
          desc: `R · Q · ${NOKIA_HIT_DAMAGE} + bränn · 112/123`,
          cost: inventory.nokiaRed ? 0 : shopPrice(NOKIA_COST),
          side: 'Röd',
          owned: inventory.nokiaRed ? 1 : 0,
          canBuy:
            inventory.weaponRed !== 'nokia' &&
            (inventory.nokiaRed || canAfford('red', NOKIA_COST)),
        })
      }
      if (blueCanBow) {
        items.push({
          id: 'bowBlue',
          title: materialUpgradeTitle('bow', inventory.bowLevelBlue),
          desc: `B · 1 · pil ${BOW_DAMAGE + inventory.bowLevelBlue} dmg`,
          cost: canUpgradeBow(inventory.bowLevelBlue) ? bowCostBlue : 0,
          side: 'Blå',
          owned: inventory.bowLevelBlue,
          canBuy:
            (canUpgradeBow(inventory.bowLevelBlue) && canAfford('blue', bowCostBlue)) ||
            (inventory.weaponBlue !== 'bow' && inventory.weaponBlue !== 'nokia'),
        })
        items.push({
          id: 'nokiaBlue',
          title: inventory.nokiaBlue ? 'Nokia (utrustad)' : 'Nokia-pilbåge',
          desc: `B · 1 · ${NOKIA_HIT_DAMAGE} + bränn · 112/123`,
          cost: inventory.nokiaBlue ? 0 : shopPrice(NOKIA_COST),
          side: 'Blå',
          owned: inventory.nokiaBlue ? 1 : 0,
          canBuy:
            inventory.weaponBlue !== 'nokia' &&
            (inventory.nokiaBlue || canAfford('blue', NOKIA_COST)),
        })
      }

      const pistolCostRed = shopPrice(pistolUpgradeCost(inventory.pistolLevelRed))
      const pistolCostBlue = shopPrice(pistolUpgradeCost(inventory.pistolLevelBlue))

      // Pistol syns bara i shopen för den som blivit kidnappad av polisen
      if (inventory.pistolUnlockedRed) {
        const owned = inventory.pistolRed
        const level = inventory.pistolLevelRed
        const canUp = owned && canUpgradePistol(level)
        const preview = pistolShopPreview(level)
        const form = pistolFormForLevel(level)
        const title = !owned
          ? 'Pistol'
          : canUp
            ? `${preview.title} ${nextPistolUpgradeLabel(level)}`
            : inventory.weaponRed === form
              ? `${preview.title} MAX`
              : preview.title
        const cost = !owned
          ? shopPrice(PISTOL_COST)
          : canUp
            ? pistolCostRed
            : 0
        items.push({
          id: 'pistolRed',
          title,
          desc: `R · Q · ${preview.desc}`,
          cost,
          side: 'Röd',
          owned: owned ? level : 0,
          canBuy:
            (!owned && canAfford('red', PISTOL_COST)) ||
            (canUp && canAfford('red', pistolCostRed)) ||
            (owned && inventory.weaponRed !== form),
        })
      }
      if (inventory.pistolUnlockedBlue) {
        const owned = inventory.pistolBlue
        const level = inventory.pistolLevelBlue
        const canUp = owned && canUpgradePistol(level)
        const preview = pistolShopPreview(level)
        const form = pistolFormForLevel(level)
        const title = !owned
          ? 'Pistol'
          : canUp
            ? `${preview.title} ${nextPistolUpgradeLabel(level)}`
            : inventory.weaponBlue === form
              ? `${preview.title} MAX`
              : preview.title
        const cost = !owned
          ? shopPrice(PISTOL_COST)
          : canUp
            ? pistolCostBlue
            : 0
        items.push({
          id: 'pistolBlue',
          title,
          desc: `B · 1 · ${preview.desc}`,
          cost,
          side: 'Blå',
          owned: owned ? level : 0,
          canBuy:
            (!owned && canAfford('blue', PISTOL_COST)) ||
            (canUp && canAfford('blue', pistolCostBlue)) ||
            (owned && inventory.weaponBlue !== form),
        })
      }

      items.push(
        {
          id: 'mcShieldRed',
          title: 'Minecraft-sköld',
          desc: `R · F · odödlig ${MC_SHIELD_DURATION / 1000}s`,
          cost: shopPrice(MC_SHIELD_COST),
          side: 'Röd',
          owned: inventory.mcShieldRed,
          canBuy: canAfford('red', MC_SHIELD_COST),
        },
        {
          id: 'mcShieldBlue',
          title: 'Minecraft-sköld',
          desc: `B · 2 · odödlig ${MC_SHIELD_DURATION / 1000}s`,
          cost: shopPrice(MC_SHIELD_COST),
          side: 'Blå',
          owned: inventory.mcShieldBlue,
          canBuy: canAfford('blue', MC_SHIELD_COST),
        },
        {
          id: 'lifeDrinkRed',
          title: 'Livedryck',
          desc: `R · R · +${LIFE_DRINK_HEAL} liv (fullt = +max)`,
          cost: shopPrice(LIFE_DRINK_COST),
          side: 'Röd',
          owned: inventory.lifeDrinkRed,
          canBuy: canAfford('red', LIFE_DRINK_COST),
        },
        {
          id: 'lifeDrinkBlue',
          title: 'Livedryck',
          desc: `B · 3 · +${LIFE_DRINK_HEAL} liv (fullt = +max)`,
          cost: shopPrice(LIFE_DRINK_COST),
          side: 'Blå',
          owned: inventory.lifeDrinkBlue,
          canBuy: canAfford('blue', LIFE_DRINK_COST),
        },
        {
          id: 'bodyguardRed',
          title: 'Bodyguard',
          desc: 'R · lila · 1/sek · 6.7s',
          cost: shopPrice(BODYGUARD_COST),
          side: 'Röd',
          owned: bodyguards.filter((g) => g.owner?.player).length,
          canBuy: canAfford('red', BODYGUARD_COST),
        },
        {
          id: 'bodyguardBlue',
          title: 'Bodyguard',
          desc: 'B · lila · 1/sek · 6.7s',
          cost: shopPrice(BODYGUARD_COST),
          side: 'Blå',
          owned: bodyguards.filter((g) => g.owner && !g.owner.player).length,
          canBuy: canAfford('blue', BODYGUARD_COST),
        },
        {
          id: 'susRed',
          title: 'Sus',
          desc: `R · R · radie · ${SUS_DAMAGE}/sek · 10s`,
          cost: shopPrice(SUS_COST),
          side: 'Röd',
          owned: inventory.susRed,
          canBuy: canAfford('red', SUS_COST),
        },
        {
          id: 'susBlue',
          title: 'Sus',
          desc: `B · 0 · radie · ${SUS_DAMAGE}/sek · 10s`,
          cost: shopPrice(SUS_COST),
          side: 'Blå',
          owned: inventory.susBlue,
          canBuy: canAfford('blue', SUS_COST),
        },
        {
          id: 'moggerRed',
          title: 'Moger Face',
          desc: `R · svart bana · ${MOGGER_DAMAGE}/sek · 15s`,
          cost: shopPrice(MOGGER_COST),
          side: 'Röd',
          owned: moggerUntil > 0 && moggerOwner === 'red' ? 1 : 0,
          canBuy: canAfford('red', MOGGER_COST),
        },
        {
          id: 'moggerBlue',
          title: 'Moger Face',
          desc: `B · svart bana · ${MOGGER_DAMAGE}/sek · 15s`,
          cost: shopPrice(MOGGER_COST),
          side: 'Blå',
          owned: moggerUntil > 0 && moggerOwner === 'blue' ? 1 : 0,
          canBuy: canAfford('blue', MOGGER_COST),
        },
      )

      const blueItems = items.filter((it) => it.side === 'Blå')
      const redItems = items.filter((it) => it.side === 'Röd')
      const startY = py + 88
      const rowH = 34
      const btnW = 78
      const btnH = 24
      const ksRowH = rowH * 2
      const ksBtnW = btnW * 2
      const ksBtnH = btnH * 2
      const ksBandH = ksRowH + 16
      const listBottom = py + panelH - 48 - ksBandH

      // Mittstreck: blå vänster, röd höger
      ctx.beginPath()
      ctx.moveTo(midX, py + 72)
      ctx.lineTo(midX, listBottom)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.font = 'bold 16px Syne, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillStyle = '#5ec8ff'
      ctx.fillText('BLÅ', px + colPad + colW * 0.5, py + 66)
      ctx.fillStyle = '#ff6b5a'
      ctx.fillText('RÖD', midX + colPad + colW * 0.5, py + 66)

      function drawShopColumn(colItems, colX) {
        if (colItems.length === 0) {
          ctx.textAlign = 'center'
          ctx.fillStyle = 'rgba(255,255,255,0.4)'
          ctx.font = '14px Figtree, sans-serif'
          ctx.fillText('Inga varor', colX + colW * 0.5, startY + 24)
          return
        }
        colItems.forEach((item, i) => {
          const y = startY + i * rowH
          if (y + rowH > listBottom) return
          const bx = colX + colW - btnW
          const by = y + 8

          ctx.textAlign = 'left'
          ctx.textBaseline = 'top'
          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 12px Figtree, sans-serif'
          ctx.fillText(item.title, colX, y + 1)
          ctx.font = '10px Figtree, sans-serif'
          ctx.fillStyle = 'rgba(255,255,255,0.55)'
          ctx.fillText(`${item.desc} · äger ${item.owned}`, colX, y + 16)

          const showMax =
            item.cost === 0 && String(item.title).includes('MAX') && !item.canBuy
          ctx.fillStyle = showMax ? '#4b5563' : item.canBuy ? '#f0c040' : '#4b5563'
          ctx.beginPath()
          if (typeof ctx.roundRect === 'function') ctx.roundRect(bx, by, btnW, btnH, 8)
          else ctx.rect(bx, by, btnW, btnH)
          ctx.fill()
          ctx.fillStyle = item.canBuy && !showMax ? '#2a1c08' : '#9ca3af'
          ctx.font = 'bold 11px Figtree, sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          let label = 'GRATIS'
          if (showMax) label = 'MAX'
          else if (item.cost > 0) label = `${item.cost} 🪙`
          ctx.fillText(label, bx + btnW * 0.5, by + btnH * 0.5)

          shopHits.push({ x: bx, y: by, w: btnW, h: btnH, id: item.id })
        })
      }

      drawShopColumn(blueItems, px + colPad)
      drawShopColumn(redItems, midX + colPad)

      // Killstreak längst ner, dubbelt så stor
      const ksY = listBottom + 8
      function drawKillstreakSlot(side, colX, itemId) {
        const kills =
          side === 'red' ? inventory.killstreakKillsRed : inventory.killstreakKillsBlue
        const spins =
          side === 'red' ? inventory.killstreakSpinsRed : inventory.killstreakSpinsBlue
        const jack = jackpotChancePct(kills)
        const bx = colX + colW - ksBtnW
        const by = ksY + (ksRowH - ksBtnH) * 0.5

        ctx.fillStyle = side === 'red' ? 'rgba(255,107,90,0.12)' : 'rgba(94,200,255,0.12)'
        ctx.strokeStyle = side === 'red' ? '#ff6b5a' : '#5ec8ff'
        ctx.lineWidth = 2
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(colX - 4, ksY, colW + 8, ksRowH, 10)
        } else {
          ctx.rect(colX - 4, ksY, colW + 8, ksRowH)
        }
        ctx.fill()
        ctx.stroke()

        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#ffe9a0'
        ctx.font = 'bold 18px Syne, sans-serif'
        ctx.fillText(`Killstreak ×${kills}`, colX + 6, ksY + ksRowH * 0.35)
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.font = '12px Figtree, sans-serif'
        ctx.fillText(`snurr ${spins} · jackpot ~${jack}%`, colX + 6, ksY + ksRowH * 0.68)

        ctx.fillStyle = '#f0c040'
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') ctx.roundRect(bx, by, ksBtnW, ksBtnH, 10)
        else ctx.rect(bx, by, ksBtnW, ksBtnH)
        ctx.fill()
        ctx.fillStyle = '#2a1c08'
        ctx.font = 'bold 16px Figtree, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('ÖPPNA', bx + ksBtnW * 0.5, by + ksBtnH * 0.5)
        shopHits.push({ x: bx, y: by, w: ksBtnW, h: ksBtnH, id: itemId })
      }
      drawKillstreakSlot('blue', px + colPad, 'killstreakBlue')
      drawKillstreakSlot('red', midX + colPad, 'killstreakRed')

      const cxBtn = width * 0.5
      const cyBtn = py + panelH - 28
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

    function startMoggerFace(ownerSide) {
      const now = shopOpen && shopPausedAt > 0 ? shopPausedAt : performance.now()
      moggerUntil = now + MOGGER_DURATION_MS
      moggerNextTick = now + MOGGER_TICK_MS
      moggerOwner = ownerSide
      shake = Math.min(16, shake + 8)
      flash = Math.min(0.5, flash + 0.25)
    }

    function isMoggerBuyer(fighter) {
      if (!moggerOwner || !fighter) return false
      if (moggerOwner === 'red') {
        return !!(fighter.player || fighter.control === 'wasd' || fighter._bossSide === 'red')
      }
      return !!(fighter.control === 'arrows' || fighter._bossSide === 'blue')
    }

    function updateMogger(now) {
      if (moggerUntil <= 0) return
      if (now >= moggerUntil) {
        moggerUntil = 0
        moggerNextTick = 0
        moggerOwner = null
        spawnBurst(cx, cy, 1.5)
        return
      }
      if (now < moggerNextTick) return
      moggerNextTick = now + MOGGER_TICK_MS
      for (let i = 0; i < fighters.length; i += 1) {
        const f = fighters[i]
        if (f.eliminated || f.lives <= 0) continue
        if (isMoggerBuyer(f)) continue
        if (!isShielded(f, now)) f.lives -= MOGGER_DAMAGE
        f.squash = Math.max(f.squash, 0.4)
        spawnBurst(f.x, f.y, 0.6)
      }
      shake = Math.min(12, shake + 3)
    }

    function buyShopItem(id) {
      if (!shopOpen) return
      if (id === 'swordRed') {
        if (inventory.startWeaponRed === 'bow') return
        if (canUpgradeMaterial(inventory.swordLevelRed)) {
          const price = linearWeaponUpgradeCost(inventory.swordLevelRed)
          if (!payCoins('red', price)) return
          inventory.swordLevelRed += 1
          inventory.weaponRed = 'sword'
          return
        }
        if (inventory.weaponRed === 'sword') return
        inventory.weaponRed = 'sword'
        return
      }
      if (id === 'swordBlue') {
        if (inventory.startWeaponBlue === 'bow') return
        if (canUpgradeMaterial(inventory.swordLevelBlue)) {
          const price = linearWeaponUpgradeCost(inventory.swordLevelBlue)
          if (!payCoins('blue', price)) return
          inventory.swordLevelBlue += 1
          inventory.weaponBlue = 'sword'
          return
        }
        if (inventory.weaponBlue === 'sword') return
        inventory.weaponBlue = 'sword'
        return
      }
      if (id === 'bowRed') {
        if (inventory.startWeaponRed === 'sword') return
        if (canUpgradeBow(inventory.bowLevelRed)) {
          const price = linearWeaponUpgradeCost(inventory.bowLevelRed)
          if (!payCoins('red', price)) return
          inventory.bowLevelRed += 1
          inventory.weaponRed = 'bow'
          return
        }
        if (inventory.weaponRed === 'bow') return
        inventory.weaponRed = 'bow'
        return
      }
      if (id === 'bowBlue') {
        if (inventory.startWeaponBlue === 'sword') return
        if (canUpgradeBow(inventory.bowLevelBlue)) {
          const price = linearWeaponUpgradeCost(inventory.bowLevelBlue)
          if (!payCoins('blue', price)) return
          inventory.bowLevelBlue += 1
          inventory.weaponBlue = 'bow'
          return
        }
        if (inventory.weaponBlue === 'bow') return
        inventory.weaponBlue = 'bow'
        return
      }
      if (id === 'nokiaRed') {
        if (inventory.startWeaponRed === 'sword') return
        if (inventory.weaponRed === 'nokia') return
        if (!inventory.nokiaRed) {
          if (!payCoins('red', NOKIA_COST)) return
          inventory.nokiaRed = true
        }
        inventory.weaponRed = 'nokia'
        return
      }
      if (id === 'nokiaBlue') {
        if (inventory.startWeaponBlue === 'sword') return
        if (inventory.weaponBlue === 'nokia') return
        if (!inventory.nokiaBlue) {
          if (!payCoins('blue', NOKIA_COST)) return
          inventory.nokiaBlue = true
        }
        inventory.weaponBlue = 'nokia'
        return
      }
      if (id === 'killstreakRed') {
        openKillstreak('red')
        return
      }
      if (id === 'killstreakBlue') {
        openKillstreak('blue')
        return
      }
      if (id === 'pistolRed') {
        if (!inventory.pistolUnlockedRed) return
        if (!inventory.pistolRed) {
          if (!payCoins('red', PISTOL_COST)) return
          inventory.pistolRed = true
          equipPistolForm('red')
          return
        }
        if (canUpgradePistol(inventory.pistolLevelRed)) {
          const price = pistolUpgradeCost(inventory.pistolLevelRed)
          if (!payCoins('red', price)) return
          inventory.pistolLevelRed += 1
          equipPistolForm('red')
          return
        }
        const form = pistolFormForLevel(inventory.pistolLevelRed)
        if (inventory.weaponRed === form) return
        equipPistolForm('red')
        return
      }
      if (id === 'pistolBlue') {
        if (!inventory.pistolUnlockedBlue) return
        if (!inventory.pistolBlue) {
          if (!payCoins('blue', PISTOL_COST)) return
          inventory.pistolBlue = true
          equipPistolForm('blue')
          return
        }
        if (canUpgradePistol(inventory.pistolLevelBlue)) {
          const price = pistolUpgradeCost(inventory.pistolLevelBlue)
          if (!payCoins('blue', price)) return
          inventory.pistolLevelBlue += 1
          equipPistolForm('blue')
          return
        }
        const form = pistolFormForLevel(inventory.pistolLevelBlue)
        if (inventory.weaponBlue === form) return
        equipPistolForm('blue')
        return
      }
      if (id === 'mcShieldRed') {
        if (!payCoins('red', MC_SHIELD_COST)) return
        inventory.mcShieldRed += 1
        return
      }
      if (id === 'mcShieldBlue') {
        if (!payCoins('blue', MC_SHIELD_COST)) return
        inventory.mcShieldBlue += 1
        return
      }
      if (id === 'lifeDrinkRed') {
        if (!payCoins('red', LIFE_DRINK_COST)) return
        inventory.lifeDrinkRed += 1
        return
      }
      if (id === 'lifeDrinkBlue') {
        if (!payCoins('blue', LIFE_DRINK_COST)) return
        inventory.lifeDrinkBlue += 1
        return
      }
      if (id === 'bodyguardRed') {
        const red = fighters.find((f) => f.player && !f.eliminated)
        const target = bossMode
          ? fighters.find((f) => f.isBoss && !f.eliminated)
          : fighters.find((f) => f.control === 'arrows' && !f.eliminated)
        if (!red || !target) return
        if (!payCoins('red', BODYGUARD_COST)) return
        spawnBodyguard(red, target)
        return
      }
      if (id === 'bodyguardBlue') {
        const blue = fighters.find((f) => f.control === 'arrows' && !f.eliminated)
        const target = bossMode
          ? fighters.find((f) => f.isBoss && !f.eliminated)
          : fighters.find((f) => f.player && !f.eliminated)
        if (!blue || !target) return
        if (!payCoins('blue', BODYGUARD_COST)) return
        spawnBodyguard(blue, target)
        return
      }
      if (id === 'moggerRed') {
        if (!payCoins('red', MOGGER_COST)) return
        startMoggerFace('red')
        return
      }
      if (id === 'moggerBlue') {
        if (!payCoins('blue', MOGGER_COST)) return
        startMoggerFace('blue')
        return
      }
      if (id === 'susRed') {
        if (!payCoins('red', SUS_COST)) return
        inventory.susRed += 1
        return
      }
      if (id === 'susBlue') {
        if (!payCoins('blue', SUS_COST)) return
        inventory.susBlue += 1
        return
      }
    }

    function fartRadius(owner) {
      // 4× spelaren
      const base = owner ? getRadius(owner) : ballR
      return base * 4
    }

    function isRedSide(fighter) {
      return !!(fighter && (fighter.player || fighter.control === 'wasd' || fighter._bossSide === 'red'))
    }

    function spawnFart(owner) {
      if (!owner) return
      const now = shopOpen && shopPausedAt > 0 ? shopPausedAt : performance.now()
      farts.push({
        x: owner.x,
        y: owner.y,
        r: fartRadius(owner),
        owner,
        nextTick: now + SUS_TICK_MS,
        expiresAt: now + SUS_DURATION_MS,
        wobble: Math.random() * Math.PI * 2,
      })
      shake = Math.min(10, shake + 3)
    }

    function useSus(fighter, side) {
      if (!fighter || fighter.eliminated || fighter.lives <= 0) return false
      if (side === 'red') {
        if (inventory.susRed <= 0) return false
        inventory.susRed -= 1
      } else {
        if (inventory.susBlue <= 0) return false
        inventory.susBlue -= 1
      }
      spawnFart(fighter)
      return true
    }

    function updateFarts(dt, now) {
      for (let i = farts.length - 1; i >= 0; i -= 1) {
        const g = farts[i]
        if (g.expiresAt > 0 && now >= g.expiresAt) {
          farts.splice(i, 1)
          continue
        }
        g.r = fartRadius(g.owner)
        g.wobble += 0.03 * dt

        if (now < g.nextTick) continue
        g.nextTick = now + SUS_TICK_MS
        for (let j = 0; j < fighters.length; j += 1) {
          const f = fighters[j]
          if (f === g.owner || f.eliminated || f.lives <= 0) continue
          if (bossMode && !f.isBoss) continue
          // Skada om motståndaren är inne i den gröna radien
          if (Math.hypot(f.x - g.x, f.y - g.y) > g.r + getRadius(f) + MELEE_HIT_PAD * 0.5) continue
          if (!isShielded(f, now)) {
            f.lives -= SUS_DAMAGE
            if (f.isBoss) addBossDamage(g.owner, SUS_DAMAGE)
          }
          f.squash = Math.max(f.squash, 0.4)
        }
      }
    }

    function drawFart(g, now = performance.now()) {
      const lifeLeft =
        g.expiresAt > 0 ? Math.max(0, Math.min(1, (g.expiresAt - now) / SUS_DURATION_MS)) : 1
      const pulse = 1 + Math.sin(now / 280 + g.wobble) * 0.02
      const r = g.r * pulse
      ctx.save()
      // Fast grön skadezon (radie), inte bara en liten effekt
      ctx.fillStyle = `rgba(40, 200, 70, ${0.28 + lifeLeft * 0.12})`
      ctx.beginPath()
      ctx.arc(g.x, g.y, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = `rgba(70, 230, 100, ${0.18 + lifeLeft * 0.1})`
      ctx.beginPath()
      ctx.arc(g.x, g.y, r * 0.55, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = `rgba(120, 255, 140, ${0.85 + lifeLeft * 0.1})`
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.arc(g.x, g.y, r, 0, Math.PI * 2)
      ctx.stroke()
      ctx.strokeStyle = 'rgba(200, 255, 210, 0.45)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(g.x, g.y, r * 0.72, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
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
            if (!isShielded(g.target, now)) {
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
      ctx.fillText(`först till ${WIN_SCORE} · shop 10/15/20… · grön boss ${BOSS_SCORE}`, width * 0.5, 28)

      if (killstreakMessage && performance.now() < killstreakMessageUntil) {
        ctx.font = 'bold 20px Figtree, sans-serif'
        ctx.fillStyle = '#f0c040'
        ctx.strokeStyle = 'rgba(0,0,0,0.55)'
        ctx.lineWidth = 4
        ctx.strokeText(killstreakMessage, width * 0.5, 56)
        ctx.fillText(killstreakMessage, width * 0.5, 56)
      }
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
      codesOpen = false
      pendingBossAfterShop = false
      pendingWinAfterShop = null
      moggerUntil = 0
      moggerNextTick = 0
      moggerOwner = null
      bombs.length = 0
      pingBalls.length = 0
      arrows.length = 0
      bodyguards.length = 0
      inventory.weaponRed = null
      inventory.weaponBlue = null
      inventory.startWeaponRed = null
      inventory.startWeaponBlue = null
      inventory.knifeOwnedRed = false
      inventory.knifeOwnedBlue = false
      inventory.swordLevelRed = 0
      inventory.swordLevelBlue = 0
      inventory.bowLevelRed = 0
      inventory.bowLevelBlue = 0
      inventory.footLevel = 0
      inventory.pingLevel = 0
      inventory.nokiaRed = false
      inventory.nokiaBlue = false
      inventory.pistolRed = false
      inventory.pistolBlue = false
      inventory.pistolUnlockedRed = false
      inventory.pistolUnlockedBlue = false
      inventory.pistolLevelRed = 0
      inventory.pistolLevelBlue = 0
      inventory.rpgRed = false
      inventory.rpgBlue = false
      inventory.sniperRed = false
      inventory.sniperBlue = false
      inventory.mcShieldRed = 0
      inventory.mcShieldBlue = 0
      inventory.killstreakKillsRed = 0
      inventory.killstreakKillsBlue = 0
      inventory.killstreakSpinsRed = 0
      inventory.killstreakSpinsBlue = 0
      inventory.lifeDrinkRed = 0
      inventory.lifeDrinkBlue = 0
      inventory.susRed = 0
      inventory.susBlue = 0
      inventory.scoreRewardRed = null
      inventory.scoreRewardBlue = null
      inventory.scoreWheelDoneRed = false
      inventory.scoreWheelDoneBlue = false
      inventory.nukeUsedRed = false
      inventory.nukeUsedBlue = false
      killstreakMessage = ''
      killstreakMessageUntil = 0
      killstreakOpen = false
      killstreakSide = null
      ksSpinning = false
      ksPendingPrize = null
      scoreWheelOpen = false
      scoreWheelSide = null
      swSpinning = false
      swPending = null
      swNeedSpin = false
      pendingScoreWheel = null
      eventPistolActive = false
      eventPistolGranted = false
      walls.length = 0
      otisPower = false
      nerminPower = false
      farts.length = 0
      policeUnits.length = 0
      leonUnits.length = 0
      footballs.length = 0
      leonCallsRed = 0
      leonCallsBlue = 0
      poisonFlasks.length = 0
      poisonPools.length = 0
      closeNokiaDial()
      resetFighters()
      openWeaponSelect()
    }

    function drawGoldCoins() {
      const size = 18

      // Compact: one coin + number (so 999 doesn't fill the screen)
      drawCoin(28, 98, size)
      ctx.save()
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.font = 'bold 18px Figtree, sans-serif'
      ctx.fillStyle = '#ffe9a0'
      ctx.strokeStyle = 'rgba(0,0,0,0.45)'
      ctx.lineWidth = 3
      ctx.strokeText(`×${redCoins}`, 48, 98)
      ctx.fillText(`×${redCoins}`, 48, 98)

      const redW = eventPistolActive ? 'pistol' : inventory.weaponRed
      const redLabel = eventPistolActive
        ? 'Event-pistol · Q'
        : nerminPower && redW !== 'rpg' && redW !== 'sniper' && redW !== 'bow' && redW !== 'nokia' && redW !== 'pistol' && redW !== 'hammer'
          ? 'Armar/ben · Q'
          : redW === 'sniper'
            ? 'Sniper · Q'
            : redW === 'rpg'
              ? 'RPG · Q'
              : redW === 'pistol'
                ? 'Pistol · Q'
                : redW === 'bow'
                  ? 'Pilbåge · Q'
                  : redW === 'sword'
                    ? 'Svärd · Q'
                    : redW === 'nokia'
                      ? 'Nokia · Q'
                      : redW === 'knife'
                        ? 'Kniv · Q'
                        : redW === 'foot'
                          ? 'Fot · Q'
                          : redW === 'hammer'
                            ? 'Hammare · Q · G väg'
                            : ''
      if (redLabel) {
        ctx.font = '600 13px Figtree, sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.strokeText(redLabel, 28, 122)
        ctx.fillText(redLabel, 28, 122)
      }
      if (inventory.scoreRewardRed === 'nuke' && !inventory.nukeUsedRed) {
        ctx.font = '600 12px Figtree, sans-serif'
        ctx.fillStyle = '#ef4444'
        ctx.strokeText('NUKE · T', 28, 142)
        ctx.fillText('NUKE · T', 28, 142)
      }
      ctx.restore()

      drawCoin(width - 28, 98, size)
      ctx.save()
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.font = 'bold 18px Figtree, sans-serif'
      ctx.fillStyle = '#ffe9a0'
      ctx.strokeStyle = 'rgba(0,0,0,0.45)'
      ctx.lineWidth = 3
      ctx.strokeText(`×${blueCoins}`, width - 48, 98)
      ctx.fillText(`×${blueCoins}`, width - 48, 98)

      const blueW = eventPistolActive ? 'pistol' : inventory.weaponBlue
      const blueLabel = eventPistolActive
        ? 'Event-pistol · 1'
        : nerminPower && blueW !== 'rpg' && blueW !== 'sniper' && blueW !== 'bow' && blueW !== 'nokia' && blueW !== 'pistol' && blueW !== 'hammer'
          ? 'Armar/ben · 1'
          : blueW === 'sniper'
            ? 'Sniper · 1'
            : blueW === 'rpg'
              ? 'RPG · 1'
              : blueW === 'pistol'
                ? 'Pistol · 1'
                : blueW === 'bow'
                  ? 'Pilbåge · 1'
                  : blueW === 'sword'
                    ? 'Svärd · 1'
                    : blueW === 'nokia'
                      ? 'Nokia · 1'
                      : blueW === 'knife'
                        ? 'Kniv · 1'
                        : blueW === 'ping'
                          ? 'Pingis · 1'
                          : blueW === 'hammer'
                            ? 'Hammare · 1 · 8 väg'
                            : ''
      if (blueLabel) {
        ctx.font = '600 13px Figtree, sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.strokeText(blueLabel, width - 28, 122)
        ctx.fillText(blueLabel, width - 28, 122)
      }
      if (inventory.scoreRewardBlue === 'nuke' && !inventory.nukeUsedBlue) {
        ctx.font = '600 12px Figtree, sans-serif'
        ctx.fillStyle = '#ef4444'
        ctx.strokeText('NUKE · 7', width - 28, 142)
        ctx.fillText('NUKE · 7', width - 28, 142)
      }
      ctx.restore()
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
      const moggerActive = moggerUntil > 0 && time < moggerUntil
      if (moggerActive) {
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, width, height)
        // Svart void-bana: bara en tunn ring så man ser kanten
        ctx.strokeStyle = 'rgba(255,255,255,0.12)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(cx, cy, Math.max(1, arenaR), 0, Math.PI * 2)
        ctx.stroke()
        const leftSec = Math.max(0, Math.ceil((moggerUntil - time) / 1000))
        ctx.fillStyle = 'rgba(255,255,255,0.55)'
        ctx.font = 'bold 22px Syne, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillText(`MOGER FACE · ${leftSec}s`, cx, cy - arenaR - 36)
        return
      }

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

      // Sköld: Minecraft-sköld eller cyan bubbla (E)
      if (isShielded(ball)) {
        const pulse = 0.65 + Math.sin(performance.now() * 0.012) * 0.2
        if (ball.shieldKind === 'mc') {
          const face = (ball.face || 1) > 0 ? 1 : -1
          const sw = r * 0.95
          const sh = r * 1.55
          ctx.save()
          ctx.translate(face * r * 0.95, r * 0.05)
          // Träplatta
          ctx.fillStyle = '#8b5a2b'
          ctx.beginPath()
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(-sw * 0.5, -sh * 0.5, sw, sh, r * 0.08)
          } else {
            ctx.rect(-sw * 0.5, -sh * 0.5, sw, sh)
          }
          ctx.fill()
          // Järnkant
          ctx.strokeStyle = '#c0c0c0'
          ctx.lineWidth = Math.max(2, r * 0.08)
          ctx.stroke()
          // Boss-mönster (Minecraft)
          ctx.fillStyle = '#5c3a1a'
          ctx.fillRect(-sw * 0.12, -sh * 0.38, sw * 0.24, sh * 0.72)
          ctx.fillRect(-sw * 0.38, -sh * 0.08, sw * 0.76, sh * 0.18)
          ctx.fillStyle = `rgba(255, 245, 200, ${0.25 + pulse * 0.2})`
          ctx.fillRect(-sw * 0.42, -sh * 0.42, sw * 0.84, sh * 0.12)
          ctx.restore()
        } else {
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

      // Moger Face: glasögon + kindlinjer på köparen
      if (
        !happy &&
        !ball.isBoss &&
        moggerUntil > 0 &&
        performance.now() < moggerUntil &&
        isMoggerBuyer(ball)
      ) {
        const gY = eyeY
        const gW = r * 0.34
        const gH = r * 0.26
        const gGap = eyeSpread

        // Glasögonbågar
        ctx.strokeStyle = 'rgba(15, 12, 20, 0.95)'
        ctx.lineWidth = Math.max(2.5, r * 0.085)
        ctx.lineJoin = 'round'
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(-gGap - gW * 0.5, gY - gH * 0.5, gW, gH, r * 0.06)
          ctx.roundRect(gGap - gW * 0.5, gY - gH * 0.5, gW, gH, r * 0.06)
        } else {
          ctx.rect(-gGap - gW * 0.5, gY - gH * 0.5, gW, gH)
          ctx.rect(gGap - gW * 0.5, gY - gH * 0.5, gW, gH)
        }
        ctx.stroke()

        // Näsa / brygga
        ctx.beginPath()
        ctx.moveTo(-gGap + gW * 0.5, gY)
        ctx.lineTo(gGap - gW * 0.5, gY)
        ctx.stroke()

        // Glasglans
        ctx.fillStyle = 'rgba(180, 220, 255, 0.18)'
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(-gGap - gW * 0.42, gY - gH * 0.38, gW * 0.84, gH * 0.76, r * 0.04)
          ctx.roundRect(gGap - gW * 0.42, gY - gH * 0.38, gW * 0.84, gH * 0.76, r * 0.04)
        } else {
          ctx.rect(-gGap - gW * 0.42, gY - gH * 0.38, gW * 0.84, gH * 0.76)
          ctx.rect(gGap - gW * 0.42, gY - gH * 0.38, gW * 0.84, gH * 0.76)
        }
        ctx.fill()

        // Kindben-linjer
        ctx.strokeStyle = 'rgba(20, 12, 28, 0.75)'
        ctx.lineWidth = Math.max(2, r * 0.07)
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(-r * 0.55, r * 0.08)
        ctx.quadraticCurveTo(-r * 0.42, r * 0.28, -r * 0.22, r * 0.22)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(r * 0.55, r * 0.08)
        ctx.quadraticCurveTo(r * 0.42, r * 0.28, r * 0.22, r * 0.22)
        ctx.stroke()
        // Extra kindkontur
        ctx.strokeStyle = 'rgba(20, 12, 28, 0.45)'
        ctx.lineWidth = Math.max(1.5, r * 0.045)
        ctx.beginPath()
        ctx.moveTo(-r * 0.48, r * 0.18)
        ctx.quadraticCurveTo(-r * 0.38, r * 0.38, -r * 0.18, r * 0.36)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(r * 0.48, r * 0.18)
        ctx.quadraticCurveTo(r * 0.38, r * 0.38, r * 0.18, r * 0.36)
        ctx.stroke()
      }

      // Nermin-tjockis: armar + ben
      if (nerminPower && !happy && !ball.isBoss) {
        const nowL = performance.now()
        const limbSwing =
          ball.meleeKind === 'limb' && ball.knifeSwingUntil && nowL < ball.knifeSwingUntil
        const limbT = limbSwing
          ? 1 - Math.max(0, (ball.knifeSwingUntil - nowL) / LIMB_SWING_MS)
          : 0
        const punch = limbSwing ? Math.sin(limbT * Math.PI) * 0.9 : 0
        ctx.fillStyle = color
        ctx.strokeStyle = 'rgba(20,12,28,0.55)'
        ctx.lineWidth = Math.max(2, r * 0.06)
        // Ben
        ctx.beginPath()
        ctx.moveTo(-r * 0.28, r * 0.55)
        ctx.lineTo(-r * 0.38, r * 1.15)
        ctx.moveTo(r * 0.28, r * 0.55)
        ctx.lineTo(r * 0.38, r * 1.15)
        ctx.stroke()
        ctx.beginPath()
        ctx.ellipse(-r * 0.4, r * 1.2, r * 0.22, r * 0.12, -0.2, 0, Math.PI * 2)
        ctx.ellipse(r * 0.4, r * 1.2, r * 0.22, r * 0.12, 0.2, 0, Math.PI * 2)
        ctx.fill()
        // Armar
        ctx.beginPath()
        ctx.moveTo(-r * 0.75, -r * 0.05)
        ctx.lineTo(-r * (1.15 + punch * 0.35), r * (0.35 - punch * 0.2))
        ctx.moveTo(r * 0.75, -r * 0.05)
        ctx.lineTo(r * (1.15 + punch * 0.55), r * (0.2 - punch * 0.45))
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(-r * (1.15 + punch * 0.35), r * (0.35 - punch * 0.2), r * 0.16, 0, Math.PI * 2)
        ctx.arc(r * (1.15 + punch * 0.55), r * (0.2 - punch * 0.45), r * 0.16, 0, Math.PI * 2)
        ctx.fill()
      }

      // Fot / pingis / båge / svärd syns alltid; kniv bara under sving (aldrig under Nermin)
      {
        const weapon = happy || ball.isBoss ? null : getSideWeapon(ball)
        const now = performance.now()
        const swinging =
          !!(ball.knifeEquipped || (ball.knifeSwingUntil && now < ball.knifeSwingUntil))
        let kind = swinging ? ball.meleeKind || weapon || 'knife' : weapon
        if (nerminPower && (kind === 'knife' || kind === 'sword')) kind = 'limb'
        const showHeld =
          (!nerminPower ||
            kind === 'rpg' ||
            kind === 'sniper' ||
            kind === 'bow' ||
            kind === 'nokia' ||
            kind === 'pistol' ||
            kind === 'hammer') &&
          (kind === 'foot' ||
            kind === 'ping' ||
            kind === 'bow' ||
            kind === 'nokia' ||
            kind === 'pistol' ||
            kind === 'rpg' ||
            kind === 'sniper' ||
            kind === 'sword' ||
            kind === 'hammer' ||
            (swinging && kind === 'knife'))

        if (showHeld && kind && kind !== 'limb') {
          const side = isRedSide(ball) ? 'red' : 'blue'
          const gunLevel =
            kind === 'pistol' || kind === 'rpg' || kind === 'sniper'
              ? side === 'red'
                ? inventory.pistolLevelRed
                : inventory.pistolLevelBlue
              : 0
          const matLevel =
            kind === 'sword'
              ? materialTierLevel(side, 'sword')
              : kind === 'bow'
                ? materialTierLevel(side, 'bow')
                : 0
          const mat = materialColorsFor(matLevel)
          const swingMs =
            kind === 'foot'
              ? FOOT_SWING_MS
              : kind === 'ping'
                ? 180
                : kind === 'sniper'
                  ? SNIPER_DRAW_MS
                  : kind === 'rpg'
                    ? RPG_DRAW_MS
                    : kind === 'pistol'
                      ? PISTOL_DRAW_MS
                      : kind === 'bow' || kind === 'nokia'
                        ? BOW_DRAW_MS
                        : kind === 'hammer'
                          ? HAMMER_SWING_MS
                          : kind === 'sword'
                            ? SWORD_SWING_MS
                            : KNIFE_SWING_MS
          const swingLeft = swinging ? Math.max(0, (ball.knifeSwingUntil || 0) - now) : swingMs
          const swingT = swinging ? 1 - swingLeft / swingMs : 0
          const rangedHold =
            kind === 'ping' ||
            kind === 'bow' ||
            kind === 'nokia' ||
            kind === 'pistol' ||
            kind === 'rpg' ||
            kind === 'sniper'
          const faceAngle =
            typeof ball.knifeAngle === 'number' && (swinging || rangedHold)
              ? ball.knifeAngle
              : (ball.face || 1) > 0
                ? 0
                : Math.PI
          const swingArc = swinging
            ? Math.sin(swingT * Math.PI) *
              (kind === 'foot' ? 0.9 : rangedHold ? 0.2 : 1.1)
            : 0
          const dir =
            faceAngle +
            swingArc -
            (swinging && !rangedHold ? 0.55 : 0)

          ctx.save()
          ctx.rotate(dir)

          if (kind === 'hammer') {
            ctx.translate(r * 0.55, 0)
            ctx.fillStyle = '#5c4030'
            ctx.fillRect(0, -r * 0.1, r * 1.15, r * 0.2)
            ctx.fillStyle = '#a16207'
            ctx.beginPath()
            if (typeof ctx.roundRect === 'function') {
              ctx.roundRect(r * 0.95, -r * 0.42, r * 0.7, r * 0.84, 4)
            } else {
              ctx.rect(r * 0.95, -r * 0.42, r * 0.7, r * 0.84)
            }
            ctx.fill()
            ctx.fillStyle = '#fbbf24'
            ctx.fillRect(r * 1.05, -r * 0.12, r * 0.45, r * 0.24)
          } else if (kind === 'pistol') {
            // Lv0–3 samma look; Lv4+ längre silverpistol
            const upgraded = gunLevel >= 4 || eventPistolActive
            const bodyLen = upgraded ? r * 1.2 : r * 0.95
            const bodyH = upgraded ? r * 0.26 : r * 0.24
            ctx.translate(r * 0.7, 0)
            ctx.fillStyle = eventPistolActive ? '#f0c040' : upgraded ? '#8a9399' : '#2a2a2a'
            ctx.beginPath()
            if (typeof ctx.roundRect === 'function') {
              ctx.roundRect(0, -bodyH * 0.5, bodyLen, bodyH, 2)
            } else {
              ctx.rect(0, -bodyH * 0.5, bodyLen, bodyH)
            }
            ctx.fill()
            ctx.fillStyle = upgraded ? '#5c656c' : '#444'
            ctx.beginPath()
            if (typeof ctx.roundRect === 'function') {
              ctx.roundRect(r * 0.05, r * 0.08, r * 0.28, r * 0.4, 2)
            } else {
              ctx.rect(r * 0.05, r * 0.08, r * 0.28, r * 0.4)
            }
            ctx.fill()
            if (upgraded) {
              ctx.fillStyle = '#cfd8dc'
              ctx.fillRect(bodyLen * 0.55, -r * 0.22, r * 0.22, r * 0.12)
            }
            ctx.fillStyle = upgraded ? '#74b9ff' : '#f0c040'
            ctx.fillRect(bodyLen - r * 0.12, -r * 0.08, r * 0.12, r * 0.16)
          } else if (kind === 'rpg') {
            const tier = Math.max(0, gunLevel - PISTOL_RPG_LEVEL)
            const bodyLen = r * (1.15 + tier * 0.04)
            ctx.translate(r * 0.75, 0)
            ctx.fillStyle = tier >= 2 ? '#3d4a2f' : '#4a5a3a'
            ctx.beginPath()
            if (typeof ctx.roundRect === 'function') {
              ctx.roundRect(0, -r * 0.16, bodyLen, r * 0.32, 3)
            } else {
              ctx.rect(0, -r * 0.16, bodyLen, r * 0.32)
            }
            ctx.fill()
            ctx.fillStyle = tier >= 3 ? '#e74c3c' : '#c0392b'
            ctx.beginPath()
            ctx.moveTo(bodyLen, 0)
            ctx.lineTo(bodyLen - r * 0.3, -r * 0.22)
            ctx.lineTo(bodyLen - r * 0.3, r * 0.22)
            ctx.closePath()
            ctx.fill()
            ctx.fillStyle = '#3d2314'
            ctx.fillRect(-r * 0.35, -r * 0.12, r * 0.4, r * 0.24)
            ctx.fillStyle = '#888'
            ctx.beginPath()
            ctx.arc(-r * 0.15, 0, r * 0.14, 0, Math.PI * 2)
            ctx.fill()
            if (tier >= 1) {
              ctx.fillStyle = '#f0c040'
              ctx.fillRect(r * 0.35, -r * 0.2, r * 0.18, r * 0.08)
            }
          } else if (kind === 'sniper') {
            ctx.translate(r * 0.65, 0)
            ctx.fillStyle = '#1e272e'
            ctx.beginPath()
            if (typeof ctx.roundRect === 'function') {
              ctx.roundRect(0, -r * 0.1, r * 1.85, r * 0.2, 2)
            } else {
              ctx.rect(0, -r * 0.1, r * 1.85, r * 0.2)
            }
            ctx.fill()
            ctx.fillStyle = '#485460'
            ctx.beginPath()
            if (typeof ctx.roundRect === 'function') {
              ctx.roundRect(r * 0.08, r * 0.06, r * 0.32, r * 0.42, 2)
            } else {
              ctx.rect(r * 0.08, r * 0.06, r * 0.32, r * 0.42)
            }
            ctx.fill()
            // Kikarsikte
            ctx.fillStyle = '#2f3640'
            ctx.fillRect(r * 0.55, -r * 0.32, r * 0.55, r * 0.16)
            ctx.fillStyle = '#74b9ff'
            ctx.beginPath()
            ctx.arc(r * 0.82, -r * 0.24, r * 0.12, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = '#dfe6e9'
            ctx.fillRect(r * 1.7, -r * 0.07, r * 0.22, r * 0.14)
          } else if (kind === 'nokia') {
            ctx.translate(r * 0.7, 0)
            const w = r * 0.55
            const h = r * 0.95
            ctx.fillStyle = '#222'
            ctx.beginPath()
            if (typeof ctx.roundRect === 'function') ctx.roundRect(-w * 0.5, -h * 0.5, w, h, 3)
            else ctx.rect(-w * 0.5, -h * 0.5, w, h)
            ctx.fill()
            ctx.fillStyle = '#7ec8ff'
            ctx.fillRect(-w * 0.32, -h * 0.38, w * 0.64, h * 0.25)
            ctx.fillStyle = '#555'
            for (let row = 0; row < 3; row += 1) {
              for (let col = 0; col < 3; col += 1) {
                ctx.fillRect(
                  -w * 0.28 + col * w * 0.22,
                  -h * 0.02 + row * h * 0.16,
                  w * 0.16,
                  h * 0.1,
                )
              }
            }
          } else if (kind === 'foot') {
            // Sparkfot
            ctx.translate(r * 0.85, r * 0.15)
            const idleTilt = swinging ? 0 : 0.25
            ctx.rotate(idleTilt)
            ctx.fillStyle = '#1a1a1a'
            ctx.beginPath()
            ctx.ellipse(r * 0.35, 0, r * 0.55, r * 0.28, 0, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = '#333'
            ctx.beginPath()
            ctx.ellipse(r * 0.55, -r * 0.02, r * 0.28, r * 0.18, 0, 0, Math.PI * 2)
            ctx.fill()
            // Sulrand
            ctx.strokeStyle = '#c9a227'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.ellipse(r * 0.35, r * 0.08, r * 0.5, r * 0.12, 0, 0.2, Math.PI - 0.2)
            ctx.stroke()
            // Snören
            ctx.strokeStyle = '#eee'
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(r * 0.1, -r * 0.08)
            ctx.lineTo(r * 0.45, -r * 0.12)
            ctx.moveTo(r * 0.15, 0.02 * r)
            ctx.lineTo(r * 0.48, -0.02 * r)
            ctx.stroke()
          } else if (kind === 'ping') {
            // Pingisrack
            ctx.translate(r * 0.7, 0)
            // Skaft
            ctx.fillStyle = '#6b3f1f'
            ctx.fillRect(-r * 0.08, -r * 0.08, r * 0.55, r * 0.16)
            // Blad
            const blade = ctx.createRadialGradient(r * 0.85, 0, 2, r * 0.85, 0, r * 0.42)
            blade.addColorStop(0, '#ff6b4a')
            blade.addColorStop(1, '#c0392b')
            ctx.fillStyle = blade
            ctx.beginPath()
            ctx.ellipse(r * 0.95, 0, r * 0.42, r * 0.32, 0, 0, Math.PI * 2)
            ctx.fill()
            ctx.strokeStyle = '#2a2a2a'
            ctx.lineWidth = 2
            ctx.stroke()
            // Gummi-linjer
            ctx.strokeStyle = 'rgba(0,0,0,0.2)'
            ctx.lineWidth = 1
            for (let i = -2; i <= 2; i += 1) {
              ctx.beginPath()
              ctx.moveTo(r * 0.7, i * r * 0.1)
              ctx.lineTo(r * 1.2, i * r * 0.1)
              ctx.stroke()
            }
            // Liten boll på rack när inte skjutit
            if (!swinging) {
              ctx.fillStyle = '#f5f5f5'
              ctx.beginPath()
              ctx.arc(r * 1.35, -r * 0.25, r * 0.12, 0, Math.PI * 2)
              ctx.fill()
              ctx.strokeStyle = '#e85d04'
              ctx.lineWidth = 1
              ctx.stroke()
            }
          } else if (kind === 'bow') {
            ctx.translate(r * 0.55, 0)
            const draw = swinging ? 0.12 + Math.sin(swingT * Math.PI) * 0.2 : 0
            ctx.strokeStyle = '#6b3f1f'
            ctx.lineWidth = Math.max(3, r * 0.08)
            ctx.beginPath()
            ctx.arc(r * 0.15, 0, r * 0.85, -1.15, 1.15)
            ctx.stroke()
            ctx.strokeStyle = mat.blade
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(r * 0.15 + Math.cos(-1.15) * r * 0.85, Math.sin(-1.15) * r * 0.85)
            ctx.lineTo(r * (0.55 + draw), 0)
            ctx.lineTo(r * 0.15 + Math.cos(1.15) * r * 0.85, Math.sin(1.15) * r * 0.85)
            ctx.stroke()
            if (!swinging) {
              ctx.fillStyle = mat.tip
              ctx.beginPath()
              ctx.moveTo(r * 1.15, 0)
              ctx.lineTo(r * 0.7, -r * 0.12)
              ctx.lineTo(r * 0.7, r * 0.12)
              ctx.closePath()
              ctx.fill()
              ctx.strokeStyle = '#6b3f1f'
              ctx.lineWidth = 2
              ctx.beginPath()
              ctx.moveTo(r * 0.2, 0)
              ctx.lineTo(r * 0.7, 0)
              ctx.stroke()
            }
          } else if (kind === 'sword') {
            ctx.translate(r * 0.82, r * 0.05)
            const bladeLen = r * 1.28
            const blade = ctx.createLinearGradient(0, 0, bladeLen, 0)
            blade.addColorStop(0, mat.edge)
            blade.addColorStop(0.45, mat.tip)
            blade.addColorStop(1, mat.blade)
            ctx.fillStyle = blade
            ctx.beginPath()
            ctx.moveTo(bladeLen, 0)
            ctx.lineTo(r * 0.18, -r * 0.11)
            ctx.lineTo(-r * 0.04, -r * 0.08)
            ctx.lineTo(-r * 0.04, r * 0.08)
            ctx.lineTo(r * 0.18, r * 0.11)
            ctx.closePath()
            ctx.fill()
            ctx.fillStyle = '#3d2314'
            ctx.fillRect(-r * 0.38, -r * 0.07, r * 0.36, r * 0.14)
            ctx.fillStyle = mat.tip
            ctx.fillRect(-r * 0.08, -r * 0.14, r * 0.07, r * 0.28)
          } else {
            ctx.translate(r * 0.9, r * 0.05)
            const blade = ctx.createLinearGradient(0, 0, r * 1.05, 0)
            blade.addColorStop(0, '#c0c8d0')
            blade.addColorStop(0.5, '#f4f7fa')
            blade.addColorStop(1, '#8a939c')
            ctx.fillStyle = blade
            ctx.beginPath()
            ctx.moveTo(r * 1.05, 0)
            ctx.lineTo(r * 0.15, -r * 0.14)
            ctx.lineTo(-r * 0.05, -r * 0.09)
            ctx.lineTo(-r * 0.05, r * 0.09)
            ctx.lineTo(r * 0.15, r * 0.14)
            ctx.closePath()
            ctx.fill()
            ctx.fillStyle = '#3d2314'
            ctx.fillRect(-r * 0.38, -r * 0.08, r * 0.34, r * 0.16)
            ctx.fillStyle = '#c9a227'
            ctx.fillRect(-r * 0.1, -r * 0.16, r * 0.07, r * 0.32)
          }

          if (
            swinging &&
            kind !== 'ping' &&
            kind !== 'bow' &&
            kind !== 'nokia' &&
            kind !== 'rpg' &&
            kind !== 'sniper' &&
            kind !== 'pistol' &&
            swingT > 0.05 &&
            swingT < 0.95
          ) {
            ctx.strokeStyle = `rgba(220,240,255,${0.55 * Math.sin(swingT * Math.PI)})`
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.arc(0, 0, r * (kind === 'foot' ? 1.35 : kind === 'sword' ? 1.25 : 1.15), -0.9, 0.4)
            ctx.stroke()
          }
          ctx.restore()
        }
      }

      // Spjut-stöt (röd trycker Z) — tip-längd = spearTipLength (samma som hitbox)
      if (ball.spearEquipped || (ball.spearSwingUntil && performance.now() < ball.spearSwingUntil)) {
        const now = performance.now()
        const swingT = spearSwingProgress(ball, now)
        const thrust = Math.sin(swingT * Math.PI) * r * SPEAR_THRUST
        const dir = ball.spearAngle || 0
        // tip world = r*SPEAR_BASE + thrust; grip vid ~r*0.55 + thrust
        const tipLocal = r * SPEAR_BASE + thrust
        const gripLocal = r * 0.55 + thrust
        ctx.save()
        ctx.rotate(dir)
        ctx.strokeStyle = '#6b3f1f'
        ctx.lineWidth = Math.max(3, r * 0.08)
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(gripLocal - r * 0.2, 0)
        ctx.lineTo(tipLocal - r * 0.35, 0)
        ctx.stroke()
        ctx.fillStyle = '#d1d5db'
        ctx.beginPath()
        ctx.moveTo(tipLocal, 0)
        ctx.lineTo(tipLocal - r * 0.4, -r * 0.14)
        ctx.lineTo(tipLocal - r * 0.4, r * 0.14)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = '#c9a227'
        ctx.fillRect(gripLocal - r * 0.15, -r * 0.1, r * 0.12, r * 0.2)
        ctx.restore()
      }

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
          const label = `${lives}/${maxLives}`
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

        }

        // Bomber borttagna från blå
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

        if (
          shopOpen ||
          codesOpen ||
          weaponSelectOpen ||
          nokiaDialOpen ||
          killstreakOpen ||
          scoreWheelOpen
        ) {
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
          for (let i = 0; i < bombs.length; i += 1) {
            drawBomb(bombs[i])
          }
          for (let i = 0; i < pingBalls.length; i += 1) {
            drawPingBall(pingBalls[i])
          }
          for (let i = 0; i < arrows.length; i += 1) {
            drawArrow(arrows[i])
          }
          for (let i = 0; i < farts.length; i += 1) {
            drawFart(farts[i], shopPausedAt || now)
          }
          drawPoisonPools(shopPausedAt || now)
          drawPoisonFlasks()
          drawWalls()
          for (let i = 0; i < policeUnits.length; i += 1) {
            drawPolice(policeUnits[i])
          }
          for (let i = 0; i < leonUnits.length; i += 1) {
            drawLeon(leonUnits[i])
          }
          for (let i = 0; i < footballs.length; i += 1) {
            drawFootball(footballs[i])
          }
          for (let i = 0; i < bodyguards.length; i += 1) {
            drawBodyguard(bodyguards[i])
          }
          drawScores()
          drawShopButton()
          drawGoldCoins()
          drawNokiaDialButtons()
          drawRespawnCountdowns(shopPausedAt || weaponSelectPausedAt || now)
          drawBossHud()
          drawShop()
          drawCodes()
          drawWeaponSelect()
          drawNokiaDial()
          drawKillstreakWheel()
          drawScoreWheel()
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

        updateBombs(dt)
        updatePingBalls(dt)
        updateArrows(dt)
        updateBodyguards(dt, now)
        updateFarts(dt, now)
        updateBurns(dt, now)
        updatePolice(dt)
        updateLeon(dt)
        updateFootballs(dt)
        updatePoisonFlasks(dt)
        updatePoisonPools(dt, now)
        updateMogger(now)
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

        // Spectators behind / around (outside ring) — gömda i Moger Face
        if (!(moggerUntil > 0 && now < moggerUntil)) {
          for (let i = 0; i < spectators.length; i += 1) {
            drawBall(spectators[i], spectatorR, true)
          }
        }

        for (let i = 0; i < farts.length; i += 1) {
          drawFart(farts[i], now)
        }
        drawPoisonPools(now)
        drawPoisonFlasks()
        drawWalls()

        for (let i = shocks.length - 1; i >= 0; i -= 1) {
          const s = shocks[i]
          s.r += (s.max - s.r) * 0.14
          s.life *= 0.88
          if (s.life < 0.05) {
            shocks.splice(i, 1)
            continue
          }
          const sc = s.color || [255, 244, 196]
          ctx.beginPath()
          ctx.arc(s.x, s.y, Math.max(0.5, s.r), 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${sc[0]},${sc[1]},${sc[2]},${s.life * 0.8})`
          ctx.lineWidth = Math.max(2, (s.color ? 5 : 3) * s.life)
          ctx.stroke()
          if (s.color) {
            ctx.beginPath()
            ctx.arc(s.x, s.y, Math.max(0.5, s.r * 0.55), 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(255, 200, 60, ${s.life * 0.35})`
            ctx.lineWidth = Math.max(1, 2 * s.life)
            ctx.stroke()
          }
        }

        for (let i = particles.length - 1; i >= 0; i -= 1) {
          const p = particles[i]
          p.x += p.vx * dt
          p.y += p.vy * dt
          if (p.fire) {
            p.vy -= 0.18 * dt
            p.vx *= 0.96
            p.vy *= 0.98
          } else {
            p.vx *= 0.97
            p.vy *= 0.97
          }
          p.life -= p.decay * dt
          if (p.life <= 0) {
            particles.splice(i, 1)
            continue
          }
          const pc = p.color || [255, 244, 196]
          ctx.fillStyle = `rgba(${pc[0]},${pc[1]},${pc[2]},${p.life})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, Math.max(0.5, p.size * p.life), 0, Math.PI * 2)
          ctx.fill()
        }

        for (let i = 0; i < fighters.length; i += 1) {
          drawBall(fighters[i], getRadius(fighters[i]), false)
        }

        for (let i = 0; i < policeUnits.length; i += 1) {
          drawPolice(policeUnits[i])
        }

        for (let i = 0; i < leonUnits.length; i += 1) {
          drawLeon(leonUnits[i])
        }

        for (let i = 0; i < bombs.length; i += 1) {
          drawBomb(bombs[i])
        }

        for (let i = 0; i < pingBalls.length; i += 1) {
          drawPingBall(pingBalls[i])
        }

        for (let i = 0; i < footballs.length; i += 1) {
          drawFootball(footballs[i])
        }

        for (let i = 0; i < arrows.length; i += 1) {
          drawArrow(arrows[i])
        }

        for (let i = 0; i < bodyguards.length; i += 1) {
          drawBodyguard(bodyguards[i])
        }

        ctx.restore()

        // HUD
        drawScores()
        drawShopButton()
        drawGoldCoins()
        drawNokiaDialButtons()
        drawRespawnCountdowns()
        drawBossHud()
        drawShop()
        drawCodes()
        drawWeaponSelect()
        drawNokiaDial()
        drawKillstreakWheel()
        drawScoreWheel()

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
      const max = fighter.maxLives || PLAYER_LIVES
      // Full HP: öka max med livedryckens heal (10 → 15 om heal = 5)
      if (fighter.lives >= max) {
        fighter.maxLives = max + LIFE_DRINK_HEAL
        fighter.lives = fighter.maxLives
      } else {
        fighter.lives = Math.min(max, fighter.lives + LIFE_DRINK_HEAL)
      }
      fighter.squash = 0.35
      spawnBurst(fighter.x, fighter.y, 1.1)
    }

    function useMcShield(fighter, side) {
      if (!fighter || fighter.eliminated || fighter.lives <= 0) return false
      if (isShielded(fighter)) return false
      if (side === 'red') {
        if (inventory.mcShieldRed <= 0) return false
        inventory.mcShieldRed -= 1
      } else {
        if (inventory.mcShieldBlue <= 0) return false
        inventory.mcShieldBlue -= 1
      }
      fighter.shieldUntil = performance.now() + MC_SHIELD_DURATION
      fighter.shieldKind = 'mc'
      fighter.squash = 0.25
      spawnBurst(fighter.x, fighter.y, 0.7)
      return true
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
        if (scoreWheelOpen) {
          closeScoreWheel()
          return
        }
        if (killstreakOpen) {
          closeKillstreak()
          return
        }
        closeShop()
        closeCodes()
        closeNokiaDial()
        return
      }
      if (nokiaDialOpen) {
        e.preventDefault()
        if (!e.repeat) {
          if (e.key === 'Enter') {
            submitNokiaDial()
            return
          }
          if (e.key === 'Backspace') {
            nokiaDialInput = nokiaDialInput.slice(0, -1)
            return
          }
          if (/^[0-9]$/.test(e.key) && nokiaDialInput.length < 6) {
            nokiaDialInput += e.key
            if (
              nokiaDialInput === NOKIA_DIAL_CODE ||
              nokiaDialInput === LEON_DIAL_CODE
            ) {
              submitNokiaDial()
            }
          }
        }
        return
      }
      if (weaponSelectOpen) {
        e.preventDefault()
        if (!e.repeat) {
          if (k === 'q') applyWeaponPick('red', 'bow')
          else if (k === 'e') applyWeaponPick('red', 'sword')
          else if (k === '1' || e.code === 'Digit1' || e.code === 'Numpad1') {
            applyWeaponPick('blue', 'bow')
          } else if (k === '2' || e.code === 'Digit2' || e.code === 'Numpad2') {
            applyWeaponPick('blue', 'sword')
          } else if (e.key === 'Enter' || k === ' ') {
            confirmWeaponSelect()
          }
        }
        return
      }
      if (codesOpen) {
        e.preventDefault()
        if (e.key === 'Enter') {
          submitCode()
          return
        }
        if (e.key === 'Backspace') {
          codesInput = codesInput.slice(0, -1)
          return
        }
        // Siffror + bokstäver (t.ex. ötis)
        if (e.key.length === 1 && codesInput.length < 16) {
          const ch = e.key.toLowerCase()
          if (/^[0-9a-zåäö ]$/i.test(ch)) {
            codesInput += ch
            const typed = codesInput.toLowerCase()
            if (
              typed === SECRET_CODE ||
              typed === OTIS_CODE ||
              typed === NERMIN_CODE ||
              typed === ALI_CODE ||
              typed === GRON_BOSS_CODE ||
              typed === MJOLK_CODE ||
              typed === RED_COINS_CODE
            ) {
              submitCode()
            }
          }
        }
        return
      }
      if (shopOpen || scoreWheelOpen || killstreakOpen) return
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
          !isShielded(player)
        ) {
          player.shieldUntil = performance.now() + SHIELD_DURATION
          player.shieldKind = 'basic'
          player.shieldUses -= 1
        }
        return
      }
      if (k === 'f' && !e.repeat) {
        e.preventDefault()
        const player = fighters.find((f) => f.player)
        if (player) useMcShield(player, 'red')
        return
      }
      if (k === 't' && !e.repeat) {
        e.preventDefault()
        useNuke('red')
        return
      }
      if (k === 'g' && !e.repeat) {
        e.preventDefault()
        const player = fighters.find((f) => f.player)
        if (player) placeWall(player)
        return
      }
      if (k === 'q' && !e.repeat) {
        e.preventDefault()
        const player = fighters.find((f) => f.player)
        if (player) swingKnife(player)
        return
      }
      if (k === 'r' && !e.repeat) {
        e.preventDefault()
        const player = fighters.find((f) => f.player)
        if (!player) return
        // R = Sus först, annars livedryck
        if (!useSus(player, 'red')) useLifeDrink(player, 'red')
        return
      }
      if ((k === '1' || e.code === 'Digit1' || e.code === 'Numpad1') && !e.repeat) {
        e.preventDefault()
        const blue = fighters.find((f) => f.control === 'arrows')
        if (blue) swingKnife(blue)
        return
      }
      if ((k === '2' || e.code === 'Digit2' || e.code === 'Numpad2') && !e.repeat) {
        e.preventDefault()
        const blue = fighters.find((f) => f.control === 'arrows')
        if (blue) useMcShield(blue, 'blue')
        return
      }
      if ((k === '3' || e.code === 'Digit3' || e.code === 'Numpad3') && !e.repeat) {
        e.preventDefault()
        const blue = fighters.find((f) => f.control === 'arrows')
        if (blue) useLifeDrink(blue, 'blue')
        return
      }
      if ((k === '7' || e.code === 'Digit7' || e.code === 'Numpad7') && !e.repeat) {
        e.preventDefault()
        useNuke('blue')
        return
      }
      if ((k === '8' || e.code === 'Digit8' || e.code === 'Numpad8') && !e.repeat) {
        e.preventDefault()
        const blue = fighters.find((f) => f.control === 'arrows')
        if (blue) placeWall(blue)
        return
      }
      if ((k === '0' || e.code === 'Digit0' || e.code === 'Numpad0') && !e.repeat) {
        e.preventDefault()
        const blue = fighters.find((f) => f.control === 'arrows')
        if (blue) useSus(blue, 'blue')
        return
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

      if (nokiaDialOpen) {
        for (let i = nokiaDialHits.length - 1; i >= 0; i -= 1) {
          const hit = nokiaDialHits[i]
          if (!hitRect(px, py, hit)) continue
          if (hit.id === 'close') closeNokiaDial()
          else if (hit.id === '⌫') nokiaDialInput = nokiaDialInput.slice(0, -1)
          else if (hit.id === 'OK') submitNokiaDial()
          else if (/^[0-9]$/.test(hit.id) && nokiaDialInput.length < 6) {
            nokiaDialInput += hit.id
            if (
              nokiaDialInput === NOKIA_DIAL_CODE ||
              nokiaDialInput === LEON_DIAL_CODE
            ) {
              submitNokiaDial()
            }
          }
          return
        }
        return
      }

      if (weaponSelectOpen) {
        for (let i = weaponSelectHits.length - 1; i >= 0; i -= 1) {
          const hit = weaponSelectHits[i]
          if (!hitRect(px, py, hit)) continue
          if (hit.id === 'start') confirmWeaponSelect()
          else if (hit.id === 'red-bow') applyWeaponPick('red', 'bow')
          else if (hit.id === 'red-sword') applyWeaponPick('red', 'sword')
          else if (hit.id === 'blue-bow') applyWeaponPick('blue', 'bow')
          else if (hit.id === 'blue-sword') applyWeaponPick('blue', 'sword')
          return
        }
        return
      }

      if (codesOpen) {
        closeCodes()
        return
      }

      if (scoreWheelOpen) {
        for (let i = scoreWheelHits.length - 1; i >= 0; i -= 1) {
          const hit = scoreWheelHits[i]
          if (!hitRect(px, py, hit)) continue
          if (hit.id === 'close') closeScoreWheel()
          return
        }
        return
      }

      if (killstreakOpen) {
        for (let i = killstreakHits.length - 1; i >= 0; i -= 1) {
          const hit = killstreakHits[i]
          if (!hitRect(px, py, hit)) continue
          if (hit.id === 'spin') startKillstreakSpin()
          else if (hit.id === 'close') closeKillstreak()
          return
        }
        return
      }

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

      if (inventory.nokiaRed && hitRect(px, py, nokiaDialButtonRed)) {
        openNokiaDial('red')
        return
      }
      if (inventory.nokiaBlue && hitRect(px, py, nokiaDialButtonBlue)) {
        openNokiaDial('blue')
        return
      }

      if (winner || bossMode) return

      if (hitRect(px, py, shopButton)) {
        openShop()
        return
      }
      if (hitRect(px, py, codesButton)) {
        openCodes()
      }
    }

    function onPointerMove(e) {
      const { x: px, y: py } = canvasPos(e)
      let over = hitRect(px, py, shopButton) || hitRect(px, py, codesButton)
      if (inventory.nokiaRed && hitRect(px, py, nokiaDialButtonRed)) over = true
      if (inventory.nokiaBlue && hitRect(px, py, nokiaDialButtonBlue)) over = true
      if (scoreWheelOpen) {
        over = scoreWheelHits.some((h) => hitRect(px, py, h)) || true
      }
      if (killstreakOpen) {
        over = killstreakHits.some((h) => hitRect(px, py, h)) || true
      }
      if (shopOpen) {
        over = shopHits.some((h) => hitRect(px, py, h))
      }
      if (weaponSelectOpen) {
        over = weaponSelectHits.some((h) => hitRect(px, py, h))
      }
      if (nokiaDialOpen) {
        over = nokiaDialHits.some((h) => hitRect(px, py, h)) || true
      }
      if (codesOpen) over = true
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
