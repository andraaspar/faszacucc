import { createContext, Setter, useContext } from 'solid-js'
import { IPoint } from '../model/IPoint'
import { IUpdater } from '../model/IUpdater'

export interface IAppState {
	offset: IPoint
	sizeDevice: IPoint
	scaleBase: number
}

export interface IContextApp {
	appState: IAppState
	setAppState: Setter<IAppState>
	updateAppState: IUpdater<IAppState>
}

export const ContextApp = createContext<IContextApp>()

export function useContextApp() {
	const it = useContext(ContextApp)
	if (!it) throw new Error(`[sn730f] ContextApp not defined.`)
	return it
}
