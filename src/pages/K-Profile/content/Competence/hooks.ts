import { useCallback, useMemo, useState } from "react";
import { OpportunityListItem } from "./content/Opportunities/types";

export type OpportunityTab =
    | "Opportunités"
    | "Opportunités de mes contacts"
    | "Clients étant intéressés";

export type ContractType =
    | "ALL"
    | "CDI"
    | "CDD"
    | "CDI-C"
    | "CONSULTANT"
    | "PORTAGE"
    | "FREELANCE";

interface HookParams {
    activeTab: OpportunityTab;
    contractType: ContractType;
    threshold: number;
}

const useOpportunitiesFilter = ({ activeTab, contractType, threshold }: HookParams) => {
    const [rawOpportunities, setRawOpportunities] = useState<OpportunityListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const setData = useCallback((updater: OpportunityListItem[] | ((prev: OpportunityListItem[]) => OpportunityListItem[])) => {
        setRawOpportunities(updater);
        setLoading(false);
        setError(null);
    }, []);


    const filteredItems = useMemo(() => {
        let items: OpportunityListItem[] = [...rawOpportunities];
        switch (activeTab) {
            case "Opportunités de mes contacts":
                items = items.filter(i => i.contact_id && i.contact_id !== 0);
                break;
            case "Clients étant intéressés":
                items = items.filter(i => i.client_id && i.client_id !== "");
                break;
            default:
                break;
        }

        if (contractType !== "ALL") {
            items = items.filter(i => i.contract_roles.includes(contractType));
        }

        items = items.filter(
            i =>
                i.matching?.total_match_percentage !== undefined &&
                i.matching.total_match_percentage >= threshold
        );

        items.sort(
            (a, b) =>
                (b.matching?.total_match_percentage ?? 0) -
                (a.matching?.total_match_percentage ?? 0)
        );

        return items;
    }, [rawOpportunities, activeTab, contractType, threshold]);

    return {
        filteredItems,
        rawOpportunities,
        setRawOpportunities: setData,
        loading,
        error,
        setLoading,
        setError
    };
};

export default useOpportunitiesFilter;
