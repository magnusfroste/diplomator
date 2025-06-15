import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User, FileText, Key, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface UserHeaderProps {
  userEmail: string;
  userName: string;
}

export const UserHeader = ({ userEmail, userName }: UserHeaderProps) => {
  const navigate = useNavigate();
  const { toast: useToastHook } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [diplomaFormat, setDiplomaFormat] = useState<'portrait' | 'landscape'>('landscape');
  const [profileName, setProfileName] = useState(userName);

  useEffect(() => {
    // Load saved API key from localStorage
    const savedApiKey = localStorage.getItem('anthropic_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    // Load saved diploma format from localStorage
    const savedFormat = localStorage.getItem('diplomaFormat') as 'portrait' | 'landscape';
    if (savedFormat) {
      setDiplomaFormat(savedFormat);
    }

    // Fetch user profile data
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();
      
      if (profileData?.name) {
        setProfileName(profileData.name);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleApiKeySave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('anthropic_api_key', apiKey);
      useToastHook({
        title: "API Key Saved",
        description: "Your Anthropic API key has been saved locally.",
      });
    } else {
      localStorage.removeItem('anthropic_api_key');
      useToastHook({
        title: "API Key Removed",
        description: "Your Anthropic API key has been removed.",
      });
    }
  };

  const handleFormatChange = (format: 'portrait' | 'landscape') => {
    setDiplomaFormat(format);
    localStorage.setItem('diplomaFormat', format);
    useToastHook({
      title: "Format Updated",
      description: `Diploma format set to ${format}`,
    });
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Error signing out');
      } else {
        toast.success('Signed out successfully');
        navigate('/');
      }
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSignedClick = () => {
    navigate('/signed');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium text-foreground">{profileName}</p>
        <p className="text-xs text-muted-foreground">{userEmail}</p>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt={profileName} />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                {getInitials(profileName)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{profileName}</p>
              <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription>
                  Configure your application preferences and API settings
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* API Key Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      API Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure your Anthropic API key for AI-powered diploma generation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">Anthropic API Key</Label>
                      <Input
                        id="api-key"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Anthropic API key"
                      />
                      <p className="text-xs text-muted-foreground">
                        Your API key is stored locally and never sent to our servers
                      </p>
                    </div>
                    <Button onClick={handleApiKeySave}>
                      Save API Key
                    </Button>
                  </CardContent>
                </Card>

                {/* Diploma Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layout className="w-5 h-5" />
                      Diploma Settings
                    </CardTitle>
                    <CardDescription>
                      Configure your diploma generation preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Label>Diploma Format</Label>
                      <div className="flex gap-2">
                        <Toggle
                          pressed={diplomaFormat === 'landscape'}
                          onPressedChange={() => handleFormatChange('landscape')}
                          className="flex-1 justify-center"
                        >
                          Landscape
                        </Toggle>
                        <Toggle
                          pressed={diplomaFormat === 'portrait'}
                          onPressedChange={() => handleFormatChange('portrait')}
                          className="flex-1 justify-center"
                        >
                          Portrait
                        </Toggle>
                      </div>
                      <p className="text-sm text-gray-600">
                        Current format: <span className="font-medium capitalize">{diplomaFormat}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
          <DropdownMenuItem onClick={handleSignedClick}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Signed</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
