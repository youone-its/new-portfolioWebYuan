import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { Edit, MapPin, Calendar, Mail, Phone, Globe, Github, Linkedin, Twitter } from 'lucide-react';

interface ProfileProps {
  onEditProfile: () => void;
}

export default function Profile({ onEditProfile }: ProfileProps) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">Profile</h2>
          <p className="text-muted-foreground mt-1">Manage your personal information and preferences</p>
        </div>
        <Button onClick={onEditProfile} className="flex items-center space-x-2">
          <Edit className="h-4 w-4" />
          <span>Edit Profile</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-3xl font-bold">
                  {user.name?.[0] || user.username?.[0]}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold mb-2">{user.name || user.username}</h3>
              <p className="text-muted-foreground mb-4">Full Stack Developer</p>
              <div className="flex justify-center space-x-4 mb-6">
                <Button variant="ghost" size="icon">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Twitter className="h-5 w-5" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                {user.location && (
                  <div className="flex items-center justify-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center justify-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {user.bio || 'No bio available. Click Edit Profile to add a bio.'}
              </p>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">JavaScript</span>
                    <span className="text-sm text-muted-foreground">95%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full skill-progress" style={{ width: '95%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">React</span>
                    <span className="text-sm text-muted-foreground">90%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full skill-progress" style={{ width: '90%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Node.js</span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full skill-progress" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">UI/UX Design</span>
                    <span className="text-sm text-muted-foreground">80%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full skill-progress" style={{ width: '80%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-muted-foreground mr-3" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-muted-foreground mr-3" />
                  <span>+1 (555) 123-4567</span>
                </div>
                {user.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-muted-foreground mr-3" />
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {user.website}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
