import { useState } from "react"; 

function Dashboard({token}) {
  const [longUrl, setLongUrl] = useState('');
  const [serverData, setServerData] = useState(null);
  const [track, setTrack] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setTrack(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/shorten`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' , 
            'x-auth-token' : token
        }, 
        body: JSON.stringify({ longUrl: longUrl }) 
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setServerData(data);
      setLongUrl(''); 
    } catch (error) { 
      setError(error.message);
    } finally { 
      setTrack(false);
    }
  }

  return (
    <form className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-md flex flex-col gap-5" onSubmit={handleSubmit}>
      <input placeholder="Paste Your long URL here" value={longUrl} onChange={(e) => setLongUrl(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"></input>
      <button type="submit" disabled={track} className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-md cursor-pointer hover:shadow-lg focus:outline-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:transform-none transition-all duration-200 text-sm"
      >
        {track ? "Shortening" : "Shorten"}
      </button>
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl text-center font-medium">
          {error}
        </p>
      )}
      {serverData && (
        <div className="mt-2 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-sm animate-fade-in">
          <span className="text-emerald-400 block mb-1 font-medium">URL Shortened Successfully!</span>
          <a
            href={`${API_BASE_URL}/${serverData.urlCode}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:text-blue-300 font-medium break-all underline decoration-blue-400/30 hover:decoration-blue-300 dynamic-link target-new-tab"
          >
            {API_BASE_URL}/{serverData.urlCode}
          </a>
        </div>
      )}
    </form>
  )
}

export default Dashboard;