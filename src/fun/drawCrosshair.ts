import { IRedrawData } from '../model/IRedrawData'

export function drawCrosshair({ c, canvas }: IRedrawData) {
	c.beginPath()
	c.moveTo(Math.trunc(canvas.width / 2) + 0.5, 0)
	c.lineTo(Math.trunc(canvas.width / 2) + 0.5, canvas.height)
	c.moveTo(0, Math.trunc(canvas.height / 2) + 0.5)
	c.lineTo(canvas.width, Math.trunc(canvas.height / 2) + 0.5)
	c.strokeStyle = 'lch(0 0 0 / 0.4)'
	c.lineWidth = 3
	c.stroke()
	c.strokeStyle = 'lch(100 0 0 / 0.6)'
	c.lineWidth = 1
	c.stroke()
}
