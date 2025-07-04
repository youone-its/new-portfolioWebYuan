import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CloudUpload, X } from 'lucide-react';
import type { Project } from '@/lib/types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: any) => void;
  project?: Project | null;
  isLoading?: boolean;
}

export default function ProjectModal({ isOpen, onClose, onSubmit, project, isLoading }: ProjectModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    technologies: '',
    projectUrl: '',
    githubUrl: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (project) {
      const technologies = project.technologies ? JSON.parse(project.technologies) : [];
      setFormData({
        title: project.title,
        description: project.description || '',
        category: project.category || '',
        technologies: technologies.join(', '),
        projectUrl: project.projectUrl || '',
        githubUrl: project.githubUrl || '',
        imageUrl: project.imageUrl || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        technologies: '',
        projectUrl: '',
        githubUrl: '',
        imageUrl: '',
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const technologies = formData.technologies
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0);
    
    onSubmit({
      ...formData,
      technologies: JSON.stringify(technologies),
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      technologies: '',
      projectUrl: '',
      githubUrl: '',
      imageUrl: '',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Edit Project' : 'Add New Project'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter project title"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Mobile App">Mobile App</SelectItem>
                  <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your project..."
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="imageUrl">Project Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="technologies">Technologies</Label>
              <Input
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleInputChange}
                placeholder="React, Node.js, MongoDB"
              />
            </div>
            <div>
              <Label htmlFor="projectUrl">Project URL</Label>
              <Input
                id="projectUrl"
                name="projectUrl"
                type="url"
                value={formData.projectUrl}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              name="githubUrl"
              type="url"
              value={formData.githubUrl}
              onChange={handleInputChange}
              placeholder="https://github.com/username/repo"
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (project ? 'Update Project' : 'Add Project')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
