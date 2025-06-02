
import React, { useEffect, useState, useCallback, ChangeEvent } from 'react';
import { marketingService } from '../../services/marketingService';
import { MarketingMedia } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import { AlertTriangle, PlusCircle, Edit3, Trash2, ToggleLeft, ToggleRight, Eye } from 'lucide-react';

const AdminMarketingMediaPage: React.FC = () => {
  const [mediaAssets, setMediaAssets] = useState<MarketingMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Partial<MarketingMedia> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchMediaAssets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await marketingService.getAllMarketingMedia();
      setMediaAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load marketing media.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMediaAssets();
  }, [fetchMediaAssets]);

  const handleOpenModal = (media?: MarketingMedia) => {
    setEditingMedia(media ? { ...media } : { title: '', type: 'Banner', assetURL_Or_Content: '', isActive: true, targetAudience: [] });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMedia(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === "targetAudience") {
        // Basic handling for comma-separated string to array
        setEditingMedia(prev => prev ? { ...prev, [name]: value.split(',').map(s => s.trim()).filter(s => s) } : null);
    } else {
        setEditingMedia(prev => prev ? { ...prev, [name]: type === 'checkbox' ? checked : value } : null);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia) return;
    setIsSaving(true);
    try {
      const dataToSave = { ...editingMedia };
      // Ensure type is correctly set for the MarketingMedia type
      if (!dataToSave.type || !['Banner', 'Text Link', 'Email Template', 'Video'].includes(dataToSave.type)) {
          throw new Error("Invalid media type selected.");
      }
      dataToSave.type = dataToSave.type as MarketingMedia['type'];


      if (editingMedia.mediaID) {
        const { mediaID, ...updateData } = dataToSave;
        await marketingService.updateMarketingMedia(mediaID, updateData);
      } else {
        await marketingService.addMarketingMedia(dataToSave as Omit<MarketingMedia, 'mediaID'>);
      }
      await fetchMediaAssets();
      handleCloseModal();
    } catch (err) {
      alert(`Error saving media: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!window.confirm('Are you sure you want to delete this marketing asset?')) return;
    try {
      await marketingService.deleteMarketingMedia(mediaId);
      fetchMediaAssets();
    } catch (err) {
      alert(`Error deleting media: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  const toggleMediaStatus = async (media: MarketingMedia) => {
    try {
      await marketingService.updateMarketingMedia(media.mediaID, { isActive: !media.isActive });
      fetchMediaAssets();
    } catch (err) {
      alert(`Error updating status: ${err instanceof Error ? err.message : String(err)}`);
    }
  };


  if (isLoading && mediaAssets.length === 0) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-700">Error Loading Marketing Media</h2>
        <p className="text-textSecondary">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-textPrimary">Manage Marketing Media</h1>
        <Button onClick={() => handleOpenModal()} leftIcon={<PlusCircle size={18}/>}>
          Add New Media Asset
        </Button>
      </div>

      {mediaAssets.length === 0 && !isLoading ? (
        <p className="text-center text-textSecondary py-10">No marketing media assets found.</p>
      ) : (
        <div className="bg-surface shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mediaAssets.map((media) => (
                <tr key={media.mediaID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-textPrimary">{media.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{media.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      media.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {media.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(media)} title="Edit Media">
                        <Edit3 size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => toggleMediaStatus(media)} title={media.isActive ? "Deactivate" : "Activate"}>
                        {media.isActive ? <ToggleRight size={18} className="text-green-600"/> : <ToggleLeft size={18} className="text-red-600"/>}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteMedia(media.mediaID)} className="text-red-600 hover:text-red-800" title="Delete Media">
                        <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingMedia?.mediaID ? 'Edit Media Asset' : 'Add New Media Asset'} size="lg">
        {editingMedia && (
            <form onSubmit={handleSaveChanges} className="space-y-4">
                <Input label="Title" name="title" value={editingMedia.title || ''} onChange={handleInputChange} required />
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-textPrimary mb-1">Type</label>
                    <select 
                        name="type" 
                        id="type"
                        value={editingMedia.type || 'Banner'} 
                        onChange={handleInputChange}
                        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                        <option value="Banner">Banner</option>
                        <option value="Text Link">Text Link</option>
                        <option value="Email Template">Email Template</option>
                        <option value="Video">Video</option>
                    </select>
                </div>
                <Textarea label="Asset URL or Content" name="assetURL_Or_Content" value={editingMedia.assetURL_Or_Content || ''} onChange={handleInputChange} required rows={3}/>
                <Input label="Dimensions (e.g., 300x250, optional)" name="dimensions" value={editingMedia.dimensions || ''} onChange={handleInputChange} />
                <Input label="Target Audience (comma-separated, optional)" name="targetAudience" value={(editingMedia.targetAudience || []).join(', ')} onChange={handleInputChange} />
                
                <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        name="isActive" 
                        id="isActive"
                        checked={editingMedia.isActive || false} 
                        onChange={handleInputChange} 
                        className="h-4 w-4 text-primary focus:ring-primary-light border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-textPrimary">Is Active?</label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={handleCloseModal} disabled={isSaving}>Cancel</Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>
                        {editingMedia.mediaID ? 'Save Changes' : 'Create Media Asset'}
                    </Button>
                </div>
            </form>
        )}
      </Modal>

    </div>
  );
};

export default AdminMarketingMediaPage;
