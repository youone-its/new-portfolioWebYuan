import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Code, Palette, Database, Server, Globe, Smartphone } from 'lucide-react';
import type { Skill } from '@/lib/types';

export default function Skills() {
  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ['/api/skills'],
  });

  const skillCategories = [
    { id: 'frontend', label: 'Frontend', icon: Globe, color: 'bg-blue-500' },
    { id: 'backend', label: 'Backend', icon: Server, color: 'bg-green-500' },
    { id: 'database', label: 'Database', icon: Database, color: 'bg-purple-500' },
    { id: 'mobile', label: 'Mobile', icon: Smartphone, color: 'bg-pink-500' },
    { id: 'design', label: 'Design', icon: Palette, color: 'bg-yellow-500' },
    { id: 'other', label: 'Other', icon: Code, color: 'bg-gray-500' },
  ];

  const groupedSkills = skills?.reduce((acc, skill) => {
    const category = skill.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>) || {};

  if (isLoading) {
    return (
      <div className="fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-2 bg-muted rounded" />
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
          <h2 className="text-2xl font-bold">Skills & Expertise</h2>
          <p className="text-muted-foreground mt-1">Showcase your technical skills and proficiency levels</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
        </Button>
      </div>

      {Object.keys(groupedSkills).length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Code className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No skills added yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your skills profile by adding your technical expertise.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category) => {
            const categorySkills = groupedSkills[category.id] || [];
            if (categorySkills.length === 0) return null;

            const CategoryIcon = category.icon;
            return (
              <Card key={category.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${category.color} text-white`}>
                      <CategoryIcon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{category.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {skill.level}%
                          </Badge>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Overall Skills Overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Skills Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {skills?.length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Total Skills</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-2">
                {skills?.filter(s => s.level >= 80).length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Expert Level</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500 mb-2">
                {skills?.filter(s => s.level >= 60 && s.level < 80).length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Proficient</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500 mb-2">
                {Object.keys(groupedSkills).length}
              </div>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
