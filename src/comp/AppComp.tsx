import { createEffect, on } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { formatNumber } from '../fun/formatNumber'
import { getScaleCss } from '../fun/getScaleCss'
import { useDrag } from '../hook/useDrag'
import { useRedraw } from '../hook/useRedraw'
import { useWindowResizeListener } from '../hook/useWindowResizeListener'
import { IUpdate } from '../model/IUpdate'
import { ContextApp, IAppState } from './ContextApp'

export interface AppCompProps {}

export function AppComp(props: AppCompProps) {
	const { getWindowHeight, getWindowWidth } = useWindowResizeListener()

	const [appState, setAppState] = createStore<IAppState>({
		offset: { x: 0, y: 0 },
		sizeDevice: { x: 100, y: 100 },
		scaleBase: 0,
	})
	function updateAppState(update: IUpdate<IAppState>) {
		setAppState(produce(update))
	}

	createEffect(
		on([getWindowWidth, getWindowHeight], ([windowWidth, windowHeight]) => {
			updateAppState((it) => {
				it.sizeDevice.x = windowWidth
				it.sizeDevice.y = windowHeight
			})
		}),
	)

	const drag = useDrag({
		getPosition: () => appState.offset,
		setPosition: (point) => {
			setAppState('offset', point)
		},
		getScale: () => getScaleCss(appState.scaleBase),
	})

	const redraw = useRedraw({ appState })
	return (
		<ContextApp.Provider value={{ appState, setAppState, updateAppState }}>
			<div class='overscript'>
				X: {formatNumber(1, 5, appState.offset.x)} Y:{' '}
				{formatNumber(1, 5, appState.offset.y)} Scale: {appState.scaleBase}
			</div>
			<canvas
				ref={redraw.setCanvasRef}
				onWheel={(e) => {
					if (e.deltaY < 0) {
						updateAppState((it) => {
							it.scaleBase++
						})
					} else {
						updateAppState((it) => {
							it.scaleBase--
						})
					}
				}}
				onPointerDown={drag.onPointerDown}
				onPointerMove={drag.onPointerMove}
				onPointerCancel={drag.onPointerCancel}
				onPointerUp={drag.onPointerUp}
				onContextMenu={(e) => {
					e.preventDefault()
				}}
			/>
		</ContextApp.Provider>
	)
}
