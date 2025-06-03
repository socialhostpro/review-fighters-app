import React, { useEffect, useState, useCallback, FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { staffService } from '../../services/staffService'; // Reusing staffService for ticket interactions
import { emailService } from '../../services/emailService'; // Import email service
import { SupportTicket, TicketComment, StaffMember, SupportTicketStatus, Priority, SubmittedByType, UserRole } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import { HelpCircle, PlusCircle, MessageSquare, User as UserLucideIcon, AlertTriangle } from 'lucide-react'; // Renamed User to UserLucideIcon


interface TicketCardProps {
  ticket: SupportTicket;
  onViewDetails: (ticket: SupportTicket) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onViewDetails }) => {
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
      <p className="text-xs text-textSecondary">Priority: {ticket.priority}</p>
      <p className="text-xs text-textSecondary">Submitted: {new Date(ticket.creationDate).toLocaleString()}</p>
      <p className="text-sm text-textPrimary mt-2 line-clamp-2">{ticket.description}</p>
    </div>
  );
};

const UserSupportTicketsPage: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  const [newTicketData, setNewTicketData] = useState<Partial<Omit<SupportTicket, 'ticketID' | 'creationDate' | 'lastUpdateDate' | 'submittedByType' | 'submittedById'>>>({
    subject: '', description: '', priority: 'Medium', category: 'General Inquiry'
  });
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]); // For displaying staff names in comments


  const fetchTickets = useCallback(async () => {
    if (!user) {
      setError("User not authenticated.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedTickets, fetchedStaff] = await Promise.all([
        staffService.getSupportTicketsForUser(user.id),
        staffService.getAllStaffMembers() // To map staffId to names in comments
      ]);
      setTickets(fetchedTickets);
      setStaffMembers(fetchedStaff);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load support tickets.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleViewDetails = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsTicketModalOpen(true);
    setComments([]); 
    try {
      const fetchedComments = await staffService.getCommentsForTicket(ticket.ticketID);
      setComments(fetchedComments);
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };
  
  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTicket || !user) return;
    setIsSubmittingComment(true);
    try {
      const commentData: Omit<TicketComment, 'commentID' | 'timestamp'> = {
        ticketID_Ref: selectedTicket.ticketID,
        commentText: newComment,
        commentByUserId: user.id, // User is submitting comment
        isInternalNote: false,
      };
      const addedComment = await staffService.addTicketComment(commentData);
      setComments(prev => [...prev, addedComment]);
      setNewComment('');
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
      if(!user) return;
      const dataToSave : Omit<SupportTicket, 'ticketID' | 'creationDate' | 'lastUpdateDate'> = {
          subject: newTicketData.subject || 'No Subject',
          description: newTicketData.description || 'No Description',
          status: 'New', // Default status for user-submitted tickets
          priority: newTicketData.priority || 'Medium',
          submittedByType: user.role === UserRole.AFFILIATE ? 'Affiliate' : 'User', // Set type based on role
          submittedById: user.id,
          category: newTicketData.category,
      };
      try {
          const createdTicket = await staffService.createSupportTicket(dataToSave);
          
          // Send email notification to admin/support team
          if (emailService.isConfigured()) {
            try {
              await emailService.sendSupportTicketNotification(
                user.name || 'Unknown User',
                user.email || 'unknown@email.com',
                dataToSave.subject,
                dataToSave.description,
                'admin@reviewfighters.com' // You could make this configurable
              );
              console.log('Support ticket notification email sent successfully');
            } catch (emailError) {
              console.error('Failed to send support ticket notification email:', emailError);
              // Don't fail the ticket creation if email fails
            }
          }
          
          fetchTickets();
          setIsCreateModalOpen(false);
          setNewTicketData({subject: '', description: '', priority: 'Medium', category: 'General Inquiry'});
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
          <h1 className="text-3xl font-bold text-textPrimary">My Support Tickets</h1>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} leftIcon={<PlusCircle size={18}/>}>
          Create New Ticket
        </Button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 flex items-center"><AlertTriangle size={18} className="mr-2"/>{error}</div>}
      
      {isLoading && tickets.length > 0 && <div className="my-4"><LoadingSpinner/></div>}

      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <TicketCard key={ticket.ticketID} ticket={ticket} onViewDetails={handleViewDetails}/>
          ))}
        </div>
      ) : (
        !isLoading && <p className="text-center text-textSecondary py-10">You have not submitted any support tickets yet.</p>
      )}

      {/* Ticket Details Modal */}
      <Modal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} title={`Ticket: ${selectedTicket?.subject}`} size="lg">
        {selectedTicket && (
          <div className="space-y-4">
            <div>
                <p><span className="font-semibold">Status:</span> {selectedTicket.status}</p>
                <p><span className="font-semibold">Priority:</span> {selectedTicket.priority}</p>
                <p><span className="font-semibold">Category:</span> {selectedTicket.category || 'N/A'}</p>
                <p className="mt-2"><span className="font-semibold">Description:</span></p>
                <p className="whitespace-pre-wrap p-2 bg-gray-50 border rounded text-sm">{selectedTicket.description}</p>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2 text-textPrimary">Comments ({comments.length})</h4>
              <div className="max-h-60 overflow-y-auto space-y-2 mb-3 pr-2">
                {comments.map(comment => {
                  let commenterName = 'Support Team';
                  if (comment.commentByUserId === user?.id) commenterName = user.name || 'You';
                  else if (comment.commentByStaffId) {
                      const staff = staffMembers.find(s => s.staffId === comment.commentByStaffId);
                      commenterName = staff ? staff.name : 'Support Staff';
                  } else if (comment.commentByAffiliateId && comment.commentByAffiliateId === user?.affiliateId) {
                      commenterName = user.name || 'You (Affiliate)';
                  } else if (comment.commentByAffiliateId) {
                      commenterName = `Affiliate (${comment.commentByAffiliateId.substring(0,8)}...)`;
                  }

                  return (
                    <div key={comment.commentID} className={`p-2 rounded-md text-sm ${comment.commentByUserId === user?.id || (comment.commentByAffiliateId === user?.affiliateId) ? 'bg-blue-50 ml-auto max-w-[80%]' : 'bg-gray-100 mr-auto max-w-[80%]'}`}>
                      <p className="whitespace-pre-wrap">{comment.commentText}</p>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        By: {commenterName} on {new Date(comment.timestamp).toLocaleString()}
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
                  placeholder="Add your reply..."
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
            <Textarea label="Please describe your issue" name="description" value={newTicketData.description || ''} onChange={handleNewTicketInputChange} required rows={5}/>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="create-priority" className="block text-sm font-medium text-textPrimary mb-1">Priority</label>
                    <select name="priority" id="create-priority" value={newTicketData.priority || 'Medium'} onChange={handleNewTicketInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                         {(['Low', 'Medium', 'High'] as Priority[]).filter(p=>p !== 'Urgent').map(p => <option key={p} value={p}>{p}</option>)} {/* User might not set Urgent */}
                    </select>
                </div>
                <Input label="Category (e.g., Billing, Technical)" name="category" value={newTicketData.category || ''} onChange={handleNewTicketInputChange} />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Submit Ticket</Button>
            </div>
        </form>
       </Modal>

    </div>
  );
};

export default UserSupportTicketsPage;