export type LanguageCode =
  | 'en' // English (Default / Fallback)
  | 'hi' // Hindi — हिन्दी
  | 'mr' // Marathi — मराठी
  | 'bn' // Bengali — বাংলা
  | 'gu' // Gujarati — ગુજરાતી
  | 'kn' // Kannada — ಕನ್ನಡ
  | 'te' // Telugu — తెలుగు
  | 'ta' // Tamil — தமிழ்
  | 'ml' // Malayalam — മലയാളം
  | 'pa' // Punjabi — ਪੰਜਾਬੀ
  | 'or' // Odia — ଓଡ଼ିଆ
  | 'as' // Assamese — অসমীয়া
  | 'ur' // Urdu — اردو
  | 'sa' // Sanskrit — संस्कृतम्
  | 'ne' // Nepali — नेपाली
  | 'kok' // Konkani — कोंकणी
  | 'mai' // Maithili — मैथिली
  | 'ks' // Kashmiri — کٲشُر / कश्मीरी
  | 'sd' // Sindhi — سنڌي / सिन्धी
  | 'brx' // Bodo — बड़ो
  | 'doi' // Dogri — डोगरी
  | 'mni' // Manipuri — মেইতেই / মণিপুরী
  | 'sat'; // Santali — ᱥᱟᱱᱛᱟᱞᱤ

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  script: string;
  region: string;
  dir: 'ltr' | 'rtl';
  direction?: 'ltr' | 'rtl';
  popular?: boolean;
}

export type SupportedLanguage = LanguageInfo;

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    region: 'Pan-India',
    dir: 'ltr',
    popular: true,
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    region: 'North & Central India',
    dir: 'ltr',
    popular: true,
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    region: 'Maharashtra & Goa',
    dir: 'ltr',
    popular: true,
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    region: 'West Bengal & Tripura',
    dir: 'ltr',
    popular: true,
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    region: 'Andhra Pradesh & Telangana',
    dir: 'ltr',
    popular: true,
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    region: 'Tamil Nadu & Puducherry',
    dir: 'ltr',
    popular: true,
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    region: 'Gujarat',
    dir: 'ltr',
    popular: true,
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    region: 'Karnataka',
    dir: 'ltr',
    popular: true,
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    region: 'Kerala & Lakshadweep',
    dir: 'ltr',
    popular: true,
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    region: 'Punjab & Chandigarh',
    dir: 'ltr',
    popular: true,
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    region: 'Odisha',
    dir: 'ltr',
    popular: true,
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'Bengali-Assamese',
    region: 'Assam',
    dir: 'ltr',
    popular: true,
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    script: 'Nastaliq / Arabic',
    region: 'Jammu & Kashmir, Telangana, UP, Bihar',
    dir: 'rtl',
    popular: true,
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    script: 'Devanagari',
    region: 'Pan-India Classical',
    dir: 'ltr',
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    script: 'Devanagari',
    region: 'Sikkim, West Bengal, Assam',
    dir: 'ltr',
  },
  {
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    script: 'Devanagari / Roman',
    region: 'Goa, Coastal Karnataka & Maharashtra',
    dir: 'ltr',
  },
  {
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    script: 'Devanagari / Tirhuta',
    region: 'Bihar & Jharkhand',
    dir: 'ltr',
  },
  {
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'کٲشُر / कश्मीरी',
    script: 'Perso-Arabic / Devanagari',
    region: 'Jammu & Kashmir',
    dir: 'rtl',
  },
  {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'سنڌي / सिन्धी',
    script: 'Perso-Arabic / Devanagari',
    region: 'Gujarat, Rajasthan, Maharashtra',
    dir: 'rtl',
  },
  {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बड़ो',
    script: 'Devanagari',
    region: 'Bodoland, Assam',
    dir: 'ltr',
  },
  {
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    script: 'Devanagari',
    region: 'Jammu & Kashmir, Himachal Pradesh',
    dir: 'ltr',
  },
  {
    code: 'mni',
    name: 'Manipuri',
    nativeName: 'মেইতেই / মণিপুরী',
    script: 'Bengali / Meitei Mayek',
    region: 'Manipur',
    dir: 'ltr',
  },
  {
    code: 'sat',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱞᱤ',
    script: 'Ol Chiki',
    region: 'Jharkhand, Odisha, West Bengal',
    dir: 'ltr',
  },
];
