import { KPlayerListItem } from "./types";

interface KPlayersListProps {
    players: KPlayerListItem[];
    loading: boolean;
    error: string | null;
}

const KPlayersList = ({ players, loading, error }: KPlayersListProps) => {
    if (loading) {
        return <div className="p-8 text-center text-gray-500">Chargement...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    if (players.length === 0) {
        return <div className="p-8 text-center text-gray-500">Aucun client intéressé trouvé</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {players.map(player => (
                <div
                    key={player.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                    <div className="p-5">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="bg-teal-100 text-teal-800 rounded-full w-12 h-12 flex items-center justify-center font-medium text-lg">
                                {player.firstName.charAt(0)}{player.lastName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {player.firstName} {player.lastName}
                                </h3>
                                <p className="text-sm text-gray-500">{player.occupation}</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex">
                                <span className="text-gray-500 w-24">Email:</span>
                                <a
                                    href={`mailto:${player.email}`}
                                    className="text-teal-600 hover:underline truncate"
                                >
                                    {player.email}
                                </a>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 w-24">Téléphone:</span>
                                <a
                                    href={`tel:${player.phone}`}
                                    className="text-gray-700"
                                >
                                    {player.phone}
                                </a>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 w-24">Organisation:</span>
                                <span>ID {player.organizationId}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                        <button className="text-sm text-teal-600 font-medium hover:text-teal-700">
                            Voir le profil
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KPlayersList;