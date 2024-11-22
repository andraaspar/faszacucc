import { FIELD_SIZE_N } from '../model/FIELD_SIZE'
import { IPoint } from '../model/IPoint'

export function outlineHex(
	c: CanvasRenderingContext2D,
	{ x, y }: IPoint,
	scale: number,
) {
	const s = scale * devicePixelRatio

	c.beginPath()
	c.moveTo(x + 0.5, y + 25 * s + 0.5)
	c.lineTo(x + 0.5, y + 75 * s + 0.5)
	c.lineTo(x + (50 - FIELD_SIZE_N) * s + 0.5, y + 100 * s + 0.5)
	c.lineTo(x + (100 - FIELD_SIZE_N * 2) * s + 0.5, y + 75 * s + 0.5)
	c.lineTo(x + (100 - FIELD_SIZE_N * 2) * s + 0.5, y + 25 * s + 0.5)
	c.lineTo(x + (50 - FIELD_SIZE_N) * s + 0.5, y + 0.5)
	c.closePath()
}
