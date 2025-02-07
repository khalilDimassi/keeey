import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

// Définition du type Certificat
type Certificat = {
  nom: string;
  organisme: string;
  ville: string;
  dateObtention: string;
  expiration: string;
  permanent: boolean;
  description: string;
};

const Certificats = () => {
  // Définition des états avec leurs types
  const [certificats, setCertificats] = useState<Certificat[]>([]);
  const [currentCertificat, setCurrentCertificat] = useState<Certificat>({
    nom: "",
    organisme: "",
    ville: "",
    dateObtention: "",
    expiration: "",
    permanent: false,
    description: "",
  });

  // Typage explicite de l'événement
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
  
    setCurrentCertificat((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddCertificat = () => {
    if (currentCertificat.nom.trim()) {
      setCertificats([...certificats, currentCertificat]);
      setCurrentCertificat({
        nom: "",
        organisme: "",
        ville: "",
        dateObtention: "",
        expiration: "",
        permanent: false,
        description: "",
      });
    }
  };

  // Typage explicite du paramètre index
  const handleDeleteCertificat = (index: number) => {
    setCertificats(certificats.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-md p-4">
        <h3 className="font-medium mb-2">Ajouter un certificat</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom du certificat</label>
            <input
              type="text"
              name="nom"
              value={currentCertificat.nom}
              onChange={handleChange}
              placeholder="Nom du certificat"
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Organisme</label>
              <input
                type="text"
                name="organisme"
                value={currentCertificat.organisme}
                onChange={handleChange}
                placeholder="Nom de l'organisme"
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ville</label>
              <input
                type="text"
                name="ville"
                value={currentCertificat.ville}
                onChange={handleChange}
                placeholder="Ville"
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date d'obtention</label>
              <input
                type="date"
                name="dateObtention"
                value={currentCertificat.dateObtention}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
            {!currentCertificat.permanent && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Date d'expiration</label>
                <input
                  type="date"
                  name="expiration"
                  value={currentCertificat.expiration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                />
              </div>
            )}
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="permanent"
              checked={currentCertificat.permanent}
              onChange={handleChange}
              className="text-teal-600"
            />
            <span>Certificat permanent</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={currentCertificat.description}
              onChange={handleChange}
              placeholder="Description du certificat"
              className="w-full px-3 py-2 border border-gray-200 rounded-md h-24"
            />
          </div>

          <button
            onClick={handleAddCertificat}
            className="bg-gray-100 text-green px-4 py-2 rounded-md hover:bg-teal-700 w-full"
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* Liste des certificats enregistrés */}
      <div className="space-y-2">
        {certificats.map((certificat, index) => (
          <div key={index} className="flex justify-between items-center border border-gray-200 p-3 rounded-md">
            <div>
              <p className="font-medium">{certificat.nom}</p>
              <p className="text-sm text-gray-500">
                {certificat.organisme} - {certificat.dateObtention}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-500 hover:text-blue-700">
                <Pencil size={18} />
              </button>
              <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteCertificat(index)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificats;
