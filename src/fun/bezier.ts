export function bezier(
	a: number,
	b: number,
	c: number,
	d: number,
	t: number,
): number {
	const e = a + (b - a) * t
	const f = c + (d - c) * t
	return e + (f - e) * t
}
