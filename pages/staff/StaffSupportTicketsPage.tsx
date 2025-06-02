
import React, { useEffect, useState, useCallback, FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { staffService } from '../../services/staffService';
import { SupportTicket, TicketComment, StaffMember, SupportTicketStatus, Priority, SubmittedByType } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import { HelpCircle, PlusCircle, MessageSquare, User, AlertTriangle, Edit3 } from 'lucide-react';

interface TicketCardProps {
  ticket: SupportTicket;
  onViewDetails: (ticket: SupportTicket) => void;
  staffMembers: StaffMember[];
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onViewDetails, staffMembers }) => {
  const assignedStaff = staffMembers.find(sm => sm.staffId === ticket.assignedToStaffId);
  const statusColor = {
    New: 'bg-blue-100 text-blue-700',
    Open: 'bg-yellow-100 text-yellow-700',
    'In Progress': 'bg-indigo-100 text-indigo-700',
    'Pending Customer': 'bg-purple-100 text-purple-700',
    Resolved: 'bg-green-100 text-green-700',
    Closed: 'bg-gray-100 text-gray-700',
  };
  return (
    <div className="bg-surface p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => onViewDetails(ticket)}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-md font-semibold text-textPrimary truncate" title={ticket.subject}>{ticket.subject}</h3>
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColor[ticket.status] || 'bg-gray-200'}`}>
          {ticket.status}
        </span>
      </div>
      <p className="text-xs text-textSecondary">ID: {ticket.ticketID}</p>
      <p className="text-xs text-textSecondary">Priority: {ticket.priority} | Category: {ticket.category || 'N/A'}</p>
      <p className="text-xs text-textSecondary">Submitted: {new Date(ticket.creationDate).toLocaleString()} by {ticket.submittedByType}</p>
      {assignedStaff && <p className="text-xs text-textSecondary mt-1">Assigned To: {assignedStaff.name}</p>}
      <p className="text-sm text-textPrimary mt-2 line-clamp-2">{ticket.description}</p>
    </div>
  );
};

const StaffSupportTicketsPage: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  const [newTicketData, setNewTicketData] = useState<Partial<Omit<SupportTicket, 'ticketID' | 'creationDate' | 'lastUpdateDate'>>>({
    subject: '', description: '', status: 'New', priority: 'Medium', submittedByType: 'Staff'
  });


  const fetchTicketsAndStaff = useCallback(async () => {
    if (!user || !user.staffId) {
      setError("User not identified as staff.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // const fetchedTickets = await staffService.getSupportTicketsForStaff(user.staffId); // Or getAllSupportTickets for admins
      const [fetchedTickets, fetchedStaff] = await Promise.all([
        staffService.getAllSupportTickets(),
        staffService.getAllStaffMembers()
      ]);
      setTickets(fetchedTickets);
      setStaffMembers(fetchedStaff);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load support tickets or staff.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTicketsAndStaff();
  }, [fetchTicketsAndStaff]);

  const handleViewDetails = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsTicketModalOpen(true);
    setComments([]); // Clear old comments
    try {
      const fetchedComments = await staffService.getCommentsForTicket(ticket.ticketID);
      setComments(fetchedComments);
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };
  
  const handleTicketUpdate = async (updateData: Partial<SupportTicket>) => {
      if(!selectedTicket) return;
      try {
          const updatedTicket = await staffService.updateSupportTicket(selectedTicket.ticketID, updateData);
          setSelectedTicket(updatedTicket); // Update selected ticket in modal
          fetchTicketsAndStaff(); // Refresh main list
      } catch (err) {
          alert("Failed to update ticket: " + (err instanceof Error ? err.message : String(err)));
      }
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTicket || !user || !user.staffId) return;
    setIsSubmittingComment(true);
    try {
      const commentData: Omit<TicketComment, 'commentID' | 'timestamp'> = {
        ticketID_Ref: selectedTicket.ticketID,
        commentText: newComment,
        commentByStaffId: user.staffId, // Assuming staff is commenting
        isInternalNote: false, // Add UI for this if needed
      };
      const addedComment = await staffService.addTicketComment(commentData);
      setComments(prev => [...prev, addedComment]);
      setNewComment('');
      // Optionally update ticket's last update date if service doesn't handle it implicitly
      const updatedTicket = await staffService.getSupportTicketById(selectedTicket.ticketID);
      if (updatedTicket) setSelectedTicket(updatedTicket);

    } catch (err) {
      alert("Failed to add comment: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  const handleCreateNewTicket = async (e: FormEvent) => {
      e.preventDefault();
      if(!user || !user.staffId) return;
      const dataToSave : Omit<SupportTicket, 'ticketID' | 'creationDate' | 'lastUpdateDate'> = {
          subject: newTicketData.subject || 'No Subject',
          description: newTicketData.description || 'No Description',
          status: newTicketData.status || 'New',
          priority: newTicketData.priority || 'Medium',
          submittedByType: 'Staff',
          submittedById: user.staffId,
          assignedToStaffId: newTicketData.assignedToStaffId,
          category: newTicketData.category,
      };
      try {
          await staffService.createSupportTicket(dataToSave);
          fetchTicketsAndStaff();
          setIsCreateModalOpen(false);
          setNewTicketData({subject: '', description: '', status: 'New', priority: 'Medium'});
      } catch (err) {
          alert("Failed to create ticket: " + (err instanceof Error ? err.message : String(err)));
      }
  };
  
  const handleNewTicketInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTicketData(prev => ({ ...prev, [name]: value }));
  };


  if (isLoading && tickets.length === 0) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <HelpCircle size={32} className="text-primary mr-3"/>
          <h1 className="text-3xl font-bold text-textPrimary">Support Tickets</h1>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} leftIcon={<PlusCircle size={18}/>}>
          Create New Ticket
        </Button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 flex items-center"><AlertTriangle size={18} className="mr-2"/>{error}</div>}
      
      {/* Add Filters here if needed */}

      {isLoading && tickets.length > 0 && <div className="my-4"><LoadingSpinner/></div>}

      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <TicketCard key={ticket.ticketID} ticket={ticket} onViewDetails={handleViewDetails} staffMembers={staffMembers}/>
          ))}
        </div>
      ) : (
        !isLoading && <p className="text-center text-textSecondary py-10">No support tickets found.</p>
      )}

      {/* Ticket Details Modal */}
      <Modal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} title={`Ticket: ${selectedTicket?.subject}`} size="lg">
        {selectedTicket && (
          <div className="space-y-4">
            <div>
                <p><span className="font-semibold">Status:</span> 
                    <select value={selectedTicket.status} onChange={(e) => handleTicketUpdate({status: e.target.value as SupportTicketStatus})} className="ml-2 p-1 border rounded text-sm">
                        {(['New', 'Open', 'In Progress', 'Pending Customer', 'Resolved', 'Closed'] as SupportTicketStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </p>
                <p><span className="font-semibold">Priority:</span>
                     <select value={selectedTicket.priority} onChange={(e) => handleTicketUpdate({priority: e.target.value as Priority})} className="ml-2 p-1 border rounded text-sm">
                        {(['Low', 'Medium', 'High', 'Critical'] as Priority[]).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </p>
                <p><span className="font-semibold">Assigned To:</span>
                    <select value={selectedTicket.assignedToStaffId || ''} onChange={(e) => handleTicketUpdate({assignedToStaffId: e.target.value || undefined})} className="ml-2 p-1 border rounded text-sm">
                        <option value="">Unassigned</option>
                        {staffMembers.map(sm => <option key={sm.staffId} value={sm.staffId}>{sm.name}</option>)}
                    </select>
                </p>
                <p><span className="font-semibold">Category:</span> {selectedTicket.category || 'N/A'}</p>
                <p className="mt-2"><span className="font-semibold">Description:</span></p>
                <p className="whitespace-pre-wrap p-2 bg-gray-50 border rounded text-sm">{selectedTicket.description}</p>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2 text-textPrimary">Comments ({comments.length})</h4>
              <div className="max-h-60 overflow-y-auto space-y-2 mb-3 pr-2">
                {comments.map(comment => {
                  const commenter = staffMembers.find(sm => sm.staffId === comment.commentByStaffId) || 
                                    (comment.commentByAffiliateId ? {name: `Affiliate (${comment.commentByAffiliateId.substring(0,8)}...)`} : {name: 'System/Unknown'});
                  return (
                    <div key={comment.commentID} className={`p-2 rounded-md text-sm ${comment.commentByStaffId === user?.staffId ? 'bg-blue-50 ml-auto max-w-[80%]' : 'bg-gray-100 mr-auto max-w-[80%]'}`}>
                      <p className="whitespace-pre-wrap">{comment.commentText}</p>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        By: {commenter.name} on {new Date(comment.timestamp).toLocaleString()}
                        {comment.isInternalNote && <span className="ml-2 font-semibold text-purple-600">(Internal)</span>}
                      </p>
                    </div>
                  );
                })}
                 {comments.length === 0 && <p className="text-sm text-gray-500">No comments yet.</p>}
              </div>
              <form onSubmit={handleAddComment} className="flex gap-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  containerClassName="flex-grow !mb-0"
                />
                <Button type="submit" variant="primary" isLoading={isSubmittingComment} disabled={isSubmittingComment || !newComment.trim()}>
                  Send
                </Button>
              </form>
            </div>
            <div className="flex justify-end pt-3">
                 <Button variant="outline" onClick={() => setIsTicketModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Create New Ticket Modal */}
       <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Support Ticket" size="lg">
        <form onSubmit={handleCreateNewTicket} className="space-y-4">
            <Input label="Subject" name="subject" value={newTicketData.subject || ''} onChange={handleNewTicketInputChange} required />
            <Textarea label="Description" name="description" value={newTicketData.description || ''} onChange={handleNewTicketInputChange} required />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="create-status" className="block text-sm font-medium text-textPrimary mb-1">Status</label>
                    <select name="status" id="create-status" value={newTicketData.status || 'New'} onChange={handleNewTicketInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                        {(['New', 'Open', 'In Progress', 'Pending Customer', 'Resolved', 'Closed'] as SupportTicketStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="create-priority" className="block text-sm font-medium text-textPrimary mb-1">Priority</label>
                    <select name="priority" id="create-priority" value={newTicketData.priority || 'Medium'} onChange={handleNewTicketInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                         {(['Low', 'Medium', 'High', 'Critical'] as Priority[]).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>
            <Input label="Category (Optional)" name="category" value={newTicketData.category || ''} onChange={handleNewTicketInputChange} />
             <div>
                <label htmlFor="create-assignedToStaffId" className="block text-sm font-medium text-textPrimary mb-1">Assign To (Optional)</label>
                <select name="assignedToStaffId" id="create-assignedToStaffId" value={newTicketData.assignedToStaffId || ''} onChange={handleNewTicketInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                    <option value="">Unassigned</option>
                    {staffMembers.map(sm => <option key={sm.staffId} value={sm.staffId}>{sm.name}</option>)}
                </select>
            </div>
            {/* For Submitted By: If staff creates, it's 'Staff' and their ID. If for an affiliate, need UI to select affiliate */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Create Ticket</Button>
            </div>
        </form>
       </Modal>

    </div>
  );
};

export default StaffSupportTicketsPage;
