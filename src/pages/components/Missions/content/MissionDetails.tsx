import { getColor } from "../../../../utils/color";
import { DetailedMission, Invoice } from "../types";
import NewInvoiceForm from "./NewInvoiceForm";

const MissionDetails = ({ mission, handleCRA, handleInvoice, handleAddInvoice, loading }: { mission: DetailedMission, handleCRA: (invoiceId: number) => void, handleInvoice: (invoiceId: number) => void, handleAddInvoice: (newInvoice: Invoice) => void, loading: boolean }) => {
  if (!mission) return null;
  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-8">Chargement des détails de la mission...</div>
      ) : (
        <>
          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-x-auto">
            <thead>
              <tr className="border-b text-sm text-center py-2">
                <th>Statut</th>
                <th>Année</th>
                <th>Mois</th>
                <th>Nb de jours</th>
                <th>Frais</th>
                <th>Descriptif Frais</th>
                <th>Ecart</th>
                <th>Montant HT</th>
                <th>
                  <NewInvoiceForm
                    missionID={mission.id}
                    handleAddInvoice={handleAddInvoice}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {!mission.invoices || mission.invoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    Aucune facture disponible pour cette mission
                  </td>
                </tr>
              ) : (
                mission.invoices.map((invoice: Invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 text-center">
                    <td className="p-3">
                      <span className={`px-4 py-1 text-xs font-bold rounded-full ${invoice.status === "ONGOING" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {invoice.status === "ONGOING" ? "En cours" : "Terminée"}
                      </span>
                    </td>
                    <td className="p-3">{invoice.year}</td>
                    <td className="p-3">{invoice.month}</td>
                    <td className="p-3">{invoice.days}</td>
                    <td className="p-3">{invoice.costs}</td>
                    <td className="p-3 text-left text-wrap w-[600px]">{invoice.description}</td>
                    <td className="p-3">{invoice.gap}</td>
                    <td className="p-3">{invoice.amountHT}</td>
                    <td className="py-3 pr-3 flex flex-row justify-around items-center gap-2">
                      <button
                        onClick={() => { handleCRA(invoice.id!) }}
                        title="Requerir un CRA"
                        className={`${"bg-[" + getColor(500) + "] hover:bg-[" + getColor(600) + "]"} text-white rounded-full py-0.5 px-2 w-1/2 text-sm`}
                      >CRA</button>
                      <button
                        onClick={() => { handleInvoice(invoice.id!) }}
                        title="Requerir une facture"
                        className={`${"bg-[" + getColor(500) + "] hover:bg-[" + getColor(600) + "]"} text-white rounded-full py-0.5 px-2 w-1/2 text-sm`}
                      >Facture</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default MissionDetails