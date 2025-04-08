import styles from '@/app/_components/InputRow/InputRow.module.scss'
type InputRowProps = {
    label:string;
    placeHolder?:string;
    type?:'email' | 'password';
    name:string;
}
export default function InputRow({label,name,type, placeHolder}:InputRowProps) {
  return (
    <div className={styles.row}>
        <label htmlFor={label}>{label}</label>
        <input type={type || 'text'} placeholder={placeHolder || ''} name={name} required/>
    </div>
  );
}
