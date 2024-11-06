import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Link as LinkIcon, 
  FileText, 
  Folder, 
  Image as ImageIcon, 
  Music2, 
  Share2,
  Play,
  Pause,
  ChevronRight,
  ChevronDown,
  Edit2,
  BarChart
} from 'lucide-react';
import { VideoPreview } from './VideoPreview';
import { LinkItem, Theme, FormField, PollOption } from '../types';
import clsx from 'clsx';
import { useStore } from '../store/useStore';

interface LinkPreviewCardProps {
  item: LinkItem;
  theme: Theme;
}

export const LinkPreviewCard: React.FC<LinkPreviewCardProps> = ({ item, theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFolderExpanded, setIsFolderExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(item.data);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const updateLink = useStore((state) => state.updateLink);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditData({ ...item.data });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateLink(item.id, { data: editData });
    setIsEditing(false);
  };

  const handlePollVote = (optionId: string) => {
    const newOptions = item.data.options?.map((opt: PollOption) => ({
      ...opt,
      votes: opt.id === optionId ? opt.votes + 1 : opt.votes
    }));
    updateLink(item.id, { data: { ...item.data, options: newOptions } });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({});
  };

  const getIcon = () => {
    switch (item.type) {
      case 'product': return <ShoppingBag className="w-5 h-5" />;
      case 'form': return <FileText className="w-5 h-5" />;
      case 'folder': return <Folder className="w-5 h-5" />;
      case 'image': return <ImageIcon className="w-5 h-5" />;
      case 'podcast': return <Music2 className="w-5 h-5" />;
      case 'social': return <Share2 className="w-5 h-5" />;
      case 'poll': return <BarChart className="w-5 h-5" />;
      default: return <LinkIcon className="w-5 h-5" />;
    }
  };

  const buttonClasses = clsx(
    'w-full mb-4 overflow-hidden shadow-sm hover:shadow-md relative group',
    'bg-white transition-all duration-200',
    {
      'rounded-lg': theme.buttonStyle === 'rounded',
      'rounded-full': theme.buttonStyle === 'pill',
      'rounded-none': theme.buttonStyle === 'square'
    }
  );

  const renderFormFields = (fields: FormField[]) => (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          
          {field.type === 'textarea' ? (
            <textarea
              required={field.required}
              value={formData[field.id] || ''}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={3}
            />
          ) : field.type === 'select' ? (
            <select
              required={field.required}
              value={formData[field.id] || ''}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : field.type === 'radio' ? (
            <div className="space-y-2">
              {field.options?.map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name={field.id}
                    value={option}
                    required={field.required}
                    checked={formData[field.id] === option}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    className="rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          ) : field.type === 'checkbox' ? (
            <label className="flex items-center">
              <input
                type="checkbox"
                required={field.required}
                checked={formData[field.id] || false}
                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.checked })}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">{field.label}</span>
            </label>
          ) : (
            <input
              type={field.type}
              required={field.required}
              value={formData[field.id] || ''}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          )}
        </div>
      ))}
      
      <button
        type="submit"
        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
      >
        Submit
      </button>
    </form>
  );

  const renderPoll = () => {
    const totalVotes = item.data.options?.reduce((sum: number, opt: PollOption) => sum + opt.votes, 0) || 0;
    const isExpired = item.data.endDate && new Date(item.data.endDate) < new Date();

    return (
      <div className="space-y-4">
        <h3 className="font-medium text-lg">{item.data.question}</h3>
        
        {isExpired && (
          <div className="text-sm text-red-600">
            This poll has ended
          </div>
        )}
        
        <div className="space-y-2">
          {item.data.options?.map((option: PollOption) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            
            return (
              <div key={option.id} className="space-y-1">
                <button
                  onClick={() => !isExpired && handlePollVote(option.id)}
                  disabled={isExpired}
                  className={clsx(
                    'w-full text-left p-3 rounded-md relative overflow-hidden transition-colors',
                    isExpired ? 'cursor-default' : 'hover:bg-gray-50'
                  )}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-indigo-50 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="relative flex justify-between">
                    <span>{option.text}</span>
                    <span className="text-gray-500">{percentage.toFixed(1)}%</span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="text-sm text-gray-500">
          Total votes: {totalVotes}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <form onSubmit={handleSave} className="p-6 space-y-4" onClick={e => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={editData.title}
              onChange={e => setEditData({ ...editData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          {item.type !== 'image' && item.type !== 'form' && item.type !== 'poll' && (
            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <input
                type="url"
                value={editData.url}
                onChange={e => setEditData({ ...editData, url: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={editData.description || ''}
              onChange={e => setEditData({ ...editData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              rows={2}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      );
    }

    switch (item.type) {
      case 'form':
        return (
          <div className="p-6">
            {item.data.description && (
              <p className="text-sm text-gray-600 mb-4">{item.data.description}</p>
            )}
            {renderFormFields(item.data.formFields || [])}
          </div>
        );

      case 'poll':
        return (
          <div className="p-6">
            {item.data.description && (
              <p className="text-sm text-gray-600 mb-4">{item.data.description}</p>
            )}
            {renderPoll()}
          </div>
        );

      case 'image':
        return (
          <div className="relative aspect-video">
            <img
              src={item.data.url}
              alt={item.data.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
          </div>
        );

      case 'video':
        return (
          <VideoPreview
            url={item.data.url || ''}
            thumbnail={item.data.thumbnail}
            title={item.data.title}
            duration={item.data.duration}
          />
        );

      case 'podcast':
        return (
          <div className="p-6 bg-white">
            <div className="flex items-center gap-4">
              {item.data.thumbnail ? (
                <img
                  src={item.data.thumbnail}
                  alt={item.data.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Music2 className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-lg truncate">
                  {item.data.title}
                </h3>
                {item.data.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {item.data.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPlaying(!isPlaying);
                    }}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 translate-x-0.5" />
                    )}
                  </button>
                  {item.data.duration && (
                    <span className="text-sm text-gray-500">
                      {item.data.duration}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'folder':
        return (
          <div className="p-6">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsFolderExpanded(!isFolderExpanded);
              }}
              className="w-full flex items-center gap-3"
            >
              <Folder className={clsx(
                "w-6 h-6 transition-colors",
                isFolderExpanded ? "text-indigo-500" : "text-gray-400"
              )} />
              <span className="flex-1 text-left font-medium text-lg">{item.data.title}</span>
              {isFolderExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            {isFolderExpanded && item.data.links && (
              <div className="mt-4 pl-9 space-y-3">
                {item.data.links.map((link: any) => (
                  <a
                    key={link.id}
                    href={link.url}
                    className="block text-gray-600 hover:text-gray-900"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="p-6 flex items-center gap-4">
            {getIcon()}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-lg truncate">{item.data.title}</h3>
              {item.data.description && (
                <p className="text-sm opacity-75 mt-1 line-clamp-2">{item.data.description}</p>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={buttonClasses}>
      {renderContent()}
      
      <button
        onClick={handleEdit}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/90 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm hover:bg-white"
      >
        <Edit2 className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};