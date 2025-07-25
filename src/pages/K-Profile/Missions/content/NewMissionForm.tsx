import { Plus, Star } from "lucide-react";
import { useState } from "react";
import { DetailedMission } from "../types";


const NewMissionForm = ({ newMission, setNewMission, onSubmit, loading }: { newMission: Omit<DetailedMission, 'id'>, setNewMission: React.Dispatch<React.SetStateAction<Omit<DetailedMission, 'id'>>>, onSubmit: () => void, loading: boolean }) => {
    const [showForm, setShowForm] = useState(false);

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                className="ml-auto flex gap-2 items-center text-white px-4 py-2 rounded-full shadow bg-[#297280] hover:bg-teal-900"
            >
                <Plus size={20} /> Ajouter une mission
            </button>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-lg font-semibold mb-4">Add New Mission</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <input
                        type="text"
                        value={newMission.status}
                        onChange={(e) => setNewMission({ ...newMission, status: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <input
                        type="text"
                        value={newMission.company}
                        onChange={(e) => setNewMission({ ...newMission, company: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contact</label>
                    <input
                        type="text"
                        value={newMission.contact}
                        onChange={(e) => setNewMission({ ...newMission, contact: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={newMission.title}
                        onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        value={newMission.start}
                        onChange={(e) => setNewMission({ ...newMission, start: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                        type="date"
                        value={newMission.end}
                        onChange={(e) => setNewMission({ ...newMission, end: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Rate</label>
                    <input
                        type="text"
                        value={newMission.rate}
                        onChange={(e) => setNewMission({ ...newMission, rate: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Satisfaction</label>
                    <div className="flex mt-1">
                        {Array(5).fill(0).map((_, index) => (
                            <Star
                                key={index}
                                className={`h-5 w-5 cursor-pointer ${index < newMission.satisfaction ? "text-yellow-500" : "text-gray-300"}`}
                                onClick={() => setNewMission({ ...newMission, satisfaction: index + 1 })}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                    Cancel
                </button>
                <button
                    onClick={onSubmit}
                    disabled={loading}
                    className="px-4 py-2 text-sm text-white bg-[#297280] rounded-md hover:bg-teal-900 disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Mission'}
                </button>
            </div>
        </div>
    );
};

export default NewMissionForm;