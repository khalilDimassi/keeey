import { useEffect, useState } from "react";
import { supportTicket } from "../types";
import { sendSupportTicket } from "../services";

function ContactSupportForm({ mainColor, setMessage }: { mainColor: string, setMessage: (message: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<supportTicket>({
    subject: "",
    body: "",
  })

  const resetForm = () => {
    setFormData({
      subject: "",
      body: "",
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sendSupportTicket(formData.subject, formData.body);
      setSuccess("Message envoyé avec succès");
      resetForm();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send support ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      setMessage(error);
    } else if (success) {
      setMessage(success);
    }
  }, [error, success]);

  return (
    <>
      <header className="mb-10 flex flex-row items-center justify-between">
        <h2 className={`text-3xl font-semibold text-[${mainColor}]`}>
          Contact / Support
        </h2>

        <button onClick={(e) => handleSubmit(e)} disabled={loading} className={`bg-[${mainColor}] text-white px-6 py-2 mr-8 rounded-3xl font-semibold`}>
          {loading ? "Chargement..." : "Envoyer"}
        </button>
      </header>

      <main className="flex flex-col">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="subject">
            Sujet
          </label>
          <input
            className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="subject"
            type="text"
            placeholder="Sujet"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="body">
            Message
          </label>
          <textarea
            className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="body"
            rows={8}
            placeholder="Message"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          />
        </div>
      </main>
    </>
  );
}
export default ContactSupportForm;