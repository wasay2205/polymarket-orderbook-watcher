import test from 'ava';
import {
	getCurrent15MinWindowTimestamp,
	getNext15MinWindowTimestamp,
	getMsUntilNextWindow,
	buildMarketSlug,
} from './source/utils.js';

test('getCurrent15MinWindowTimestamp returns aligned timestamp', t => {
	const timestamp = getCurrent15MinWindowTimestamp();
	// Should be divisible by 15 minutes (900 seconds)
	t.is(timestamp % 900, 0);
});

test('getNext15MinWindowTimestamp is 15 minutes after current', t => {
	const current = getCurrent15MinWindowTimestamp();
	const next = getNext15MinWindowTimestamp();
	t.is(next - current, 900);
});

test('getMsUntilNextWindow returns positive value', t => {
	const ms = getMsUntilNextWindow();
	t.true(ms > 0);
	t.true(ms <= 15 * 60 * 1000);
});

test('buildMarketSlug formats correctly', t => {
	const slug = buildMarketSlug(1767186000);
	t.is(slug, 'btc-updown-15m-1767186000');
});
