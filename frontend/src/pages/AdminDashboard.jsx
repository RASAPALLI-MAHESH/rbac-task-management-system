import { useEffect, useMemo, useState } from 'react';
import { getUsername } from '../utils/helpers';
import adminService from '../services/adminService';

function AdminDashboard() {
  const username = getUsername();
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [selectedTaskForAssignment, setSelectedTaskForAssignment] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState('');
  const [editTaskData, setEditTaskData] = useState({ title: '', description: '' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
  });
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const unassignedTasks = useMemo(() => {
    return tasks.filter((task) => !task.assignedTo);
  }, [tasks]);

  const assignedTasks = useMemo(() => {
    return tasks.filter((task) => task.assignedTo);
  }, [tasks]);

  const getStatusClass = (status) => {
    if (status === 'completed') {
      return 'status-completed';
    }
    if (status === 'in progress') {
      return 'status-in-progress';
    }
    return 'status-pending';
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      setActionError(error.response?.data?.message || 'Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadTasks = async () => {
    setLoadingTasks(true);
    try {
      const data = await adminService.getTasks();
      setTasks(data);
    } catch (error) {
      setActionError(error.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadTasks();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleUserSelection = (userId) => {
    setSelectedUserIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setActionError('');
    setActionMessage('');

    setIsCreating(true);

    try {
      await adminService.createTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
      });

      setActionMessage('Task created and added to unassigned queue');
      setFormData({
        title: '',
        description: '',
        status: 'pending',
      });
      await loadTasks();
    } catch (error) {
      setActionError(error.response?.data?.message || 'Task creation failed');
    } finally {
      setIsCreating(false);
    }
  };

  const startAssignment = (task) => {
    setSelectedTaskForAssignment(task);
    setSelectedUserIds([]);
    setActionError('');
    setActionMessage(`Select users to assign: ${task.title}`);
  };

  const cancelAssignment = () => {
    setSelectedTaskForAssignment(null);
    setSelectedUserIds([]);
    setActionMessage('');
  };

  const handleAssignTask = async () => {
    if (!selectedTaskForAssignment) {
      return;
    }

    if (selectedUserIds.length === 0) {
      setActionError('Select at least one user before assigning');
      return;
    }

    setIsAssigning(true);
    setActionError('');

    try {
      const [firstUser, ...otherUsers] = selectedUserIds;

      await adminService.updateTask(selectedTaskForAssignment._id, {
        assignedTo: firstUser,
      });

      await Promise.all(
        otherUsers.map((userId) =>
          adminService.createTask({
            title: selectedTaskForAssignment.title,
            description: selectedTaskForAssignment.description,
            status: selectedTaskForAssignment.status,
            assignedTo: userId,
          })
        )
      );

      setActionMessage('Task assigned successfully');
      setSelectedTaskForAssignment(null);
      setSelectedUserIds([]);
      await loadTasks();
    } catch (error) {
      setActionError(error.response?.data?.message || 'Failed to assign task');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setActionError('');
    setActionMessage('');
    try {
      await adminService.deleteTask(taskId);
      setActionMessage('Task deleted successfully');
      await loadTasks();
    } catch (error) {
      setActionError(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const startTaskEdit = (task) => {
    setEditingTaskId(task._id);
    setEditTaskData({
      title: task.title || '',
      description: task.description || '',
    });
    setActionError('');
    setActionMessage('');
  };

  const cancelTaskEdit = () => {
    setEditingTaskId('');
    setEditTaskData({ title: '', description: '' });
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateTask = async (taskId) => {
    setActionError('');
    setActionMessage('');

    try {
      await adminService.updateTask(taskId, {
        title: editTaskData.title.trim(),
        description: editTaskData.description.trim(),
      });
      setActionMessage('Task updated successfully');
      cancelTaskEdit();
      await loadTasks();
    } catch (error) {
      setActionError(error.response?.data?.message || 'Failed to update task');
    }
  };

  return (
    <main className="dashboard-page admin-dashboard-page">
      <section className="dashboard-content">
        <section className="admin_page">
          <div className="CreateTask">
            <p className="dashboard-eyebrow">Create Task</p>
            <h2>{username ? `${username}'s Task Creator` : 'Task Creator'}</h2>

            <form onSubmit={handleCreateTask}>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Task name"
                minLength={5}
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Task description"
                minLength={8}
                rows={4}
                required
              />
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Task'}
              </button>
            </form>

            <div className="created-tasks-scroll">
              <p className="dashboard-eyebrow">Created Tasks (Not Assigned)</p>
              {loadingTasks ? <p>Loading created tasks...</p> : null}
              {!loadingTasks && unassignedTasks.length === 0 ? <p>No unassigned tasks</p> : null}

              {!loadingTasks
                ? unassignedTasks.map((task) => (
                    <div key={task._id} className="created-task-card">
                      <h4>{task.title}</h4>
                      <p>{task.description}</p>
                      <button type="button" onClick={() => startAssignment(task)}>
                        Assign Task
                      </button>
                    </div>
                  ))
                : null}
            </div>
          </div>

          <div className="ViewUsers">
            <p className="dashboard-eyebrow">View Users</p>
            <h2>User Management</h2>

            {loadingUsers ? <p>Loading users...</p> : null}
            {!loadingUsers ? (
              <ul className="users-cards-list">
                {users.map((user) => (
                  <li key={user._id} className="user-card-item">
                    {selectedTaskForAssignment ? (
                      <label className="checkbox-row">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user._id)}
                          onChange={() => toggleUserSelection(user._id)}
                        />
                        <span>
                          <strong>{user.username}</strong>
                        </span>
                      </label>
                    ) : (
                      <span>
                        <strong>{user.username}</strong> - {user.role}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}

            {selectedTaskForAssignment ? (
              <div className="assign-actions">
                <p>
                  Assigning: <strong>{selectedTaskForAssignment.title}</strong>
                </p>
                <button type="button" onClick={handleAssignTask} disabled={isAssigning}>
                  {isAssigning ? 'Assigning...' : 'Assign Selected Users'}
                </button>
                <button type="button" onClick={cancelAssignment}>
                  Cancel
                </button>
              </div>
            ) : null}
          </div>

          <div className="viewTasks">
            <p className="dashboard-eyebrow">View Tasks</p>
            <h2>Task Overview</h2>

            {loadingTasks ? <p>Loading tasks...</p> : null}
            {!loadingTasks ? (
              <ul>
                {assignedTasks.map((task) => (
                  <li
                    key={task._id}
                    className={`task-overview-card ${editingTaskId === task._id ? 'task-overview-card-editing' : ''}`}
                  >
                    <div className="task-overview-content">
                      {editingTaskId === task._id ? (
                        <div className="task-edit-form">
                          <input
                            type="text"
                            name="title"
                            value={editTaskData.title}
                            onChange={handleEditInputChange}
                            minLength={5}
                            required
                          />
                          <textarea
                            name="description"
                            value={editTaskData.description}
                            onChange={handleEditInputChange}
                            minLength={8}
                            rows={3}
                            required
                          />
                        </div>
                      ) : (
                        <>
                          <div className="task-meta-line">
                            Task Name: <strong>{task.title}</strong>
                          </div>
                          <div className="task-description-text">{task.description}</div>
                        </>
                      )}

                      <div className="task-meta-line">Assigned to: {task.assignedTo?.username || 'Unassigned'}</div>
                      <div className="task-meta-line">
                        Status: <span className={`task-status-badge ${getStatusClass(task.status)}`}>{task.status}</span>
                      </div>
                    </div>

                    <div className="task-actions-row">
                      {editingTaskId === task._id ? (
                        <>
                          <button type="button" onClick={() => handleUpdateTask(task._id)}>
                            Update
                          </button>
                          <button type="button" onClick={cancelTaskEdit}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button type="button" onClick={() => startTaskEdit(task)}>
                            Update
                          </button>
                          <button type="button" onClick={() => handleDeleteTask(task._id)}>
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}

            {actionError ? <p className="error-text">{actionError}</p> : null}
            {actionMessage ? <p>{actionMessage}</p> : null}
          </div>
        </section>
      </section>
    </main>
  );
}

export default AdminDashboard;
