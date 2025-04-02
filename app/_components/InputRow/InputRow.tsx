import styles from '@/app/_components/InputRow/InputRow.module.scss'
type InputRowProps = {
    label:string;
    placeHolder?:string;
    type?:'email' | 'password';
}
export default function InputRow({label,type, placeHolder}:InputRowProps) {
  return (
    <div className={styles.row}>
        <label htmlFor={label}>{label}</label>
        <input type={type || 'text'} placeholder={placeHolder || ''}/>
    </div>
  );
}
