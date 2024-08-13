// app/admin/dashboard/_search-users.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const searchSchema = z.object({
    search: z.string().min(1).max(100)
});

export const SearchUsers = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        try {
            const { search } = searchSchema.parse(Object.fromEntries(formData));
            router.push(`${pathname}?search=${encodeURIComponent(search)}`);
            setError(null);
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0].message);
            } else {
                setError("An unexpected error occurred");
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="search">Search for Users</label>
                <input id="search" name="search" type="text" />
                <button type="submit">Search</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};
