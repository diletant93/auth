import styles from '@/app/_components/Form/Form.module.scss'
import InputRow from '../InputRow/InputRow';
import Button from '../Button/Button';
import Link from 'next/link';
import { signIn } from '@/app/_actions/authActions';
export default function Form() {
  return (
    <form className={styles.signInForm} action={signIn}>
      <p className='cta'>Sign in</p>
      <InputRow name='name' label='Email' type='email' placeHolder='Enter your email' />
      <InputRow name='email' label='Password' type='password' placeHolder='Enter your password' />
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
