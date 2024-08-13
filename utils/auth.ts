// utils/auth.ts
import { auth } from "@clerk/nextjs/server";
import { Role, Permission, CustomJwtSessionClaims } from "@/types/auth";

const rolePermissions: Record<Role, Permission[]> = {
    'org:admin': [
        'org:services:create', 'org:client:create', 'org:client:read', 'org:client:update', 'org:client:delete',
        'org:schedules:create', 'org:feedback:read', 'org:pricing:create', 'org:payments:manage', 'org:invoice:manage',
        'org:client:manage', 'org:services:manage', 'org:pricing:manage', 'org:reports:view', 'org:schedules:manage',
        'org:assessments:manage', 'org:feedback:create', 'org:appointments:read', 'org:appointments:create',
        'org:schedules:read', 'org:assessments:read', 'org:assessments:create', 'org:services:read', 'org:invoices:read',
        'org:payments:create', 'org:payments:read', 'org:pricing:read', 'org:sys_domains:manage', 'org:sys_domains:read',
        'org:sys_memberships:manage', 'org:sys_memberships:read', 'org:sys_profile:delete', 'org:sys_profile:manage',
        'org:invoice:create'
    ],
    'org:clients': [
        'org:feedback:create', 'org:appointments:read', 'org:appointments:create', 'org:assessments:read',
        'org:assessments:create', 'org:services:read', 'org:invoices:read', 'org:payments:create',
        'org:payments:read', 'org:pricing:read'
    ],
    'org:manager_organization': [
        'org:services:create', 'org:client:create', 'org:client:read', 'org:client:update', 'org:client:delete',
        'org:schedules:create', 'org:feedback:read', 'org:pricing:create', 'org:payments:manage', 'org:invoice:manage',
        'org:client:manage', 'org:services:manage', 'org:pricing:manage', 'org:reports:view', 'org:schedules:manage',
        'org:assessments:manage', 'org:feedback:create', 'org:appointments:read', 'org:appointments:create',
        'org:schedules:read', 'org:assessments:read', 'org:assessments:create', 'org:services:read', 'org:invoices:read',
        'org:payments:create', 'org:payments:read', 'org:pricing:read', 'org:sys_memberships:manage',
        'org:sys_memberships:read', 'org:sys_profile:manage', 'org:invoice:create'
    ],
    'org:member': [
        'org:client:create', 'org:client:read', 'org:client:update', 'org:feedback:read', 'org:appointments:read',
        'org:appointments:create', 'org:schedules:read', 'org:assessments:read', 'org:assessments:create',
        'org:invoices:read', 'org:payments:create', 'org:payments:read', 'org:pricing:read', 'org:sys_memberships:read',
        'org:services:read'
    ],
    'org:non_member': [
        'org:appointments:read', 'org:schedules:read', 'org:assessments:read', 'org:services:read', 'org:invoices:read',
        'org:payments:read', 'org:pricing:read', 'org:client:read', 'org:feedback:read'
    ]
};

export function getUserRole(): Role | undefined {
    const { sessionClaims } = auth();
    const claims = sessionClaims as CustomJwtSessionClaims;
    return claims?.organizationRole;
}

export function getUserPermissions(): Permission[] {
    const role = getUserRole();
    return role ? rolePermissions[role] : [];
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