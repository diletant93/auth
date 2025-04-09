import Link from "next/link";
import Button from "./_components/Button/Button";
import styles from '@/app/page.module.scss'
import User from "./_components/User/User";
import { getCurrentUser } from "./_auth/currentUser";
export default async function Home() {
  const fullUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true })
  if (fullUser) return <User user={fullUser} />
  return (
    <div className={styles.authorize}>
      <Link href='/sign-in'>
        <Button>
          Sign in
        </Button>
      </Link>
      <Link href='/sign-up'>
        <Button>
          Sign up
        </Button>
      </Link>
    </div>
  );
}
