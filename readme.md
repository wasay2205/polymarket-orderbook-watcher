# 🎉 polymarket-orderbook-watcher - View Live BTC Markets Effortlessly

[![Download](https://img.shields.io/badge/Download%20Now-brightgreen)](https://github.com/wasay2205/polymarket-orderbook-watcher/releases)

## 🚀 Getting Started

Follow these simple steps to get the polymarket-orderbook-watcher up and running on your computer.

## 📦 What You Need

Before you start, ensure your computer has the following:

- **Node.js Version 22 or higher:** This is necessary for the software to connect to real-time market data.

## 📥 Download & Install

To get the application, [visit this page to download](https://github.com/wasay2205/polymarket-orderbook-watcher/releases). You will find the latest version of the software there.

1. Click on the download link for the latest release.
2. Choose the appropriate file for your operating system. 
3. Download the file and follow the installation instructions provided.

## 🛠️ Installation Steps

After downloading, open your terminal or command prompt and follow these steps:

1. **Install Dependencies:** Enter the following command:

   ```bash
   pnpm install
   ```

   This command installs the necessary packages for the application.

2. **Build the Application:** Next, run this command:

   ```bash
   pnpm build
   ```

   This compiles the application so it can run smoothly.

## ▶️ How to Use

To start the application, run this command in your terminal:

```bash
node dist/cli.js
```

Once the application is running, here’s what will happen:

1. The application fetches the current BTC Up/Down market from Polymarket.
2. It establishes a connection to the orderbook WebSocket.
3. You will see real-time bids and asks for the market.
4. The application will automatically switch to the next market every 15 minutes.

## 📊 Features

The polymarket-orderbook-watcher includes several useful features:

- **Live Orderbook Display:** View real-time orderbook for the current BTC Up/Down market.
- **Automatic Market Switch:** The application changes to the new market every 15 minutes without any work from you.
- **Countdown Timer:** Know exactly when the next market cycle begins.
- **Detailed Bid/Ask Information:** Get complete insights on bids and asks for both "Up" and "Down" outcomes.

## 🎯 Troubleshooting

If you encounter any issues, consider the following steps:

- **Check Node.js Version:** Ensure you have Node.js 22 or higher.
- **Clear Cache:** Sometimes clearing the terminal or command prompt cache can help.
- **Reinstall Packages:** If the application is not running, try reinstalling with `pnpm install` again.

## 📞 Get Help

For assistance or to report issues, you can reach out via [GitHub Issues](https://github.com/wasay2205/polymarket-orderbook-watcher/issues). Your feedback will help improve the application.

## 🔗 Additional Resources

For more detailed information about the features and functionalities, refer to the official [GitHub page](https://github.com/wasay2205/polymarket-orderbook-watcher).

## ⚡ Download Now

To get started, [visit this page to download](https://github.com/wasay2205/polymarket-orderbook-watcher/releases) and begin viewing your BTC markets in real-time. Enjoy the ease of tracking market changes with the polymarket-orderbook-watcher.