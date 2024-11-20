import { FIELD_SIZE_N } from '../model/FIELD_SIZE'
import { IRedrawData } from '../model/IRedrawData'
import { deviceXYFromFieldUV } from './deviceXYFromFieldUV'
import { rectangleUVIncludes } from './rectangleUVIncludes'

export function drawMarker({
	c,
	appState,
	visibleFields,
	scaleDevice,
}: IRedrawData) {
	if (!rectangleUVIncludes(visibleFields, appState.markedField)) return
	c.beginPath()

	const fieldXY = deviceXYFromFieldUV({
		appState,
		scaleDevice,
		field: appState.markedField,
	})

	fieldXY.x -= (50 - FIELD_SIZE_N) * scaleDevice
	fieldXY.y -= 50 * scaleDevice

	c.translate(fieldXY.x, fieldXY.y)
	c.moveTo(0.5, 25 * scaleDevice + 0.5)
	c.lineTo(0.5, 75 * scaleDevice + 0.5)
	c.lineTo((50 - FIELD_SIZE_N) * scaleDevice + 0.5, 100 * scaleDevice + 0.5)
	c.lineTo((100 - FIELD_SIZE_N * 2) * scaleDevice + 0.5, 75 * scaleDevice + 0.5)
	c.lineTo((100 - FIELD_SIZE_N * 2) * scaleDevice + 0.5, 25 * scaleDevice + 0.5)
	c.lineTo((50 - FIELD_SIZE_N) * scaleDevice + 0.5, 0.5)
	c.closePath()

	c.strokeStyle = 'lch(0 0 0 / 0.4)'
	c.lineWidth = 5
	c.stroke()
	c.strokeStyle = 'lch(100 0 0 / 0.6)'
	c.lineWidth = 3
	c.stroke()

	c.resetTransform()
}
