# Deepy pet — third-party artwork notice

The 18 sprite sheets under `assets/` are copied unmodified from
[Nwflower/dsh-claude-style](https://github.com/Nwflower/dsh-claude-style),
`packages/assets/src/mascot/deepy/`.

- The repository is MIT licensed (Copyright (c) 2026 Nwflower).
- Its README credits the Deepy whale frame art to
  [calm-eating-bugs](https://github.com/wp3171216237), the author of the Deepy
  whale theme pack, and states that the Clawd crab frames are a character of
  Anthropic which those frame files do not license. **Only the `deepy/` sheets
  are used here** — no crab, font, or Sodium engine file is included.
- This plugin is an unofficial fan work. It is not affiliated with, endorsed by,
  or sponsored by Anthropic, DeepSeek, or the authors above.

Animation table (`frames`, crop `box`, `still`) and the playback model follow
`packages/client/src/features/mascot/{sheets,whale}.ts` and `whale.css` of the
same project, rewritten from scratch for this plugin: the original drives the
sprite through host-DOM injection on the composer card, while this one renders
an independent floating overlay pet.

If you redistribute this package, keep this notice and the MIT copyright above.
