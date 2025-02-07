import { useState } from "react";

function Realisation() {
    const [text, setText] = useState('');
  
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
      };
      
    return (
      <div className="space-y-4">
        <label htmlFor="realisation" className="block text-sm font-medium text-gray-700">
          Realisation
        </label>
        <textarea
          id="realisation"
          value={text}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Describe your realisation here..."
        ></textarea>
      </div>
    );
  }
  export default Realisation;