import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as ExcelJS from 'exceljs';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { TransactionType } from '@prisma/client';
import { TableCell } from 'pdfmake/interfaces';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // --- EXCEL Generator ---
  async generateFinanceExcel(
    propertyId: string,
    managerId: string,
  ): Promise<Buffer> {
    const transactions = await this.prisma.transaction.findMany({
      where: { propertyId, property: { managerId } },
      orderBy: { date: 'desc' },
      include: { unit: { include: { block: true } } },
    });

    // 2. Excel Workbook Genarate
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Finansal Rapor');

    sheet.columns = [
      { header: 'Tarih', key: 'date', width: 15 },
      { header: 'Tip', key: 'type', width: 10 },
      { header: 'Kategori', key: 'category', width: 15 },
      { header: 'Açıklama', key: 'description', width: 30 },
      { header: 'Daire', key: 'unit', width: 15 },
      { header: 'Tutar', key: 'amount', width: 15 },
    ];

    transactions.forEach((t) => {
      const unitName = t.unit
        ? `${t.unit.block.name} - No:${t.unit.doorNumber}`
        : '-';

      sheet.addRow({
        date: t.date.toLocaleDateString('tr-TR'),
        type: t.type === TransactionType.INCOME ? 'Gelir' : 'Gider',
        category: t.category,
        description: t.description,
        unit: unitName,
        amount: Number(t.amount),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as unknown as Buffer;
  }

  // --- PDF Generator ---
  async generateFinancePdf(
    propertyId: string,
    managerId: string,
  ): Promise<Buffer> {
    const transactions = await this.prisma.transaction.findMany({
      where: { propertyId, property: { managerId } },
      orderBy: { date: 'desc' },
      include: { unit: { include: { block: true } } },
    });

    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };
    const printer = new PdfPrinter(fonts);

    const body: TableCell[][] = [];

    // Header Row
    body.push([
      { text: 'Tarih', style: 'tableHeader' },
      { text: 'Tip', style: 'tableHeader' },
      { text: 'Kategori', style: 'tableHeader' },
      { text: 'Açıklama', style: 'tableHeader' },
      { text: 'Tutar', style: 'tableHeader', alignment: 'right' },
    ]);

    // Data Rows
    transactions.forEach((t) => {
      body.push([
        t.date.toLocaleDateString('tr-TR'),
        t.type === 'INCOME' ? 'Gelir' : 'Gider',
        t.category,
        t.description,
        { text: `${t.amount} TL`, alignment: 'right' },
      ]);
    });

    const docDefinition: TDocumentDefinitions = {
      defaultStyle: { font: 'Helvetica' },
      content: [
        { text: `${property?.name} - Finansal Rapor`, style: 'header' },
        {
          text: `Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}`,
          style: 'subheader',
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', '*', 'auto'],
            body: body,
          },
          layout: 'lightHorizontalLines',
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 12, margin: [0, 0, 0, 20], color: 'gray' },
        tableHeader: { bold: true, fontSize: 13, color: 'black' },
      },
    };

    return new Promise((resolve, reject) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks: any[] = [];
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', (err) => reject(err));
      pdfDoc.end();
    });
  }
}
