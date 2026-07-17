import { useState } from "react";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import Registration from "./Components/Registration";

function App() {
  const [token, setToken] = useState(localStorage.getItem("easyurl_token"));
  const [isLogin, setIsLogin] = useState(true);

  const handleSetToken = (newToken) => {
    if(newToken){
      localStorage.setItem("easyurl_token", newToken);
    }
    else{
      localStorage.removeItem("easyurl_token");
    }
    setToken(newToken);
  }

  if (token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 p-4 transition-all duration-300">
        <header className="absolute top-4 right-4">
          <button 
            onClick={() => handleSetToken(null)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs text-slate-300 rounded-xl cursor-pointer transition-all duration-200"
          >
            Logout
          </button>
        </header>
        
        <h2 className="text-4xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent select-none">
          EasyURL
        </h2>
        <Dashboard token={token} />
      </div>
    );
  }

return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 p-4 transition-all duration-300">
      <h2 className="text-4xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent select-none">
        EasyURL
      </h2>
      
      {isLogin ? (
        <Login setToken={handleSetToken} setIsLogin={setIsLogin} />
      ) : (
        <Registration setToken={handleSetToken} setIsLogin={setIsLogin} />
      )}
    </div>
  );
}

export default App;