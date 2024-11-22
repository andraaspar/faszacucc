import { FIELD_SIZE_N, FIELD_SIZE_X, FIELD_SIZE_Y } from '../model/FIELD_SIZE'
import { IPoint } from '../model/IPoint'
import { IPointUV } from '../model/IPointUV'

export function fieldUVToDeviceXY({
	field,
	scale,
	sizeCss,
	offsetCss,
}: {
	field: IPointUV
	scale: number
	sizeCss: IPoint
	offsetCss: IPoint
}) {
	const s = scale * devicePixelRatio
	const width = 50 - FIELD_SIZE_N
	const rowOffsetX = field.v % 2 ? 0 : width
	const x =
		(sizeCss.x / 2) * devicePixelRatio +
		offsetCss.x * s +
		(field.u * FIELD_SIZE_X - rowOffsetX) * s
	const y =
		(sizeCss.y / 2) * devicePixelRatio +
		offsetCss.y * s +
		(field.v * FIELD_SIZE_Y - 50) * s

	return { x, y } satisfies IPoint
}
