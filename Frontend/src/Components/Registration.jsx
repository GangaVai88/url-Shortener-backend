import { useState } from "react";

function Registration({setToken, setIsLogin}){

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const [track, setTrack] = useState(false);

    async function handleRegistration(e){
        e.preventDefault();
        setError('');
        setTrack(true);
        try{
            const response = await fetch('http://localhost:5000/api/register', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({ email , password })
            })
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.error)
            }
            setIsLogin(true);
            setToken(data.token);
        }
        catch(error){
            setError(error.message);
        } finally{
            setTrack(false);
        }
    }
    return (
  <form onSubmit={handleRegistration} className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-md flex flex-col gap-5">
    <input
      type="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
    />
    <input 
    type="password" 
    placeholder="Enter your Password"
    value = {password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
    />
    <button type="submit" disabled = {track} className = "w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-md cursor-pointer hover:shadow-lg focus:outline-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:transform-none transition-all duration-200 text-sm">
      {track? "Registering..." : "Register"}
    </button>
    {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl text-center font-medium">
          {error}
        </p>
      )}
      <p className="text-xs text-center text-slate-400 mt-2">
  Already have an account?{" "}
  <span onClick={() => setIsLogin(true)} className="text-blue-400 hover:underline cursor-pointer">
    Log In
  </span>
</p>
  </form>
)
}

export default Registration;
