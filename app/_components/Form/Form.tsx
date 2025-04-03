'use client'
import styles from '@/app/_components/Form/Form.module.scss'
import InputRow from '../InputRow/InputRow';
import Button from '../Button/Button';
import Link from 'next/link';
import { signIn } from '@/app/_actions/authActions';
import { useActionToast } from '@/app/_hooks/useActionToast';
import { useRouter } from 'next/navigation';
import { useAuthActionHandler } from '@/app/_hooks/useAuthActionHandler';
export default function Form() {
  const handleSubmit = useAuthActionHandler(signIn)
  return (
    <form className={styles.signInForm} action={handleSubmit}>
      <p className='cta'>Sign in</p>
      <InputRow name='email' label='Email' type='email' placeHolder='Enter your email' />
      <InputRow name='password' label='Password' type='password' placeHolder='Enter your password' />
      <div className={styles.authorize}>
        <Button>
          Sign in
        </Button>
        <Button type='submit'>
          <Link href='/sign-up'>
            Sign up
          </Link>
        </Button>
      </div>
    </form>
  );
}
