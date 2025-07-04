import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';
import { Plus, FolderOpen } from 'lucide-react';
import type { Project } from '@/lib/types';

interface ProjectsProps {
  onAddProject: () => void;
}

export default function Projects({ onAddProject }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      const response = await apiRequest('PUT', `/api/projects/${selectedProject?.id}`, projectData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setIsEditModalOpen(false);
      setSelectedProject(null);
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update project",
        variant: "destructive",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProjectMutation.mutate(id);
    }
  };

  const handleUpdateProject = (projectData: any) => {
    updateProjectMutation.mutate(projectData);
  };

  const filteredProjects = projects?.filter(project => {
    if (activeFilter === 'all') return true;
    return project.category?.toLowerCase() === activeFilter.toLowerCase();
  }) || [];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'web', label: 'Web Development' },
    { id: 'mobile', label: 'Mobile App' },
    { id: 'design', label: 'UI/UX Design' },
    { id: 'data', label: 'Data Science' },
  ];

  if (isLoading) {
    return (
      <div className="fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded mb-4" />
                <div className="flex space-x-2">
                  <div className="h-6 w-16 bg-muted rounded-full" />
                  <div className="h-6 w-16 bg-muted rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">My Projects</h2>
          <p className="text-muted-foreground mt-1">Manage and showcase your work</p>
        </div>
        <Button onClick={onAddProject} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </Button>
      </div>

      {/* Project Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your portfolio by adding your first project.
            </p>
            <Button onClick={onAddProject}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Edit Project Modal */}
      <ProjectModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProject(null);
        }}
        onSubmit={handleUpdateProject}
        project={selectedProject}
        isLoading={updateProjectMutation.isPending}
      />
    </div>
  );
}
