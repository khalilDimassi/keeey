import { FC } from "react";
import { OpportunityBasicInfo } from "../../types";

interface BesoinInfoProps {
    formData: OpportunityBasicInfo;
    onFormDataChange: (field: keyof OpportunityBasicInfo, value: any) => void;
}

const BesoinInfo: FC<BesoinInfoProps> = ({ formData, onFormDataChange }) => {
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
                            onChange={(e) => onFormDataChange("title", e.target.value)}
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
                            value={formData.announceDate}
                            onChange={(e) => onFormDataChange("announceDate", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Date démarrage</label>
                        <input
                            type="date"
                            className="w-full border rounded-lg p-2"
                            placeholder="Date démarrage"
                            value={formData.startDate}
                            onChange={(e) => onFormDataChange("startDate", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Date réponse</label>
                        <input
                            type="date"
                            className="w-full border rounded-lg p-2"
                            placeholder="Date réponse"
                            value={formData.responseDate}
                            onChange={(e) => onFormDataChange("responseDate", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Durée prévisionnelle (jours)</label>
                        <input
                            type="number"
                            className="w-full border rounded-lg p-2"
                            placeholder="Durée prévisionnelle"
                            value={formData.duration}
                            onChange={(e) => onFormDataChange("duration", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">TJM cible</label>
                        <input
                            type="number"
                            className="w-full border rounded-lg p-2"
                            placeholder="TJM cible"
                            value={formData.targetRate}
                            onChange={(e) => onFormDataChange("targetRate", e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BesoinInfo;