import { IRectangleUV } from '../model/IRectangleUV'

export function rectangleUVArea(rect: IRectangleUV) {
	return (rect.u1 - rect.u0) * (rect.v1 - rect.v0)
}
