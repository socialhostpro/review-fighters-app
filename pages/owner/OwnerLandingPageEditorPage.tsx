
import React, { useState, useEffect, ChangeEvent } from 'react';
import { produce } from 'https://esm.sh/immer@^10.1.1'; // Using immer for easier nested state updates
import { landingPageContent as defaultContent } from '../../data/landingPageContent';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner'; // Added import
import { Save, RotateCcw, LayoutDashboard, AlertTriangle, ChevronDown, ChevronUp, PlusCircle, Trash2 } from 'lucide-react';

type LandingPageContentType = typeof defaultContent;
const LANDING_PAGE_CONTENT_KEY = 'customLandingPageContent';

// Helper to create a deep copy
const deepCopy = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

interface EditableFieldProps {
  label: string;
  path: string[]; // Path to the value in the content object e.g., ['sections', 'hero', 'headline']
  value: string | number;
  onChange: (path: string[], newValue: string | number) => void;
  type?: 'text' | 'textarea' | 'number' | 'url';
  multiline?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, path, value, onChange, type = 'text', multiline = false }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(path, type === 'number' ? parseFloat(e.target.value) : e.target.value);
  };

  if (multiline || type === 'textarea') {
    return (
      <Textarea
        label={label}
        value={String(value)}
        onChange={handleChange}
        rows={3}
        containerClassName="mb-3"
      />
    );
  }
  return (
    <Input
      label={label}
      type={type}
      value={String(value)}
      onChange={handleChange}
      containerClassName="mb-3"
    />
  );
};

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left font-semibold text-lg text-textPrimary hover:text-primary transition-colors"
            >
                {title}
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isOpen && <div className="mt-4 pt-4 border-t border-gray-200">{children}</div>}
        </div>
    );
};


const OwnerLandingPageEditorPage: React.FC = () => {
  const [editableContent, setEditableContent] = useState<LandingPageContentType>(deepCopy(defaultContent));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedContent = localStorage.getItem(LANDING_PAGE_CONTENT_KEY);
      if (storedContent) {
        const parsed = JSON.parse(storedContent);
        // Perform a basic check to ensure structure matches defaultContent to avoid crashes
        if (parsed.global && parsed.sections && parsed.footer) {
           setEditableContent(parsed);
        } else {
          console.warn("Stored landing page content is malformed, using default.");
          setEditableContent(deepCopy(defaultContent));
        }
      } else {
        setEditableContent(deepCopy(defaultContent));
      }
    } catch (e) {
      console.error("Error loading content from localStorage:", e);
      setEditableContent(deepCopy(defaultContent)); // Fallback to default
      setErrorMessage("Failed to load custom content from storage. Displaying defaults.");
    }
    setIsLoading(false);
  }, []);

  const handleFieldChange = (path: string[], newValue: string | number) => {
    setEditableContent(
      produce(draft => {
        let current: any = draft;
        path.forEach((key, index) => {
          if (index === path.length - 1) {
            current[key] = newValue;
          } else {
            current = current[key];
            if (typeof current !== 'object' || current === null) {
                // Path is invalid or trying to set property on non-object
                console.error("Invalid path for update:", path.join('.'));
                return draft; // Return original draft to prevent error
            }
          }
        });
      })
    );
    if (successMessage) setSuccessMessage(null);
    if (errorMessage) setErrorMessage(null);
  };
  
  const handleArrayItemChange = (path: string[], index: number, field: string, newValue: string) => {
    setEditableContent(
      produce(draft => {
        let currentArray: any = draft;
        path.forEach(key => {
            currentArray = currentArray[key];
        });
        if (Array.isArray(currentArray) && currentArray[index]) {
            currentArray[index][field] = newValue;
        }
      })
    );
    if (successMessage) setSuccessMessage(null);
    if (errorMessage) setErrorMessage(null);
  };


  const handleSaveChanges = () => {
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      localStorage.setItem(LANDING_PAGE_CONTENT_KEY, JSON.stringify(editableContent));
      setSuccessMessage('Landing page content saved successfully!');
    } catch (e) {
      console.error("Error saving content to localStorage:", e);
      setErrorMessage('Failed to save content. Changes might not persist.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all landing page content to defaults? This will erase your custom changes.')) {
      localStorage.removeItem(LANDING_PAGE_CONTENT_KEY);
      setEditableContent(deepCopy(defaultContent));
      setSuccessMessage('Landing page content has been reset to defaults.');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };
  
  // Simplified function to render fields for an object
  const renderObjectFields = (obj: any, currentPath: string[]) => {
    return Object.keys(obj).map(key => {
      const value = obj[key];
      const fieldPath = [...currentPath, key];
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()); // CamelCase to Title Case

      if (typeof value === 'string') {
        if (key.toLowerCase().includes('headline') || key.toLowerCase().includes('text') || key.toLowerCase().includes('description') || key.toLowerCase().includes('quote')) {
            return <EditableField key={fieldPath.join('.')} label={label} path={fieldPath} value={value} onChange={handleFieldChange} multiline />;
        }
        return <EditableField key={fieldPath.join('.')} label={label} path={fieldPath} value={value} onChange={handleFieldChange} type={key.toLowerCase().includes('href') || key.toLowerCase().includes('url') || key.toLowerCase().includes('src') ? 'url' : 'text'} />;
      }
      if (typeof value === 'number') {
        return <EditableField key={fieldPath.join('.')} label={label} path={fieldPath} value={value} onChange={handleFieldChange} type="number" />;
      }
      // For nested objects, recurse (could be a sub-collapsible section)
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return (
            <CollapsibleSection key={fieldPath.join('.')} title={label}>
                {renderObjectFields(value, fieldPath)}
            </CollapsibleSection>
        );
      }
      // For arrays of objects (e.g., features, links, indicators)
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        return (
          <div key={fieldPath.join('.')} className="mb-4 p-3 border rounded-md bg-gray-100">
            <h4 className="font-medium text-md text-textPrimary mb-2">{label}</h4>
            {value.map((item, index) => (
              <div key={index} className="mb-3 p-2 border rounded bg-white">
                {Object.keys(item).map(itemKey => {
                   if (typeof item[itemKey] === 'string') { // Only edit string fields in array items for now
                     const itemLabel = itemKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                     return (
                       <EditableField
                         key={`${fieldPath.join('.')}-${index}-${itemKey}`}
                         label={`${itemLabel} (Item ${index + 1})`}
                         path={[]} // Path handled by handleArrayItemChange
                         value={item[itemKey]}
                         onChange={(p, val) => handleArrayItemChange(fieldPath, index, itemKey, String(val))}
                         multiline={itemKey === 'text' || itemKey === 'description'}
                       />
                     );
                   }
                   return null;
                })}
              </div>
            ))}
          </div>
        );
      }
      return null;
    });
  };


  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <LayoutDashboard size={32} className="text-primary"/>
          <h1 className="text-3xl font-bold text-textPrimary">Landing Page Editor</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSaveChanges} variant="primary" leftIcon={<Save size={18}/>} isLoading={isSaving}>
            Save Changes
          </Button>
          <Button onClick={handleResetToDefaults} variant="outline" leftIcon={<RotateCcw size={18}/>} disabled={isSaving}>
            Reset to Defaults
          </Button>
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded-md text-sm" role="alert">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm" role="alert">
           <AlertTriangle size={18} className="inline mr-2" /> {errorMessage}
        </div>
      )}

      <div className="bg-surface p-6 rounded-lg shadow-xl">
        <CollapsibleSection title="Global Settings" defaultOpen={true}>
            {renderObjectFields(editableContent.global, ['global'])}
        </CollapsibleSection>

        <h2 className="text-2xl font-semibold text-textPrimary my-6 border-b pb-2">Page Sections</h2>
        {Object.keys(editableContent.sections).map(sectionKey => {
            const sectionName = sectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) + " Section";
            return (
                <CollapsibleSection key={sectionKey} title={sectionName}>
                    {renderObjectFields(editableContent.sections[sectionKey as keyof typeof editableContent.sections], ['sections', sectionKey])}
                </CollapsibleSection>
            );
        })}
        
        <CollapsibleSection title="Footer Settings">
            {renderObjectFields(editableContent.footer, ['footer'])}
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default OwnerLandingPageEditorPage;
