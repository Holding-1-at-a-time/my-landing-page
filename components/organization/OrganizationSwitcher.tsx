// components/organization/OrganizationSwitcher.tsx
import { OrganizationSwitcher } from "@clerk/nextjs";

export default function OrganizationSwitcher() {
    return (
        <OrganizationSwitcher
            hidePersonal
            afterCreateOrganizationUrl="/dashboard/organization/:id"
            afterLeaveOrganizationUrl="/dashboard"
            afterSelectOrganizationUrl="/dashboard/organization/:id"
        />
    );
}