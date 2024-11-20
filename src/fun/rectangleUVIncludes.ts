import { IPointUV } from '../model/IPointUV'
import { IRectangleUV } from '../model/IRectangleUV'

export function rectangleUVIncludes(
	rect: IRectangleUV,
	point: IPointUV,
): boolean {
	return (
		point.u >= rect.u0 &&
		point.u < rect.u1 &&
		point.v >= rect.v0 &&
		point.v < rect.v1
	)
}
