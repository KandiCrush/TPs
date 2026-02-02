import ExcelJS from "exceljs";
import { ClientType } from "@/src/lib/z-type";
import { Props } from "@/src/lib/amortissement";

type GenerateSimulationExcelParams = {
    client: ClientType;
    params: Props;
    tauxType: "ANNUEL" | "MENSUEL";
    assuranceRate?: number;
};

export async function generateSimulationExcel({
    client,
    params,
    tauxType,
    assuranceRate = 0,
}: GenerateSimulationExcelParams) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Simulation Financière";
    workbook.created = new Date();

    /* ======================================================
       FEUILLE 1 — PARAMÈTRES
       ====================================================== */
    const paramSheet = workbook.addWorksheet("Parametres", {
        views: [{ state: "frozen", ySplit: 1 }],
    });

    paramSheet.columns = [{ width: 30 }, { width: 20 }];

    const title = paramSheet.getCell("A1");
    title.value = "PARAMÈTRES DU PRÊT";
    title.font = { bold: true, size: 14 };
    title.alignment = { vertical: "middle" };

    paramSheet.mergeCells("A1:B1");

    const rows = [
        ["Client", `${client.prenom} ${client.nom}`],
        ["Montant emprunté", params.montant],
        ["Durée (mois)", params.duree],
        [
            "Taux (%)",
            tauxType === "ANNUEL" ? params.taux * 1200 : params.taux * 100,
        ],
        ["Type de taux", tauxType],
        ["Taux assurance (%)", assuranceRate],
        [
            "Mensualité",
            {
                formula: '=IF(B4>0,B3*(B5/100/12)/(1-(1+B5/100/12)^(-B4)),"")',
            },
        ],
    ];

    rows.forEach((r, i) => {
        const row = paramSheet.getRow(i + 2);
        row.values = r;

        row.getCell(1).font = { bold: true };
        row.getCell(2).numFmt = "#,##0.00";
    });

    // Style zone modifiable
    ["B2", "B3", "B4", "B6"].forEach((cell) => {
        paramSheet.getCell(cell).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFDE9" },
        };
    });

    /* ======================================================
       FEUILLE 2 — AMORTISSEMENT
       ====================================================== */
    const sheet = workbook.addWorksheet("Amortissement", {
        views: [{ state: "frozen", ySplit: 1 }],
    });

    sheet.columns = [
        { header: "Mois", width: 8 },
        { header: "Capital restant", width: 20 },
        { header: "Intérêt", width: 16 },
        { header: "Amortissement", width: 18 },
        { header: "Mensualité", width: 16 },
        { header: "Assurance", width: 16 },
        { header: "Total", width: 16 },
    ];

    // Header style
    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center" };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "E5E7EB" },
        };
        cell.border = {
            bottom: { style: "thin" },
        };
    });

    /* ======================================================
       FORMULES (jusqu'à 600 mois)
       ====================================================== */
    for (let i = 2; i <= 600; i++) {
        sheet.getCell(`A${i}`).value = {
            formula: `IF(ROW()-1<=Parametres!$B$4,ROW()-1,"")`,
        };

        sheet.getCell(`B${i}`).value = {
            formula: `IF(A${i}="","",IF(A${i}=1,Parametres!$B$3,B${i - 1}-D${
                i - 1
            }))`,
        };

        sheet.getCell(`C${i}`).value = {
            formula: `IF(A${i}="","",B${i}*(Parametres!$B$5/100/12))`,
        };

        sheet.getCell(`D${i}`).value = {
            formula: `IF(A${i}="","",Parametres!$B$8-C${i})`,
        };

        sheet.getCell(`E${i}`).value = {
            formula: `IF(A${i}="","",Parametres!$B$8)`,
        };

        sheet.getCell(`F${i}`).value = {
            formula: `IF(A${i}="","",Parametres!$B$3*(Parametres!$B$7/100)/12)`,
        };

        sheet.getCell(`G${i}`).value = {
            formula: `IF(A${i}="","",E${i}+F${i})`,
        };

        sheet.getRow(i).eachCell((cell) => {
            cell.numFmt = "#,##0.00";
        });
    }

    /* ======================================================
       PROTECTION (optionnelle)
       ====================================================== */
    await sheet.protect("", {
        selectLockedCells: true,
        selectUnlockedCells: true,
    });

    /* ======================================================
       EXPORT
       ====================================================== */
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}
