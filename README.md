# Deepy Pet for DSH

A pixel whale that perches on the composer of the DeepSeek Harness Web UI and
shows you what the agent is actually doing — not a random decoration.

<!-- Add a screenshot or GIF here: docs/preview.gif -->

## What it does

Deepy is a **status indicator**. Every animation it plays on its own has a real
cause, read from Session state and the Session event stream:

| Animation | Shown when |
|---|---|
| Thinking | A request is in flight, no output yet |
| Typing | The answer is streaming, or a tool call is running |
| Compacting | The context is being rewritten |
| Music | One subagent at work, or a second session busy |
| Conducting | Two or more subagents working at once |
| Building | Three or more sessions busy at once |
| Error | The turn failed |
| Notification | The agent needs your answer |
| Happy | A turn just finished |
| Idle | Resting; looks around now and then |
| Sleeping | Idle for 45 seconds |
| Waking | You came back |
| Poke left/right, Tickle | Your clicks (four quick clicks tickle) |

Priority, highest first: a pinned preview → error → waiting on you →
crowd tier → compaction → typing → thinking → happy → idle/sleep.

## Features

- **Perches on the composer** and follows it as it grows — it is never pushed up
  by dock content such as the elapsed-time row.
- **Five synthesized chimes**, plus **your own sound file** (any format your
  browser decodes, up to 1.5 MB, stored locally and never uploaded).
- **Optimal silence by design**: the chime fires only on a real completion —
  never on a failure, never while the agent waits on you.
- Sound and the pet are **independent switches**: sound without the pet, or the
  pet without sound.
- **Reduced-motion aware**: pins each animation to its still frame when the OS
  asks for less motion.
- Its own **settings page**, localized in English and Chinese.

## Install

Point DSH at this directory as a bundle:

```js
// plugin_manager
{ action: 'install_bundle', target: 'D:\\path\\to\\dsh-pet' }
```

The package links into the profile, and client-side hot reload picks up code
changes without reinstalling.

## Settings

Settings → **Deepy Pet**:

- Show or hide the pet
- React to the conversation (off = always idle)
- Sound on finish, chime choice, custom file, volume
- Size, inset from the right, vertical nudge
- Animation preview and pinning

## Development

`client.template.js` is the source of truth. It carries a `__SHEET_DATA__`
placeholder where the sprite sheets are inlined.

```bash
node build.mjs     # inlines assets/*.png into client.js
node --check client.js
```

`client.js` is the built artifact and **is committed**, because DSH loads it
directly from the package directory.

### Layout

```
assets/              18 sprite sheets (PNG, 8 columns per row)
locale/              en.json, zh.json
client.template.js   source
client.js            built bundle (committed)
build.mjs            inliner
index.js             host half (no-op; all work is client-side)
cordis.patch.yml     bundle patch inserting the plugin row
icon.png             settings icon
NOTICE.md            third-party artwork attribution
```

## Licensing

The plugin code is MIT. **The sprite artwork is not mine** — see
[NOTICE.md](NOTICE.md). The 18 `deepy/` sheets come from
[Nwflower/dsh-claude-style](https://github.com/Nwflower/dsh-claude-style) (MIT),
which credits the whale art to
[calm-eating-bugs](https://github.com/wp3171216237). No Claude/Anthropic
character art, font, or engine code is included.

This is an unofficial fan work, not affiliated with or endorsed by Anthropic,
DeepSeek, or the artists above.
