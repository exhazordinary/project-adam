import { useEffect, useState } from 'react';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, CheckSquare, Circle, CheckCircle2, X, AlertCircle } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'MEDIUM',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getAll();
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await taskAPI.create(formData);
      toast.success('Task created! ✓');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        deadline: '',
        priority: 'MEDIUM',
      });
      fetchTasks();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      await taskAPI.update(taskId, { status });
      toast.success(status === 'COMPLETED' ? 'Task completed! 🎉' : 'Task updated');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const getPriorityConfig = (priority: string) => {
    const configs: any = {
      URGENT: {
        color: 'bg-coral/10 text-coral border-coral/20',
        icon: <AlertCircle size={16} />,
      },
      HIGH: {
        color: 'bg-honey/10 text-honey-dark border-honey/20',
        icon: <AlertCircle size={16} />,
      },
      MEDIUM: {
        color: 'bg-sage/10 text-sage-dark border-sage/20',
        icon: <Circle size={16} />,
      },
      LOW: {
        color: 'bg-charcoal/10 text-charcoal border-charcoal/20',
        icon: <Circle size={16} />,
      },
    };
    return configs[priority] || configs.MEDIUM;
  };

  const activeTasks = tasks.filter(t => t.status !== 'COMPLETED');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-sage/20 border-t-sage rounded-full animate-spin"></div>
          <div className="mt-4 text-charcoal/60 text-center font-medium">Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-charcoal mb-2">Tasks</h1>
          <p className="text-charcoal/60">
            {activeTasks.length} active • {completedTasks.length} completed
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`${showForm ? 'btn-ghost' : 'btn-primary'} flex items-center gap-2`}
        >
          {showForm ? (
            <>
              <X size={20} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={20} />
              Add Task
            </>
          )}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card mb-8 border-2 border-sage/20">
          <h2 className="text-2xl font-display font-bold text-charcoal mb-6">Create New Task</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Task Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                placeholder="e.g., Complete assignment"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                rows={3}
                placeholder="Add details about this task..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="input"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-6">
              Create Task
            </button>
          </form>
        </div>
      )}

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sage/10 flex items-center justify-center">
            <CheckSquare className="text-sage-dark" size={32} />
          </div>
          <h3 className="text-2xl font-display font-bold text-charcoal mb-2">No tasks yet</h3>
          <p className="text-charcoal/60 mb-6">Create your first task to get started</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={20} className="inline mr-2" />
            Add Your First Task
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Tasks */}
          {activeTasks.length > 0 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-charcoal mb-4 flex items-center gap-2">
                <Circle className="text-sage-dark" size={24} />
                Active Tasks
                <span className="text-base font-normal text-charcoal/50">
                  ({activeTasks.length})
                </span>
              </h2>
              <div className="space-y-3">
                {activeTasks.map((task, idx) => {
                  const priorityConfig = getPriorityConfig(task.priority);
                  return (
                    <div
                      key={task.id}
                      className="card group hover:shadow-xl transition-all duration-300"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => updateTaskStatus(task.id, 'COMPLETED')}
                          className="mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 border-sage-dark hover:bg-sage-dark hover:border-sage-dark transition-all group/check"
                        >
                          <CheckCircle2
                            className="text-white opacity-0 group-hover/check:opacity-100 transition-opacity"
                            size={20}
                          />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-display font-bold text-charcoal">
                              {task.title}
                            </h3>
                            <span className={`badge ${priorityConfig.color} flex items-center gap-1`}>
                              {priorityConfig.icon}
                              {task.priority}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-charcoal/70 mb-2">{task.description}</p>
                          )}
                          {task.deadline && (
                            <p className="text-sm text-charcoal/60">
                              Due: {new Date(task.deadline).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-charcoal/60 mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-sage-dark" size={24} />
                Completed
                <span className="text-base font-normal text-charcoal/40">
                  ({completedTasks.length})
                </span>
              </h2>
              <div className="space-y-3">
                {completedTasks.map((task, idx) => {
                  const priorityConfig = getPriorityConfig(task.priority);
                  return (
                    <div
                      key={task.id}
                      className="card opacity-75 hover:opacity-100 transition-opacity"
                      style={{ animationDelay: `${(activeTasks.length + idx) * 0.05}s` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-sage-dark flex items-center justify-center">
                          <CheckCircle2 className="text-white" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-display font-semibold text-charcoal/60 line-through">
                              {task.title}
                            </h3>
                            <span className={`badge ${priorityConfig.color} opacity-60`}>
                              {task.priority}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-charcoal/50 text-sm">{task.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
