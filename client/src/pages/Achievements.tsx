import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Star, Target, Plus, Calendar } from 'lucide-react';
import type { Achievement } from '@/lib/types';

export default function Achievements() {
  const { data: achievements, isLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  const achievementIcons = {
    trophy: Trophy,
    award: Award,
    star: Star,
    target: Target,
  };

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
                  <div className="h-2 bg-muted rounded w-1/2" />
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
          <h2 className="text-2xl font-bold">Achievements</h2>
          <p className="text-muted-foreground mt-1">Celebrate your milestones and accomplishments</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Achievement</span>
        </Button>
      </div>

      {!achievements || achievements.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No achievements yet</h3>
            <p className="text-muted-foreground mb-4">
              Start documenting your accomplishments and milestones.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Achievement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Achievement Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{achievements.length}</div>
                <p className="text-sm text-muted-foreground">Total Achievements</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">
                  {achievements.filter(a => new Date(a.date).getFullYear() === new Date().getFullYear()).length}
                </div>
                <p className="text-sm text-muted-foreground">This Year</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">
                  {achievements.filter(a => a.icon === 'star').length}
                </div>
                <p className="text-sm text-muted-foreground">Major Milestones</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">
                  {achievements.filter(a => new Date(a.date).getMonth() === new Date().getMonth()).length}
                </div>
                <p className="text-sm text-muted-foreground">This Month</p>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => {
              const IconComponent = achievementIcons[achievement.icon as keyof typeof achievementIcons] || Trophy;
              return (
                <Card key={achievement.id} className="card-hover">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(achievement.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{achievement.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
