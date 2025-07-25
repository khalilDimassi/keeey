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
  };

  return (
    <div>
      <div className="flex justify-between items-center w-full">
        <h2 className="text-2xl font-semibold text-blue-800 mb-6">
          Contact / Support
        </h2>
        <button
          type="submit"
          className="bg-blue-800 text-white px-6 py-3 rounded-3xl font-semibold hover:bg-blue-700 transition-all"
        >
          Envoyer
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 w-1/3">
        {/* Sujet Field */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Sujet</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-800"
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
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-800"
            placeholder="Écrivez votre message ici"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            required
          />
        </div>

        {/* Submit Button */}

      </form>
    </div>
  );
}
export default ContactSupportForm;