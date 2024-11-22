import { FIELD_SIZE_X, FIELD_SIZE_Y } from '../model/FIELD_SIZE'
import { IPoint } from '../model/IPoint'
import { IPointUV } from '../model/IPointUV'

export function cssXYToFieldUV({
	scale,
	offsetCss,
	sizeCss,
	cssXY,
}: {
	scale: number
	offsetCss: IPoint
	sizeCss: IPoint
	cssXY: IPoint
}): IPointUV {
	let u = (-offsetCss.x + (cssXY.x - sizeCss.x / 2) / scale) / FIELD_SIZE_X
	let v = (-offsetCss.y + (cssXY.y - sizeCss.y / 2) / scale) / FIELD_SIZE_Y
	if (Math.round(v) % 2) {
		u -= 0.5
	}
	return { u, v }
}
