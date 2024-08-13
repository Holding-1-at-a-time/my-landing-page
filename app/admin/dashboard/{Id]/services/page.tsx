// app/(dashboard)/services/page.tsx
import { hasPermission } from '@/utils/auth';
import { redirect } from 'next/navigation';

export default async function ServicesPage() {
    if (!hasPermission('org:services:read')) {
        redirect('/');
    }

    return (
        <div>
            <h1>Services</h1>
            {/* Add services list here */}
            {hasPermission('org:services:create') && (
                <button>Add New Service</button>
            )}
        </div>
    );
}