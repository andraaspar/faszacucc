import { createEffect, createSignal, on } from 'solid-js'
import { FIELD_SIZE_X, FIELD_SIZE_Y } from '../model/FIELD_SIZE'
import { IPoint } from '../model/IPoint'
import { IPointUV } from '../model/IPointUV'

export interface IDragStart {
	page: IPoint
	position: IPointUV
	scale: number
}

export function useDrag({
	getPosition,
	setPosition,
	getScale,
	lastPointerCss,
}: {
	getPosition: () => IPointUV
	setPosition: (point: IPointUV) => void
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
					position: { u: position.u, v: position.v },
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
			position: { u: position.u, v: position.v },
			scale: getScale(),
		} satisfies IDragStart)
	}
	function onPointerMove(e: PointerEvent) {
		const dragStart = getDragStart()
		if (dragStart) {
			setPosition({
				u:
					dragStart.position.u +
					(e.pageX - dragStart.page.x) / FIELD_SIZE_X / dragStart.scale,
				v:
					dragStart.position.v +
					(e.pageY - dragStart.page.y) / FIELD_SIZE_Y / dragStart.scale,
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
