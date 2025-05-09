
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  username: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
}

const UserAvatar = ({ username, avatarUrl, size = "md" }: UserAvatarProps) => {
  // Get first letter of username for fallback
  const firstLetter = username ? username[0].toUpperCase() : '?';
  
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-lg"
  };
  
  return (
    <Avatar className={sizeClasses[size]}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={username} />}
      <AvatarFallback className="bg-payment-primary text-white">
        {firstLetter}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
