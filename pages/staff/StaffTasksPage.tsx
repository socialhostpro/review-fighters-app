
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { staffService } from '../../services/staffService';
import { Task, StaffMember, Priority, TaskStatus } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import { PlusCircle, Edit3, Filter, AlertTriangle, ListChecks } from 'lucide-react';

const TaskCard: React.FC<{ task: Task; onEdit: (task: Task) => void; onStatusChange: (taskId: string, status: TaskStatus) => void; staffMembers: StaffMember[] }> = 
  ({ task, onEdit, onStatusChange, staffMembers }) => {
  
  const assignedStaff = staffMembers.find(sm => sm.staffId === task.assignedToStaffId);
  const priorityColor = {
    Urgent: 'border-red-500 bg-red-50',
    High: 'border-orange-500 bg-orange-50',
    Medium: 'border-yellow-500 bg-yellow-50',
    Low: 'border-blue-500 bg-blue-50',
  };

  return (
    <div className={`bg-surface p-4 rounded-lg shadow-md border-l-4 ${priorityColor[task.priority] || 'border-gray-300'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-md font-semibold text-textPrimary">{task.title}</h3>
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
          task.status === 'Completed' ? 'bg-green-100 text-green-700' : 
          task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
          task.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-700' :
          'bg-gray-100 text-gray-700'
        }`}>{task.status}</span>
      </div>
      <p className="text-xs text-textSecondary mb-1">Priority: {task.priority}</p>
      {task.dueDate && <p className="text-xs text-textSecondary mb-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
      {assignedStaff && <p className="text-xs text-textSecondary mb-3">Assigned To: {assignedStaff.name}</p>}
      <p className="text-sm text-textPrimary mb-3 whitespace-pre-wrap">{task.description.substring(0,150)}{task.description.length > 150 ? '...' : ''}</p>
      
      <div className="flex justify-between items-center pt-2 border-t">
         <select 
            value={task.status}
            onChange={(e) => onStatusChange(task.taskID, e.target.value as TaskStatus)}
            className="text-xs p-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        >
            {(['To Do', 'In Progress', 'Blocked', 'Pending Review', 'Completed'] as TaskStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <Button variant="ghost" size="sm" onClick={() => onEdit(task)}><Edit3 size={16} /></Button>
      </div>
    </div>
  );
};


const StaffTasksPage: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]); // For assigning tasks
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('');
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('');


  const fetchTasksAndStaff = useCallback(async () => {
    if (!user || !user.staffId) {
      setError("User not identified as staff.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedTasks, fetchedStaff] = await Promise.all([
        // staffService.getTasksForStaff(user.staffId), // For staff viewing their own tasks
        staffService.getAllTasks(), // For now, let's show all tasks for demo, or filter by role later
        staffService.getAllStaffMembers() // For assigning tasks in modal
      ]);
      setTasks(fetchedTasks);
      setStaffMembers(fetchedStaff);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks or staff members.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasksAndStaff();
  }, [fetchTasksAndStaff]);

  const handleOpenModal = (task?: Task) => {
    setEditingTask(task ? { ...task } : { title: '', description: '', status: 'To Do', priority: 'Medium', assignedToStaffId: user?.staffId });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingTask(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !user) return;
    setIsSaving(true);
    try {
      const taskData = { ...editingTask, createdByStaffId: editingTask.createdByStaffId || user.staffId };
      if (editingTask.taskID) {
        await staffService.updateTask(editingTask.taskID, taskData);
      } else {
        await staffService.createTask(taskData as Omit<Task, 'taskID' | 'createdDate'>);
      }
      await fetchTasksAndStaff();
      handleCloseModal();
    } catch (err) {
      alert(`Error saving task: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleTaskStatusChange = async (taskId: string, newStatus: TaskStatus) => {
      try {
          await staffService.updateTask(taskId, { status: newStatus });
          fetchTasksAndStaff(); // Refresh list
      } catch(err) {
          alert(`Error updating task status: ${err instanceof Error ? err.message : String(err)}`);
      }
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch = !filterStatus || task.status === filterStatus;
    const priorityMatch = !filterPriority || task.priority === filterPriority;
    return statusMatch && priorityMatch;
  }).sort((a,b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());


  if (isLoading && tasks.length === 0) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
            <ListChecks size={32} className="text-primary mr-3"/>
            <h1 className="text-3xl font-bold text-textPrimary">Manage Tasks</h1>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<PlusCircle size={18}/>}>
          Create New Task
        </Button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 flex items-center"><AlertTriangle size={18} className="mr-2"/> {error}</div>}

      <div className="bg-surface p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <Filter size={20} className="text-textSecondary"/>
        <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as TaskStatus | '')}
            className="p-2 border border-gray-300 rounded-md sm:text-sm focus:ring-primary focus:border-primary flex-grow sm:flex-grow-0"
        >
            <option value="">All Statuses</option>
            {(['To Do', 'In Progress', 'Blocked', 'Pending Review', 'Completed'] as TaskStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value as Priority | '')}
            className="p-2 border border-gray-300 rounded-md sm:text-sm focus:ring-primary focus:border-primary flex-grow sm:flex-grow-0"
        >
            <option value="">All Priorities</option>
            {(['Low', 'Medium', 'High', 'Urgent'] as Priority[]).map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      
      {isLoading && tasks.length > 0 && <div className="my-4"><LoadingSpinner/></div>}

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard key={task.taskID} task={task} onEdit={handleOpenModal} onStatusChange={handleTaskStatusChange} staffMembers={staffMembers} />
          ))}
        </div>
      ) : (
        !isLoading && <p className="text-center text-textSecondary py-10">No tasks found matching your criteria.</p>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTask?.taskID ? 'Edit Task' : 'Create New Task'} size="lg">
        {editingTask && (
          <form onSubmit={handleSaveChanges} className="space-y-4">
            <Input label="Title" name="title" value={editingTask.title || ''} onChange={handleInputChange} required />
            <Textarea label="Description" name="description" value={editingTask.description || ''} onChange={handleInputChange} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-textPrimary mb-1">Status</label>
                    <select name="status" id="status" value={editingTask.status || 'To Do'} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                        {(['To Do', 'In Progress', 'Blocked', 'Pending Review', 'Completed'] as TaskStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-textPrimary mb-1">Priority</label>
                    <select name="priority" id="priority" value={editingTask.priority || 'Medium'} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                         {(['Low', 'Medium', 'High', 'Urgent'] as Priority[]).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="assignedToStaffId" className="block text-sm font-medium text-textPrimary mb-1">Assign To</label>
                <select name="assignedToStaffId" id="assignedToStaffId" value={editingTask.assignedToStaffId || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                    <option value="">Unassigned</option>
                    {staffMembers.map(sm => <option key={sm.staffId} value={sm.staffId}>{sm.name}</option>)}
                </select>
            </div>
            <Input label="Due Date (Optional)" name="dueDate" type="date" value={editingTask.dueDate ? editingTask.dueDate.split('T')[0] : ''} onChange={handleInputChange} />
            {/* TODO: Add Related Item Type and ID inputs if needed */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseModal} disabled={isSaving}>Cancel</Button>
              <Button type="submit" variant="primary" isLoading={isSaving}>
                {editingTask.taskID ? 'Save Changes' : 'Create Task'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default StaffTasksPage;
