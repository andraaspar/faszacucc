import { createContext, Setter, useContext } from 'solid-js'
import { IPoint } from '../model/IPoint'
import { IPointUV } from '../model/IPointUV'
import { IUpdater } from '../model/IUpdater'

export interface IAppState {
	pointerCss: IPoint
	offsetCss: IPoint
	sizeCss: IPoint
	scaleBase: number
	markedField: IPointUV
}

export interface IContextAppState {
	appState: IAppState
	setAppState: Setter<IAppState>
	updateAppState: IUpdater<IAppState>
}

export const ContextAppState = createContext<IContextAppState>()

export function useContextAppState() {
	const it = useContext(ContextAppState)
	if (!it) throw new Error(`[sn730f] ContextAppState not defined.`)
	return it
}
