
import style from '@/app/_components/User/User.module.scss'
import Button from '../Button/Button';
import LogOutButton from '../LogOutButton/LogOutButton';
import { SessionUser, UserRecord } from '@/app/types/UserRecord';
import Link from 'next/link';
import ToggleRole from '../ToggleRole/ToggleRole';
type UserProps = {
    user:UserRecord | SessionUser
}
function isUserRecord(user:UserRecord | SessionUser): user is UserRecord{
  return (user as UserRecord).name !== undefined;
}
export default function User({user}:UserProps) {
  if(!isUserRecord(user)){
    return (
      <div className={style.userCard}>
         <p className={style.userRole}>Role:{user.role}</p>
         <div className={style.controls}>
          <Button><Link href='/'>Home</Link></Button>
          <ToggleRole/>
         </div>
      </div>
    );
  }
  if(isUserRecord(user)){
    return (
      <div className={style.userCard}>
         <p className={style.userName}>User:{user.name || 'No name yet'}</p>
         <div className={style.controls}>
          <Button><Link href='/private'>Private page</Link></Button>
          <LogOutButton/>
         </div>
      </div>
    );
  }
}
