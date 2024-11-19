import { ITransition } from '../model/ITransition'

export function doTransitionStep(
	tr: ITransition,
	transition: (t: number) => number,
) {
	if (tr.value === tr.end) {
		tr.t = 1
		return
	}
	tr.t = Math.min(1, tr.t + tr.step)
	tr.value = tr.start + transition(tr.t) * (tr.end - tr.start)
}
