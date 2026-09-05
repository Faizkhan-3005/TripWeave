/**
 * curatedTravelEngine.ts
 * Reliable, fast, realistic prebuilt question-and-answer travel knowledge engine.
 * Tailored for flawless pitch demos without network latency or API key dependencies.
 */

export interface QAPair {
  id: string;
  category: 'dining' | 'budget' | 'weather' | 'disruption' | 'logistics' | 'culture';
  label: string;
  query: string;
  reply: string;
}

export const CURATED_QA_KNOWLEDGE_BASE: QAPair[] = [
  {
    id: 'dining-1',
    category: 'dining',
    label: '🍷 Top Dining & Hidden Gems',
    query: 'What are the top-rated local dining spots and hidden gems for this tour?',
    reply: `Here are 3 handpicked culinary recommendations tailored to your itinerary:\n\n` +
      `1. **La Terrazza Panorama (Scenic Dining)**\n` +
      `   • *Specialty:* Sunset terrace overlooking historic skyline; wood-fired seasonal tasting menu.\n` +
      `   • *Price:* $40–$60 per guest. Reservation recommended 24h in advance.\n\n` +
      `2. **Old Town Artisan Osteria (Authentic & Intimate)**\n` +
      `   • *Specialty:* Pedestrian alley secret; celebrated for handmade pasta & natural regional wines.\n` +
      `   • *Price:* $25–$35 per guest. Casual walk-ins welcome.\n\n` +
      `3. **The Night Bazaar Food Quarter (Street Eats)**\n` +
      `   • *Specialty:* Vibrant evening stalls featuring crispy bites, local skewers, and dessert pastries.\n` +
      `   • *Price:* Under $15 per person.\n\n` +
      `Would you like me to bookmark one of these as an evening activity on your Day schedule?`
  },
  {
    id: 'budget-1',
    category: 'budget',
    label: '💰 Budget Trajectory & Breakdown',
    query: 'Analyze my trip budget, projected daily spending, and cost variance.',
    reply: `Here is your real-time financial trajectory analysis:\n\n` +
      `• **Target Tour Budget:** Healthy coverage across stops.\n` +
      `• **Committed Spend (Lodging & Transit):** ~52% of total allocated funds.\n` +
      `• **Estimated Daily Activity Allowance:** ~$65–$90/day per traveler.\n` +
      `• **Safety Buffer Remaining:** 18% reserve for unexpected excursions, tips, or transfers.\n\n` +
      `💡 **Optimizer Tip:** Booking bundled inter-city rail or group museum passes rather than on-site tickets saves an average of $35 per stop.`
  },
  {
    id: 'weather-1',
    category: 'weather',
    label: '🌦️ Weather Advisory & Packing',
    query: 'How does the weather forecast look and what should I pack?',
    reply: `Live 5-day predictive weather breakdown for your route:\n\n` +
      `• **Conditions:** Mild sunny mornings (~23°C / 73°F) with light scattered showers expected on Day 2.\n` +
      `• **Packing Essentials:** Breathable walking sneakers, light waterproof windbreaker, universal travel plug, UV sunglasses.\n` +
      `• **Adaptive Safeguard:** If rain exceeds 60% probability on Day 2, our Weather Advisory will instantly suggest covered indoor galleries & museum alternatives!`
  },
  {
    id: 'disruption-1',
    category: 'disruption',
    label: '⚡ What if my flight is delayed?',
    query: 'What happens if my connecting flight or train gets delayed?',
    reply: `Tripweave's **Dynamic Disruption Engine** monitors scheduled departures in real-time:\n\n` +
      `1. **Instant Cascade Analysis:** If transit slips by >60 mins, subsequent check-in times and afternoon activities recalculate automatically.\n` +
      `2. **Partner Hotel Alert:** Your hotel receives an automated late-arrival notice so your room is never forfeited.\n` +
      `3. **Alternative Rerouting:** The platform immediately surfaces the next 2 fastest express transit or private transfer connections with zero rebooking fees under the Tripweave Guarantee.`
  },
  {
    id: 'culture-1',
    category: 'culture',
    label: '🏛️ Local Etiquette & Tips',
    query: 'What local etiquette, tipping customs, or customs should I know?',
    reply: `Essential local customs for your destinations:\n\n` +
      `• **Tipping:** Rounding up the bill by 10% is customary for attentive table service; transport drivers appreciate small change.\n` +
      `• **Sacred Sites / Monuments:** Shoulders and knees should be respectfully covered when entering historic churches or temples.\n` +
      `• **Transit Etiquette:** Keep voice calls low on commuter trains; stand on the right on escalators to let commuters pass on the left.`
  },
  {
    id: 'schedule-1',
    category: 'logistics',
    label: '⏱️ Optimize Day Pacing',
    query: 'Can you optimize my daily schedule to reduce walking distance and fatigue?',
    reply: `Schedule pacing check complete:\n\n` +
      `• **Morning Slot (09:30 - 12:30):** High-energy walking & landmark exploration.\n` +
      `• **Midday Break (13:00 - 15:00):** Shaded lunch & relaxed gallery visit during peak sun.\n` +
      `• **Afternoon Slot (15:30 - 18:00):** Clustered neighborhood sights located within 15 mins of each other.\n\n` +
      `Your current schedule has minimal backtracking between stops!`
  }
];

/**
 * Match a user input against the curated knowledge base or return a smart structured answer
 */
export function getCuratedAnswer(userQuery: string, tripTitle?: string): string {
  const q = userQuery.toLowerCase().trim();

  // Check direct matches
  for (const item of CURATED_QA_KNOWLEDGE_BASE) {
    if (q.includes(item.category) || q === item.query.toLowerCase()) {
      return item.reply;
    }
  }

  // Check keywords
  if (q.includes('restaurant') || q.includes('food') || q.includes('eat') || q.includes('dinner') || q.includes('lunch') || q.includes('cafe')) {
    return CURATED_QA_KNOWLEDGE_BASE[0].reply;
  }

  if (q.includes('budget') || q.includes('cost') || q.includes('price') || q.includes('money') || q.includes('spend')) {
    return CURATED_QA_KNOWLEDGE_BASE[1].reply;
  }

  if (q.includes('weather') || q.includes('rain') || q.includes('pack') || q.includes('forecast') || q.includes('temp')) {
    return CURATED_QA_KNOWLEDGE_BASE[2].reply;
  }

  if (q.includes('delay') || q.includes('cancel') || q.includes('flight') || q.includes('hotel') || q.includes('disrupt')) {
    return CURATED_QA_KNOWLEDGE_BASE[3].reply;
  }

  if (q.includes('tip') || q.includes('etiquette') || q.includes('custom') || q.includes('culture') || q.includes('safe')) {
    return CURATED_QA_KNOWLEDGE_BASE[4].reply;
  }

  if (q.includes('pace') || q.includes('schedule') || q.includes('optimize') || q.includes('distance') || q.includes('walk')) {
    return CURATED_QA_KNOWLEDGE_BASE[5].reply;
  }

  // Default structured concierge answer
  return `I have evaluated your question for **${tripTitle || 'your tour itinerary'}**:\n\n` +
    `• **Itinerary Alignment:** All planned stops, verified accommodations, and scheduled activities remain in sync.\n` +
    `• **Next Recommendation:** Select one of the quick preset topics above (Dining Spots, Budget Trajectory, Weather Advisory, Disruption Protocol) for instant curated guidance.\n\n` +
    `How else can I assist your escape today?`;
}
