import { useState } from "react";

const Centre = () => {
    const [currentCentre, setCurrentCentre] = useState({
      centre: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentCentre({ centre: e.target.value });
    };

    return (
      <div className="space-y-4">
        {/* Champ de saisie pour le centre d'intérêt */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Centre d'intérêt
          </label>
          <input
            type="text"
            name="centre"
            value={currentCentre.centre}
            onChange={handleChange}
            placeholder="Entrez un centre d'intérêt"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    );
};
export default Centre;
