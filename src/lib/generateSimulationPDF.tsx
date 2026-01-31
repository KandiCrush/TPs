"use client";

import { pdf } from "@react-pdf/renderer";
import { SimulationPDFDocument } from "./simulation-pdf-document";
import type { SimulationPDFData } from "./simulation-pdf-types";

/**
 * Génère un PDF professionnel pour une simulation de prêt.
 * Rendu côté client via @react-pdf/renderer.
 *
 * @param data - Données client, résumé simulation et tableau d'amortissement
 * @returns Promise résolue avec le Blob du PDF
 */
export async function generateSimulationPDF(
  data: SimulationPDFData
): Promise<Blob> {
  const blob = await pdf(<SimulationPDFDocument data={data} />).toBlob();
  return blob;
}

/*
 * Exemple d'appel (sans UI) :
 *
 * import { generateSimulationPDF } from "@/src/lib/generateSimulationPDF";
 * import type { SimulationPDFData } from "@/src/lib/simulation-pdf-types";
 *
 * const data: SimulationPDFData = {
 *   client: { nom: "Dupont", prenom: "Marie", email: "marie@exemple.fr" },
 *   simulation: {
 *     montant: 200_000,
 *     taux: 3.5,
 *     typeTaux: "ANNUEL",
 *     duree: 240,
 *     mensualite: 1163.21,
 *     totalInterets: 79270.4,
 *     totalAssurance: 12000,
 *     dateTraitement: new Date(),
 *   },
 *   tableau: [
 *     { mois: 1, capitalRestant: 199500, interet: 583.33, amortissement: 579.88, mensualite: 1163.21, assurance: 50, totalMensualite: 1213.21 },
 *     // ... autres lignes
 *   ],
 * };
 *
 * const blob = await generateSimulationPDF(data);
 * const url = URL.createObjectURL(blob);
 * window.open(url); // ou téléchargement : <a href={url} download="simulation-pret.pdf">Télécharger</a>
 */
