import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Invoice, CURRENCIES } from './types';

export async function generateInvoicePDF(invoice: Invoice, companyInfo: { name: string; address: string }): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const currency = CURRENCIES.find(c => c.code === invoice.currency) || CURRENCIES[0];
  const margin = 50;
  let y = 780;

  const formatMoney = (amount: number) => `${currency.symbol}${amount.toFixed(2)}`;

  page.drawText('INVOICE', { x: margin, y, size: 28, font: boldFont, color: rgb(0.11, 0.31, 0.49) });
  y -= 35;

  page.drawText(`Invoice #: ${invoice.invoice_number}`, { x: margin, y, size: 10, font });
  page.drawText(`Date: ${invoice.issue_date}`, { x: 350, y, size: 10, font });
  y -= 18;
  page.drawText(`Due Date: ${invoice.due_date}`, { x: margin, y, size: 10, font });
  page.drawText(`Status: ${invoice.status.toUpperCase()}`, { x: 350, y, size: 10, font, color: invoice.status === 'paid' ? rgb(0, 0.6, 0) : rgb(0.8, 0, 0) });
  y -= 40;

  page.drawText('From:', { x: margin, y, size: 10, font: boldFont });
  y -= 16;
  page.drawText(companyInfo.name || 'Your Company', { x: margin, y, size: 10, font });
  y -= 14;
  const addressLines = (companyInfo.address || '').split('\n');
  for (const line of addressLines) {
    page.drawText(line, { x: margin, y, size: 9, font });
    y -= 12;
  }
  y -= 10;

  page.drawText('Bill To:', { x: 350, y: y + 30, size: 10, font: boldFont });
  page.drawText(invoice.client_name, { x: 350, y: y + 14, size: 10, font });
  if (invoice.client_email) page.drawText(invoice.client_email, { x: 350, y, size: 9, font });
  y -= 10;
  const clientAddrLines = (invoice.client_address || '').split('\n');
  for (const line of clientAddrLines) {
    page.drawText(line, { x: 350, y, size: 9, font });
    y -= 12;
  }
  y -= 30;

  const colDesc = margin;
  const colQty = 340;
  const colRate = 400;
  const colAmount = 480;

  page.drawText('Description', { x: colDesc, y, size: 10, font: boldFont });
  page.drawText('Qty', { x: colQty, y, size: 10, font: boldFont });
  page.drawText('Rate', { x: colRate, y, size: 10, font: boldFont });
  page.drawText('Amount', { x: colAmount, y, size: 10, font: boldFont });
  y -= 4;
  page.drawLine({ start: { x: margin, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.7, 0.7, 0.7) });
  y -= 18;

  for (const item of invoice.items) {
    page.drawText(item.description.substring(0, 45), { x: colDesc, y, size: 9, font });
    page.drawText(String(item.quantity), { x: colQty, y, size: 9, font });
    page.drawText(formatMoney(item.rate), { x: colRate, y, size: 9, font });
    page.drawText(formatMoney(item.amount), { x: colAmount, y, size: 9, font });
    y -= 16;
  }

  y -= 4;
  page.drawLine({ start: { x: margin, y }, end: { x: 545, y }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });
  y -= 20;

  const summaryX = 380;
  page.drawText('Subtotal:', { x: summaryX, y, size: 10, font });
  page.drawText(formatMoney(invoice.subtotal), { x: colAmount, y, size: 10, font });
  y -= 16;

  if (invoice.tax_rate > 0) {
    page.drawText(`Tax (${invoice.tax_rate}%):`, { x: summaryX, y, size: 10, font });
    page.drawText(formatMoney(invoice.tax_amount), { x: colAmount, y, size: 10, font });
    y -= 16;
  }

  page.drawLine({ start: { x: summaryX, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.11, 0.31, 0.49) });
  y -= 18;
  page.drawText('Total:', { x: summaryX, y, size: 12, font: boldFont, color: rgb(0.11, 0.31, 0.49) });
  page.drawText(formatMoney(invoice.total), { x: colAmount, y, size: 12, font: boldFont, color: rgb(0.11, 0.31, 0.49) });

  if (invoice.notes) {
    y -= 50;
    page.drawText('Notes:', { x: margin, y, size: 10, font: boldFont });
    y -= 16;
    const noteLines = invoice.notes.split('\n');
    for (const line of noteLines) {
      page.drawText(line.substring(0, 80), { x: margin, y, size: 9, font });
      y -= 12;
    }
  }

  if (invoice.payment_link) {
    y -= 40;
    page.drawText('Pay online:', { x: margin, y, size: 10, font: boldFont });
    y -= 16;
    page.drawText(invoice.payment_link.substring(0, 70), { x: margin, y, size: 8, font, color: rgb(0, 0.4, 0.8) });
  }

  return pdfDoc.save();
}
