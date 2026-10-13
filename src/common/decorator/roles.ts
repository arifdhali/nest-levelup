import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

export const Roles = (...role: string[]) => {
    return SetMetadata(ROLES_KEY, role)
}