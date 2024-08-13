// app/(dashboard)/organization/[id]/page.

import { auth } from '@clerk/nextjs/server'
import { useOrganization } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default async function OrganizationDashboardPage({
    params,
}: Readonly<{
    params: { id: string }
}>) {
    const { userId, has } = auth()
    const { organization } = useOrganization()
    const org = useQuery(api.organizations.getOrganization, { id: params.id })

    if (!organization || !org) {
        return <div>Loading...</div>
    }

    const canManageOrg = has({ permission: "org:manage" })

    return (
        <div>
            <h1>{organization.name} Dashboard</h1>
            <p>Organization ID: {params.id}</p>
            <p>Slug: {org.slug}</p>
            {canManageOrg && (
                <div>
                    <h2>Admin Controls</h2>
                    {/* Add admin-only controls here */}
                </div>
            )}
        </div>
    )
}