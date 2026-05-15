import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface InvoiceData {
  orderId: string;
  date: string;
  customerName: string;
  customerEmail: string;
  billingAddress: {
    address: string;
    city: string;
    postcode: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  total: string;
  paymentMethod: string;
}

export const generateInvoicePDF = (data: InvoiceData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(20, 83, 45); // Forest Green
  doc.text("PROPVALUE", 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Verified Property Data Solutions", 20, 26);
  
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text("INVOICE", pageWidth - 20, 20, { align: "right" });
  
  doc.setFontSize(10);
  doc.text(`Order ID: #${data.orderId}`, pageWidth - 20, 28, { align: "right" });
  doc.text(`Date: ${data.date}`, pageWidth - 20, 34, { align: "right" });

  // Divider
  doc.setDrawColor(230);
  doc.line(20, 45, pageWidth - 20, 45);

  // Billing Info
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text("BILL TO:", 20, 55);
  
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(data.customerName, 20, 62);
  doc.text(data.customerEmail, 20, 67);
  doc.text(data.billingAddress.address, 20, 72);
  doc.text(`${data.billingAddress.city}, ${data.billingAddress.postcode}`, 20, 77);

  // Company Info (Right side)
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text("FROM:", pageWidth / 2 + 10, 55);
  
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text("PropValue (Pty) Ltd", pageWidth / 2 + 10, 62);
  doc.text("123 Property Avenue", pageWidth / 2 + 10, 67);
  doc.text("Sandton, Johannesburg", pageWidth / 2 + 10, 72);
  doc.text("South Africa", pageWidth / 2 + 10, 77);

  // Items Table
  autoTable(doc, {
    startY: 90,
    head: [["Description", "Qty", "Price", "Total"]],
    body: data.items.map(item => [
      item.name,
      item.quantity.toString(),
      item.price,
      item.price
    ]),
    headStyles: { fillColor: [20, 83, 45] },
    alternateRowStyles: { fillColor: [245, 245, 240] },
    margin: { left: 20, right: 20 },
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Payment Method:", 20, finalY + 5);
  doc.setTextColor(40);
  doc.text(data.paymentMethod, 20, finalY + 10);

  doc.setFontSize(14);
  doc.setTextColor(20, 83, 45);
  doc.text(`Total Paid: ${data.total}`, pageWidth - 20, finalY + 10, { align: "right" });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("Thank you for your business. For any queries, contact support@propvalue.co.za", pageWidth / 2, 280, { align: "center" });
  doc.text("PropValue is a registered data provider for Lightstone Property Analytics.", pageWidth / 2, 285, { align: "center" });

  // Save
  doc.save(`Invoice-${data.orderId}.pdf`);
};
