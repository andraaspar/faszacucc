import { createEffect, createSignal, on } from 'solid-js'
import { FIELD_SIZE } from '../model/FIELD_SIZE'
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
}: {
	getPosition: () => IPoint
	setPosition: (point: IPoint) => void
	getScale: () => number
}) {
	const [getDragStart, setDragStart] = createSignal<IDragStart | undefined>()
	let lastPageX = 0
	let lastPageY = 0
	function getIsDragged() {
		return !!getDragStart()
	}
	createEffect(
		on([getScale, getDragStart], ([scale, dragStart]) => {
			if (dragStart && dragStart.scale !== scale) {
				const position = getPosition()
				setDragStart({
					page: { x: lastPageX, y: lastPageY },
					position: { x: position.x, y: position.y },
					scale: scale,
				})
			}
		}),
	)
	function onPointerDown(e: PointerEvent) {
		if (e.pointerType !== 'mouse' || e.button === 1) {
			const position = getPosition()
			setDragStart({
				page: { x: e.pageX, y: e.pageY },
				position: { x: position.x, y: position.y },
				scale: getScale(),
			})
		}
	}
	function onPointerMove(e: PointerEvent) {
		const dragStart = getDragStart()
		if (dragStart) {
			setPosition({
				x:
					dragStart.position.x +
					(e.pageX - dragStart.page.x) / FIELD_SIZE / dragStart.scale,
				y:
					dragStart.position.y +
					(e.pageY - dragStart.page.y) / FIELD_SIZE / dragStart.scale,
			})
		}
	}
	function onPointerCancel(e: PointerEvent) {
		if (getIsDragged()) {
			setDragStart(undefined)
		}
	}
	return {
		getIsDragged,
		onPointerDown,
		onPointerMove,
		onPointerCancel,
		onPointerUp: onPointerCancel,
	}
}
