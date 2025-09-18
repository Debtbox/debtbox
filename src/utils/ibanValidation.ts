// IBAN validation utility
// Based on ISO 13616 standard

// IBAN length by country (common countries)
const IBAN_LENGTHS: Record<string, number> = {
  SA: 24, // Saudi Arabia
  AE: 23, // UAE
  KW: 30, // Kuwait
  BH: 22, // Bahrain
  QA: 29, // Qatar
  OM: 23, // Oman
  JO: 30, // Jordan
  LB: 28, // Lebanon
  EG: 29, // Egypt
  MA: 28, // Morocco
  TN: 24, // Tunisia
  DZ: 24, // Algeria
  LY: 25, // Libya
  SD: 18, // Sudan
  IQ: 23, // Iraq
  SY: 23, // Syria
  YE: 24, // Yemen
  PS: 29, // Palestine
  // European countries
  GB: 22, // United Kingdom
  DE: 22, // Germany
  FR: 27, // France
  IT: 27, // Italy
  ES: 24, // Spain
  NL: 18, // Netherlands
  BE: 16, // Belgium
  AT: 20, // Austria
  CH: 21, // Switzerland
  SE: 24, // Sweden
  NO: 15, // Norway
  DK: 18, // Denmark
  FI: 18, // Finland
  PL: 28, // Poland
  CZ: 24, // Czech Republic
  HU: 28, // Hungary
  GR: 27, // Greece
  PT: 25, // Portugal
  IE: 22, // Ireland
  LU: 20, // Luxembourg
  MT: 31, // Malta
  CY: 28, // Cyprus
  BG: 22, // Bulgaria
  HR: 21, // Croatia
  RO: 24, // Romania
  SK: 24, // Slovakia
  SI: 19, // Slovenia
  EE: 20, // Estonia
  LV: 21, // Latvia
  LT: 20, // Lithuania
};

/**
 * Validates IBAN format and check digits
 * @param iban - The IBAN string to validate
 * @returns Object with validation result and error message
 */
export const validateIBAN = (iban: string): { isValid: boolean; error?: string } => {
  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();

  // Check if IBAN is empty
  if (!cleanIban) {
    return { isValid: false, error: 'IBAN is required' };
  }

  // Check if IBAN contains only alphanumeric characters
  if (!/^[A-Z0-9]+$/.test(cleanIban)) {
    return { isValid: false, error: 'IBAN can only contain letters and numbers' };
  }

  // Check if IBAN starts with country code (2 letters)
  if (!/^[A-Z]{2}/.test(cleanIban)) {
    return { isValid: false, error: 'IBAN must start with a valid country code' };
  }

  // Extract country code
  const countryCode = cleanIban.substring(0, 2);

  // Check if country code is supported
  if (!IBAN_LENGTHS[countryCode]) {
    return { isValid: false, error: 'Unsupported country code' };
  }

  // Check IBAN length for the country
  if (cleanIban.length !== IBAN_LENGTHS[countryCode]) {
    return { 
      isValid: false, 
      error: `IBAN for ${countryCode} must be ${IBAN_LENGTHS[countryCode]} characters long` 
    };
  }

  // Validate check digits using mod-97 algorithm
  if (!validateCheckDigits(cleanIban)) {
    return { isValid: false, error: 'Invalid IBAN check digits' };
  }

  return { isValid: true };
};

/**
 * Validates IBAN check digits using mod-97 algorithm
 * @param iban - The IBAN string to validate
 * @returns boolean indicating if check digits are valid
 */
const validateCheckDigits = (iban: string): boolean => {
  // Move first 4 characters to end
  const rearranged = iban.substring(4) + iban.substring(0, 4);

  // Replace letters with numbers (A=10, B=11, ..., Z=35)
  const numericString = rearranged.replace(/[A-Z]/g, (char) => 
    (char.charCodeAt(0) - 55).toString()
  );

  // Calculate mod 97
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
  }

  return remainder === 1;
};

/**
 * Formats IBAN with spaces for better readability
 * @param iban - The IBAN string to format
 * @returns Formatted IBAN string
 */
export const formatIBAN = (iban: string): string => {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  // Add spaces every 4 characters
  return cleanIban.replace(/(.{4})/g, '$1 ').trim();
};

/**
 * Gets the country name from IBAN country code
 * @param countryCode - The 2-letter country code
 * @returns Country name or undefined if not found
 */
export const getCountryName = (countryCode: string): string | undefined => {
  const countryNames: Record<string, string> = {
    SA: 'Saudi Arabia',
    AE: 'United Arab Emirates',
    KW: 'Kuwait',
    BH: 'Bahrain',
    QA: 'Qatar',
    OM: 'Oman',
    JO: 'Jordan',
    LB: 'Lebanon',
    EG: 'Egypt',
    MA: 'Morocco',
    TN: 'Tunisia',
    DZ: 'Algeria',
    LY: 'Libya',
    SD: 'Sudan',
    IQ: 'Iraq',
    SY: 'Syria',
    YE: 'Yemen',
    PS: 'Palestine',
    GB: 'United Kingdom',
    DE: 'Germany',
    FR: 'France',
    IT: 'Italy',
    ES: 'Spain',
    NL: 'Netherlands',
    BE: 'Belgium',
    AT: 'Austria',
    CH: 'Switzerland',
    SE: 'Sweden',
    NO: 'Norway',
    DK: 'Denmark',
    FI: 'Finland',
    PL: 'Poland',
    CZ: 'Czech Republic',
    HU: 'Hungary',
    GR: 'Greece',
    PT: 'Portugal',
    IE: 'Ireland',
    LU: 'Luxembourg',
    MT: 'Malta',
    CY: 'Cyprus',
    BG: 'Bulgaria',
    HR: 'Croatia',
    RO: 'Romania',
    SK: 'Slovakia',
    SI: 'Slovenia',
    EE: 'Estonia',
    LV: 'Latvia',
    LT: 'Lithuania',
  };

  return countryNames[countryCode];
};

/**
 * Gets supported countries list
 * @returns Array of supported country codes
 */
export const getSupportedCountries = (): string[] => {
  return Object.keys(IBAN_LENGTHS);
};
