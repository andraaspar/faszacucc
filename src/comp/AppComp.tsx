import { createEffect, on } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { formatNumber } from '../fun/formatNumber'
import { getScaleCss } from '../fun/getScaleCss'
import { useDrag } from '../hook/useDrag'
import { useRedraw } from '../hook/useRedraw'
import { useWindowResizeListener } from '../hook/useWindowResizeListener'
import { IRedrawData } from '../model/IRedrawData'
import { IUpdate } from '../model/IUpdate'
import { ContextAppState, IAppState } from './ContextAppState'

export interface AppCompProps {}

export function AppComp(props: AppCompProps) {
	const { getWindowHeight, getWindowWidth } = useWindowResizeListener()

	const [appState, setAppState] = createStore<IAppState>({
		pointerDevice: { x: 0, y: 0 },
		pointerCss: { x: 0, y: 0 },
		offsetFields: { u: 0, v: 0 },
		offsetCss: { x: 0, y: 0 },
		sizeCss: { x: 100, y: 100 },
		sizeDevice: { x: 100 * devicePixelRatio, y: 100 * devicePixelRatio },
		scaleBase: 0,
		markedField: { u: 0, v: 0 },
	})
	function updateAppState(update: IUpdate<IAppState>) {
		setAppState(produce(update))
	}

	createEffect(
		on([getWindowWidth, getWindowHeight], ([windowWidth, windowHeight]) => {
			updateAppState((it) => {
				it.sizeCss.x = windowWidth
				it.sizeCss.y = windowHeight
				it.sizeDevice.x = it.sizeCss.x * devicePixelRatio
				it.sizeDevice.y = it.sizeCss.y * devicePixelRatio
			})
		}),
	)

	const drag = useDrag({
		getPosition: () => appState.offsetFields,
		setPosition: (point) => {
			updateAppState((it) => {
				it.offsetFields.u = point.u
				it.offsetFields.v = point.v
			})
		},
		getScale: () => getScaleCss(appState.scaleBase),
		lastPointerCss: appState.pointerCss,
	})

	const data = {
		appState,
		canvas: undefined as any,
		c: undefined as any,
		scaleBase: { start: 0, end: 0, t: 1, step: 5 / 60, value: 0 },
		scaleDevice: 0,
		scaleCss: 0,
		visibleFields: { u0: 0, v0: 0, u1: 0, v1: 0 },
	} satisfies IRedrawData
	const redraw = useRedraw({ appState, updateAppState, data })
	return (
		<ContextAppState.Provider value={{ appState, setAppState, updateAppState }}>
			<div class='overscript'>
				X: {formatNumber(3, 5, appState.offsetFields.u)} Y:{' '}
				{formatNumber(3, 5, appState.offsetFields.v)} Scale:{' '}
				{appState.scaleBase} Pointer:{' '}
				{formatNumber(1, 5, appState.pointerDevice.x)}{' '}
				{formatNumber(1, 5, appState.pointerDevice.y)}
			</div>
			<canvas
				ref={redraw.setCanvasRef}
				onWheel={(e) => {
					setAppState(
						'scaleBase',
						e.deltaY < 0 ? appState.scaleBase + 1 : appState.scaleBase - 1,
					)
				}}
				onPointerDown={(e) => {
					if (e.pointerType !== 'mouse' || e.button === 1) {
						drag.onPointerDown(e)
					} else if (e.button === 1) {
					}
				}}
				onPointerMove={(e) => {
					updateAppState((it) => {
						it.pointerCss.x = e.pageX
						it.pointerCss.y = e.pageY
						it.pointerDevice.x = e.pageX * devicePixelRatio
						it.pointerDevice.y = e.pageY * devicePixelRatio
					})
					drag.onPointerMove(e)
				}}
				onPointerCancel={drag.onPointerCancel}
				onPointerUp={drag.onPointerUp}
				onPointerLeave={drag.onPointerLeave}
				onContextMenu={(e) => {
					e.preventDefault()
				}}
			/>
		</ContextAppState.Provider>
	)
}
