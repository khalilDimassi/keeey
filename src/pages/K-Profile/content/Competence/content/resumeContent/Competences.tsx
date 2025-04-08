import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../../../components/ui/accordion";
import { useState } from "react";
import { Sector } from "../../types";

// TODO: api change: seniority for sectors, no delete request. 

// const seniorityLevels = [
//   { level: 1, name: "Junior", description: "1 - 4 ans" },
//   { level: 2, name: "Mid-Level", description: "5 - 9 ans" },
//   { level: 3, name: "Senior", description: "10 - 14 ans" },
//   { level: 4, name: "Lead", description: "15 - 19 ans" },
//   { level: 5, name: "Principal", description: "20+ ans" },
// ];

// const getSkillLevel = (seniority: number) => {
//   const level = seniorityLevels.find((s) => s.level === seniority);
//   return level ? level.name : "Unknown";
// };

// const getSkillLevelColor = (level: string) => {
//   switch (level) {
//     case "Junior": return "text-blue-600";
//     case "Mid-Level": return "text-green-600";
//     case "Senior": return "text-yellow-600";
//     case "Lead": return "text-orange-600";
//     case "Principal": return "text-red-600";
//     default: return "text-gray-600";
//   }
// };

const Competences = ({ data }: { data: Sector[] }) => {
  const [sectors, _setSectors] = useState(data ?? []);

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
                {/* const seniorityInfo = seniorityLevels.find((s) => s.level === skill.seniority) || { name: "Unknown", description: "" }; */}
                {/* <span className={`text-sm text-gray-600`}>
                  ({seniorityInfo.name} - {seniorityInfo.description})
                </span> */}
              </AccordionTrigger>
              <AccordionContent className="p-2">
                {sector.jobs?.map((job) => (
                  job && (
                    <div
                      key={job.id.toString()}
                      className="bg-white shadow-sm rounded-md mb-2 p-3"
                    >
                      <div className="font-medium text-gray-600 mb-2">{job.name}</div>
                      <div className="space-y-1">
                        {job.skills?.map((skill) => {
                          if (!skill) return null;
                          return (
                            <div
                              key={skill.id.toString()}
                              className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-sm"
                            >
                              <div className="flex items-center">
                                <span className="mr-2">{skill.name}</span>
                              </div>
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
