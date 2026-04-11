# TimeKeep

A lightweight, browser-based work time tracker built with Vue 3 and TypeScript. Track your shifts, manage breaks, log holidays, and keep an eye on your weekly hours target — all without an account or server.

## Features

- **Shift tracking** — Clock in and out with a single button. Break time is tracked separately from work time.
- **Live timers** — Work time and break time update every second while a shift is active.
- **Weekly overview** — A week card shows each working day and how many hours you've logged against your target.
- **Holiday management** — Add named holidays that count towards your contracted hours and appear in the shift history.
- **Configurable schedule** — Set your weekly hours target, working days per week, and whether your week starts on Monday or Sunday.
- **Shift history** — A scrollable log of past shifts and holidays, with worked and break durations for each entry.
- **Export / Import** — Back up all data to a JSON file and restore it later. Importing merges by ID so there are no duplicates.
- **No account required** — Everything is stored in your browser's `localStorage`. Nothing leaves your device.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API) |
| Language | TypeScript |
| Build tool | Vite |
| Routing | Vue Router 4 |
| Styling | Plain CSS with CSS variables |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

The compiled output is written to `dist/`. Serve it from any static host.

### Preview the production build

```bash
npm run preview
```

## Usage

### Tracker page

| Action | How |
|---|---|
| Start a shift | Click **Start** |
| Take a break | Click **Break** while a shift is active |
| End a break | Click **Resume** |
| End a shift | Click **End** |

The timer cards show today's worked time and break time in real time. The week card at the top shows your progress towards this week's hours target.

### Settings page

- **Weekly Hours Target** — Your contracted hours per week (default: 37.5 h).
- **Working Days per Week** — Used to calculate how much a single holiday day counts (default: 5).
- **Week Starts On** — Monday or Sunday.
- **Holiday Manager** — Add or remove holiday dates. Each holiday contributes `weeklyHours ÷ workDaysPerWeek` hours to your total.
- **Export / Import** — Download a `.json` backup or upload a previously exported file to merge the data.
- **Clear All Data** — Permanently deletes all shifts, holidays, and resets settings to defaults.

## Data Storage

All data is persisted to `localStorage` under three keys:

| Key | Contents |
|---|---|
| `tk_shifts` | Completed shifts |
| `tk_current` | The active shift (if any) |
| `tk_settings` | User settings |
| `tk_holidays` | Holiday list |

Exported JSON files follow the `ExportPayload` schema (version 2) and can be safely re-imported to merge data across devices or browsers.

## License

This project is private. All rights reserved.
