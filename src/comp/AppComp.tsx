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
		offset: { x: 0, y: 0 },
		sizeCss: { x: 100, y: 100 },
		scaleBase: 0,
	})
	function updateAppState(update: IUpdate<IAppState>) {
		setAppState(produce(update))
	}

	createEffect(
		on([getWindowWidth, getWindowHeight], ([windowWidth, windowHeight]) => {
			updateAppState((it) => {
				it.sizeCss.x = windowWidth
				it.sizeCss.y = windowHeight
			})
		}),
	)

	const drag = useDrag({
		getPosition: () => appState.offset,
		setPosition: (point) => {
			setAppState('offset', point)
		},
		getScale: () => getScaleCss(appState.scaleBase),
		lastPointerCss: appState.pointerCss,
	})

	const data: IRedrawData = {
		appState,
		canvas: undefined as any,
		c: undefined as any,
		scaleBase: { start: 0, end: 0, t: 1, step: 5 / 60, value: 0 },
		scaleDevice: 0,
		scaleCss: 0,
	}
	const redraw = useRedraw({ appState, updateAppState, data })
	return (
		<ContextAppState.Provider value={{ appState, setAppState, updateAppState }}>
			<div class='overscript'>
				X: {formatNumber(3, 5, appState.offset.x)} Y:{' '}
				{formatNumber(3, 5, appState.offset.y)} Scale: {appState.scaleBase}{' '}
				Pointer: {formatNumber(1, 5, appState.pointerDevice.x)}{' '}
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
				onPointerDown={drag.onPointerDown}
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
