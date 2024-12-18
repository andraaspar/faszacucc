import { createEffect, createSignal, on } from 'solid-js'
import { IPoint } from '../model/IPoint'

export interface IDragStart {
	page: IPoint
	position: IPoint
	scale: number
}

export function useDrag({
	getPosition,
	setPosition,
	getScale,
	lastPointerCss,
}: {
	getPosition: () => IPoint
	setPosition: (point: IPoint) => void
	getScale: () => number
	lastPointerCss: IPoint
}) {
	const [getDragStart, setDragStart] = createSignal<IDragStart | undefined>()
	function getIsDragged() {
		return !!getDragStart()
	}
	createEffect(
		on([getScale, getDragStart], ([scale, dragStart]) => {
			if (dragStart && dragStart.scale !== scale) {
				const position = getPosition()
				setDragStart({
					page: { x: lastPointerCss.x, y: lastPointerCss.y },
					position: { x: position.x, y: position.y },
					scale: scale,
				} satisfies IDragStart)
			}
		}),
	)
	function onPointerDown(e: PointerEvent) {
		e.preventDefault() // Avoid scroll cursor
		const position = getPosition()
		setDragStart({
			page: { x: e.pageX, y: e.pageY },
			position: { x: position.x, y: position.y },
			scale: getScale(),
		} satisfies IDragStart)
	}
	function onPointerMove(e: PointerEvent) {
		const dragStart = getDragStart()
		if (dragStart) {
			setPosition({
				x:
					dragStart.position.x + (e.pageX - dragStart.page.x) / dragStart.scale,
				y:
					dragStart.position.y + (e.pageY - dragStart.page.y) / dragStart.scale,
			})
		}
	}
	function onPointerUp(e: PointerEvent) {
		if (getIsDragged()) {
			setDragStart(undefined)
		}
	}
	return {
		getIsDragged,
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel: onPointerUp,
		onPointerLeave: onPointerUp,
	}
}
