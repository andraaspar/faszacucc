import { getScaleCss } from './getScaleCss'

export function getScaleDevice(scaleBase: number) {
	return getScaleCss(scaleBase) * devicePixelRatio
}
