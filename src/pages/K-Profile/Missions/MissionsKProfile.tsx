import { addMission, deleteMission, fetchMissionDetails, fetchMissions, requestCRA, requestInvoice, updateMission } from "./services";
import { TargetSVG } from "../../components/SVGcomponents";
import { Mission, DetailedMission } from "./types";
import { Star, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

import NewMissionForm from "./content/NewMissionForm";
import MissionDetails from "./content/MissionDetails";
import MissionsTable from "./content/MissionsTable";

const MissionsKProfile = () => {
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
    const loadMissions = async () => {
      setMissionsLoading(true);
      setMissionsError(null);
      try {
        const data = await fetchMissions();
        setMissions(data);
      } catch (err) {
        setMissionsError(err instanceof Error ? err.message : 'Failed to load missions');
      } finally {
        setMissionsLoading(false);
      }
    };

    loadMissions();
  }, [setMissionsLoading, setMissionsError, setMissions]);

  useEffect(() => {
    if (selectedMissionId !== null) {
      const loadMission = async () => {
        setMissionLoading(true);
        setMissionError(null);
        try {
          const data = await fetchMissionDetails(selectedMissionId);
          setMission(data);
        } catch (err) {
          setMissionError(err instanceof Error ? err.message : 'Failed to load mission details');
        } finally {
          setMissionLoading(false);
        }
      };

      loadMission();
    }
  }, [selectedMissionId, setMissionLoading, setMissionError, setMission]);

  const handleAddMission = async () => {
    setOperationLoading(true);
    setOperationError(null);
    setSuccessMessage(null);

    try {
      await addMission(newMission);
      setSuccessMessage('Mission added successfully!');
      // Refresh missions list
      const updatedMissions = await fetchMissions();
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
        invoices: []
      });
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : 'Failed to add mission');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleUpdateMission = async () => {
    if (!mission) return;

    setOperationLoading(true);
    setOperationError(null);
    setSuccessMessage(null);

    try {
      await updateMission(mission);
      setSuccessMessage('Mission updated successfully!');
      // Refresh missions list and details
      const updatedMissions = await fetchMissions();
      setMissions(updatedMissions);
      const updatedMission = await fetchMissionDetails(mission.id);
      setMission(updatedMission);
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : 'Failed to update mission');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteMission = async (id: number) => {
    setOperationLoading(true);
    setOperationError(null);
    setSuccessMessage(null);

    try {
      await deleteMission(id);
      setSuccessMessage('Mission deleted successfully!');
      // Refresh missions list
      const updatedMissions = await fetchMissions();
      setMissions(updatedMissions);
      // Clear selected mission if it was the deleted one
      if (selectedMissionId === id) {
        setSelectedMissionId(null);
        setMission(null);
      }
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : 'Failed to delete mission');
    } finally {
      setOperationLoading(false);
    }
  };


  const handleRequestCRA = async (id: number) => {
    setOperationLoading(true);
    setOperationError(null);
    setSuccessMessage(null);

    try {
      await requestCRA(id);
      setSuccessMessage('CRA requested successfully!');
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : 'Failed to request CRA');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleRequestInvoice = async (id: number) => {
    setOperationLoading(true);
    setOperationError(null);
    setSuccessMessage(null);

    try {
      await requestInvoice(id);
      setSuccessMessage('Invoice requested successfully!');
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : 'Failed to request invoice');
    } finally {
      setOperationLoading(false);
    }
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
            <TargetSVG size={40} color="#297280" />
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
                <span className="bg-green-200 text-green-600 px-4 py-1 rounded-md text-xs">
                  {(mission?.status ?? "-")}
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
                    className={`${index < (mission?.satisfaction ?? 0) ?
                      "text-yellow-500" :
                      "text-gray-300"
                      }`}
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
            loading={missionLoading}
          />
        )}
      </div>
    </div>
  );
};

export default MissionsKProfile;