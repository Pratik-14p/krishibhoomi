import { NearbyMandiPrice } from '../types';

export interface RegionalMandiCluster {
  regionKey: string;
  state: string;
  districts: string[];
  primaryMandi: string;
  defaultCrop: string;
  mandis: {
    name: string;
    distanceKm: number;
    priceOffsetPercent: number; // percentage variation relative to primary mandi
    dailyVolumeRange: [number, number]; // [min, max] Quintals
    defaultTrend: 'up' | 'down' | 'stable';
    specialties: string[];
  }[];
}

export const REGIONAL_MANDI_CLUSTERS: RegionalMandiCluster[] = [
  // --- Maharashtra: Konkan Coast & Mumbai Metropolitan Region (Raigad, Panvel, Navi Mumbai, Thane, Palghar, Ratnagiri, Sindhudurg) ---
  {
    regionKey: 'maharashtra_konkan',
    state: 'Maharashtra',
    districts: [
      'raigad', 'panvel', 'pen', 'alibag', 'mangaon', 'roha', 'mahad', 'karjat', 'uran',
      'shrivardhan', 'murud', 'poladpur', 'mhasla', 'tala', 'khalapur',
      'thane', 'kalyan', 'dombivli', 'ulhasnagar', 'bhiwandi', 'murbad', 'shahapur',
      'palghar', 'dahanu', 'talasari', 'jawhar', 'mokhada', 'vada', 'vikramgad', 'vasai', 'virar',
      'ratnagiri', 'chiplun', 'khed', 'guhagar', 'dapoli', 'mandangad', 'sangameshwar', 'lanja', 'rajapur',
      'sindhudurg', 'sawantwadi', 'kankavli', 'kudal', 'malvan', 'vengurla', 'devgad', 'vaibhavwadi', 'dodamarg',
      'mumbai', 'navi mumbai', 'vashi', 'konkan'
    ],
    primaryMandi: 'Panvel APMC Market Yard (Raigad)',
    defaultCrop: 'Paddy / Basmati Rice',
    mandis: [
      {
        name: 'Panvel APMC Market Yard (Raigad)',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [3600, 5400],
        defaultTrend: 'up',
        specialties: ['Wada Kolam Paddy', 'Kolam Rice', 'Vegetables', 'Mango'],
      },
      {
        name: 'Vashi APMC Central Terminal Market (Navi Mumbai)',
        distanceKm: 24,
        priceOffsetPercent: 2.4,
        dailyVolumeRange: [6500, 9500],
        defaultTrend: 'up',
        specialties: ['Rice', 'Vegetables', 'Fruits', 'Spices', 'Onion-Potato'],
      },
      {
        name: 'Pen Agricultural Produce Market Sub-Yard (Raigad)',
        distanceKm: 32,
        priceOffsetPercent: 0.8,
        dailyVolumeRange: [2400, 3600],
        defaultTrend: 'up',
        specialties: ['Paddy Kolam', 'Poha Flakes', 'Pulses'],
      },
      {
        name: 'Roha / Mangaon APMC Yard (Raigad)',
        distanceKm: 48,
        priceOffsetPercent: -0.9,
        dailyVolumeRange: [1900, 2900],
        defaultTrend: 'stable',
        specialties: ['Paddy', 'Cashew', 'Betel Nut', 'Vegetables'],
      },
      {
        name: 'Pune Gultekdi APMC Market Yard',
        distanceKm: 92,
        priceOffsetPercent: 2.8,
        dailyVolumeRange: [4800, 7200],
        defaultTrend: 'up',
        specialties: ['Foodgrains', 'Vegetables', 'Onion', 'Jaggery'],
      },
    ],
  },

  // --- Maharashtra: Western & Khandesh (Pune, Nashik, Sangli, Kolhapur, Solapur, Satara, Ahmednagar, Jalgaon, Dhule) ---
  {
    regionKey: 'maharashtra_western',
    state: 'Maharashtra',
    districts: [
      'pune', 'haveli', 'baramati', 'shirur', 'daund', 'indapur', 'bhor', 'junmar', 'khed', 'maval', 'mulshi', 'purandar',
      'nashik', 'pimpalgaon', 'niphad', 'malegaon', 'yeola', 'sinnar', 'dindori', 'satana', 'baglan', 'kalwan',
      'sangli', 'tasgaon', 'miraj', 'walwa', 'islampur', 'shirala', 'kadegaon', 'khanapur', 'vita', 'atpadi', 'jat',
      'kolhapur', 'karad', 'hatkanangale', 'shirol', 'panhala', 'radhanagari', 'kagal', 'gadhinglaj', 'chandgad',
      'solapur', 'pandharpur', 'barshi', 'karmala', 'madha', 'malshiras', 'mangulvedha', 'mohol', 'sangole',
      'satara', 'wai', 'khandala', 'koregaon', 'patan', 'phaltan', 'mahabaleshwar',
      'ahmednagar', 'shrirampur', 'kopargaon', 'sangamner', 'rahuri', 'nevasa', 'shevgaon', 'parner', 'shrigonda', 'karjat',
      'jalgaon', 'bhusawal', 'chalisgaon', 'pachora', 'jamner', 'raver', 'yawal', 'chopda', 'amalner', 'dharangaon',
      'dhule', 'shirpur', 'sakri', 'sindkheda', 'nandurbar', 'navapur', 'shahada'
    ],
    primaryMandi: 'Pune Gultekdi APMC Market Yard',
    defaultCrop: 'Soybean (Yellow)',
    mandis: [
      {
        name: 'Pune Gultekdi APMC Market Yard',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [4500, 6800],
        defaultTrend: 'up',
        specialties: ['Vegetables', 'Onion', 'Soybean', 'Wheat', 'Maize'],
      },
      {
        name: 'Nashik APMC (Pimpalgaon Baswant Yard)',
        distanceKm: 45,
        priceOffsetPercent: 2.1,
        dailyVolumeRange: [5100, 7800],
        defaultTrend: 'up',
        specialties: ['Onion', 'Tomato', 'Grapes', 'Maize'],
      },
      {
        name: 'Sangli Turmeric & Grain APMC Yard',
        distanceKm: 62,
        priceOffsetPercent: 1.2,
        dailyVolumeRange: [3200, 4900],
        defaultTrend: 'stable',
        specialties: ['Turmeric', 'Soybean', 'Jowar', 'Sugarcane Jaggery'],
      },
      {
        name: 'Kolhapur Shahu Market Yard',
        distanceKm: 55,
        priceOffsetPercent: 1.4,
        dailyVolumeRange: [3100, 4800],
        defaultTrend: 'up',
        specialties: ['Sugarcane Jaggery', 'Soybean', 'Groundnut'],
      },
      {
        name: 'Solapur Daund Agricultural Sub-Yard',
        distanceKm: 78,
        priceOffsetPercent: -1.1,
        dailyVolumeRange: [2200, 3600],
        defaultTrend: 'stable',
        specialties: ['Pomegranate', 'Pigeon Pea', 'Onion'],
      },
    ],
  },

  // --- Maharashtra: Marathwada & Central Plateau (Latur, Jalna, Chhatrapati Sambhajinagar, Nanded, Beed, Parbhani, Dharashiv) ---
  {
    regionKey: 'maharashtra_marathwada',
    state: 'Maharashtra',
    districts: [
      'latur', 'udgir', 'ahmadpur', 'nilanga', 'ausa', 'chakur',
      'jalna', 'partur', 'ambad', 'bhokardan', 'jafrabad', 'ghansawangi', 'mantha',
      'chhatrapati sambhajinagar', 'aurangabad', 'vaijapur', 'paithan', 'gangapur', 'kannad', 'sillod',
      'nanded', 'mudkhed', 'kinwat', 'degloor', 'hadgaon', 'mukhed', 'kandhar', 'biloli', 'loha', 'naigaon',
      'beed', 'georai', 'ambajogai', 'parli', 'kaij', 'ashti', 'patoda', 'majalgaon',
      'parbhani', 'jintur', 'gangakhed', 'pathri', 'selu', 'manwath',
      'dharashiv', 'osmanabad', 'tuljapur', 'umerga', 'bhum', 'paranda', 'kalamb',
      'hingoli', 'kalamnuri', 'basmath', 'aundha nagnath', 'sengaon'
    ],
    primaryMandi: 'Latur APMC Market Yard (Pulse & Oilseed Hub)',
    defaultCrop: 'Soybean (Yellow)',
    mandis: [
      {
        name: 'Latur APMC Market Yard (Pulse & Oilseed Hub)',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [5400, 8500],
        defaultTrend: 'up',
        specialties: ['Soybean', 'Pigeon Pea (Tur)', 'Gram / Chana', 'Sunflower'],
      },
      {
        name: 'Jalna APMC Agricultural Market Yard',
        distanceKm: 42,
        priceOffsetPercent: 1.1,
        dailyVolumeRange: [3500, 5300],
        defaultTrend: 'up',
        specialties: ['Soybean', 'Cotton', 'Sweet Orange', 'Wheat'],
      },
      {
        name: 'Chhatrapati Sambhajinagar APMC (Jadhavwadi Yard)',
        distanceKm: 65,
        priceOffsetPercent: 1.4,
        dailyVolumeRange: [3900, 5800],
        defaultTrend: 'up',
        specialties: ['Maize', 'Cotton', 'Bajra', 'Ginger'],
      },
      {
        name: 'Nanded Krishi Upaj Mandi',
        distanceKm: 58,
        priceOffsetPercent: 0.6,
        dailyVolumeRange: [2900, 4500],
        defaultTrend: 'stable',
        specialties: ['Cotton', 'Soybean', 'Tur', 'Jowar'],
      },
      {
        name: 'Beed APMC Market Yard',
        distanceKm: 48,
        priceOffsetPercent: -0.7,
        dailyVolumeRange: [2400, 3700],
        defaultTrend: 'stable',
        specialties: ['Soybean', 'Cotton', 'Bajra'],
      },
    ],
  },

  // --- Maharashtra: Vidarbha (Nagpur, Wardha, Amravati, Chandrapur, Akola, Yavatmal, Buldhana) ---
  {
    regionKey: 'maharashtra_vidarbha',
    state: 'Maharashtra',
    districts: [
      'nagpur', 'katol', 'narkhed', 'saoner', 'ramtek', 'mouda', 'kamthi', 'umred', 'kuhi', 'bhiwapur', 'hingna',
      'wardha', 'deoli', 'seloo', 'arvi', 'ashti', 'karanja', 'samudrapur', 'hinganghat',
      'amravati', 'bhatkuli', 'chandur railway', 'dhamangaon', 'tiwsa', 'morsi', 'warud', 'achlapur', 'chandurbazar', 'daryapur',
      'yavatmal', 'chandrapur', 'bhandara', 'gondia', 'akola', 'buldhana', 'washim', 'gadchiroli'
    ],
    primaryMandi: 'Nagpur APMC (Kalamna Market Yard)',
    defaultCrop: 'Soybean (Yellow)',
    mandis: [
      {
        name: 'Nagpur APMC (Kalamna Market Yard)',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [3800, 5200],
        defaultTrend: 'up',
        specialties: ['Soybean', 'Cotton', 'Wheat', 'Chilli', 'Gram'],
      },
      {
        name: 'Katol Orange & Grain APMC Sub-Yard',
        distanceKm: 38,
        priceOffsetPercent: 1.5,
        dailyVolumeRange: [2100, 3400],
        defaultTrend: 'up',
        specialties: ['Oranges', 'Soybean', 'Cotton', 'Pigeon Pea'],
      },
      {
        name: 'Amravati Cotton & Oilseed Yard',
        distanceKm: 65,
        priceOffsetPercent: 0.8,
        dailyVolumeRange: [4200, 6100],
        defaultTrend: 'up',
        specialties: ['Cotton', 'Soybean', 'Tur / Arhar'],
      },
      {
        name: 'Wardha APMC Krishi Mandi',
        distanceKm: 72,
        priceOffsetPercent: -0.9,
        dailyVolumeRange: [1800, 2900],
        defaultTrend: 'stable',
        specialties: ['Soybean', 'Cotton', 'Wheat'],
      },
      {
        name: 'Akola Cotton & Pulse Market Yard',
        distanceKm: 80,
        priceOffsetPercent: 1.1,
        dailyVolumeRange: [3200, 4800],
        defaultTrend: 'up',
        specialties: ['Cotton', 'Soybean', 'Gram', 'Tur'],
      },
    ],
  },

  // --- Madhya Pradesh: Malwa & Central Plateau (Indore, Ujjain, Dewas, Dhar, Neemuch, Bhopal) ---
  {
    regionKey: 'mp_malwa',
    state: 'Madhya Pradesh',
    districts: ['indore', 'ujjain', 'dewas', 'dhar', 'neemuch', 'mandsaur', 'bhopal', 'sehore', 'khargone', 'ratlam'],
    primaryMandi: 'Indore Krishi Upaj Mandi (Choithram Yard)',
    defaultCrop: 'Soybean (Yellow)',
    mandis: [
      {
        name: 'Indore Krishi Upaj Mandi (Choithram Yard)',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [4800, 7200],
        defaultTrend: 'up',
        specialties: ['Soybean', 'Wheat Sharbati', 'Gram', 'Garlic'],
      },
      {
        name: 'Ujjain Krishi Upaj Mandi (Chimanganj)',
        distanceKm: 42,
        priceOffsetPercent: 1.4,
        dailyVolumeRange: [3900, 5800],
        defaultTrend: 'up',
        specialties: ['Soybean', 'Gram', 'Wheat', 'Mustard'],
      },
      {
        name: 'Dewas Sub-Yard Mandi',
        distanceKm: 31,
        priceOffsetPercent: -0.8,
        dailyVolumeRange: [2100, 3400],
        defaultTrend: 'stable',
        specialties: ['Soybean', 'Maize', 'Wheat'],
      },
      {
        name: 'Dhar APMC Yard',
        distanceKm: 65,
        priceOffsetPercent: 1.1,
        dailyVolumeRange: [2700, 4200],
        defaultTrend: 'up',
        specialties: ['Cotton', 'Soybean', 'Wheat'],
      },
    ],
  },

  // --- Madhya Pradesh: Mahakoshal & Chambal (Jabalpur, Gwalior, Morena) ---
  {
    regionKey: 'mp_chambal_mahakoshal',
    state: 'Madhya Pradesh',
    districts: ['jabalpur', 'gwalior', 'morena', 'bhind', 'sheopur', 'rewa', 'satna'],
    primaryMandi: 'Gwalior Krishi Upaj Mandi (Laxmiganj Yard)',
    defaultCrop: 'Mustard (Yellow & Black)',
    mandis: [
      {
        name: 'Gwalior Krishi Upaj Mandi (Laxmiganj Yard)',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [3600, 5100],
        defaultTrend: 'up',
        specialties: ['Mustard', 'Wheat', 'Gram', 'Bajra'],
      },
      {
        name: 'Morena Mustard Oilseed APMC Yard',
        distanceKm: 34,
        priceOffsetPercent: 1.8,
        dailyVolumeRange: [4100, 6300],
        defaultTrend: 'up',
        specialties: ['Mustard', 'Wheat', 'Bajra'],
      },
      {
        name: 'Jabalpur Krishi Mandi (Madan Mahal)',
        distanceKm: 68,
        priceOffsetPercent: 0.6,
        dailyVolumeRange: [2800, 4200],
        defaultTrend: 'stable',
        specialties: ['Paddy', 'Wheat', 'Gram'],
      },
      {
        name: 'Bhind Sub-Yard Mandi',
        distanceKm: 52,
        priceOffsetPercent: -1.2,
        dailyVolumeRange: [1900, 3100],
        defaultTrend: 'down',
        specialties: ['Mustard', 'Wheat'],
      },
    ],
  },

  // --- Punjab: Central Alluvial & Malwa Belt (Ludhiana, Bathinda, Patiala, Khanna, Amritsar) ---
  {
    regionKey: 'punjab_plains',
    state: 'Punjab',
    districts: ['ludhiana', 'bathinda', 'amritsar', 'patiala', 'khanna', 'jalandhar', 'moga', 'firozpur', 'sangrur', 'mansa', 'gurdaspur'],
    primaryMandi: 'Khanna Asia Largest Grain Market (APMC)',
    defaultCrop: 'Wheat (Sharbati & Lokwan)',
    mandis: [
      {
        name: 'Khanna Asia Largest Grain Market (APMC)',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [6500, 11000],
        defaultTrend: 'up',
        specialties: ['Wheat HD-2967', 'Basmati Paddy', 'Maize'],
      },
      {
        name: 'Ludhiana New Dana Mandi (Gill Road)',
        distanceKm: 28,
        priceOffsetPercent: 1.2,
        dailyVolumeRange: [5200, 8400],
        defaultTrend: 'up',
        specialties: ['Wheat', 'Paddy', 'Potato', 'Vegetables'],
      },
      {
        name: 'Bathinda Cotton & Grain Market Yard',
        distanceKm: 68,
        priceOffsetPercent: 0.9,
        dailyVolumeRange: [4100, 6800],
        defaultTrend: 'stable',
        specialties: ['Bt Cotton', 'Wheat', 'Mustard'],
      },
      {
        name: 'Amritsar Bhagtanwala Grain Terminal',
        distanceKm: 85,
        priceOffsetPercent: 2.3,
        dailyVolumeRange: [4800, 7900],
        defaultTrend: 'up',
        specialties: ['Pusa Basmati 1121', 'Wheat', 'Maize'],
      },
    ],
  },

  // --- Haryana: Basmati & Cotton-Mustard Zone (Karnal, Hisar, Kurukshetra, Sirsa, Ambala) ---
  {
    regionKey: 'haryana_belt',
    state: 'Haryana',
    districts: ['karnal', 'hisar', 'kurukshetra', 'sirsa', 'ambala', 'rohtak', 'sonipat', 'panipat', 'fatehabad', 'jind'],
    primaryMandi: 'Karnal Anaj Mandi (Basmati Trading Yard)',
    defaultCrop: 'Paddy / Basmati Rice',
    mandis: [
      {
        name: 'Karnal Anaj Mandi (Basmati Trading Yard)',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [5800, 9200],
        defaultTrend: 'up',
        specialties: ['Pusa Basmati', 'Wheat', 'Mustard'],
      },
      {
        name: 'Kurukshetra Pipli Grain Mandi',
        distanceKm: 32,
        priceOffsetPercent: 1.5,
        dailyVolumeRange: [3800, 5900],
        defaultTrend: 'up',
        specialties: ['Basmati Paddy', 'Wheat', 'Sugarcane'],
      },
      {
        name: 'Hisar Cotton & Mustard APMC Yard',
        distanceKm: 64,
        priceOffsetPercent: -0.6,
        dailyVolumeRange: [3100, 4800],
        defaultTrend: 'stable',
        specialties: ['Mustard', 'Cotton', 'Guar'],
      },
      {
        name: 'Kaithal New Grain Market',
        distanceKm: 56,
        priceOffsetPercent: 1.0,
        dailyVolumeRange: [3400, 5200],
        defaultTrend: 'up',
        specialties: ['Basmati', 'Wheat'],
      },
    ],
  },

  // --- Uttar Pradesh: Eastern & Western Gangetic (Varanasi, Meerut, Lucknow, Agra, Gorakhpur) ---
  {
    regionKey: 'up_plains',
    state: 'Uttar Pradesh',
    districts: ['varanasi', 'meerut', 'lucknow', 'agra', 'gorakhpur', 'kanpur', 'aligarh', 'moradabad', 'bareilly', 'muzaffarnagar', 'chandauli'],
    primaryMandi: 'Varanasi APMC Mandi (Panchkoshi Yard)',
    defaultCrop: 'Wheat (Sharbati & Lokwan)',
    mandis: [
      {
        name: 'Varanasi APMC Mandi (Panchkoshi Yard)',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [4200, 6400],
        defaultTrend: 'up',
        specialties: ['Wheat', 'Paddy', 'Vegetables', 'Pulses'],
      },
      {
        name: 'Chandauli Rice Bowl APMC Sub-Yard',
        distanceKm: 32,
        priceOffsetPercent: 1.6,
        dailyVolumeRange: [3600, 5400],
        defaultTrend: 'up',
        specialties: ['Paddy Rice', 'Wheat', 'Lentils'],
      },
      {
        name: 'Meerut Krishi Utpadan Mandi Samiti',
        distanceKm: 58,
        priceOffsetPercent: 1.2,
        dailyVolumeRange: [4800, 7200],
        defaultTrend: 'up',
        specialties: ['Sugarcane Jaggery', 'Wheat', 'Potato'],
      },
      {
        name: 'Agra Khandauli Potato & Mustard Mandi',
        distanceKm: 75,
        priceOffsetPercent: -1.3,
        dailyVolumeRange: [3100, 4900],
        defaultTrend: 'stable',
        specialties: ['Potato', 'Mustard', 'Wheat'],
      },
    ],
  },

  // --- Rajasthan: Hadoti, Marwar & Canal Oasis (Kota, Jaipur, Sri Ganganagar, Jodhpur, Alwar) ---
  {
    regionKey: 'rajasthan_belt',
    state: 'Rajasthan',
    districts: ['kota', 'jaipur', 'sri ganganagar', 'jodhpur', 'alwar', 'baran', 'bikaner', 'bharatpur', 'nagaur', 'hanumangarh'],
    primaryMandi: 'Kota Bhamashah Krishi Upaj Mandi',
    defaultCrop: 'Mustard (Yellow & Black)',
    mandis: [
      {
        name: 'Kota Bhamashah Krishi Upaj Mandi',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [5200, 8100],
        defaultTrend: 'up',
        specialties: ['Soybean', 'Wheat', 'Mustard', 'Coriander'],
      },
      {
        name: 'Baran Krishi Upaj Mandi (Garlic Hub)',
        distanceKm: 42,
        priceOffsetPercent: 1.8,
        dailyVolumeRange: [3200, 5100],
        defaultTrend: 'up',
        specialties: ['Garlic', 'Mustard', 'Soybean', 'Coriander'],
      },
      {
        name: 'Jaipur Muhana Terminal Market',
        distanceKm: 65,
        priceOffsetPercent: 1.1,
        dailyVolumeRange: [4500, 6900],
        defaultTrend: 'stable',
        specialties: ['Mustard', 'Bajra', 'Vegetables', 'Wheat'],
      },
      {
        name: 'Sri Ganganagar Grain Mandi',
        distanceKm: 88,
        priceOffsetPercent: -0.7,
        dailyVolumeRange: [3800, 6200],
        defaultTrend: 'stable',
        specialties: ['Wheat', 'Cotton', 'Mustard', 'Kinnow'],
      },
    ],
  },

  // --- Gujarat: Saurashtra & Central (Rajkot, Ahmedabad, Surat, Junagadh, Gondal) ---
  {
    regionKey: 'gujarat_saurashtra',
    state: 'Gujarat',
    districts: ['rajkot', 'ahmedabad', 'surat', 'junagadh', 'gondal', 'vadodara', 'amreli', 'bhavnagar', 'morbi', 'mehsana'],
    primaryMandi: 'Rajkot APMC Bedi Market Yard',
    defaultCrop: 'Cotton (Medium Staple)',
    mandis: [
      {
        name: 'Rajkot APMC Bedi Market Yard',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [5600, 8900],
        defaultTrend: 'up',
        specialties: ['Cotton', 'Groundnut', 'Cumin', 'Castor'],
      },
      {
        name: 'Gondal APMC Market Yard (Chilli & Groundnut)',
        distanceKm: 38,
        priceOffsetPercent: 2.2,
        dailyVolumeRange: [4200, 6900],
        defaultTrend: 'up',
        specialties: ['Groundnut', 'Red Chilli', 'Cotton', 'Sesame'],
      },
      {
        name: 'Junagadh Agriculture Produce Market',
        distanceKm: 65,
        priceOffsetPercent: 0.9,
        dailyVolumeRange: [3100, 4800],
        defaultTrend: 'stable',
        specialties: ['Groundnut', 'Wheat', 'Kesar Mango'],
      },
      {
        name: 'Ahmedabad APMC Jamalpur Market',
        distanceKm: 82,
        priceOffsetPercent: -1.0,
        dailyVolumeRange: [3900, 6100],
        defaultTrend: 'stable',
        specialties: ['Vegetables', 'Wheat Bhalia', 'Cotton'],
      },
    ],
  },

  // --- Karnataka: North Interior & Deccan (Dharwad, Belagavi, Bengaluru, Mysuru, Raichur) ---
  {
    regionKey: 'karnataka_deccan',
    state: 'Karnataka',
    districts: ['dharwad', 'belagavi', 'bengaluru', 'mysuru', 'raichur', 'gulbarga', 'kalaburagi', 'ballari', 'shivamogga', 'tumakuru'],
    primaryMandi: 'APMC Dharwad Amargol Central Yard',
    defaultCrop: 'Cotton (Medium Staple)',
    mandis: [
      {
        name: 'APMC Dharwad Amargol Central Yard',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [3800, 5600],
        defaultTrend: 'up',
        specialties: ['Cotton', 'Soybean', 'Maize', 'Chilli Byadgi'],
      },
      {
        name: 'Hubballi Cotton & Grain Sub-Market Yard',
        distanceKm: 22,
        priceOffsetPercent: 1.4,
        dailyVolumeRange: [3100, 4700],
        defaultTrend: 'up',
        specialties: ['Cotton', 'Groundnut', 'Onion'],
      },
      {
        name: 'Belagavi APMC Market Yard',
        distanceKm: 62,
        priceOffsetPercent: 0.7,
        dailyVolumeRange: [2900, 4500],
        defaultTrend: 'stable',
        specialties: ['Sugarcane', 'Vegetables', 'Maize', 'Soybean'],
      },
      {
        name: 'Kalaburagi / Gulbarga Tur APMC Yard',
        distanceKm: 85,
        priceOffsetPercent: 2.5,
        dailyVolumeRange: [4100, 6800],
        defaultTrend: 'up',
        specialties: ['Tur / Pigeon Pea', 'Bengal Gram', 'Jowar'],
      },
    ],
  },

  // --- Andhra Pradesh: Coastal Alluvial & Rayalaseema (Guntur, Vijayawada, Kurnool, Visakhapatnam) ---
  {
    regionKey: 'andhra_pradesh_belt',
    state: 'Andhra Pradesh',
    districts: [
      'guntur', 'vijayawada', 'krishna', 'visakhapatnam', 'vizag', 'kurnool', 'anantapur',
      'nellore', 'chittoor', 'tirupati', 'kadapa', 'ysr', 'east godavari', 'west godavari',
      'kakinada', 'rajahmundry', 'eluru', 'ongole', 'prakasam', 'srikakulam', 'vizianagaram'
    ],
    primaryMandi: 'Guntur Mirchi & Agriculture Market Yard',
    defaultCrop: 'Cotton (Medium Staple)',
    mandis: [
      {
        name: 'Guntur Mirchi & Agriculture Market Yard',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [6100, 10500],
        defaultTrend: 'up',
        specialties: ['Red Chilli', 'Cotton', 'Tobacco', 'Paddy'],
      },
      {
        name: 'Vijayawada APMC Sub-Yard (Gollapudi)',
        distanceKm: 34,
        priceOffsetPercent: 1.0,
        dailyVolumeRange: [3400, 5200],
        defaultTrend: 'stable',
        specialties: ['Paddy', 'Black Gram', 'Mango'],
      },
      {
        name: 'Kurnool APMC Groundnut & Cotton Yard',
        distanceKm: 76,
        priceOffsetPercent: -0.9,
        dailyVolumeRange: [2800, 4300],
        defaultTrend: 'stable',
        specialties: ['Groundnut', 'Sunflower', 'Bengal Gram'],
      },
      {
        name: 'Visakhapatnam RMC Wholesale Yard',
        distanceKm: 82,
        priceOffsetPercent: 1.4,
        dailyVolumeRange: [3200, 4900],
        defaultTrend: 'up',
        specialties: ['Paddy', 'Vegetables', 'Sugarcane'],
      },
    ],
  },

  // --- Telangana: Northern Deccan & Godavari Basin (Warangal, Hyderabad, Nizamabad, Khammam) ---
  {
    regionKey: 'telangana_basin',
    state: 'Telangana',
    districts: [
      'warangal', 'hyderabad', 'nizamabad', 'khammam', 'karimnagar', 'nalgonda',
      'mahbubnagar', 'adilabad', 'medak', 'rangareddy', 'siddipet', 'mancherial'
    ],
    primaryMandi: 'Warangal Enamamula Agricultural Market Yard',
    defaultCrop: 'Cotton (Medium Staple)',
    mandis: [
      {
        name: 'Warangal Enamamula Agricultural Market Yard',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [4800, 7900],
        defaultTrend: 'up',
        specialties: ['Cotton', 'Paddy', 'Red Gram', 'Maize'],
      },
      {
        name: 'Nizamabad Turmeric & Grain Market Yard',
        distanceKm: 48,
        priceOffsetPercent: 1.6,
        dailyVolumeRange: [3500, 5400],
        defaultTrend: 'up',
        specialties: ['Turmeric', 'Paddy', 'Soybean', 'Maize'],
      },
      {
        name: 'Khammam Chilli & Cotton Market Yard',
        distanceKm: 55,
        priceOffsetPercent: 1.1,
        dailyVolumeRange: [3200, 4900],
        defaultTrend: 'up',
        specialties: ['Chilli', 'Cotton', 'Paddy'],
      },
      {
        name: 'Hyderabad Bowenpally Agriculture Terminal',
        distanceKm: 72,
        priceOffsetPercent: 2.2,
        dailyVolumeRange: [5800, 8900],
        defaultTrend: 'up',
        specialties: ['Vegetables', 'Foodgrains', 'Pulses'],
      },
    ],
  },

  // --- Kerala: Spice Belt & Coastal Agro-Plains (Palakkad, Kochi, Kozhikode, Wayanad) ---
  {
    regionKey: 'kerala_coastal',
    state: 'Kerala',
    districts: [
      'palakkad', 'kochi', 'ernakulam', 'wayanad', 'kozhikode', 'calicut', 'thrissur',
      'thiruvananthapuram', 'trivandrum', 'kollam', 'alappuzha', 'kottayam', 'idukki',
      'kasaragod', 'kannur', 'malappuram', 'pathanamthitta'
    ],
    primaryMandi: 'Palakkad Agricultural Wholesale Market Yard',
    defaultCrop: 'Paddy / Basmati Rice',
    mandis: [
      {
        name: 'Palakkad Agricultural Wholesale Market Yard',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [3200, 5100],
        defaultTrend: 'up',
        specialties: ['Paddy Jyothi & Uma', 'Rice', 'Vegetables'],
      },
      {
        name: 'Kochi Mattancherry Spice & Copra Yard',
        distanceKm: 45,
        priceOffsetPercent: 2.4,
        dailyVolumeRange: [4200, 6800],
        defaultTrend: 'up',
        specialties: ['Black Pepper', 'Cardamom', 'Copra', 'Coconut'],
      },
      {
        name: 'Thrissur Central Wholesale Agriculture Market',
        distanceKm: 38,
        priceOffsetPercent: 1.2,
        dailyVolumeRange: [2800, 4400],
        defaultTrend: 'up',
        specialties: ['Banana Nendran', 'Vegetables', 'Rice'],
      },
      {
        name: 'Kozhikode Vengeri Agriculture Produce Yard',
        distanceKm: 72,
        priceOffsetPercent: -0.8,
        dailyVolumeRange: [2100, 3500],
        defaultTrend: 'stable',
        specialties: ['Coconut', 'Areca Nut', 'Spices'],
      },
    ],
  },

  // --- Himalayan Foothills & Valleys (Uttarakhand & Himachal Pradesh) ---
  {
    regionKey: 'himalayan_belt',
    state: 'Uttarakhand / Himachal Pradesh',
    districts: [
      'dehradun', 'haridwar', 'nainital', 'udham singh nagar', 'kashipur', 'rudrapur',
      'shimla', 'solan', 'kullu', 'mandi', 'kangra', 'una', 'bilaspur', 'chamba', 'srinagar', 'jammu'
    ],
    primaryMandi: 'Dehradun Niranjanpur Mandi Yard',
    defaultCrop: 'Paddy / Basmati Rice',
    mandis: [
      {
        name: 'Dehradun Niranjanpur Mandi Yard',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [3400, 5200],
        defaultTrend: 'up',
        specialties: ['Dehraduni Basmati Rice', 'Litchi', 'Wheat', 'Vegetables'],
      },
      {
        name: 'Haridwar Jwalapur Krishi Mandi',
        distanceKm: 32,
        priceOffsetPercent: 0.9,
        dailyVolumeRange: [2900, 4300],
        defaultTrend: 'up',
        specialties: ['Paddy', 'Wheat', 'Mustard', 'Sugarcane'],
      },
      {
        name: 'Kashipur Grain & Basmati APMC Yard',
        distanceKm: 62,
        priceOffsetPercent: 1.5,
        dailyVolumeRange: [3800, 5900],
        defaultTrend: 'up',
        specialties: ['Basmati Paddy', 'Wheat', 'Mentha'],
      },
      {
        name: 'Shimla Dhalli Fruit & Grain Sub-Yard',
        distanceKm: 78,
        priceOffsetPercent: 2.1,
        dailyVolumeRange: [2400, 3900],
        defaultTrend: 'up',
        specialties: ['Apple', 'Garlic', 'Off-season Vegetables', 'Maize'],
      },
    ],
  },

  // --- Chhattisgarh: Mahanadi Basin Rice Bowl (Raipur, Durg, Bilaspur, Rajnandgaon) ---
  {
    regionKey: 'chhattisgarh_basin',
    state: 'Chhattisgarh',
    districts: [
      'raipur', 'durg', 'bhilai', 'bilaspur', 'rajnandgaon', 'dhamtari',
      'korba', 'raigarh', 'bastar', 'jagdalpur', 'mahasamund', 'kanker', 'surguja'
    ],
    primaryMandi: 'Raipur Pandri Krishi Upaj Mandi Yard',
    defaultCrop: 'Paddy / Basmati Rice',
    mandis: [
      {
        name: 'Raipur Pandri Krishi Upaj Mandi Yard',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [4200, 6800],
        defaultTrend: 'up',
        specialties: ['Paddy Swarna & Dubraj', 'Rice', 'Wheat', 'Pulses'],
      },
      {
        name: 'Durg-Bhilai Krishi Upaj Mandi Samiti',
        distanceKm: 28,
        priceOffsetPercent: 0.8,
        dailyVolumeRange: [3100, 4800],
        defaultTrend: 'up',
        specialties: ['Paddy', 'Soybean', 'Vegetables'],
      },
      {
        name: 'Bilaspur Tifra Grain Market Yard',
        distanceKm: 58,
        priceOffsetPercent: 1.4,
        dailyVolumeRange: [3600, 5400],
        defaultTrend: 'up',
        specialties: ['Paddy', 'Maize', 'Gram'],
      },
      {
        name: 'Dhamtari Paddy & Rice Processing Yard',
        distanceKm: 48,
        priceOffsetPercent: -0.7,
        dailyVolumeRange: [2900, 4600],
        defaultTrend: 'stable',
        specialties: ['Aromatic Rice', 'Paddy', 'Pulses'],
      },
    ],
  },

  // --- Jharkhand: Chota Nagpur Agro-Plateau (Ranchi, Jamshedpur, Hazaribagh, Dhanbad) ---
  {
    regionKey: 'jharkhand_plateau',
    state: 'Jharkhand',
    districts: [
      'ranchi', 'jamshedpur', 'dhanbad', 'bokaro', 'hazaribagh',
      'deoghar', 'dumka', 'giridih', 'ramgarh', 'palamu'
    ],
    primaryMandi: 'Ranchi Pandra Wholesale Agricultural Market Yard',
    defaultCrop: 'Paddy / Basmati Rice',
    mandis: [
      {
        name: 'Ranchi Pandra Wholesale Agricultural Market Yard',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [3500, 5400],
        defaultTrend: 'up',
        specialties: ['Paddy', 'Vegetables', 'Maize', 'Mustard'],
      },
      {
        name: 'Hazaribagh Agricultural Produce Yard',
        distanceKm: 45,
        priceOffsetPercent: -0.8,
        dailyVolumeRange: [2200, 3600],
        defaultTrend: 'stable',
        specialties: ['Paddy', 'Pulses', 'Oilseeds'],
      },
      {
        name: 'Jamshedpur Parsudih Wholesale Market',
        distanceKm: 68,
        priceOffsetPercent: 1.6,
        dailyVolumeRange: [3100, 4900],
        defaultTrend: 'up',
        specialties: ['Foodgrains', 'Vegetables', 'Fruits'],
      },
      {
        name: 'Bokaro Chas Krishi Mandi',
        distanceKm: 58,
        priceOffsetPercent: 0.9,
        dailyVolumeRange: [2500, 3900],
        defaultTrend: 'up',
        specialties: ['Paddy', 'Wheat', 'Maize'],
      },
    ],
  },

  // --- Assam & Northeast: Brahmaputra Alluvial Valley (Guwahati, Kamrup, Nagaon, Jorhat) ---
  {
    regionKey: 'assam_northeast',
    state: 'Assam / Northeast',
    districts: [
      'guwahati', 'kamrup', 'nagaon', 'jorhat', 'dibrugarh',
      'silchar', 'tezpur', 'sonitpur', 'barpeta', 'cachar', 'tinsukia'
    ],
    primaryMandi: 'Guwahati Pamohi APMC Wholesale Yard',
    defaultCrop: 'Paddy / Basmati Rice',
    mandis: [
      {
        name: 'Guwahati Pamohi APMC Wholesale Yard',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [3600, 5600],
        defaultTrend: 'up',
        specialties: ['Paddy Joha & Bao', 'Mustard', 'Ginger', 'Tea'],
      },
      {
        name: 'Nagaon Regulated Market Committee Yard',
        distanceKm: 48,
        priceOffsetPercent: -0.9,
        dailyVolumeRange: [2600, 4100],
        defaultTrend: 'stable',
        specialties: ['Paddy', 'Jute', 'Mustard'],
      },
      {
        name: 'Tezpur Agriculture Produce Market',
        distanceKm: 65,
        priceOffsetPercent: 1.1,
        dailyVolumeRange: [2400, 3800],
        defaultTrend: 'up',
        specialties: ['Rice', 'Corn', 'Vegetables'],
      },
      {
        name: 'Jorhat Wholesale Grain Terminal',
        distanceKm: 82,
        priceOffsetPercent: 1.5,
        dailyVolumeRange: [2200, 3500],
        defaultTrend: 'up',
        specialties: ['Aromatic Rice', 'Mustard', 'Black Pepper'],
      },
    ],
  },

  // --- Bihar: Gangetic Agro-Plains (Patna, Muzaffarpur, Bhagalpur) ---
  {
    regionKey: 'bihar_gangetic',
    state: 'Bihar',
    districts: ['patna', 'muzaffarpur', 'bhagalpur', 'begusarai', 'darbhanga', 'gaya', 'purnia', 'samastipur'],
    primaryMandi: 'Patna Bazar Samiti / APMC Yard (Gulzarbagh)',
    defaultCrop: 'Wheat (Sharbati & Lokwan)',
    mandis: [
      {
        name: 'Patna Bazar Samiti / APMC Yard (Gulzarbagh)',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [3600, 5400],
        defaultTrend: 'up',
        specialties: ['Wheat', 'Maize', 'Paddy', 'Mustard'],
      },
      {
        name: 'Muzaffarpur Agricultural Produce Mandi',
        distanceKm: 45,
        priceOffsetPercent: 1.3,
        dailyVolumeRange: [2900, 4500],
        defaultTrend: 'up',
        specialties: ['Maize', 'Shahi Litchi', 'Wheat', 'Rice'],
      },
      {
        name: 'Begusarai Industrial Maize & Grain Yard',
        distanceKm: 65,
        priceOffsetPercent: 1.7,
        dailyVolumeRange: [3200, 5100],
        defaultTrend: 'up',
        specialties: ['Yellow Maize', 'Wheat', 'Mustard'],
      },
      {
        name: 'Bhagalpur Silk & Grain Sub-Market Yard',
        distanceKm: 80,
        priceOffsetPercent: -1.2,
        dailyVolumeRange: [2100, 3400],
        defaultTrend: 'stable',
        specialties: ['Katarni Rice', 'Maize', 'Pulses'],
      },
    ],
  },

  // --- West Bengal: Rice & Jute Bowl (Burdwan, Hooghly, Nadia) ---
  {
    regionKey: 'west_bengal_basin',
    state: 'West Bengal',
    districts: ['burdwan', 'bardhaman', 'hooghly', 'nadia', 'murshidabad', 'malda', 'midnapore', 'kolkata'],
    primaryMandi: 'Burdwan Kalna Road Anaj Mandi (Rice Bowl)',
    defaultCrop: 'Paddy / Basmati Rice',
    mandis: [
      {
        name: 'Burdwan Kalna Road Anaj Mandi (Rice Bowl)',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [4200, 6800],
        defaultTrend: 'up',
        specialties: ['Paddy Aman & Boro', 'Potato', 'Mustard'],
      },
      {
        name: 'Hooghly Sheoraphuli Regulated Market',
        distanceKm: 38,
        priceOffsetPercent: 1.5,
        dailyVolumeRange: [3500, 5400],
        defaultTrend: 'up',
        specialties: ['Jyoti Potato', 'Vegetables', 'Jute'],
      },
      {
        name: 'Nadia Bethuadahari Grain Sub-Yard',
        distanceKm: 62,
        priceOffsetPercent: -0.8,
        dailyVolumeRange: [2400, 3800],
        defaultTrend: 'stable',
        specialties: ['Paddy', 'Jute', 'Lentils'],
      },
      {
        name: 'Midnapore Ghatal Regulated Market Yard',
        distanceKm: 78,
        priceOffsetPercent: 0.9,
        dailyVolumeRange: [2800, 4200],
        defaultTrend: 'up',
        specialties: ['Rice', 'Potato', 'Groundnut'],
      },
    ],
  },

  // --- Odisha: Coastal Alluvial & Western Command Basin (Bhubaneswar, Sambalpur, Cuttack, Bargarh) ---
  {
    regionKey: 'odisha_basin',
    state: 'Odisha',
    districts: ['bhubaneswar', 'sambalpur', 'cuttack', 'bargarh', 'balasore', 'ganjam', 'puri', 'koraput'],
    primaryMandi: 'Bhubaneswar Unit-1 RMC Krishi Mandi Yard',
    defaultCrop: 'Paddy / Basmati Rice',
    mandis: [
      {
        name: 'Bhubaneswar Unit-1 RMC Krishi Mandi Yard',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [3100, 4900],
        defaultTrend: 'up',
        specialties: ['Paddy', 'Moong', 'Vegetables'],
      },
      {
        name: 'Cuttack Malgodown Wholesale Mandi',
        distanceKm: 28,
        priceOffsetPercent: 1.2,
        dailyVolumeRange: [3800, 5600],
        defaultTrend: 'up',
        specialties: ['Paddy', 'Pulses', 'Mustard'],
      },
      {
        name: 'Bargarh Rice Bowl Regulated Market Yard',
        distanceKm: 72,
        priceOffsetPercent: 1.8,
        dailyVolumeRange: [4200, 6200],
        defaultTrend: 'up',
        specialties: ['Paddy Swarna', 'Groundnut', 'Sesame'],
      },
      {
        name: 'Sambalpur Khetrajpur Regulated Market Yard',
        distanceKm: 85,
        priceOffsetPercent: -0.6,
        dailyVolumeRange: [2200, 3600],
        defaultTrend: 'stable',
        specialties: ['Paddy', 'Vegetables', 'Maize'],
      },
    ],
  },

  // --- Tamil Nadu: Cauvery Delta & Western Kongu Belt (Thanjavur, Coimbatore, Madurai, Salem) ---
  {
    regionKey: 'tamil_nadu_delta',
    state: 'Tamil Nadu',
    districts: ['thanjavur', 'coimbatore', 'madurai', 'salem', 'tiruchirappalli', 'tirupur', 'erode', 'tirunelveli', 'dindigul'],
    primaryMandi: 'Thanjavur Cauvery Delta Regulated Market Yard',
    defaultCrop: 'Paddy / Basmati Rice',
    mandis: [
      {
        name: 'Thanjavur Cauvery Delta Regulated Market Yard',
        distanceKm: 0,
        priceOffsetPercent: 0,
        dailyVolumeRange: [3900, 5800],
        defaultTrend: 'up',
        specialties: ['Paddy CR1009', 'Black Gram', 'Banana'],
      },
      {
        name: 'Coimbatore Kinathukadavu Regulated Market',
        distanceKm: 42,
        priceOffsetPercent: 1.6,
        dailyVolumeRange: [3400, 5100],
        defaultTrend: 'up',
        specialties: ['Cotton', 'Groundnut', 'Coconut', 'Maize'],
      },
      {
        name: 'Erode Turmeric & Commercial Crop Yard',
        distanceKm: 68,
        priceOffsetPercent: 2.1,
        dailyVolumeRange: [3100, 4800],
        defaultTrend: 'up',
        specialties: ['Turmeric', 'Cotton', 'Paddy'],
      },
      {
        name: 'Madurai Mattuthavani Agricultural Market Yard',
        distanceKm: 82,
        priceOffsetPercent: -0.8,
        dailyVolumeRange: [2500, 3900],
        defaultTrend: 'stable',
        specialties: ['Paddy', 'Millet', 'Pulses'],
      },
    ],
  },
];

/**
 * Normalizes and extracts district/state keywords from user location strings
 */
function cleanLocationKeywords(loc: string): string[] {
  if (!loc) return [];
  return loc
    .toLowerCase()
    .replace(/[(),.\-/]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/**
 * Checks whether a district keyword accurately matches the user's location without false substrings
 */
function matchesDistrict(rawLower: string, words: string[], d: string): boolean {
  const dLower = d.toLowerCase().trim();
  if (words.includes(dLower)) return true;
  if (dLower.includes(' ')) {
    return rawLower.includes(dLower);
  }
  const escaped = dLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const boundaryRegex = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`, 'i');
  return boundaryRegex.test(rawLower);
}

/**
 * Finds the best matching Regional Mandi Cluster for a given location string
 */
export function findMatchingMandiCluster(locationStr: string): RegionalMandiCluster {
  if (!locationStr || typeof locationStr !== 'string') {
    return REGIONAL_MANDI_CLUSTERS[0];
  }

  const rawLower = locationStr.toLowerCase().trim();
  const words = cleanLocationKeywords(locationStr);

  // 1. Direct match with any Mandi Name
  for (const cluster of REGIONAL_MANDI_CLUSTERS) {
    for (const m of cluster.mandis) {
      const mLower = m.name.toLowerCase();
      if (rawLower.includes(mLower) || mLower.includes(rawLower)) {
        return cluster;
      }
    }
  }

  // 2. Exact word-boundary or compound District Match (scored by longest matched district name)
  let bestCluster: RegionalMandiCluster | null = null;
  let longestDistrictLen = 0;

  for (const cluster of REGIONAL_MANDI_CLUSTERS) {
    for (const d of cluster.districts) {
      if (matchesDistrict(rawLower, words, d)) {
        if (d.length > longestDistrictLen) {
          longestDistrictLen = d.length;
          bestCluster = cluster;
        }
      }
    }
  }

  if (bestCluster) return bestCluster;

  // 3. Multi-word and exact State mapping
  const stateMappings: { statePattern: RegExp; clusterKey: string }[] = [
    { statePattern: /\b(uttar\s*pradesh|up)\b/i, clusterKey: 'up_plains' },
    { statePattern: /\b(madhya\s*pradesh|mp)\b/i, clusterKey: 'mp_malwa' },
    { statePattern: /\b(west\s*bengal|bengal|wb)\b/i, clusterKey: 'west_bengal_basin' },
    { statePattern: /\b(andhra\s*pradesh|ap)\b/i, clusterKey: 'andhra_pradesh_belt' },
    { statePattern: /\b(telangana)\b/i, clusterKey: 'telangana_basin' },
    { statePattern: /\b(punjab)\b/i, clusterKey: 'punjab_plains' },
    { statePattern: /\b(haryana)\b/i, clusterKey: 'haryana_belt' },
    { statePattern: /\b(rajasthan)\b/i, clusterKey: 'rajasthan_belt' },
    { statePattern: /\b(gujarat)\b/i, clusterKey: 'gujarat_saurashtra' },
    { statePattern: /\b(bihar)\b/i, clusterKey: 'bihar_gangetic' },
    { statePattern: /\b(karnataka)\b/i, clusterKey: 'karnataka_deccan' },
    { statePattern: /\b(odisha|orissa)\b/i, clusterKey: 'odisha_basin' },
    { statePattern: /\b(tamil\s*nadu|tn)\b/i, clusterKey: 'tamil_nadu_delta' },
    { statePattern: /\b(kerala)\b/i, clusterKey: 'kerala_coastal' },
    { statePattern: /\b(chhattisgarh|cg)\b/i, clusterKey: 'chhattisgarh_basin' },
    { statePattern: /\b(jharkhand)\b/i, clusterKey: 'jharkhand_plateau' },
    { statePattern: /\b(assam|north\s*east|northeast)\b/i, clusterKey: 'assam_northeast' },
    { statePattern: /\b(uttarakhand|himachal|hp|uk|jammu|kashmir|jk)\b/i, clusterKey: 'himalayan_belt' },
    // Maharashtra regional sub-clusters
    { statePattern: /\b(konkan|coastal\s*maharashtra|raigad|thane|palghar|ratnagiri|sindhudurg|mumbai)\b/i, clusterKey: 'maharashtra_konkan' },
    { statePattern: /\b(marathwada|latur|aurangabad|jalna|nanded|beed|parbhani|osmanabad|dharashiv)\b/i, clusterKey: 'maharashtra_marathwada' },
    { statePattern: /\b(vidarbha|nagpur|amravati|akola|wardha|chandrapur|yavatmal)\b/i, clusterKey: 'maharashtra_vidarbha' },
    { statePattern: /\b(maharashtra|mh)\b/i, clusterKey: 'maharashtra_western' },
  ];

  for (const sm of stateMappings) {
    if (sm.statePattern.test(rawLower)) {
      const found = REGIONAL_MANDI_CLUSTERS.find((c) => c.regionKey === sm.clusterKey);
      if (found) return found;
    }
  }

  return REGIONAL_MANDI_CLUSTERS[0];
}

/**
 * Returns the primary APMC trading hub for a given farm location
 */
export function getPrimaryMandiForLocation(locationStr: string): string {
  if (!locationStr) return REGIONAL_MANDI_CLUSTERS[0].primaryMandi;
  const cluster = findMatchingMandiCluster(locationStr);
  const rawLower = locationStr.toLowerCase().trim();
  const words = cleanLocationKeywords(locationStr);

  // Check if user specifically requested a local mandi in this cluster
  for (const m of cluster.mandis) {
    const mLower = m.name.toLowerCase();
    const mParts = mLower
      .replace(/[(),.\-/]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['apmc', 'yard', 'market', 'mandi', 'krishi', 'sub', 'upaj', 'central', 'regulated'].includes(w));
    if (mParts.some((p) => rawLower.includes(p) || words.includes(p))) {
      return m.name;
    }
  }

  return cluster.primaryMandi;
}

/**
 * Returns default staple crop for the market in that agro-climatic zone
 */
export function getDefaultCropForLocation(locationStr: string): string {
  if (!locationStr) return 'Soybean (Yellow)';
  const cluster = findMatchingMandiCluster(locationStr);
  return cluster.defaultCrop;
}

/**
 * Returns realistic nearby APMC mandis tailored specifically to the user's location,
 * including distances, price spreads, daily volumes, and trend.
 */
export function getNearbyMandisForLocation(
  locationStr: string,
  currentPrice: number,
  cropName?: string
): NearbyMandiPrice[] {
  const cluster = findMatchingMandiCluster(locationStr);
  const rawLower = (locationStr || '').toLowerCase().trim();
  const words = cleanLocationKeywords(locationStr);

  // Check if any mandi in the cluster specifically matches the user location string
  let localMandiIndex = -1;
  for (let i = 0; i < cluster.mandis.length; i++) {
    const m = cluster.mandis[i];
    const mLower = m.name.toLowerCase();
    const mParts = mLower
      .replace(/[(),.\-/]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['apmc', 'yard', 'market', 'mandi', 'krishi', 'sub', 'upaj', 'central', 'regulated'].includes(w));
    if (mParts.some((p) => rawLower.includes(p) || words.includes(p))) {
      localMandiIndex = i;
      break;
    }
  }

  // If a specific mandi in this cluster matched the user town/district, make it the 0 km baseline
  let baseMandis = [...cluster.mandis];
  if (localMandiIndex > 0) {
    const target = baseMandis[localMandiIndex];
    const targetDist = target.distanceKm;
    baseMandis = [
      { ...target, distanceKm: 0, priceOffsetPercent: 0 },
      ...baseMandis
        .filter((_, idx) => idx !== localMandiIndex)
        .map((m) => ({
          ...m,
          distanceKm: Math.abs(m.distanceKm - targetDist) || 35,
        })),
    ];
  }

  return baseMandis.map((m) => {
    // Calculate realistic price difference based on location spread
    const spreadMultiplier = 1 + m.priceOffsetPercent / 100;
    const computedPrice = Math.round(currentPrice * spreadMultiplier);

    // Randomize daily arrival volume slightly within range for natural realism
    const [minVol, maxVol] = m.dailyVolumeRange || [2500, 4500];
    const avgVol = Math.round((minVol + maxVol) / 2);

    return {
      mandiName: m.name,
      distanceKm: m.distanceKm,
      currentPrice: computedPrice,
      priceTrend: m.defaultTrend,
      dailyVolumeQuintals: avgVol,
    };
  });
}

/**
 * Returns a comprehensive, deduped list of all prominent APMC Mandis across India
 */
export function getAllSupportedMandis(): string[] {
  const set = new Set<string>();
  for (const cluster of REGIONAL_MANDI_CLUSTERS) {
    for (const m of cluster.mandis) {
      set.add(m.name);
    }
  }
  return Array.from(set);
}
