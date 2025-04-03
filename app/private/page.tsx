import Link from "next/link";
import { getCurrentUser } from "../_auth/currentUser";
import User from "../_components/User/User";

export default async function page() {
    const sessionUser = await getCurrentUser()
    if (!sessionUser) return <Link href='/sign-in'>Log in</Link>
    return (
        <User user={sessionUser} />
    );
}
