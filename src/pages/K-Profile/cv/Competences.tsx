import axios from "axios";
import { Trash } from "lucide-react";
import { getAuthHeader } from "../../../utils/jwt";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { useState, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { Key } from "readline";


interface Skill {
  id: number;
  name: string;
  seniority: number;
}

interface Job {
  id: number;
  name: string;
  skills: Skill[];
}

interface Sector {
  id: number;
  name: string;
  jobs: Job[];
}

const seniorityLevels = [
  { level: 1, name: "Junior", description: "1 - 4 ans" },
  { level: 2, name: "Mid-Level", description: "5 - 9 ans" },
  { level: 3, name: "Senior", description: "10 - 14 ans" },
  { level: 4, name: "Lead", description: "15 - 19 ans" },
  { level: 5, name: "Principal", description: "20+ ans" },
];

const getSkillLevel = (seniority: number) => {
  const level = seniorityLevels.find((s) => s.level === seniority);
  return level ? level.name : "Unknown";
};

const getSkillLevelColor = (level: string) => {
  switch (level) {
    case "Junior": return "text-blue-600";
    case "Mid-Level": return "text-green-600";
    case "Senior": return "text-yellow-600";
    case "Lead": return "text-orange-600";
    case "Principal": return "text-red-600";
    default: return "text-gray-600";
  }
};

const Competences = ({ data, onDataDeleted }: { data: Sector[], onDataDeleted: () => void }) => {
  const [sectors, setSectors] = useState(data ?? []);

  const handleDeleteSkill = async (skillName: any) => {
    try {
      const remainingSkills = sectors.flatMap(sector =>
        (sector.jobs ?? []).flatMap((job: { skills: any; }) =>
          (job.skills ?? [])
            .filter((skill: { name: any; }) => skill.name !== skillName)
            .map((skill: { name: any; }) => skill.name)
        )
      );

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/skill/v2`,
        { skills: remainingSkills },
        { headers: getAuthHeader() }
      );

      const updatedSectors: Sector[] = sectors.map(sector => ({
        ...sector,
        jobs: (sector.jobs ?? []).map(job => ({
          ...job,
          skills: (job.skills ?? []).filter(skill => skill.name !== skillName)
        }))
      }));

      setSectors(updatedSectors);
      onDataDeleted();
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Skill Competency</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-2">
          {sectors.map((sector) => (
            <AccordionItem key={sector.id} value={`sector-${sector.id}`} className="border border-gray-200 rounded-md">
              <AccordionTrigger className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors">
                <span className="text-lg font-semibold text-gray-700">{sector.name}</span>
              </AccordionTrigger>
              <AccordionContent className="p-2">
                {sector.jobs?.map((job) => (
                  job && (
                    <div
                      key={job.id.toString()} // Ensure key is a string
                      className="bg-white shadow-sm rounded-md mb-2 p-3"
                    >
                      <div className="font-medium text-gray-600 mb-2">{job.name}</div>
                      <div className="space-y-1">
                        {job.skills?.map((skill) => {
                          if (!skill) return null; // Prevent mapping over null skills
                          const seniorityInfo = seniorityLevels.find((s) => s.level === skill.seniority) || { name: "Unknown", description: "" };
                          return (
                            <div
                              key={skill.id.toString()} // Ensure key is a string
                              className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-sm"
                            >
                              <div className="flex items-center">
                                <span className="mr-2">{skill.name}</span>
                                <span className={`text-sm text-gray-600`}>
                                  ({seniorityInfo.name} - {seniorityInfo.description})
                                </span>
                              </div>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleDeleteSkill(skill.name)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default Competences;
