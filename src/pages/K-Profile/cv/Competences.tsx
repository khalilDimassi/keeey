import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import { getAuthHeader } from "../../../utils/jwt";

import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";

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


const getSkillLevel = (seniority: number): string => {
  if (seniority <= 33) return "Beginner";
  if (seniority <= 66) return "Intermediate";
  return "Master";
};

const getSkillLevelColor = (level: string): string => {
  switch (level) {
    case "Beginner": return "text-blue-600";
    case "Intermediate": return "text-green-600";
    case "Master": return "text-red-600";
    default: return "text-gray-600";
  }
};

const Competences = ({ data, onDataDeleted }: { data: Sector[], onDataDeleted: () => void }) => {
  const [sectors, setSectors] = useState<Sector[]>(data ?? []);

  const handleDeleteSkill = async (skillName: string) => {
    try {
      // Prepare the new list of skills to keep
      const remainingSkills = sectors.flatMap(sector =>
        sector.jobs.flatMap(job =>
          job.skills
            .filter(skill => skill.name !== skillName)
            .map(skill => skill.name)
        )
      );

      // Send delete request
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/skill/v2`,
        { skills: remainingSkills },
        { headers: getAuthHeader() }
      );

      // Update local state by removing the skill
      const updatedSectors = sectors.map(sector => ({
        ...sector,
        jobs: sector.jobs.map(job => ({
          ...job,
          skills: job.skills.filter(skill => skill.name !== skillName)
        }))
      }));

      setSectors(updatedSectors);
      onDataDeleted();
    } catch (error) {
      console.error("Error deleting skill:", error);
      // Optional: Add error handling UI
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
            <AccordionItem
              key={sector.id}
              value={`sector-${sector.id}`}
              className="border border-gray-200 rounded-md"
            >
              <AccordionTrigger className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors">
                <span className="text-lg font-semibold text-gray-700">{sector.name}</span>
              </AccordionTrigger>
              <AccordionContent className="p-2">
                {sector.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white shadow-sm rounded-md mb-2 p-3"
                  >
                    <div className="font-medium text-gray-600 mb-2">{job.name}</div>
                    <div className="space-y-1">
                      {job.skills.map((skill) => {
                        const skillLevel = getSkillLevel(skill.seniority);
                        const levelColor = getSkillLevelColor(skillLevel);
                        return (
                          <div
                            key={skill.id}
                            className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-sm"
                          >
                            <div className="flex items-center">
                              <span className="mr-2">{skill.name}</span>
                              <span className={`text-sm ${levelColor}`}>
                                ({skillLevel})
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
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

export default Competences;