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

    if (eventType === 'user.created') {
        const { id, email_addresses, username } = evt.data;
        const email = email_addresses[0]?.email_address;
        await createUser({ id, email, username });
    }

    if (eventType === 'user.updated') {
        const { id, email_addresses, username } = evt.data;
        const email = email_addresses[0]?.email_address;
        await updateUser({ id, email, username });
    }

    if (eventType === 'user.deleted') {
        const { id } = evt.data;
        await deleteUser({ id });
    }

    if (eventType === 'organization.created') {
        const { id, name, slug } = evt.data;
        await createOrganization({ id, name, slug });
    }

    if (eventType === 'organization.updated') {
        const { id, name, slug } = evt.data;
        await updateOrganization({ id, name, slug });
    }

    if (eventType === 'organization.deleted') {
        const { id } = evt.data;
        await deleteOrganization(id);
    }

    if (eventType === 'role.created') {
        const { id, name, object, permissions } = evt.data;
        await createRole({ id, name, object, permissions });
    }

    if (eventType === 'role.updated') {
        const { id, name, object, permissions } = evt.data;
        await updateRole({ id, name, object, permissions });
    }

    if (eventType === 'role.deleted') {
        const { id } = evt.data;
        await deleteRole({ id });
    }

    if (eventType === 'sms.created') {
        const { delivered_by_clerk, from_phone_number, id, message, object, phone_number_id, slug, status, to_phone_number, user_id } = evt.data;
        await createSms({ delivered_by_clerk, from_phone_number, id, message, object, phone_number_id, slug, status, to_phone_number, user_id });
    }

    if (eventType === 'organizationInvitation.created') {
        const { created_at, email_address, id, object, organization_id, role, status, updated_at } = evt.data;
        await createOrganizationInvitation({ created_at, email_address, id, object, organization_id, role, status, updated_at });
    }

    if (eventType === 'organizationInvitation.accepted') {
        const { created_at, email_address, id, object, organization_id, role, status, updated_at } = evt.data;
        await acceptOrganizationInvitation({ created_at, email_address, id, object, organization_id, role, status, updated_at });
    }

    if (eventType === 'organizationInvitation.revoked') {
        const { created_at, email_address, id, object, organization_id, role, status, updated_at } = evt.data;
        await revokeOrganizationInvitation({ created_at, email_address, id, object, organization_id, role, status, updated_at });
    }

    if (eventType === 'permission.updated') {
        const { created_at, description, id, name, object, type, updated_at } = evt.data;
        await updatePermissions({ created_at, description, id, name, object, type, updated_at });
    }
    
    if (eventType === 'permission.deleted') {
        const { deleted, id, object } = evt.data;
        await deletePermissions({ deleted, id, object });
    } 

    return new Response('', { status: 200 });
}