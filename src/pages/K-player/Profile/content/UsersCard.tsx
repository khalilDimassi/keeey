import { PenBox, Plus, Trash2, User, UserRound } from "lucide-react";
import { AddOrgMember, FetchOrgMembers } from "../services";
import { useEffect, useState } from "react";
import { OrgMember, Role } from "../types";

const UsersCard = ({ role }: { role: Role }) => {
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  useEffect(() => {
    const fetchOrgMembers = async () => {
      setLoading(true);
      setError(null);
      let data: OrgMember[] = [];
      try {
        data = await FetchOrgMembers();
        setOrgMembers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchOrgMembers();
  }, [setLoading, setError, setOrgMembers]);

  const closeForm = () => {
    if (!formTouched) {
      setShowForm(false);
    } else {
      if (confirm("Des modifications seront perdues. Fermer le formulaire ?")) {
        setShowForm(false);
        setFormTouched(false);
      }
    }
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
      <table className="w-full mt-2 border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2"></th>
            <th className="text-left p-2">Nom et prénom</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Téléphone</th>
            <th className="text-left p-2">Rôle</th>
            {role === "ADMIN" && <th className="text-left p-2"></th>}
          </tr>
        </thead>
        <tbody>
          {loading && (
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={`loading-${index}`} className="border-b">
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

          {!loading && !error && orgMembers.length === 0 && (
            <tr>
              <td colSpan={role === "ADMIN" ? 6 : 5} className="p-4 text-center">
                <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded">
                  No members found in this organization.
                </div>
              </td>
            </tr>
          )}

          {!loading && !error && orgMembers.length > 0 && (
            orgMembers.map(member => (
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
                      <PenBox size={24} className="transition-colors duration-100 hover:text-blue-700 cursor-pointer" onClick={() => {
                        console.log("> not implimented yet");
                      }} />
                      <Trash2 size={24} className="transition-colors duration-100 hover:text-red-700 cursor-pointer" onClick={() => {
                        console.log("> not implimented yet");
                      }} />
                    </div>
                  </td>
                }
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
          onClick={closeForm}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl animate-slide-in-up relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b-2 border-[#215A96] pb-2">
              <h2 className="text-lg font-semibold text-gray-700">Ajouter un utilisateur</h2>
              <button onClick={closeForm} className="text-gray-500 hover:text-red-700">
                <Trash2 size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                AddOrgMember({
                  first_name: form.first_name.value,
                  last_name: form.last_name.value,
                  email: form.email.value,
                  phone: form.phone.value,
                  gender: form.gender.value,
                  occupation: form.occupation.value,
                })

                setShowForm(false);
                setFormTouched(false);
              }}
              className="space-y-4"
            >
              {/* Gender */}
              <div className="flex items-center gap-6 pl-0.5">
                <label className="flex items-center gap-1">
                  <input type="radio" name="gender" value="male" onChange={() => setFormTouched(true)} />
                  <span className="text-sm">M.</span>
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="gender" value="female" onChange={() => setFormTouched(true)} />
                  <span className="text-sm">Mme</span>
                </label>
              </div>

              {/* Names */}
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Nom"
                  name="last_name"
                  className="w-1/2 border rounded-xl px-3 py-2 text-sm"
                  onChange={() => setFormTouched(true)}
                />
                <input
                  type="text"
                  placeholder="Prénom"
                  name="first_name"
                  className="w-1/2 border rounded-xl px-3 py-2 text-sm"
                  onChange={() => setFormTouched(true)}
                />
              </div>

              {/* Occupation */}
              <input
                type="text"
                placeholder="Fonction"
                name="occupation"
                className="w-full border rounded-xl px-3 py-2 text-sm"
                onChange={() => setFormTouched(true)}
              />

              {/* Email & Phone */}
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  className="w-1/2 border rounded-xl px-3 py-2 text-sm"
                  onChange={() => setFormTouched(true)}
                />
                <input
                  type="tel"
                  placeholder="Téléphone (optionnel)"
                  name="phone"
                  className="w-1/2 border rounded-xl px-3 py-2 text-sm"
                  onChange={() => setFormTouched(true)}
                />
              </div>

              <button
                type="submit"
                className="bg-[#215A96] flex items-center text-white mr-auto px-4 py-1 rounded-full h-fit hover:bg-blue-900 transition-all duration-200"
              >
                <Plus className="w-3 h-3 mr-1" /> Ajouter
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default UsersCard;