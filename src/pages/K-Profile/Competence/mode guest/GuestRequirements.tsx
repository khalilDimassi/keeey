import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { GuestData, GuestResume } from "../types";

interface GuestRequirementsProps {
  guestData: GuestData;
  updateGuestData: (change: { section: "requirements"; data: Partial<GuestData> }) => void;
}

const GuestRequirements = ({ guestData, updateGuestData }: GuestRequirementsProps) => {
  const [inputValues, setInputValues] = useState({
    tool: "",
    authorization: "",
    language: "",
    quality: "",
  });

  const handleInputChange = (key: keyof typeof inputValues, value: string) => {
    setInputValues((prev) => ({ ...prev, [key]: value }));
  };

  const addItem = (key: keyof typeof inputValues, field: keyof GuestResume) => {
    const value = inputValues[key].trim();
    if (!value) return;

    let newItem: any;
    if (field === "languages" || field === "authorizations" || field === "tools" || field === "qualities") {
      newItem = { name: value, level: 1 }; // default level = 1
    }

    updateGuestData({
      section: "requirements",
      data: {
        [field]: [...(guestData.resume[field] as any[]), newItem],
      },
    });

    setInputValues((prev) => ({ ...prev, [key]: "" }));
  };

  const removeItem = (field: keyof GuestResume, item: any) => {
    updateGuestData({
      section: "requirements",
      data: {
        [field]: (guestData.resume[field] as any[]).filter((i) => i.name !== item.name),
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {[
        { key: "tool", label: "Outils", field: "tools" },
        { key: "authorization", label: "Habilitations", field: "authorizations" },
        { key: "language", label: "Langues", field: "languages" },
        { key: "quality", label: "Qualités Relationnelles", field: "qualities" },
      ].map(({ key, label, field }) => (
        <div key={key} className="space-y-2">
          <p className="mb-2 font-semibold">{label}</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValues[key as keyof typeof inputValues]}
              onChange={(e) => handleInputChange(key as keyof typeof inputValues, e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                addItem(key as keyof typeof inputValues, field as keyof GuestResume)
              }
              placeholder={`Ajouter ${/^[aeiou]/i.test(label) ? "un" : "une"} ${label.toLowerCase()}`}
              className="flex-1 border p-2 rounded-xl"
            />
            <button
              onClick={() => addItem(key as keyof typeof inputValues, field as keyof GuestResume)}
              className={`p-2 ${inputValues[key as keyof typeof inputValues].trim()
                ? "text-blue-600"
                : "text-gray-400"
                }`}
              disabled={!inputValues[key as keyof typeof inputValues].trim()}
            >
              <PlusCircle size={24} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {(guestData.resume[field as keyof GuestResume] as any[])?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-xl px-3 py-1 bg-[#297280] text-white"
              >
                <span>{item.name}</span>
                <button
                  onClick={() => removeItem(field as keyof GuestResume, item)}
                  className="hover:text-gray-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GuestRequirements;
