// Pure utility function mapping to CO2: Pure Functions & closures and CO3 Component Composition
// Handles eligibility rules calculation, isolated from component state for testability.

export const airports = [
  { code: 'DEL', name: 'Delhi (DEL)', region: 'IN' },
  { code: 'BOM', name: 'Mumbai (BOM)', region: 'IN' },
  { code: 'BLR', name: 'Bengaluru (BLR)', region: 'IN' },
  { code: 'MAA', name: 'Chennai (MAA)', region: 'IN' },
  { code: 'FRA', name: 'Frankfurt (FRA)', region: 'EU' },
  { code: 'CDG', name: 'Paris (CDG)', region: 'EU' },
  { code: 'LHR', name: 'London (LHR)', region: 'EU' }, 
  { code: 'FCO', name: 'Rome (FCO)', region: 'EU' },
  { code: 'JFK', name: 'New York (JFK)', region: 'US' },
  { code: 'ORD', name: 'Chicago (ORD)', region: 'US' },
  { code: 'LAX', name: 'Los Angeles (LAX)', region: 'US' },
  { code: 'DXB', name: 'Dubai (DXB)', region: 'Other' },
  { code: 'SIN', name: 'Singapore (SIN)', region: 'Other' }
];

export function calculateEligibility(formData) {
  const depAirport = airports.find(a => a.name === formData.departure);
  const arrAirport = airports.find(a => a.name === formData.arrival);

  if (!depAirport || !arrAirport) {
    return {
      eligible: false,
      reason: "Could not find departure or arrival airport.",
      amount: 0,
      regulation: "None"
    };
  }

  const isDepEU = depAirport.region === 'EU';
  const isArrEU = arrAirport.region === 'EU';
  const isDepIN = depAirport.region === 'IN';
  const isArrIN = arrAirport.region === 'IN';
  const isDepUS = depAirport.region === 'US';
  const isArrUS = arrAirport.region === 'US';

  // Rule 1: Regulations coverage
  const isEU261Eligible = isDepEU || isArrEU;
  const isUSEligible = isDepUS || isArrUS;

  if (!isEU261Eligible && !isUSEligible) {
    return {
      eligible: false,
      reason: "Neither the departure nor arrival airport falls within the jurisdiction of EU261 or US DOT regulations. Both airports must be in the EU/US or operated by an EU carrier.",
      amount: 0,
      regulation: "None"
    };
  }

  // Rule 2: Delay duration
  const isDelayEligible = ['3-4 hours', 'More than 4 hours', 'Cancelled', 'Overbooked'].includes(formData.delayDuration);
  if (!isDelayEligible && formData.delayDuration !== '2-3 hours') {
    return {
      eligible: false,
      reason: "The delay duration must be at least 3 hours at your final destination to qualify for monetary compensation under EU261 regulations.",
      amount: 0,
      regulation: "EU261"
    };
  }

  // Rule 3: Extraordinary circumstances
  const extraordinaryReasons = ['Extreme weather', 'Air Traffic Control (ATC) restrictions', 'Airport strike'];
  const isExtraordinary = extraordinaryReasons.includes(formData.delayReason);
  if (isExtraordinary) {
    return {
      eligible: false,
      reason: `Your delay was caused by "${formData.delayReason}" which is classified as an "extraordinary circumstance" under EU261. Airlines are exempt from payout obligations for factors outside their control.`,
      amount: 0,
      regulation: "EU261"
    };
  }

  // Calculation of Amount in Euros
  let baseAmount = 250;
  let distanceCategory = "Short-haul (≤ 1,500 km)";

  const isTransatlantic = (isDepEU && isArrUS) || (isDepUS && isArrEU);
  const isLongDistance = (depAirport.region === 'Other' || arrAirport.region === 'Other' || isDepIN || isArrIN);

  if (isTransatlantic || (isLongDistance && (isDepEU || isArrEU || isDepUS || isArrUS))) {
    baseAmount = 600;
    distanceCategory = "Long-haul (> 3,500 km)";
  } else if (isLongDistance || (depAirport.code === 'FCO' && arrAirport.code === 'FRA') || (depAirport.code === 'FRA' && arrAirport.code === 'FCO')) {
    baseAmount = 400;
    distanceCategory = "Medium-haul (1,500 km - 3,500 km)";
  }

  // Travel Class multiplier: Premium Economy = 1.25x, Business = 1.5x, First = 2.0x
  let classMultiplier = 1.0;
  const travelClass = formData.travelClass || 'Economy';
  if (travelClass === 'Premium Economy') classMultiplier = 1.25;
  else if (travelClass === 'Business') classMultiplier = 1.5;
  else if (travelClass === 'First') classMultiplier = 2.0;

  // Ticket price contribution based on delay duration
  let pricePercentage = 0.0;
  if (formData.delayDuration === '3-4 hours') pricePercentage = 0.10;
  else if (formData.delayDuration === 'More than 4 hours') pricePercentage = 0.15;
  else if (formData.delayDuration === 'Cancelled') pricePercentage = 0.30;
  else if (formData.delayDuration === 'Overbooked') pricePercentage = 0.50;

  const ticketPriceINR = parseFloat(formData.ticketPrice) || 0;
  const ticketPriceEUR = ticketPriceINR / 90;

  const finalAmount = (baseAmount * classMultiplier) + (ticketPriceEUR * pricePercentage);

  let regulationName = "Regulation EC 261/2004";
  if (formData.delayDuration === 'Cancelled' && isUSEligible && !isDepEU) {
    regulationName = "US DOT Passenger Protection Guidelines";
  }

  return {
    eligible: true,
    amount: parseFloat(finalAmount.toFixed(2)),
    baseAmount,
    classMultiplier,
    pricePercentage,
    ticketPriceBonus: parseFloat((ticketPriceEUR * pricePercentage).toFixed(2)),
    regulation: regulationName,
    distanceCategory: `${distanceCategory} • Class: ${travelClass}`,
    reason: `Congratulations! Your flight details meet all eligibility criteria under ${regulationName} for a delay due to airline operational issues (${formData.delayReason}).`
  };
}
