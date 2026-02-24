// src/utils/sounds.ts
// ─────────────────────────────────────
// سیستم صداهای UI — نسخه ۳.۱
// صداهای طبیعی با Noise + FM Synthesis
// + صدای تایپ مکانیکی
// ─────────────────────────────────────

let audioContext: AudioContext | null = null
let noiseBuffer: AudioBuffer | null = null

// ─── ساخت AudioContext ───
function getAudioContext(): AudioContext | null {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }
    return audioContext
  } catch {
    return null
  }
}

// ─── ساخت بافر نویز (یکبار ساخته میشه، همیشه استفاده) ───
function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer
  const size = ctx.sampleRate
  noiseBuffer = ctx.createBuffer(1, size, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < size; i++) {
    data[i] = Math.random() * 2 - 1
  }
  return noiseBuffer
}

// ─── چک تنظیمات ───
function isSoundEnabled(): boolean {
  return localStorage.getItem('modo-sound') !== 'off'
}

export function setSoundEnabled(enabled: boolean): void {
  localStorage.setItem('modo-sound', enabled ? 'on' : 'off')
}

export function getSoundEnabled(): boolean {
  return isSoundEnabled()
}

// ═══════════════════════════════════════
// Helper: صدای نویز فیلترشده (کلیک طبیعی)
// ═══════════════════════════════════════

function playNoiseBurst(
  ctx: AudioContext,
  filterFreq: number,
  filterQ: number,
  duration: number,
  volume: number,
  filterType: BiquadFilterType = 'bandpass'
): void {
  const source = ctx.createBufferSource()
  source.buffer = getNoiseBuffer(ctx)

  const filter = ctx.createBiquadFilter()
  filter.type = filterType
  filter.frequency.value = filterFreq
  filter.Q.value = filterQ

  const gain = ctx.createGain()
  const now = ctx.currentTime
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(volume, now + 0.002)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  source.start(now)
  source.stop(now + duration + 0.01)
}

// ═══════════════════════════════════════
// Helper: تون گرم با هارمونیک
// ═══════════════════════════════════════

function playWarmTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  volume: number
): void {
  const osc1 = ctx.createOscillator()
  osc1.type = 'triangle'
  osc1.frequency.value = freq

  const osc2 = ctx.createOscillator()
  osc2.type = 'sine'
  osc2.frequency.value = freq * 2

  const osc3 = ctx.createOscillator()
  osc3.type = 'sine'
  osc3.frequency.value = freq + 1.5

  const gain1 = ctx.createGain()
  const gain2 = ctx.createGain()
  const gain3 = ctx.createGain()

  osc1.connect(gain1)
  osc2.connect(gain2)
  osc3.connect(gain3)
  gain1.connect(ctx.destination)
  gain2.connect(ctx.destination)
  gain3.connect(ctx.destination)

  const attack = 0.012
  const releaseStart = startTime + duration * 0.5

  gain1.gain.setValueAtTime(0, startTime)
  gain1.gain.linearRampToValueAtTime(volume, startTime + attack)
  gain1.gain.setValueAtTime(volume, releaseStart)
  gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  gain2.gain.setValueAtTime(0, startTime)
  gain2.gain.linearRampToValueAtTime(volume * 0.15, startTime + attack)
  gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  gain3.gain.setValueAtTime(0, startTime)
  gain3.gain.linearRampToValueAtTime(volume * 0.2, startTime + attack)
  gain3.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  osc1.start(startTime)
  osc1.stop(startTime + duration + 0.01)
  osc2.start(startTime)
  osc2.stop(startTime + duration + 0.01)
  osc3.start(startTime)
  osc3.stop(startTime + duration + 0.01)
}

// ═══════════════════════════════════════
// Helper: صدای پاپ (ارسال و دریافت مشترک)
// ═══════════════════════════════════════

function playPopSound(): void {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.type = 'sine'
  osc.frequency.setValueAtTime(350, now)
  osc.frequency.exponentialRampToValueAtTime(700, now + 0.06)

  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.06, now + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1)

  osc.start(now)
  osc.stop(now + 0.12)

  playNoiseBurst(ctx, 5000, 1, 0.015, 0.015, 'highpass')
}

// ═══════════════════════════════════════
// صداها
// ═══════════════════════════════════════

// ─── صدای تایپ (مکانیکی نرم) ───
let lastTypingTime = 0

export function playTypingSound(): void {
  if (!isSoundEnabled()) return

  const now = Date.now()
  if (now - lastTypingTime < 35) return
  lastTypingTime = now

  const ctx = getAudioContext()
  if (!ctx) return

  const freqVariation = 2500 + Math.random() * 2500
  const volumeVariation = 0.025 + Math.random() * 0.015

  playNoiseBurst(ctx, freqVariation, 1.5, 0.018, volumeVariation)
}

// ─── صدای بلندتر برای Backspace / Enter / Space ───
export function playTypingSpecial(): void {
  if (!isSoundEnabled()) return

  const now = Date.now()
  if (now - lastTypingTime < 35) return
  lastTypingTime = now

  const ctx = getAudioContext()
  if (!ctx) return

  playNoiseBurst(ctx, 1800 + Math.random() * 1000, 1, 0.025, 0.04)
}

// ─── تیک تسک: صدای نرم و رضایت‌بخش ───
export function playTaskComplete(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime

  // یه "پاپ" نرم‌تر و بم‌تر
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.type = 'sine'
  osc.frequency.setValueAtTime(280, now)
  osc.frequency.exponentialRampToValueAtTime(520, now + 0.07)

  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.07, now + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15)

  osc.start(now)
  osc.stop(now + 0.17)

  // نویز خفیف
  playNoiseBurst(ctx, 3000, 1, 0.02, 0.012, 'highpass')
}

// ─── ارسال پیام: صدای "پاپ" ───
export function playMessageSent(): void {
  if (!isSoundEnabled()) return
  playPopSound()
}

// ─── دریافت پیام: همون صدای "پاپ" ───
export function playMessageReceived(): void {
  if (!isSoundEnabled()) return
  playPopSound()
}

// ─── نشان کسب شده: آکورد ماژور ───
export function playBadgeEarned(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime

  playWarmTone(ctx, 523, now, 0.3, 0.06)
  playWarmTone(ctx, 659, now + 0.15, 0.3, 0.06)
  playWarmTone(ctx, 784, now + 0.30, 0.3, 0.06)
  playWarmTone(ctx, 1047, now + 0.45, 0.45, 0.08)

  playNoiseBurst(ctx, 6000, 0.5, 0.08, 0.02, 'highpass')
}

// ─── کلیک نرم ───
export function playSoftClick(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  playNoiseBurst(ctx, 4000 + Math.random() * 1000, 2, 0.01, 0.02)
}

// ─── خطا: دو نت نزولی ملایم ───
export function playError(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  playWarmTone(ctx, 330, now, 0.22, 0.06)
  playWarmTone(ctx, 262, now + 0.14, 0.28, 0.05)
}