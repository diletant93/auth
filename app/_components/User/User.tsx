import style from '@/app/_components/User/User.module.scss'
import Button from '../Button/Button';
export type UserType = {
    name:string;
    role:string;
}
type UserProps = {
    user:UserType;
}
export default function User({user}:UserProps) {
  return (
    <div className={style.userCard}>
       <p className={style.userName}>User:{user.name}</p>
       <p className={style.userRole}>Role:{user.role}</p>
       <div className={style.controls}>
        <Button>PrivatePage</Button>
        <Button>Log Out</Button>
       </div>
    </div>
  );
}
