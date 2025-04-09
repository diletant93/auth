'use client'
import styles from '@/app/_components/Form/Form.module.scss'
import InputRow from '../InputRow/InputRow';
import Button from '../Button/Button';
import Link from 'next/link';
import { signIn } from '@/app/_actions/authActions';
import { useAuthActionHandler } from '@/app/_hooks/useAuthActionHandler';
import OAuthButtons from '../OAuthButtons/OAuthButtons';
export default function Form() {
  const handleSubmit = useAuthActionHandler(signIn)
  return (
    <form className={styles.signInForm} action={handleSubmit}>
      <p className='cta'>Sign in</p>
      <OAuthButtons  className='flex gap-2 mt-2'/>
      <InputRow name='email' label='Email' type='email' placeHolder='Enter your email' />
      <InputRow name='password' label='Password' type='password' placeHolder='Enter your password' />
      <div className={styles.authorize}>
        <Button type='submit'>
          <Link href='/sign-up'>
            Sign up
          </Link>
        </Button>
        <Button type='button'>
          Sign in
        </Button>
      </div>
    </form>
  );
}
