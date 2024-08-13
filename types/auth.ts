// types/auth.ts
export type Role = 'org:admin' | 'org:clients' | 'org:manager_organization' | 'org:member' | 'org:non_member';

export type Permission =
    | 'org:services:create'
    | 'org:client:create'
    | 'org:client:read'
    | 'org:client:update'
    | 'org:client:delete'
    | 'org:schedules:create'
    | 'org:feedback:read'
    | 'org:pricing:create'
    | 'org:payments:manage'
    | 'org:invoice:manage'
    | 'org:client:manage'
    | 'org:services:manage'
    | 'org:pricing:manage'
    | 'org:reports:view'
    | 'org:schedules:manage'
    | 'org:assessments:manage'
    | 'org:feedback:create'
    | 'org:appointments:read'
    | 'org:appointments:create'
    | 'org:schedules:read'
    | 'org:assessments:read'
    | 'org:assessments:create'
    | 'org:services:read'
    | 'org:invoices:read'
    | 'org:payments:create'
    | 'org:payments:read'
    | 'org:pricing:read'
    | 'org:sys_domains:manage'
    | 'org:sys_domains:read'
    | 'org:sys_memberships:manage'
    | 'org:sys_memberships:read'
    | 'org:sys_profile:delete'
    | 'org:sys_profile:manage'
    | 'org:invoice:create';

export interface UserMetadata {
    role?: Role;
}

export interface CustomJwtSessionClaims {
    metadata: UserMetadata;
    organizationRole?: Role;
    org_membership_permission?: Permission[];
}
