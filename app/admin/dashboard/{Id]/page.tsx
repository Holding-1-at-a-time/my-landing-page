// app/admin/dashboard/page.tsx
import { redirect } from "next/navigation";
import { hasRole } from "@/utils/auth";
import { SearchUsers } from "./_search-users";
import { clerkClient } from "@clerk/nextjs/server";
import { setRole } from "./_actions";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import { logger } from "@/utils/logger";

export default async function AdminDashboard(params: {
    searchParams: { search?: string };
}) {
    if (!hasRole('org:admin')) {
        logger.warn('Non-admin user attempted to access admin dashboard');
        redirect("/unauthorized");
    }

    const query = params.searchParams.search;

    const users = query ? await clerkClient.users.getUserList({ query }) : [];

    return (
        <>
            <h1>Admin Dashboard</h1>
            <p>Manage user roles and permissions here.</p>

            <Suspense fallback={<Loading />}>
                <SearchUsers />

                {users.map((user) => (
                    <div key={user.id}>
                        <div>
                            {user.firstName} {user.lastName}
                        </div>
                        <div>
                            {user.emailAddresses.find(
                                (email) => email.id === user.primaryEmailAddressId
                            )?.emailAddress}
                        </div>
                        <div>{(user.publicMetadata.role as string) || 'No role'}</div>
                        <div>
                            <form action={setRole}>
                                <input type="hidden" value={user.id} name="id" />
                                <select name="role" defaultValue={user.publicMetadata.role as string || ''}>
                                    <option value="">Select a role</option>
                                    <option value="org:admin">Admin</option>
                                    <option value="org:clients">Client</option>
                                    <option value="org:manager_organization">Manager</option>
                                    <option value="org:member">Member</option>
                                    <option value="org:non_member">Non-Member</option>
                                </select>
                                <button type="submit">Update Role</button>
                            </form>
                        </div>
                    </div>
                ))}
            </Suspense>
        </>
    );
}