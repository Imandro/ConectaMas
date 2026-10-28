import styles from './SecondaryUI.module.scss';

interface SecondaryPageShellProps {
    children: React.ReactNode;
    className?: string;
}

/** Shared visual boundary for secondary routes; keeps page logic and contracts unchanged. */
export default function SecondaryPageShell({ children, className = '' }: SecondaryPageShellProps) {
    return <div className={`${styles.scope} ${className}`.trim()}>{children}</div>;
}
