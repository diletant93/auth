import Button from "./_components/Button/Button";
import styles from '@/app/page.module.scss'
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
export default async function Home() {
  const { userId } = await auth()
  if (userId) return <UserButton />
  return (
    <div className={styles.authorize}>
      <div className="px-4 py-1 bg-red-400 rounded-2xl text-2xl cursor-pointer">
        <SignInButton />
      </div>
      <div className="px-4 py-1 bg-red-400 rounded-2xl text-2xl cursor-pointer">
        <SignUpButton />
      </div>
    </div>
  );
}
