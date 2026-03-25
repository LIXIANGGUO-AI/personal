/**
 * SoundEffects — 数字博物馆音效引擎
 * 基于 Web Audio API，无需外部音频文件
 *
 * 策略：在用户首次点击页面时预热 AudioContext，解决浏览器自动播放策略限制
 */

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.reelSource = null;
    this.reelGain = null;
    this.isReelPlaying = false;

    // 监听首次用户交互以预热 AudioContext
    const warmup = () => {
      this._ensureCtx();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      document.removeEventListener('pointerdown', warmup);
    };
    document.addEventListener('pointerdown', warmup);
  }

  _ensureCtx() {
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      return true;
    } catch (e) {
      console.warn('[SFX] AudioContext init failed:', e);
      return false;
    }
  }

  /**
   * 播放极短的白噪音脉冲（比正弦波更清脆、更有颗粒感）
   * @param {'open'|'close'} type - 操作类型
   */
  playWindowSound(type = 'open') {
    if (!this._ensureCtx() || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const duration = type === 'open' ? 0.06 : 0.09;

    // 白噪音缓冲区（短脉冲）
    const bufLen = Math.ceil(this.ctx.sampleRate * duration);
    const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1);
    }

    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    // 高通滤波：让打开音更亮脆 / 关闭音更低沉
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = type === 'open' ? 2200 : 600;

    // 增益包络：极短的 Attack + Decay
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(type === 'open' ? 0.18 : 0.12, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    src.start(t);
    src.stop(t + duration);
  }

  /**
   * 拖拽时的颗粒感"胶片转动"底噪
   */
  startFilmReel() {
    if (!this._ensureCtx() || !this.ctx) return;
    if (this.isReelPlaying) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.reelSource = this.ctx.createBufferSource();
    this.reelSource.buffer = noiseBuffer;
    this.reelSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 1;

    this.reelGain = this.ctx.createGain();
    this.reelGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.reelGain.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 0.05);

    this.reelSource.connect(filter);
    filter.connect(this.reelGain);
    this.reelGain.connect(this.ctx.destination);

    this.reelSource.start();
    this.isReelPlaying = true;
  }

  stopFilmReel() {
    if (!this.isReelPlaying || !this.reelGain || !this.ctx) return;
    this.reelGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
    setTimeout(() => {
      try { this.reelSource?.stop(); } catch (_) {}
      this.isReelPlaying = false;
    }, 110);
  }
}

export const sfx = new SoundEffects();
