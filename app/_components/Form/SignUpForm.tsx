'use client'
import styles from '@/app/_components/Form/Form.module.scss'
import InputRow from '../InputRow/InputRow';
import Button from '../Button/Button';
import Link from 'next/link';
import { signUp } from '@/app/_actions/authActions';
import { toast } from 'sonner';
import { useActionToast } from '@/app/_hooks/useActionToast';
import { useRouter } from 'next/navigation';
import { useAuthActionHandler } from '@/app/_hooks/useAuthActionHandler';
export default function SignUpForm() {
    const handleSubmit = useAuthActionHandler(signUp)
    return (
        <form className={styles.signInForm} action={handleSubmit}>
            <p className='cta'>Sign Up</p>
            <InputRow name='name' label='Name' placeHolder='Enter your name' />
            <InputRow name='email' label='Email' type='email' placeHolder='Enter your email' />
            <InputRow name='password' label='Password' type='password' placeHolder='Enter your password' />
            <div className={styles.authorize}>
                <Button >
                    <Link href='/sign-in'>
                        Sign in
                    </Link>
                </Button>
                <Button type='submit'>
                    Sign up
                </Button>
            </div>
        </form>
    );
}