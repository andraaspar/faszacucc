import { createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { IAppState } from '../comp/ContextAppState'
import { doTransitionStep } from '../fun/doTransitionStep'
import { drawCrosshair } from '../fun/drawCrosshair'
import { drawHexPattern } from '../fun/drawHexPattern'
import { drawMarker } from '../fun/drawMarker'
import { getScale } from '../fun/getScale'
import { powTransition } from '../fun/powTransition'
import { startTransitionIfTargetChanged } from '../fun/startTransitionIfTargetChanged'
import { EaseType } from '../model/EaseType'
import { FIELD_SIZE_X, FIELD_SIZE_Y } from '../model/FIELD_SIZE'
import { IPoint } from '../model/IPoint'
import { IRedrawData } from '../model/IRedrawData'

const powOut2 = powTransition(EaseType.Out, 2)

export function useRedraw({
	appState,
	data,
	setPosition,
}: {
	appState: IAppState
	data: IRedrawData
	setPosition: (cssXy: IPoint) => void
}) {
	const [getCanvasRef, setCanvasRef] = createSignal<HTMLCanvasElement>()
	const getContext = createMemo<CanvasRenderingContext2D | null | undefined>(
		() => getCanvasRef()?.getContext('2d'),
	)

	let isUnmounted = false
	function redraw() {
		const c = getContext()
		const canvas = getCanvasRef()
		if (c && canvas) {
			// Resize canvas to match the device resolution.
			canvas.width = appState.sizeCss.x * devicePixelRatio
			canvas.height = appState.sizeCss.y * devicePixelRatio

			// Share these with all the functions.
			data.c = c
			data.canvas = canvas

			// Animate scale if it changed.
			const prevScale = data.scale.value
			startTransitionIfTargetChanged(getScale(appState.scaleBase), data.scale)
			doTransitionStep(data.scale, powOut2)
			const scale = data.scale.value
			// Move the screen to keep the cursor in the same place while zooming.
			if (prevScale < scale) {
				const multi = scale / prevScale
				const mouseDistanceX =
					(appState.pointerCss.x - appState.sizeCss.x / 2) / prevScale
				const mouseDistanceY =
					(appState.pointerCss.y - appState.sizeCss.y / 2) / prevScale
				setPosition({
					x:
						appState.offsetCss.x -
						(mouseDistanceX * multi - mouseDistanceX) / multi,
					y:
						appState.offsetCss.y -
						(mouseDistanceY * multi - mouseDistanceY) / multi,
				})
			}

			const widthFields = appState.sizeCss.x / scale / FIELD_SIZE_X - 2
			const heightFields = appState.sizeCss.y / scale / FIELD_SIZE_Y - 2
			data.visibleFields.u0 = Math.floor(
				-appState.offsetCss.x / FIELD_SIZE_X - widthFields / 2,
			)
			data.visibleFields.u1 =
				Math.ceil(-appState.offsetCss.x / FIELD_SIZE_X + widthFields / 2) + 1
			data.visibleFields.v0 = Math.floor(
				-appState.offsetCss.y / FIELD_SIZE_Y - heightFields / 2,
			)
			data.visibleFields.v1 =
				Math.ceil(-appState.offsetCss.y / FIELD_SIZE_Y + heightFields / 2) + 1

			// console.log(
			// 	`[sn9gng] Visible fields:`,
			// 	JSON.stringify(data.visibleFields),
			// 	JSON.stringify(appState.markedField),
			// )

			// Draw!
			drawHexPattern(data)
			drawMarker(data)
			drawCrosshair(data)
		}
		if (!isUnmounted) requestAnimationFrame(redraw)
	}
	onMount(redraw)
	onCleanup(() => {
		isUnmounted = true
	})

	return { getCanvasRef, setCanvasRef }
}
