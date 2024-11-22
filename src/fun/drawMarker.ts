import { FIELD_SIZE_N } from '../model/FIELD_SIZE'
import { IRedrawData } from '../model/IRedrawData'
import { fieldUVToDeviceXY } from './fieldUVToDeviceXY'
import { rectangleUVIncludes } from './rectangleUVIncludes'

export function drawMarker({ c, appState, visibleFields, scale }: IRedrawData) {
	if (!rectangleUVIncludes(visibleFields, appState.markedField)) return
	c.beginPath()

	const { x, y } = fieldUVToDeviceXY({
		field: appState.markedField,
		offsetCss: appState.offsetCss,
		scale: scale.value,
		sizeCss: appState.sizeCss,
	})

	const s = scale.value * devicePixelRatio

	c.moveTo(x + 0.5, y + 25 * s + 0.5)
	c.lineTo(x + 0.5, y + 75 * s + 0.5)
	c.lineTo(x + (50 - FIELD_SIZE_N) * s + 0.5, y + 100 * s + 0.5)
	c.lineTo(x + (100 - FIELD_SIZE_N * 2) * s + 0.5, y + 75 * s + 0.5)
	c.lineTo(x + (100 - FIELD_SIZE_N * 2) * s + 0.5, y + 25 * s + 0.5)
	c.lineTo(x + (50 - FIELD_SIZE_N) * s + 0.5, y + 0.5)
	c.closePath()

	c.strokeStyle = 'lch(0 0 0 / 0.4)'
	c.lineWidth = 5
	c.stroke()
	c.strokeStyle = 'lch(100 0 0 / 0.6)'
	c.lineWidth = 3
	c.stroke()
}
