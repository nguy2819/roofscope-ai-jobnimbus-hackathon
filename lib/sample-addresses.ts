import { Address } from '@/types';

// JobNimbus test addresses + additional realistic demo addresses for autocomplete
// Coordinates added for Google Solar API integration
export const SAMPLE_ADDRESSES: Address[] = [
  // JobNimbus Test Addresses
  {
    street: '3561 E 102nd Ct',
    city: 'Thornton',
    state: 'CO',
    zip: '80229',
    full: '3561 E 102nd Ct, Thornton, CO 80229',
    lat: 39.8864,
    lng: -104.9378,
  },
  {
    street: '1612 S Canton Ave',
    city: 'Springfield',
    state: 'MO',
    zip: '65802',
    full: '1612 S Canton Ave, Springfield, MO 65802',
    lat: 37.1833,
    lng: -93.2683,
  },
  {
    street: '6310 Laguna Bay Court',
    city: 'Houston',
    state: 'TX',
    zip: '77041',
    full: '6310 Laguna Bay Court, Houston, TX 77041',
    lat: 29.8644,
    lng: -95.5361,
  },
  {
    street: '3820 E Rosebrier St',
    city: 'Springfield',
    state: 'MO',
    zip: '65809',
    full: '3820 E Rosebrier St, Springfield, MO 65809',
    lat: 37.1589,
    lng: -93.2344,
  },
  {
    street: '1261 20th Street',
    city: 'Newport News',
    state: 'VA',
    zip: '23607',
    full: '1261 20th Street, Newport News, VA 23607',
    lat: 37.0871,
    lng: -76.4730,
  },
  // Additional Demo Addresses for realistic autocomplete
  {
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zip: '97477',
    full: '742 Evergreen Terrace, Springfield, OR 97477',
    lat: 44.0462,
    lng: -122.9814,
  },
  {
    street: '1600 Pennsylvania Avenue NW',
    city: 'Washington',
    state: 'DC',
    zip: '20500',
    full: '1600 Pennsylvania Avenue NW, Washington, DC 20500',
    lat: 38.8977,
    lng: -77.0365,
  },
  {
    street: '221B Baker Street',
    city: 'London',
    state: 'UK',
    zip: 'NW1 6XE',
    full: '221B Baker Street, London, UK NW1 6XE',
    lat: 51.5237,
    lng: -0.1585,
  },
  {
    street: '4567 Oak Ridge Drive',
    city: 'Austin',
    state: 'TX',
    zip: '78731',
    full: '4567 Oak Ridge Drive, Austin, TX 78731',
    lat: 30.3505,
    lng: -97.7835,
  },
  {
    street: '890 Maple Avenue',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    full: '890 Maple Avenue, Seattle, WA 98101',
    lat: 47.6062,
    lng: -122.3321,
  },
  {
    street: '2345 Sunset Boulevard',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90026',
    full: '2345 Sunset Boulevard, Los Angeles, CA 90026',
    lat: 34.0778,
    lng: -118.2654,
  },
  {
    street: '678 Pine Street',
    city: 'Denver',
    state: 'CO',
    zip: '80202',
    full: '678 Pine Street, Denver, CO 80202',
    lat: 39.7392,
    lng: -104.9903,
  },
  {
    street: '1515 Broadway',
    city: 'New York',
    state: 'NY',
    zip: '10036',
    full: '1515 Broadway, New York, NY 10036',
    lat: 40.7580,
    lng: -73.9855,
  },
];

export function parseAddress(addressString: string): Address {
  const parts = addressString.split(',').map(p => p.trim());
  
  if (parts.length >= 3) {
    const street = parts[0];
    const city = parts[1];
    const stateZip = parts[2].split(' ');
    const state = stateZip[0];
    const zip = stateZip[1] || '';
    
    return {
      street,
      city,
      state,
      zip,
      full: addressString,
    };
  }
  
  return {
    street: addressString,
    city: '',
    state: '',
    zip: '',
    full: addressString,
  };
}

export function filterAddresses(query: string, addresses: Address[]): Address[] {
  if (!query) return addresses;
  
  const lowerQuery = query.toLowerCase();
  return addresses.filter(addr => 
    addr.full.toLowerCase().includes(lowerQuery) ||
    addr.street.toLowerCase().includes(lowerQuery) ||
    addr.city.toLowerCase().includes(lowerQuery) ||
    addr.state.toLowerCase().includes(lowerQuery) ||
    addr.zip.includes(lowerQuery)
  );
}

// Made with Bob
