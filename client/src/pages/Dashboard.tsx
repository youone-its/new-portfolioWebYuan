import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  FolderOpen, 
  Eye, 
  Star, 
  Trophy, 
  Plus, 
  Edit, 
  Download,
  ExternalLink,
  Github
} from 'lucide-react';
import type { DashboardStats, Project } from '@/lib/types';

interface DashboardProps {
  onAddProject: () => void;
  onEditProfile: () => void;
}

export default function Dashboard({ onAddProject, onEditProfile }: DashboardProps) {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const recentProjects = projects?.slice(0, 3) || [];

  return (
    <div className="fade-in">
      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4">
          <Button onClick={onAddProject} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Project</span>
          </Button>
          <Button onClick={onEditProfile} variant="secondary" className="flex items-center space-x-2">
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Portfolio</span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <FolderOpen className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <h3 className="text-2xl font-bold">{stats?.projects || 0}</h3>
                <p className="text-xs text-accent">+3 this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-accent/10 text-accent">
                <Eye className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Portfolio Views</p>
                <h3 className="text-2xl font-bold">{stats?.views || 0}</h3>
                <p className="text-xs text-accent">+12% this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-500">
                <Star className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">GitHub Stars</p>
                <h3 className="text-2xl font-bold">{stats?.stars || 0}</h3>
                <p className="text-xs text-accent">+8 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500/10 text-purple-500">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                <h3 className="text-2xl font-bold">{stats?.achievements || 0}</h3>
                <p className="text-xs text-accent">+2 this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Projects</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No projects yet. Create your first project!</p>
                  <Button onClick={onAddProject} className="mt-4">
                    Add Project
                  </Button>
                </div>
              ) : (
                recentProjects.map((project) => {
                  const technologies = project.technologies ? JSON.parse(project.technologies) : [];
                  return (
                    <div key={project.id} className="flex items-center space-x-4">
                      {project.imageUrl ? (
                        <img 
                          src={project.imageUrl} 
                          alt={project.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <FolderOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{project.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {technologies.slice(0, 2).join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs">4.8</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {projects && projects.length > 0 ? (
                <>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm">
                      <Plus className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">Added new project "{projects[0]?.title}"</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(projects[0]?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">Earned "Code Master" achievement</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity. Start by adding a project!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
