/**
 * Types pour la génération du PDF de simulation de prêt.
 */

export type SimulationPDFClient = {
  nom: string;
  prenom: string;
  email?: string;
};

export type SimulationPDFSimulation = {
  montant: number;
  taux: number;
  typeTaux: "ANNUEL" | "MENSUEL";
  duree: number;
  mensualite: number;
  totalInterets: number;
  totalAssurance?: number | null;
  dateTraitement: Date;
};

export type SimulationPDFTableauRow = {
  mois: number;
  capitalRestant: number;
  interet: number;
  amortissement: number;
  mensualite: number;
  assurance?: number;
  totalMensualite?: number;
};

export type SimulationPDFData = {
  client: SimulationPDFClient;
  simulation: SimulationPDFSimulation;
  tableau: SimulationPDFTableauRow[];
};
