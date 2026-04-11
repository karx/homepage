/**
 * input.mjs — unified input bus.
 *
 * Sources: text field, Web Speech API (voice), programmatic
 * Emits 'intent' CustomEvent with { text, source } on this.
 *
 * Usage:
 *   inputBus.bindTextInput(inputEl)
 *   inputBus.startVoice() / stopVoice()
 *   inputBus.addEventListener('intent', e => console.log(e.text, e.source))
 *   inputBus.push('Q668', 'seed')   // programmatic
 */

import { log } from '../logger.mjs';

class InputBus extends EventTarget {
  constructor() {
    super();
    this._recognition = null;
    this._voiceActive = false;
  }

  /** Dispatch an intent from any source. */
  push(text, source = 'api') {
    text = (text ?? '').trim();
    if (!text) return;
    log('INPUT', `[${source}] ${text}`);
    const ev = new CustomEvent('intent', { detail: { text, source } });
    this.dispatchEvent(ev);
  }

  /** Bind a text <input> — fires on Enter. */
  bindTextInput(el) {
    el.addEventListener('keydown', e => {
      if (e.key !== 'Enter' || e.isComposing) return;
      const text = el.value.trim();
      el.value = '';
      if (text) this.push(text, 'text');
    });
  }

  /** Start continuous voice recognition. */
  startVoice() {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) {
      log('SYSTEM', 'Web Speech API not supported in this browser');
      return false;
    }
    if (this._voiceActive) return true;

    this._recognition = new SR();
    this._recognition.continuous     = true;
    this._recognition.interimResults = false;
    this._recognition.lang           = 'en-US';

    this._recognition.onresult = e => {
      const t = e.results[e.results.length - 1][0].transcript.trim();
      if (t) this.push(t, 'voice');
    };
    this._recognition.onerror = e => log('ERROR', `Voice: ${e.error}`);
    this._recognition.onend   = () => {
      if (this._voiceActive) this._recognition.start(); // auto-restart on silence
    };

    this._recognition.start();
    this._voiceActive = true;
    log('SYSTEM', 'voice started');
    return true;
  }

  stopVoice() {
    this._voiceActive = false;
    this._recognition?.stop();
    log('SYSTEM', 'voice stopped');
  }

  get voiceActive() { return this._voiceActive; }
}

export const inputBus = new InputBus();
