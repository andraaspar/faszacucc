import { Accessor, createSignal, onCleanup } from 'solid-js'

export interface IUseWindowResizeListener {
	getWindowWidth: Accessor<number>
	getWindowHeight: Accessor<number>
}

export function useWindowResizeListener(): IUseWindowResizeListener {
	const [getWidth, setWidth] = createSignal(0)
	const [getHeight, setHeight] = createSignal(0)

	const onResize = () => {
		setWidth(window.innerWidth)
		setHeight(window.innerHeight)
	}
	window.addEventListener('resize', onResize)
	onResize()
	onCleanup(() => {
		window.removeEventListener('resize', onResize)
	})

	return { getWindowWidth: getWidth, getWindowHeight: getHeight }
}
