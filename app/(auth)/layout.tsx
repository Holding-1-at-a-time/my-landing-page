import ConvexClerkProvider from '../ConvexClerkProvider';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ConvexClerkProvider>
            <main className="relative h-screen w-full">
                <div className="absolute size-full">
                </div>
                {children}
            </main>
        </ConvexClerkProvider>
    );
}