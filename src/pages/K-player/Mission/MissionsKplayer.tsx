import { addInvoice, addMission, deleteMission, fetchMissionDetails, fetchMissions, requestCRA, requestInvoice, updateMission } from "./services";
import { TargetSVG } from "../../components/SVGcomponents";
import { Mission, DetailedMission, Invoice } from "./types";
import { Star, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

import NewMissionForm from "./content/NewMissionForm";
import MissionDetails from "./content/MissionDetails";
import MissionsTable from "./content/MissionsTable";

const MissionsKplayer = () => {
  // State for UI feedback
  const [operationLoading, setOperationLoading] = useState<boolean>(false);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State for missions list
  const [missions, setMissions] = useState<Mission[]>([]);
  const [missionsLoading, setMissionsLoading] = useState<boolean>(false);
  const [missionsError, setMissionsError] = useState<string | null>(null);

  // State for selected mission
  const [selectedMissionId, setSelectedMissionId] = useState<number | null>(null);
  const [mission, setMission] = useState<DetailedMission | null>(null);
  const [missionLoading, setMissionLoading] = useState<boolean>(false);
  const [missionError, setMissionError] = useState<string | null>(null);

  // State for form
  const [newMission, setNewMission] = useState<Omit<DetailedMission, 'id'>>({
    status: 'ONGOING',
    company: '',
    contact: '',
    title: '',
    start: '',
    end: '',
    rate: '',
    satisfaction: 0,
    invoices: []
  });

  useEffect(() => {
    setMissionsLoading(true);
    setMissionsError(null);
    fetchMissions()
      .then(data => setMissions(data))
      .catch(err => {
        setMissions([]);
        setMissionsError(err instanceof Error ? err.message : 'Failed to load missions')
      })
      .finally(() => setMissionsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedMissionId !== null) {
      setMissionLoading(true);
      setMissionError(null);
      fetchMissionDetails(selectedMissionId)
        .then(data => setMission(data))
        .catch(err => {
          setMission(null);
          setMissionError(err instanceof Error ? err.message : 'Failed to load mission details')
        })
        .finally(() => setMissionLoading(false));
    }
  }, [selectedMissionId]);

  const handleAddMission = () => {
    setOperationLoading(true);
    setOperationError(null);
    setSuccessMessage(null);

    addMission(newMission)
      .then(() => {
        setSuccessMessage('Mission added successfully!');
        // Refresh missions list
        return fetchMissions();
      })
      .then((updatedMissions) => {
        setMissions(updatedMissions);
        // Reset form
        setNewMission({
          status: 'ONGOING',
          company: '',
          contact: '',
          title: '',
          start: '',
          end: '',
          rate: '',
          satisfaction: 0,
          invoices: [],
        });
      })
      .catch((err) => {
        setOperationError(err instanceof Error ? err.message : 'Failed to add mission');
      })
      .finally(() => {
        setOperationLoading(false);
      });
  };

  const handleUpdateMission = () => {
    if (!mission) return;

    setOperationLoading(true);
    setOperationError(null);
    setSuccessMessage(null);

    updateMission(mission)
      .then(() => {
        setSuccessMessage('Mission updated successfully!');
        // Refresh missions list and details in parallel
        return Promise.all([fetchMissions(), fetchMissionDetails(mission.id)]);
      })
      .then(([updatedMissions, updatedMission]) => {
        setMissions(updatedMissions);
        setMission(updatedMission);
      })
      .catch((err) => {
        setOperationError(err instanceof Error ? err.message : 'Failed to update mission');
      })
      .finally(() => {
        setOperationLoading(false);
      });
  };

  const handleDeleteMission = (id: number) => {
    setOperationLoading(true);
    setOperationError(null);
    setSuccessMessage(null);

    deleteMission(id)
      .then(() => {
        setSuccessMessage('Mission deleted successfully!');
        return fetchMissions();
      })
      .then((updatedMissions) => {
        setMissions(updatedMissions);
        if (selectedMissionId === id) {
          setSelectedMissionId(null);
          setMission(null);
        }
      })
      .catch((err) => {
        setOperationError(err instanceof Error ? err.message : 'Failed to delete mission');
      })
      .finally(() => {
        setOperationLoading(false);
      });
  };

  const handleRequestCRA = (id: number) => {
    setOperationLoading(true);
    setOperationError(null);
    setSuccessMessage(null);

    requestCRA(id)
      .then(() => {
        setSuccessMessage('CRA requested successfully!');
      })
      .catch((err) => {
        setOperationError(err instanceof Error ? err.message : 'Failed to request CRA');
      })
      .finally(() => {
        setOperationLoading(false);
      });
  };

  const handleRequestInvoice = (id: number) => {
    setOperationLoading(true);
    setOperationError(null);
    setSuccessMessage(null);

    requestInvoice(id)
      .then(() => {
        setSuccessMessage('Invoice requested successfully!');
      })
      .catch((err) => {
        setOperationError(err instanceof Error ? err.message : 'Failed to request invoice');
      })
      .finally(() => {
        setOperationLoading(false);
      });
  };

  const handleAddInvoice = (newInvoice: Invoice) => {
    setOperationLoading(true);
    setOperationError(null);
    setSuccessMessage(null);

    addInvoice(newInvoice)
      .then(() => {
        setSuccessMessage('Invoice added successfully!');
        return fetchMissionDetails(newInvoice.mission_id);
      })
      .then((updatedMission) => {
        setMission(updatedMission);
      })
      .catch((err) => {
        setOperationError(err instanceof Error ? err.message : 'Failed to add invoice');
      })
      .finally(() => {
        setOperationLoading(false);
      });
  };

  const MessageWithDismiss = ({ message, type, prefix = '', onDismiss }: { message: string; type: 'error' | 'success'; prefix?: string; onDismiss: () => void; }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onDismiss();
      }, 10000);

      return () => clearTimeout(timer);
    }, [onDismiss]);

    const bgColor = type === 'error' ? 'bg-red-50' : 'bg-green-50';
    const textColor = type === 'error' ? 'text-red-500' : 'text-green-500';

    return (
      <div className={`${textColor} p-2 ${bgColor} rounded flex justify-between items-centers`}>
        <span>
          {prefix && <span className="font-semibold">{prefix} </span>}
          {message}
        </span>
        <button
          onClick={onDismiss}
          className="ml-4 text-gray-500 hover:text-gray-700"
          aria-label="Dismiss message"
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          {!selectedMissionId && <>
            <TargetSVG size={40} color="#215A96" />
            <h1 className="text-xl font-semibold">Missions</h1>
          </>}
          {selectedMissionId && <div className="flex items-center gap-2">
            <ArrowLeft cursor={"pointer"} size={20} onClick={() => setSelectedMissionId(null)} />
            <h1 className="text-xl font-semibold">Détails de la mission</h1>
          </div>}
        </div>
        {!selectedMissionId && (
          <NewMissionForm
            newMission={newMission}
            setNewMission={setNewMission}
            onSubmit={handleAddMission}
            loading={operationLoading}
          />
        )}
      </div>

      {/* Status messages */}
      {(missionsError || missionError || operationError || successMessage) && (
        <div className="mb-4">
          {missionsError && (<MessageWithDismiss message={missionsError} type="error" prefix="Missions Error:" onDismiss={() => setMissionsError(null)} />)}
          {missionError && (<MessageWithDismiss message={missionError} type="error" prefix="Mission Error:" onDismiss={() => setMissionError(null)} />)}
          {operationError && (<MessageWithDismiss message={operationError} type="error" prefix="Operation Error:" onDismiss={() => setOperationError(null)} />)}
          {successMessage && (<MessageWithDismiss message={successMessage} type="success" onDismiss={() => setSuccessMessage(null)} />)}
        </div>
      )}

      {/* Mission  details */}
      {selectedMissionId && (
        <table className="w-[80%] my-2">
          <thead>
            <tr className="text-gray-500 text-xs text-center">
              <td className="">État</td>
              <td className="">Société</td>
              <td className="">Contact</td>
              <td className="">Titre</td>
              <td className="">Démarrage</td>
              <td className="">Fin</td>
              <td className="">TJM</td>
              <td className="">Satisfaction (Note)</td>
            </tr>
          </thead>
          <tbody>
            <tr className="text-xs text-center">
              <td className="p-3">
                <span className={`px-4 py-1 text-xs rounded-full ${mission?.status === "ONGOING" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {mission?.status === "ONGOING" ? "En cours" : "Terminée"}
                </span>
              </td>
              <td className="p-3">{(mission?.company ?? "-")}</td>
              <td className="p-3">{(mission?.contact ?? "-")}</td>
              <td className="p-3">{(mission?.title ?? "-")}</td>
              <td className="p-3">{(mission?.start ?? "-")}</td>
              <td className="p-3">{(mission?.end ?? "-")}</td>
              <td className="p-3">{(mission?.rate ?? "0.0")}</td>
              <td className="p-3 flex flex-row justify-center">
                {Array(5).fill(0).map((_, index) => (
                  <Star
                    key={index}
                    size={20}
                    fill={index < mission?.satisfaction! ? "#EAB308" : "none"}
                    className={`${index < mission?.satisfaction! ? "text-[#EAB308]" : "text-[#D1D5DB]"}`}
                  />
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Main content */}
      <div className="w-full bg-white p-4 rounded-xl shadow-md">
        {selectedMissionId === null ? (
          <MissionsTable
            missions={missions}
            onSelectMission={(missionId: number) => setSelectedMissionId(missionId)}
            onDelete={handleDeleteMission}
            loading={missionsLoading}
          />
        ) : (
          <MissionDetails
            mission={mission as DetailedMission}
            handleCRA={handleRequestCRA}
            handleInvoice={handleRequestInvoice}
            handleAddInvoice={handleAddInvoice}
            loading={missionLoading}
          />
        )}
      </div>
    </div>
  );
};

export default MissionsKplayer;