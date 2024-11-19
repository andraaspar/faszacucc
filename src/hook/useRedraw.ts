import { createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { IAppState } from '../comp/ContextApp'
import { doTransitionStep } from '../fun/doTransitionStep'
import { drawCrosshair } from '../fun/drawCrosshair'
import { drawHexPattern } from '../fun/drawHexPattern'
import { getScaleCss } from '../fun/getScaleCss'
import { getScaleDevice } from '../fun/getScaleDevice'
import { powTransition } from '../fun/powTransition'
import { IRedrawData } from '../model/IRedrawData'

const pow = powTransition()

export function useRedraw({ appState }: { appState: IAppState }) {
	const [getCanvasRef, setCanvasRef] = createSignal<HTMLCanvasElement>()
	const getContext = createMemo<CanvasRenderingContext2D | null | undefined>(
		() => getCanvasRef()?.getContext('2d'),
	)

	let data: IRedrawData = {
		appState,
		canvas: undefined as any,
		c: undefined as any,
		scaleBase: { start: 0, end: 0, t: 1, step: 5 / 60, value: 0 },
		scaleDevice: 0,
		scaleCss: 0,
	}
	let isUnmounted = false
	function redraw() {
		const c = getContext()
		const canvas = getCanvasRef()
		if (c && canvas) {
			canvas.width = appState.sizeDevice.x
			canvas.height = appState.sizeDevice.y

			data.c = c
			data.canvas = canvas

			if (data.scaleBase.end !== appState.scaleBase) {
				data.scaleBase.start = data.scaleBase.value
				data.scaleBase.end = appState.scaleBase
				data.scaleBase.t = 0
			}
			doTransitionStep(data.scaleBase, pow)

			data.scaleCss = getScaleCss(data.scaleBase.value)
			data.scaleDevice = getScaleDevice(data.scaleBase.value)

			drawHexPattern(data)
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
