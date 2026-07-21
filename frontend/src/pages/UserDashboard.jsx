import { useEffect, useMemo, useState } from 'react';
import { getApiVersion, getUsername } from '../utils/helpers';
import userService from '../services/userService';

function UserDashboard() {
  const username = getUsername();
  const [apiVersion, setApiVersionState] = useState(getApiVersion());
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [statusDrafts, setStatusDrafts] = useState({});

  const getStatusClass = (status) => {
    if (status === 'completed') {
      return 'status-completed';
    }
    if (status === 'in progress') {
      return 'status-in-progress';
    }
    return 'status-pending';
  };

  const loadTasks = async () => {
    setLoadingTasks(true);
    try {
      const data = await userService.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    const handleApiVersionChange = () => {
      setApiVersionState(getApiVersion());
      loadTasks();
    };

    window.addEventListener('apiVersionChanged', handleApiVersionChange);
    return () => {
      window.removeEventListener('apiVersionChanged', handleApiVersionChange);
    };
  }, []);

  const adminCards = useMemo(() => {
    const uniqueAdmins = new Map();

    tasks.forEach((task) => {
      const admin = task.createdBy;
      if (!admin || !admin._id) {
        return;
      }
      uniqueAdmins.set(admin._id, admin);
    });

    return Array.from(uniqueAdmins.values());
  }, [tasks]);

  useEffect(() => {
    if (adminCards.length > 0 && !selectedAdminId) {
      setSelectedAdminId(adminCards[0]._id);
    }
  }, [adminCards, selectedAdminId]);

  const filteredTasks = useMemo(() => {
    if (!selectedAdminId) {
      return [];
    }

    return tasks.filter((task) => task.createdBy?._id === selectedAdminId);
  }, [tasks, selectedAdminId]);

  const handleStatusChange = (taskId, status) => {
    setStatusDrafts((prev) => ({ ...prev, [taskId]: status }));
  };

  const handleSaveStatus = async (task) => {
    const status = statusDrafts[task._id] || task.status;
    setError('');
    setMessage('');

    try {
      await userService.updateTaskStatus(task._id, status);
      setMessage('Task status updated');
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
    }
  };

  return (
    <main className={`dashboard-page user-dashboard-page ${apiVersion === 'v2' ? 'user-dashboard-v2' : ''}`}>
      <section className="dashboard-content">

        <section className="user-dashboard-layout">
          <aside className="user-admins-panel">
            <p className="dashboard-eyebrow">Assigned By Admins</p>
            {apiVersion === 'v2' ? <p className="dashboard-version-note">V2 enhanced navigation</p> : null}
            <h2>{username || 'User'}</h2>
            {loadingTasks ? <p>Loading admins...</p> : null}
            {!loadingTasks && adminCards.length === 0 ? <p>No admins have assigned tasks yet.</p> : null}

            <div className="user-admins-list">
              {adminCards.map((admin) => (
                <button
                  key={admin._id}
                  type="button"
                  className={`user-admin-card ${selectedAdminId === admin._id ? 'active' : ''}`}
                  onClick={() => setSelectedAdminId(admin._id)}
                >
                  {admin.username}
                </button>
              ))}
            </div>
          </aside>

          <section className="user-tasks-panel">
            <p className="dashboard-eyebrow">Tasks List</p>
            {apiVersion === 'v2' ? <p className="dashboard-version-note">V2 card style enabled</p> : null}
            {loadingTasks ? <p>Loading tasks...</p> : null}
            {!loadingTasks && filteredTasks.length === 0 ? <p>No tasks for this admin.</p> : null}

            <div className="user-task-list">
              {filteredTasks.map((task) => (
                <article
                  key={task._id}
                  className={`user-task-card ${apiVersion === 'v2' ? 'user-task-card-v2' : ''}`}
                >
                  <div className="user-task-header">
                    <h3>{task.title}</h3>
                    <span className={`task-status-badge ${getStatusClass(statusDrafts[task._id] || task.status)}`}>
                      {statusDrafts[task._id] || task.status}
                    </span>
                  </div>
                  <p className="task-description-text">{task.description}</p>
                  <p className="user-task-meta">
                    Assigned By: <strong>{task.createdBy?.username || 'Unknown Admin'}</strong>
                  </p>
                  <div className="user-task-actions">
                    <label htmlFor={`status-${task._id}`}>Status</label>
                    <select
                      id={`status-${task._id}`}
                      value={statusDrafts[task._id] || task.status}
                      onChange={(event) => handleStatusChange(task._id, event.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button type="button" onClick={() => handleSaveStatus(task)}>
                      Update
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {error ? <p className="error-text">{error}</p> : null}
            {message ? <p>{message}</p> : null}
          </section>
        </section>
      </section>
    </main>
  );
}

export default UserDashboard;