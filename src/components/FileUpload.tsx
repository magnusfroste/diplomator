
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDiploma } from '@/contexts/DiplomaContext';
import { generateDiplomaFromImage } from '@/services/anthropicService';

export const FileUpload = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { 
    setMessages, 
    messages, 
    setIsGenerating, 
    isGenerating,
    setDiplomaHtml,
    setDiplomaCss 
  } = useDiploma();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false
  });

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleGenerateFromImage = async () => {
    if (!uploadedImage || isGenerating) return;

    setIsGenerating(true);

    try {
      const response = await generateDiplomaFromImage(uploadedImage);
      
      const aiMessage = {
        id: Date.now().toString(),
        content: `I've analyzed your image and created a diploma design based on its style and elements. ${response.message}`,
        isUser: false,
        timestamp: new Date()
      };

      setMessages([...messages, aiMessage]);
      
      if (response.html) {
        setDiplomaHtml(response.html);
      }
      if (response.css) {
        setDiplomaCss(response.css);
      }
    } catch (error) {
      console.error('Error generating diploma from image:', error);
      const errorMessage = {
        id: Date.now().toString(),
        content: 'Sorry, I encountered an error while analyzing your image. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages([...messages, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Image</h3>
        <p className="text-sm text-slate-600">Upload an image to use as inspiration for your diploma design</p>
      </div>

      {!uploadedImage ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-blue-600 font-medium">Drop the image here...</p>
          ) : (
            <div>
              <p className="text-slate-600 font-medium mb-1">Drop an image here, or click to select</p>
              <p className="text-sm text-slate-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-white rounded-2xl border border-slate-200 p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{uploadedImage.name}</p>
                <p className="text-sm text-slate-500">
                  {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleGenerateFromImage}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? 'Analyzing...' : 'Generate Diploma from Image'}
          </Button>
        </div>
      )}
    </div>
  );
};
