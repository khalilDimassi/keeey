import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

function GuestResume() {
	const [activeSection, setActiveSection] = useState("Profile");
	const [loading, setLoading] = useState(true);

	// Example data in French
	const exampleResumeData = {
		personalInfo: {
			first_name: "Jean",
			last_name: "Dupont",
			occupation: "Développeur Full Stack",
			email: "jean.dupont@exemple.com",
			phone: "+33 1 23 45 67 89",
			description: "Développeur expérimenté avec 5 ans d'expérience dans le développement web. Passionné par les technologies modernes et les défis techniques.",
			img: ""
		},
		trainings: [
			{
				id: "1",
				title: "Master en Informatique",
				institution: "Université Paris-Saclay",
				start_date: "2015-09-01",
				end_date: "2018-06-30",
				description: "Spécialisation en développement web et architectures distribuées"
			}
		],
		experiences: [
			{
				id: "1",
				title: "Développeur Full Stack",
				company: "Société Example",
				start_date: "2019-01-15",
				end_date: "2023-11-30",
				description: "Développement d'applications web avec React, Node.js et MongoDB"
			}
		],
		sectors: [
			{ id: "1", name: "Développement Web" },
			{ id: "2", name: "Applications Mobiles" }
		],
		languages: [
			{ id: "1", name: "Français", level: "Langue maternelle" },
			{ id: "2", name: "Anglais", level: "Courant" }
		],
		tools: [
			{ id: "1", name: "React" },
			{ id: "2", name: "Node.js" }
		],
		certifications: [
			{
				id: "1",
				title: "Certification AWS",
				institution: "Amazon Web Services",
				date: "2022-05-15"
			}
		],
		qualities: [
			{ id: "1", name: "Créatif" },
			{ id: "2", name: "Organisé" }
		],
		interests: [
			{ id: "1", name: "Photographie" },
			{ id: "2", name: "Voyages" }
		],
		projects: [
			{
				id: "1",
				title: "Application E-commerce",
				description: "Développement d'une plateforme de vente en ligne"
			}
		],
		authorizations: [
			{ id: "1", name: "Permis de travail UE" }
		]
	};

	useEffect(() => {
		// Simulate loading delay
		const timer = setTimeout(() => {
			setLoading(false);
		}, 300);

		return () => clearTimeout(timer);
	}, []);

	const obligatorySections = [
		"Profile",
		"Formations",
		"Expériences",
		"Compétences",
		"Langue"
	];

	const optionalSections = [
		"Outils",
		"Certificats",
		"Qualités",
		"Réalisations",
		"Autorisations",
		"Centre d'intérêt"
	];

	const isSectionEmpty = (section: string): boolean => {
		switch (section) {
			case "Profile":
				return !exampleResumeData.personalInfo?.description;
			case "Formations":
				return !exampleResumeData.trainings || exampleResumeData.trainings.length === 0;
			case "Expériences":
				return !exampleResumeData.experiences || exampleResumeData.experiences.length === 0;
			case "Compétences":
				return !exampleResumeData.sectors || exampleResumeData.sectors.length === 0;
			case "Langue":
				return !exampleResumeData.languages || exampleResumeData.languages.length === 0;
			case "Outils":
				return !exampleResumeData.tools || exampleResumeData.tools.length === 0;
			case "Certificats":
				return !exampleResumeData.certifications || exampleResumeData.certifications.length === 0;
			case "Qualités":
				return !exampleResumeData.qualities || exampleResumeData.qualities.length === 0;
			case "Centre d'intérêt":
				return !exampleResumeData.interests || exampleResumeData.interests.length === 0;
			case "Réalisations":
				return !exampleResumeData.projects || exampleResumeData.projects.length === 0;
			case "Autorisations":
				return !exampleResumeData.authorizations || exampleResumeData.authorizations.length === 0;
			default:
				return true;
		}
	};

	// Get sections that should be displayed (obligatory + non-empty optional)
	const visibleSections = [
		...obligatorySections,
		...optionalSections.filter(section => !isSectionEmpty(section))
	];

	const renderSection = () => {
		if (loading) {
			return <div className="text-gray-500">Chargement en cours...</div>;
		}

		switch (activeSection) {
			case "Profile":
				return (
					<div className="p-4 bg-gray-50 rounded-lg">
						<p className="text-gray-700">{exampleResumeData.personalInfo.description}</p>
					</div>
				);
			case "Formations":
				return (
					<div className="space-y-4">
						{exampleResumeData.trainings.map(training => (
							<div key={training.id} className="p-4 bg-gray-50 rounded-lg">
								<h3 className="font-semibold text-gray-800">{training.title}</h3>
								<p className="text-gray-600">{training.institution}</p>
								<p className="text-sm text-gray-500">{training.start_date} - {training.end_date}</p>
								<p className="mt-2 text-gray-700">{training.description}</p>
							</div>
						))}
					</div>
				);
			case "Expériences":
				return (
					<div className="space-y-4">
						{exampleResumeData.experiences.map(experience => (
							<div key={experience.id} className="p-4 bg-gray-50 rounded-lg">
								<h3 className="font-semibold text-gray-800">{experience.title}</h3>
								<p className="text-gray-600">{experience.company}</p>
								<p className="text-sm text-gray-500">{experience.start_date} - {experience.end_date}</p>
								<p className="mt-2 text-gray-700">{experience.description}</p>
							</div>
						))}
					</div>
				);
			case "Compétences":
				return (
					<div className="flex flex-wrap gap-2">
						{exampleResumeData.sectors.map(skill => (
							<span key={skill.id} className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
								{skill.name}
							</span>
						))}
					</div>
				);
			case "Langue":
				return (
					<div className="space-y-3">
						{exampleResumeData.languages.map(language => (
							<div key={language.id} className="flex justify-between items-center p-2">
								<span className="font-medium text-gray-700">{language.name}</span>
								<span className="text-sm text-gray-500">{language.level}</span>
							</div>
						))}
					</div>
				);
			case "Outils":
				return (
					<div className="flex flex-wrap gap-2">
						{exampleResumeData.tools.map(tool => (
							<span key={tool.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
								{tool.name}
							</span>
						))}
					</div>
				);
			case "Certificats":
				return (
					<div className="space-y-3">
						{exampleResumeData.certifications.map(cert => (
							<div key={cert.id} className="p-3 bg-gray-50 rounded-lg">
								<h3 className="font-semibold text-gray-800">{cert.title}</h3>
								<p className="text-gray-600">{cert.institution}</p>
								<p className="text-sm text-gray-500">{cert.date}</p>
							</div>
						))}
					</div>
				);
			case "Qualités":
				return (
					<div className="flex flex-wrap gap-2">
						{exampleResumeData.qualities.map(quality => (
							<span key={quality.id} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
								{quality.name}
							</span>
						))}
					</div>
				);
			case "Centre d'intérêt":
				return (
					<div className="flex flex-wrap gap-2">
						{exampleResumeData.interests.map(interest => (
							<span key={interest.id} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
								{interest.name}
							</span>
						))}
					</div>
				);
			case "Réalisations":
				return (
					<div className="space-y-3">
						{exampleResumeData.projects.map(project => (
							<div key={project.id} className="p-3 bg-gray-50 rounded-lg">
								<h3 className="font-semibold text-gray-800">{project.title}</h3>
								<p className="text-gray-700">{project.description}</p>
							</div>
						))}
					</div>
				);
			case "Autorisations":
				return (
					<div className="flex flex-wrap gap-2">
						{exampleResumeData.authorizations.map(auth => (
							<span key={auth.id} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
								{auth.name}
							</span>
						))}
					</div>
				);
			default:
				return <div className="text-gray-500">Section en construction...</div>;
		}
	};

	return (
		<div className="w-full bg-white rounded-b-xl p-6 shadow-md min-h-[75vh]">
			<div className="flex gap-8">
				{/* Left Column - Navigation */}
				<div className="w-1/5">
					<div className="flex-row space-y-2 my-2">
						<div className="bg-gray-100 text-gray-500 px-4 w-full py-2 rounded-3xl border border-gray-300 cursor-not-allowed">
							Télécharger un CV existant
						</div>
						<div className="bg-gray-100 text-gray-500 px-4 w-full py-2 rounded-3xl border border-gray-300 cursor-not-allowed">
							Importer votre profil LinkedIn
						</div>
					</div>

					<div className="space-y-2">
						{visibleSections.map((section, index) => {
							const isObligatory = obligatorySections.includes(section);
							const isEmpty = isSectionEmpty(section);
							const showPulse = isObligatory && isEmpty;

							return (
								<div
									key={index}
									className={`w-full flex items-center justify-between p-4 rounded-2xl cursor-pointer
                    ${activeSection === section ?
											"bg-[#297280] text-white" :
											"bg-white text-gray-700"
										}`}
									onClick={() => { setActiveSection(section); }}
								>
									<div className="flex items-center gap-3">
										{showPulse && (
											<div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
										)}
										<span>{section}</span>
									</div>
									<ChevronDown size={20} />
								</div>
							);
						})}
					</div>
				</div>

				{/* Right Column - Dynamic Content */}
				<div className="w-4/5">
					{/* Header Section */}
					<div className="flex flex-col sm:flex-row items-center gap-6 p-4 m-2 rounded-xl border shadow-sm transition-all duration-100">
						<div className="relative w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center shadow-lg ring-4 ring-[#297280]">
							<div className="text-[#297280] font-medium">Photo</div>
						</div>
						<div className="text-center sm:text-left">
							<h2 className="text-2xl font-bold text-gray-800">{exampleResumeData.personalInfo.first_name} {exampleResumeData.personalInfo.last_name}</h2>
							<div className="text-lg text-teal-600 font-medium">{exampleResumeData.personalInfo.occupation}</div>
							<div className="text-gray-600 mt-1">{exampleResumeData.personalInfo.email} | {exampleResumeData.personalInfo.phone}</div>
						</div>
					</div>

					{/* Data Section */}
					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-lg font-medium">{activeSection}</h2>
						</div>
						{renderSection()}
					</div>
				</div>
			</div>
		</div>
	);
}

export default GuestResume;