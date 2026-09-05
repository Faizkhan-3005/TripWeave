export function generateTripCSV(trip: any): string {
  const lines: string[] = [];

  // Helper to escape CSV fields
  const escape = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  // Section 1: Trip Overview
  lines.push('TRIPWEAVE TOUR & ITINERARY EXPORT');
  lines.push(`Trip Title,${escape(trip.title)}`);
  lines.push(`Description,${escape(trip.description || 'N/A')}`);
  lines.push(`Dates,${new Date(trip.startDate).toLocaleDateString()} to ${new Date(trip.endDate).toLocaleDateString()}`);
  lines.push(`Total Budget,${trip.currency} ${trip.budget.toFixed(2)}`);
  lines.push('');

  // Section 2: Destinations & Stops
  lines.push('DESTINATIONS & STOPS');
  lines.push('Order,City,Country,Arrival Date,Departure Date,Notes');
  if (trip.stops && trip.stops.length > 0) {
    trip.stops.forEach((stop: any, idx: number) => {
      lines.push([
        idx + 1,
        escape(stop.city?.name || 'N/A'),
        escape(stop.city?.country || 'N/A'),
        stop.arrivalDate ? new Date(stop.arrivalDate).toLocaleDateString() : 'N/A',
        stop.departureDate ? new Date(stop.departureDate).toLocaleDateString() : 'N/A',
        escape(stop.notes || ''),
      ].join(','));
    });
  } else {
    lines.push('No stops recorded');
  }
  lines.push('');

  // Section 3: Day-by-Day Itinerary Activities
  lines.push('ITINERARY ACTIVITIES');
  lines.push('Day,Time,City,Activity,Category,Cost,Status,Notes');
  if (trip.tripActivities && trip.tripActivities.length > 0) {
    // Sort by day and time
    const sorted = [...trip.tripActivities].sort((a, b) => (a.dayNumber - b.dayNumber) || (a.orderIndex - b.orderIndex));
    sorted.forEach((act: any) => {
      const cityName = act.tripStop?.city?.name || act.activity?.city?.name || 'General';
      const title = act.customTitle || act.activity?.name || 'Custom Activity';
      lines.push([
        `Day ${act.dayNumber}`,
        escape(act.scheduledTime || '--:--'),
        escape(cityName),
        escape(title),
        escape(act.category),
        `${trip.currency} ${(act.estimatedCost || 0).toFixed(2)}`,
        act.isCompleted ? 'Completed' : 'Planned',
        escape(act.notes || ''),
      ].join(','));
    });
  } else {
    lines.push('No itinerary activities scheduled');
  }
  lines.push('');

  // Section 4: Expenses & Budget Breakdown
  lines.push('EXPENSES & BUDGET BREAKDOWN');
  lines.push('Date,Title,Category,Amount');
  let totalSpent = 0;
  if (trip.expenses && trip.expenses.length > 0) {
    trip.expenses.forEach((exp: any) => {
      totalSpent += exp.amount;
      lines.push([
        new Date(exp.date).toLocaleDateString(),
        escape(exp.title),
        escape(exp.category),
        `${trip.currency} ${exp.amount.toFixed(2)}`,
      ].join(','));
    });
  } else {
    lines.push('No logged expenses');
  }
  lines.push('');
  lines.push(`Total Spent,${trip.currency} ${totalSpent.toFixed(2)}`);
  lines.push(`Remaining Budget,${trip.currency} ${(trip.budget - totalSpent).toFixed(2)}`);

  return lines.join('\r\n');
}
