import { ITransition } from '../model/ITransition'

export function startTransitionIfTargetChanged(
	target: number,
	transition: ITransition,
) {
	if (transition.end !== target) {
		transition.start = transition.value
		transition.end = target
		transition.t = 0
	}
}
