// components/user/UserProfileForm.tsx
"use client";
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function UserProfileForm() {
    const { user, isLoaded } = useUser();
    const [firstName, setFirstName] = useState(user?.firstName ?? '');
    const [lastName, setLastName] = useState(user?.lastName ?? '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        try {
            await user?.update({
                firstName,
                lastName,
            });
            setSuccess(true);
            setError('');
        } catch (err) {
            console.error('Error updating user profile:', err);
            setError('An error occurred while updating your profile. Please try again.');
            setSuccess(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                required
            />
            <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                required
            />
            <Button type="submit">Update Profile</Button>
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {success && (
                <Alert>
                    <AlertDescription>Profile updated successfully!</AlertDescription>
                </Alert>
            )}
        </form>
    );
}