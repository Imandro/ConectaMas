interface UserAvatarProps {
    name: string | null;
    size?: number;
    className?: string;
}

export default function UserAvatar({ name, size = 40, className = "" }: UserAvatarProps) {
    const initial = name ? name.charAt(0).toUpperCase() : 'U';

    return (
        <div
            className={`bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold ${className}`}
            style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
            {initial}
        </div>
    );
}
