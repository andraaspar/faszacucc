import { IAppState } from '../comp/ContextApp'
import { ITransition } from './ITransition'

export interface IRedrawData {
	canvas: HTMLCanvasElement
	c: CanvasRenderingContext2D
	appState: IAppState
	scaleBase: ITransition
	scaleDevice: number
	scaleCss: number
}
