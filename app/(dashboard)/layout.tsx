// app/(dashboard)/layout.tsx
import { SignedIn, SignedOut, RedirectToSignIn, OrganizationSwitcher, ClerkLoading, Protect } from '@clerk/nextjs'
import UserRoleInfo from '@/components/UserRoleInfo';
import { Suspense } from 'react';

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <SignedIn>
                <div>
                    <header>
                        <OrganizationSwitcher />
                        <Suspense fallback={<ClerkLoading />}>
                            <UserRoleInfo />
                        </Suspense>
                    </header>
                    <clerkLoaded>
                        <Protect>
                            <main>{children}</main>
                        </Protect>
                    </clerkLoaded>
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    )
}
