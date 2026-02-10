import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Loader2, ExternalLink, Zap, Globe, Brain, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface IntegrationConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  secretName: string;
  getKeyUrl: string;
  getKeyInstructions: string;
  supabaseSecretCommand: string;
  models: { value: string; label: string }[];
}

const integrations: IntegrationConfig[] = [
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    icon: <Brain className="h-5 w-5" />,
    description: 'Claude-modeller för diplomgenerering. Standard-integration.',
    secretName: 'ANTHROPIC_API_KEY',
    getKeyUrl: 'https://console.anthropic.com/settings/keys',
    getKeyInstructions: 'Skapa ett konto på console.anthropic.com → Settings → API Keys → Create Key',
    supabaseSecretCommand: 'supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxxxx',
    models: [
      { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4 (Senaste)' },
      { value: 'claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet' },
      { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
      { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
      { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku (Snabb/Billig)' },
      { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus (Mest kapabel)' },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI (GPT)',
    icon: <Sparkles className="h-5 w-5" />,
    description: 'GPT-modeller som alternativ AI-provider.',
    secretName: 'OPENAI_API_KEY',
    getKeyUrl: 'https://platform.openai.com/api-keys',
    getKeyInstructions: 'Logga in på platform.openai.com → API Keys → Create new secret key',
    supabaseSecretCommand: 'supabase secrets set OPENAI_API_KEY=sk-xxxxx',
    models: [
      { value: 'gpt-4o', label: 'GPT-4o (Senaste)' },
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Snabb/Billig)' },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Billigast)' },
    ],
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    icon: <Zap className="h-5 w-5" />,
    description: 'Googles Gemini-modeller med multimodal kapacitet.',
    secretName: 'GEMINI_API_KEY',
    getKeyUrl: 'https://aistudio.google.com/apikey',
    getKeyInstructions: 'Gå till aistudio.google.com → Get API Key → Create API Key',
    supabaseSecretCommand: 'supabase secrets set GEMINI_API_KEY=AIzaxxxxx',
    models: [
      { value: 'gemini-2.5-pro-preview-06-05', label: 'Gemini 2.5 Pro (Senaste)' },
      { value: 'gemini-2.5-flash-preview-05-20', label: 'Gemini 2.5 Flash' },
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
      { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Billigast)' },
    ],
  },
  {
    id: 'firecrawl',
    name: 'Firecrawl (Web Scraper)',
    icon: <Globe className="h-5 w-5" />,
    description: 'Webb-scraping för att hämta brandingdata från webbplatser.',
    secretName: 'FIRECRAWL_API_KEY',
    getKeyUrl: 'https://www.firecrawl.dev/app/api-keys',
    getKeyInstructions: 'Skapa konto på firecrawl.dev → Dashboard → API Keys → Create API Key',
    supabaseSecretCommand: 'supabase secrets set FIRECRAWL_API_KEY=fc-xxxxx',
    models: [
      { value: 'scrape', label: 'Scrape (Standard)' },
    ],
  },
];

interface TestResult {
  success: boolean;
  message: string;
  model: string;
  latencyMs: number;
}

const AdminIntegrations = () => {
  const [testing, setTesting] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [selectedModels, setSelectedModels] = useState<Record<string, string>>({});

  const testIntegration = async (integration: IntegrationConfig) => {
    const model = selectedModels[integration.id] || integration.models[0].value;
    setTesting(integration.id);

    try {
      const { data, error } = await supabase.functions.invoke('test-integration', {
        body: { provider: integration.id, model },
      });

      if (error) {
        setResults(prev => ({ ...prev, [integration.id]: { success: false, message: error.message, model, latencyMs: 0 } }));
        toast.error(`${integration.name}: Test misslyckades`);
      } else {
        setResults(prev => ({ ...prev, [integration.id]: data }));
        if (data.success) {
          toast.success(`${integration.name}: Test OK (${data.latencyMs}ms)`);
        } else {
          toast.error(`${integration.name}: ${data.message}`);
        }
      }
    } catch (err: any) {
      setResults(prev => ({ ...prev, [integration.id]: { success: false, message: err.message, model, latencyMs: 0 } }));
      toast.error(`${integration.name}: Oväntat fel`);
    } finally {
      setTesting(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Self-hosting info */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">🔧 Self-hosting / VPS Setup</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Diplomator är open source. För att köra på egen VPS behöver du konfigurera API-nycklar som Supabase secrets:
          </p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
{`# Installera Supabase CLI
npm install -g supabase

# Logga in och länka projektet
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Lägg till secrets
supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxxxx
supabase secrets set OPENAI_API_KEY=sk-xxxxx
supabase secrets set GEMINI_API_KEY=AIzaxxxxx
supabase secrets set FIRECRAWL_API_KEY=fc-xxxxx`}
          </pre>
        </CardContent>
      </Card>

      {/* Integration cards */}
      {integrations.map(integration => {
        const result = results[integration.id];
        const isTesting = testing === integration.id;
        const selectedModel = selectedModels[integration.id] || integration.models[0].value;

        return (
          <Card key={integration.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {integration.icon}
                  <div>
                    <CardTitle className="text-base">{integration.name}</CardTitle>
                    <CardDescription className="text-xs">{integration.description}</CardDescription>
                  </div>
                </div>
                {result && (
                  <Badge variant={result.success ? 'default' : 'destructive'} className="gap-1">
                    {result.success ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {result.success ? `OK ${result.latencyMs}ms` : 'Fel'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Model selector + test */}
              <div className="flex items-center gap-2">
                {integration.models.length > 1 && (
                  <Select
                    value={selectedModel}
                    onValueChange={(v) => setSelectedModels(prev => ({ ...prev, [integration.id]: v }))}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {integration.models.map(m => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button
                  onClick={() => testIntegration(integration)}
                  disabled={isTesting}
                  size="sm"
                >
                  {isTesting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                  {isTesting ? 'Testar...' : 'Testa'}
                </Button>
              </div>

              {/* Result message */}
              {result && (
                <div className={`text-xs p-2 rounded ${result.success ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-destructive/10 text-destructive'}`}>
                  <p className="font-mono break-all">{result.message}</p>
                </div>
              )}

              {/* Setup instructions */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Secret: <code className="bg-muted px-1 rounded">{integration.secretName}</code></span>
                <span>·</span>
                <a
                  href={integration.getKeyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  Hämta API-nyckel <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="text-xs text-muted-foreground">{integration.getKeyInstructions}</p>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                {integration.supabaseSecretCommand}
              </pre>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminIntegrations;
