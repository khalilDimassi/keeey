import { ChevronsUpDown, ChevronUp, ChevronDown, Plus, UserRound, User, PenBox, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { FetchOrgMembers, AddOrgMember } from "../services";
import { Role, OrgMember } from "../types";
import MemberForm from "./MemberForm";

const UsersCard = ({ role }: { role: Role }) => {
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<OrgMember | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof OrgMember | 'name' | 'email_status'; direction: 'asc' | 'desc'; } | null>(null);

  const fetchOrgMembers = async () => {
    setLoading(true);
    setError(null);
    let data: OrgMember[] = [];
    try {
      data = await FetchOrgMembers();
      if (data) {
        setOrgMembers(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgMembers();
  }, []);

  const handleUpdateMember = async (memberData: Omit<OrgMember, 'ID'>) => {
    // TODO: to be implimented
    console.log("Updating member:", editingMember?.first_name, memberData);
    fetchOrgMembers();
    setEditingMember(null);
  };

  const handleDeleteMember = async () => {
    // TODO: to be implimented
    console.log("Deleting member:", editingMember?.first_name);
    fetchOrgMembers();
    setEditingMember(null);
  };

  const requestSort = (key: keyof OrgMember | 'name' | 'email_status') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedMembers = () => {
    if (!sortConfig) return orgMembers;

    return [...orgMembers].sort((a, b) => {
      // Handle name sorting (combine first and last name)
      if (sortConfig.key === 'name') {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        if (nameA < nameB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (nameA > nameB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }

      // Handle email verification status
      if (sortConfig.key === 'email_status') {
        if (a.email_verified === b.email_verified) return 0;
        if (sortConfig.direction === 'asc') {
          return a.email_verified ? 1 : -1;
        } else {
          return a.email_verified ? -1 : 1;
        }
      }

      // Handle other fields
      const aValue = a[sortConfig.key as keyof OrgMember];
      const bValue = b[sortConfig.key as keyof OrgMember];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === '') return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue === null || bValue === '') return sortConfig.direction === 'asc' ? -1 : 1;

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedMembers = getSortedMembers();

  const getSortIcon = (key: keyof OrgMember | 'name' | 'email_status') => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronsUpDown size={16} className="inline ml-1 opacity-30" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={16} className="inline ml-1" />
    ) : (
      <ChevronDown size={16} className="inline ml-1" />
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-2 border-b-2 border-[#215A96] pb-3">
        <h2 className="text-lg font-semibold">Membres de l'Entreprise</h2>
        {role === "ADMIN" && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-xl bg-[#215A96]"
          >
            <Plus size={16} /> Ajouter
          </button>
        )}
      </div>
      <table className="w-full mt-2">
        <thead>
          <tr className="border-b">
            <th className="p-2"></th>
            <th className="text-left p-2">
              <button
                onClick={() => requestSort('name')}
                className="flex items-center hover:text-[#215A96]"
              >
                Nom et prénom
                {getSortIcon('name')}
              </button>
            </th>
            <th className="text-left p-2">
              <button
                onClick={() => requestSort('email_status')}
                className="flex items-center hover:text-[#215A96]"
              >
                Email
                {getSortIcon('email_status')}
              </button>
            </th>
            <th className="text-left p-2">
              <button
                onClick={() => requestSort('phone')}
                className="flex items-center hover:text-[#215A96]"
              >
                Téléphone
                {getSortIcon('phone')}
              </button>
            </th>
            <th className="text-left p-2">
              <button
                onClick={() => requestSort('occupation')}
                className="flex items-center hover:text-[#215A96]"
              >
                Rôle
                {getSortIcon('occupation')}
              </button>
            </th>
            {role === "ADMIN" && <th className="text-left p-2"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading && (
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={`loading-${index}`}>
                <td className="p-2">
                  <div className="w-11 h-11 rounded-full bg-gray-300 animate-pulse mx-auto"></div>
                </td>
                <td className="p-2">
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4 mx-auto"></div>
                </td>
                <td className="p-2">
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4 mx-auto"></div>
                </td>
                <td className="p-2">
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4 mx-auto"></div>
                </td>
                <td className="p-2">
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4 mx-auto"></div>
                </td>
                {role === "ADMIN" && (
                  <td className="p-2">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                      <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}

          {error && (
            <tr>
              <td colSpan={role === "ADMIN" ? 6 : 5} className="p-4 text-center">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  Failed to load members. Please try again.
                </div>
              </td>
            </tr>
          )}

          {!loading && !error && (orgMembers ? (orgMembers.length ?? 0) === 0 : true) && (
            <tr>
              <td colSpan={role === "ADMIN" ? 6 : 5} className="p-4 text-center">
                <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded">
                  No members found in this organization.
                </div>
              </td>
            </tr>
          )}

          {!loading && !error && (orgMembers ? (orgMembers.length ?? 0) > 0 : false) && (
            sortedMembers.map(member => (
              <tr key={member.ID} className="border-b">
                <td className="p-2">
                  <div
                    title={member.gender === "female" ? "Femme" : "Homme"}
                    className="w-11 h-11 rounded-full mx-auto flex items-center justify-center transition-all duration-200 hover:scale-110 relative"
                  >
                    <div className="absolute inset-0 rounded-full border-4 border-[#215A96]"></div>
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center z-10">
                      {member.gender === "female" ? (
                        <UserRound size={28} strokeWidth={2.3} color="#EC4899" />
                      ) : (
                        <User size={28} strokeWidth={2.3} color="#3B82F6" />
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-2 font-semibold">{member.first_name} {member.last_name}</td>
                <td className="p-2 relative group">
                  <span className={`font-semibold ${member.email_verified
                    ? 'text-green-800'
                    : 'text-red-800 animate-pulse'
                    }`}
                  >
                    {member.email}
                  </span>
                  {member.email_verified ? (
                    <span className="absolute left-1 mb-1 hidden group-hover:block px-2 py-1 text-xs bg-green-100 text-green-800 rounded whitespace-nowrap">
                      Vérifié
                    </span>
                  ) : (
                    <span className="absolute left-1 mb-1 hidden group-hover:block px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded whitespace-nowrap">
                      Toujours non vérifié
                    </span>
                  )}
                </td>
                <td className="p-2 font-semibold">{(member.phone && member.phone !== "") ? member.phone : "-"}</td>
                <td className="p-2 font-semibold">{(member.occupation && member.occupation !== "") ? member.occupation : "-"}</td>
                {role === "ADMIN" &&
                  <td className="p-2">
                    <div className="flex gap-2">
                      <PenBox
                        size={24}
                        className="transition-colors duration-100 text-[#215A96] hover:text-blue-900 hover:scale-110 cursor-pointer"
                        onClick={() => {
                          setEditingMember(member);
                          setShowForm(true);
                        }}
                      />
                      <Trash2
                        size={24}
                        className="transition-colors duration-100 text-[#215A96] hover:text-red-700 hover:scale-110 cursor-pointer"
                        onClick={() => {
                          if (confirm(`Êtes-vous sûr de vouloir supprimer ${member.first_name} ${member.last_name} ?`)) {
                            console.log("Delete member:", member.ID);
                            fetchOrgMembers();
                          }
                        }}
                      />
                    </div>
                  </td>
                }
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showForm && (
        <MemberForm
          mode={editingMember ? 'edit' : 'add'}
          member={editingMember || undefined}
          onClose={() => {
            setShowForm(false);
            setEditingMember(null);
          }}
          onSubmit={editingMember ? handleUpdateMember : AddOrgMember}
          onDelete={editingMember ? handleDeleteMember : undefined}
        />
      )}
    </>
  );
}

export default UsersCard;