import React from "react";

interface BesoinInfoProps {
    formData: {
        title: string;
        announcetDate: string;
        responseDate: string;
        startDate: string;
        duration: string;
        targetRate: string;
    };
    updateFormData: (section: string, field: string, value: any) => void;
}

const BesoinInfo: React.FC<BesoinInfoProps> = ({ formData, updateFormData }) => {
    const handleChange = (field: string, value: string) => {
        updateFormData("generalInfo", field, value);
    };

    return (
        <div className="mb-8 mt-8">
            <div
                className="bg-white shadow-lg rounded-lg p-6"
                style={{
                    boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)",
                    borderRadius: "10px",
                }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Informations générales</h2>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Titre</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            className="w-full border rounded-lg p-2"
                            placeholder="Titre"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Date appel d'offre</label>
                        <input
                            type="date"
                            className="w-full border rounded-lg p-2"
                            placeholder="Date appel d'offre"
                            value={formData.announcetDate}
                            onChange={(e) => handleChange("announcetDate", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Date démarrage</label>
                        <input
                            type="date"
                            className="w-full border rounded-lg p-2"
                            placeholder="Date démarrage"
                            value={formData.startDate}
                            onChange={(e) => handleChange("startDate", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Date réponse</label>
                        <input
                            type="date"
                            className="w-full border rounded-lg p-2"
                            placeholder="Date réponse"
                            value={formData.responseDate}
                            onChange={(e) => handleChange("responseDate", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Durée prévisionnelle (jours)</label>
                        <input
                            type="number"
                            className="w-full border rounded-lg p-2"
                            placeholder="Durée prévisionnelle"
                            value={formData.duration}
                            onChange={(e) => handleChange("duration", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">TJM cible</label>
                        <input
                            type="number"
                            className="w-full border rounded-lg p-2"
                            placeholder="TJM cible"
                            value={formData.targetRate}
                            onChange={(e) => handleChange("targetRate", e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BesoinInfo;