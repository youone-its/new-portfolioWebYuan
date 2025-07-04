import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Moon, Sun, ChevronDown } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/use-auth';

interface TopBarProps {
  pageTitle: string;
  pageDescription?: string;
}

export default function TopBar({ pageTitle, pageDescription }: TopBarProps) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="bg-card shadow-sm border-b border-border p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          {pageDescription && (
            <p className="text-muted-foreground mt-1">{pageDescription}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-lg"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white font-bold">
                {user?.name?.[0] || user?.username?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">{user?.name || user?.username}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
