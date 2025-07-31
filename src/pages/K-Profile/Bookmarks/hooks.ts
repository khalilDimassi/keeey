import { useCallback, useMemo, useState } from "react";
import { OpportunityListItem } from "./types";

export type OpportunityTab =
    | "ALL"
    | "CONTACTS"
    | "CLIENTS"
    | "SAVED";

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
    const [listLoading, setListLoading] = useState<boolean>(false);
    const [listError, setListError] = useState<string | null>(null);
    const setData = useCallback((updater: OpportunityListItem[] | ((prev: OpportunityListItem[]) => OpportunityListItem[])) => {
        setRawOpportunities(updater);
        setListLoading(false);
        setListError(null);
    }, []);


    const filteredItems = useMemo(() => {
        let items: OpportunityListItem[] = [...rawOpportunities];
        switch (activeTab) {
            case "CONTACTS":
                items = items.filter(i => i.contact_id && i.contact_id !== 0);
                break;
            case "CLIENTS":
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
        listLoading,
        listError,
        setListLoading,
        setListError
    };
};

export default useOpportunitiesFilter;
