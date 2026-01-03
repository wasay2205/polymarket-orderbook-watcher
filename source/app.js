import React, {useState, useEffect} from 'react';
import {Box, Text} from 'ink';
import {ClobMarketClient} from 'polymarket-websocket-client';
import {
	getCurrent15MinWindowTimestamp,
	getNext15MinWindowTimestamp,
	getMsUntilNextWindow,
	formatWindowTime,
	buildMarketSlug,
	fetchMarketData,
	extractTokenIds,
	parseOutcomes,
} from './utils.js';

function OrderbookSide({orders, side, maxRows = 10}) {
	const isBid = side === 'bid';
	const color = isBid ? 'green' : 'red';
	const sortedOrders = [...orders].sort((a, b) =>
		isBid
			? Number(b.price) - Number(a.price)
			: Number(a.price) - Number(b.price),
	);
	const displayOrders = sortedOrders.slice(0, maxRows);

	return (
		<Box flexDirection="column" width={24}>
			<Text bold color={color}>
				{isBid ? 'BIDS' : 'ASKS'}
			</Text>
			<Box>
				<Text dimColor>{'Price'.padEnd(10)}Size</Text>
			</Box>
			{displayOrders.length === 0 ? (
				<Text dimColor>No orders</Text>
			) : (
				displayOrders.map((order, i) => (
					<Text key={`${order.price}-${i}`} color={color}>
						{Number(order.price).toFixed(2).padEnd(10)}
						{Number(order.size).toFixed(0)}
					</Text>
				))
			)}
		</Box>
	);
}

function TokenOrderbook({tokenId, label, book}) {
	const bids = book?.bids || [];
	const asks = book?.asks || [];

	return (
		<Box
			flexDirection="column"
			marginRight={2}
			borderStyle="round"
			paddingX={1}
		>
			<Text bold underline>
				{label}
			</Text>
			<Box marginTop={1}>
				<OrderbookSide orders={bids} side="bid" />
				<Box width={2} />
				<OrderbookSide orders={asks} side="ask" />
			</Box>
		</Box>
	);
}

export default function App() {
	const [status, setStatus] = useState('Initializing...');
	const [error, setError] = useState(null);
	const [marketInfo, setMarketInfo] = useState(null);
	const [outcomes, setOutcomes] = useState(['Up', 'Down']);
	const [tokenIds, setTokenIds] = useState(null);
	const [books, setBooks] = useState({});
	const [countdown, setCountdown] = useState('');
	const [client, setClient] = useState(null);

	// Initialize and switch markets
	useEffect(() => {
		let currentClient = null;
		let switchTimeout = null;
		let countdownInterval = null;

		async function initMarket() {
			try {
				// Disconnect previous client
				if (currentClient) {
					currentClient.disconnect();
				}

				setStatus('Fetching market data...');
				setBooks({});

				const timestamp = getCurrent15MinWindowTimestamp();
				const slug = buildMarketSlug(timestamp);

				const data = await fetchMarketData(slug);
				setMarketInfo(data);

				const tokens = extractTokenIds(data);
				if (!tokens) {
					throw new Error('No token IDs found in market data');
				}

				setTokenIds(tokens);
				setOutcomes(parseOutcomes(data));

				// Check if market is accepting orders
				if (!data.markets?.[0]?.acceptingOrders) {
					setStatus('Market not accepting orders, waiting for next window...');
				} else {
					setStatus('Connecting to WebSocket...');
				}

				// Create WebSocket client
				currentClient = new ClobMarketClient();
				setClient(currentClient);

				currentClient.on('connected', () => {
					setStatus('Connected - Subscribing...');
					currentClient.subscribe(tokens);
				});

				currentClient.on('disconnected', () => {
					setStatus('Disconnected');
				});

				currentClient.on('error', err => {
					setError(`WebSocket error: ${err.message}`);
				});

				currentClient.onBook(event => {
					setStatus('Receiving orderbook updates');
					setBooks(prev => ({
						...prev,
						[event.asset_id]: {
							bids: event.bids || [],
							asks: event.asks || [],
						},
					}));
				});

				currentClient.onPriceChange(event => {
					// Update books with price changes
					for (const change of event.price_changes || []) {
						setBooks(prev => {
							const current = prev[event.asset_id] || {bids: [], asks: []};
							const side = change.side === 'BUY' ? 'bids' : 'asks';
							let orders = [...current[side]];

							// Find existing order at this price
							const idx = orders.findIndex(o => o.price === change.price);

							if (Number(change.size) === 0) {
								// Remove order
								if (idx !== -1) orders.splice(idx, 1);
							} else if (idx !== -1) {
								// Update order
								orders[idx] = {price: change.price, size: change.size};
							} else {
								// Add new order
								orders.push({price: change.price, size: change.size});
							}

							return {
								...prev,
								[event.asset_id]: {
									...current,
									[side]: orders,
								},
							};
						});
					}
				});

				await currentClient.connect();

				// Schedule switch to next window
				const msUntilNext = getMsUntilNextWindow();
				switchTimeout = setTimeout(() => {
					initMarket();
				}, msUntilNext + 2000); // Add 2s buffer for API
			} catch (err) {
				setError(err.message);
			}
		}

		// Countdown timer
		countdownInterval = setInterval(() => {
			const ms = getMsUntilNextWindow();
			const seconds = Math.floor(ms / 1000);
			const minutes = Math.floor(seconds / 60);
			const secs = seconds % 60;
			setCountdown(`${minutes}:${secs.toString().padStart(2, '0')}`);
		}, 1000);

		initMarket();

		return () => {
			if (currentClient) currentClient.disconnect();
			if (switchTimeout) clearTimeout(switchTimeout);
			if (countdownInterval) clearInterval(countdownInterval);
		};
	}, []);

	if (error) {
		return (
			<Box flexDirection="column">
				<Text color="red" bold>
					Error: {error}
				</Text>
			</Box>
		);
	}

	const windowStart = formatWindowTime(getCurrent15MinWindowTimestamp());
	const windowEnd = formatWindowTime(getNext15MinWindowTimestamp());

	return (
		<Box flexDirection="column" padding={1}>
			<Box marginBottom={1}>
				<Text bold color="cyan">
					Polymarket BTC Up/Down Orderbook
				</Text>
			</Box>

			<Box marginBottom={1}>
				<Text>
					<Text bold>Window:</Text> {windowStart} - {windowEnd}
				</Text>
				<Text> | </Text>
				<Text>
					<Text bold>Next:</Text> {countdown}
				</Text>
				<Text> | </Text>
				<Text dimColor>{status}</Text>
			</Box>

			{marketInfo && (
				<Box marginBottom={1}>
					<Text dimColor>{marketInfo.title}</Text>
				</Box>
			)}

			{tokenIds && (
				<Box>
					{outcomes.map((outcome, idx) => (
						<TokenOrderbook
							key={tokenIds[idx]}
							tokenId={tokenIds[idx]}
							label={outcome}
							book={books[tokenIds[idx]]}
						/>
					))}
				</Box>
			)}
		</Box>
	);
}
