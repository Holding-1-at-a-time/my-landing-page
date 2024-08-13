// app/(dashboard)/layout.tsx
import { SignedIn, SignedOut, RedirectToSignIn, OrganizationSwitcher } from '@clerk/nextjs'
import UserRoleInfo from '@/components/UserRoleInfo';
import { Suspense } from 'react';
import Loading from '@/components/Loading';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <SignedIn>
                <div>
                    <header>
                        <OrganizationSwitcher />
                        <Suspense fallback={<Loading />}>
                            <UserRoleInfo />
                        </Suspense>
                    </header>
                    <main>{children}</main>
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    )
}
