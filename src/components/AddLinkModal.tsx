import React, { useState, useCallback } from 'react';
import { Modal } from './Modal';
import { useStore } from '../store/useStore';
import { LinkType, FormField, PollOption } from '../types';
import { useDropzone } from 'react-dropzone';
import { 
  Link2, 
  FileText, 
  Folder, 
  Image as ImageIcon, 
  Video, 
  Music2, 
  Share2,
  Plus,
  Minus,
  Upload,
  X,
  BarChart
} from 'lucide-react';
import clsx from 'clsx';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const linkTypes: { type: LinkType; icon: any; label: string }[] = [
  { type: 'link', icon: Link2, label: 'Link' },
  { type: 'form', icon: FileText, label: 'Form' },
  { type: 'poll', icon: BarChart, label: 'Poll' },
  { type: 'folder', icon: Folder, label: 'Folder' },
  { type: 'image', icon: ImageIcon, label: 'Image' },
  { type: 'video', icon: Video, label: 'Video' },
  { type: 'podcast', icon: Music2, label: 'Podcast' },
  { type: 'social', icon: Share2, label: 'Social' },
];

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkbox' },
];

export const AddLinkModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState<LinkType>('link');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [question, setQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: crypto.randomUUID(), text: '', votes: 0 },
    { id: crypto.randomUUID(), text: '', votes: 0 },
  ]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [endDate, setEndDate] = useState('');
  
  const addLink = useStore((state) => state.addLink);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const addFormField = () => {
    setFormFields([
      ...formFields,
      {
        id: crypto.randomUUID(),
        label: '',
        type: 'text',
        required: false,
        options: [],
      },
    ]);
  };

  const updateFormField = (id: string, updates: Partial<FormField>) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const removeFormField = (id: string) => {
    setFormFields(formFields.filter(field => field.id !== id));
  };

  const addPollOption = () => {
    setPollOptions([
      ...pollOptions,
      { id: crypto.randomUUID(), text: '', votes: 0 },
    ]);
  };

  const updatePollOption = (id: string, text: string) => {
    setPollOptions(pollOptions.map(option =>
      option.id === id ? { ...option, text } : option
    ));
  };

  const removePollOption = (id: string) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter(option => option.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) return;

    const linkData: any = {
      title,
      description: description || undefined,
      thumbnail: selectedType !== 'image' ? thumbnail : undefined,
    };

    if (selectedType === 'image') {
      linkData.url = thumbnail;
    } else if (selectedType === 'form') {
      linkData.formFields = formFields;
    } else if (selectedType === 'poll') {
      linkData.question = question;
      linkData.options = pollOptions;
      linkData.allowMultiple = allowMultiple;
      linkData.endDate = endDate || undefined;
    } else {
      linkData.url = url;
    }

    addLink({
      id: crypto.randomUUID(),
      type: selectedType,
      data: linkData,
    });

    setTitle('');
    setUrl('');
    setDescription('');
    setThumbnail('');
    setFormFields([]);
    setQuestion('');
    setPollOptions([
      { id: crypto.randomUUID(), text: '', votes: 0 },
      { id: crypto.randomUUID(), text: '', votes: 0 },
    ]);
    setAllowMultiple(false);
    setEndDate('');
    onClose();
  };

  const renderFormFields = () => (
    <div className="space-y-4">
      {formFields.map((field) => (
        <div key={field.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Field Label</label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Field Type</label>
                  <select
                    value={field.type}
                    onChange={(e) => updateFormField(field.id, { type: e.target.value as any })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {fieldTypes.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateFormField(field.id, { required: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Required</span>
                  </label>
                </div>
              </div>

              {(field.type === 'select' || field.type === 'radio') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  <textarea
                    value={field.options?.join('\n')}
                    onChange={(e) => updateFormField(field.id, { 
                      options: e.target.value.split('\n').filter(Boolean)
                    })}
                    placeholder="Enter options (one per line)"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => removeFormField(field.id)}
              className="ml-4 p-1 text-gray-400 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
      
      <button
        type="button"
        onClick={addFormField}
        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Field
      </button>
    </div>
  );

  const renderPollFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter your question"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Options</label>
        {pollOptions.map((option) => (
          <div key={option.id} className="flex gap-2">
            <input
              type="text"
              value={option.text}
              onChange={(e) => updatePollOption(option.id, e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter option"
            />
            {pollOptions.length > 2 && (
              <button
                type="button"
                onClick={() => removePollOption(option.id)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        
        <button
          type="button"
          onClick={addPollOption}
          className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Option
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="allowMultiple"
          checked={allowMultiple}
          onChange={(e) => setAllowMultiple(e.target.checked)}
          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="allowMultiple" className="text-sm text-gray-700">
          Allow multiple selections
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Link">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Link Type Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {linkTypes.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={clsx(
                'flex flex-col items-center p-4 rounded-lg border-2',
                'transition-colors duration-200',
                selectedType === type
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              )}
            >
              <Icon className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Form Fields */}
          {selectedType === 'form' && renderFormFields()}

          {/* Poll Fields */}
          {selectedType === 'poll' && renderPollFields()}

          {/* URL Field (not for images or forms or polls) */}
          {selectedType !== 'image' && selectedType !== 'form' && selectedType !== 'poll' && (
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
          )}

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Image Upload Area */}
          {(selectedType === 'image' || selectedType !== 'link') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedType === 'image' ? 'Image' : 'Thumbnail'} {selectedType === 'image' && '(Required)'}
              </label>
              
              {thumbnail ? (
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setThumbnail('')}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={clsx(
                    'border-2 border-dashed rounded-lg p-8',
                    'transition-colors duration-200 cursor-pointer',
                    isDragActive
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Drag and drop an image here, or click to select
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
          >
            Add Link
          </button>
        </div>
      </form>
    </Modal>
  );
};