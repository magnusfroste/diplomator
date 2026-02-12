import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, Image, Globe, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface BrandingSettings {
  appName: string;
  appDescription: string;
  logoUrl: string;
  faviconUrl: string;
}

interface OgSettings {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterSite: string;
}

const defaultBranding: BrandingSettings = {
  appName: 'Diplomator',
  appDescription: 'Diploma Design Generator',
  logoUrl: '/lovable-uploads/0fe040f4-6866-4c1f-8dff-ec186506d1b0.png',
  faviconUrl: '/lovable-uploads/0fe040f4-6866-4c1f-8dff-ec186506d1b0.png',
};

const defaultOg: OgSettings = {
  ogTitle: 'Diplomator',
  ogDescription: 'Diploma Design Generator',
  ogImage: '',
  twitterCard: 'summary_large_image',
  twitterSite: '',
};

const AdminBranding = () => {
  const [branding, setBranding] = useState<BrandingSettings>(defaultBranding);
  const [og, setOg] = useState<OgSettings>(defaultOg);
  const [loading, setLoading] = useState(true);
  const [savingBranding, setSavingBranding] = useState(false);
  const [savingOg, setSavingOg] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('app_settings')
      .select('key, value')
      .in('key', ['branding', 'og_social']);

    if (data) {
      for (const row of data) {
        if (row.key === 'branding') {
          setBranding({ ...defaultBranding, ...(row.value as any) });
        }
        if (row.key === 'og_social') {
          setOg({ ...defaultOg, ...(row.value as any) });
        }
      }
    }
    setLoading(false);
  };

  const upsertSetting = async (key: string, value: any) => {
    // Try update first
    const { data: existing } = await supabase
      .from('app_settings')
      .select('id')
      .eq('key', key)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('app_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);
      return error;
    } else {
      const { error } = await supabase
        .from('app_settings')
        .insert({ key, value });
      return error;
    }
  };

  const saveBranding = async () => {
    setSavingBranding(true);
    const error = await upsertSetting('branding', branding);
    if (error) {
      toast.error('Failed to save branding settings');
    } else {
      toast.success('Branding settings saved');
    }
    setSavingBranding(false);
  };

  const saveOg = async () => {
    setSavingOg(true);
    const error = await upsertSetting('og_social', og);
    if (error) {
      toast.error('Failed to save OG/social settings');
    } else {
      toast.success('OG & social share settings saved');
    }
    setSavingOg(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Branding */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Image className="h-4 w-4 text-primary" />
            Branding
          </CardTitle>
          <CardDescription>
            App name, description, and logo used across the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appName">App Name</Label>
              <Input
                id="appName"
                value={branding.appName}
                onChange={(e) => setBranding(prev => ({ ...prev, appName: e.target.value }))}
                placeholder="Diplomator"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appDescription">App Description</Label>
              <Input
                id="appDescription"
                value={branding.appDescription}
                onChange={(e) => setBranding(prev => ({ ...prev, appDescription: e.target.value }))}
                placeholder="Diploma Design Generator"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                value={branding.logoUrl}
                onChange={(e) => setBranding(prev => ({ ...prev, logoUrl: e.target.value }))}
                placeholder="/lovable-uploads/logo.png or https://..."
              />
              {branding.logoUrl && (
                <div className="flex items-center gap-2 mt-1">
                  <img src={branding.logoUrl} alt="Logo preview" className="h-8 w-8 object-contain rounded" />
                  <span className="text-xs text-muted-foreground">Preview</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="faviconUrl">Favicon URL</Label>
              <Input
                id="faviconUrl"
                value={branding.faviconUrl}
                onChange={(e) => setBranding(prev => ({ ...prev, faviconUrl: e.target.value }))}
                placeholder="/lovable-uploads/favicon.png or https://..."
              />
            </div>
          </div>
          <Button onClick={saveBranding} disabled={savingBranding} className="gap-1">
            {savingBranding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Branding
          </Button>
        </CardContent>
      </Card>

      {/* OG & Social Share */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" />
            OG & Social Share
          </CardTitle>
          <CardDescription>
            Open Graph and Twitter Card meta tags for link previews.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ogTitle">OG Title</Label>
              <Input
                id="ogTitle"
                value={og.ogTitle}
                onChange={(e) => setOg(prev => ({ ...prev, ogTitle: e.target.value }))}
                placeholder="Diplomator"
              />
              <p className="text-xs text-muted-foreground">Max 60 characters recommended</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterCard">Twitter Card Type</Label>
              <Input
                id="twitterCard"
                value={og.twitterCard}
                onChange={(e) => setOg(prev => ({ ...prev, twitterCard: e.target.value }))}
                placeholder="summary_large_image"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ogDescription">OG Description</Label>
              <Textarea
                id="ogDescription"
                value={og.ogDescription}
                onChange={(e) => setOg(prev => ({ ...prev, ogDescription: e.target.value }))}
                placeholder="Diploma Design Generator"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">Max 160 characters recommended</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ogImage">OG Image URL</Label>
              <Input
                id="ogImage"
                value={og.ogImage}
                onChange={(e) => setOg(prev => ({ ...prev, ogImage: e.target.value }))}
                placeholder="https://example.com/og-image.png"
              />
              {og.ogImage && (
                <div className="mt-1">
                  <img src={og.ogImage} alt="OG image preview" className="max-h-24 rounded border object-contain" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterSite">Twitter @handle</Label>
              <Input
                id="twitterSite"
                value={og.twitterSite}
                onChange={(e) => setOg(prev => ({ ...prev, twitterSite: e.target.value }))}
                placeholder="@yourbrand"
              />
            </div>
          </div>
          <Button onClick={saveOg} disabled={savingOg} className="gap-1">
            {savingOg ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save OG & Social
          </Button>
        </CardContent>
      </Card>

      {/* Self-hosting note */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Open Source Note
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            These settings are stored in the <code className="bg-muted px-1 rounded">app_settings</code> table.
            When self-hosting, insert rows with keys <code className="bg-muted px-1 rounded">branding</code> and <code className="bg-muted px-1 rounded">og_social</code> to configure.
          </p>
          <p>
            OG meta tags are best served via SSR or a pre-rendering service for social crawlers. 
            For SPA deployments, consider using a serverless function or edge middleware to inject these tags.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBranding;
