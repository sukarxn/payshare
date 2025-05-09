
import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/ui/UserAvatar";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, signOut } = useAuth();
  
  if (!user) return <>{children}</>;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b py-4">
        <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-payment-primary">PayShare</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Card className="flex items-center gap-2 py-2 px-4">
              <span className="text-payment-accent font-bold">${user.balance?.toFixed(2)}</span>
            </Card>
            
            <div className="flex items-center gap-2">
              <UserAvatar username={user.username} avatarUrl={user.avatarUrl} size="sm" />
              <span className="font-medium hidden sm:inline">{user.username}</span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container max-w-6xl mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
