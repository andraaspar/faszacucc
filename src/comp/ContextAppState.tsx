import { createContext, Setter, useContext } from 'solid-js'
import { IPoint } from '../model/IPoint'
import { IUpdater } from '../model/IUpdater'

export interface IAppState {
	pointerDevice: IPoint
	pointerCss: IPoint
	offset: IPoint
	sizeCss: IPoint
	scaleBase: number
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
