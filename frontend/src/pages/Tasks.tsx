import { useEffect, useState } from 'react';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      await taskAPI.update(taskId, { status });
      fetchTasks();
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <button className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Task</span>
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                {task.description && (
                  <p className="text-gray-600 mt-1">{task.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-2">
                  {task.deadline && (
                    <span className="text-sm text-gray-500">
                      Due: {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded ${
                    task.priority === 'URGENT' ? 'bg-red-100 text-red-700' :
                    task.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
              {task.status !== 'COMPLETED' && (
                <button
                  onClick={() => updateTaskStatus(task.id, 'COMPLETED')}
                  className="btn-primary ml-4"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
