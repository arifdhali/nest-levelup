import { SetMetadata } from "@nestjs/common"

export const PERMISSION_KEY = "permissions"
export const Permission = (...permission: string[]) => {
    return SetMetadata(PERMISSION_KEY, permission)
}