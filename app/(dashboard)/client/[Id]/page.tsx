// app/(dashboard)/clients/page.tsx
import { hasPermission } from '@/utils/auth';
import { redirect } from 'next/navigation';

export default async function ClientsPage() {
    if (!hasPermission('org:client:read')) {
        redirect('/');
    }

    return (
        <div>
            <h1>Clients</h1>
            {/* Add client list here */}
            {hasPermission('org:client:create') && (
                <button>Add New Client</button>
            )}
        </div>
    );
}