import { createEffect, on } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { cssXYToFieldUV } from '../fun/cssXYToFieldUV'
import { formatNumber } from '../fun/formatNumber'
import { getScale } from '../fun/getScale'
import { useDrag } from '../hook/useDrag'
import { useRedraw } from '../hook/useRedraw'
import { useWindowResizeListener } from '../hook/useWindowResizeListener'
import { FIELD_SIZE_X, FIELD_SIZE_Y } from '../model/FIELD_SIZE'
import { IPoint } from '../model/IPoint'
import { IRedrawData } from '../model/IRedrawData'
import { IUpdate } from '../model/IUpdate'
import { ContextAppState, IAppState } from './ContextAppState'

export interface AppCompProps {}

export function AppComp(props: AppCompProps) {
	const { getWindowHeight, getWindowWidth } = useWindowResizeListener()

	const [appState, setAppState] = createStore<IAppState>({
		pointerCss: { x: 0, y: 0 },
		offsetCss: { x: 0, y: 0 },
		sizeCss: { x: 100, y: 100 },
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
			})
		}),
	)

	function setOffsetCss(point: IPoint) {
		updateAppState((it) => {
			it.offsetCss.x = point.x
			it.offsetCss.y = point.y
		})
	}

	const drag = useDrag({
		getPosition: () => appState.offsetCss,
		setPosition: setOffsetCss,
		getScale: () => getScale(appState.scaleBase),
		lastPointerCss: appState.pointerCss,
	})

	const data = {
		appState,
		canvas: undefined as any,
		c: undefined as any,
		scale: {
			start: getScale(appState.scaleBase),
			end: getScale(appState.scaleBase),
			t: 1,
			step: 5 / 60,
			value: getScale(appState.scaleBase),
		},
		visibleFields: { u0: 0, v0: 0, u1: 0, v1: 0 },
	} satisfies IRedrawData
	const redraw = useRedraw({ appState, data, setPosition: setOffsetCss })
	return (
		<ContextAppState.Provider value={{ appState, setAppState, updateAppState }}>
			<div class='overscript'>
				X: {formatNumber(3, 5, appState.offsetCss.x / FIELD_SIZE_X)} Y:{' '}
				{formatNumber(3, 5, appState.offsetCss.y / FIELD_SIZE_Y)} Scale:{' '}
				{appState.scaleBase}
			</div>
			<canvas
				ref={redraw.setCanvasRef}
				onWheel={(e) => {
					const isUp = e.deltaY < 0
					updateAppState((it) => {
						if (isUp) it.scaleBase++
						else it.scaleBase--
					})
				}}
				onPointerDown={(e) => {
					if (e.pointerType !== 'mouse' || e.button === 1) {
						drag.onPointerDown(e)
					} else if (e.button === 0) {
						updateAppState((it) => {
							const uv = cssXYToFieldUV({
								scale: data.scale.value,
								cssXY: {
									x: e.pageX,
									y: e.pageY,
								},
								offsetCss: appState.offsetCss,
								sizeCss: appState.sizeCss,
							})
							it.markedField.u = Math.round(uv.u)
							it.markedField.v = Math.round(uv.v)
						})
					}
				}}
				onPointerMove={(e) => {
					updateAppState((it) => {
						it.pointerCss.x = e.pageX
						it.pointerCss.y = e.pageY
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
