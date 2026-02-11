import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDiploma } from '@/contexts/DiplomaContext';
import { toast } from 'sonner';

interface AnimationTemplate {
  name: string;
  label: string;
  css: string;
}

const templates: AnimationTemplate[] = [
  {
    name: 'fade-in',
    label: 'Fade In',
    css: `/* Fade In Animation */
@keyframes diplomaFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.diploma-wrapper > * {
  animation: diplomaFadeIn 1s ease-out both;
}
.diploma-wrapper > *:nth-child(2) { animation-delay: 0.15s; }
.diploma-wrapper > *:nth-child(3) { animation-delay: 0.3s; }
.diploma-wrapper > *:nth-child(4) { animation-delay: 0.45s; }
.diploma-wrapper > *:nth-child(5) { animation-delay: 0.6s; }`,
  },
  {
    name: 'bounce',
    label: 'Bounce',
    css: `/* Bounce Animation */
@keyframes diplomaBounce {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-8px); }
  50% { transform: translateY(0); }
  75% { transform: translateY(-4px); }
}
.diploma-seal, .diploma-signature {
  animation: diplomaBounce 2s ease-in-out infinite;
}`,
  },
  {
    name: 'float',
    label: 'Float',
    css: `/* Float Animation */
@keyframes diplomaFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
.diploma-border {
  animation: diplomaFloat 3s ease-in-out infinite;
}`,
  },
  {
    name: 'rotate-seal',
    label: 'Rotate Seal',
    css: `/* Rotating Seal Animation */
@keyframes diplomaRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.diploma-seal {
  animation: diplomaRotate 8s linear infinite;
}`,
  },
  {
    name: 'shimmer',
    label: 'Gold Shimmer',
    css: `/* Gold Shimmer Animation */
@keyframes diplomaShimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
.diploma-header .institution {
  background: linear-gradient(90deg, currentColor 30%, #d4a853 50%, currentColor 70%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: diplomaShimmer 3s linear infinite;
}`,
  },
  {
    name: 'pulse-glow',
    label: 'Pulse Glow',
    css: `/* Pulse Glow Animation */
@keyframes diplomaPulseGlow {
  0%, 100% { box-shadow: 0 0 5px rgba(212, 168, 83, 0.3); }
  50% { box-shadow: 0 0 25px rgba(212, 168, 83, 0.6), 0 0 50px rgba(212, 168, 83, 0.2); }
}
.diploma-border {
  animation: diplomaPulseGlow 2.5s ease-in-out infinite;
}`,
  },
];

export const AnimationTemplates = () => {
  const { diplomaCss, setDiplomaCss, diplomaHtml } = useDiploma();

  const applyAnimation = (template: AnimationTemplate) => {
    if (!diplomaHtml) {
      toast.error('Generate a diploma first');
      return;
    }
    const newCss = diplomaCss + '\n\n' + template.css;
    setDiplomaCss(newCss);
    toast.success(`${template.label} applied`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-primary">
          <Sparkles className="w-3.5 h-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <p className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">Animations</p>
        <div className="flex flex-col gap-0.5">
          {templates.map((t) => (
            <button
              key={t.name}
              onClick={() => applyAnimation(t)}
              className="text-left text-sm px-2 py-1.5 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {t.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
