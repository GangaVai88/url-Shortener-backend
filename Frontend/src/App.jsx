import { useState } from "react"; // useState is a React hook that allows you to add a state variable to your component,  syntax: const [state,setState] = useState(initialState);

function App(){
  const [longUrl, setLongUrl] = useState('');//state variable that stores the user input in real time
  const [serverData,setServerData] = useState(null);//Stores the JSON data that my backend sends containing the longUrl, urlcode and time created
  const [track,setTrack] = useState(false);//Tracks whether the network request is midflight, since network latency exists
  const [error,setError] = useState('');//Holds any error message the backend might throw if backend rejects the call

  async function handleSubmit(e){
    e.preventDefault();//prevents refreshing the page and erasing the input
    setError('');
    setTrack(true);
    try{
      await fetch('http://localhost:5000/api/shorten', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, // so that express knows it's parsing a JSON string body
        body: JSON.stringify({ longUrl: longUrl }) // ideal for text data like strings, numbers, booleans, and arrays, for images, pdfs, or any other binary files => body: formData and skips content type header entirely
      });
    } catch{
      
    }
  }

  return(
    <div>
      <h2 className="heading">GANGULI URL SHORTENER</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Paste Your long URL here" value={longUrl} onChange={(e) => setLongUrl(e.target.value)}></input>
        <button type ="submit">Shorten</button>
      </form>
    </div>
  )
}

export default App;

//onChange is an event listener. Whenever a user presses a key inside the input box, it triggers an event object. The object has a property called e.target.value which holds the exact text currently typed into the input field.
//Setter function is used to force the update on the visual screen... Updating a regular variable might change the backend data, but user's screen remains frozen