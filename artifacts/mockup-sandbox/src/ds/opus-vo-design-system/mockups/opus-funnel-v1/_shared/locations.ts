export type SignupLocation = {
  id: string;
  name: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  stateCode: string;
  zipCode: string;
  imageUrl: string;
  isPremium: boolean;
};

// Static snapshot of the available OPUS virtual office locations.
export const availableLocations: SignupLocation[] = [
  {
    id: "loc-1285",
    name: "Miami - Brickell Avenue",
    address: "848 Brickell Avenue",
    addressLine2: "PH5",
    city: "Miami",
    state: "Florida",
    stateCode: "FL",
    zipCode: "33131",
    imageUrl: "/__mockup/images/miami-office.webp",
    isPremium: true,
  },
  {
    id: "loc-776",
    name: "Boca Raton - Corporate Blvd",
    address: "1825 NW Corporate Blvd",
    addressLine2: "Suite 110",
    city: "Boca Raton",
    state: "Florida",
    stateCode: "FL",
    zipCode: "33431",
    imageUrl: "/__mockup/images/boca-raton-office.webp",
    isPremium: true,
  },
  {
    id: "loc-803",
    name: "Fort Lauderdale - Las Olas",
    address: "515 E Las Olas Boulevard",
    addressLine2: "Suite 1301",
    city: "Fort Lauderdale",
    state: "Florida",
    stateCode: "FL",
    zipCode: "33301",
    imageUrl: "/__mockup/images/fort-lauderdale-office.jpg",
    isPremium: true,
  },
  {
    id: "loc-1499",
    name: "Orlando - Robinson Street",
    address: "200 E Robinson Street",
    addressLine2: "Suite 1120",
    city: "Orlando",
    state: "Florida",
    stateCode: "FL",
    zipCode: "32801",
    imageUrl: "/__mockup/images/orlando-office.webp",
    isPremium: true,
  },
  {
    id: "loc-885",
    name: "Tampa - Truist Place",
    address: "401 East Jackson Street",
    addressLine2: "Suite 2340",
    city: "Tampa",
    state: "Florida",
    stateCode: "FL",
    zipCode: "33602",
    imageUrl: "/__mockup/images/tampa-office.webp",
    isPremium: true,
  },
];