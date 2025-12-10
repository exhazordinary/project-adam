import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/api';
import { Id } from '@convex/dataModel';
import toast from 'react-hot-toast';
import { Plus, CheckSquare, Circle, X, AlertCircle, Clock, Trash2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Tasks = () => {
  const tasksData = useQuery(api.tasks.list, {});
  const tasks = tasksData ?? [];
  const loading = tasksData === undefined;

  const createTask = useMutation(api.tasks.create);
  const updateTaskStatusMutation = useMutation(api.tasks.updateStatus);
  const deleteTaskMutation = useMutation(api.tasks.remove);

  const [showForm, setShowForm] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'MEDIUM',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask({
        title: formData.title,
        description: formData.description || undefined,
        deadline: formData.deadline ? new Date(formData.deadline).getTime() : undefined,
        priority: formData.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      });
      toast.success('Task created!');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0A5F5F', '#D67B5C'],
      });
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        deadline: '',
        priority: 'MEDIUM',
      });
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const updateTaskStatus = async (taskId: Id<"tasks">, status: string) => {
    try {
      await updateTaskStatusMutation({
        id: taskId,
        status: status as "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED",
      });
      if (status === 'COMPLETED') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0A5F5F', '#D67B5C', '#6B5B8D'],
        });
        toast.success('🎉 Task completed!');
      } else {
        toast.success('Task updated');
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (taskId: Id<"tasks">) => {
    try {
      await deleteTaskMutation({ id: taskId });
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const getPriorityConfig = (priority: string) => {
    const configs: any = {
      URGENT: {
        color: 'bg-terracotta/10 text-terracotta border-terracotta/30',
        gradient: 'from-terracotta/20 to-warm-terracotta/20',
        icon: <AlertCircle size={16} />,
      },
      HIGH: {
        color: 'bg-warm-terracotta/10 text-terracotta-600 border-warm-terracotta/30',
        gradient: 'from-warm-terracotta/20 to-terracotta/20',
        icon: <AlertCircle size={16} />,
      },
      MEDIUM: {
        color: 'bg-deep-teal/10 text-deep-teal border-deep-teal/30',
        gradient: 'from-deep-teal/20 to-soft-teal/20',
        icon: <Circle size={16} />,
      },
      LOW: {
        color: 'bg-charcoal/10 text-charcoal border-charcoal/20',
        gradient: 'from-charcoal/10 to-charcoal/5',
        icon: <Circle size={16} />,
      },
    };
    return configs[priority] || configs.MEDIUM;
  };

  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const task = tasks.find(t => t._id === active.id);
    if (!task) {
      setActiveId(null);
      return;
    }

    // Get the column from the over id
    let newStatus = task.status;
    if (over.id === 'TODO' || over.id.startsWith('task-TODO-')) {
      newStatus = 'TODO';
    } else if (over.id === 'IN_PROGRESS' || over.id.startsWith('task-IN_PROGRESS-')) {
      newStatus = 'IN_PROGRESS';
    } else if (over.id === 'COMPLETED' || over.id.startsWith('task-COMPLETED-')) {
      newStatus = 'COMPLETED';
    }

    if (newStatus !== task.status) {
      updateTaskStatus(task._id, newStatus);
    }

    setActiveId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="relative w-32 h-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-deep-teal/20 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border-4 border-transparent border-t-deep-teal border-r-terracotta rounded-full"
            />
          </div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-8 text-center text-charcoal/70 font-display text-xl font-semibold"
          >
            Loading tasks...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-10 relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <span className="inline-block text-xs font-accent uppercase tracking-widest text-deep-teal/60 mb-3">
              Task Management
            </span>
            <h1 className="text-6xl lg:text-7xl font-display font-bold text-charcoal mb-3 leading-none">
              Your Tasks
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-deep-teal via-terracotta to-rich-plum rounded-full mb-4"></div>
            <p className="text-lg text-charcoal/60 font-light">
              {todoTasks.length} todo • {inProgressTasks.length} in progress • {completedTasks.length} completed
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className={`${showForm ? 'btn-secondary' : 'btn-primary'} flex items-center gap-3 self-start lg:self-auto`}
          >
            {showForm ? (
              <>
                <X size={20} />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Plus size={20} />
                <span>Create Task</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card shadow-elegant border-2 border-deep-teal/20 overflow-hidden"
          >
            <div className="mb-8">
              <h2 className="text-4xl font-display font-bold text-charcoal mb-2">Create New Task</h2>
              <p className="text-charcoal/60">Add a new task to your workflow</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-accent uppercase tracking-wider text-charcoal/70 mb-3">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="e.g., Complete project proposal"
                />
              </div>

              <div>
                <label className="block text-xs font-accent uppercase tracking-wider text-charcoal/70 mb-3">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input resize-none"
                  rows={4}
                  placeholder="Add details about this task..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-accent uppercase tracking-wider text-charcoal/70 mb-3">
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
                  <label className="block text-xs font-accent uppercase tracking-wider text-charcoal/70 mb-3">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="input cursor-pointer"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="btn-primary w-full">
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kanban Board */}
      {tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center py-20"
        >
          <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-deep-teal/10 to-terracotta/10 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-deep-teal/20 to-terracotta/20 animate-breathe"></div>
            <CheckSquare className="text-deep-teal relative z-10" size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-4xl font-display font-bold text-charcoal mb-3">No tasks yet</h3>
          <p className="text-lg text-charcoal/60 mb-8 max-w-md mx-auto">
            Create your first task to get started with your workflow
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={20} />
            <span>Create Your First Task</span>
          </button>
        </motion.div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <KanbanColumn
              id="TODO"
              title="To Do"
              count={todoTasks.length}
              color="deep-teal"
              tasks={todoTasks}
              getPriorityConfig={getPriorityConfig}
              deleteTask={deleteTask}
            />
            <KanbanColumn
              id="IN_PROGRESS"
              title="In Progress"
              count={inProgressTasks.length}
              color="terracotta"
              tasks={inProgressTasks}
              getPriorityConfig={getPriorityConfig}
              deleteTask={deleteTask}
            />
            <KanbanColumn
              id="COMPLETED"
              title="Completed"
              count={completedTasks.length}
              color="rich-plum"
              tasks={completedTasks}
              getPriorityConfig={getPriorityConfig}
              deleteTask={deleteTask}
            />
          </div>

          <DragOverlay>
            {activeId ? (
              <TaskCard
                task={tasks.find(t => t._id === activeId)}
                getPriorityConfig={getPriorityConfig}
                deleteTask={deleteTask}
                isDragging={true}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

// Kanban Column Component
const KanbanColumn = ({ id, title, count, color, tasks, getPriorityConfig, deleteTask }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: id === 'TODO' ? 0.1 : id === 'IN_PROGRESS' ? 0.2 : 0.3 }}
      className="flex flex-col h-full"
    >
      <div className={`glass rounded-2xl p-4 border-2 border-${color}/20 mb-4`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-display font-bold text-charcoal">{title}</h3>
          <span className={`badge bg-${color}/10 text-${color} border-${color}/30`}>
            {count}
          </span>
        </div>
      </div>

      <SortableContext
        items={tasks.map((t: any) => `task-${id}-${t._id}`)}
        strategy={verticalListSortingStrategy}
      >
        <div
          id={id}
          className="flex-1 space-y-3 glass rounded-3xl p-4 border border-white/20 min-h-[400px]"
        >
          <AnimatePresence>
            {tasks.map((task: any, idx: number) => (
              <SortableTaskCard
                key={task._id}
                id={`task-${id}-${task._id}`}
                task={task}
                index={idx}
                getPriorityConfig={getPriorityConfig}
                deleteTask={deleteTask}
              />
            ))}
          </AnimatePresence>
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-full text-charcoal/30 text-sm">
              Drag tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </motion.div>
  );
};

// Sortable Task Card
const SortableTaskCard = ({ id, task, index, getPriorityConfig, deleteTask }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay: index * 0.05 }}
    >
      <TaskCard
        task={task}
        getPriorityConfig={getPriorityConfig}
        deleteTask={deleteTask}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </motion.div>
  );
};

// Task Card Component
const TaskCard = ({ task, getPriorityConfig, deleteTask, dragHandleProps, isDragging }: any) => {
  if (!task) return null;

  const priorityConfig = getPriorityConfig(task.priority);

  return (
    <div
      className={`card group cursor-move hover:shadow-elegant transition-all duration-500 relative ${
        isDragging ? 'shadow-float scale-105' : ''
      }`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${priorityConfig.gradient}`}></div>

      <div className="flex items-start gap-3">
        <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing pt-1">
          <GripVertical className="text-charcoal/30 group-hover:text-charcoal/60 transition-colors" size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className={`font-semibold text-charcoal ${task.status === 'COMPLETED' ? 'line-through opacity-60' : ''}`}>
              {task.title}
            </h4>
            <button
              onClick={() => deleteTask(task._id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-terracotta/10 rounded-lg transition-all duration-300"
            >
              <Trash2 className="text-terracotta" size={16} />
            </button>
          </div>

          {task.description && (
            <p className="text-sm text-charcoal/60 mb-3 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className={`badge ${priorityConfig.color} flex items-center gap-1`}>
              {priorityConfig.icon}
              <span className="text-xs">{task.priority}</span>
            </span>

            {task.deadline && (
              <div className="flex items-center gap-1 text-xs text-charcoal/50">
                <Clock size={12} />
                {new Date(task.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
