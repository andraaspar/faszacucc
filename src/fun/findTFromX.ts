export function findTFromX(xs: number[], x: number): number {
	if (x === 0) return 0
	if (x === 1) return 1
	let lastX = 0
	for (let i = 1; i < xs.length; i++) {
		const anX = xs[i]
		if (anX === x) {
			return i / xs.length - 1
		} else if (anX > x) {
			const diff = anX - lastX
			const diff2 = x - lastX
			return (i - 1) / 100 + (diff2 / diff) * 0.01
		}
		lastX = anX
	}
	throw new Error(`[sn96tl]`)
}
