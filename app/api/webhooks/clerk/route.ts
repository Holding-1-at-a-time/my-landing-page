// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, updateUser, deleteUser } from '@/convex/users';
import { createOrganization, updateOrganization, deleteOrganization } from '@/convex/organizations';
import { createSms } from '@/convex/sms';
import { updatePermissions, deletePermissions } from '@/convex/permissions';
import { revokeOrganizationInvitation, acceptOrganizationInvitation, createOrganizationInvitation } from '@/convex/OrganizationInvitation';


export default async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!CLERK_WEBHOOK_SECRET) {
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400
        });
    }

    const eventType = evt.type;
    const eventData = evt.data;

    const eventHandlers = {
        'user.created': createUser,
        'user.updated': updateUser,
        'user.deleted': deleteUser,
        'organization.created': createOrganization,
        'organization.updated': updateOrganization,
        'organization.deleted': deleteOrganization,
        'role.created': createRole,
        'role.updated': updateRole,
        'role.deleted': deleteRole,
        'sms.created': createSms,
        'organizationInvitation.created': createOrganizationInvitation,
        'organizationInvitation.accepted': acceptOrganizationInvitation,
        'organizationInvitation.revoked': revokeOrganizationInvitation,
        'permission.updated': updatePermissions,
        'permission.deleted': deletePermissions,
    };

    const eventHandler = eventHandlers[eventType];

    if (eventHandler) {
        await eventHandler(eventData);
    }

    return new Response('', { status: 200 });
}