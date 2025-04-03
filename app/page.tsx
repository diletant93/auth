import Link from "next/link";
import Button from "./_components/Button/Button";
import styles from '@/app/page.module.scss'
import User, { UserType } from "./_components/User/User";
import { getUserFromSession } from "./_auth/session";
export default async function Home() {
  const fullUser: UserType | null = await getUserFromSession()
  if (fullUser) return <User user={fullUser} />
  return (
    <div className={styles.authorize}>
      <Button>
        <Link href='/sign-in'>
          Sign in
        </Link>
      </Button>
      <Button>
        <Link href='/sign-up'>
          Sign up
        </Link>
      </Button>
    </div>
  );
}
