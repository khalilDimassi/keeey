import { useEffect, useState } from 'react';
import { BadgeCheck, Linkedin } from 'lucide-react';

const GuestInfo = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulate loading delay
		const timer = setTimeout(() => {
			setLoading(false);
		}, 300);

		return () => clearTimeout(timer);
	}, []);

	// Example data in French
	const exampleData = {
		profile: {
			id: "exemple-123",
			title: "Développeur Full Stack",
			description: "Développeur expérimenté avec 5 ans d'expérience",
			nationality: "Française",
			birthplace: "Paris, France",
			birthdate: "1990-05-15",
			driving_permit: "B, A1",
			linked_in: "linkedin.com/in/jean-dupont",
			created_at: "2023-01-15T10:30:00Z",
			updated_at: "2023-11-20T14:45:00Z",
		},
		user: {
			ID: "user-456",
			first_name: "Jean",
			last_name: "Dupont",
			email: "jean.dupont@exemple.com",
			phone: "+33 1 23 45 67 89",
			user_role: "utilisateur",
			gender: "M.",
			occupation: "Développeur Full Stack",
			address: "123 Avenue des Champs-Élysées",
			city: "Paris",
			zip: "75008",
			email_verified: true,
			verification_token: "",
			created_at: "2023-01-15T10:30:00Z",
			updated_at: "2023-11-20T14:45:00Z",
		},
		company: {
			name: "Société Example SARL",
			address: "456 Rue de la Paix, Paris",
			siret: "123 456 789 00012",
		}
	};

	if (loading) {
		const SimpleStatusCard = () => (
			<div className="p-5 rounded-xl border border-gray-200 bg-gray-50">
				<div className="flex items-center gap-2 mb-4">
					<div className="w-2 h-2 rounded-full bg-gray-300" />
					<div className="font-medium text-gray-500">Chargement...</div>
				</div>
				<div className="space-y-2 text-sm text-gray-500">
					<div className="h-4 bg-gray-200 rounded animate-pulse" />
					<div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
					<div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
				</div>
			</div>
		);

		return (
			<div className="w-full mx-auto relative pt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
				{[1, 2, 3, 4, 5, 6].map((key) => (
					<SimpleStatusCard key={key} />
				))}
			</div>
		);
	}

	return (
		<div className="w-full mx-auto relative grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white rounded-b-xl p-6 pt-14 shadow-md">
			{/* Basic Info */}
			<div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
				<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
					<div className="mt-1 w-2 h-2 bg-teal-500 rounded-full"></div>
					Informations personnelles
				</h3>
				<div className="space-y-3">
					<div className="flex gap-4">
						<div className="w-1/5">
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Civilité</label>
							<div className="mt-1 text-gray-800 font-medium">{exampleData.user.gender}</div>
						</div>
						<div className="w-2/5">
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom</label>
							<div className="mt-1 text-gray-800 font-medium">{exampleData.user.last_name}</div>
						</div>
						<div className="w-2/5">
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Prénom</label>
							<div className="mt-1 text-gray-800 font-medium">{exampleData.user.first_name}</div>
						</div>
					</div>
					<div>
						<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fonction</label>
						<div className="mt-1 text-gray-800 font-medium">{exampleData.user.occupation}</div>
					</div>
				</div>
			</div>

			{/* Contact Info */}
			<div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
				<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
					<div className="mt-1 w-2 h-2 bg-blue-500 rounded-full"></div>
					Contact
				</h3>
				<div className="space-y-3">
					<div>
						<div className="flex gap-1">
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
							<div className="-mt-0.5">
								<BadgeCheck
									size={20}
									strokeWidth={2}
									fill="#297280"
									color='white'
								/>
							</div>
						</div>
						<div className="mt-1 text-gray-800 font-medium">{exampleData.user.email}</div>
					</div>
					<div>
						<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Téléphone</label>
						<div className="mt-1 text-gray-800 font-medium">{exampleData.user.phone}</div>
					</div>
					<div>
						<div className="flex gap-2">
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">LinkedIn</label>
							<Linkedin
								size={20}
								strokeWidth={0}
								color="white"
								fill="#0077B5"
							/>
						</div>
						<div className="mt-1 text-gray-800 font-medium">{exampleData.profile.linked_in}</div>
					</div>
				</div>
			</div>

			{/* Organization Info */}
			<div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
				<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
					<div className="mt-1 w-2 h-2 bg-orange-500 rounded-full"></div>
					Informations de l'entreprise
				</h3>
				<div className="space-y-3">
					<div className="flex gap-4">
						<div className="w-1/2">
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom de l'Entreprise</label>
							<div className="mt-1 text-gray-800 font-medium">{exampleData.company.name}</div>
						</div>
						<div className="w-1/2">
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Adresse de l'Entreprise</label>
							<div className="mt-1 text-gray-800 font-medium">{exampleData.company.address}</div>
						</div>
					</div>
					<div>
						<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">SIREN/SIRET de l'Entreprise</label>
						<div className="mt-1 text-gray-800 font-medium">{exampleData.company.siret}</div>
					</div>
				</div>
			</div>

			{/* Address Info */}
			<div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
				<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
					<div className="mt-1 w-2 h-2 bg-purple-500 rounded-full"></div>
					Adresse
				</h3>
				<div className="space-y-3">
					<div>
						<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Rue</label>
						<div className="mt-1 text-gray-800 font-medium">{exampleData.user.address}</div>
					</div>
					<div className="flex gap-4">
						<div className="w-1/2">
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Code postal</label>
							<div className="mt-1 text-gray-800 font-medium">{exampleData.user.zip}</div>
						</div>
						<div className="w-1/2">
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ville</label>
							<div className="mt-1 text-gray-800 font-medium">{exampleData.user.city}</div>
						</div>
					</div>
				</div>
			</div>

			{/* Birth & Additional Info */}
			<div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
				<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
					<div className="mt-1 w-2 h-2 bg-orange-500 rounded-full"></div>
					Autres informations
				</h3>
				<div className="space-y-3">
					<div className="flex gap-4">
						<div className="w-1/2">
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date de naissance</label>
							<div className="mt-1 text-gray-800 font-medium">15/05/1990</div>
						</div>
						<div className="w-1/2">
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lieu de naissance</label>
							<div className="mt-1 text-gray-800 font-medium">{exampleData.profile.birthplace}</div>
						</div>
					</div>
					<div className="flex gap-4">
						<div className="w-1/2">
							<label className="block h-8 text-xs font-medium text-gray-500 uppercase tracking-wide">Nationalité</label>
							<div className="mt-1 text-gray-800 font-medium">{exampleData.profile.nationality}</div>
						</div>
						<div className="w-1/2">
							<label className="block h-8 text-xs font-medium text-gray-500 uppercase tracking-wide">Autorisation de travail en France</label>
							<div className="mt-1 text-gray-800 font-medium">Oui</div>
						</div>
					</div>
					<div>
						<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Permis de conduire</label>
						<div className="mt-1 text-gray-800 font-medium">{exampleData.profile.driving_permit}</div>
					</div>
				</div>
			</div>

			{/* Personal Documents */}
			<div className="relative bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
				{/* Stylish Work in Progress Overlay */}
				<div className="absolute inset-0 bg-gray-100/80 z-10 flex items-center justify-center overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,_#e5e7eb_0,_#e5e7eb_25px,_transparent_25px,_transparent_50px)] opacity-60"></div>
					</div>
					<div className="bg-white border-2 border-gray-300 px-8 py-4 rounded-xl shadow-lg z-10">
						<span className="text-l font-bold text-gray-700">EN COURS DE CONSTRUCTION</span>
					</div>
				</div>

				<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
					<div className="mt-1 w-2 h-2 bg-orange-500 rounded-full"></div>
					Documents personnels
				</h3>
				<div className="space-y-3">
					<div className="text-sm text-gray-500">Aucun document disponible en mode démo</div>
				</div>
			</div>
		</div>
	);
};

export default GuestInfo;