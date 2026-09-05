import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TripModel } from '../types';

export function exportTripPdf(trip: TripModel) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const durationDays = trip.durationDays || Math.max(
    1,
    Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 3600 * 24))
  );

  const startStr = new Date(trip.startDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const endStr = new Date(trip.endDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // 1. BRAND HEADER BAR (Charcoal/Black luxury theme)
  doc.setFillColor(17, 24, 39); // #111827
  doc.rect(0, 0, 210, 36, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('TRIPWEAVE', 14, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 213, 219);
  doc.text('OFFICIAL TRAVEL ITINERARY & EXPEDITION GUIDE', 14, 26);

  doc.setFontSize(8);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 196, 26, { align: 'right' });

  // 2. TRIP TITLE & HIGH-LEVEL SUMMARY
  let currentY = 46;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(17, 24, 39);
  doc.text(trip.title, 14, currentY);

  currentY += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  const routeString = (trip.stops || []).map((s, idx) => `${idx + 1}. ${s.city.name}`).join('  →  ') || 'Flexible Explorer Route';
  doc.text(`Route: ${routeString}`, 14, currentY);

  currentY += 8;

  // 3. KEY TRIP SPECS TILES
  const tileWidth = 43;
  const tileHeight = 16;
  const tiles = [
    { label: 'DATES', value: `${startStr} - ${endStr}` },
    { label: 'DURATION', value: `${durationDays} Days / ${durationDays - 1} Nights` },
    { label: 'TOTAL BUDGET', value: `$${(trip.budget || 0).toLocaleString()} ${trip.currency || 'USD'}` },
    { label: 'TRAVELER', value: 'Faiz Khan (VarpLabs)' },
  ];

  tiles.forEach((t, i) => {
    const x = 14 + i * 46;
    doc.setFillColor(243, 244, 246); // #f3f4f6
    doc.roundedRect(x, currentY, tileWidth, tileHeight, 2, 2, 'F');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(107, 114, 128);
    doc.text(t.label, x + 3, currentY + 5);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(t.value, x + 3, currentY + 11);
  });

  currentY += 24;

  // 4. DAY-BY-DAY ITINERARY SCHEDULE TABLE
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('Day-by-Day Expedition Schedule', 14, currentY);

  const activities = (trip.tripActivities || []).slice().sort((a, b) => {
    if (a.dayNumber !== b.dayNumber) return a.dayNumber - b.dayNumber;
    return (a.scheduledTime || '').localeCompare(b.scheduledTime || '');
  });

  const tableRows: any[] = [];

  for (let day = 1; day <= durationDays; day++) {
    const dayDate = new Date(trip.startDate);
    dayDate.setDate(dayDate.getDate() + (day - 1));
    const formattedDayDate = dayDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

    const dayActs = activities.filter((a) => a.dayNumber === day);

    if (dayActs.length === 0) {
      tableRows.push([
        `Day ${day}\n${formattedDayDate}`,
        'Flexible',
        'Open Exploration & Leisure Time',
        'Leisure',
        'City Center',
        '$0',
      ]);
    } else {
      dayActs.forEach((act) => {
        tableRows.push([
          `Day ${day}\n${formattedDayDate}`,
          act.scheduledTime || '10:00',
          act.customTitle || act.activity?.name || 'Scheduled Activity',
          act.category || 'Sightseeing',
          act.tripStop?.city?.name || 'Destination',
          `$${act.estimatedCost || 0}`,
        ]);
      });
    }
  }

  autoTable(doc, {
    startY: currentY + 4,
    head: [['Day / Date', 'Time', 'Scheduled Activity & Experience', 'Category', 'Location', 'Est. Cost']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [17, 24, 39],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [31, 41, 55],
      cellPadding: 2.5,
    },
    columnStyles: {
      0: { cellWidth: 28, fontStyle: 'bold' },
      1: { cellWidth: 16 },
      2: { cellWidth: 72 },
      3: { cellWidth: 24 },
      4: { cellWidth: 28 },
      5: { cellWidth: 18, halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { left: 14, right: 14 },
  });

  let lastY = (doc as any).lastAutoTable.finalY + 10;

  // Check if we need a new page for emergency & support box
  if (lastY > 240) {
    doc.addPage();
    lastY = 20;
  }

  // 5. EMERGENCY CONTACTS & TRAVEL ASSISTANCE BOX
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(14, lastY, 182, 34, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('EMERGENCY ASSISTANCE & CONCIERGE SUPPORT', 20, lastY + 8);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Global Emergency Hotlines: 112 (EU / International)  |  911 (US / Canada)  |  112 (India)', 20, lastY + 15);
  doc.text('Travel Desk Coordinator: Faiz Khan (faizkhan@varplabs.com)', 20, lastY + 21);
  doc.text('Platform Support: Tripweave Verified Travel Network (24/7 Priority Concierge)', 20, lastY + 27);

  // 6. FOOTER NUMBERING ON ALL PAGES
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Tripweave Tour Systems  •  ${trip.title}  •  Page ${i} of ${pageCount}`,
      105,
      290,
      { align: 'center' }
    );
  }

  // Trigger browser download
  const cleanTitle = (trip.title || 'trip').toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`Tripweave_${cleanTitle}_Travel_Guide.pdf`);
}
