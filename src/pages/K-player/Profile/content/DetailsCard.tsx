import { Check, Pencil, X } from "lucide-react"
import { Profile } from "../types";
import { FC, useState } from "react";
import { UpdateKplayerProfile } from "../services";

interface DetailsCardProps {
  profile: Profile | null;
  loading?: boolean;
  error?: string | null;
  onDataUpdate?: () => void;
}

const DetailsCard: FC<DetailsCardProps> = ({ profile, loading = false, error = null, onDataUpdate }) => {
  if (loading) {
    return (
      <div className="shadow bg-white rounded-lg p-4 animate-pulse"
        style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
          <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shadow bg-white rounded-lg p-4 text-center"
        style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}>
        <div className="text-red-500 mb-2">⚠️ Error loading profile</div>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="shadow bg-white rounded-lg p-4 text-center"
        style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}>
        <p className="text-gray-500">No profile data available</p>
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile['user']>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleEditClick = () => {
    if (isEditing) {
      handleSave();
    } else {
      setFormData({
        first_name: profile.user.first_name,
        last_name: profile.user.last_name,
        phone: profile.user.phone,
        occupation: profile.user.occupation,
      });
      setIsEditing(true);
      setSubmitError(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await UpdateKplayerProfile(formData);

      // Exit edit mode
      setIsEditing(false);
      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (err) {
      setSubmitError((err as any).response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSubmitError(null);
  };

  return (
    <div className="shadow bg-white rounded-lg p-4"
      style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Mon profil</h2>
        <span className="text-sm bg-blue-100 text-[#215A96] px-8 py-1 rounded-xl font-bold">
          {profile.profile.player_role === 'ADMIN' ? 'Administrateur' : 'Employé'}
        </span>
        <>
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="text-gray-600 hover:text-red-800 disabled:opacity-50"
                disabled={isSubmitting}
              >
                <X size={16} />
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="text-gray-600 hover:text-green-800 disabled:opacity-50"
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleEditClick}
              disabled={isSubmitting}
              className="text-[#215A96] hover:text-blue-800 disabled:opacity-50"
            >
              <Pencil size={16} />
            </button>
          )}
        </>
      </div>

      {submitError && isEditing && (
        <div className="mb-4 text-red-500 text-sm">{submitError}</div>
      )}

      <div className="relative flex items-center gap-4">
        {profile.user.pfp ? (
          <img
            src={profile.user.pfp}
            alt="Entreprise"
            className="w-16 h-16 rounded-full border border-gray-300 object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-16 h-16 rounded-full border border-gray-300 bg-blue-100 text-blue-600 font-semibold text-xl">
            {profile.user.first_name?.charAt(0).toUpperCase() + profile.user.last_name?.charAt(0).toUpperCase() || 'KP'}
          </div>
        )}
        <div>
          {isEditing ? (
            <>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </>
          ) : (
            <>
              <p className="font-semibold">Nom: {profile.user.last_name}</p>
              <p className="font-semibold">Prénom: {profile.user.first_name}</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {isEditing ? (
          <> </>
        ) : (
          <p><strong>Email professionnel: </strong>{profile.user.email}</p>
        )}

        {isEditing ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fonction</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
          </>
        ) : (
          <>
            <p><strong>Numéro de téléphone: </strong>{profile.user.phone || '-'}</p>
            <p><strong>Fonction: </strong>{profile.user.occupation || '-'}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailsCard;