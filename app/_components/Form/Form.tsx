import styles from '@/app/_components/Form/Form.module.scss'
import InputRow from '../InputRow/InputRow';
import Button from '../Button/Button';
import Link from 'next/link';
export default function Form() {
  return (
    <div className={styles.signInForm}>
      <p className='cta'>Sign in</p>
      <InputRow label='Email' type='email' placeHolder='Enter your email' />
      <InputRow label='Password' type='password' placeHolder='Enter your password' />
      <div className={styles.authorize}>
        <Button>
            Sign in
        </Button>
        <Button>
          <Link href='/sign-up'>
            Sign up
          </Link>
        </Button>
      </div>
    </div>
  );
}
