// src/utils/sounds.ts
// ─────────────────────────────────────
// سیستم صداهای UI — نسخه ۲
// صداهای گرم و طبیعی با Web Audio API
// ─────────────────────────────────────

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    // Resume if suspended (مرورگرها نیاز به تعامل کاربر دارن)
    if (audioContext.state === 'suspended') {
      audioContext.resume()
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

export function setSoundEnabled(enabled: boolean): void {
  localStorage.setItem('modo-sound', enabled ? 'on' : 'off')
}

export function getSoundEnabled(): boolean {
  return isSoundEnabled()
}

// ═══════════════════════════════════════
// Helper: ساخت نت موسیقی گرم
// ═══════════════════════════════════════

function playNote(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  volume: number = 0.1,
  type: OscillatorType = 'triangle'
): void {
  // ─── اسیلاتور اصلی ───
  const osc1 = ctx.createOscillator()
  const gain1 = ctx.createGain()
  osc1.connect(gain1)
  gain1.connect(ctx.destination)
  osc1.type = type
  osc1.frequency.setValueAtTime(frequency, startTime)

  // ─── اسیلاتور دوم (کمی متفاوت برای گرما) ───
  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  osc2.connect(gain2)
  gain2.connect(ctx.destination)
  osc2.type = type
  osc2.frequency.setValueAtTime(frequency + 2, startTime) // +2Hz = chorus خفیف

  // ─── Envelope (حمله نرم + محو شدن آرام) ───
  const attackTime = 0.015
  const releaseStart = startTime + duration * 0.6

  gain1.gain.setValueAtTime(0, startTime)
  gain1.gain.linearRampToValueAtTime(volume, startTime + attackTime)
  gain1.gain.setValueAtTime(volume, releaseStart)
  gain1.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  gain2.gain.setValueAtTime(0, startTime)
  gain2.gain.linearRampToValueAtTime(volume * 0.3, startTime + attackTime)
  gain2.gain.setValueAtTime(volume * 0.3, releaseStart)
  gain2.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  osc1.start(startTime)
  osc1.stop(startTime + duration)
  osc2.start(startTime)
  osc2.stop(startTime + duration)
}

// ═══════════════════════════════════════
// صداها
// ═══════════════════════════════════════

// ─── تیک تسک: صدای زنگوله‌ای گرم ───
export function playTaskComplete(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  playNote(ctx, 659, now, 0.25, 0.1, 'triangle')        // E5
  playNote(ctx, 880, now + 0.1, 0.3, 0.08, 'triangle')   // A5
}

// ─── ارسال پیام: بلیپ صعودی نرم ───
export function playMessageSent(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.type = 'sine'
  osc.frequency.setValueAtTime(440, now)
  osc.frequency.exponentialRampToValueAtTime(660, now + 0.08)

  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.08, now + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

  osc.start(now)
  osc.stop(now + 0.12)
}

// ─── دریافت پیام: دو نت گرم (مثل نوتیفیکشن آیفون) ───
export function playMessageReceived(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  playNote(ctx, 392, now, 0.2, 0.08, 'triangle')          // G4
  playNote(ctx, 523, now + 0.12, 0.25, 0.06, 'triangle')  // C5
}

// ─── نشان کسب شده: آکورد ماژور شادی‌بخش ───
export function playBadgeEarned(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  // C major arpeggio: C5 → E5 → G5 → C6
  playNote(ctx, 523, now, 0.3, 0.08, 'triangle')           // C5
  playNote(ctx, 659, now + 0.15, 0.3, 0.08, 'triangle')    // E5
  playNote(ctx, 784, now + 0.30, 0.3, 0.08, 'triangle')    // G5
  playNote(ctx, 1047, now + 0.45, 0.45, 0.1, 'triangle')   // C6 (بلندتر و طولانی‌تر)
}

// ─── کلیک نرم: ضربه خیلی ظریف ───
export function playSoftClick(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.type = 'sine'
  osc.frequency.setValueAtTime(800, now)

  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.05, now + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

  osc.start(now)
  osc.stop(now + 0.04)
}

// ─── خطا: دو نت نزولی ملایم ───
export function playError(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  playNote(ctx, 330, now, 0.2, 0.08, 'sine')       // E4
  playNote(ctx, 262, now + 0.12, 0.25, 0.06, 'sine') // C4
}