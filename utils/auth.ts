// utils/auth.ts
import { auth } from "@clerk/nextjs/server";
import { Role, Permission, CustomJwtSessionClaims } from "@/types/auth";
import { logger } from "@/utils/logger";

export function getUserRole(): Role | undefined {
    const { sessionClaims } = auth();
    const claims = sessionClaims as CustomJwtSessionClaims;
    return claims?.organizationRole;
}

export function getUserPermissions(): Permission[] {
    const { sessionClaims } = auth();
    const claims = sessionClaims as CustomJwtSessionClaims;
    return claims?.org_membership_permission || [];
}

export function hasRole(role: Role): boolean {
    const userRole = getUserRole();
    return userRole === role;
}

export function hasPermission(permission: Permission): boolean {
    const permissions = getUserPermissions();
    return permissions.includes(permission);
}

export function hasAnyPermission(permissions: Permission[]): boolean {
    const userPermissions = getUserPermissions();
    return permissions.some(permission => userPermissions.includes(permission));
}

export function hasAllPermissions(permissions: Permission[]): boolean {
    const userPermissions = getUserPermissions();
    return permissions.every(permission => userPermissions.includes(permission));
}

// utils/logger.ts
import pino from 'pino';

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});