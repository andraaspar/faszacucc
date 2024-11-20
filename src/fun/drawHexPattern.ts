import { FIELD_SIZE_N, FIELD_SIZE_X, FIELD_SIZE_Y } from '../model/FIELD_SIZE'
import { IRedrawData } from '../model/IRedrawData'

const hexCanvas = document.createElement('canvas')
const context = hexCanvas.getContext('2d')!
const fieldCenterOffset = 1 / 3

export function drawHexPattern({
	appState,
	c: outerContext,
	canvas: outerCanvas,
	scaleDevice,
}: IRedrawData) {
	const baseWidth = 100 - FIELD_SIZE_N * 2
	const baseHeight = 150
	const targetWidth = baseWidth * scaleDevice
	const targetHeight = baseHeight * scaleDevice
	hexCanvas.width = Math.max(
		1,
		Math.min(window.innerWidth, Math.ceil(targetWidth)),
	)
	hexCanvas.height = Math.max(
		1,
		Math.min(window.innerHeight, Math.ceil(targetHeight)),
	)
	context.clearRect(0, 0, hexCanvas.width, hexCanvas.height)
	const maxScale = Math.max(
		4,
		Math.min(window.innerHeight / baseHeight, window.innerWidth / baseWidth),
	)
	const fadeBeforeMaxScale = maxScale * 0.5
	const scaleDiff = maxScale - fadeBeforeMaxScale
	if (
		hexCanvas.height > 8 &&
		hexCanvas.height < window.innerHeight &&
		hexCanvas.width < window.innerWidth
	) {
		const alpha = Math.min(
			Math.max(0, Math.min(100, hexCanvas.height - 8)) / 100,
			1 -
				(Math.max(fadeBeforeMaxScale, Math.min(maxScale, scaleDevice)) -
					fadeBeforeMaxScale) /
					(scaleDiff || 1),
		)
		context.lineWidth = 1
		context.strokeStyle = `lch(100 0 0 / ${0.25 * alpha})`
		context.moveTo(0.5, 25 * scaleDevice + 0.5)
		context.lineTo(0.5, 75 * scaleDevice + 0.5)
		context.lineTo(
			(50 - FIELD_SIZE_N) * scaleDevice + 0.5,
			100 * scaleDevice + 0.5,
		)
		context.lineTo(
			(100 - FIELD_SIZE_N * 2) * scaleDevice + 0.5,
			75 * scaleDevice + 0.5,
		)
		context.lineTo(
			(100 - FIELD_SIZE_N * 2) * scaleDevice + 0.5,
			25 * scaleDevice + 0.5,
		)
		context.lineTo((50 - FIELD_SIZE_N) * scaleDevice + 0.5, 0.5)
		context.closePath()
		context.moveTo(
			(50 - FIELD_SIZE_N) * scaleDevice + 0.5,
			100 * scaleDevice + 0.5,
		)
		context.lineTo(
			(50 - FIELD_SIZE_N) * scaleDevice + 0.5,
			150 * scaleDevice + 0.5,
		)
		context.stroke()
	}
	const pattern = outerContext.createPattern(hexCanvas, 'repeat')!
	pattern.setTransform(
		new DOMMatrix()
			.translate(
				appState.sizeDevice.x / 2 +
					appState.offsetFields.u * FIELD_SIZE_X * scaleDevice,
				appState.sizeDevice.y / 2 +
					appState.offsetFields.v * FIELD_SIZE_Y * scaleDevice +
					fieldCenterOffset * FIELD_SIZE_Y * scaleDevice,
			)
			.scale(targetWidth / hexCanvas.width, targetHeight / hexCanvas.height),
	)
	outerContext.fillStyle = pattern
	outerContext.fillRect(0, 0, outerCanvas.width, outerCanvas.height)
}
