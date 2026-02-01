/**
 * API publique pour la génération du PDF de simulation de prêt.
 */

export { generateSimulationPDF } from "./generateSimulationPDF";
export { SimulationPDFDocument } from "./simulation-pdf-document";
export type {
  SimulationPDFData,
  SimulationPDFClient,
  SimulationPDFSimulation,
  SimulationPDFTableauRow,
} from "./simulation-pdf-types";
