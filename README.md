# Tend

> Complete your tasks. Watch your plant grow.

A daily task manager with XP, streaks, and a tiny garden. Built with Next.js, packaged for macOS, Windows, Linux, and Android.

---

## Features

- 🌱 **Living garden** — each day grows one of 10 plants (roses, irises, cacti, and more) through 6 stages based on your completion rate
- ⚡ **XP & levels** — earn XP for every task, with combo multipliers for consecutive completions
- 🔥 **Streaks** — workday streak tracking that survives weekends and out-of-office days
- ✅ **Rich tasks** — subtasks, task types, importance flagging, and link attachments
- 🎵 **Sound effects** — satisfying audio feedback throughout
- 🗓 **Day navigation** — browse any past or future day with a click-to-open date picker
- 🏖 **Out of office** — mark days off without breaking your streak
- 🎨 **Customisable** — accent colour, custom task types, drag-and-drop reordering
- 💾 **Local-first** — all data in `localStorage`, no account, no server

---

## Download

Grab the latest installer from [Releases](../../releases):

| Platform | File |
|---|---|
| macOS (Apple Silicon) | `.dmg` |
| Windows | `.exe` |
| Linux | `.AppImage` |
| Android | `.apk` |

### macOS — "damaged" warning

The app is unsigned. If macOS blocks it, run this after moving Tend to Applications:

```bash
xattr -cr /Applications/Tend.app
```

### Android — sideloading

Enable **Install unknown apps** in Settings, then open the `.apk`.

---

## Development

```bash
npm install
npm run dev          # web (localhost:3000)
npm run electron:dev # desktop (Next.js + Electron)
```

### Build

```bash
npm run electron:build   # produces installer in dist/
```

### Release

1. Bump `"version"` in `package.json` and push
2. Create a GitHub release tagged `v1.2.3`
3. Actions builds macOS, Windows, Linux, and Android in parallel and attaches all artifacts

---

## Project structure

| Path | Description |
|---|---|
| `app/page.tsx` | Main app — all state and logic |
| `app/components/` | TaskCard, flowers, particles, modals |
| `app/components/flowers/` | 10 SVG plant components (6 growth stages each) |
| `app/lib/` | Constants, date utils, storage, sound effects |
| `electron/main.js` | Electron main process |
| `capacitor.config.ts` | Android (Capacitor) config |
| `.github/workflows/release.yml` | CI release pipeline |

---

## License

MIT
