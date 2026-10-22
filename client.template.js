window.__ModuleLoader__.load({
  id: '@local/dsh-deepy-pet',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Package identity: also the theme-independent style-tag and storage owner. */
    const PKG = '@local/dsh-deepy-pet';
    /** Locale namespace owned by this plugin. */
    const NS = 'deepy-pet';
    /** Page-local preference key (position, size, enable flag, pinned animation). */
    const STORAGE_KEY = 'dsh.deepy-pet.v1';

    /**
     * Sprite sheets copied from Nwflower/dsh-claude-style (MIT; the Deepy frames
     * themselves are by calm-eating-bugs). Each sheet is 8 frames wide, five
     * device pixels per logical pixel, cropped to `box` = [x, y, w, h] in the
     * 52x52 logical grid. The raw sheets carry no transparent gutter, so a cell
     * is exactly the crop box.
     */
    const FRAME_MS = 50;
    const GRID = 52;

    /** Animations, their frame counts, crop boxes and reduced-motion still frame. */
    const SHEETS = {
      'idle': { frames: 48, box: [12, 26, 36, 24], still: 0 },
      'idle-look': { frames: 68, box: [11, 11, 37, 39], still: 0 },
      'idle-spout': { frames: 64, box: [8, 17, 39, 33], still: 0 },
      'thinking': { frames: 48, box: [0, 6, 47, 44], still: 20 },
      'typing': { frames: 48, box: [0, 17, 52, 33], still: 16 },
      'music': { frames: 32, box: [2, 10, 48, 40], still: 0 },
      'conducting': { frames: 48, box: [1, 0, 51, 50], still: 6 },
      'building': { frames: 48, box: [2, 0, 50, 50], still: 0 },
      'error': { frames: 48, box: [4, 17, 45, 33], still: 24 },
      'happy': { frames: 52, box: [0, 5, 52, 45], still: 44 },
      'notification': { frames: 32, box: [3, 7, 47, 43], still: 12 },
      'compacting': { frames: 56, box: [2, 14, 46, 36], still: 20 },
      'sleeping': { frames: 64, box: [2, 2, 44, 48], still: 10 },
      'waking': { frames: 30, box: [8, 4, 44, 46], still: 29 },
      'poke-left': { frames: 40, box: [1, 16, 50, 34], still: 0 },
      'poke-right': { frames: 40, box: [8, 16, 44, 34], still: 0 },
      'tickle': { frames: 48, box: [9, 17, 43, 33], still: 0 },
      'drag': { frames: 24, box: [10, 4, 41, 46], still: 0 },
    };
    /** Every animation key, in the order the preview chips show them. */
    const ORDER = [
      'idle', 'idle-look', 'idle-spout', 'happy', 'notification', 'thinking',
      'typing', 'music', 'conducting', 'building', 'error', 'compacting',
      'sleeping', 'waking', 'poke-left', 'poke-right', 'tickle', 'drag',
    ];
    /** Idle amusements played on their own between jobs. */
    const EXTRAS = ['idle-look', 'idle-spout'];

    const DEFAULT_STATE = {
      enabled: true,
      size: 104,
      offset: 8,
      lift: 0,
      reactive: true,
      sound: false,
      volume: 50,
      chime: 'bloop',
      custom: '',
      customName: '',
      pinned: '',
    };
    /** The chimes the pet can play, each a short synthesized phrase. */
    const CHIMES = ['bloop', 'chime', 'coin', 'marimba', 'bubble'];
    /** The chime key that plays the reader's own file instead of a synthesized phrase. */
    const CUSTOM = 'custom';
    /** Reject a custom file larger than this; base64 inflates it by a third. */
    const CUSTOM_MAX_BYTES = 1.5 * 1024 * 1024;
    /** How long a stream chunk counts as "still streaming" after it arrives. */
    const STREAM_FRESH_MS = 1500;
    /** How long the happy hop plays when a turn finishes. */
    const HAPPY_MS = 3200;
    /** Quiet time before the whale nods off. */
    const SLEEP_AFTER_MS = 45000;
    /** Clicks closer together than this are one run; four of them tickle. */
    const TICKLE_GAP_MS = 450;
    const TICKLE_CLICKS = 4;

    const DICT = {
      en: {
        'title': 'Deepy pet',
        'hint': 'Perched on the input box. Click to poke; four quick clicks tickle; it naps when you are away.',
        'section.label': 'Deepy',
        'section.display': 'Display',
        'section.display.desc': 'Turn the pet on or off. It stands on the input box, in the conversation only.',
        'section.layout': 'Size and placement',
        'section.layout.desc': 'The preview shows the pose it is holding. Changes apply immediately.',
        'section.animations': 'Animation',
        'section.animations.desc': 'Auto lets the pet follow the conversation. Picking an animation pins it, ignoring the live state until you pick Auto again.',
        'section.reactive': 'React to the conversation',
        'section.reactive.desc': 'When on, the pet shows what the agent is doing instead of resting. Turn it off to always see the idle loop.',
        'section.sound': 'Sound on finish',
        'section.sound.desc': 'Play a short chime when a turn finishes. It fires only on a real completion: never on a failure, and never while the agent is still waiting on you. The sound works with the pet hidden.',
        'sound.on': 'On \u2014 click to mute',
        'sound.off': 'Off \u2014 click to enable',
        'volume': 'Volume',
        'chime.bloop': 'Bloop',
        'chime.chime': 'Chime',
        'chime.coin': 'Coin',
        'chime.marimba': 'Marimba',
        'chime.bubble': 'Bubble',
        'chime.custom': 'My file',
        'custom.pick': 'Choose a file\u2026',
        'custom.none': 'No file yet \u2014 pick one or drop it here',
        'custom.loaded': 'Loaded',
        'custom.clear': 'Remove',
        'custom.hint': 'Any audio format your browser can play (mp3, wav, ogg, m4a\u2026), up to 1.5 MB. It is stored in this browser only and never uploaded. The volume slider applies to it too.',
        'custom.err.none': 'No file was chosen.',
        'custom.err.size': 'That file is over 1.5 MB. Pick a shorter sound.',
        'custom.err.read': 'That file could not be read.',
        'custom.err.decode': 'That file is not audio this browser can decode.',
        'reactive.on': 'Following \u2014 click to stop',
        'reactive.off': 'Not following \u2014 click to follow',
        'map.thinking': '\u2022 Thinking \u2014 a request is in flight, no output yet',
        'map.typing': '\u2022 Typing \u2014 the answer is streaming in',
        'map.compacting': '\u2022 Compacting \u2014 the context is being rewritten',
        'map.conducting': '\u2022 Conducting \u2014 two or more subagents are working at once',
        'map.music': '\u2022 Music \u2014 one subagent or a second busy session',
        'map.building': '\u2022 Building \u2014 three or more sessions busy at once',
        'map.error': '\u2022 Error \u2014 the turn failed',
        'map.question': '\u2022 Waiting \u2014 the agent needs your answer',
        'map.tools': '\u2022 Typing also covers tool calls: while a tool runs, the pet keeps working',
        'map.happy': '\u2022 Happy \u2014 a turn just finished',
        'map.idle': '\u2022 Idle \u2014 resting, looking around now and then, napping when you are away',
        'enabled.on': 'On \u2014 click to hide',
        'enabled.off': 'Off \u2014 click to show',
        'enabled': 'Show Deepy',
        'size': 'Size',
        'offset': 'Inset from the right',
        'lift': 'Vertical nudge',
        'pin': 'Preview an animation',
        'pin.auto': 'Auto',
        'anim.idle': 'Idle',
        'anim.idle-look': 'Look around',
        'anim.idle-spout': 'Spout',
        'anim.happy': 'Happy',
        'anim.notification': 'Notice',
        'anim.thinking': 'Thinking',
        'anim.typing': 'Typing',
        'anim.music': 'Music',
        'anim.conducting': 'Conducting',
        'anim.building': 'Building',
        'anim.error': 'Error',
        'anim.compacting': 'Compacting',
        'anim.sleeping': 'Sleeping',
        'anim.waking': 'Waking',
        'anim.poke-left': 'Poke left',
        'anim.poke-right': 'Poke right',
        'anim.tickle': 'Tickle',
        'anim.drag': 'Drag',
      },
      zh: {
        'title': '\u5c0f\u9cb8\u9c7c Deepy',
        'hint': '\u8db4\u5728\u8f93\u5165\u6846\u4e0a\u6cbf\u3002\u5355\u51fb\u6233\u4e00\u4e0b\uff0c\u8fde\u70b9\u56db\u4e0b\u4f1a\u54c8\u75d2\uff1b\u4f60\u4e0d\u5728\u65f6\u5b83\u4f1a\u6253\u76f9\u3002',
        'section.label': '\u5c0f\u9cb8\u9c7c Deepy',
        'section.display': '\u663e\u793a',
        'section.display.desc': '\u6253\u5f00\u6216\u5173\u95ed\u5ba0\u7269\u3002\u5b83\u53ea\u5728\u4f1a\u8bdd\u91cc\u51fa\u73b0\uff0c\u8db4\u5728\u8f93\u5165\u6846\u4e0a\u6cbf\u3002',
        'section.layout': '\u5927\u5c0f\u4e0e\u4f4d\u7f6e',
        'section.layout.desc': '\u5de6\u4fa7\u9884\u89c8\u5c31\u662f\u5b83\u5f53\u524d\u7684\u59ff\u6001\uff0c\u8c03\u6574\u7acb\u5373\u751f\u6548\u3002',
        'section.animations': '\u52a8\u753b',
        'section.animations.desc': '\u9009\u300c\u81ea\u52a8\u300d\u65f6\uff0c\u5b83\u8ddf\u7740\u5bf9\u8bdd\u7684\u771f\u5b9e\u72b6\u6001\u53d8\u3002\u9009\u4e2d\u67d0\u4e00\u4e2a\u5219\u9501\u5b9a\uff0c\u5ffd\u7565\u5b9e\u65f6\u72b6\u6001\uff0c\u76f4\u5230\u4f60\u9009\u56de\u81ea\u52a8\u3002',
        'section.reactive': '\u8ddf\u968f\u5bf9\u8bdd\u72b6\u6001',
        'section.reactive.desc': '\u5f00\u542f\u540e\u5b83\u4f1a\u544a\u8bc9\u4f60 agent \u5728\u5e72\u4ec0\u4e48\u800c\u4e0d\u662f\u4e00\u76f4\u5f85\u673a\u3002\u5173\u6389\u5219\u603b\u662f\u5f85\u673a\u5faa\u73af\u3002',
        'section.sound': '\u5b8c\u6210\u63d0\u793a\u97f3',
        'section.sound.desc': '\u4e00\u8f6e\u7ed3\u675f\u65f6\u64ad\u4e00\u4e2a\u77ed\u97f3\u3002\u53ea\u5728\u771f\u6b63\u5b8c\u6210\u65f6\u54cd\uff1a\u62a5\u9519\u4e0d\u54cd\uff0c\u7b49\u4f60\u56de\u7b54\u65f6\u4e5f\u4e0d\u54cd\u3002\u5173\u6389\u5ba0\u7269\u4e5f\u4e0d\u5f71\u54cd\u58f0\u97f3\u3002',
        'sound.on': '\u5df2\u5f00\u542f \u2014 \u70b9\u51fb\u9759\u97f3',
        'sound.off': '\u5df2\u5173\u95ed \u2014 \u70b9\u51fb\u5f00\u542f',
        'volume': '\u97f3\u91cf',
        'chime.bloop': '\u6c34\u6ce1\u58f0',
        'chime.chime': '\u98ce\u94c3',
        'chime.coin': '\u91d1\u5e01',
        'chime.marimba': '\u6728\u7434',
        'chime.bubble': '\u5192\u6ce1',
        'chime.custom': '\u6211\u7684\u6587\u4ef6',
        'custom.pick': '\u9009\u62e9\u6587\u4ef6\u2026',
        'custom.none': '\u8fd8\u6ca1\u6709\u6587\u4ef6 \u2014 \u70b9\u4e0a\u9762\u9009\u62e9\uff0c\u6216\u62d6\u5230\u8fd9\u91cc',
        'custom.loaded': '\u5df2\u52a0\u8f7d',
        'custom.clear': '\u79fb\u9664',
        'custom.hint': '\u4efb\u4f55\u6d4f\u89c8\u5668\u80fd\u64ad\u7684\u683c\u5f0f\uff08mp3\u3001wav\u3001ogg\u3001m4a\u2026\uff09\uff0c\u4e0a\u9650 1.5 MB\u3002\u53ea\u5b58\u5728\u8fd9\u4e2a\u6d4f\u89c8\u5668\u91cc\uff0c\u4e0d\u4f1a\u4e0a\u4f20\u3002\u97f3\u91cf\u6ed1\u5757\u5bf9\u5b83\u540c\u6837\u751f\u6548\u3002',
        'custom.err.none': '\u6ca1\u6709\u9009\u4e2d\u6587\u4ef6\u3002',
        'custom.err.size': '\u6587\u4ef6\u8d85\u8fc7 1.5 MB\uff0c\u8bf7\u6362\u4e00\u4e2a\u66f4\u77ed\u7684\u97f3\u6548\u3002',
        'custom.err.read': '\u6587\u4ef6\u8bfb\u53d6\u5931\u8d25\u3002',
        'custom.err.decode': '\u8fd9\u4e2a\u6587\u4ef6\u4e0d\u662f\u6d4f\u89c8\u5668\u80fd\u89e3\u7801\u7684\u97f3\u9891\u3002',
        'reactive.on': '\u5df2\u8ddf\u968f \u2014 \u70b9\u51fb\u505c\u6b62',
        'reactive.off': '\u672a\u8ddf\u968f \u2014 \u70b9\u51fb\u8ddf\u968f',
        'map.thinking': '\u2022 \u601d\u8003 \u2014 \u8bf7\u6c42\u5df2\u53d1\u51fa\uff0c\u8fd8\u6ca1\u6709\u8f93\u51fa',
        'map.typing': '\u2022 \u6253\u5b57 \u2014 \u56de\u7b54\u6b63\u5728\u6d41\u5f0f\u8f93\u51fa',
        'map.compacting': '\u2022 \u538b\u7f29 \u2014 \u4e0a\u4e0b\u6587\u6b63\u5728\u91cd\u5199',
        'map.conducting': '\u2022 \u6307\u6325 \u2014 \u4e24\u4e2a\u6216\u4ee5\u4e0a\u5b50\u4ee3\u7406\u540c\u65f6\u5e72\u6d3b',
        'map.music': '\u2022 \u542c\u6b4c \u2014 \u4e00\u4e2a\u5b50\u4ee3\u7406\uff0c\u6216\u8005\u7b2c\u4e8c\u4e2a\u4f1a\u8bdd\u4e5f\u5728\u5fd9',
        'map.building': '\u2022 \u642c\u7816 \u2014 \u4e09\u4e2a\u6216\u4ee5\u4e0a\u4f1a\u8bdd\u540c\u65f6\u5e72\u6d3b',
        'map.error': '\u2022 \u62a5\u9519 \u2014 \u8fd9\u4e00\u8f6e\u5931\u8d25',
        'map.question': '\u2022 \u7b49\u5f85 \u2014 agent \u9700\u8981\u4f60\u56de\u7b54',
        'map.tools': '\u2022 \u300c\u6253\u5b57\u300d\u4e5f\u5305\u542b\u5de5\u5177\u8c03\u7528\uff1a\u5de5\u5177\u8fd0\u884c\u671f\u95f4\u5b83\u4e00\u76f4\u5728\u5e72\u6d3b',
        'map.happy': '\u2022 \u5f00\u5fc3 \u2014 \u4e00\u8f6e\u521a\u521a\u5b8c\u6210',
        'map.idle': '\u2022 \u5f85\u673a \u2014 \u4f11\u606f\uff0c\u95f4\u6216\u5f20\u671b\uff0c\u4f60\u4e0d\u5728\u65f6\u6253\u76f9',
        'enabled.on': '\u5df2\u5f00\u542f \u2014 \u70b9\u51fb\u9690\u85cf',
        'enabled.off': '\u5df2\u5173\u95ed \u2014 \u70b9\u51fb\u663e\u793a',
        'enabled': '\u663e\u793a Deepy',
        'size': '\u5927\u5c0f',
        'offset': '\u8ddd\u53f3\u4fa7\u8ddd\u79bb',
        'lift': '\u5782\u76f4\u5fae\u8c03',
        'pin': '\u9884\u89c8\u52a8\u753b',
        'pin.auto': '\u81ea\u52a8',
        'anim.idle': '\u5f85\u673a',
        'anim.idle-look': '\u56db\u5904\u5f20\u671b',
        'anim.idle-spout': '\u55b7\u6c34',
        'anim.happy': '\u5f00\u5fc3',
        'anim.notification': '\u63d0\u9192',
        'anim.thinking': '\u601d\u8003',
        'anim.typing': '\u6253\u5b57',
        'anim.music': '\u542c\u6b4c',
        'anim.conducting': '\u6307\u6325',
        'anim.building': '\u642c\u7816',
        'anim.error': '\u62a5\u9519',
        'anim.compacting': '\u538b\u7f29',
        'anim.sleeping': '\u7761\u89c9',
        'anim.waking': '\u9192\u6765',
        'anim.poke-left': '\u6233\u5de6',
        'anim.poke-right': '\u6233\u53f3',
        'anim.tickle': '\u54c8\u75d2',
        'anim.drag': '\u88ab\u62d6\u62fd',
      },
    };

    /** Sprite sheets as data URIs, filled in by build.mjs. */
    const SHEET_DATA = __SHEET_DATA__;

    function clamp(value, min, max, fallback) {
      const number = typeof value === 'number' ? value : Number(value);
      if (!Number.isFinite(number)) return fallback;
      return Math.min(max, Math.max(min, Math.round(number)));
    }

    function loadState() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return Object.assign({}, DEFAULT_STATE);
        const parsed = JSON.parse(raw) || {};
        return {
          enabled: parsed.enabled !== false,
          size: clamp(parsed.size, 60, 220, DEFAULT_STATE.size),
          offset: clamp(parsed.offset, 0, 600, DEFAULT_STATE.offset),
          lift: clamp(parsed.lift, -40, 40, DEFAULT_STATE.lift),
          reactive: parsed.reactive !== false,
          sound: parsed.sound === true,
          volume: clamp(parsed.volume, 0, 100, DEFAULT_STATE.volume),
          chime: CHIMES.indexOf(parsed.chime) >= 0 || parsed.chime === CUSTOM
            ? parsed.chime
            : DEFAULT_STATE.chime,
          custom: typeof parsed.custom === 'string' ? parsed.custom : '',
          customName: typeof parsed.customName === 'string' ? parsed.customName : '',
          pinned: ORDER.indexOf(parsed.pinned) >= 0 ? parsed.pinned : '',
        };
      } catch {
        return Object.assign({}, DEFAULT_STATE);
      }
    }

    /**
     * Persist the state.
     *
     * A custom sound is a data URL and can be large, so a quota failure must not
     * lose every other setting: on failure the copy is retried without the audio,
     * keeping the rest of the preferences.
     */
    function saveState(state) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return true;
      } catch {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.assign({}, state, {
            custom: '',
            customName: '',
            chime: state.chime === CUSTOM ? DEFAULT_STATE.chime : state.chime,
          })));
        } catch {
          /* private mode or a full quota: the choice simply does not persist */
        }
        return false;
      }
    }

    function motionReduced() {
      try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      } catch {
        return false;
      }
    }

    /**
     * Synthesized chimes, played with the Web Audio API.
     *
     * No audio file ships with the plugin: each chime is a short phrase of
     * oscillator notes with an exponential decay envelope, so the payload stays
     * zero and the pitch can be tuned. The context is created lazily on the first
     * play, because browsers only allow audio after a user gesture — the first
     * turn a reader finishes always follows a click or a key press, so the
     * gesture requirement is already satisfied by then. A blocked context is a
     * silent no-op, never an error.
     */
    const Chimes = {
      /* [frequency, start offset seconds, duration seconds] */
      bloop: [[523.25, 0, 0.14], [783.99, 0.07, 0.18]],
      chime: [[659.25, 0, 0.5], [880.0, 0.06, 0.5], [1318.51, 0.12, 0.45]],
      coin: [[987.77, 0, 0.08], [1318.51, 0.08, 0.3]],
      marimba: [[440.0, 0, 0.22], [554.37, 0.1, 0.22], [659.25, 0.2, 0.34]],
      bubble: [[880.0, 0, 0.09], [1046.5, 0.06, 0.09], [1318.51, 0.12, 0.16]],
    };

    let audioContext = null;

    function audioSupported() {
      return typeof window !== 'undefined' &&
        (typeof window.AudioContext === 'function' || typeof window.webkitAudioContext === 'function');
    }

    /** One shared context, created on first use and resumed if a browser parked it. */
    function ensureAudio() {
      if (!audioSupported()) return null;
      if (audioContext === null) {
        try {
          const Ctor = window.AudioContext || window.webkitAudioContext;
          audioContext = new Ctor();
        } catch {
          audioContext = null;
          return null;
        }
      }
      if (audioContext.state === 'suspended') {
        try {
          audioContext.resume().catch(() => {});
        } catch {
          /* a refused resume leaves the chime silent, which is acceptable */
        }
      }
      return audioContext;
    }

    /**
     * Play one chime.
     * @param name - a key of {@link Chimes}, or {@link CUSTOM}; unknown is a no-op.
     * @param volume - 0..100, mapped to a gentle peak gain.
     * @param custom - the reader's own sound as a data URL, used only when `name`
     *   is {@link CUSTOM}.
     */
    function playChime(name, volume, custom) {
      const level = Math.min(100, Math.max(0, volume)) / 100;
      if (level === 0) return;
      if (name === CUSTOM) {
        playCustom(custom, level);
        return;
      }
      const notes = Chimes[name];
      if (notes === undefined) return;
      const context = ensureAudio();
      if (context === null) return;
      const started = context.currentTime;
      /* A short phrase peaks well below full scale: this is a notification, not an alarm. */
      const peak = 0.22 * level;
      for (const [frequency, offset, duration] of notes) {
        try {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = 'sine';
          oscillator.frequency.value = frequency;
          const at = started + offset;
          gain.gain.setValueAtTime(0.0001, at);
          gain.gain.exponentialRampToValueAtTime(peak, at + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(at);
          oscillator.stop(at + duration + 0.02);
          /* Release the nodes once the note is over. */
          oscillator.addEventListener('ended', () => {
            try {
              oscillator.disconnect();
              gain.disconnect();
            } catch {
              /* already torn down */
            }
          });
        } catch {
          /* one bad note must not silence the rest of the phrase */
        }
      }
    }

    /**
     * Decoded custom sounds, keyed by their data URL.
     *
     * Decoding is async and the same file replays on every finished turn, so the
     * buffer is cached. A cache entry of `null` records a file that failed to
     * decode, which keeps a broken file from being retried on every turn.
     */
    const customBuffers = new Map();

    /**
     * Play the reader's own sound through the same gain path as the synthesized
     * chimes, so one volume control governs both.
     * @param dataUrl - the file as a data URL; empty means nothing was chosen.
     * @param level - 0..1 peak level.
     */
    function playCustom(dataUrl, level) {
      if (typeof dataUrl !== 'string' || dataUrl === '') return;
      const context = ensureAudio();
      if (context === null) return;

      const start = (buffer) => {
        if (buffer === null || buffer === undefined) return;
        try {
          const source = context.createBufferSource();
          const gain = context.createGain();
          source.buffer = buffer;
          gain.gain.value = level;
          source.connect(gain);
          gain.connect(context.destination);
          source.start();
          source.addEventListener('ended', () => {
            try {
              source.disconnect();
              gain.disconnect();
            } catch {
              /* already torn down */
            }
          });
        } catch {
          /* a refused playback leaves the turn silent */
        }
      };

      const cached = customBuffers.get(dataUrl);
      if (cached !== undefined) {
        start(cached);
        return;
      }

      /* fetch a data URL never leaves the machine and needs no user gesture. */
      fetch(dataUrl)
        .then((response) => response.arrayBuffer())
        .then((bytes) => new Promise((resolve, reject) => {
          /* decodeAudioData has both promise and callback forms across browsers. */
          const settled = context.decodeAudioData(bytes, resolve, reject);
          if (settled !== undefined && typeof settled.then === 'function') settled.then(resolve, reject);
        }))
        .then((buffer) => {
          customBuffers.set(dataUrl, buffer);
          start(buffer);
        })
        .catch(() => {
          customBuffers.set(dataUrl, null);
        });
    }

    /** Drop a cached custom sound after the reader replaces or clears it. */
    function forgetCustom(dataUrl) {
      if (typeof dataUrl === 'string' && dataUrl !== '') customBuffers.delete(dataUrl);
    }

    /** Stop the shared context; used when the plugin unloads. */
    function closeAudio() {
      if (audioContext === null) return;
      try {
        audioContext.close().catch(() => {});
      } catch {
        /* ignore */
      }
      audioContext = null;
    }

    /**
     * Map live Session facts onto Deepy's animations.
     *
     * The pet is a status indicator, not decoration: every animation it plays
     * on its own has a real cause. Facts come from the dock's standard props
     * (`useSession` for `running`/`lastAgentError`, `useSessionStatus` for the
     * pending interaction and the whole workspace's running set, `useSessions`
     * for the subagent catalog) and from the Session event stream for the fine
     * grained moments (a stream chunk, a compaction, a finished turn).
     *
     * The crowd-tier mapping for `music` / `conducting` / `building` follows the
     * original project's `mascotLevel()`: one subagent conducting is a duet
     * (`music`), two or more is a full orchestra (`conducting`), and three or
     * more busy sessions at once is heavy labour (`building`).
     *
     * Priority, highest first: a pinned preview, a timed override (error,
     * finished turn), a pending question, compaction, subagents at work, the
     * crowd tier, streaming, thinking, then the resting loop.
     */
    const MOOD = {
      error: { key: 'error', hold: 6000 },
      question: { key: 'notification', hold: 5000 },
      compacting: { key: 'compacting', hold: 4000 },
      conducting: { key: 'conducting', hold: 0 },
      music: { key: 'music', hold: 0 },
      building: { key: 'building', hold: 0 },
      typing: { key: 'typing', hold: 0 },
      thinking: { key: 'thinking', hold: 0 },
      happy: { key: 'happy', hold: HAPPY_MS },
    };

    /**
     * Owns the sprite node and the animation on it. All frame playback is a WAAPI
     * `steps(1)` translation of the sheet strip, so a loop runs on the browser's
     * animation engine with no timer of its own and no DOM mutation per frame.
     */
    function createPlayer() {
      let root = null;
      let sprite = null;
      let strip = null;
      let hit = null;
      let scale = 2;
      let animation = null;
      let current = null;
      let asleep = false;
      let extrasTimer = null;
      let sleepTimer = null;
      let onSleep = null;
      /** The mood the Session facts currently ask for, or null for resting. */
      let mood = null;
      /** A mood that overrides the facts for a while (an error, a finished turn). */
      let override = null;
      let overrideTimer = null;
      /** The pinned animation from settings, which beats every fact. */
      let pinned = '';

      /** One frame cell: the raw sheets carry no transparent margin. */
      function cellOf(sheet) {
        return [sheet.box[2], sheet.box[3]];
      }

      function frameOffset(sheet, frame) {
        const [cellWidth, cellHeight] = cellOf(sheet);
        return 'translate(' + (-(frame % 8) * cellWidth * scale) + 'px, ' +
          (-Math.floor(frame / 8) * cellHeight * scale) + 'px)';
      }

      function play(key, mode) {
        if (animation !== null) {
          animation.cancel();
          animation = null;
        }
        const sheet = SHEETS[key];
        if (strip === null) return;
        /* Reduced motion pins every animation to its author-chosen still frame. */
        if (motionReduced()) {
          strip.style.transform = frameOffset(sheet, sheet.still);
          return;
        }
        strip.style.transform = '';
        const keyframes = [];
        for (let frame = 0; frame < sheet.frames; frame++) {
          keyframes.push({
            offset: frame / sheet.frames,
            transform: frameOffset(sheet, frame),
            easing: 'steps(1)',
          });
        }
        keyframes.push({
          offset: 1,
          transform: frameOffset(sheet, mode === 'loop' ? 0 : sheet.frames - 1),
        });
        const playing = strip.animate(keyframes, {
          duration: sheet.frames * FRAME_MS,
          iterations: mode === 'loop' ? Infinity : 1,
          fill: 'forwards',
        });
        animation = playing;
        if (mode === 'once') {
          playing.finished.then(() => {
            if (animation !== playing) return;
            animation = null;
            if (current !== null && current.key === key) {
              current.done = true;
              /* A finished one-shot falls back to the resting loop. */
              show('idle', 'loop');
            }
          }, () => {
            /* finished rejects on cancel(): a newer animation took the strip. */
          });
        }
      }

      /**
       * Paint one animation: crop window and strip geometry. Only the strip
       * carries the sheet — the sprite is a clipping window and the root is a
       * plain box, so exactly one whale is ever drawn.
       */
      function show(key, mode) {
        const sheet = SHEETS[key];
        if (root === null || sprite === null || strip === null) return;
        const [cellWidth, cellHeight] = cellOf(sheet);
        const rows = Math.ceil(sheet.frames / 8);
        root.style.backgroundImage = 'none';
        sprite.style.left = (sheet.box[0] * scale) + 'px';
        sprite.style.top = (sheet.box[1] * scale) + 'px';
        sprite.style.width = (sheet.box[2] * scale) + 'px';
        sprite.style.height = (sheet.box[3] * scale) + 'px';
        strip.style.width = (cellWidth * 8 * scale) + 'px';
        strip.style.height = (rows * cellHeight * scale) + 'px';
        strip.style.backgroundImage = 'url("' + SHEET_DATA[key] + '")';
        strip.style.backgroundSize = (cellWidth * 8 * scale) + 'px auto';
        if (hit !== null) {
          hit.style.left = (sheet.box[0] * scale) + 'px';
          hit.style.top = (sheet.box[1] * scale) + 'px';
          hit.style.width = (sheet.box[2] * scale) + 'px';
          hit.style.height = (sheet.box[3] * scale) + 'px';
        }
        current = { key, mode };
        root.dataset.animation = key;
        play(key, mode);
      }

      /**
       * The one place that decides what plays. A pinned preview wins, then a
       * timed override (an error, a finished turn), then the current Session
       * mood, then the resting loop — which is `sleeping` once the pet has been
       * idle long enough.
       */
      function settle() {
        if (root === null || strip === null) return;
        if (pinned !== '') {
          show(pinned, 'loop');
          return;
        }
        if (override !== null) {
          show(override.key, 'loop');
          return;
        }
        if (mood !== null) {
          show(mood, 'loop');
          return;
        }
        show(asleep ? 'sleeping' : 'idle', 'loop');
      }

      function scheduleExtras() {
        if (extrasTimer !== null) clearTimeout(extrasTimer);
        extrasTimer = null;
        const delay = 12000 + Math.round(Math.random() * 12000);
        extrasTimer = setTimeout(() => {
          extrasTimer = null;
          /* Only amused while genuinely resting: never over a real status. */
          if (
            asleep || mood !== null || override !== null || pinned !== '' ||
            document.hidden || motionReduced()
          ) {
            scheduleExtras();
            return;
          }
          const key = EXTRAS[Math.floor(Math.random() * EXTRAS.length)];
          show(key, 'once');
          scheduleExtras();
        }, delay);
      }

      function touchActivity() {
        if (sleepTimer !== null) clearTimeout(sleepTimer);
        sleepTimer = setTimeout(() => {
          sleepTimer = null;
          if (document.hidden) {
            touchActivity();
            return;
          }
          /* A busy agent is not idle, whatever the mouse did. */
          if (mood === 'thinking' || mood === 'typing' || mood === 'compacting') {
            touchActivity();
            return;
          }
          asleep = true;
          settle();
          if (onSleep !== null) onSleep();
        }, SLEEP_AFTER_MS);
        if (asleep) {
          asleep = false;
          if (mood === null && override === null && pinned === '') show('waking', 'once');
          else settle();
        }
      }

      /** Arm or clear the timer that lets a temporary override expire. */
      function armOverride(entry) {
        if (overrideTimer !== null) clearTimeout(overrideTimer);
        overrideTimer = null;
        if (entry === null) {
          override = null;
          settle();
          return;
        }
        override = entry;
        settle();
        if (entry.hold > 0) {
          overrideTimer = setTimeout(() => {
            overrideTimer = null;
            override = null;
            settle();
          }, entry.hold);
        }
      }

      return {
        attach(nodes, nextScale, sleepCallback) {
          root = nodes.root;
          sprite = nodes.sprite;
          strip = nodes.strip;
          hit = nodes.hit;
          scale = nextScale;
          onSleep = sleepCallback;
        },
        setScale(nextScale) {
          if (nextScale === scale) return;
          scale = nextScale;
          if (current !== null) show(current.key, current.mode);
        },
        start() {
          settle();
          scheduleExtras();
          touchActivity();
        },
        activity: touchActivity,
        /** A direct reaction to the reader: poke, tickle. Beats the idle loop only. */
        react(key) {
          asleep = false;
          if (mood !== null || override !== null || pinned !== '') {
            touchActivity();
            return;
          }
          show(key, 'once');
          touchActivity();
        },
        /**
         * Install the mood the Session facts ask for.
         * @param key - a MOOD key, or null for resting.
         */
        setMood(key) {
          const next = key === null || MOOD[key] === undefined ? null : key;
          if (next === mood) return;
          mood = next;
          /* A live status always outranks a finished-turn or error flash. */
          if (next !== null && (next === 'error' || next === 'question')) {
            armOverride(next === 'error' ? MOOD.error : MOOD.question);
            return;
          }
          if (override !== null) return;
          settle();
        },
        /** Flash one animation once for an event the facts do not carry. */
        celebrate(key) {
          if (pinned !== '' || mood === 'typing' || mood === 'thinking') return;
          const entry = MOOD[key];
          if (entry === undefined) return;
          armOverride(entry);
          touchActivity();
        },
        setPinned(key) {
          pinned = ORDER.indexOf(key) >= 0 ? key : '';
          settle();
        },
        stop() {
          if (extrasTimer !== null) clearTimeout(extrasTimer);
          if (sleepTimer !== null) clearTimeout(sleepTimer);
          if (overrideTimer !== null) clearTimeout(overrideTimer);
          extrasTimer = null;
          sleepTimer = null;
          overrideTimer = null;
          if (animation !== null) {
            animation.cancel();
            animation = null;
          }
        },
      };
    }

    /** Live wiring shared by the floating pet and the settings row. */
    let runtime = null;

    function createRuntime(ctx) {
      const locale = ctx.get('locale');
      const sessions = ctx.get('sessions');
      const listeners = new Set();
      let state = loadState();

      function emit() {
        listeners.forEach((fn) => {
          try {
            fn();
          } catch {
            /* one broken listener must not stop the others */
          }
        });
      }

      return {
        locale: locale === undefined ? null : locale,
        sessions: sessions === undefined ? undefined : sessions,
        get: () => state,
        subscribe(fn) {
          listeners.add(fn);
          return () => {
            listeners.delete(fn);
          };
        },
        set(patch) {
          const nextChime = patch.chime === undefined
            ? state.chime
            : CHIMES.indexOf(patch.chime) >= 0 || patch.chime === CUSTOM ? patch.chime : state.chime;
          /* Replacing or clearing the file drops its decoded copy. */
          if (patch.custom !== undefined && patch.custom !== state.custom) forgetCustom(state.custom);
          const next = {
            enabled: patch.enabled === undefined ? state.enabled : patch.enabled !== false,
            size: clamp(patch.size, 60, 220, state.size),
            offset: clamp(patch.offset, 0, 600, state.offset),
            lift: clamp(patch.lift, -40, 40, state.lift),
            reactive: patch.reactive === undefined ? state.reactive : patch.reactive !== false,
            sound: patch.sound === undefined ? state.sound : patch.sound === true,
            volume: clamp(patch.volume, 0, 100, state.volume),
            chime: nextChime,
            custom: patch.custom === undefined ? state.custom : String(patch.custom),
            customName: patch.customName === undefined ? state.customName : String(patch.customName),
            pinned: patch.pinned === undefined
              ? state.pinned
              : ORDER.indexOf(patch.pinned) >= 0 ? patch.pinned : '',
          };
          if (
            next.enabled === state.enabled &&
            next.size === state.size &&
            next.offset === state.offset &&
            next.lift === state.lift &&
            next.reactive === state.reactive &&
            next.sound === state.sound &&
            next.volume === state.volume &&
            next.chime === state.chime &&
            next.custom === state.custom &&
            next.customName === state.customName &&
            next.pinned === state.pinned
          ) return;
          state = next;
          saveState(state);
          emit();
        },
        /** Play the configured chime; the settings page uses this for its试听 button. */
        chime() {
          if (!state.sound) return;
          playChime(state.chime, state.volume, state.custom);
        },
        /** Play one chime regardless of the switch, for an explicit preview. */
        preview(name) {
          playChime(name === undefined ? state.chime : name, state.volume, state.custom);
        },
        /**
         * Store the reader's own sound.
         * @param file - the chosen file.
         * @returns a promise of null on success, or a locale key explaining why it
         *   was refused; the page renders that key.
         */
        async adoptFile(file) {
          if (file === undefined || file === null) return 'custom.err.none';
          if (file.size > CUSTOM_MAX_BYTES) return 'custom.err.size';
          const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error('read failed'));
            reader.readAsDataURL(file);
          }).catch(() => '');
          if (typeof dataUrl !== 'string' || dataUrl.indexOf('data:') !== 0) return 'custom.err.read';
          /* Decodability is checked up front, so a bad file fails here and not silently on a turn. */
          const context = ensureAudio();
          if (context === null) return 'custom.err.read';
          const decodable = await new Promise((resolve) => {
            const probe = (bytes) => {
              const settled = context.decodeAudioData(bytes, () => resolve(true), () => resolve(false));
              if (settled !== undefined && typeof settled.then === 'function') settled.then(() => resolve(true), () => resolve(false));
            };
            fetch(dataUrl)
              .then((response) => response.arrayBuffer())
              .then(probe)
              .catch(() => resolve(false));
          });
          if (!decodable) return 'custom.err.decode';
          forgetCustom(state.custom);
          const next = Object.assign({}, state, {
            custom: dataUrl,
            customName: typeof file.name === 'string' ? file.name : '',
            chime: CUSTOM,
          });
          state = next;
          saveState(state);
          emit();
          /* A quota failure still keeps the sound for this page's lifetime. */
          return null;
        },
        /** Remove the reader's own sound and fall back to a synthesized chime. */
        clearFile() {
          if (state.custom === '') return;
          forgetCustom(state.custom);
          state = Object.assign({}, state, {
            custom: '',
            customName: '',
            chime: state.chime === CUSTOM ? DEFAULT_STATE.chime : state.chime,
          });
          saveState(state);
          emit();
        },
      };
    }

    /**
     * The whale, standing on the composer card.
     *
     * It is mounted in `conversation.input.dock` — the full-width strip directly
     * above the composer — and paints itself in the flow: the root is a flex row
     * that right-aligns the sprite, and the whale's ground line rests on the
     * dock's bottom edge, which is the card's top edge. That reproduces the
     * original project's placement (whale perched on the input box) without
     * reading any host DOM.
     */
    function DeepyPet(props) {
      const [config, setConfig] = React.useState(() => runtime.get());
      const rootRef = React.useRef(null);
      const spriteRef = React.useRef(null);
      const stripRef = React.useRef(null);
      const hitRef = React.useRef(null);
      const playerRef = React.useRef(null);
      const clicksRef = React.useRef([]);
      const moodRef = React.useRef(null);
      const streamRef = React.useRef(0);
      const turnRef = React.useRef(null);
      const compactionRef = React.useRef(false);
      const toolsRef = React.useRef(0);
      const wasRunningRef = React.useRef(false);

      React.useEffect(() => runtime.subscribe(() => setConfig(runtime.get())), []);

      const scale = config.size / GRID;

      /* One player per mount; it owns the WAAPI animation on the strip. */
      React.useEffect(() => {
        if (!config.enabled) return undefined;
        const player = createPlayer();
        playerRef.current = player;
        player.attach({
          root: rootRef.current,
          sprite: spriteRef.current,
          strip: stripRef.current,
          hit: hitRef.current,
        }, config.size / GRID, null);
        player.start();
        return () => {
          player.stop();
          playerRef.current = null;
        };
      }, [config.enabled]);

      /* The size slider rescales the live sprite without restarting it. */
      React.useEffect(() => {
        if (playerRef.current !== null) playerRef.current.setScale(config.size / GRID);
      }, [config.size]);

      /* A pinned preview holds one animation; clearing it returns to the live state. */
      React.useEffect(() => {
        if (playerRef.current !== null) playerRef.current.setPinned(config.pinned);
      }, [config.pinned]);

      /* The whale wakes when the reader comes back to the page. */
      React.useEffect(() => {
        if (!config.enabled) return undefined;
        const wake = () => {
          if (playerRef.current !== null) playerRef.current.activity();
        };
        window.addEventListener('pointermove', wake, { passive: true });
        window.addEventListener('keydown', wake, { passive: true });
        return () => {
          window.removeEventListener('pointermove', wake);
          window.removeEventListener('keydown', wake);
        };
      }, [config.enabled]);

      /*
       * Live facts, read through the dock's standard props. `useSession` is a
       * selector over the bound Session snapshot; `useSessionStatus` carries the
       * running flag and the pending interaction for one session, and the whole
       * status map for every session; `useSessions` carries the catalog, which is
       * where a session's subagents are listed. All three are optional: a dock
       * rendered without a Session simply gets `undefined`.
       */
      const useSession = props.useSession;
      const useSessionStatus = props.useSessionStatus;
      const useSessions = props.useSessions;
      const sessionId = props.sessionId;

      const running = typeof useSession === 'function'
        ? useSession((snapshot) => (snapshot === undefined ? undefined : snapshot.running)) === true
        : false;
      const agentError = typeof useSession === 'function'
        ? useSession((snapshot) => (snapshot === undefined ? undefined : snapshot.lastAgentError)) || null
        : null;
      const waiting = typeof useSessionStatus === 'function'
        ? Boolean(useSessionStatus((status) => (status === undefined ? undefined : status.pendingInteraction)))
        : false;

      /*
       * The crowd: how many subagents this session has at work, and how many
       * top-level sessions are busy right now. Both are read from the status map
       * and the catalog the same way the original `mascotLevel()` does it.
       */
      const subagentsWorking = typeof useSessions === 'function' && typeof useSessionStatus === 'function'
        ? useSessions((list) => {
          if (list === undefined || list === null || sessionId === undefined) return 0;
          const row = list.byId === undefined ? undefined : list.byId[sessionId];
          const catalog = row === undefined || row.projectionsBySession === undefined
            ? undefined
            : row.projectionsBySession.values;
          const entries = catalog !== undefined && Array.isArray(catalog.subagentCatalog)
            ? catalog.subagentCatalog
            : [];
          return entries.length;
        })
        : 0;

      const busySessions = typeof useSessionStatus === 'function' && typeof useSessions === 'function'
        ? useSessions((list) => {
          if (list === undefined || list === null) return 0;
          let busy = 0;
          const ids = Array.isArray(list.ids) ? list.ids : [];
          for (let index = 0; index < ids.length; index++) {
            const row = list.byId[ids[index]];
            /* A subagent is not its own crowd member; it is counted per parent. */
            if (row !== undefined && row.origin === 'subagent') continue;
            if (row !== undefined && row.running === true) busy++;
          }
          return busy;
        })
        : 0;

      /* Wake immediately when the agent starts, so the pet never shows idle mid-turn. */
      React.useEffect(() => {
        if (!config.enabled || playerRef.current === null) return;
        if (running) playerRef.current.activity();
      }, [config.enabled, running]);

      /*
       * The crowd tiers, from the original `mascotLevel()`:
       *   subagents at work  → 1 = music (a duet), 2+ = conducting (an orchestra)
       *   busy top-level sessions → 2 = music, 3+ = building (heavy labour)
       * These sit above streaming/thinking because they describe more of what is
       * happening in the workspace than one session's own step does.
       */
      let crowd = null;
      if (subagentsWorking >= 2) crowd = 'conducting';
      else if (subagentsWorking === 1) crowd = 'music';
      else if (busySessions >= 3) crowd = 'building';
      else if (busySessions === 2) crowd = 'music';

      /*
       * The coarse mood from snapshot facts: a failure beats a question, a
       * question beats the crowd, the crowd beats one session's own busy loop.
       */
      React.useEffect(() => {
        if (!config.enabled) return;
        if (!config.reactive) {
          moodRef.current = null;
          if (playerRef.current !== null) playerRef.current.setMood(null);
          return;
        }
        const next = agentError !== null
          ? 'error'
          : waiting
            ? 'question'
            : crowd !== null
              ? crowd
              : running
                ? 'thinking'
                : null;
        if (next === moodRef.current) return;
        moodRef.current = next;
        if (playerRef.current !== null) playerRef.current.setMood(next);
      }, [config.enabled, config.reactive, agentError, waiting, crowd, running]);

      /*
       * A finished turn is a real moment, not a random one: when `running`
       * goes true → false the pet hops and, if the reader asked for it, the
       * chime sounds. A turn that ended in a failure or is waiting on an answer
       * is not "done", so it stays silent.
       *
       * The sound fires from this same transition rather than from a timer of
       * its own, so a chime can never play without a turn actually finishing.
       */
      React.useEffect(() => {
        const finished = wasRunningRef.current && !running && agentError === null && !waiting;
        if (config.enabled && config.reactive && finished && playerRef.current !== null) {
          playerRef.current.celebrate('happy');
        }
        /* The chime is independent of the animation switch: a reader may want
           the sound with the pet hidden, or the pet with no sound. */
        if (finished && config.sound) runtime.chime();
        wasRunningRef.current = running;
      }, [config.enabled, config.reactive, config.sound, running, agentError, waiting]);

      /*
       * The fine-grained moments come from the Session event stream, using the
       * event names this Host actually writes (`compaction/start`,
       * `compaction/end`, `tool/call`, `tool/result`, `assistant/live-chunk`,
       * `turn/start`, `turn/end`), so the pet stays honest without polling.
       */
      React.useEffect(() => {
        if (!config.enabled || !config.reactive) return undefined;
        const sessions = runtime.sessions;
        if (sessions === undefined || sessionId === undefined) return undefined;

        const binding = sessions.binding(sessionId);
        if (binding === undefined) return undefined;

        /* Running compactions are a set, keyed by the id the Host assigns. */
        const compactions = new Set();
        /* Incremented on every tool/call; a matching result decrements it. */
        let toolsInFlight = 0;
        let last = binding.eventSource.getSnapshot();

        const apply = (window) => {
          if (window === undefined || window.entries === undefined) return;
          const entries = window.entries;
          /* Only the newest entries are interesting; a page can hold hundreds. */
          for (let index = Math.max(0, entries.length - 40); index < entries.length; index++) {
            const entry = entries[index];
            if (entry === null || entry === undefined || entry.event === undefined) continue;
            const type = entry.event.type;
            const data = entry.event.data;
            if (type === 'assistant/live-chunk') {
              streamRef.current = Date.now();
            } else if (type === 'assistant/message' || type === 'assistant/attempt') {
              streamRef.current = 0;
            } else if (type === 'tool/call') {
              toolsInFlight++;
              streamRef.current = Date.now();
            } else if (type === 'tool/result') {
              if (toolsInFlight > 0) toolsInFlight--;
              streamRef.current = Date.now();
            } else if (type === 'compaction/start') {
              if (data !== undefined && data !== null && data.compactionId !== undefined) compactions.add(data.compactionId);
              else compactions.add('anonymous');
            } else if (type === 'compaction/end') {
              if (data !== undefined && data !== null && data.compactionId !== undefined) compactions.delete(data.compactionId);
            } else if (type === 'turn/start') {
              turnRef.current = Date.now();
              compactions.clear();
              toolsInFlight = 0;
            } else if (type === 'turn/end') {
              compactions.clear();
              toolsInFlight = 0;
            }
          }
          compactionRef.current = compactions.size > 0;
          toolsRef.current = toolsInFlight;
        };
        apply(last);

        const unsubscribe = binding.eventSource.subscribe(() => {
          const next = binding.eventSource.getSnapshot();
          if (next !== undefined && last !== undefined && next.revision === last.revision) return;
          last = next;
          apply(next);
        });

        /*
         * No event announces "output stopped", so a light tick decides what the
         * current step is doing: a recent chunk is typing, a tool in flight is
         * also typing (the agent is working, not deliberating), otherwise the
         * model is thinking. The tick exists only while the agent is busy.
         */
        let ticking = null;
        if (running) {
          ticking = setInterval(() => {
            /* A compaction or an error outranks the step reading; the mood
               effect above already owns those, so do not fight it here. */
            if (agentError !== null || waiting || crowd !== null) return;
            const fresh = streamRef.current !== 0 && Date.now() - streamRef.current < STREAM_FRESH_MS;
            const next = compactionRef.current
              ? 'compacting'
              : fresh || toolsRef.current > 0
                ? 'typing'
                : 'thinking';
            if (next === moodRef.current) return;
            moodRef.current = next;
            if (playerRef.current !== null) playerRef.current.setMood(next);
          }, 400);
        }

        return () => {
          unsubscribe();
          if (ticking !== null) clearInterval(ticking);
        };
      }, [config.enabled, config.reactive, sessionId, running, agentError, waiting, crowd]);

      if (!config.enabled) return null;

      /* A press pokes the side it landed on; four quick ones tickle. */
      const onPointerDown = (event) => {
        if (event.button !== 0) return;
        /* Never let a poke start a text selection or reach the composer. */
        event.stopPropagation();
        event.preventDefault();
      };

      const onPointerUp = (event) => {
        if (event.button !== 0) return;
        event.stopPropagation();
        const now = Date.now();
        const clicks = clicksRef.current;
        if (clicks.length > 0 && now - clicks[clicks.length - 1] > TICKLE_GAP_MS) clicks.length = 0;
        clicks.push(now);
        if (playerRef.current === null) return;
        if (clicks.length >= TICKLE_CLICKS) {
          clicks.length = 0;
          playerRef.current.react('tickle');
          return;
        }
        const box = event.currentTarget.getBoundingClientRect();
        playerRef.current.react(event.clientX - box.left < box.width / 2 ? 'poke-left' : 'poke-right');
      };

      return h('div', {
        key: 'deepy',
        ref: rootRef,
        'aria-hidden': 'true',
        'data-deepy-pet': '',
        style: {
          /*
           * A zero-height anchor, not a box. The entry takes no vertical space in
           * the dock, so a dock that grows (the "thinking" row, a queued message,
           * a todo card) cannot push the whale upward; its bottom edge stays on
           * the composer card's top edge and the whale is positioned out of flow
           * from there, following the card wherever it moves.
           */
          position: 'relative',
          width: '100%',
          height: '0px',
          margin: '0px',
          pointerEvents: 'none',
          userSelect: 'none',
        },
      }, h('div', {
        key: 'box',
        style: {
          position: 'absolute',
          /* Sit inside the composer card's width, mirroring the card's own side
             clearance when the host publishes it, and never at the window edge. */
          right: 'calc(max(16px, (100% - var(--dsh-composer-card-max-width, 100%)) / 2) + ' + config.offset + 'px)',
          /*
           * The anchor's bottom edge is the composer card's top edge. Each crop
           * box ends a few pixels below the artist's ground line (that overhang
           * is the soft tail of the shadow), so putting the box bottom exactly on
           * the anchor rests the shadow on the card and paints nothing across it.
           * `lift` lets the reader nudge it when a host adds padding of its own.
           */
          bottom: config.lift + 'px',
          width: (GRID * scale) + 'px',
          height: (GRID * scale) + 'px',
        },
      }, [
        h('span', {
          key: 'sprite',
          ref: spriteRef,
          style: {
            position: 'absolute',
            overflow: 'hidden',
            pointerEvents: 'none',
            imageRendering: 'auto',
          },
        }, h('span', {
          key: 'strip',
          ref: stripRef,
          style: {
            display: 'block',
            backgroundRepeat: 'no-repeat',
          },
        })),
        h('span', {
          key: 'hit',
          ref: hitRef,
          role: 'presentation',
          onPointerDown,
          onPointerUp,
          onClick: (event) => event.stopPropagation(),
          style: {
            position: 'absolute',
            pointerEvents: 'auto',
            touchAction: 'none',
            cursor: 'pointer',
          },
        }),
      ]));
    }

    /**
     * A still frame of one animation, cropped from the sheet with
     * `background-position`. Used by the settings page as a live thumbnail so the
     * reader sees what a choice looks like before picking it.
     */
    function FramePreview({ config, scaleHint }) {
      const key = config.pinned === '' ? 'idle' : config.pinned;
      const sheet = SHEETS[key];
      const cellWidth = sheet.box[2];
      const cellHeight = sheet.box[3];
      const scale = scaleHint || 1.6;
      return h('div', {
        'aria-hidden': 'true',
        style: {
          position: 'relative',
          width: (GRID * scale) + 'px',
          height: (GRID * scale) + 'px',
          flex: '0 0 auto',
          borderRadius: '10px',
          background: 'var(--dsw-alias-bg-layer-2)',
          overflow: 'hidden',
        },
      }, h('span', {
        style: {
          position: 'absolute',
          left: (sheet.box[0] * scale) + 'px',
          top: (sheet.box[1] * scale) + 'px',
          width: (cellWidth * scale) + 'px',
          height: (cellHeight * scale) + 'px',
          backgroundImage: 'url("' + SHEET_DATA[key] + '")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: (cellWidth * 8 * scale) + 'px auto',
          backgroundPosition: (-(sheet.still % 8) * cellWidth * scale) + 'px ' +
            (-Math.floor(sheet.still / 8) * cellHeight * scale) + 'px',
        },
      }));
    }

    /** One settings page section: a heading, a description and a control block. */
    function Section(props) {
      return h('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '20px 0',
          borderBottom: '0.5px solid var(--dsw-alias-border-l2)',
        },
      }, [
        h('div', {
          key: 'head',
          style: { display: 'flex', flexDirection: 'column', gap: '2px' },
        }, [
          h('div', {
            key: 'title',
            style: { color: 'var(--dsw-alias-label-primary)', fontSize: '14px', lineHeight: '22px' },
          }, props.title),
          props.description === undefined ? null : h('div', {
            key: 'desc',
            style: { color: 'var(--dsw-alias-label-secondary)', fontSize: '12px', lineHeight: '18px' },
          }, props.description),
        ]),
        props.children,
      ]);
    }

    /** A labelled range input with its live value on the right. */
    function Slider(props) {
      return h('div', {
        style: { display: 'flex', flexDirection: 'column', gap: '2px' },
      }, [
        h('div', {
          key: 'head',
          style: {
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '8px',
            color: 'var(--dsw-alias-label-primary)',
            fontSize: '13px',
            lineHeight: '20px',
          },
        }, [
          h('span', { key: 'label' }, props.label),
          h('span', {
            key: 'value',
            style: { color: 'var(--dsw-alias-label-secondary)', fontSize: '12px', fontVariantNumeric: 'tabular-nums' },
          }, props.note),
        ]),
        h('input', {
          key: 'range',
          type: 'range',
          min: props.min,
          max: props.max,
          step: props.step,
          value: props.value,
          'aria-label': props.label,
          onChange: (event) => props.onChange(Number(event.target.value)),
          style: { width: '100%', accentColor: 'var(--dsw-alias-brand-primary)', cursor: 'pointer' },
        }),
      ]);
    }

    /**
     * Settings page for the pet, in its own nav section.
     *
     * A page rather than a General row: the pet owns a growing set of
     * preferences (size, placement, animation choice, and whatever comes next),
     * and a page keeps room for them without crowding the shared General list.
     */
    function DeepyPage() {
      const [config, setConfig] = React.useState(() => runtime.get());
      /* The file input's message: a locale key, or null when there is nothing to say. */
      const [fileNote, setFileNote] = React.useState(null);
      const [dragging, setDragging] = React.useState(false);
      const inputRef = React.useRef(null);

      React.useEffect(() => runtime.subscribe(() => setConfig(runtime.get())), []);

      const localeService = runtime.locale;
      let translate = null;
      if (localeService !== null && typeof localeService.bind === 'function') {
        try {
          const bound = localeService.bind(NS);
          if (typeof bound === 'function') translate = bound;
        } catch {
          /* fall back to the built-in dictionaries below */
        }
      }
      const t = (key) => {
        if (translate !== null) {
          try {
            const text = translate(key);
            if (typeof text === 'string' && text !== key) return text;
          } catch {
            /* dictionary lookup must never break the page */
          }
        }
        const active = localeService === null ? 'en' : String(localeService.getLocale().active || 'en');
        const dict = active.toLowerCase().indexOf('zh') === 0 ? DICT.zh : DICT.en;
        return dict[key] !== undefined ? dict[key] : DICT.en[key] !== undefined ? DICT.en[key] : key;
      };

      const chipStyle = (selected) => ({
        cursor: 'pointer',
        font: 'inherit',
        fontSize: '12px',
        lineHeight: '18px',
        padding: '5px 12px',
        borderRadius: '999px',
        border: '0.5px solid ' + (selected ? 'var(--dsw-alias-brand-primary)' : 'var(--dsw-alias-border-l2)'),
        background: 'transparent',
        color: selected ? 'var(--dsw-alias-brand-primary)' : 'var(--dsw-alias-label-secondary)',
      });

      const toggle = h('button', {
        type: 'button',
        role: 'switch',
        'aria-checked': config.enabled,
        onClick: () => runtime.set({ enabled: !config.enabled }),
        style: {
          alignSelf: 'flex-start',
          cursor: 'pointer',
          font: 'inherit',
          fontSize: '13px',
          lineHeight: '20px',
          padding: '6px 16px',
          borderRadius: '999px',
          border: '0.5px solid ' + (config.enabled ? 'var(--dsw-alias-brand-primary)' : 'var(--dsw-alias-border-l2)'),
          background: config.enabled ? 'var(--dsw-alias-brand-primary)' : 'transparent',
          color: config.enabled ? 'var(--dsw-alias-bg-layer-1)' : 'var(--dsw-alias-label-secondary)',
        },
      }, config.enabled ? t('enabled.on') : t('enabled.off'));

      const reactToggle = h('button', {
        type: 'button',
        role: 'switch',
        'aria-checked': config.reactive,
        onClick: () => runtime.set({ reactive: !config.reactive }),
        style: {
          alignSelf: 'flex-start',
          cursor: 'pointer',
          font: 'inherit',
          fontSize: '13px',
          lineHeight: '20px',
          padding: '6px 16px',
          borderRadius: '999px',
          border: '0.5px solid ' + (config.reactive ? 'var(--dsw-alias-brand-primary)' : 'var(--dsw-alias-border-l2)'),
          background: config.reactive ? 'var(--dsw-alias-brand-primary)' : 'transparent',
          color: config.reactive ? 'var(--dsw-alias-bg-layer-1)' : 'var(--dsw-alias-label-secondary)',
        },
      }, config.reactive ? t('reactive.on') : t('reactive.off'));

      /* The sound switch is usable even with the pet hidden, so it lives on its own. */
      const soundToggle = h('button', {
        type: 'button',
        role: 'switch',
        'aria-checked': config.sound,
        onClick: () => {
          const next = !config.sound;
          runtime.set({ sound: next });
          /* Preview on enable, so the reader hears what they just turned on. */
          if (next) runtime.preview(config.chime);
        },
        style: {
          alignSelf: 'flex-start',
          cursor: 'pointer',
          font: 'inherit',
          fontSize: '13px',
          lineHeight: '20px',
          padding: '6px 16px',
          borderRadius: '999px',
          border: '0.5px solid ' + (config.sound ? 'var(--dsw-alias-brand-primary)' : 'var(--dsw-alias-border-l2)'),
          background: config.sound ? 'var(--dsw-alias-brand-primary)' : 'transparent',
          color: config.sound ? 'var(--dsw-alias-bg-layer-1)' : 'var(--dsw-alias-label-secondary)',
        },
      }, config.sound ? t('sound.on') : t('sound.off'));

      const chimeButtons = CHIMES.map((name) => h('button', {
        key: name,
        type: 'button',
        onClick: () => {
          runtime.set({ chime: name });
          runtime.preview(name);
        },
        'aria-pressed': config.chime === name,
        style: chipStyle(config.chime === name),
      }, t('chime.' + name)));

      /* The custom chip is last and only plays once a file is loaded. */
      if (config.custom !== '') {
        chimeButtons.push(h('button', {
          key: CUSTOM,
          type: 'button',
          onClick: () => {
            runtime.set({ chime: CUSTOM });
            runtime.preview(CUSTOM);
          },
          'aria-pressed': config.chime === CUSTOM,
          style: chipStyle(config.chime === CUSTOM),
        }, t('chime.custom')));
      }

      const takeFile = async (file) => {
        const problem = await runtime.adoptFile(file);
        setFileNote(problem);
      };

      const onPick = (event) => {
        const chosen = event.target.files !== null && event.target.files.length > 0
          ? event.target.files[0]
          : undefined;
        /* Clear the value so re-picking the same file fires a change again. */
        event.target.value = '';
        if (chosen !== undefined) takeFile(chosen);
      };

      const onDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        const dropped = event.dataTransfer !== null && event.dataTransfer.files !== null &&
          event.dataTransfer.files.length > 0
          ? event.dataTransfer.files[0]
          : undefined;
        if (dropped !== undefined) takeFile(dropped);
      };

      const dropZone = h('div', {
        key: 'drop',
        onDragOver: (event) => {
          event.preventDefault();
          setDragging(true);
        },
        onDragLeave: () => setDragging(false),
        onDrop,
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          padding: '12px 14px',
          borderRadius: '10px',
          border: '1px dashed ' + (dragging ? 'var(--dsw-alias-brand-primary)' : 'var(--dsw-alias-border-l2)'),
          background: dragging ? 'var(--dsw-alias-bg-layer-2)' : 'transparent',
        },
      }, [
        h('div', {
          key: 'row',
          style: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
        }, [
          h('button', {
            key: 'pick',
            type: 'button',
            onClick: () => {
              if (inputRef.current !== null) inputRef.current.click();
            },
            style: {
              cursor: 'pointer',
              font: 'inherit',
              fontSize: '12px',
              lineHeight: '18px',
              padding: '5px 12px',
              borderRadius: '8px',
              border: '0.5px solid var(--dsw-alias-border-l2)',
              background: 'var(--dsw-alias-bg-layer-2)',
              color: 'var(--dsw-alias-label-primary)',
            },
          }, t('custom.pick')),
          h('span', {
            key: 'name',
            style: {
              color: config.custom === '' ? 'var(--dsw-alias-label-secondary)' : 'var(--dsw-alias-label-primary)',
              fontSize: '12px',
              lineHeight: '18px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: '1 1 auto',
              minWidth: 0,
            },
          }, config.custom === '' ? t('custom.none') : config.customName || t('custom.loaded')),
          config.custom === ''
            ? null
            : h('button', {
              key: 'clear',
              type: 'button',
              onClick: () => {
                runtime.clearFile();
                setFileNote(null);
              },
              style: {
                cursor: 'pointer',
                font: 'inherit',
                fontSize: '12px',
                lineHeight: '18px',
                padding: '5px 12px',
                borderRadius: '8px',
                border: '0.5px solid var(--dsw-alias-border-l2)',
                background: 'transparent',
                color: 'var(--dsw-alias-label-secondary)',
              },
            }, t('custom.clear')),
        ]),
        h('div', {
          key: 'hint',
          style: { color: 'var(--dsw-alias-label-secondary)', fontSize: '11px', lineHeight: '16px' },
        }, t('custom.hint')),
        fileNote === null
          ? null
          : h('div', {
            key: 'note',
            style: { color: 'var(--dsw-alias-state-error-primary)', fontSize: '11px', lineHeight: '16px' },
          }, t(fileNote)),
        h('input', {
          key: 'input',
          ref: inputRef,
          type: 'file',
          accept: 'audio/*',
          onChange: onPick,
          style: { display: 'none' },
        }),
      ]);

      const sections = [
        h(Section, {
          key: 'display',
          title: t('section.display'),
          description: t('section.display.desc'),
        }, toggle),
        h(Section, {
          key: 'sound',
          title: t('section.sound'),
          description: t('section.sound.desc'),
        }, [
          soundToggle,
          h('div', {
            key: 'chimes',
            style: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' },
          }, chimeButtons),
          dropZone,
          h(Slider, {
            key: 'volume',
            label: t('volume'),
            note: config.volume + '%',
            min: 0,
            max: 100,
            step: 5,
            value: config.volume,
            onChange: (value) => runtime.set({ volume: value }),
          }),
        ]),
      ];

      if (config.enabled) {
        sections.push(h(Section, {
          key: 'reactive',
          title: t('section.reactive'),
          description: t('section.reactive.desc'),
        }, [
          reactToggle,
          h('div', {
            key: 'map',
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              color: 'var(--dsw-alias-label-secondary)',
              fontSize: '12px',
              lineHeight: '18px',
            },
          }, [
            h('div', { key: 'a' }, t('map.thinking')),
            h('div', { key: 'b' }, t('map.typing')),
            h('div', { key: 'b2' }, t('map.tools')),
            h('div', { key: 'c' }, t('map.compacting')),
            h('div', { key: 'c2' }, t('map.music')),
            h('div', { key: 'c3' }, t('map.conducting')),
            h('div', { key: 'c4' }, t('map.building')),
            h('div', { key: 'd' }, t('map.error')),
            h('div', { key: 'e' }, t('map.question')),
            h('div', { key: 'f' }, t('map.happy')),
            h('div', { key: 'g' }, t('map.idle')),
          ]),
        ]));

        sections.push(h(Section, {
          key: 'layout',
          title: t('section.layout'),
          description: t('section.layout.desc'),
        }, h('div', {
          style: { display: 'flex', gap: '16px', alignItems: 'flex-start' },
        }, [
          h(FramePreview, { key: 'preview', config }),
          h('div', {
            key: 'sliders',
            style: { display: 'flex', flexDirection: 'column', gap: '10px', flex: '1 1 auto', minWidth: 0 },
          }, [
            h(Slider, {
              key: 'size',
              label: t('size'),
              note: config.size + 'px',
              min: 60,
              max: 220,
              step: 2,
              value: config.size,
              onChange: (value) => runtime.set({ size: value }),
            }),
            h(Slider, {
              key: 'offset',
              label: t('offset'),
              note: config.offset + 'px',
              min: 0,
              max: 600,
              step: 4,
              value: config.offset,
              onChange: (value) => runtime.set({ offset: value }),
            }),
            h(Slider, {
              key: 'lift',
              label: t('lift'),
              note: config.lift + 'px',
              min: -40,
              max: 40,
              step: 1,
              value: config.lift,
              onChange: (value) => runtime.set({ lift: value }),
            }),
          ]),
        ])));

        const chips = [
          h('button', {
            key: 'auto',
            type: 'button',
            onClick: () => runtime.set({ pinned: '' }),
            'aria-pressed': config.pinned === '',
            style: chipStyle(config.pinned === ''),
          }, t('pin.auto')),
        ];
        ORDER.forEach((key) => {
          chips.push(h('button', {
            key,
            type: 'button',
            onClick: () => runtime.set({ pinned: config.pinned === key ? '' : key }),
            'aria-pressed': config.pinned === key,
            style: chipStyle(config.pinned === key),
          }, t('anim.' + key)));
        });
        sections.push(h(Section, {
          key: 'animations',
          title: t('section.animations'),
          description: t('section.animations.desc'),
        }, h('div', {
          style: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
        }, chips)));
      }

      return h('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '720px',
          paddingBottom: '24px',
        },
      }, [
        h('div', {
          key: 'intro',
          style: { display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '4px' },
        }, [
          h('div', {
            key: 'title',
            style: { color: 'var(--dsw-alias-label-primary)', fontSize: '16px', lineHeight: '24px', fontWeight: 500 },
          }, t('title')),
          h('div', {
            key: 'desc',
            style: { color: 'var(--dsw-alias-label-secondary)', fontSize: '12px', lineHeight: '18px' },
          }, t('hint')),
        ]),
        ...sections,
      ]);
    }

    return {
      inject: ['slots', 'locale', 'sessions'],
      apply(ctx) {
        const localeService = ctx.get('locale');
        if (localeService !== undefined && localeService !== null) {
          ctx.effect(() => localeService.register(NS, 'en', DICT.en), 'deepy-pet: locale en');
          ctx.effect(() => localeService.register(NS, 'zh', DICT.zh), 'deepy-pet: locale zh');
        }

        /* Release the shared AudioContext when the plugin unloads. */
        ctx.effect(() => () => {
          closeAudio();
        }, 'deepy-pet: audio context');

        /**
         * Translate one key for the nav label. The shell re-reads a thunk label on
         * every projection, so the nav entry follows a locale switch without the
         * plugin re-registering the section.
         */
        const navLabel = () => {
          let translate = null;
          if (localeService !== undefined && localeService !== null && typeof localeService.bind === 'function') {
            try {
              const bound = localeService.bind(NS);
              if (typeof bound === 'function') translate = bound;
            } catch {
              /* fall through to the built-in dictionaries */
            }
          }
          if (translate !== null) {
            try {
              const text = translate('section.label');
              if (typeof text === 'string' && text !== 'section.label') return text;
            } catch {
              /* fall through */
            }
          }
          const active = localeService === undefined || localeService === null
            ? 'en'
            : String(localeService.getLocale().active || 'en');
          const dict = active.toLowerCase().indexOf('zh') === 0 ? DICT.zh : DICT.en;
          return dict['section.label'] !== undefined ? dict['section.label'] : 'Deepy';
        };

        runtime = createRuntime(ctx);

        /* The composer dock: the full-width strip above the input card, which is
           the same seat the original project's whale stands on. */
        ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
          name: 'conversation.input.dock',
          id: 'deepy-pet',
          order: 900,
        }, DeepyPet));

        /* Its own settings page, so the preference set can keep growing without
           crowding the shared General rows. */
        ctx.slots.inject('settings.section', () => ctx.slots.register({
          name: 'settings.section',
          id: 'deepy-pet',
          order: 14,
          label: navLabel,
        }, DeepyPage));
      },
    };
  },
});
