import styles from '@/app/_components/Form/Form.module.scss'
import InputRow from '../InputRow/InputRow';
import Button from '../Button/Button';
import Link from 'next/link';
export default function SignUpForm() {
    return (
        <div className={styles.signInForm}>
            <p className='cta'>Sign Up</p>
            <InputRow label='Name' placeHolder='Enter your name' />
            <InputRow label='Email' type='email' placeHolder='Enter your email' />
            <InputRow label='Password' type='password' placeHolder='Enter your password' />
            <div className={styles.authorize}>
                <Button>
                    <Link href='/sign-in'>
                        Sign in
                    </Link>
                </Button>
                <Button>
                        Sign up
                </Button>
            </div>
        </div>
    );
}