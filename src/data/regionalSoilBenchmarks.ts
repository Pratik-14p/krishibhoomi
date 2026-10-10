export interface RegionalBenchmark {
  regionKey: string;
  state: string;
  zoneName: string;
  defaultSoilType: string;
  soilN: number; // kg/ha
  soilP: number; // kg/ha
  soilK: number; // kg/ha
  ph: number;
  organicCarbon: number; // %
  stapleCrops: {
    cropName: string;
    season: 'Rabi' | 'Kharif' | 'Zaid';
    category: 'Cereal' | 'Pulse' | 'Oilseed' | 'Cash Crop' | 'Vegetable';
  }[];
  description: string;
}

export interface RegionOption {
  label: string;
  value: string;
  state: string;
  defaultSoil: string;
}

export const ALL_INDIAN_REGIONS: RegionOption[] = [
  // Maharashtra
  { label: 'Maharashtra (Nagpur / Vidarbha Cotton-Soybean Belt)', value: 'Nagpur, Maharashtra', state: 'Maharashtra', defaultSoil: 'Deep Black Cotton Soil (Regur)' },
  { label: 'Maharashtra (Pune / Western Maharashtra)', value: 'Pune, Maharashtra', state: 'Maharashtra', defaultSoil: 'Medium Deep Clay Loam' },
  { label: 'Maharashtra (Nashik / Khandesh Horticultural Zone)', value: 'Nashik, Maharashtra', state: 'Maharashtra', defaultSoil: 'Black Soil' },
  { label: 'Maharashtra (Sangli / Kolhapur Sugarcane Zone)', value: 'Sangli, Maharashtra', state: 'Maharashtra', defaultSoil: 'Deep Black Cotton Soil (Regur)' },
  { label: 'Maharashtra (Amravati / Yavatmal Cotton Belt)', value: 'Amravati, Maharashtra', state: 'Maharashtra', defaultSoil: 'Deep Black Cotton Soil (Regur)' },
  { label: 'Maharashtra (Solapur / Marathwada Arid Zone)', value: 'Solapur, Maharashtra', state: 'Maharashtra', defaultSoil: 'Black Soil' },
  
  // Madhya Pradesh
  { label: 'Madhya Pradesh (Indore / Malwa Grain & Soybean Bowl)', value: 'Indore, Madhya Pradesh', state: 'Madhya Pradesh', defaultSoil: 'Black Soil' },
  { label: 'Madhya Pradesh (Bhopal / Central Plateau)', value: 'Bhopal, Madhya Pradesh', state: 'Madhya Pradesh', defaultSoil: 'Black Soil' },
  { label: 'Madhya Pradesh (Ujjain / Nimar Agro-Zone)', value: 'Ujjain, Madhya Pradesh', state: 'Madhya Pradesh', defaultSoil: 'Medium Deep Clay Loam' },
  { label: 'Madhya Pradesh (Jabalpur / Mahakoshal Rice-Wheat)', value: 'Jabalpur, Madhya Pradesh', state: 'Madhya Pradesh', defaultSoil: 'Alluvial Loam' },
  { label: 'Madhya Pradesh (Gwalior / Chambal Mustard Belt)', value: 'Gwalior, Madhya Pradesh', state: 'Madhya Pradesh', defaultSoil: 'Alluvial Loam' },

  // Punjab
  { label: 'Punjab (Ludhiana / Central Alluvial Plains)', value: 'Ludhiana, Punjab', state: 'Punjab', defaultSoil: 'Alluvial Loam' },
  { label: 'Punjab (Bathinda / South-West Cotton Belt)', value: 'Bathinda, Punjab', state: 'Punjab', defaultSoil: 'Alluvial Loamy Sand' },
  { label: 'Punjab (Amritsar / Majha Rice-Wheat Zone)', value: 'Amritsar, Punjab', state: 'Punjab', defaultSoil: 'Alluvial Loam' },
  { label: 'Punjab (Patiala / Malwa Eastern Basin)', value: 'Patiala, Punjab', state: 'Punjab', defaultSoil: 'Alluvial Loam' },

  // Haryana
  { label: 'Haryana (Karnal / National Basmati Rice Belt)', value: 'Karnal, Haryana', state: 'Haryana', defaultSoil: 'Alluvial Loam' },
  { label: 'Haryana (Hisar / Western Cotton-Mustard Zone)', value: 'Hisar, Haryana', state: 'Haryana', defaultSoil: 'Sandy Loam' },
  { label: 'Haryana (Ambala / Northern Alluvial)', value: 'Ambala, Haryana', state: 'Haryana', defaultSoil: 'Alluvial Loam' },

  // Uttar Pradesh
  { label: 'Uttar Pradesh (Varanasi / Eastern Gangetic Plain)', value: 'Varanasi, Uttar Pradesh', state: 'Uttar Pradesh', defaultSoil: 'Alluvial Loam' },
  { label: 'Uttar Pradesh (Meerut / Western Sugarcane Belt)', value: 'Meerut, Uttar Pradesh', state: 'Uttar Pradesh', defaultSoil: 'Alluvial Loam' },
  { label: 'Uttar Pradesh (Lucknow / Central Oudh Plains)', value: 'Lucknow, Uttar Pradesh', state: 'Uttar Pradesh', defaultSoil: 'Alluvial Loam' },
  { label: 'Uttar Pradesh (Agra / Braj Mustard-Potato Belt)', value: 'Agra, Uttar Pradesh', state: 'Uttar Pradesh', defaultSoil: 'Alluvial Loam' },
  { label: 'Uttar Pradesh (Gorakhpur / Tarai Basin)', value: 'Gorakhpur, Uttar Pradesh', state: 'Uttar Pradesh', defaultSoil: 'Clay Loam' },

  // Gujarat
  { label: 'Gujarat (Rajkot / Saurashtra Groundnut-Cotton Belt)', value: 'Rajkot, Gujarat', state: 'Gujarat', defaultSoil: 'Medium Deep Clay Loam' },
  { label: 'Gujarat (Ahmedabad / Central Plains)', value: 'Ahmedabad, Gujarat', state: 'Gujarat', defaultSoil: 'Alluvial Loamy Sand' },
  { label: 'Gujarat (Surat / South Gujarat Heavy Soil)', value: 'Surat, Gujarat', state: 'Gujarat', defaultSoil: 'Black Soil' },
  { label: 'Gujarat (Junagadh / Coastal Gir Groundnut)', value: 'Junagadh, Gujarat', state: 'Gujarat', defaultSoil: 'Medium Deep Clay Loam' },

  // Rajasthan
  { label: 'Rajasthan (Jaipur / Central Semi-Arid Zone)', value: 'Jaipur, Rajasthan', state: 'Rajasthan', defaultSoil: 'Sandy Loam' },
  { label: 'Rajasthan (Kota / Hadoti Soybean & Wheat Bowl)', value: 'Kota, Rajasthan', state: 'Rajasthan', defaultSoil: 'Black Soil' },
  { label: 'Rajasthan (Sri Ganganagar / Canal Irrigated Oasis)', value: 'Sri Ganganagar, Rajasthan', state: 'Rajasthan', defaultSoil: 'Alluvial Loam' },
  { label: 'Rajasthan (Jodhpur / Marwar Millet & Guar)', value: 'Jodhpur, Rajasthan', state: 'Rajasthan', defaultSoil: 'Desert / Arid Sandy Soil' },

  // Bihar
  { label: 'Bihar (Patna / South Bihar Alluvial Plain)', value: 'Patna, Bihar', state: 'Bihar', defaultSoil: 'Alluvial Loam' },
  { label: 'Bihar (Muzaffarpur / North Bihar Calcareous)', value: 'Muzaffarpur, Bihar', state: 'Bihar', defaultSoil: 'Alluvial Loam' },
  { label: 'Bihar (Bhagalpur / Silk City Agricultural Belt)', value: 'Bhagalpur, Bihar', state: 'Bihar', defaultSoil: 'Clay Loam' },

  // Karnataka
  { label: 'Karnataka (Dharwad / North Interior Black Soil)', value: 'Dharwad, Karnataka', state: 'Karnataka', defaultSoil: 'Black Soil' },
  { label: 'Karnataka (Belagavi / Malaprabha Basin)', value: 'Belagavi, Karnataka', state: 'Karnataka', defaultSoil: 'Medium Deep Clay Loam' },
  { label: 'Karnataka (Bengaluru / Southern Red Loam Region)', value: 'Bengaluru, Karnataka', state: 'Karnataka', defaultSoil: 'Red Loam' },
  { label: 'Karnataka (Mysuru / Cauvery Valley)', value: 'Mysuru, Karnataka', state: 'Karnataka', defaultSoil: 'Red Sandy Loam' },

  // Telangana
  { label: 'Telangana (Warangal / Central Cotton-Chilli Basin)', value: 'Warangal, Telangana', state: 'Telangana', defaultSoil: 'Black Soil' },
  { label: 'Telangana (Hyderabad / Deccan Red Soil)', value: 'Hyderabad, Telangana', state: 'Telangana', defaultSoil: 'Red Loam' },
  { label: 'Telangana (Nizamabad / Godavari Irrigated Paddy)', value: 'Nizamabad, Telangana', state: 'Telangana', defaultSoil: 'Clay Loam' },

  // Andhra Pradesh
  { label: 'Andhra Pradesh (Guntur / Krishna Delta Chilli & Tobacco)', value: 'Guntur, Andhra Pradesh', state: 'Andhra Pradesh', defaultSoil: 'Black Soil' },
  { label: 'Andhra Pradesh (Kurnool / Rayalaseema Groundnut)', value: 'Kurnool, Andhra Pradesh', state: 'Andhra Pradesh', defaultSoil: 'Red Sandy Loam' },
  { label: 'Andhra Pradesh (Vijayawada / Delta Alluvial)', value: 'Vijayawada, Andhra Pradesh', state: 'Andhra Pradesh', defaultSoil: 'Alluvial Loam' },

  // West Bengal
  { label: 'West Bengal (Burdwan / Rice Bowl of Bengal)', value: 'Burdwan, West Bengal', state: 'West Bengal', defaultSoil: 'Alluvial Loam' },
  { label: 'West Bengal (Hooghly / Potato & Jute Basin)', value: 'Hooghly, West Bengal', state: 'West Bengal', defaultSoil: 'Clay Loam' },

  // Odisha
  { label: 'Odisha (Bhubaneswar / Coastal Alluvial Basin)', value: 'Bhubaneswar, Odisha', state: 'Odisha', defaultSoil: 'Alluvial Loam' },
  { label: 'Odisha (Sambalpur / Hirakud Command Area)', value: 'Sambalpur, Odisha', state: 'Odisha', defaultSoil: 'Red Loam' },

  // Tamil Nadu
  { label: 'Tamil Nadu (Thanjavur / Cauvery Delta Rice Bowl)', value: 'Thanjavur, Tamil Nadu', state: 'Tamil Nadu', defaultSoil: 'Alluvial Loam' },
  { label: 'Tamil Nadu (Coimbatore / Western Kongu Cotton)', value: 'Coimbatore, Tamil Nadu', state: 'Tamil Nadu', defaultSoil: 'Red Loam' },
];

export const REGIONAL_BENCHMARKS: Record<string, RegionalBenchmark> = {
  maharashtra: {
    regionKey: 'maharashtra',
    state: 'Maharashtra',
    zoneName: 'Western Plateau & Deccan Black Soil (Regur) Agro-Zone',
    defaultSoilType: 'Deep Black Cotton Soil (Regur)',
    soilN: 210,
    soilP: 32,
    soilK: 290,
    ph: 7.8,
    organicCarbon: 0.62,
    stapleCrops: [
      { cropName: 'JS-335 Yellow Soybean', season: 'Kharif', category: 'Oilseed' },
      { cropName: 'Bt Hybrid Cotton (RCH-659)', season: 'Kharif', category: 'Cash Crop' },
      { cropName: 'JG-11 Desi Chickpea (Gram / Chana)', season: 'Rabi', category: 'Pulse' },
      { cropName: 'BDN-711 Pigeon Pea (Arhar/Tur)', season: 'Kharif', category: 'Pulse' },
      { cropName: 'Bhima Super Onion', season: 'Rabi', category: 'Vegetable' },
      { cropName: 'Co-0238 High-Recovery Sugarcane', season: 'Rabi', category: 'Cash Crop' },
    ],
    description: 'High-clay Vertisols rich in potassium and calcium carbonate with moderate phosphorus and alkaline buffering.',
  },
  madhya_pradesh: {
    regionKey: 'madhya_pradesh',
    state: 'Madhya Pradesh',
    zoneName: 'Central Plateau & Malwa Soybean-Gram Agricultural Zone',
    defaultSoilType: 'Black Soil',
    soilN: 200,
    soilP: 34,
    soilK: 240,
    ph: 7.5,
    organicCarbon: 0.60,
    stapleCrops: [
      { cropName: 'JS-335 Yellow Soybean', season: 'Kharif', category: 'Oilseed' },
      { cropName: 'JG-11 Desi Chickpea (Gram / Chana)', season: 'Rabi', category: 'Pulse' },
      { cropName: 'HD-2967 High-Yield Bread Wheat', season: 'Rabi', category: 'Cereal' },
      { cropName: 'Pusa Bold Yellow Mustard', season: 'Rabi', category: 'Oilseed' },
      { cropName: 'Pusa Ageti / HUL-57 Desi Lentil (Masoor)', season: 'Rabi', category: 'Pulse' },
    ],
    description: 'Medium to deep black soils well-suited for Kharif pulses/oilseeds followed by high-quality Durum and bread wheat in Rabi.',
  },
  punjab_haryana: {
    regionKey: 'punjab_haryana',
    state: 'Punjab & Haryana',
    zoneName: 'Trans-Gangetic Intensive Foodgrain Production Plains',
    defaultSoilType: 'Alluvial Loam',
    soilN: 245,
    soilP: 38,
    soilK: 215,
    ph: 7.2,
    organicCarbon: 0.65,
    stapleCrops: [
      { cropName: 'HD-2967 High-Yield Bread Wheat', season: 'Rabi', category: 'Cereal' },
      { cropName: 'Pusa Basmati 1121 Paddy', season: 'Kharif', category: 'Cereal' },
      { cropName: 'Pusa Mustard / Sarson (Pusa Jai Kisan / Giriraj)', season: 'Rabi', category: 'Oilseed' },
      { cropName: 'Summer Moong Bean (Pusa Vishal)', season: 'Zaid', category: 'Pulse' },
      { cropName: 'Bt Hybrid Cotton (RCH-659)', season: 'Kharif', category: 'Cash Crop' },
    ],
    description: 'Fertile Indo-Gangetic alluvial loams with balanced nutrient status supporting intensive double and triple cropping cycles.',
  },
  uttar_pradesh_bihar: {
    regionKey: 'uttar_pradesh_bihar',
    state: 'Uttar Pradesh & Bihar',
    zoneName: 'Middle & Upper Gangetic Plains Agricultural Zone',
    defaultSoilType: 'Alluvial Loam',
    soilN: 220,
    soilP: 30,
    soilK: 200,
    ph: 7.4,
    organicCarbon: 0.58,
    stapleCrops: [
      { cropName: 'HD-2967 High-Yield Bread Wheat', season: 'Rabi', category: 'Cereal' },
      { cropName: 'Pusa Basmati 1121 Paddy', season: 'Kharif', category: 'Cereal' },
      { cropName: 'Co-0238 High-Recovery Sugarcane', season: 'Rabi', category: 'Cash Crop' },
      { cropName: 'Kufri Pukhraj Potato', season: 'Rabi', category: 'Vegetable' },
      { cropName: 'Pusa Ageti / HUL-57 Desi Lentil (Masoor)', season: 'Rabi', category: 'Pulse' },
      { cropName: 'Pioneer 3302 Hybrid Maize', season: 'Kharif', category: 'Cereal' },
    ],
    description: 'Deep alluvial silts and clay loams fed by the Ganga river system, supporting diverse grain, tuber, and sugarcane crops.',
  },
  gujarat: {
    regionKey: 'gujarat',
    state: 'Gujarat',
    zoneName: 'Western Gujarat Semi-Arid Plains & Coastal Zone',
    defaultSoilType: 'Medium Deep Clay Loam',
    soilN: 195,
    soilP: 32,
    soilK: 260,
    ph: 7.9,
    organicCarbon: 0.55,
    stapleCrops: [
      { cropName: 'Bt Hybrid Cotton (RCH-659)', season: 'Kharif', category: 'Cash Crop' },
      { cropName: 'TAG-24 Groundnut (Peanut)', season: 'Kharif', category: 'Oilseed' },
      { cropName: 'HHB-67 Improved Hybrid Pearl Millet (Bajra)', season: 'Kharif', category: 'Cereal' },
      { cropName: 'HD-2967 High-Yield Bread Wheat', season: 'Rabi', category: 'Cereal' },
      { cropName: 'JG-11 Desi Chickpea (Gram / Chana)', season: 'Rabi', category: 'Pulse' },
    ],
    description: 'Medium black and sandy loam soils with high potash content and drought resilience, prominent for groundnut and cotton.',
  },
  rajasthan: {
    regionKey: 'rajasthan',
    state: 'Rajasthan',
    zoneName: 'Western Dry & Semi-Arid Agro-Climatic Zone',
    defaultSoilType: 'Sandy Loam',
    soilN: 165,
    soilP: 26,
    soilK: 190,
    ph: 8.1,
    organicCarbon: 0.45,
    stapleCrops: [
      { cropName: 'Pusa Mustard / Sarson (Pusa Jai Kisan / Giriraj)', season: 'Rabi', category: 'Oilseed' },
      { cropName: 'HHB-67 Improved Hybrid Pearl Millet (Bajra)', season: 'Kharif', category: 'Cereal' },
      { cropName: 'JG-11 Desi Chickpea (Gram / Chana)', season: 'Rabi', category: 'Pulse' },
      { cropName: 'Summer Moong Bean (Pusa Vishal)', season: 'Zaid', category: 'Pulse' },
      { cropName: 'HD-2967 High-Yield Bread Wheat', season: 'Rabi', category: 'Cereal' },
    ],
    description: 'Light sandy and calcic soils requiring efficient moisture conservation, highly adapted to oilseeds, pulses, and drought-hardy millets.',
  },
  south_india: {
    regionKey: 'south_india',
    state: 'Karnataka, Telangana & Andhra Pradesh',
    zoneName: 'Southern Plateau & Coastal Agro-Ecological Zone',
    defaultSoilType: 'Red Loam',
    soilN: 205,
    soilP: 30,
    soilK: 220,
    ph: 6.8,
    organicCarbon: 0.58,
    stapleCrops: [
      { cropName: 'Pusa Basmati 1121 Paddy', season: 'Kharif', category: 'Cereal' },
      { cropName: 'Byadgi / G4 Commercial Red Chilli', season: 'Kharif', category: 'Cash Crop' },
      { cropName: 'GPU-28 Finger Millet (Ragi)', season: 'Kharif', category: 'Cereal' },
      { cropName: 'TAG-24 Groundnut (Peanut)', season: 'Kharif', category: 'Oilseed' },
      { cropName: 'Bt Hybrid Cotton (RCH-659)', season: 'Kharif', category: 'Cash Crop' },
      { cropName: 'Pioneer 3302 Hybrid Maize', season: 'Kharif', category: 'Cereal' },
    ],
    description: 'Well-drained red ferruginous soils and black cotton pockets ideal for commercial spice, millet, pulse, and cash crops.',
  },
  eastern_india: {
    regionKey: 'eastern_india',
    state: 'West Bengal & Odisha',
    zoneName: 'Lower Gangetic & Eastern Coastal Agro-Zone',
    defaultSoilType: 'Alluvial Loamy Sand',
    soilN: 230,
    soilP: 28,
    soilK: 195,
    ph: 6.3,
    organicCarbon: 0.70,
    stapleCrops: [
      { cropName: 'Pusa Basmati 1121 Paddy', season: 'Kharif', category: 'Cereal' },
      { cropName: 'Kufri Pukhraj Potato', season: 'Rabi', category: 'Vegetable' },
      { cropName: 'Pusa Ageti / HUL-57 Desi Lentil (Masoor)', season: 'Rabi', category: 'Pulse' },
      { cropName: 'Pioneer 3302 Hybrid Maize', season: 'Kharif', category: 'Cereal' },
    ],
    description: 'High rainfall coastal and deltaic alluvium with high organic matter, excellent for wetland paddy, jute, and winter vegetables.',
  },
};

/**
 * Resolves the ICAR regional benchmark given a location string and optional soil type
 */
export function getRegionalBenchmark(locationStr: string = '', soilTypeStr: string = ''): RegionalBenchmark {
  const loc = locationStr.toLowerCase();
  let baseKey = 'punjab_haryana';

  if (
    loc.includes('maharashtra') ||
    loc.includes('nagpur') ||
    loc.includes('vidarbha') ||
    loc.includes('pune') ||
    loc.includes('nashik') ||
    loc.includes('sangli') ||
    loc.includes('kolhapur') ||
    loc.includes('amravati') ||
    loc.includes('yavatmal') ||
    loc.includes('solapur') ||
    loc.includes('aurangabad') ||
    loc.includes('sambhajinagar') ||
    loc.includes('akola') ||
    loc.includes('jalgaon') ||
    loc.includes('mumbai')
  ) {
    baseKey = 'maharashtra';
  } else if (
    loc.includes('madhya pradesh') ||
    loc.includes('mp') ||
    loc.includes('indore') ||
    loc.includes('bhopal') ||
    loc.includes('ujjain') ||
    loc.includes('jabalpur') ||
    loc.includes('gwalior') ||
    loc.includes('sagar') ||
    loc.includes('dewas') ||
    loc.includes('malwa')
  ) {
    baseKey = 'madhya_pradesh';
  } else if (
    loc.includes('gujarat') ||
    loc.includes('rajkot') ||
    loc.includes('ahmedabad') ||
    loc.includes('surat') ||
    loc.includes('saurashtra') ||
    loc.includes('junagadh') ||
    loc.includes('vadodara') ||
    loc.includes('bhavnagar') ||
    loc.includes('kutch')
  ) {
    baseKey = 'gujarat';
  } else if (
    loc.includes('rajasthan') ||
    loc.includes('jaipur') ||
    loc.includes('kota') ||
    loc.includes('jodhpur') ||
    loc.includes('bikaner') ||
    loc.includes('alwar') ||
    loc.includes('sri ganganagar') ||
    loc.includes('sikar')
  ) {
    baseKey = 'rajasthan';
  } else if (
    loc.includes('uttar pradesh') ||
    loc.includes('up') ||
    loc.includes('lucknow') ||
    loc.includes('kanpur') ||
    loc.includes('varanasi') ||
    loc.includes('meerut') ||
    loc.includes('agra') ||
    loc.includes('prayagraj') ||
    loc.includes('gorakhpur') ||
    loc.includes('bareilly') ||
    loc.includes('bihar') ||
    loc.includes('patna') ||
    loc.includes('muzaffarpur') ||
    loc.includes('bhagalpur') ||
    loc.includes('gaya')
  ) {
    baseKey = 'uttar_pradesh_bihar';
  } else if (
    loc.includes('karnataka') ||
    loc.includes('bengaluru') ||
    loc.includes('bangalore') ||
    loc.includes('dharwad') ||
    loc.includes('belagavi') ||
    loc.includes('mysuru') ||
    loc.includes('telangana') ||
    loc.includes('hyderabad') ||
    loc.includes('warangal') ||
    loc.includes('nizamabad') ||
    loc.includes('andhra') ||
    loc.includes('ap') ||
    loc.includes('guntur') ||
    loc.includes('vijayawada') ||
    loc.includes('kurnool') ||
    loc.includes('tamil nadu') ||
    loc.includes('coimbatore') ||
    loc.includes('chennai')
  ) {
    baseKey = 'south_india';
  } else if (
    loc.includes('west bengal') ||
    loc.includes('bengal') ||
    loc.includes('burdwan') ||
    loc.includes('kolkata') ||
    loc.includes('hooghly') ||
    loc.includes('odisha') ||
    loc.includes('orissa') ||
    loc.includes('bhubaneswar') ||
    loc.includes('sambalpur') ||
    loc.includes('cuttack')
  ) {
    baseKey = 'eastern_india';
  } else if (
    loc.includes('punjab') ||
    loc.includes('haryana') ||
    loc.includes('ludhiana') ||
    loc.includes('amritsar') ||
    loc.includes('karnal') ||
    loc.includes('bathinda') ||
    loc.includes('hisar') ||
    loc.includes('patiala')
  ) {
    baseKey = 'punjab_haryana';
  }

  const base = { ...REGIONAL_BENCHMARKS[baseKey] };

  // Adjust for specific soilType if provided by the user
  const soilLower = (soilTypeStr || '').toLowerCase();
  if (soilLower.includes('black') || soilLower.includes('regur') || soilLower.includes('vertisol')) {
    base.soilK = Math.max(base.soilK, 260);
    base.ph = Math.max(base.ph, 7.6);
    base.defaultSoilType = 'Deep Black Cotton Soil (Regur)';
  } else if (soilLower.includes('alluvial')) {
    base.ph = 7.2;
    base.soilN = Math.max(base.soilN, 220);
    base.defaultSoilType = 'Alluvial Loam';
  } else if (soilLower.includes('sandy')) {
    base.soilN = Math.min(base.soilN, 180);
    base.soilP = Math.min(base.soilP, 28);
    base.organicCarbon = Math.min(base.organicCarbon, 0.48);
    base.defaultSoilType = 'Sandy Loam';
  } else if (soilLower.includes('red') || soilLower.includes('laterite')) {
    base.ph = Math.min(base.ph, 6.8);
    base.soilP = Math.min(base.soilP, 30);
    base.defaultSoilType = 'Red Loam';
  }

  return base;
}

/**
 * Returns the recommended staple crop for a region and season
 */
export function getRegionalStapleCrop(locationStr: string = '', seasonStr: string = 'Rabi'): string {
  const benchmark = getRegionalBenchmark(locationStr);
  const normSeason = seasonStr.toLowerCase().includes('kharif')
    ? 'Kharif'
    : seasonStr.toLowerCase().includes('zaid') || seasonStr.toLowerCase().includes('summer')
    ? 'Zaid'
    : 'Rabi';

  const seasonalMatch = benchmark.stapleCrops.find((c) => c.season === normSeason);
  if (seasonalMatch) return seasonalMatch.cropName;
  if (benchmark.stapleCrops[0]) return benchmark.stapleCrops[0].cropName;
  return 'HD-2967 High-Yield Bread Wheat';
}
