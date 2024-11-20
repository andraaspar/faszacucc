import { IAppState } from '../comp/ContextAppState'
import { FIELD_SIZE_X, FIELD_SIZE_Y } from '../model/FIELD_SIZE'
import { IPoint } from '../model/IPoint'
import { IPointUV } from '../model/IPointUV'

export function deviceXYFromFieldUV({
	field,
	appState,
	scaleDevice,
}: {
	field: IPointUV
	appState: IAppState
	scaleDevice: number
}) {
	const halfOffset = field.v % 2 ? 0.5 : 0
	const centerDeviceX = appState.sizeDevice.x / 2
	const screenU = appState.offsetFields.u + field.u + halfOffset
	const x = centerDeviceX + screenU * FIELD_SIZE_X * scaleDevice

	const centerDeviceY = appState.sizeDevice.y / 2
	const screenV = appState.offsetFields.v + field.v
	const y = centerDeviceY + screenV * FIELD_SIZE_Y * scaleDevice

	return { x, y } satisfies IPoint
}
