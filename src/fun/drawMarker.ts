import { IRedrawData } from '../model/IRedrawData'
import { fieldUVToDeviceXY } from './fieldUVToDeviceXY'
import { outlineHex } from './outlineHex'
import { rectangleUVIncludes } from './rectangleUVIncludes'

export function drawMarker({ c, appState, visibleFields, scale }: IRedrawData) {
	if (!rectangleUVIncludes(visibleFields, appState.startField)) return
	c.beginPath()

	const startXY = fieldUVToDeviceXY({
		field: appState.startField,
		offsetCss: appState.offsetCss,
		scale: scale.value,
		sizeCss: appState.sizeCss,
	})

	outlineHex(c, startXY, scale.value)

	c.strokeStyle = 'lch(0 0 0 / 0.4)'
	c.lineWidth = 5
	c.stroke()
	c.strokeStyle = 'lch(100 0 0 / 0.6)'
	c.lineWidth = 3
	c.stroke()

	const endXY = fieldUVToDeviceXY({
		field: appState.endField,
		offsetCss: appState.offsetCss,
		scale: scale.value,
		sizeCss: appState.sizeCss,
	})

	outlineHex(c, endXY, scale.value)

	c.strokeStyle = 'lch(0 0 0 / 0.4)'
	c.lineWidth = 7
	c.stroke()
	c.strokeStyle = 'lch(100 0 0 / 0.6)'
	c.lineWidth = 5
	c.stroke()
}
