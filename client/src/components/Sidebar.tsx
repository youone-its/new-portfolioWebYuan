import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  FolderOpen, 
  User, 
  Code, 
  Trophy, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export default function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className={`sidebar fixed left-0 top-0 bottom-0 bg-card shadow-lg z-40 border-r border-border ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-6 flex items-center border-b border-border">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          Y
        </div>
        {!isCollapsed && (
          <div className="logo-text ml-3">
            <h1 className="text-xl font-bold">Yuan's Portfolio</h1>
            <p className="text-sm text-muted-foreground">Developer Dashboard</p>
          </div>
        )}
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full px-4 py-3 flex items-center transition-colors rounded-lg mx-2 ${
                isActive 
                  ? 'active-nav text-primary' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && (
                <span className="nav-text ml-3 font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-6 left-0 right-0 px-4">
        <Button
          variant="ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-center"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!isCollapsed && <span className="nav-text ml-2">Collapse</span>}
        </Button>
      </div>
    </div>
  );
}
