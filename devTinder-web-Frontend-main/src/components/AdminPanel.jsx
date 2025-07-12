import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useState } from "react";

const AdminPanel = () => {
  const user = useSelector((store) => store.user);
  const [users, setUsers] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [message, setMessage] = useState("");
  const [msgResult, setMsgResult] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingSwaps, setLoadingSwaps] = useState(false);

  if (!user || user.role !== "admin")
    return (
      <div className="flex flex-col items-center mt-20 animate-fade-in">
        <span className="text-4xl text-error font-bold mb-4">🚫</span>
        <h1 className="text-center text-2xl">Access Denied</h1>
      </div>
    );

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const res = await axios.get(BASE_URL + "/admin/report/users", { withCredentials: true });
    setUsers(res.data);
    setLoadingUsers(false);
  };

  const fetchSwaps = async () => {
    setLoadingSwaps(true);
    const res = await axios.get(BASE_URL + "/admin/report/swaps", { withCredentials: true });
    setSwaps(res.data);
    setLoadingSwaps(false);
  };

  const banUser = async (id) => {
    await axios.patch(BASE_URL + `/admin/user/${id}/ban`, {}, { withCredentials: true });
    fetchUsers();
  };

  const unbanUser = async (id) => {
    await axios.patch(BASE_URL + `/admin/user/${id}/unban`, {}, { withCredentials: true });
    fetchUsers();
  };

  const rejectSkills = async (id) => {
    await axios.patch(BASE_URL + `/admin/user/${id}/skills/reject`, {}, { withCredentials: true });
    fetchUsers();
  };

  const sendMessage = async () => {
    const res = await axios.post(BASE_URL + "/admin/message", { message }, { withCredentials: true });
    setMsgResult(res.data.message);
    setTimeout(() => setMsgResult(""), 2000);
    setMessage("");
  };

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-primary animate-bounce">Admin Panel</h1>
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <button className="btn btn-primary btn-wide shadow-lg transition-transform hover:scale-105" onClick={fetchUsers}>
          {loadingUsers ? <span className="loading loading-spinner"></span> : "Load Users"}
        </button>
        <button className="btn btn-secondary btn-wide shadow-lg transition-transform hover:scale-105" onClick={fetchSwaps}>
          {loadingSwaps ? <span className="loading loading-spinner"></span> : "Load Swaps"}
        </button>
      </div>
      <div className="flex flex-col items-center mb-8">
        <div className="flex gap-2 w-full max-w-lg">
          <input
            className="input input-bordered flex-1"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Platform-wide message"
          />
          <button className="btn btn-accent transition-transform hover:scale-105" onClick={sendMessage}>Send</button>
        </div>
        {msgResult && (
          <div className="alert alert-success mt-2 animate-fade-in-down">
            <span>{msgResult}</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-info">Users</h2>
          <ul className="space-y-4">
            {users.map(u => (
              <li key={u._id} className={`card bg-base-200 shadow-md p-4 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] ${u.banned ? "opacity-60" : ""} animate-fade-in-down`}>
                <div className="avatar">
                  <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={u.photoUrl || "https://api.dicebear.com/7.x/miniavs/svg?seed=" + u.firstName} alt="user" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-bold">{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-gray-400">{u.emailId}</div>
                  <div className="badge badge-outline badge-info mr-2">{u.role}</div>
                  {u.banned && <span className="badge badge-error">Banned</span>}
                </div>
                {u.role !== "admin" && (
                  <div className="flex flex-col gap-1">
                    <button className="btn btn-xs btn-error" onClick={() => banUser(u._id)}>Ban</button>
                    <button className="btn btn-xs btn-success" onClick={() => unbanUser(u._id)}>Unban</button>
                    <button className="btn btn-xs btn-warning" onClick={() => rejectSkills(u._id)}>Reject Skills</button>
                  </div>
                )}
              </li>
            ))}
            {users.length === 0 && !loadingUsers && (
              <li className="text-center text-gray-400">No users loaded.</li>
            )}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-info">Swaps</h2>
          <ul className="space-y-2 max-h-[400px] overflow-y-auto">
            {swaps.map(s => (
              <li key={s._id} className="card bg-base-200 shadow-sm p-3 animate-fade-in-down">
                <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(s, null, 2)}</pre>
              </li>
            ))}
            {swaps.length === 0 && !loadingSwaps && (
              <li className="text-center text-gray-400">No swaps loaded.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;