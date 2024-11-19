import { IUpdate } from './IUpdate'

export interface IUpdater<T> {
	(update: IUpdate<T>): void
}
