#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	`
	Usage
	  $ polymarket-orderbook-watcher

	Description
	  Real-time orderbook viewer for Polymarket BTC Up/Down 15-minute markets.
	  Automatically switches to the next market window every 15 minutes.

	Examples
	  $ polymarket-orderbook-watcher
`,
	{
		importMeta: import.meta,
	},
);

render(<App />);
