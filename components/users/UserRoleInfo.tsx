// components/UserRoleInfo.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { getUserRole, getUserPermissions } from "@/utils/auth";

export default function UserRoleInfo() {
    const { user } = useUser();
    const role = getUserRole();
    const permissions = getUserPermissions();

    if (!user) return null;

    return (
        <div>
            <h2>User Role Information</h2>
            <p>Name: {user.fullName}</p>
            <p>Role: {role || 'No role assigned'}</p>
            <h3>Permissions:</h3>
            <ul>
                {permissions.map((permission) => (
                    <li key={permission}>{permission}</li>
                ))}
            </ul>
        </div>
    );
}