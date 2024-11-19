export function formatNumber(precision: number, pad: number, num: number) {
	const [s, e] = Math.abs(num).toString().split('.')
	return (
		(num < 0 ? '-' : '+') +
		s.padStart(pad, '0') +
		'.' +
		(e ?? '').slice(0, precision).padEnd(precision, '0')
	)
}
