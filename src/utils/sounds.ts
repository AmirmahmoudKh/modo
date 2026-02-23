// src/utils/sounds.ts
// ─────────────────────────────────────
// سیستم صداهای UI — Web Audio API
// بدون فایل صوتی — تولید با کد
// ─────────────────────────────────────

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return audioContext
  } catch {
    return null
  }
}

// ─── چک تنظیمات ───
function isSoundEnabled(): boolean {
  return localStorage.getItem('modo-sound') !== 'off'
}

// ─── تنظیم صدا ───
export function setSoundEnabled(enabled: boolean): void {
  localStorage.setItem('modo-sound', enabled ? 'on' : 'off')
}

export function getSoundEnabled(): boolean {
  return isSoundEnabled()
}

// ═══════════════════════════════════════
// صداها
// ═══════════════════════════════════════

// ─── تیک تسک ───
export function playTaskComplete(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.type = 'sine'
  osc.frequency.setValueAtTime(800, ctx.currentTime)
  osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.08)

  gain.gain.setValueAtTime(0.15, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.2)
}

// ─── ارسال پیام ───
export function playMessageSent(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.type = 'sine'
  osc.frequency.setValueAtTime(600, ctx.currentTime)
  osc.frequency.setValueAtTime(900, ctx.currentTime + 0.06)

  gain.gain.setValueAtTime(0.1, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.12)
}

// ─── دریافت پیام ───
export function playMessageReceived(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.type = 'sine'
  osc.frequency.setValueAtTime(500, ctx.currentTime)
  osc.frequency.setValueAtTime(700, ctx.currentTime + 0.1)
  osc.frequency.setValueAtTime(500, ctx.currentTime + 0.2)

  gain.gain.setValueAtTime(0.1, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.25)
}

// ─── نشان کسب شده ───
export function playBadgeEarned(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  // سه نت متوالی
  const notes = [523, 659, 784] // C5, E5, G5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12)

    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12)
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + i * 0.12 + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.2)

    osc.start(ctx.currentTime + i * 0.12)
    osc.stop(ctx.currentTime + i * 0.12 + 0.2)
  })
}

// ─── کلیک نرم ───
export function playSoftClick(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.type = 'sine'
  osc.frequency.setValueAtTime(1000, ctx.currentTime)

  gain.gain.setValueAtTime(0.08, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.06)
}

// ─── خطا ───
export function playError(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.type = 'sine'
  osc.frequency.setValueAtTime(400, ctx.currentTime)
  osc.frequency.setValueAtTime(300, ctx.currentTime + 0.1)

  gain.gain.setValueAtTime(0.12, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.2)
}