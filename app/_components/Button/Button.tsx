import styles from './Button.module.scss'

export default function Button({...props}: React.ComponentPropsWithoutRef<'button'>) {
  return (
    <button {...props} className={styles.button}>
       {props.children}
    </button>
  );
}
