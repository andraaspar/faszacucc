import { IAppState } from '../comp/ContextAppState'
import { IRectangleUV } from './IRectangleUV'
import { ITransition } from './ITransition'

export interface IRedrawData {
	canvas: HTMLCanvasElement
	c: CanvasRenderingContext2D
	appState: IAppState
	scaleBase: ITransition
	scaleDevice: number
	scaleCss: number
	visibleFields: IRectangleUV
}
