import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { AlertCircle, User, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  const { login, register, isLoggingIn, isRegistering, loginError, registerError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage('');

    try {
      if (isLogin) {
        await login({ username: formData.username, password: formData.password });
        onClose();
      } else {
        await register({ username: formData.username, email: formData.email, password: formData.password });
        setSuccessMessage('Registration successful! Please login.');
        setIsLogin(true);
        setFormData({ username: '', email: '', password: '' });
      }
    } catch (error: any) {
      setErrors([error.message || 'An error occurred']);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-transition modal-visible">
      <Card className="w-full max-w-md mx-4 shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            {isLogin ? <User className="text-white text-2xl" /> : <UserPlus className="text-white text-2xl" />}
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to your account' : 'Join our community today'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {(errors.length > 0 || loginError || registerError) && (
            <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-900/20">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700 dark:text-red-300">
                {errors[0] || loginError || registerError}
              </AlertDescription>
            </Alert>
          )}
          
          {successMessage && (
            <Alert className="mb-4 border-green-200 bg-green-50 dark:bg-green-900/20">
              <AlertCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder={isLogin ? "Enter your username" : "Choose a username"}
                required
              />
            </div>
            
            {!isLogin && (
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoggingIn || isRegistering}
            >
              {isLoggingIn || isRegistering ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>
          
          <p className="mt-6 text-center text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors([]);
                setSuccessMessage('');
                setFormData({ username: '', email: '', password: '' });
              }}
              className="text-primary hover:underline font-medium"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
