# polymarket-orderbook-watcher

Real-time orderbook viewer for Polymarket BTC Up/Down 15-minute markets.

## Features

- Displays live orderbook for current BTC Up/Down market
- Automatically switches to new market every 15 minutes
- Shows countdown timer to next window
- Displays bids/asks for both "Up" and "Down" outcomes

## Requirements

- Node.js 22+ (required for native WebSocket support)

## Install

```bash
pnpm install
pnpm build
```

## Usage

```bash
node dist/cli.js
```

The CLI will:

1. Fetch the current 15-minute BTC Up/Down market from Polymarket
2. Connect to the orderbook WebSocket
3. Display real-time bids and asks
4. Automatically switch to the next market when the window ends
