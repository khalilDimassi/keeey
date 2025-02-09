import { useState } from "react";

function ContactSupportForm() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!subject || !message) {
        alert("Tous les champs doivent être remplis !");
        return;
      }
      console.log("Message envoyé !");
    };
  
    return (
      <div>
        <h2 className="text-2xl font-semibold text-teal-800 mb-6">Contact / Support</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sujet Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Sujet</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-800"
              placeholder="Entrez le sujet de votre message"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
  
          {/* Message Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Message</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-800"
              placeholder="Écrivez votre message ici"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
            />
          </div>
  
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-teal-800 text-white p-3 rounded-md font-semibold hover:bg-teal-700 transition-all"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    );
  }
  export default ContactSupportForm;