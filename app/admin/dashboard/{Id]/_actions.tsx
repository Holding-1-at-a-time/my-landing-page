// app/admin/dashboard/_actions.ts
"use server";

import { hasRole } from "@/utils/auth";
import { clerkClient } from "@clerk/nextjs/server";
import { Role } from "@/types/auth";
import { logger } from "@/utils/logger";
import { z } from "zod";

const setRoleSchema = z.object({
    id: z.string().min(1),
    role: z.enum(['org:admin', 'org:clients', 'org:manager_organization', 'org:member', 'org:non_member'])
});

export async function setRole(formData: FormData) {
    if (!hasRole('org:admin')) {
        logger.warn('Non-admin user attempted to set role');
        throw new Error("Not Authorized");
    }

    try {
        const validatedData = setRoleSchema.parse({
            id: formData.get("id"),
            role: formData.get("role")
        });

        const res = await clerkClient.users.updateUser(validatedData.id, {
            publicMetadata: { role: validatedData.role },
        });

        logger.info(`Role updated for user ${validatedData.id} to ${validatedData.role}`);
        return { message: "Role updated successfully", user: res };
    } catch (err) {
        logger.error('Error updating role:', err);
        throw new Error("Error updating role");
    }
}