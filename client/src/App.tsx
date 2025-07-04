import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import AuthModal from '@/components/AuthModal';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ProjectModal from '@/components/ProjectModal';
import ProfileModal from '@/components/ProfileModal';

import Dashboard from '@/pages/Dashboard';
import Projects from '@/pages/Projects';
import Profile from '@/pages/Profile';
import Skills from '@/pages/Skills';
import Achievements from '@/pages/Achievements';
import Analytics from '@/pages/Analytics';

function AppContent() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [activePage, setActivePage] = useState('dashboard');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      const response = await apiRequest('POST', '/api/projects', projectData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      setIsProjectModalOpen(false);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const handleCreateProject = (projectData: any) => {
    createProjectMutation.mutate(projectData);
  };

  const pageConfig = {
    dashboard: { 
      title: 'Dashboard', 
      description: 'Welcome back! Here\'s what\'s happening.',
      component: <Dashboard onAddProject={() => setIsProjectModalOpen(true)} onEditProfile={() => setIsProfileModalOpen(true)} />
    },
    projects: { 
      title: 'Projects', 
      description: 'Manage and showcase your work',
      component: <Projects onAddProject={() => setIsProjectModalOpen(true)} />
    },
    profile: { 
      title: 'Profile', 
      description: 'Manage your personal information and preferences',
      component: <Profile onEditProfile={() => setIsProfileModalOpen(true)} />
    },
    skills: { 
      title: 'Skills & Expertise', 
      description: 'Showcase your technical skills and proficiency levels',
      component: <Skills />
    },
    achievements: { 
      title: 'Achievements', 
      description: 'Celebrate your milestones and accomplishments',
      component: <Achievements />
    },
    analytics: { 
      title: 'Analytics', 
      description: 'Track your portfolio performance and engagement metrics',
      component: <Analytics />
    },
  };

  const currentPage = pageConfig[activePage as keyof typeof pageConfig];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthModal isOpen={true} onClose={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <div className="ml-64 transition-all duration-300">
        <TopBar pageTitle={currentPage.title} pageDescription={currentPage.description} />
        <div className="p-6">
          {currentPage.component}
        </div>
      </div>

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleCreateProject}
        isLoading={createProjectMutation.isPending}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
