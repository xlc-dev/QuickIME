<div align="center">
  <img src="public/icon.png" alt="" width="150" />
  <h1>QuickIME</h1>
  <p><strong>A fast, private, and simple web-based Input Method Editor that doesn’t suck.</strong></p>
</div>

## 🚀 Features

- Zero-server IME: Runs 100% in your browser. No tracking, no back-end. Only network call to proxy for Jisho to get kanji suggestions.
- Instant Romanization -> Characters: Type phonetic input (e.g. romaji) and get immediate candidate suggestions.
- Persistent UI Settings saved in localStorage
- Keyboar Shortcuts
- Light / Dark / System Theme

## 💻 Getting Started

### Prerequisites

- Node.js >= 22
- pnpm

### Clone & Install

```bash
git clone https://github.com/xlc-dev/QuickIME.git
cd QuickIME
pnpm install
```

### Local Development

```bash
pnpm dev
```

Open http://localhost:3000 and start typing!

### Production Build

```bash
# Build the static site
pnpm build

# Preview the production build locally
pnpm preview
```

## 📜 License

GPL-3.0 © 2025 [xlc-dev](https://github.com/xlc-dev). See [LICENSE](https://github.com/xlc-dev/QuickIME/blob/main/LICENSE) for more information.
