import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Users, 
  Globe, 
  Activity,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function Analytics() {
  // Mock data for analytics
  const stats = {
    totalViews: 12847,
    uniqueVisitors: 8291,
    avgSessionTime: '3:42',
    bounceRate: 24.5,
    topCountries: [
      { name: 'United States', views: 4521, percentage: 35.2 },
      { name: 'Canada', views: 2847, percentage: 22.1 },
      { name: 'United Kingdom', views: 1923, percentage: 15.0 },
      { name: 'Germany', views: 1456, percentage: 11.3 },
      { name: 'France', views: 1021, percentage: 7.9 },
    ],
    topProjects: [
      { name: 'E-commerce Dashboard', views: 3254, clicks: 287 },
      { name: 'Task Management App', views: 2891, clicks: 234 },
      { name: 'Portfolio Website', views: 2456, clicks: 198 },
      { name: 'Social Media App', views: 1987, clicks: 156 },
    ],
  };

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-muted-foreground mt-1">Track your portfolio performance and engagement metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <h3 className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</h3>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+12.5%</span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
                <h3 className="text-2xl font-bold">{stats.uniqueVisitors.toLocaleString()}</h3>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+8.3%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Session Time</p>
                <h3 className="text-2xl font-bold">{stats.avgSessionTime}</h3>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+15.2%</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                <h3 className="text-2xl font-bold">{stats.bounceRate}%</h3>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">-5.1%</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Top Countries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topCountries.map((country, index) => (
                <div key={country.name} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{country.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{country.views.toLocaleString()}</span>
                        <Badge variant="outline" className="text-xs">
                          {country.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={country.percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Top Projects</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProjects.map((project, index) => (
                <div key={project.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">{project.views.toLocaleString()} views</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{project.clicks} clicks</p>
                    <p className="text-xs text-muted-foreground">
                      {((project.clicks / project.views) * 100).toFixed(1)}% CTR
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">New visitor from Canada viewed your portfolio</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">E-commerce Dashboard project was viewed 15 times</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">Portfolio reached 1000 views this month</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
