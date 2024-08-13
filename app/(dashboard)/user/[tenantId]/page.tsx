// app/(dashboard)/user/profile/page.tsx
import { UserProfileForm } from '@/components/user/UserProfileForm'

export default function UserProfilePage() {
    return (
        <div>
            <h1>User Profile</h1>
            <UserProfileForm />
        </div>
    )
}