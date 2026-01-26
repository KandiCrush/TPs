export type Props = {
    montant: number | null;
    taux: number; // taux mensuel
    duree: number | null;
    mensualite: number | null;
};

export type AmortissementRow = {
    mois: number;
    capitalRestant: number;
    interet: number;
    mensualite: number;
    amortissement: number;
};

type ReturnTable = {
    error: boolean;
    message: string;
    data: { inputs: Props | []; output: AmortissementRow[] };
};

export function CalculAmortissement({
    montant,
    taux,
    duree,
    mensualite,
}: Props): ReturnTable {
    // Calcul de la mensualité si absente
    if (!mensualite && montant && duree) {
        mensualite = (montant * taux) / (1 - Math.pow(1 + taux, -duree));
    }

    // Calcul du capital si absent
    if (!montant && mensualite && duree) {
        montant = (mensualite * (1 - Math.pow(1 + taux, -duree))) / taux;
    }

    // Calcul de la durée si absente
    if (!duree && montant && mensualite) {
        duree =
            Math.log(mensualite / (mensualite - montant * taux)) /
            Math.log(1 + taux);
        duree = Math.round(duree);
    }

    if (!montant || !mensualite || !duree) {
        return {
            error: true,
            message: "Les données sont invalides",
            data: { inputs: [], output: [] },
        };
    }

    // Calcul
    let capitalRestant = montant;
    const table: AmortissementRow[] = [];

    for (let mois = 1; mois <= duree; mois++) {
        const interet = capitalRestant * taux;
        const amortissement = mensualite - interet;
        capitalRestant -= amortissement;

        table.push({
            mois,
            capitalRestant: Math.max(capitalRestant, 0),
            interet,
            mensualite,
            amortissement,
        });
    }

    return {
        error: false,
        message: "Calcul terminé",
        data: { inputs: { montant, taux, duree, mensualite }, output: table },
    };
}
