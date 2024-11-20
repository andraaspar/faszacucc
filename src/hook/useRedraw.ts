import { createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { IAppState } from '../comp/ContextAppState'
import { doTransitionStep } from '../fun/doTransitionStep'
import { drawCrosshair } from '../fun/drawCrosshair'
import { drawHexPattern } from '../fun/drawHexPattern'
import { drawMarker } from '../fun/drawMarker'
import { getScaleCss } from '../fun/getScaleCss'
import { getScaleDevice } from '../fun/getScaleDevice'
import { powTransition } from '../fun/powTransition'
import { startTransitionIfTargetChanged } from '../fun/startTransitionIfTargetChanged'
import { EaseType } from '../model/EaseType'
import { FIELD_SIZE_X, FIELD_SIZE_Y } from '../model/FIELD_SIZE'
import { IRedrawData } from '../model/IRedrawData'
import { IUpdater } from '../model/IUpdater'

const powOut2 = powTransition(EaseType.Out, 2)

export function useRedraw({
	appState,
	updateAppState,
	data,
}: {
	appState: IAppState
	updateAppState: IUpdater<IAppState>
	data: IRedrawData
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
			canvas.width = appState.sizeDevice.x
			canvas.height = appState.sizeDevice.y

			// Share these with all the functions.
			data.c = c
			data.canvas = canvas

			// Animate scale if it changed.
			const prevScale = getScaleCss(data.scaleBase.value)
			startTransitionIfTargetChanged(appState.scaleBase, data.scaleBase)
			doTransitionStep(data.scaleBase, powOut2)
			data.scaleCss = getScaleCss(data.scaleBase.value)
			data.scaleDevice = getScaleDevice(data.scaleBase.value)
			const scale = data.scaleCss
			// Move the screen to keep the cursor in the same place while zooming.
			if (prevScale < scale) {
				const multi = scale / prevScale
				const mouseDistanceX =
					(appState.pointerCss.x - appState.sizeCss.x / 2) /
					(FIELD_SIZE_X * prevScale)
				const mouseDistanceY =
					(appState.pointerCss.y - appState.sizeCss.y / 2) /
					(FIELD_SIZE_Y * prevScale)
				updateAppState((it) => {
					it.offsetFields.u -= (mouseDistanceX * multi - mouseDistanceX) / multi
					it.offsetFields.v -= (mouseDistanceY * multi - mouseDistanceY) / multi
				})
			}

			const widthFields =
				appState.sizeDevice.x / (FIELD_SIZE_X * data.scaleDevice)
			const heightFields =
				appState.sizeDevice.y / (FIELD_SIZE_Y * data.scaleDevice)
			data.visibleFields.u0 = Math.floor(
				-appState.offsetFields.u - widthFields / 2,
			)
			data.visibleFields.u1 =
				Math.ceil(-appState.offsetFields.u + widthFields / 2) + 1
			data.visibleFields.v0 = Math.floor(
				-appState.offsetFields.v - heightFields / 2,
			)
			data.visibleFields.v1 =
				Math.ceil(-appState.offsetFields.v + heightFields / 2) + 1

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
