// Simulated API Service Layer mapping to CO4: Async Data Engineering & API Integration
// Demonstrates functional async flows, promise chains, and latency simulation.

const LATENCY_MS = 800; // Simulated network delay

const initialClaims = [
  {
    id: 'CLM-983172',
    passengerName: 'Jane Doe',
    passengerEmail: 'jane.doe@example.com',
    passengerPhone: '+1 (555) 019-2834',
    passportNumber: 'LH430123',
    flightNumber: 'LH430',
    departureAirport: 'Frankfurt (FRA)',
    arrivalAirport: 'Chicago (ORD)',
    flightDate: '2026-05-15',
    delayHours: 4.5,
    delayReason: 'Technical Fault',
    status: 'Approved',
    compensationAmount: 600,
    boardingPassDoc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    idProofDoc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    submittedAt: '2026-05-16T10:00:00.000Z',
    comments: [
      { sender: 'System', text: 'Claim submitted successfully.', timestamp: '2026-05-16T10:00:00.000Z' },
      { sender: 'Admin', text: 'Documents verified. Compensation approved according to EU261 regulations.', timestamp: '2026-05-17T14:30:00.000Z' }
    ]
  },
  {
    id: 'CLM-124095',
    passengerName: 'John Smith',
    passengerEmail: 'john.smith@example.com',
    passengerPhone: '+1 (555) 024-9102',
    passportNumber: 'AF015123',
    flightNumber: 'AF015',
    departureAirport: 'Paris (CDG)',
    arrivalAirport: 'New York (JFK)',
    flightDate: '2026-06-01',
    delayHours: 3.5,
    delayReason: 'Crew Schedule',
    status: 'Processing',
    compensationAmount: 600,
    boardingPassDoc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    idProofDoc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    submittedAt: '2026-06-02T08:15:00.000Z',
    comments: [
      { sender: 'System', text: 'Claim submitted successfully.', timestamp: '2026-06-02T08:15:00.000Z' },
      { sender: 'Admin', text: 'Awaiting crew log confirmation from Air France.', timestamp: '2026-06-03T11:20:00.000Z' }
    ]
  },
  {
    id: 'CLM-503921',
    passengerName: 'Alice Johnson',
    passengerEmail: 'alice.j@example.com',
    passengerPhone: '+1 (555) 073-4921',
    passportNumber: 'DL084123',
    flightNumber: 'DL084',
    departureAirport: 'Atlanta (ATL)',
    arrivalAirport: 'London (LHR)',
    flightDate: '2026-05-20',
    delayHours: 5,
    delayReason: 'Severe Thunderstorms',
    status: 'Rejected',
    compensationAmount: 0,
    boardingPassDoc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    idProofDoc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    submittedAt: '2026-05-21T09:45:00.000Z',
    comments: [
      { sender: 'System', text: 'Claim submitted successfully.', timestamp: '2026-05-21T09:45:00.000Z' },
      { sender: 'Admin', text: 'Compensation rejected: Delay was caused by extraordinary weather circumstances (Article 5(3) of Regulation EC 261/2004).', timestamp: '2026-05-22T16:10:00.000Z' }
    ]
  }
];

// Helper to simulate network latency using promise chains
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getClaimsFromStorage = () => {
  const saved = localStorage.getItem('claims');
  if (!saved) {
    localStorage.setItem('claims', JSON.stringify(initialClaims));
    return initialClaims;
  }
  return JSON.parse(saved);
};

const saveClaimsToStorage = (claims) => {
  localStorage.setItem('claims', JSON.stringify(claims));
};

export const api = {
  // GET all claims
  async fetchClaims() {
    await delay(LATENCY_MS);
    return getClaimsFromStorage();
  },

  // POST submit new claim
  async submitClaim(claimData) {
    await delay(LATENCY_MS);
    const claims = getClaimsFromStorage();
    const id = 'CLM-' + Math.floor(100000 + Math.random() * 900000);
    const newClaim = {
      id,
      ...claimData,
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
      comments: [
        { sender: 'System', text: 'Claim submitted successfully.', timestamp: new Date().toISOString() }
      ]
    };
    const updated = [newClaim, ...claims];
    saveClaimsToStorage(updated);
    return newClaim;
  },

  // PUT update claim status
  async updateClaimStatus(claimId, status, commentText) {
    await delay(LATENCY_MS);
    const claims = getClaimsFromStorage();
    let updatedClaim = null;
    const updated = claims.map((claim) => {
      if (claim.id === claimId) {
        const commentObj = {
          sender: 'Admin',
          text: commentText || `Status updated to ${status}.`,
          timestamp: new Date().toISOString()
        };
        updatedClaim = {
          ...claim,
          status,
          comments: [...claim.comments, commentObj]
        };
        return updatedClaim;
      }
      return claim;
    });

    if (updatedClaim) {
      saveClaimsToStorage(updated);
    }
    return updatedClaim;
  },

  // POST login mock authentication
  async login(email, password) {
    await delay(LATENCY_MS);
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const claims = getClaimsFromStorage();
    const matchedClaim = claims.find((c) => c.passengerEmail.toLowerCase() === email.toLowerCase());

    const userObj = {
      name: matchedClaim ? matchedClaim.passengerName : 'Guest Passenger',
      email: email,
      phone: matchedClaim ? matchedClaim.passengerPhone : '+91 98765 43210',
      passport: matchedClaim ? matchedClaim.passportNumber : 'PP99887766'
    };
    return userObj;
  }
};
