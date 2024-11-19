import { EaseType } from '../model/EaseType'

export function powTransition(
	easeType = EaseType.Out,
	pow = 2,
): (t: number) => number {
	return (t) => {
		switch (easeType) {
			case EaseType.InOut:
				if ((t *= 2) < 1) return 0.5 * Math.pow(t, pow)
				return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow))
			case EaseType.In:
				return Math.pow(t, pow)
			case EaseType.Out:
			default:
				return 1 - Math.pow(1 - t, pow)
		}
	}
}
