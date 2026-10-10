import { LanguageCode, SUPPORTED_LANGUAGES } from '../locales/types';

/**
 * Krishibhoomi Agricultural Multilingual Engine
 * Provides accurate, regionally authentic translations for all 22 Scheduled Indian Languages + English:
 * - Crop names, varieties, categories
 * - Soil parameters, 6-tier nutrient ratings, pH reactions, and deficiencies
 * - Fertilizers, application methods, application timings, and precautions
 * - Pests, diseases, symptoms, dosages, and safety intervals
 * - Yield prediction metrics, drivers, and units
 * - Cost items, revenue, and profit metrics
 * - APMC Mandi trends, demand levels, and market comparisons
 * - Scenario simulator what-if comparisons
 * - Personalized farming strategy action phases
 * 
 * RULE: All numerical values (kg/ha, ppm, quintals/acre, %, ₹/q, days) are strictly preserved.
 */

// Helper to get Language Display Name
export function getLanguageName(code: string): string {
  const found = SUPPORTED_LANGUAGES.find((l) => l.code === code);
  return found ? found.name : 'English';
}

/**
 * 1. Comprehensive Crop Name Translation Catalog across 23 languages
 */
export const CROP_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, string>>> = {
  wheat: {
    en: 'Wheat',
    hi: 'गेहूं',
    mr: 'गहू',
    bn: 'গম',
    te: 'గోధుమ',
    ta: 'கோதுமை',
    gu: 'ઘઉં',
    kn: 'ಗೋಧಿ',
    ml: 'ഗോതമ്പ്',
    pa: 'ਕਣਕ',
    or: 'ଗହମ',
    as: 'ঘেঁহু',
    ur: 'گندم',
    sa: 'गोधूमः',
    ne: 'गहुँ',
    kok: 'गोवं',
    mai: 'गेहूँ',
    ks: 'گندم',
    sd: 'ڪڻڪ',
    brx: 'गहुम',
    doi: 'कनक',
    mni: 'গেহু',
    sat: 'ᱜᱩᱦᱩᱢ',
  },
  rice: {
    en: 'Rice / Paddy',
    hi: 'धान / चावल',
    mr: 'भात / तांदूळ',
    bn: 'ধান / চাল',
    te: 'వరి / బియ్యం',
    ta: 'நெல் / அரிசி',
    gu: 'ડાંગર / ચોખા',
    kn: 'ಭತ್ತ / ಅಕ್ಕಿ',
    ml: 'നെല്ല് / അരി',
    pa: 'ਝੋਨਾ / ਚੌਲ',
    or: 'ଧାନ / ଚାଉଳ',
    as: 'ধান / চাউল',
    ur: 'دھان / چاول',
    sa: 'व्रीहिः',
    ne: 'धान / चामल',
    kok: 'तांदूळ',
    mai: 'धान / चौर',
    ks: 'تومل',
    sd: 'چانور',
    brx: 'माइ',
    doi: 'झोना',
    mni: 'ফৌ / চেং',
    sat: 'ᱦᱩᱲᱩ',
  },
  cotton: {
    en: 'Cotton',
    hi: 'कपास',
    mr: 'कापूस',
    bn: 'তুলা',
    te: 'పత్తి',
    ta: 'பருத்தி',
    gu: 'કપાસ',
    kn: 'ಹತ್ತಿ',
    ml: 'പരുത്തി',
    pa: 'ਕਪਾਹ',
    or: 'କପା',
    as: 'কপাহী',
    ur: 'کپاس',
    sa: 'कार्पासः',
    ne: 'कपास',
    kok: 'कापूस',
    mai: 'कपास',
    ks: 'کپاس',
    sd: 'ڪپھه',
    brx: 'खोनबाय',
    doi: 'कप्पा',
    mni: 'লমন',
    sat: 'ᱠᱟᱥᱠᱚᱢ',
  },
  soybean: {
    en: 'Soybean',
    hi: 'सोयाबीन',
    mr: 'सोयाबीन',
    bn: 'সয়াবিন',
    te: 'సోయాబీన్',
    ta: 'சோயாபீன்',
    gu: 'સોયાબીન',
    kn: 'ಸೋಯಾಬೀನ್',
    ml: 'സോയാബീൻ',
    pa: 'ਸੋਇਆਬੀਨ',
    or: 'ସୋୟାବିନ୍',
    as: 'চয়াবিন',
    ur: 'سویا بین',
    sa: 'राजशिम्बी',
    ne: 'भटमास / सोयाबिन',
    kok: 'सोयबीन',
    mai: 'सोयाबीन',
    ks: 'سویا بین',
    sd: 'سويا بين',
    brx: 'सोयाबिन',
    doi: 'सोयाबीन',
    mni: 'সোয়াবিন',
    sat: 'ᱥᱚᱭᱟᱵᱤᱱ',
  },
  chickpea: {
    en: 'Chickpea / Chana',
    hi: 'चना',
    mr: 'हरभरा / चणा',
    bn: 'ছোলা',
    te: 'శనగలు',
    ta: 'கொண்டைக்கடலை',
    gu: 'ચણા',
    kn: 'ಕಡಲೆ',
    ml: 'കടല',
    pa: 'ਛੋਲੇ',
    or: 'ବୁଟ',
    as: 'বুট মাহ',
    ur: 'چنا',
    sa: 'चणकः',
    ne: 'चना',
    kok: 'चणे',
    mai: 'चना',
    ks: 'چھولہ',
    sd: 'ڇڻا',
    brx: 'साना',
    doi: 'चने',
    mni: 'চনা',
    sat: 'ᱪᱟᱱᱟ',
  },
  mustard: {
    en: 'Mustard / Rapeseed',
    hi: 'सरसों',
    mr: 'मोहरी / सरसो',
    bn: 'সরিষা',
    te: 'ఆవాలు',
    ta: 'கடுகு',
    gu: 'રાઈ / સરસવ',
    kn: 'ಸಾಸಿವೆ',
    ml: 'കടുക്',
    pa: 'ਸਰ੍ਹੋਂ',
    or: 'ସୋରିଷ',
    as: 'সৰিয়হ',
    ur: 'سرسوں',
    sa: 'सर्षपः',
    ne: 'तोरी / सरस्यूँ',
    kok: 'सासवां',
    mai: 'तोरी / सरिसो',
    ks: 'آسُر',
    sd: 'سرنھن',
    brx: 'बेसोर',
    doi: 'सरों',
    mni: 'হঙগাম',
    sat: 'ᱢᱟᱹᱨᱤᱪ',
  },
  maize: {
    en: 'Maize / Corn',
    hi: 'मक्का',
    mr: 'मका',
    bn: 'ভুট্টা',
    te: 'మొక్కజొన్న',
    ta: 'மக்காச்சோளம்',
    gu: 'મકાઈ',
    kn: 'ಮೆಕ್ಕೆಜೋಳ',
    ml: 'ചോളം',
    pa: 'ਮੱਕੀ',
    or: 'ମକା',
    as: 'গোমধান',
    ur: 'مکئی',
    sa: 'मकायः',
    ne: 'मकै',
    kok: 'मको',
    mai: 'मकई',
    ks: 'مکئی',
    sd: 'مڪئي',
    brx: 'गोमदान',
    doi: 'मक्की',
    mni: 'চুজাক',
    sat: 'ᱡᱚᱱᱫᱽᱨᱟ',
  },
  sugarcane: {
    en: 'Sugarcane',
    hi: 'गन्ना',
    mr: 'ऊस',
    bn: 'আখ',
    te: 'చెరకు',
    ta: 'கரும்பு',
    gu: 'શેરડી',
    kn: 'ಕಬ್ಬು',
    ml: 'കരിമ്പ്',
    pa: 'ਗੰਨਾ',
    or: 'ଆଖୁ',
    as: 'কুঁহিয়াৰ',
    ur: 'گنا',
    sa: 'इक्षुः',
    ne: 'उखु',
    kok: 'कूब',
    mai: 'ऊख',
    ks: 'کٔنٛڈ',
    sd: 'ڪمند',
    brx: 'सेरगो',
    doi: 'गन्ना',
    mni: 'চু',
    sat: 'ᱟᱹᱠᱷ',
  },
  groundnut: {
    en: 'Groundnut / Peanut',
    hi: 'मूंगफली',
    mr: 'भुईमूग',
    bn: 'চিনাবাদাম',
    te: 'వేరుశనగ',
    ta: 'நிலக்கடலை',
    gu: 'મગફળી',
    kn: 'ಕಡಲೆಕಾಯಿ',
    ml: 'നിലക്കടല',
    pa: 'ਮੂੰਗਫਲੀ',
    or: 'ଚିନାବାଦାମ',
    as: 'বাদাম',
    ur: 'مونگ پھلی',
    sa: 'कलायः',
    ne: 'बदाम',
    kok: 'भुंयमूग',
    mai: 'बादाम',
    ks: 'مونگ پھلی',
    sd: 'مڱهيري',
    brx: 'बादाम',
    doi: 'मूंगफली',
    mni: 'বাদান',
    sat: 'ᱵᱟᱫᱟᱢ',
  },
  tomato: {
    en: 'Tomato',
    hi: 'टमाटर',
    mr: 'टोमॅटो',
    bn: 'টমেটো',
    te: 'టమోటా',
    ta: 'தக்காளி',
    gu: 'ટામેટા',
    kn: 'ಟೊಮ್ಯಾಟೊ',
    ml: 'തക്കാളി',
    pa: 'ਟਮਾਟਰ',
    or: 'ଟମାଟୋ',
    as: 'বিলাহী',
    ur: 'ٹماٹر',
    sa: 'रक्तफलम्',
    ne: 'गोलभेँडा',
    kok: 'टोमॅटो',
    mai: 'टमाटर',
    ks: 'تموٹور',
    sd: 'ٽماٽر',
    brx: 'थामाथौ',
    doi: 'टमाटार',
    mni: 'খোমহাম্বি',
    sat: 'ᱵᱤᱞᱟᱹᱛᱤ',
  },
  onion: {
    en: 'Onion',
    hi: 'प्याज',
    mr: 'कांदा',
    bn: 'পেঁয়াজ',
    te: 'ఉల్లిపాయ',
    ta: 'வெங்காயம்',
    gu: 'ડુંગળી',
    kn: 'ಈರುಳ್ಳಿ',
    ml: 'ഉള്ളി',
    pa: 'ਪਿਆਜ਼',
    or: 'ପିଆଜ',
    as: 'পিয়াঁজ',
    ur: 'پیاز',
    sa: 'पलाण्डुः',
    ne: 'प्याज',
    kok: 'कांदो',
    mai: 'पियाज',
    ks: 'گنڈٕ',
    sd: 'بصر',
    brx: 'पियाज',
    doi: 'गंडा',
    mni: 'তিলহৌ',
    sat: 'ᱯᱮᱭᱟᱡᱽ',
  },
  potato: {
    en: 'Potato',
    hi: 'आलू',
    mr: 'बटाटा',
    bn: 'আলু',
    te: 'బంగాళాదుంప',
    ta: 'உருளைக்கிழங்கு',
    gu: 'બટાટા',
    kn: 'ಆಲೂಗಡ್ಡೆ',
    ml: 'ഉരുളക്കിഴങ്ങ്',
    pa: 'ਆਲੂ',
    or: 'ଆଳୁ',
    as: 'আলু',
    ur: 'آلو',
    sa: 'आलुकम्',
    ne: 'आलु',
    kok: 'बटाटो',
    mai: 'आलु',
    ks: 'اولُو',
    sd: 'پٽاٽو',
    brx: 'थासो',
    doi: 'आलू',
    mni: 'আলু',
    sat: 'ᱟᱞᱩ',
  },
  bajra: {
    en: 'Bajra / Pearl Millet',
    hi: 'बाजरा',
    mr: 'बाजरी',
    bn: 'বাজরা',
    te: 'సజ్జలు',
    ta: 'கம்பு',
    gu: 'બાજરી',
    kn: 'ಸಜ್ಜೆ',
    ml: 'കമ്പം',
    pa: 'ਬਾਜਰਾ',
    or: 'ବାଜରା',
    as: 'বাজৰা',
    ur: 'باجرہ',
    sa: 'प्रियङ्गुः',
    ne: 'बाजरा',
    kok: 'बाजरी',
    mai: 'बाजरा',
    ks: 'باجرہ',
    sd: 'باجھري',
    brx: 'बाजरा',
    doi: 'बाजरा',
    mni: 'বাজরা',
    sat: 'ᱵᱟᱡᱽᱨᱟ',
  },
  jowar: {
    en: 'Jowar / Sorghum',
    hi: 'ज्वार',
    mr: 'ज्वारी',
    bn: 'জোয়ার',
    te: 'జొన్నలు',
    ta: 'சோளம்',
    gu: 'જુવાર',
    kn: 'ಜೋಳ',
    ml: 'ചോളം',
    pa: 'ਜਵਾਰ',
    or: 'ଜୁଆର',
    as: 'যোৱাৰ',
    ur: 'جوار',
    sa: 'यवनालः',
    ne: 'जुनेलो',
    kok: 'ज्वारी',
    mai: 'जनहेरा',
    ks: 'جوار',
    sd: 'جواھر',
    brx: 'जुवार',
    doi: 'ज्वार',
    mni: 'জোয়ার',
    sat: 'ᱜᱟᱸᱜᱟᱹᱭ',
  },
  tur: {
    en: 'Tur / Arhar / Pigeon Pea',
    hi: 'अरहर / तुअर',
    mr: 'तूर',
    bn: 'অড়হর',
    te: 'కందులు',
    ta: 'துவரை',
    gu: 'તુવેર',
    kn: 'ತೊಗರಿ',
    ml: 'തുവര',
    pa: 'ਅਰਹਰ',
    or: 'ହରଡ଼',
    as: 'ৰহৰ মাহ',
    ur: 'ارہر',
    sa: 'आढकी',
    ne: 'रहर',
    kok: 'तूर',
    mai: 'रहर',
    ks: 'ارہر',
    sd: 'ارھر',
    brx: 'अरहर',
    doi: 'हरहड़',
    mni: 'অড়হর',
    sat: 'ᱨᱟᱦᱮᱲ',
  },
  moong: {
    en: 'Moong / Green Gram',
    hi: 'मूंग',
    mr: 'मूग',
    bn: 'মুগ',
    te: 'పెసలు',
    ta: 'பாசிப்பயறு',
    gu: 'મગ',
    kn: 'ಹೆಸರುಕಾಳು',
    ml: 'ചെറുപയർ',
    pa: 'ਮੂੰਗੀ',
    or: 'ମୁଗ',
    as: 'মুগ মাহ',
    ur: 'مونگ',
    sa: 'मुद्गः',
    ne: 'मुँग',
    kok: 'मूग',
    mai: 'मूँग',
    ks: 'موہنگ',
    sd: 'مڱ',
    brx: 'मुग',
    doi: 'मूंगी',
    mni: 'মুগ',
    sat: 'ᱢᱩᱜᱽ',
  },
  urad: {
    en: 'Urad / Black Gram',
    hi: 'उड़द',
    mr: 'उडीद',
    bn: 'বিউলি / কলাই',
    te: 'మినుములు',
    ta: 'உளுந்து',
    gu: 'અડદ',
    kn: 'ಉದ್ದು',
    ml: 'ഉഴുന്ന്',
    pa: 'ਮਾਂਹ / ਉੜਦ',
    or: 'ବିରି',
    as: 'মাটি মাহ',
    ur: 'ماش',
    sa: 'माषः',
    ne: 'मास',
    kok: 'उडीद',
    mai: 'उरीद',
    ks: 'ماش',
    sd: 'مانھه',
    brx: 'उरद',
    doi: 'मांह',
    mni: 'উড়দ',
    sat: 'ᱵᱤᱨᱤ',
  },
  chilli: {
    en: 'Chilli',
    hi: 'मिर्च',
    mr: 'मिरची',
    bn: 'লঙ্কা',
    te: 'మిరపకాయ',
    ta: 'மிளகாய்',
    gu: 'મરચાં',
    kn: 'ಮೆಣಸಿನಕಾಯಿ',
    ml: 'പച്ചമുളക്',
    pa: 'ਮਿਰਚ',
    or: 'ଲଙ୍କା',
    as: 'জলকীয়া',
    ur: 'مرچ',
    sa: 'मरीचम्',
    ne: 'खुर्सानी',
    kok: 'मिरसांग',
    mai: 'मरिच',
    ks: 'مارچُو',
    sd: 'مرچ',
    brx: 'फिथा',
    doi: 'मिरच',
    mni: 'মোরোচ',
    sat: 'ᱢᱟᱹᱨᱤᱪ',
  },
  garlic: {
    en: 'Garlic',
    hi: 'लहसुन',
    mr: 'लसूण',
    bn: 'রসুন',
    te: 'వెల్లుల్లి',
    ta: 'பூண்டு',
    gu: 'લસણ',
    kn: 'ಬೆಳ್ಳುಳ್ಳಿ',
    ml: 'വെളുത്തുള്ളി',
    pa: 'ਲਸਣ',
    or: 'ରସୁଣ',
    as: 'নহৰু',
    ur: 'لہسن',
    sa: 'लशुनम्',
    ne: 'लसुन',
    kok: 'लोसूण',
    mai: 'लहसुन',
    ks: 'روہُن',
    sd: 'ٿوم',
    brx: 'सामब्राम',
    doi: 'थूम',
    mni: 'চনম',
    sat: 'ᱨᱟᱹᱥᱩᱬ',
  },
  ginger: {
    en: 'Ginger',
    hi: 'अदरक',
    mr: 'आले / अद्रक',
    bn: 'আদা',
    te: 'అల్లం',
    ta: 'இஞ்சி',
    gu: 'આદુ',
    kn: 'ಶುಂಠಿ',
    ml: 'ഇഞ്ചി',
    pa: 'ਅਦਰਕ',
    or: 'ଅଦା',
    as: 'আদা',
    ur: 'ادرک',
    sa: 'आर्द्रकम्',
    ne: 'अदुवा',
    kok: 'आलें',
    mai: 'आदि',
    ks: 'ادرک',
    sd: 'ادرڪ',
    brx: 'हाइजिंग',
    doi: 'अदरख',
    mni: 'শিঙ',
    sat: 'ᱟᱫᱟ',
  },
  turmeric: {
    en: 'Turmeric',
    hi: 'हल्दी',
    mr: 'हळद',
    bn: 'হলুদ',
    te: 'పసుపు',
    ta: 'மஞ்சள்',
    gu: 'હળદર',
    kn: 'ಅರಿಶಿನ',
    ml: 'മഞ്ഞൾ',
    pa: 'ਹਲਦੀ',
    or: 'ହଳଦୀ',
    as: 'হালধি',
    ur: 'ہلدی',
    sa: 'हरिद्रा',
    ne: 'बेसार',
    kok: 'हळद',
    mai: 'हरदी',
    ks: 'لیدُر',
    sd: 'هيڊ',
    brx: 'हालदै',
    doi: 'हलदी',
    mni: 'য়াইঙন',
    sat: 'ᱥᱟᱥᱟᱝ',
  },
};

/**
 * Translates crop name dynamically for any of the 23 languages
 */
export function translateCropName(cropName: string, lang: LanguageCode = 'en'): string {
  if (!cropName) return '';
  if (lang === 'en') return cropName;

  const lower = cropName.toLowerCase();

  for (const [key, map] of Object.entries(CROP_TRANSLATIONS)) {
    if (lower.includes(key)) {
      const translated = map[lang] || map['hi'] || map['en'];
      if (!translated) continue;

      // If the original has a specific variety code (e.g. HD-2967, JS-335, PB-1121, etc.)
      const varietyMatch = cropName.match(/\b([A-Z]{1,4}-\d{2,5}[A-Za-z0-9-]*|\([A-Za-z0-9 -]+\))\b/);
      if (varietyMatch) {
        return `${translated} (${varietyMatch[1].replace(/[()]/g, '')})`;
      }
      return translated;
    }
  }

  return cropName;
}

/**
 * 2. Soil Analysis Multilingual Dictionaries
 */
export const SOIL_RATING_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, string>>> = {
  'Very Low': {
    en: 'Very Low',
    hi: 'अत्यधिक कम',
    mr: 'खूप कमी',
    bn: 'অত্যন্ত কম',
    te: 'చాలా తక్కువ',
    ta: 'மிகக் குறைவு',
    gu: 'ખૂબ ઓછું',
    kn: 'ಬಹಳ ಕಡಿಮೆ',
    ml: 'വളരെ കുറവ്',
    pa: 'ਬਹੁਤ ਘੱਟ',
    or: 'ଅତି କମ',
    as: 'অতি কম',
    ur: 'بہت کم',
    sa: 'अतिन्यूनम्',
    ne: 'धेरै कम',
    kok: 'खूब कमी',
  },
  'Low': {
    en: 'Low',
    hi: 'कम',
    mr: 'कमी',
    bn: 'কম',
    te: 'తక్కువ',
    ta: 'குறைவு',
    gu: 'ઓછું',
    kn: 'ಕಡಿಮೆ',
    ml: 'കുറവ്',
    pa: 'ਘੱਟ',
    or: 'କମ',
    as: 'কম',
    ur: 'کم',
    sa: 'न्यूनम्',
    ne: 'कम',
    kok: 'कमी',
  },
  'Medium': {
    en: 'Medium',
    hi: 'मध्यम',
    mr: 'मध्यम',
    bn: 'মাঝারি',
    te: 'మధ్యస్థం',
    ta: 'நடுத்தரம்',
    gu: 'મધ્યમ',
    kn: 'ಮಧ್ಯಮ',
    ml: 'മിതമായ',
    pa: 'ਦਰਮਿਆਨਾ',
    or: 'ମଧ୍ୟମ',
    as: 'মজলীয়া',
    ur: 'درمیانہ',
    sa: 'मध्यमम्',
    ne: 'मध्यम',
    kok: 'मध्यम',
  },
  'Adequate': {
    en: 'Adequate',
    hi: 'पर्याप्त / उत्तम',
    mr: 'पुरेसे / योग्य',
    bn: 'পর্যাপ্ত',
    te: 'సరిపడా',
    ta: 'போதுமானது',
    gu: 'પર્યાપ્ત',
    kn: 'ಸಾಕಷ್ಟು',
    ml: 'പര്യാപ്തം',
    pa: 'ਲੋੜੀਂਦਾ',
    or: 'ଯଥେଷ୍ଟ',
    as: 'পৰ্যাপ্ত',
    ur: 'کافی',
    sa: 'पर्याप्तम्',
    ne: 'पर्याप्त',
    kok: 'पुरो',
  },
  'High': {
    en: 'High',
    hi: 'अधिक / उच्च',
    mr: 'जास्त / उच्च',
    bn: 'উচ্চ',
    te: 'ఎక్కువ',
    ta: 'அதிகம்',
    gu: 'વધારે',
    kn: 'ಹೆಚ್ಚು',
    ml: 'കൂടുതൽ',
    pa: 'ਵੱਧ',
    or: 'ଅଧିକ',
    as: 'অধিক',
    ur: 'زیادہ',
    sa: 'उच्चम्',
    ne: 'उच्च',
    kok: 'जास्त',
  },
  'Very High': {
    en: 'Very High',
    hi: 'अत्यधिक उच्च',
    mr: 'अति जास्त',
    bn: 'অত্যন্ত উচ্চ',
    te: 'చాలా ఎక్కువ',
    ta: 'மிக அதிகம்',
    gu: 'ખૂબ વધારે',
    kn: 'ಬಹಳ ಹೆಚ್ಚು',
    ml: 'വളരെ കൂടുതൽ',
    pa: 'ਬਹੁਤ ਵੱਧ',
    or: 'ଅତି ଅଧିକ',
    as: 'অতি অধিক',
    ur: 'بہت زیادہ',
    sa: 'अत्युच्चम्',
    ne: 'धेरै उच्च',
    kok: 'खूब जास्त',
  },
  'Acidic': {
    en: 'Acidic',
    hi: 'अम्लीय',
    mr: 'आम्लयुक्त',
    bn: 'আম্লিক',
    te: 'ఆమ్లయుత',
    ta: 'அமிலத்தன்மை',
    gu: 'એસિડિક',
    kn: 'ಆಮ್ಲೀಯ',
    ml: 'അമ്ലഗുണമുള്ള',
    pa: 'ਤੇਜ਼ਾਬੀ',
    or: 'ଅମ୍ଳୀୟ',
    as: 'আম্লিক',
    ur: 'تیزابی',
    sa: 'अम्लम्',
    ne: 'अम्लीय',
    kok: 'आंबट',
  },
  'Optimal Neutral': {
    en: 'Optimal Neutral',
    hi: 'इष्टतम उदासीन',
    mr: 'इष्टतम तटस्थ',
    bn: 'সর্বোত্তম নিরপেক্ষ',
    te: 'సరైన తటస్థం',
    ta: 'சிறந்த நடுநிலை',
    gu: 'આદર્શ તટસ્થ',
    kn: 'ಉತ್ತಮ ತಟಸ್ಥ',
    ml: 'ഉചിതമായ തുല്യാവസ്ഥ',
    pa: 'ਉੱਤਮ ਨਿਰਪੱਖ',
    or: 'ଆଦର୍ଶ ନିରପେକ୍ଷ',
    as: 'উত্তম নিৰপেক্ষ',
    ur: 'بہترین معتدل',
    sa: 'उचित तटस्थम्',
    ne: 'उचित तटस्थ',
    kok: 'योग्य न्यूट्रल',
  },
  'Moderately Alkaline': {
    en: 'Moderately Alkaline',
    hi: 'मध्यम क्षारीय',
    mr: 'मध्यम अल्कधर्मी',
    bn: 'মাঝারি ক্ষারীয়',
    te: 'మధ్యస్థ క్షారయుత',
    ta: 'மிதமான காரத்தன்மை',
    gu: 'મધ્યમ ક્ષારીય',
    kn: 'ಮಧ್ಯಮ ಕ್ಷಾರೀಯ',
    ml: 'മിതമായ ക്ഷാരഗുണം',
    pa: 'ਦਰਮਿਆਨਾ ਖਾਰਾ',
    or: 'ମଧ୍ୟମ କ୍ଷାରୀୟ',
    as: 'মজলীয়া ক্ষাৰকীয়',
    ur: 'درمیانہ الکلائن',
    sa: 'मध्यम क्षारम्',
    ne: 'मध्यम क्षारीय',
    kok: 'मध्यम खारट',
  },
  'Strongly Alkaline': {
    en: 'Strongly Alkaline',
    hi: 'अत्यधिक क्षारीय',
    mr: 'तीव्र अल्कधर्मी / चोपण',
    bn: 'তীব্র ক্ষারীয়',
    te: 'తీవ్ర క్షారయుత',
    ta: 'தீவிர காரத்தன்மை',
    gu: 'તીવ્ર ક્ષારીય',
    kn: 'ತೀವ್ರ ಕ್ಷಾರೀಯ',
    ml: 'കൂടിയ ക്ഷാരഗുണം',
    pa: 'ਬਹੁਤ ਜ਼ਿਆਦਾ ਖਾਰਾ',
    or: 'ତୀବ୍ର କ୍ଷାରୀୟ',
    as: 'তীব্ৰ ক্ষাৰকীয়',
    ur: 'شدید الکلائن',
    sa: 'तीव्र क्षारम्',
    ne: 'धेरै क्षारीय',
    kok: 'खूब खारट',
  },
  'Severe': {
    en: 'Severe',
    hi: 'गंभीर',
    mr: 'गंभीर',
    bn: 'তীব্র',
    te: 'తీవ్రమైన',
    ta: 'தீவிர',
    gu: 'ગંભીર',
    kn: 'ತೀವ್ರ',
    ml: 'ഗുരുതരമായ',
    pa: 'ਗੰਭੀਰ',
    or: 'ଗୁରୁତର',
    as: 'গুৰুতৰ',
    ur: 'شدید',
    sa: 'गम्भीरम्',
    ne: 'गम्भीर',
    kok: 'गंभीर',
  },
  'Moderate': {
    en: 'Moderate',
    hi: 'मध्यम',
    mr: 'मध्यम',
    bn: 'মাঝারি',
    te: 'మధ్యస్థం',
    ta: 'மிதமான',
    gu: 'મધ્યમ',
    kn: 'ಸಾಧಾರಣ',
    ml: 'മിതമായ',
    pa: 'ਦਰਮਿਆਨਾ',
    or: 'ମଧ୍ୟମ',
    as: 'মজলীয়া',
    ur: 'معتدل',
    sa: 'मध्यमम्',
    ne: 'मध्यम',
    kok: 'मध्यम',
  },
  'Mild': {
    en: 'Mild',
    hi: 'हल्का',
    mr: 'हलका',
    bn: 'সামান্য',
    te: 'స్వల్పం',
    ta: 'லேசான',
    gu: 'સાધારણ',
    kn: 'ಸ್ವಲ್ಪ',
    ml: 'നേരിയ',
    pa: 'ਹਲਕਾ',
    or: 'ସ୍ୱଳ୍ପ',
    as: 'সামান্য',
    ur: 'ہلکا',
    sa: 'मन्दम्',
    ne: 'हल्का',
    kok: 'हल्को',
  },
};

export function translateNutrientLevel(level: string, lang: LanguageCode = 'en'): string {
  if (!level) return '';
  if (lang === 'en') return level;
  const match = SOIL_RATING_TRANSLATIONS[level];
  return (match && (match[lang] || match['hi'] || match['en'])) || level;
}

/**
 * 3. Soil Parameters Translation
 */
export const SOIL_PARAM_NAMES: Record<string, Partial<Record<LanguageCode, string>>> = {
  nitrogen: {
    en: 'Available Nitrogen (N)',
    hi: 'उपलब्ध नाइट्रोजन (N)',
    mr: 'उपलब्ध नायट्रोजन (N)',
    bn: 'উপলব্ধ নাইট্রোজেন (N)',
    te: 'లభ్యమయ్యే నత్రజని (N)',
    ta: 'கிடைக்கக்கூடிய தழைச்சத்து (N)',
    gu: 'ઉપલબ્ધ નાઇટ્રોજન (N)',
    kn: 'ಲಭ್ಯವಿರುವ ಸಾರಜನಕ (N)',
    ml: 'ലഭ്യമായ നൈട്രജൻ (N)',
    pa: 'ਉਪਲਬਧ ਨਾਈਟ੍ਰੋਜਨ (N)',
    or: 'ଉପଲବ୍ଧ ଯବକ୍ଷାରଜାନ (N)',
    as: 'উপলব্ধ নাইট্ৰ’জেন (N)',
    ur: 'دستیاب نائٹروجن (N)',
  },
  phosphorus: {
    en: 'Available Phosphorus (P)',
    hi: 'उपलब्ध फास्फोरस (P)',
    mr: 'उपलब्ध स्फुरद (P)',
    bn: 'উপলব্ধ ফসফরাস (P)',
    te: 'లభ్యమయ్యే భాస్వరం (P)',
    ta: 'கிடைக்கக்கூடிய மணிச்சத்து (P)',
    gu: 'ઉપલબ્ધ ફોસ્ફરસ (P)',
    kn: 'ಲಭ್ಯವಿರುವ ರಂಜಕ (P)',
    ml: 'ലഭ്യമായ ഫോസ്ഫറസ് (P)',
    pa: 'ਉਪਲਬਧ ਫਾਸਫੋਰਸ (P)',
    or: 'ଉପଲବ୍ଧ ଫସଫରସ (P)',
    as: 'উপলব্ধ ফছফৰাছ (P)',
    ur: 'دستیاب فاسفورس (P)',
  },
  potassium: {
    en: 'Available Potassium (K)',
    hi: 'उपलब्ध पोटेशियम / पोटाश (K)',
    mr: 'उपलब्ध पालाश (K)',
    bn: 'উপলব্ধ পটাশিয়াম (K)',
    te: 'లభ్యమయ్యే పొటాషియం (K)',
    ta: 'கிடைக்கக்கூடிய சாம்பல் சத்து (K)',
    gu: 'ઉપલબ્ધ પોટાશ (K)',
    kn: 'ಲಭ್ಯವಿರುವ ಪೊಟ್ಯಾಶಿಯಂ (K)',
    ml: 'ലഭ്യമായ പൊട്ടാസ്യം (K)',
    pa: 'ਉਪਲਬਧ ਪੋਟਾਸ਼ (K)',
    or: 'ଉପଲବ୍ଧ ପୋଟାସ (K)',
    as: 'উপলব্ধ পটাছিয়াম (K)',
    ur: 'دستیاب پوٹاشیم (K)',
  },
  ph: {
    en: 'Soil Reaction (pH)',
    hi: 'मृदा अभिक्रिया (pH)',
    mr: 'जमिनीचा सामू (pH)',
    bn: 'মাটির বিক্রিয়া (pH)',
    te: 'నేల పీహెచ్ (pH)',
    ta: 'மண் கார அமிலத்தன்மை (pH)',
    gu: 'જમીનનો પીએચ (pH)',
    kn: 'ಮಣ್ಣಿನ ಪಿಹೆಚ್ (pH)',
    ml: 'മണ്ണിന്റെ പി.എച്ച് (pH)',
    pa: 'ਮਿੱਟੀ ਦਾ ਪੀ.ਐੱਚ (pH)',
    or: 'ମାଟିର ପିଏଚ (pH)',
    as: 'মাটিৰ পি.এইচ (pH)',
    ur: 'مٹی کا پی ایچ (pH)',
  },
  organicCarbon: {
    en: 'Organic Carbon (OC)',
    hi: 'जैविक कार्बन (OC)',
    mr: 'सेंद्रिय कर्ब (OC)',
    bn: 'জৈব কার্বন (OC)',
    te: 'సేంద్రీయ కార్బన్ (OC)',
    ta: 'கரிம கார்பன் (OC)',
    gu: 'સેન્દ્રીય કાર્બન (OC)',
    kn: 'ಸಾವಯವ ಇಂಗಾಲ (OC)',
    ml: 'ജൈവ കാർബൺ (OC)',
    pa: 'ਜੈਵਿਕ ਕਾਰਬਨ (OC)',
    or: 'ଜୈବ ଅଙ୍ଗାରକ (OC)',
    as: 'জৈৱিক কাৰ্বন (OC)',
    ur: 'نامیاتی کاربن (OC)',
  },
  sulphur: {
    en: 'Available Sulphur (S)',
    hi: 'सल्फर / गंधक (S)',
    mr: 'गंधक / सल्फर (S)',
    bn: 'সালফার / গন্ধক (S)',
    te: 'గంధకం (S)',
    ta: 'கந்தகம் (S)',
    gu: 'ગંધક (S)',
    kn: 'ಗಂಧಕ (S)',
    ml: 'ഗന്ധകം (S)',
    pa: 'ਗੰਧਕ (S)',
    or: 'ଗନ୍ଧକ (S)',
    as: 'চালফাৰ / গন্ধক (S)',
    ur: 'گندھک (S)',
  },
  zinc: {
    en: 'Available Zinc (Zn)',
    hi: 'जिंक / जस्ता (Zn)',
    mr: 'जस्त / झिंक (Zn)',
    bn: 'দস্তা / জিঙ্ক (Zn)',
    te: 'జింక్ (Zn)',
    ta: 'துத்தநாகம் (Zn)',
    gu: 'ઝીંક (Zn)',
    kn: 'ಸತು (Zn)',
    ml: 'സിങ്ക് (Zn)',
    pa: 'ਜਿੰਕ (Zn)',
    or: 'ଦସ୍ତା / ଜିଙ୍କ (Zn)',
    as: 'জিংক (Zn)',
    ur: 'زنک (Zn)',
  },
  iron: {
    en: 'Available Iron (Fe)',
    hi: 'आयरन / लोहा (Fe)',
    mr: 'लोह (Fe)',
    bn: 'লোহা / আয়রন (Fe)',
    te: 'ఇనుము (Fe)',
    ta: 'இரும்புச்சத்து (Fe)',
    gu: 'લોહતત્વ (Fe)',
    kn: 'ಕಬ್ಬಿಣ (Fe)',
    ml: 'ഇരുമ്പ് (Fe)',
    pa: 'ਲੋਹਾ (Fe)',
    or: 'ଲୁହା / ଆଇରନ (Fe)',
    as: 'লো / আইৰণ (Fe)',
    ur: 'لوہا (Fe)',
  },
  manganese: {
    en: 'Available Manganese (Mn)',
    hi: 'मैंगनीज (Mn)',
    mr: 'मॅंगनीज (Mn)',
    bn: 'ম্যাঙ্গানিজ (Mn)',
    te: 'మాంగనీస్ (Mn)',
    ta: 'மாங்கனீசு (Mn)',
    gu: 'મેંગેનીઝ (Mn)',
    kn: 'ಮ್ಯಾಂಗನೀಸ್ (Mn)',
    ml: 'മാംഗനീസ് (Mn)',
    pa: 'ਮੈਂਗਨੀਜ਼ (Mn)',
    or: 'ମାଙ୍ଗାନିଜ (Mn)',
    as: 'মেঙ্গানিজ (Mn)',
    ur: 'مینگنیج (Mn)',
  },
  copper: {
    en: 'Available Copper (Cu)',
    hi: 'कॉपर / तांबा (Cu)',
    mr: 'तांबे / कॉपर (Cu)',
    bn: 'তামা / কপার (Cu)',
    te: 'రాగి (Cu)',
    ta: 'செம்பு (Cu)',
    gu: 'તાંબુ (Cu)',
    kn: 'ತಾಮ್ರ (Cu)',
    ml: 'ചെമ്പ് (Cu)',
    pa: 'ਤਾਂਬਾ (Cu)',
    or: 'ତମ୍ବା (Cu)',
    as: 'তাম (Cu)',
    ur: 'تانبا (Cu)',
  },
  boron: {
    en: 'Available Boron (B)',
    hi: 'बोरॉन (B)',
    mr: 'बोरॉन (B)',
    bn: 'বোরন (B)',
    te: 'బోరాన్ (B)',
    ta: 'போரான் (B)',
    gu: 'બોરોન (B)',
    kn: 'ಬೋರಾನ್ (B)',
    ml: 'ബോറോൺ (B)',
    pa: 'ਬੋਰੋਨ (B)',
    or: 'ବୋରୋନ (B)',
    as: 'বৰণ (B)',
    ur: 'بوران (B)',
  },
  electricalConductivity: {
    en: 'Electrical Conductivity (EC)',
    hi: 'विद्युत चालकता (EC)',
    mr: 'विद्युत वाहकता (EC)',
    bn: 'বৈদ্যুতিক পরিবাহিতা (EC)',
    te: 'విద్యుత్ వాహకత (EC)',
    ta: 'மின் கடத்துத்திறன் (EC)',
    gu: 'વિદ્યુત વાહકતા (EC)',
    kn: 'ವಿದ್ಯುತ್ ವಾಹಕತೆ (EC)',
    ml: 'വൈദ്യുത ചാലകത (EC)',
    pa: 'ਬਿਜਲਈ ਚਾਲਕਤਾ (EC)',
    or: 'ବିଦ୍ୟୁତ ପରିବାହିତା (EC)',
    as: 'বৈদ্যুতিক পৰিবাহিতা (EC)',
    ur: 'برقی ایصالیت (EC)',
  },
};

export function translateSoilParameter(key: string, lang: LanguageCode = 'en'): string {
  if (lang === 'en') return SOIL_PARAM_NAMES[key]?.en || key;
  const match = SOIL_PARAM_NAMES[key];
  return (match && (match[lang] || match['hi'] || match['en'])) || key;
}

/**
 * 4. Seasons Multilingual
 */
export const SEASON_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, string>>> = {
  Kharif: {
    en: 'Kharif (Monsoon)',
    hi: 'खरीफ (मानसून)',
    mr: 'खरीप (पावसाळी)',
    bn: 'খরিফ (বর্ষাকালীন)',
    te: 'ఖరీఫ్ (వర్షాకాలం)',
    ta: 'காரீப் (மழைக்காலம்)',
    gu: 'ખરીફ (ચોમાસુ)',
    kn: 'ಖಾರೀಫ್ (ಮುಂಗಾರು)',
    ml: 'ഖാരിഫ് (മഴക്കാലം)',
    pa: 'ਸਾਉਣੀ / ਖਰੀਫ',
    or: 'ଖରିଫ (ବର୍ଷା)',
    as: 'খাৰিফ (বাৰিষা)',
    ur: 'خریف (مانسون)',
  },
  Rabi: {
    en: 'Rabi (Winter)',
    hi: 'रबी (शीतकालीन)',
    mr: 'रब्बी (हिवाळी)',
    bn: 'রবি (শীতকালীন)',
    te: 'రబీ (శీతాకాలం)',
    ta: 'ரபி (குளிர்காலம்)',
    gu: 'રવિ (શિયાળુ)',
    kn: 'ರಬಿ (ಹಿಂಗಾರು)',
    ml: 'റബി (ശീതകാലം)',
    pa: 'ਹਾੜ੍ਹੀ / ਰਬੀ',
    or: 'ରବି (ଶୀତ)',
    as: 'ৰবি (শীতকালীন)',
    ur: 'ربیع (سردیوں)',
  },
  Zaid: {
    en: 'Zaid (Summer)',
    hi: 'जायद (ग्रीष्मकालीन)',
    mr: 'उन्हाळी / झायद',
    bn: 'জায়েদ (গ্রীষ্মকালীন)',
    te: 'జాయద్ (వేసవి కాలం)',
    ta: 'சயீத் (கோடைகாலம்)',
    gu: 'જાયદ (ઉનાળુ)',
    kn: 'ಜಾಯಿದ್ (ಬೇಸಿಗೆ)',
    ml: 'സായിദ് (വേനൽക്കാലം)',
    pa: 'ਜ਼ਾਇਦ (ਗਰਮੀਆਂ)',
    or: 'ଜାଇଦ (ଖରାଦିନିଆ)',
    as: 'জায়েদ (খৰালি)',
    ur: 'زائد (موسم گرما)',
  },
};

export function translateSeason(season: string, lang: LanguageCode = 'en'): string {
  if (!season) return '';
  if (lang === 'en') return season;
  const sLower = season.toLowerCase();
  for (const [k, v] of Object.entries(SEASON_TRANSLATIONS)) {
    if (sLower.includes(k.toLowerCase())) {
      return v[lang] || v['hi'] || season;
    }
  }
  return season;
}

/**
 * 5. Common Pests & Diseases Multilingual
 */
export const PEST_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, string>>> = {
  'Stem Borer': {
    en: 'Stem Borer',
    hi: 'तना छेदक',
    mr: 'खोडकिडा / खोड पोखरक',
    bn: 'মাজরা পোকা',
    te: 'కాండం తొలుచు పురుగు',
    ta: 'தண்டு துளைப்பான்',
    gu: 'ગાભમારાની ઈયળ',
    kn: 'ಕಾಂಡ ಕೊರೆಯುವ ಹುಳು',
    ml: 'തണ്ടുതുരപ്പൻ',
    pa: 'ਤਣਾ ਛੇਦਕ ਸੁੰਡੀ',
    or: 'କାଣ୍ଡ ବିନ୍ଧା ପୋକ',
  },
  'Aphids': {
    en: 'Aphids',
    hi: 'माहू / चेपा',
    mr: 'मावा / तुडतुडे',
    bn: 'জাব পোকা',
    te: 'పేనుబంక',
    ta: 'அசுவினி',
    gu: 'મોલો-મશી',
    kn: 'ಸಸ್ಯಹೇನು',
    ml: 'എഫിഡുകൾ',
    pa: 'ਤੇਲਾ',
    or: 'ଜାଉ ପୋକ',
  },
  'Whitefly': {
    en: 'Whitefly',
    hi: 'सफेद मक्खी',
    mr: 'पांढरी माशी',
    bn: 'সাদা মাছি',
    te: 'తెల్లదోమ',
    ta: 'வெள்ளை ஈ',
    gu: 'સફેદ માખી',
    kn: 'ಬಿಳಿ ನೊಣ',
    ml: 'വെള്ളീച്ച',
    pa: 'ਚਿੱਟੀ ਮੱਖੀ',
    or: 'ଧଳା ମାଛି',
  },
  'Bollworm': {
    en: 'Pink / American Bollworm',
    hi: 'गुलाबी / अमेरिकन सुंडी',
    mr: 'गुलाबी / बोंडअळी',
    bn: 'বোলওয়ার্ম পোকা',
    te: 'గులాబీ రంగు కాయ తొలుచు పురుగు',
    ta: 'காய் துளைப்பான் / இளஞ்சிவப்பு புழு',
    gu: 'ગુલાબી ઈયળ',
    kn: 'ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು',
    ml: 'കായതുരപ്പൻ പുഴു',
    pa: 'ਗੁਲਾਬੀ ਸੁੰਡੀ',
    or: 'କପା କାଣ୍ଡ ପୋକ',
  },
  'Rust': {
    en: 'Yellow / Brown Rust',
    hi: 'पीला / भूरा रतुआ',
    mr: 'तांबेरा / पिवळा तांबेरा',
    bn: 'মরিচা রোগ',
    te: 'తుప్పు తెగులు',
    ta: 'துரு நோய்',
    gu: 'ગેરુ રોગ',
    kn: 'ತುಕ್ಕು ರೋಗ',
    ml: 'തുരുമ്പ് രോഗം',
    pa: 'ਪੀਲੀ / ਭੂਰੀ ਕੁੰਗੀ',
    or: 'କଳଙ୍କି ରୋଗ',
  },
  'Powdery Mildew': {
    en: 'Powdery Mildew',
    hi: 'चूर्णिल आसिता (भभूतिया)',
    mr: 'भुरी रोग',
    bn: 'পাউডারি মিলডিউ',
    te: 'బూడిద తెగులు',
    ta: 'சாம்பல் நோய்',
    gu: 'છાશિયો રોગ',
    kn: 'ಬೂದಿ ರೋಗ',
    ml: 'പൊടിപൂപ്പ്',
    pa: 'ਚਿੱਟਾ ਪਾਊਡਰ ਰੋਗ',
    or: 'ପାଉଡରୀ ମିଲଡ୍ୟୁ',
  },
  'Blast': {
    en: 'Blast Disease',
    hi: 'ब्लास्ट / झुलसा',
    mr: 'करपा / ब्लास्ट रोग',
    bn: 'ব্লাস্ট রোগ',
    te: 'అగ్గితెగులు',
    ta: 'குலை நோய்',
    gu: 'ગરવો રોગ',
    kn: 'ಬೆಂಕಿ ರೋಗ',
    ml: 'പോളരോഗം',
    pa: 'ਝੁਲਸਾ ਰੋਗ',
    or: 'ବ୍ଲାଷ୍ଟ ରୋଗ',
  },
};

export function translatePestName(pest: string, lang: LanguageCode = 'en'): string {
  if (!pest) return '';
  if (lang === 'en') return pest;
  const pLower = pest.toLowerCase();
  for (const [k, v] of Object.entries(PEST_TRANSLATIONS)) {
    if (pLower.includes(k.toLowerCase())) {
      return v[lang] || v['hi'] || pest;
    }
  }
  return pest;
}

/**
 * 6. Application Methods & Timings Multilingual
 */
export const FERT_METHOD_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, string>>> = {
  'Basal': {
    en: 'Basal application at sowing',
    hi: 'बुवाई के समय आधारभूत प्रयोग (बेसल डोज)',
    mr: 'पेरणीच्या वेळी बेसल डोस (पायाभूत खत)',
    bn: 'বপনের সময় মূল সার প্রয়োগ',
    te: 'విత్తే సమయంలో మొదటి మోతాదు (బాసల్ డోస్)',
    ta: 'விதைக்கும் போது அடியுரம்',
    gu: 'વાવણી સમયે પાયાનું ખાતર',
    kn: 'ಬಿತ್ತನೆ ಸಮಯದಲ್ಲಿ ತಳ ಗೊಬ್ಬರ',
    ml: 'വിത്ത് വിതയ്ക്കുമ്പോൾ അടിവളം',
    pa: 'ਬਿਜਾਈ ਵੇਲੇ ਮੁੱਢਲੀ ਖਾਦ',
    or: 'ବୁଣିବା ସମୟରେ ମୂଳ ସାର',
  },
  'Top Dressing': {
    en: 'Top dressing during vegetative phase',
    hi: 'वानस्पतिक अवस्था में छिड़काव / बिखेर कर (टॉप ड्रेसिंग)',
    mr: 'वाढीच्या काळात वरखत देणे (टॉप ड्रेसिंग)',
    bn: 'বৃদ্ধি পর্যায়ে উপরিপ্রয়োগ',
    te: 'పైపాటుగా చల్లడం (టాప్ డ్రెస్సింగ్)',
    ta: 'மேலுரம் இடுதல்',
    gu: 'વિકાસ તબક્કે ટોપ ડ્રેસિંગ',
    kn: 'ಮೇಲ್ಗೊಬ್ಬರ ಹಾಕುವುದು',
    ml: 'മേൽവളം ചേർക്കൽ',
    pa: 'ਫਸਲ ਵਧਣ ਸਮੇਂ ਉੱਪਰੋਂ ਖਾਦ ਪਾਉਣਾ',
    or: 'ଉପରୁ ସାର ପ୍ରୟୋଗ',
  },
  'Foliar Spray': {
    en: 'Foliar spray on crop canopy',
    hi: 'पत्तियों पर घोल बनाकर पर्णीय छिड़काव',
    mr: 'पानांवर फवारणी (फोलियर स्प्रे)',
    bn: 'পাতায় স্প্রে করা',
    te: 'ఆకులపై పిచికారీ',
    ta: 'இலை வழி தெளிப்பு',
    gu: 'પાંદડા પર છંટકાવ',
    kn: 'ಎಲೆಗಳ ಮೇಲೆ ಸಿಂಪರಣೆ',
    ml: 'ഇലകളിൽ തളിക്കൽ',
    pa: 'ਪੱਤਿਆਂ ਉੱਤੇ ਛਿੜਕਾਅ',
    or: 'ପତ୍ର ଉପରେ ସ୍ପ୍ରେ',
  },
};

export function translateFertilizerMethod(method: string, lang: LanguageCode = 'en'): string {
  if (!method) return '';
  if (lang === 'en') return method;
  const mLower = method.toLowerCase();
  for (const [k, v] of Object.entries(FERT_METHOD_TRANSLATIONS)) {
    if (mLower.includes(k.toLowerCase())) {
      return v[lang] || v['hi'] || method;
    }
  }
  return method;
}

export const FERTILIZER_NAMES_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, string>>> = {
  'urea': {
    en: 'Urea (46% N)',
    hi: 'यूरिया (46% नाइट्रोजन)',
    mr: 'युरिया (४६% नत्र)',
    bn: 'ইউরিয়া (৪৬% নাইট্রোজেন)',
    te: 'యూరియా (46% నత్రజని)',
    ta: 'யூரியா (46% தழைச்சத்து)',
    gu: 'યુરિયા (૪૬% નાઇટ્રોજન)',
    kn: 'ಯೂರಿಯಾ (46% ಸಾರಜನಕ)',
    ml: 'യൂറിയ (46% നൈട്രജൻ)',
    pa: 'ਯੂਰੀਆ (46% ਨਾਈਟ੍ਰੋਜਨ)',
    or: 'ୟୁରିଆ',
  },
  'dap': {
    en: 'DAP (Di-Ammonium Phosphate 18:46:0)',
    hi: 'डीएपी (डाय-अमोनियम फॉस्फेट 18:46:0)',
    mr: 'डीएपी (डाय-अमोनियम फॉस्फेट १८:४६:०)',
    bn: 'ডিএপি (ডাই-অ্যামোনিয়াম ফসফেট)',
    te: 'డిఎపి (18:46:0)',
    ta: 'டிஏபி (18:46:0)',
    gu: 'ડીએપી (૧૮:૪૬:૦)',
    kn: 'ಡಿಎಪಿ (18:46:0)',
    ml: 'ഡിഎപി (18:46:0)',
    pa: 'ਡੀਏਪੀ (18:46:0)',
    or: 'ଡିଏପି',
  },
  'mop': {
    en: 'MOP (Muriate of Potash 60% K2O)',
    hi: 'एमओपी (म्यूरेट ऑफ पोटाश 60%)',
    mr: 'एमओपी (म्युरिएट ऑफ पोटॅश ६०%)',
    bn: 'এমওপি (মিউরেট অব পটাশ)',
    te: 'ఎంఓపి (పొటాష్ 60%)',
    ta: 'எம்ஓபி (சாம்பல் சத்து 60%)',
    gu: 'એમઓપી (પોટાશ ૬૦%)',
    kn: 'ಎಂಒಪಿ (ಪೊಟ್ಯಾಶ್ 60%)',
    ml: 'എംഒപി (പൊട്ടാഷ് 60%)',
    pa: 'ਐਮਓਪੀ (ਪੋਟਾਸ਼ 60%)',
    or: 'ଏମଓପି',
  },
  'single super phosphate': {
    en: 'Single Super Phosphate (SSP 16% P)',
    hi: 'सिंगल सुपर फॉस्फेट (एसएसपी)',
    mr: 'सिंगल सुपर फॉस्फेट (एसएसपी)',
    bn: 'সিঙ্গেল সুপার ফসফেট (এসএসপি)',
    te: 'సింగిల్ సూపర్ ఫాస్ఫేట్ (ఎస్ఎస్పీ)',
    ta: 'சிங்கிள் சூப்பர் பாஸ்பேட்',
    gu: 'સિંગલ સુપર ફોસ્ફેટ (એસએસપી)',
    kn: 'ಸಿಂಗಲ್ ಸೂಪರ್ ಫಾಸ್ಫೇಟ್',
    ml: 'സിംഗിൾ സൂപ്പർ ഫോസ്ഫേറ്റ്',
    pa: 'ਸਿੰਗਲ ਸੁਪਰ ਫਾਸਫੇਟ',
    or: 'ଏସଏସପି',
  },
  'ssp': {
    en: 'Single Super Phosphate (SSP 16% P)',
    hi: 'सिंगल सुपर फॉस्फेट (एसएसपी)',
    mr: 'सिंगल सुपर फॉस्फेट (एसएसपी)',
    bn: 'সিঙ্গেল সুপার ফসফেট (এসএসপি)',
    te: 'సింగిల్ సూపర్ ఫాస్ఫేట్ (ఎస్ఎస్పీ)',
    ta: 'சிங்கிள் சூப்பர் பாஸ்பேட்',
    gu: 'સિંગલ સુપર ફોસ્ફેટ (એસએસપી)',
    kn: 'ಸಿಂಗಲ್ ಸೂಪರ್ ಫಾಸ್ಫೇಟ್',
    ml: 'സിംഗിൾ സൂപ്പർ ഫോസ്ഫേറ്റ്',
    pa: 'ਸਿੰਗਲ ਸੁਪਰ ਫਾਸਫੇਟ',
    or: 'ଏସଏସପି',
  },
  'zinc sulphate': {
    en: 'Zinc Sulphate (21% or 33% Zn)',
    hi: 'जिंक सल्फेट (जस्ता)',
    mr: 'झिंक सल्फेट (जस्त)',
    bn: 'জিঙ্ক সালফেট',
    te: 'జింక్ సల్ఫేట్',
    ta: 'துத்தநாக சல்பேட்',
    gu: 'ઝિંક સલ્ફેટ',
    kn: 'ಜಿಂಕ್ ಸಲ್ಫೇಟ್',
    ml: 'സിങ്ക് സൾഫേറ്റ്',
    pa: 'ਜ਼ਿੰਕ ਸਲਫੇਟ',
    or: 'ଜିଙ୍କ ସଲଫେଟ',
  },
  'ferrous sulphate': {
    en: 'Ferrous Sulphate (Iron 19%)',
    hi: 'फेरस सल्फेट (लोहा 19%)',
    mr: 'फेरस सल्फेट (लोह १९%)',
    bn: 'ফেরাস সালফেট',
    te: 'ఫెర్రస్ సల్ఫేట్',
    ta: 'இரும்பு சல்பேட்',
    gu: 'ફેરસ સલ્ફેટ',
    kn: 'ಫೆರಸ್ ಸಲ್ಫೇಟ್',
    ml: 'ഫെറസ് സൾഫേറ്റ്',
    pa: 'ਫੈਰਸ ਸਲਫੇਟ',
    or: 'ଫେରସ ସଲଫେଟ',
  },
  'borax': {
    en: 'Borax / Boron (10.5% or 20%)',
    hi: 'बोरेक्स / बोरॉन',
    mr: 'बोरोन / सुहागा',
    bn: 'বোরন',
    te: 'బోరాక్స్ / బోరాన్',
    ta: 'போராக்ஸ் / போரான்',
    gu: 'બોરોન',
    kn: 'ಬೊರಾಕ್ಸ್ / ಬೊರಾನ್',
    ml: 'ബോറാക്സ്',
    pa: 'ਬੋਰੈਕਸ',
    or: 'ବୋରାକ୍ସ',
  },
  'gypsum': {
    en: 'Agricultural Gypsum (Calcium & Sulphur)',
    hi: 'कृषि जिप्सम (कैल्शियम एवं सल्फर)',
    mr: 'जिप्सम (कॅल्शियम आणि गंधक)',
    bn: 'কৃষি জিপসাম',
    te: 'వ్యవసాయ జిప్సం',
    ta: 'ஜிப்சம்',
    gu: 'જિપ્સમ',
    kn: 'ಜಿಪ್ಸಮ್',
    ml: 'ജിപ്സം',
    pa: 'ਜਿਪਸਮ',
    or: 'ଜିପସମ',
  },
  'fym': {
    en: 'Farm Yard Manure / Compost',
    hi: 'गोबर की सड़ी खाद (एफवाईएम) / कम्पोस्ट',
    mr: 'शेणखत / कंपोस्ट',
    bn: 'গোবর সার / কম্পোস্ট',
    te: 'పశువుల ఎరువు / కంపోస్ట్',
    ta: 'தொழு உரம் / மண்புழு உரம்',
    gu: 'છાણિયું ખાતર',
    kn: 'ಸಗಣಿ ಗೊಬ್ಬರ',
    ml: 'കാലിവളം',
    pa: 'ਰੂੜੀ ਦੀ ਖਾਦ',
    or: 'ଗୋବର ଖତ',
  },
  'neem cake': {
    en: 'Neem Cake (Organic Soil Enricher)',
    hi: 'नीम की खली',
    mr: 'निंबोळी पेंड',
    bn: 'নিম খৈল',
    te: 'వేప పిండి',
    ta: 'வேப்பம் புண்ணாக்கு',
    gu: 'લીંબોળી ખોળ',
    kn: 'ಬೇವಿನ ಹಿಂಡಿ',
    ml: 'വേപ്പിൻ പിണ്ണാക്ക്',
    pa: 'ਨਿੰਮ ਦੀ ਖਲ',
    or: 'ନିମ ପିଡ଼ିଆ',
  },
};

export function translateFertilizerName(fert: string, lang: LanguageCode = 'en'): string {
  if (!fert) return '';
  if (lang === 'en') return fert;
  const fLower = fert.toLowerCase();
  for (const [k, v] of Object.entries(FERTILIZER_NAMES_TRANSLATIONS)) {
    if (fLower.includes(k)) {
      return v[lang] || v['hi'] || fert;
    }
  }
  return fert;
}

/**
 * 7. Market Trends & Demand Multilingual
 */
export const MARKET_TREND_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, string>>> = {
  'Bullish': {
    en: 'Bullish (Upward)',
    hi: 'तेजी (बढ़त की ओर)',
    mr: 'तेजी (वाढीचा कल)',
    bn: 'ঊর্ধ্বমুখী (তেজি)',
    te: 'ధరల పెరుగుదల (బుల్లిష్)',
    ta: 'விலை ஏற்றம் (வளர்ச்சி)',
    gu: 'તેજી (વધારા તરફ)',
    kn: 'ಏರಿಕೆಯ ಪ್ರವೃತ್ತಿ',
    ml: 'വിലക്കയറ്റം',
    pa: 'ਤੇਜ਼ੀ (ਵਧਦਾ ਰੁਝਾਨ)',
    or: 'ମୂଲ୍ୟ ବୃଦ୍ଧି',
  },
  'Bearish': {
    en: 'Bearish (Downward)',
    hi: 'मंदी (गिरावट की ओर)',
    mr: 'मंदी (घसरणीचा कल)',
    bn: 'নিম্নমুখী (মন্দা)',
    te: 'ధరల తగ్గుదల (బేరిష్)',
    ta: 'விலை சரிவு',
    gu: 'મંદી (ઘટાડા તરફ)',
    kn: 'ಇಳಿಕೆಯ ಪ್ರವೃತ್ತಿ',
    ml: 'വിലക്കുറവ്',
    pa: 'ਮੰਦੀ (ਘਟਦਾ ਰੁਝਾਨ)',
    or: 'ମୂଲ୍ୟ ହ୍ରାସ',
  },
  'Stable': {
    en: 'Stable',
    hi: 'स्थिर',
    mr: 'स्थिर',
    bn: 'স্থিতিশীল',
    te: 'స్థిరమైన',
    ta: 'நிலையானது',
    gu: 'સ્થિર',
    kn: 'ಸ್ಥಿರ',
    ml: 'സ്ഥിരതയുള്ള',
    pa: 'ਸਥਿਰ',
    or: 'ସ୍ଥିର',
  },
  'High Demand': {
    en: 'High Demand',
    hi: 'उच्च मांग',
    mr: 'उच्च मागणी',
    bn: 'উচ্চ চাহিদা',
    te: 'అధిక డిమాండ్',
    ta: 'அதிக தேவை',
    gu: 'વધારે માંગ',
    kn: 'ಹೆಚ್ಚಿನ ಬೇಡಿಕೆ',
    ml: 'ഉയർന്ന ആവശ്യം',
    pa: 'ਵੱਡੀ ਮੰਗ',
    or: 'ଅଧିକ ଚାହିଦା',
  },
  'Moderate Demand': {
    en: 'Moderate Demand',
    hi: 'मध्यम मांग',
    mr: 'मध्यम मागणी',
    bn: 'মাঝারি চাহিদা',
    te: 'మధ్యస్థ డిమాండ్',
    ta: 'மிதமான தேவை',
    gu: 'મધ્યમ માંગ',
    kn: 'ಮಧ್ಯಮ ಬೇಡಿಕೆ',
    ml: 'മിതമായ ആവശ്യം',
    pa: 'ਦਰਮਿਆਨੀ ਮੰਗ',
    or: 'ମଧ୍ୟମ ଚାହିଦା',
  },
};

export function translateMarketTrend(trend: string, lang: LanguageCode = 'en'): string {
  if (!trend) return '';
  if (lang === 'en') return trend;
  const tLower = trend.toLowerCase();
  for (const [k, v] of Object.entries(MARKET_TREND_TRANSLATIONS)) {
    if (tLower.includes(k.toLowerCase())) {
      return v[lang] || v['hi'] || trend;
    }
  }
  return trend;
}

/**
 * 8. Scenario Simulator Multilingual Helper
 * e.g. "Compare Crop A vs Crop B" -> "पीक A आणि पीक B ची तुलना करा" (mr), "फसल A बनाम फसल B की तुलना करें" (hi)
 */
export function getScenarioComparisonTitle(cropA: string, cropB: string, lang: LanguageCode = 'en'): string {
  const cA = translateCropName(cropA, lang);
  const cB = translateCropName(cropB, lang);

  switch (lang) {
    case 'hi':
      return `${cA} बनाम ${cB} की तुलना करें`;
    case 'mr':
      return `${cA} आणि ${cB} ची तुलना करा`;
    case 'bn':
      return `${cA} বনাম ${cB} তুলনা করুন`;
    case 'te':
      return `${cA} వర్సెస్ ${cB} పోల్చండి`;
    case 'ta':
      return `${cA} மற்றும் ${cB} ஒப்பிடுக`;
    case 'gu':
      return `${cA} વિરુદ્ધ ${cB} સરખામણી કરો`;
    case 'kn':
      return `${cA} ಮತ್ತು ${cB} ಹೋಲಿಕೆ ಮಾಡಿ`;
    case 'ml':
      return `${cA}, ${cB} താരതമ്യം ചെയ്യുക`;
    case 'pa':
      return `${cA} ਬਨਾਮ ${cB} ਦੀ ਤੁਲਨਾ ਕਰੋ`;
    case 'or':
      return `${cA} ଏବଂ ${cB} ର ତୁଳନା କରନ୍ତୁ`;
    case 'as':
      return `${cA} বনাম ${cB} তুলনা কৰক`;
    case 'ur':
      return `${cA} اور ${cB} کا موازنہ کریں`;
    default:
      return `Compare ${cropA} vs ${cropB}`;
  }
}

/**
 * 9. Personalized Strategy Phase Translations
 */
export const STRATEGY_PHASES_TRANSLATIONS: Record<number, Partial<Record<LanguageCode, { name: string; timing: string; objective: string }>>> = {
  1: {
    en: {
      name: 'Phase 1: Pre-Sowing & Soil Conditioning',
      timing: 'Weeks -3 to 0 (Pre-Planting)',
      objective: 'Recondition soil structure, correct chemical imbalances, and build base nutrient reservoir.',
    },
    hi: {
      name: 'चरण 1: बुवाई पूर्व एवं मृदा सुधार',
      timing: 'बुवाई से 3 सप्ताह पहले (सप्ताह -3 से 0)',
      objective: 'मिट्टी की संरचना सुधारें, पोषक तत्वों की कमी पूरी करें और खेत तैयार करें।',
    },
    mr: {
      name: 'टप्पा 1: पेरणीपूर्व मशागत आणि जमीन सुधारणा',
      timing: 'पेरणीपूर्वी ३ आठवडे (आठवडा -३ ते ०)',
      objective: 'जमिनीचा पोत सुधारा, सेंद्रिय खतांचा वापर करा आणि मुख्य पोषक तत्वांचा साठा तयार करा.',
    },
    bn: {
      name: 'পর্যায় ১: বপন পূর্ববর্তী জমি প্রস্তুতি ও মাটি শোধন',
      timing: 'বপনের ৩ সপ্তাহ আগে',
      objective: 'মাটির গঠন উন্নত করুন, পুষ্টির ঘাটতি পূরণ করুন এবং জমি প্রস্তুত করুন।',
    },
    te: {
      name: 'దశ 1: విత్తే ముందు భూమి తయారీ మరియు నేల సంరక్షణ',
      timing: 'విత్తడానికి 3 వారాల ముందు',
      objective: 'నేల సారాన్ని మెరుగుపరచండి, ఎరువులు వేసి భూమిని సిద్ధం చేయండి.',
    },
    ta: {
      name: 'படி 1: விதைப்புக்கு முன் நிலம் தயாரித்தல் & மண் சீரமைப்பு',
      timing: 'விதைப்புக்கு 3 வாரங்களுக்கு முன்',
      objective: 'மண் வளத்தை மேம்படுத்தி, ஊட்டச்சத்துக்களைச் சேர்த்து நிலத்தைத் தயார் செய்யவும்.',
    },
    gu: {
      name: 'તબક્કો 1: વાવણી પહેલાં ખેડ અને જમીન સુધારણા',
      timing: 'વાવણી પહેલાં 3 અઠવાડિયા',
      objective: 'જમીનનું બંધારણ સુધારો અને પાયાના ખાતર ઉમેરી ખેતર તૈયાર કરો.',
    },
    kn: {
      name: 'ಹಂತ 1: ಬಿತ್ತನೆ ಪೂರ್ವ ಭೂಮಿ ಸಿದ್ಧತೆ ಮತ್ತು ಮಣ್ಣು ಸುಧಾರಣೆ',
      timing: 'ಬಿತ್ತನೆಗೆ 3 ವಾರಗಳ ಮೊದಲು',
      objective: 'ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸಿ, ಸಾವಯವ ಗೊಬ್ಬರ ಸೇರಿಸಿ ಭೂಮಿ ಸಿದ್ಧಪಡಿಸಿ.',
    },
  },
  2: {
    en: {
      name: 'Phase 2: Sowing, Seed Treatment & Emergence',
      timing: 'Weeks 0 to 3 (Germination)',
      objective: 'Ensure maximum seed germination, uniform plant stand, and early seedling vigor.',
    },
    hi: {
      name: 'चरण 2: बीज उपचार, बुवाई एवं अंकुरण',
      timing: 'सप्ताह 0 से 3 (अंकुरण काल)',
      objective: 'स्वस्थ अंकुरण सुनिश्चित करें, सही दूरी पर बुवाई करें और पौधों को रोगों से बचाएं।',
    },
    mr: {
      name: 'टप्पा 2: बीजप्रक्रिया, पेरणी आणि उगवण',
      timing: 'आठवडा ० ते ३ (उगवण काळ)',
      objective: 'बीजप्रक्रिया करून योग्य खोलीवर पेरणी करा, एकसमान उगवण आणि रोपांचे संरक्षण करा.',
    },
    bn: {
      name: 'পর্যায় ২: বীজ শোধন, বপন ও অঙ্কুরোদগম',
      timing: 'সপ্তাহ ০ থেকে ৩',
      objective: 'সর্বোচ্চ অঙ্কুরোদগম নিশ্চিত করুন এবং চারা সুস্থ রাখুন।',
    },
    te: {
      name: 'దశ 2: విత్తన శుద్ధి, విత్తడం మరియు మొలకెత్తడం',
      timing: '0 నుండి 3 వారాలు',
      objective: 'విత్తన శుద్ధి చేసి సరైన రీతిలో విత్తండి, మంచి మొలకలు సాధించండి.',
    },
    ta: {
      name: 'படி 2: விதை நேர்த்தி, விதைப்பு மற்றும் முளைப்பு',
      timing: 'வாரம் 0 முதல் 3',
      objective: 'விதை நேர்த்தி செய்து சமச்சீரான முளைப்பை உறுதி செய்யவும்.',
    },
  },
  3: {
    en: {
      name: 'Phase 3: Vegetative Growth & Canopy Management',
      timing: 'Weeks 4 to 8 (Vegetative Growth)',
      objective: 'Drive vigorous tillering/branching, optimize nitrogen top-dressing, and suppress early weeds.',
    },
    hi: {
      name: 'चरण 3: वानस्पतिक वृद्धि एवं पोषण प्रबंधन',
      timing: 'सप्ताह 4 से 8 (बढ़वार काल)',
      objective: 'पौधों की अच्छी बढ़वार के लिए यूरिया की टॉप ड्रेसिंग करें और खरपतवार निकालें।',
    },
    mr: {
      name: 'टप्पा 3: शाकीय वाढ आणि पोषण व्यवस्थापन',
      timing: 'आठवडा ४ ते ८ (वाढीचा काळ)',
      objective: 'रोपांच्या जोरदार वाढीसाठी नत्राचा हप्ता द्या, खुरपणी करा आणि कीड नियंत्रण ठेवा.',
    },
    bn: {
      name: 'পর্যায় ৩: উদ্ভিজ্জ বৃদ্ধি ও পুষ্টি ব্যবস্থাপনা',
      timing: 'সপ্তাহ ৪ থেকে ৮',
      objective: 'গাছের বৃদ্ধির জন্য সার প্রয়োগ এবং আগাছা পরিষ্কার করুন।',
    },
    te: {
      name: 'దశ 3: పైరు పెరుగుదల మరియు పోషక నిర్వహణ',
      timing: '4 నుండి 8 వారాలు',
      objective: 'పైపాటుగా ఎరువులు వేసి కలుపు తీయండి, సమృద్ధిగా నీరు అందించండి.',
    },
    ta: {
      name: 'படி 3: பயிர் வளர்ச்சி மற்றும் ஊட்டச்சத்து மேலாண்மை',
      timing: 'வாரம் 4 முதல் 8',
      objective: 'மேலுரம் இட்டு களைகளை அகற்றி பயிர் வளர்ச்சியைத் தூண்டவும்.',
    },
  },
  4: {
    en: {
      name: 'Phase 4: Flowering, Pod/Grain Formation',
      timing: 'Weeks 9 to 14 (Reproductive Stage)',
      objective: 'Protect blossoms, optimize grain filling, and apply critical moisture irrigation.',
    },
    hi: {
      name: 'चरण 4: फूल आना एवं दाना भराव अवस्था',
      timing: 'सप्ताह 9 से 14 (प्रजनन काल)',
      objective: 'फूलों व फलियों की रक्षा करें, आवश्यक सिंचाई करें और बोरॉन व पोटाश का छिड़काव करें।',
    },
    mr: {
      name: 'टप्पा 4: फुलोरा आणि दाणे भरण्याची अवस्था',
      timing: 'आठवडा ९ ते १४ (उत्पादन अवस्था)',
      objective: 'फुलोरा गळू नये म्हणून काळजी घ्या, पाण्याचे योग्य नियोजन ठेवा आणि दाणे टपोरे करा.',
    },
    bn: {
      name: 'পর্যায় ৪: ফুল ও দানা গঠন পর্যায়',
      timing: 'সप्ताह ৯ থেকে ১৪',
      objective: 'ফুল ও দানার সুরক্ষা নিশ্চিত করুন, সময়মতো সেচ দিন।',
    },
    te: {
      name: 'దశ 4: పూత మరియు గింజ పాలు పోసుకునే దశ',
      timing: '9 నుండి 14 వారాలు',
      objective: 'పూత రాలకుండా రక్షించండి, అవసరమైన సమయంలో నీటి తడులు ఇవ్వండి.',
    },
    ta: {
      name: 'படி 4: பூக்கும் மற்றும் தானியம் உருவாகும் நிலை',
      timing: 'வாரம் 9 முதல் 14',
      objective: 'பூக்கள் உதிர்வதைத் தடுத்து, தானியங்கள் திரட்சியாக வளர உதவவும்.',
    },
  },
  5: {
    en: {
      name: 'Phase 5: Physiological Maturity & Harvest',
      timing: 'Weeks 15 to 18 (Harvest & Storage)',
      objective: 'Harvest at optimal moisture (12-14%), minimize threshing loss, and achieve top mandi price.',
    },
    hi: {
      name: 'चरण 5: फसल की कटाई, गहाई एवं भंडारण',
      timing: 'सप्ताह 15 से 18 (कटाई काल)',
      objective: 'सही नमी पर कटाई करें, दाने साफ करें और सर्वोत्तम मंडी भाव प्राप्त करें।',
    },
    mr: {
      name: 'टप्पा 5: पिकाची काढणी, मळणी आणि साठवणूक',
      timing: 'आठवडा १५ ते १८ (काढणीचा काळ)',
      objective: 'योग्य ओलावा असताना पिकाची काढणी करा, दाणे सुकवून बाजारात उत्तम भाव मिळवा.',
    },
    bn: {
      name: 'পর্যায় ৫: ফসল কাটা, মাড়াই ও সংরক্ষণ',
      timing: 'সপ্তাহ ১৫ থেকে ১৮',
      objective: 'সঠিক আর্দ্রতায় ফসল কাটুন এবং ভালো দামে বিক্রি করুন।',
    },
    te: {
      name: 'దశ 5: కోత, నూర్పిడి మరియు నిల్వ',
      timing: '15 నుండి 18 వారాలు',
      objective: 'సరిగ్గా పక్వానికి వచ్చినప్పుడు కోసి మంచి ధరకు మార్కెట్లో అమ్మండి.',
    },
    ta: {
      name: 'படி 5: அறுவடை மற்றும் சந்தைப்படுத்தல்',
      timing: 'வாரம் 15 முதல் 18',
      objective: 'சரியான ஈரப்பதத்தில் அறுவடை செய்து அதிக விலைக்கு விற்கவும்.',
    },
  },
};

export function translateStrategyPhase(phaseInput: number | string, lang: LanguageCode = 'en'): string {
  if (!phaseInput && phaseInput !== 0) return '';
  if (typeof phaseInput === 'number') {
    const phase = STRATEGY_PHASES_TRANSLATIONS[phaseInput];
    if (!phase) return `Phase ${phaseInput}`;
    const obj = phase[lang] || phase['hi'] || phase['en'];
    return obj ? obj.name : `Phase ${phaseInput}`;
  }

  if (lang === 'en') return phaseInput;
  const lower = phaseInput.toLowerCase();

  if (lower.includes('pre-sowing') || lower.includes('soil prep') || lower.includes('preparation')) {
    if (lang === 'mr') return 'पेरणीपूर्व तयारी आणि माती सुपीकता';
    if (lang === 'hi') return 'बुवाई पूर्व तैयारी एवं भूमि उपचार';
    if (lang === 'bn') return 'বপন পূর্ব প্রস্তুতি ও জমি তৈরি';
    if (lang === 'te') return 'విత్తే ముందు భూమి తయారీ';
    if (lang === 'ta') return 'விதைப்புக்கு முந்தைய நில தயாரிப்பு';
    if (lang === 'gu') return 'વાવણી પહેલાં જમીનની તૈયારી';
    if (lang === 'kn') return 'ಬಿತ್ತನೆ ಪೂರ್ವ ಭೂಮಿ ಸಿದ್ಧತೆ';
    if (lang === 'pa') return 'ਬਿਜਾਈ ਤੋਂ ਪਹਿਲਾਂ ਜ਼ਮੀਨ ਦੀ ਤਿਆਰੀ';
    return phaseInput;
  }
  if (lower.includes('sowing') || lower.includes('seedling') || lower.includes('basal') || lower.includes('transplant')) {
    if (lang === 'mr') return 'पेरणी, बीजप्रक्रिया आणि बेसल खत';
    if (lang === 'hi') return 'बुवाई, बीज उपचार एवं बेसल खाद';
    if (lang === 'bn') return 'বীজ বপন ও প্রাথমিক সার প্রয়োগ';
    if (lang === 'te') return 'విత్తనం విత్తుట మరియు ప్రాథమిక ఎరువు';
    if (lang === 'ta') return 'விதைப்பு மற்றும் அடி உரமிடுதல்';
    if (lang === 'gu') return 'વાવણી, બીજ માવજત અને ખાતર';
    if (lang === 'kn') return 'ಬಿತ್ತನೆ, ಬೀಜೋಪಚಾರ ಮತ್ತು ಗೊಬ್ಬರ';
    if (lang === 'pa') return 'ਬਿਜਾਈ, ਬੀਜ ਸੋਧ ਅਤੇ ਮੁੱਢਲੀ ਖਾਦ';
    return phaseInput;
  }
  if (lower.includes('vegetative') || lower.includes('tillering') || lower.includes('growth')) {
    if (lang === 'mr') return 'शाकीय वाढ आणि फुटवे फुटण्याचा काळ';
    if (lang === 'hi') return 'वानस्पतिक वृद्धि एवं कल्ले फूटने की अवस्था';
    if (lang === 'bn') return 'গাছের বাড়বৃদ্ধি ও কুশি পর্যায়';
    if (lang === 'te') return 'మొక్కల పెరుగుదల మరియు పిలకల దశ';
    if (lang === 'ta') return 'வளர்ச்சி பருவம் மற்றும் தூர் கட்டும் நிலை';
    if (lang === 'gu') return 'વાનસ્પતિક વૃદ્ધિ તબક્કો';
    if (lang === 'kn') return 'ಸಸ್ಯದ ಬೆಳವಣಿಗೆಯ ಹಂತ';
    if (lang === 'pa') return 'ਬੂਟੇ ਦੇ ਵਾਧੇ ਦਾ ਸਮਾਂ';
    return phaseInput;
  }
  if (lower.includes('flowering') || lower.includes('grain filling') || lower.includes('pod') || lower.includes('milking')) {
    if (lang === 'mr') return 'फुलधारणा आणि दाणे भरण्याचा टप्पा';
    if (lang === 'hi') return 'फूल आने एवं दाना भराव की अवस्था';
    if (lang === 'bn') return 'फूल ও দানার বৃদ্ধি পর্যায়';
    if (lang === 'te') return 'పూత మరియు గింజ పాలు పోసుకునే దశ';
    if (lang === 'ta') return 'பூக்கும் மற்றும் தானியம் உருவாகும் நிலை';
    if (lang === 'gu') return 'ફૂલ અને દાણા બેસવાનો તબક્કો';
    if (lang === 'kn') return 'ಹೂವಾಡುವಿಕೆ ಮತ್ತು ಕಾಳು ಕಟ್ಟುವ ಹಂತ';
    if (lang === 'pa') return 'ਫੁੱਲ ਪੈਣ ਅਤੇ ਦਾਣੇ ਪੈਣ ਦੀ ਅਵਸਥਾ';
    return phaseInput;
  }
  if (lower.includes('harvest') || lower.includes('maturity') || lower.includes('storage')) {
    if (lang === 'mr') return 'काढणी, मळणी आणि बाजारात विक्री';
    if (lang === 'hi') return 'कटाई, गहाई एवं उपज विपणन';
    if (lang === 'bn') return 'ফসল কাটা ও বাজারজাতকরণ';
    if (lang === 'te') return 'కోత మరియు మార్కెటింగ్';
    if (lang === 'ta') return 'அறுவடை மற்றும் சந்தைப்படுத்தல்';
    if (lang === 'gu') return 'કાપણી, મણણી અને વેચાણ';
    if (lang === 'kn') return 'ಕೊಯ್ಲು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಮಾರಾಟ';
    if (lang === 'pa') return 'ਕਟਾਈ, ਗਹਾਈ ਅਤੇ ਮੰਡੀਕਰਨ';
    return phaseInput;
  }

  const match = phaseInput.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    const p = STRATEGY_PHASES_TRANSLATIONS[num];
    if (p) {
      const obj = p[lang] || p['hi'] || p['en'];
      if (obj) return obj.name;
    }
  }

  return phaseInput;
}

/**
 * 10. Cost & Profit Estimation Translations
 */
export const COST_PROFIT_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, string>>> = {
  seedCost: {
    en: 'Seed Cost',
    hi: 'बीज लागत',
    mr: 'बियाणे खर्च',
    bn: 'বীজ খরচ',
    te: 'విత్తన ఖర్చు',
    ta: 'விதை செலவு',
    gu: 'બિયારણ ખર્ચ',
    kn: 'ಬೀಜದ ವೆಚ್ಚ',
    pa: 'ਬੀਜ ਦਾ ਖ਼ਰਚ',
  },
  fertilizerCost: {
    en: 'Fertilizer Cost',
    hi: 'उर्वरक / खाद लागत',
    mr: 'खतांचा खर्च',
    bn: 'সার খরচ',
    te: 'ఎరువుల ఖర్చు',
    ta: 'உரச் செலவு',
    gu: 'ખાતર ખર્ચ',
    kn: 'ರಸಗೊಬ್ಬರ ವೆಚ್ಚ',
    pa: 'ਖਾਦ ਦਾ ਖ਼ਰਚ',
  },
  pesticideCost: {
    en: 'Pesticide & Crop Protection',
    hi: 'कीटनाशक एवं फसल सुरक्षा',
    mr: 'कीटकनाशके व पीक संरक्षण',
    bn: 'কীটনাশক ও ফসল সুরক্ষা',
    te: 'పురుగుమందుల ఖర్చు',
    ta: 'பூச்சிக்கொல்லி செலவு',
    gu: 'જંતુનાશક દવાઓનો ખર્ચ',
    kn: 'ಕೀಟನಾಶಕ ವೆಚ್ಚ',
    pa: 'ਕੀਟਨਾਸ਼ਕ ਖ਼ਰਚ',
  },
  labourCost: {
    en: 'Labour Cost',
    hi: 'मजदूरी / श्रम लागत',
    mr: 'मजुरी खर्च',
    bn: 'শ্রমিক খরচ',
    te: 'కూలీ ఖర్చు',
    ta: 'வேலை ஆள் கூலி',
    gu: 'મજૂરી ખર્ચ',
    kn: 'ಕೂಲಿ ವೆಚ್ಚ',
    pa: 'ਮਜ਼ਦੂਰੀ ਖ਼ਰਚ',
  },
  machineryCost: {
    en: 'Machinery & Fuel',
    hi: 'यंत्र व ईंधन खर्च',
    mr: 'यंत्रसामग्री व डिझेल खर्च',
    bn: 'যন্ত্রপাতি ও জ্বালানি',
    te: 'యంత్రాల మరియు డీజిల్ ఖర్చు',
    ta: 'இயந்திர வாடகை & எரிபொருள்',
    gu: 'ટ્રેક્ટર અને યાંત્રિક ખર્ચ',
    kn: 'ಯಂತ್ರೋಪಕರಣ ವೆಚ್ಚ',
    pa: 'ਮਸ਼ੀਨਰੀ ਤੇ ਤੇਲ ਦਾ ਖ਼ਰਚ',
  },
  otherExpenses: {
    en: 'Irrigation & Other Expenses',
    hi: 'सिंचाई एवं अन्य व्यय',
    mr: 'पाणी व इतर संकीर्ण खर्च',
    bn: 'সেচ ও অন্যান্য খরচ',
    te: 'నీటిపారుదల మరియు ఇతర ఖర్చులు',
    ta: 'பாசனம் மற்றும் இதர செலவுகள்',
    gu: 'પિયત અને અન્ય પરચુરણ ખર્ચ',
    kn: 'ನೀರಾವರಿ ಮತ್ತು ಇತರೆ ವೆಚ್ಚ',
    pa: 'ਸਿੰਚਾਈ ਅਤੇ ਹੋਰ ਖ਼ਰਚੇ',
  },
  totalCost: {
    en: 'Total Cultivation Cost',
    hi: 'कुल उत्पादन लागत',
    mr: 'एकूण उत्पादन खर्च',
    bn: 'মোট চাষের খরচ',
    te: 'మొత్తం సాగు ఖర్చు',
    ta: 'மொத்த சாகுபடி செலவு',
    gu: 'કુલ ઉત્પાદન ખર્ચ',
    kn: 'ಒಟ್ಟು ಬೇಸಾಯ ವೆಚ್ಚ',
    pa: 'ਕੁੱਲ ਕਾਸ਼ਤ ਖ਼ਰਚ',
  },
  expectedRevenue: {
    en: 'Expected Gross Revenue',
    hi: 'अपेक्षित सकल आय',
    mr: 'अपेक्षित एकूण उत्पन्न',
    bn: 'প্রত্যাশিত মোট আয়',
    te: 'ఆశించిన మొత్తం రాబడి',
    ta: 'எதிர்பார்க்கப்படும் மொத்த வருமானம்',
    gu: 'અપેક્ષિત કુલ આવક',
    kn: 'ನಿರೀಕ್ಷಿತ ಒಟ್ಟು ಆದಾಯ',
    pa: 'ਕੁੱਲ ਸੰਭਾਵਿਤ ਆਮਦਨ',
  },
  expectedProfit: {
    en: 'Estimated Net Profit',
    hi: 'अनुमानित शुद्ध लाभ',
    mr: 'अंदाजे निव्वळ नफा',
    bn: 'আনুমানিক নিট লাভ',
    te: 'నికర లాభం',
    ta: 'நிகர லாபம்',
    gu: 'અંદાજિત ચોખ્ખો નફો',
    kn: 'ಅಂದಾಜು ನಿವ್ವಳ ಲಾಭ',
    pa: 'ਅੰਦਾਜ਼ਨ ਸ਼ੁੱਧ ਮੁਨਾਫ਼ਾ',
  },
  profitMargin: {
    en: 'Return on Investment (ROI)',
    hi: 'निवेश पर प्रतिफल (ROI)',
    mr: 'गुंतवणुकीवरील परतावा (ROI)',
    bn: 'বিনিয়োগে লাভ (ROI)',
    te: 'పెట్టుబడిపై రాబడి (ROI)',
    ta: 'முதலீட்டின் மீதான லாபம் (ROI)',
    gu: 'રોકાણ પર નફો (ROI)',
    kn: 'ಹೂಡಿಕೆಯ ಮೇಲಿನ ಲಾಭಾಂಶ (ROI)',
    pa: 'ਮੁਨਾਫ਼ਾ ਦਰ (ROI)',
  },
};

export function translateCostProfitLabel(key: string, lang: LanguageCode = 'en'): string {
  const item = COST_PROFIT_TRANSLATIONS[key];
  if (!item) return key;
  return item[lang] || item['hi'] || item['en'] || key;
}

/**
 * 11. Market Analysis Translations
 */
export const MARKET_METRIC_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, string>>> = {
  currentPrice: {
    en: 'Current Market Price',
    hi: 'वर्तमान मंडी भाव',
    mr: 'सध्याचा बाजारभाव',
    bn: 'বর্তমান বাজার দর',
    te: 'ప్రస్తుత మార్కెట్ ధర',
    ta: 'தற்போதைய சந்தை விலை',
    gu: 'હાલનો બજાર ભાવ',
    kn: 'ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ',
    pa: 'ਮੌਜੂਦਾ ਮੰਡੀ ਭਾਅ',
  },
  historicalPrice: {
    en: 'Historical Price Trend',
    hi: 'ऐतिहासिक मूल्य रुझान',
    mr: 'ऐतिहासिक बाजारभाव कल',
    bn: 'ঐতিহাসিক বাজার দর',
    te: 'గత ధరల తీరు',
    ta: 'முந்தைய விலை போக்கு',
    gu: 'પાછલા વર્ષોનો ભાવ ટ્રેન્ડ',
    kn: 'ಹಿಂದಿನ ಬೆಲೆ ಪ್ರವೃತ್ತಿ',
    pa: 'ਪਿਛਲੇ ਸਾਲਾਂ ਦਾ ਭਾਅ',
  },
  demand: {
    en: 'Market Demand Level',
    hi: 'बाजार मांग स्तर',
    mr: 'बाजारातील मागणी पातळी',
    bn: 'বাজারের চাহিদা স্তর',
    te: 'మార్కెట్ డిమాండ్ స్థాయి',
    ta: 'சந்தை தேவை நிலை',
    gu: 'બજારમાં માંગનું પ્રમાણ',
    kn: 'ಮಾರುಕಟ್ಟೆ ಬೇಡಿಕೆ ಮಟ್ಟ',
    pa: 'ਮੰਡੀ ਦੀ ਮੰਗ',
  },
  expectedPrice: {
    en: 'Projected Peak Price',
    hi: 'अनुमानित आगामी भाव',
    mr: 'अपेक्षित उच्चांकी भाव',
    bn: 'প্রত্যাশিত সর্বোচ্চ দর',
    te: 'అంచనా వేసిన గరిష్ట ధర',
    ta: 'எதிர்பார்க்கப்படும் உச்ச விலை',
    gu: 'સંભવિત સર્વોચ્ચ ભાવ',
    kn: 'ನಿರೀಕ್ಷಿತ ಗರಿಷ್ಠ ಬೆಲೆ',
    pa: 'ਸੰਭਾਵੀ ਵੱਧ ਤੋਂ ਵੱਧ ਭਾਅ',
  },
  marketComparison: {
    en: 'Nearby APMC Mandi Comparison',
    hi: 'आसपास की कृषि उपज मंडियों की तुलना',
    mr: 'जवळपासच्या कृषी उत्पन्न बाजार समित्यांची तुलना',
    bn: 'নিকটবর্তী মান্ডি সমূহের তুলনা',
    te: 'సమీప మార్కెట్ యార్డుల పోలిక',
    ta: 'அருகிலுள்ள ஒழுங்குமுறை விற்பனைக் கூடங்கள் ஒப்பீடு',
    gu: 'નજીકના APMC માર્કેટ યાર્ડની સરખામણી',
    kn: 'ಹತ್ತಿರದ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆಗಳ ಹೋಲಿಕೆ',
    pa: 'ਨੇੜਲੀਆਂ ਮੰਡੀਆਂ ਦੀ ਤੁਲਨਾ',
  },
};

export function translateMarketMetric(key: string, lang: LanguageCode = 'en'): string {
  const item = MARKET_METRIC_TRANSLATIONS[key];
  if (!item) return key;
  return item[lang] || item['hi'] || item['en'] || key;
}

/**
 * 12. Yield Prediction Labels & Driver Translations
 */
export const YIELD_METRIC_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, string>>> = {
  predictedYield: {
    en: 'Predicted Yield',
    hi: 'अनुमानित उपज',
    mr: 'अपेक्षित उत्पादन',
    bn: 'আনুমানিক ফলন',
    te: 'అంచనా వేసిన దిగుబడి',
    ta: 'எதிர்பார்க்கப்படும் மகசூல்',
    gu: 'અંદાજિત ઉત્પાદન',
    kn: 'ನಿರೀಕ್ಷಿತ ಇಳುವರಿ',
    pa: 'ਸੰਭਾਵਿਤ ਝਾੜ',
  },
  confidenceScore: {
    en: 'Model Confidence Score',
    hi: 'मॉडल विश्वसनीयता स्तर',
    mr: 'अंदाज अचूकता खात्री',
    bn: 'মডেলের নির্ভুলতা স্তর',
    te: 'మోడల్ ఖచ్చితత్వం',
    ta: 'மாதிரி நம்பகத்தன்மை',
    gu: 'અંદાજ વિશ્વસનીયતા',
    kn: 'ಮಾದರಿಯ ನಿಖರತೆಯ ಶೇಕಡಾವಾರು',
    pa: 'ਸਹੀ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ',
  },
  soilHealthFactor: {
    en: 'Soil Fertility & Mineral Support',
    hi: 'मृदा उर्वरता एवं पोषक तत्व प्रभाव',
    mr: 'जमिनीची सुपीकता व पोषण घटक प्रभाव',
    bn: 'মাটির উর্বরতা ও পুষ্টি প্রভাব',
    te: 'నేల సారవంతం మరియు పోషకాల ప్రభావం',
    ta: 'மண் வளம் மற்றும் ஊட்டச்சத்து தாக்கம்',
    gu: 'જમીનની ફળદ્રુપતા અને પોષક તત્વો',
    kn: 'ಮಣ್ಣಿನ ಫಲವತ್ತತೆಯ ಪ್ರಭಾವ',
    pa: 'ਜ਼ਮੀਨ ਦੀ ਉਪਜਾਊ ਸ਼ਕਤੀ ਦਾ ਪ੍ਰਭਾਵ',
  },
  weatherFactor: {
    en: 'Agro-Climatic & Weather Pattern',
    hi: 'जलवायु एवं मौसमी अनुकूलता',
    mr: 'हवामान व पर्जन्यमान अनुकूलता',
    bn: 'আবহাওয়া ও জলবায়ুর প্রভাব',
    te: 'వాతావరణ అనుకూలత',
    ta: 'வானிலை மற்றும் பருவமழை தாக்கம்',
    gu: 'હવામાન અને ઋતુ અનુકૂળતા',
    kn: 'ಹವಾಮಾನದ ಅನುಕೂಲತೆ',
    pa: 'ਮੌਸਮ ਦੀ ਅਨੁਕੂਲਤਾ',
  },
  fertilizerFactor: {
    en: 'Balanced Fertilizer Uplift',
    hi: 'संतुलित खाद का सकारात्मक प्रभाव',
    mr: 'संतुलित खत नियोजनाचा फायदा',
    bn: 'সুষম সার প্রয়োগের সুবিধা',
    te: 'సమతుల్య ఎరువుల పెరుగుదల',
    ta: 'சீரான உரமிடுதலின் மகசூல் உயர்வு',
    gu: 'સંતુલિત ખાતર વ્યવસ્થાપનનો લાભ',
    kn: 'ಸಮತೋಲಿತ ಗೊಬ್ಬರದ ಲಾಭಾಂಶ',
    pa: 'ਸੰਤੁਲਿਤ ਖਾਦਾਂ ਦਾ ਵਾਧਾ',
  },
  irrigationFactor: {
    en: 'Irrigation & Moisture Assurance',
    hi: 'सिंचाई एवं नमी की उपलब्धता',
    mr: 'पाणी पुरवठा व ओलावा सुरक्षितता',
    bn: 'সেচ ও পর্যাপ্ত আর্দ্রতা',
    te: 'నీటి లభ్యత మరియు తేమ రక్షణ',
    ta: 'நீர்ப்பாசனம் மற்றும் ஈரப்பதம் உறுதி',
    gu: 'પિયત સુવિધા અને ભેજ સાચવણી',
    kn: 'ನೀರಾವರಿ ಲಭ್ಯತೆಯ ಭರವಸೆ',
    pa: 'ਸਿੰਚਾਈ ਅਤੇ ਨਮੀ ਦੀ ਸਹੂਲਤ',
  },
  comparisonWithPrevious: {
    en: 'Comparison with Previous Harvest',
    hi: 'पिछली फसल से तुलना',
    mr: 'मागील उत्पादनाशी तुलना',
    bn: 'পূর্ববর্তী ফসলের সাথে তুলনা',
    te: 'మునుపటి పంటతో పోలిక',
    ta: 'முந்தைய அறுவடையுடன் ஒப்பீடு',
    gu: 'પાછલી ઉપજ સાથે સરખામણી',
    kn: 'ಹಿಂದಿನ ಬೆಳೆಯೊಂದಿಗೆ ಹೋಲಿಕೆ',
    pa: 'ਪਿਛਲੇ ਸਾਲ ਦੇ ਝਾੜ ਨਾਲ ਤੁਲਨਾ',
  },
};

export function translateYieldMetric(key: string, lang: LanguageCode = 'en'): string {
  const item = YIELD_METRIC_TRANSLATIONS[key];
  if (!item) return key;
  return item[lang] || item['hi'] || item['en'] || key;
}

/**
 * 13. Dynamic Soil Diagnostic and AI Explanations
 * RULE: All numerical values (kg/ha, ppm, %, etc.) are strictly preserved.
 */
export function getSoilConditionSummary(
  params: { n: number; p: number; k: number; ph: number; oc: number; score: number },
  lang: LanguageCode = 'en'
): string {
  const { n, p, k, ph, oc, score } = params;

  switch (lang) {
    case 'mr':
      return `माती परीक्षणानुसार उपलब्ध नत्र (N) ${n} kg/ha, स्फुरद (P) ${p} kg/ha, पालाश (K) ${k} kg/ha असून सामू (pH) ${ph} आणि सेंद्रिय कर्ब ${oc}% आहे. सुपीकता निर्देशांक: ${score}/100.`;
    case 'hi':
      return `मृदा परीक्षण के अनुसार उपलब्ध नाइट्रोजन (N) ${n} kg/ha, फास्फोरस (P) ${p} kg/ha, पोटाश (K) ${k} kg/ha तथा pH ${ph} और जैविक कार्बन ${oc}% है। उर्वरता स्कोर: ${score}/100।`;
    case 'bn':
      return `মাটি পরীক্ষার রিপোর্ট অনুযায়ী উপলব্ধ নাইট্রোজেন (N) ${n} kg/ha, ফসফরাস (P) ${p} kg/ha, পটাশিয়াম (K) ${k} kg/ha এবং pH ${ph} ও জৈব কার্বন ${oc}%। উর্বরতা স্কোর: ${score}/100।`;
    case 'te':
      return `మట్టి పరీక్ష నివేదిక ప్రకారం నత్రజని (N) ${n} kg/ha, భాస్వరం (P) ${p} kg/ha, పొటాషియం (K) ${k} kg/ha మరియు pH ${ph}, సేంద్రీయ కార్బన్ ${oc}%. సారవంతమైన స్కోరు: ${score}/100.`;
    case 'ta':
      return `மண் பரிசோதனை முடிவின்படி தழைச்சத்து (N) ${n} kg/ha, மணிச்சத்து (P) ${p} kg/ha, சாம்பல்சத்து (K) ${k} kg/ha மற்றும் pH ${ph}, கரிமக் கரிமம் ${oc}%. மண் வள குறியீடு: ${score}/100.`;
    case 'gu':
      return `જમીન ચકાસણી મુજબ ઉપલબ્ધ નાઇટ્રોજન (N) ${n} kg/ha, ફોસ્ફરસ (P) ${p} kg/ha, પોટાશ (K) ${k} kg/ha તેમજ pH ${ph} અને સેન્દ્રિય કાર્બન ${oc}% છે. ફળદ્રુપતા સ્કોર: ${score}/100.`;
    case 'kn':
      return `ಮಣ್ಣು ಪರೀಕ್ಷೆಯ ವರದಿಯಂತೆ ಲಭ್ಯವಿರುವ ಸಾರಜನಕ (N) ${n} kg/ha, ರಂಜಕ (P) ${p} kg/ha, ಪೊಟ್ಯಾಶ್ (K) ${k} kg/ha ಹಾಗೂ pH ${ph} ಮತ್ತು ಸಾವಯವ ಇಂಗಾಲ ${oc}%. ಫಲವತ್ತತೆ ಸ್ಕೋರ್: ${score}/100.`;
    case 'pa':
      return `ਮਿੱਟੀ ਟੈਸਟ ਅਨੁਸਾਰ ਨਾਈਟ੍ਰੋਜਨ (N) ${n} kg/ha, ਫ਼ਾਸਫ਼ੋਰਸ (P) ${p} kg/ha, ਪੋਟਾਸ਼ (K) ${k} kg/ha ਅਤੇ pH ${ph} ਤੇ ਜੈਵਿਕ ਕਾਰਬਨ ${oc}% ਹੈ। ਉਪਜਾਊ ਸ਼ਕਤੀ ਸਕੋਰ: ${score}/100।`;
    default:
      return `Soil test analysis indicates available Nitrogen ${n} kg/ha, Phosphorus ${p} kg/ha, Potassium ${k} kg/ha, with pH ${ph} and Organic Carbon ${oc}%. Fertility vitality score: ${score}/100.`;
  }
}

/**
 * 14. Personalized Strategy AI Greeting Generator
 */
export function getStrategyAiGreeting(
  crop: string,
  n: number,
  ph: number,
  lang: LanguageCode = 'en'
): string {
  const cropTranslated = translateCropName(crop, lang);
  if (!Number.isFinite(n) || !Number.isFinite(ph)) {
    return `Your strategy for ${cropTranslated} is loaded. One or more soil measurements are unavailable, so they are not shown here. Ask about the actions in your plan or add a complete soil report.`;
  }
  switch (lang) {
    case 'mr':
      return `नमस्ते शेतकरी मित्र! मी तुमचा कृषीभूमी AI कृषी सल्लागार आहे. मी तुमच्या माती परीक्षण अहवालाचे (नत्र: ${n} kg/ha, सामू: ${ph}) विश्लेषण करून ${cropTranslated} पिकासाठी ही वैयक्तिक कार्ययोजना तयार केली आहे. खतांचे प्रमाण, पाणी व्यवस्थापन किंवा रोग नियंत्रणाबाबत काहीही विचारा!`;
    case 'hi':
      return `नमस्ते किसान साथी! मैं आपका कृषिभूमि AI कृषि विशेषज्ञ हूँ। मैंने आपकी मृदा जांच (नाइट्रोजन: ${n} kg/ha, pH: ${ph}) का अध्ययन करके ${cropTranslated} फसल के लिए यह विशेष कार्ययोजना तैयार की है। खाद, सिंचाई या कीट रोकथाम के बारे में बेझिझक सवाल पूछें!`;
    case 'bn':
      return `নমস্কার কৃষক বন্ধু! আমি আপনার কৃষভূমি AI কৃষি পরামর্শদাতা। আপনার মাটির রিপোর্ট (নাইট্রোজেন: ${n} kg/ha, pH: ${ph}) বিশ্লেষণ করে ${cropTranslated} ফসলের জন্য এই বিশেষ পরিকল্পনা প্রস্তুত করা হয়েছে। যে কোনো প্রশ্ন করতে পারেন!`;
    case 'te':
      return `నమస్కారం రైతు మిత్రమా! నేను మీ కృషిభూమి AI వ్యవసాయ సలహాదారుని. మీ మట్టి నివేదిక (నత్రజని: ${n} kg/ha, pH: ${ph}) ఆధారంగా ${cropTranslated} పంట కోసం ఈ ప్రణాళిక రూపొందించబడింది. ఎరువులు లేదా రక్షణపై సందేహాలు అడగండి!`;
    case 'ta':
      return `வணக்கம் விவசாய தோழரே! நான் உங்கள் கிருஷிபூமி AI வேளாண் ஆலோசகர். உங்கள் மண் பரிசோதனை (தழைச்சத்து: ${n} kg/ha, pH: ${ph}) அடிப்படையில் ${cropTranslated} பயிருக்கான இந்த உத்தி உருவாக்கப்பட்டுள்ளது. உர அளவு அல்லது நோய் மேலாண்மை பற்றி கேளுங்கள்!`;
    case 'gu':
      return `નમસ્તે ખેડૂત મિત્ર! હું તમારો કૃષિભૂમિ AI ખેતી સલાહકાર છું. તમારા જમીન પૃથ્થકરણ (નાઇટ્રોજન: ${n} kg/ha, pH: ${ph}) આધારે ${cropTranslated} પાક માટે આ આયોજન બનાવ્યું છે. ખાતર કે દવાઓ વિશે કોઈપણ પ્રશ્ન પૂછો!`;
    case 'kn':
      return `ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೇ! ನಾನು ನಿಮ್ಮ ಕೃಷಿಭೂಮಿ AI ಕೃಷಿ ಮಾರ್ಗದರ್ಶಿ. ನಿಮ್ಮ ಮಣ್ಣಿನ ವರದಿ (ಸಾರಜನಕ: ${n} kg/ha, pH: ${ph}) ಆಧರಿಸಿ ${cropTranslated} ಬೆಳೆಗೆ ಸೂಕ್ತ ಕಾರ್ಯತಂತ್ರ ರೂಪಿಸಲಾಗಿದೆ. ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಧೈರ್ಯವಾಗಿ ಕೇಳಿ!`;
    case 'pa':
      return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਤੁਹਾਡਾ ਕ੍ਰਿਸ਼ੀਭੂਮੀ AI ਖੇਤੀ ਸਲਾਹਕਾਰ ਹਾਂ। ਤੁਹਾਡੀ ਮਿੱਟੀ ਰਿਪੋਰਟ (ਨਾਈਟ੍ਰੋਜਨ: ${n} kg/ha, pH: ${ph}) ਦੇ ਆਧਾਰ 'ਤੇ ${cropTranslated} ਫ਼ਸਲ ਲਈ ਇਹ ਯੋਜਨਾ ਤਿਆਰ ਕੀਤੀ ਗਈ ਹੈ। ਖਾਦ ਜਾਂ ਬਿਮਾਰੀਆਂ ਬਾਰੇ ਬੇਝਿਜਕ ਪੁੱਛੋ!`;
    default:
      return `Namaste! I am your Krishibhoomi AI Agronomist Copilot. I have analyzed your soil test parameters (N: ${n} kg/ha, pH: ${ph}) and synthesized this personalized seasonal strategy for ${cropTranslated}. Feel free to ask about weather contingencies, fertilizer dosage adjustments, or organic alternatives!`;
  }
}

// Crop recommendation UI translations. Numerical/scientific values are never translated.
const CROP_UI_TERMS: Record<string, Partial<Record<LanguageCode, string>>> = {
  categoryCereal: {en:'Cereal',hi:'अनाज',mr:'धान्य',bn:'শস্য',te:'ధాన్యం',ta:'தானியம்',gu:'અનાજ',kn:'ಧಾನ್ಯ',ml:'ധാന്യം',pa:'ਅਨਾਜ',or:'ଶସ୍ୟ',as:'শস্য',ur:'اناج',sa:'धान्यम्',ne:'अन्नबाली',kok:'धान्य',mai:'अनाज',ks:'غٲج',sd:'اناج',brx:'अनाज',doi:'अनाज',mni:'শস্য',sat:'ᱥᱟᱥᱟᱝ'},
  categoryPulse: {en:'Pulse',hi:'दलहन',mr:'कडधान्य',bn:'ডাল',te:'పప్పుధాన్యం',ta:'பருப்பு',gu:'કઠોળ',kn:'ಬೇಳೆ',ml:'പയർവർഗ്ഗം',pa:'ਦਾਲ',or:'ଡାଲି',as:'দাইল',ur:'دال',sa:'शिम्बीधान्यम्',ne:'दलहन',kok:'डाळ',mai:'दलहन',ks:'دال',sd:'دال',brx:'दाल',doi:'दाल',mni:'ডাল',sat:'ᱫᱟᱞ'},
  categoryOilseed: {en:'Oilseed',hi:'तिलहन',mr:'तेलबिया',bn:'তৈলবীজ',te:'నూనెగింజ',ta:'எண்ணெய் வித்து',gu:'તેલિબિયાં',kn:'ಎಣ್ಣೆಕಾಳು',ml:'എണ്ണവിത്ത്',pa:'ਤੇਲ ਬੀਜ',or:'ତୈଳବୀଜ',as:'তেলবীজ',ur:'تیل دار بیج',sa:'तैलबीजम्',ne:'तेलहन',kok:'तेलबी',mai:'तेलहन',ks:'تیلٕ بیٖج',sd:'تيل ٻج',brx:'तेल बीज',doi:'तेल बीज',mni:'তেলবীজ',sat:'ᱚᱭᱞ ᱵᱤᱡᱽ'},
  categoryCash: {en:'Cash Crop',hi:'नकदी फसल',mr:'नगदी पीक',bn:'অর্থকরী ফসল',te:'వాణిజ్య పంట',ta:'பணப்பயிர்',gu:'રોકડિયો પાક',kn:'ನಗದು ಬೆಳೆ',ml:'നാണ്യവിള',pa:'ਨਕਦੀ ਫਸਲ',or:'ନଗଦ ଫସଲ',as:'নগদ শস্য',ur:'نقد آور فصل',sa:'धनदायि फसल',ne:'नगदे बाली',kok:'रोख पीक',mai:'नकदी फसल',ks:'نقدی فصل',sd:'نقد فصل',brx:'नगदी फसल',doi:'नकदी फसल',mni:'নগদ ফসল',sat:'ᱱᱚᱜᱚᱫ ᱵᱟᱹᱞᱤ'},
  categoryVegetable: {en:'Vegetable',hi:'सब्जी',mr:'भाजीपाला',bn:'সবজি',te:'కూరగాయ',ta:'காய்கறி',gu:'શાકભાજી',kn:'ತರಕಾರಿ',ml:'പച്ചക്കറി',pa:'ਸਬਜ਼ੀ',or:'ପନିପରିବା',as:'শাক-পাচলি',ur:'سبزی',sa:'शाकम्',ne:'तरकारी',kok:'भाजी',mai:'सब्जी',ks:'ترکاری',sd:'ڀاڄي',brx:'सब्जी',doi:'सब्जी',mni:'সবজি',sat:'ᱥᱟᱵᱡᱤ'},
  categoryHorticulture: {en:'Horticulture',hi:'बागवानी',mr:'बागायती',bn:'উদ্যানপালন',te:'ఉద్యాన పంట',ta:'தோட்டக்கலை',gu:'બાગાયત',kn:'ತೋಟಗಾರಿಕೆ',ml:'തോട്ടവിള',pa:'ਬਾਗਬਾਨੀ',or:'ଉଦ୍ୟାନଚାଷ',as:'উদ্যানশস্য',ur:'باغبانی',sa:'उद्यानकृषिः',ne:'बागवानी',kok:'बागायती',mai:'बागवानी',ks:'بٲغٕوانی',sd:'باغباني',brx:'बागवानी',doi:'बागबानी',mni:'উদ্যান',sat:'ᱵᱟᱜᱟᱱ'},
  categoryExotic: {en:'Exotic Superfood',hi:'विशेष सुपरफूड',mr:'विशेष सुपरफूड',bn:'বিশেষ সুপারফুড',te:'ప్రత్యేక సూపర్‌ఫుడ్',ta:'சிறப்பு சூப்பர்ஃபுட்',gu:'વિશેષ સુપરફૂડ',kn:'ವಿಶೇಷ ಸೂಪರ್‌ಫುಡ್',ml:'പ്രത്യേക സൂപ്പർഫുഡ്',pa:'ਵਿਸ਼ੇਸ਼ ਸੁਪਰਫੂਡ',or:'ବିଶେଷ ସୁପରଫୁଡ୍',as:'বিশেষ ছুপাৰফুড',ur:'خصوصی سپر فوڈ',sa:'विशिष्ट पौष्टिकाहारः',ne:'विशेष सुपरफुड',kok:'विशेष सुपरफूड',mai:'विशेष सुपरफूड',ks:'خاص سپر فوڈ',sd:'خاص سپر فوڊ',brx:'विशेष सुपरफूड',doi:'विशेष सुपरफूड',mni:'বিশেষ সুপারফুড',sat:'ᱵᱤᱥᱮᱥ ᱥᱩᱯᱟᱨᱯᱷᱩᱰ'},
  categorySpices: {en:'Spices',hi:'मसाले',mr:'मसाले',bn:'মসলা',te:'సుగంధ ద్రవ్యాలు',ta:'மசாலா',gu:'મસાલા',kn:'ಮಸಾಲೆ',ml:'മസാല',pa:'ਮਸਾਲੇ',or:'ମସଲା',as:'মছলা',ur:'مصالحے',sa:'मसालाः',ne:'मसला',kok:'मसाले',mai:'मसाला',ks:'مسالہ',sd:'مصالحا',brx:'मसाला',doi:'मसाले',mni:'মশলা',sat:'ᱢᱚᱥᱞᱟ'},
  categoryPlantation: {en:'Plantation',hi:'बागान फसल',mr:'मळेवाडी पीक',bn:'বাগান ফসল',te:'తోట పంట',ta:'தோட்டப் பயிர்',gu:'વાવેતર પાક',kn:'ತೋಟದ ಬೆಳೆ',ml:'തോട്ടവിള',pa:'ਬਾਗਾਨ ਫਸਲ',or:'ବାଗାନ ଫସଲ',as:'বাগান শস্য',ur:'باغاتی فصل',sa:'उद्यानफसल',ne:'बगान बाली',kok:'बागायती पीक',mai:'बागान फसल',ks:'باغٕ فصل',sd:'باغاتي فصل',brx:'बागान',doi:'बागान फसल',mni:'বাগান ফসল',sat:'ᱵᱟᱜᱟᱱ ᱵᱟᱹᱞᱤ'},
  highSustainability: {en:'High Sustainability',hi:'उच्च टिकाऊपन',mr:'उच्च शाश्वतता',bn:'উচ্চ টেকসইতা',te:'అధిక స్థిరత్వం',ta:'உயர் நிலைத்தன்மை',gu:'ઉચ્ચ ટકાઉપણું',kn:'ಹೆಚ್ಚಿನ ಸುಸ್ಥಿರತೆ',ml:'ഉയർന്ന സുസ്ഥിരത',pa:'ਉੱਚ ਟਿਕਾਊਪਨ',or:'ଉଚ୍ଚ ସ୍ଥାୟୀତ୍ୱ',as:'উচ্চ বহনক্ষমতা',ur:'اعلیٰ پائیداری',sa:'उच्चस्थायित्वम्',ne:'उच्च दिगोपन',kok:'उच्च शाश्वतता',mai:'उच्च टिकाऊपन',ks:'وٲلٕ پائیدٲری',sd:'اعليٰ پائيداري',brx:'उच्च टिकाऊपन',doi:'उच्च टिकाऊपन',mni:'উচ্চ স্থায়িত্ব',sat:'ᱪᱟᱞᱟᱣ ᱥᱩᱥᱛᱷᱤᱨᱛᱟ'},
  sustainableMatch: {en:'Sustainable Soil Match',hi:'टिकाऊ मिट्टी मिलान',mr:'शाश्वत माती जुळणी',bn:'টেকসই মাটি মিল',te:'స్థిరమైన నేల సరిపోలిక',ta:'நிலைத்த மண் பொருத்தம்',gu:'ટકાઉ માટી મેળ',kn:'ಸುಸ್ಥಿರ ಮಣ್ಣಿನ ಹೊಂದಾಣಿಕೆ',ml:'സുസ്ഥിര മണ്ണ് പൊരുത്തം',pa:'ਟਿਕਾਊ ਮਿੱਟੀ ਮੇਲ',or:'ସ୍ଥାୟୀ ମାଟି ମେଳ',as:'টেকসই মাটি মিল',ur:'پائیدار مٹی مطابقت',sa:'स्थिरमृदा-सामञ्जस्यम्',ne:'दिगो माटो मिलान',kok:'शाश्वत माती जुळणी',mai:'टिकाऊ माटि मिलान',ks:'پائیدٲر مٲٹی میل',sd:'پائيدار مٽي ميلاپ',brx:'टिकाऊ माटी मिलान',doi:'टिकाऊ मिट्टी मेल',mni:'টেকসই মাটি মিল',sat:'ᱫᱟᱨᱮ ᱵᱟᱹᱞᱤ ᱢᱤᱞᱟᱱ'},
  duration: {en:'Duration',hi:'अवधि',mr:'कालावधी',bn:'সময়কাল',te:'కాలవ్యవధి',ta:'கால அளவு',gu:'સમયગાળો',kn:'ಅವಧಿ',ml:'കാലയളവ്',pa:'ਮਿਆਦ',or:'ଅବଧି',as:'সময়কাল',ur:'مدت',sa:'अवधिः',ne:'अवधि',kok:'कालावधी',mai:'अवधि',ks:'مُدٕت',sd:'مدت',brx:'समय',doi:'अवधि',mni:'সময়কাল',sat:'ᱥᱟᱢᱟᱭ'},
  waterRequirement: {en:'Water requirement',hi:'पानी की आवश्यकता',mr:'पाण्याची गरज',bn:'জলের প্রয়োজন',te:'నీటి అవసరం',ta:'நீர் தேவை',gu:'પાણીની જરૂરિયાત',kn:'ನೀರಿನ ಅಗತ್ಯ',ml:'ജല ആവശ്യം',pa:'ਪਾਣੀ ਦੀ ਲੋੜ',or:'ଜଳ ଆବଶ୍ୟକତା',as:'পানীৰ প্ৰয়োজন',ur:'پانی کی ضرورت',sa:'जलावश्यकता',ne:'पानी आवश्यकता',kok:'पाण्याची गरज',mai:'पानीक आवश्यकता',ks:'آبٕ ضرورت',sd:'پاڻي جي ضرورت',brx:'पानी की जरूरत',doi:'पानी दी लोड़',mni:'জলের প্রয়োজন',sat:'ᱫᱟᱜ ᱞᱟᱹᱜᱤᱫ'},
  risk: {en:'Risk',hi:'जोखिम',mr:'जोखीम',bn:'ঝুঁকি',te:'ప్రమాదం',ta:'ஆபத்து',gu:'જોખમ',kn:'ಅಪಾಯ',ml:'അപകടസാധ്യത',pa:'ਖਤਰਾ',or:'ବିପଦ',as:'বিপদ',ur:'خطرہ',sa:'जोखिम्',ne:'जोखिम',kok:'धोका',mai:'जोखिम',ks:'خطرٕ',sd:'خطرو',brx:'जोखिम',doi:'जोखिम',mni:'ঝুঁকি',sat:'ᱡᱚᱠᱷᱚᱢ'},
  soilMatch: {en:'Soil Match',hi:'मिट्टी मिलान',mr:'माती जुळणी',bn:'মাটির মিল',te:'నేల సరిపోలిక',ta:'மண் பொருத்தம்',gu:'માટી મેળ',kn:'ಮಣ್ಣಿನ ಹೊಂದಾಣಿಕೆ',ml:'മണ്ണ് പൊരുത്തം',pa:'ਮਿੱਟੀ ਮੇਲ',or:'ମାଟି ମେଳ',as:'মাটিৰ মিল',ur:'مٹی مطابقت',sa:'मृदा-सामञ्जस्यम्',ne:'माटो मिलान',kok:'माती जुळणी',mai:'माटि मिलान',ks:'مٲٹی میل',sd:'مٽي ميلاپ',brx:'माटी मिलान',doi:'माटी मेल',mni:'মাটির মিল',sat:'ᱦᱟᱥᱟ ᱢᱤᱞᱟᱱ'},
  tier: {en:'Tier',hi:'स्तर',mr:'स्तर',bn:'স্তর',te:'స్థాయి',ta:'அடுக்கு',gu:'સ્તર',kn:'ಹಂತ',ml:'നില',pa:'ਪੱਧਰ',or:'ସ୍ତର',as:'স্তৰ',ur:'درجہ',sa:'स्तरः',ne:'स्तर',kok:'स्तर',mai:'स्तर',ks:'درجہ',sd:'درجو',brx:'स्तर',doi:'पड़ाव',mni:'স্তর',sat:'ᱛᱟᱦᱛᱤ'},
  expectedYield: {en:'Expected Yield',hi:'अनुमानित उपज',mr:'अपेक्षित उत्पादन',bn:'প্রত্যাশিত ফলন',te:'అంచనా దిగుబడి',ta:'எதிர்பார்க்கப்படும் மகசூல்',gu:'અંદાજિત ઉપજ',kn:'ನಿರೀಕ್ಷಿತ ಇಳುವರಿ',ml:'പ്രതീക്ഷിക്കുന്ന വിളവ്',pa:'ਉਮੀਦ ਕੀਤੀ ਪੈਦਾਵਾਰ',or:'ଆନୁମାନିକ ଅମଳ',as:'আনুমানিক উৎপাদন',ur:'متوقع پیداوار',sa:'अपेक्षितोत्पादनम्',ne:'अपेक्षित उत्पादन',kok:'अपेक्षित उत्पादन',mai:'अनुमानित उपज',ks:'توقّع پیداوار',sd:'متوقع پيداوار',brx:'अनुमानित उपज',doi:'उम्मीद उत्पादन',mni:'প্রত্যাশিত ফলন',sat:'ᱟᱥᱟ ᱠᱟᱹᱢᱤ'},
  estimatedCost: {en:'Estimated Cost',hi:'अनुमानित लागत',mr:'अंदाजित खर्च',bn:'আনুমানিক খরচ',te:'అంచనా ఖర్చు',ta:'மதிப்பிடப்பட்ட செலவு',gu:'અંદાજિત ખર્ચ',kn:'ಅಂದಾಜು ವೆಚ್ಚ',ml:'അനുമാനിച്ച ചെലവ്',pa:'ਅਨੁਮਾਨਿਤ ਲਾਗਤ',or:'ଆନୁମାନିକ ଖର୍ଚ୍ଚ',as:'আনুমানিক খৰচ',ur:'تخمینی لاگت',sa:'अनुमितव्ययः',ne:'अनुमानित लागत',kok:'अंदाजित खर्च',mai:'अनुमानित लागत',ks:'تخمینی خرچہ',sd:'تخميني خرچ',brx:'अनुमानित लागत',doi:'अनुमानित लागत',mni:'আনুমানিক খরচ',sat:'ᱟᱹᱠᱷᱟ ᱜᱚᱫᱚ'},
  expectedRevenue: {en:'Expected Revenue',hi:'अनुमानित आय',mr:'अपेक्षित उत्पन्न',bn:'প্রত্যাশিত আয়',te:'అంచనా ఆదాయం',ta:'எதிர்பார்க்கப்படும் வருவாய்',gu:'અંદાજિત આવક',kn:'ನಿರೀಕ್ಷಿತ ಆದಾಯ',ml:'പ്രതീക്ഷിക്കുന്ന വരുമാനം',pa:'ਉਮੀਦ ਕੀਤੀ ਆਮਦਨ',or:'ଆନୁମାନିକ ଆୟ',as:'আনুমানিক আয়',ur:'متوقع آمدنی',sa:'अपेक्षितायः',ne:'अपेक्षित आम्दानी',kok:'अपेक्षित उत्पन्न',mai:'अनुमानित आय',ks:'توقّع آمدن',sd:'متوقع آمدني',brx:'अनुमानित आय',doi:'उम्मीद आमदनी',mni:'প্রত্যাশিত আয়',sat:'ᱟᱥᱟ ᱫᱟᱢ'},
  estimatedProfit: {en:'Estimated Profit',hi:'अनुमानित मुनाफा',mr:'अंदाजित नफा',bn:'আনুমানিক লাভ',te:'అంచనా లాభం',ta:'மதிப்பிடப்பட்ட லாபம்',gu:'અંદાજિત નફો',kn:'ಅಂದಾಜು ಲಾಭ',ml:'അനുമാനിച്ച ലാഭം',pa:'ਅਨੁਮਾਨਿਤ ਮੁਨਾਫ਼ਾ',or:'ଆନୁମାନିକ ଲାଭ',as:'আনুমানিক লাভ',ur:'تخمینی منافع',sa:'अनुमितलाभः',ne:'अनुमानित नाफा',kok:'अंदाजित नफा',mai:'अनुमानित मुनाफा',ks:'تخمینی منٛافع',sd:'تخميني منافعو',brx:'अनुमानित लाभ',doi:'अनुमानित नफा',mni:'আনুমানিক লাভ',sat:'ᱟᱹᱠᱷᱟ ᱞᱟᱵᱷ'},
  total: {en:'Total',hi:'कुल',mr:'एकूण',bn:'মোট',te:'మొత్తం',ta:'மொத்தம்',gu:'કુલ',kn:'ಒಟ್ಟು',ml:'ആകെ',pa:'ਕੁੱਲ',or:'ମୋଟ',as:'মুঠ',ur:'کل',sa:'कुलम्',ne:'जम्मा',kok:'एकूण',mai:'कुल',ks:'کُل',sd:'ڪل',brx:'कुल',doi:'कुल',mni:'মোট',sat:'ᱢᱚᱴ'},
  perAcre: {en:'/Acre',hi:'/एकड़',mr:'/एकर',bn:'/একর',te:'/ఎకరం',ta:'/ஏக்கர்',gu:'/એકર',kn:'/ಎಕರೆ',ml:'/ഏക്കർ',pa:'/ਏਕੜ',or:'/ଏକର',as:'/একৰ',ur:'/ایکڑ',sa:'/एकरम्',ne:'/रोपनी',kok:'/एकर',mai:'/एकड़',ks:'/ایکڑ',sd:'/ايڪڙ',brx:'/एकड़',doi:'/कनाल',mni:'/একর',sat:'/ᱮᱠᱟᱨ'},
  qtlAcre: {en:'Qtl/Acre',hi:'क्विंटल/एकड़',mr:'क्विंटल/एकर',bn:'কুইন্টাল/একর',te:'క్వింటల్/ఎకరం',ta:'குவிண்டால்/ஏக்கர்',gu:'ક્વિન્ટલ/એકર',kn:'ಕ್ವಿಂಟಲ್/ಎಕರೆ',ml:'ക്വിന്റൽ/ഏക്കർ',pa:'ਕੁਇੰਟਲ/ਏਕੜ',or:'କ୍ୱିଣ୍ଟାଲ/ଏକର',as:'কুইণ্টল/একৰ',ur:'کوئنٹل/ایکڑ',sa:'क्विन्टल/एकरम्',ne:'क्विन्टल/रोपनी',kok:'क्विंटल/एकर',mai:'क्विंटल/एकड़',ks:'کوٗنٹل/ایکڑ',sd:'ڪوئنٽل/ايڪڙ',brx:'क्विंटल/एकड़',doi:'क्विंटल/एकड़',mni:'কুইন্টাল/একর',sat:'ᱠᱩᱭᱱᱴᱟᱞ/ᱮᱠᱟᱨ'},
  national: {en:'National Core',hi:'राष्ट्रीय',mr:'राष्ट्रीय',bn:'জাতীয়',te:'జాతీయ',ta:'தேசிய',gu:'રાષ્ટ્રીય',kn:'ರಾಷ್ಟ್ರೀಯ',ml:'ദേശീയ',pa:'ਰਾਸ਼ਟਰੀ',or:'ଜାତୀୟ',as:'ৰাষ্ট্ৰীয়',ur:'قومی',sa:'राष्ट्रीय',ne:'राष्ट्रिय',kok:'राष्ट्रीय',mai:'राष्ट्रीय',ks:'قومی',sd:'قومي',brx:'राष्ट्रीय',doi:'राष्ट्रीय',mni:'জাতীয়',sat:'ᱡᱟᱛᱤᱭᱟ'},
  international: {en:'International Export',hi:'अंतरराष्ट्रीय निर्यात',mr:'आंतरराष्ट्रीय निर्यात',bn:'আন্তর্জাতিক রপ্তানি',te:'అంతర్జాతీయ ఎగుమతి',ta:'சர்வதேச ஏற்றுமதி',gu:'આંતરરાષ્ટ્રીય નિકાસ',kn:'ಅಂತರರಾಷ್ಟ್ರೀಯ ರಫ್ತು',ml:'അന്താരാഷ്ട്ര കയറ്റുമതി',pa:'ਅੰਤਰਰਾਸ਼ਟਰੀ ਨਿਰਯਾਤ',or:'ଆନ୍ତର୍ଜାତୀୟ ରପ୍ତାନି',as:'আন্তঃৰাষ্ট্ৰীয় ৰপ্তানি',ur:'بین الاقوامی برآمد',sa:'अन्तर्राष्ट्रीयनिर्यातः',ne:'अन्तर्राष्ट्रिय निर्यात',kok:'आंतरराष्ट्रीय निर्यात',mai:'अंतरराष्ट्रीय निर्यात',ks:'بین الاقوامی برآمد',sd:'بين الاقوامي برآمد',brx:'अंतरराष्ट्रीय निर्यात',doi:'अंतरराष्ट्रीय निर्यात',mni:'আন্তর্জাতিক রপ্তানি',sat:'ᱡᱟᱛᱤ ᱵᱟᱦᱟᱨ ᱵᱟᱹᱞᱤ'},
  all: {en:'All',hi:'सभी',mr:'सर्व',bn:'সব',te:'అన్ని',ta:'அனைத்தும்',gu:'બધા',kn:'ಎಲ್ಲಾ',ml:'എല്ലാം',pa:'ਸਾਰੇ',or:'ସମସ୍ତ',as:'সকলো',ur:'سب',sa:'सर्वे',ne:'सबै',kok:'सगळे',mai:'सब',ks:'سٲری',sd:'سڀ',brx:'सब',doi:'सारे',mni:'সব',sat:'ᱡᱚᱛᱚ'},
  allSustainable: {en:'All Sustainable',hi:'सभी टिकाऊ',mr:'सर्व शाश्वत',bn:'সব টেকসই',te:'అన్ని స్థిరమైన',ta:'அனைத்து நிலைத்தவை',gu:'બધા ટકાઉ',kn:'ಎಲ್ಲಾ ಸುಸ್ಥಿರ',ml:'എല്ലാം സുസ്ഥിരം',pa:'ਸਾਰੇ ਟਿਕਾਊ',or:'ସମସ୍ତ ସ୍ଥାୟୀ',as:'সকলো টেকসই',ur:'تمام پائیدار',sa:'सर्वस्थिराः',ne:'सबै दिगो',kok:'सर्व शाश्वत',mai:'सब टिकाऊ',ks:'سٲری پائیدٲر',sd:'سڀ پائيدار',brx:'सब टिकाऊ',doi:'सारे टिकाऊ',mni:'সব স্থায়ী',sat:'ᱡᱚᱛᱚ ᱥᱩᱥᱛᱷᱤᱨ'},
  nationalTab: {en:'National',hi:'राष्ट्रीय',mr:'राष्ट्रीय',bn:'জাতীয়',te:'జాతీయ',ta:'தேசிய',gu:'રાષ્ટ્રીય',kn:'ರಾಷ್ಟ್ರೀಯ',ml:'ദേശീയ',pa:'ਰਾਸ਼ਟਰੀ',or:'ଜାତୀୟ',as:'ৰাষ্ট্ৰীয়',ur:'قومی',sa:'राष्ट्रीय',ne:'राष्ट्रिय',kok:'राष्ट्रीय',mai:'राष्ट्रीय',ks:'قومی',sd:'قومي',brx:'राष्ट्रीय',doi:'राष्ट्रीय',mni:'জাতীয়',sat:'ᱡᱟᱛᱤᱭᱟ'},
  search: {en:'Search crop, variety, or botanical...',hi:'फसल, किस्म या वनस्पति खोजें...',mr:'पीक, वाण किंवा वनस्पती शोधा...',bn:'ফসল, জাত বা উদ্ভিদ খুঁজুন...',te:'పంట, రకం లేదా వృక్షం వెతకండి...',ta:'பயிர், ரகம் அல்லது தாவரத்தைத் தேடுங்கள்...',gu:'પાક, જાત અથવા વનસ્પતિ શોધો...',kn:'ಬೆಳೆ, ತಳಿ ಅಥವಾ ಸಸ್ಯವನ್ನು ಹುಡುಕಿ...',ml:'വിള, ഇനം അല്ലെങ്കിൽ സസ്യം തിരയുക...',pa:'ਫਸਲ, ਕਿਸਮ ਜਾਂ ਬੋਟੈਨਿਕਲ ਨਾਮ ਖੋਜੋ...',or:'ଫସଲ, କିସମ କିମ୍ବା ଉଦ୍ଭିଦ ଖୋଜନ୍ତୁ...',as:'শস্য, জাত বা উদ্ভিদ বিচাৰক...',ur:'فصل، قسم یا نبات تلاش کریں...',sa:'सस्यं जातिं वा वनस्पतिं अन्विष्यताम्...',ne:'बाली, जात वा वनस्पति खोज्नुहोस्...',kok:'पीक, वाण वा वनस्पती शोधा...',mai:'फसल, किस्म या वनस्पति खोजू...',ks:'فصل، قسم یا نبات تلاش کرِو...',sd:'فصل، قسم يا ٻوٽو ڳوليو...',brx:'फसल, किस्म या वनस्पति खोजें...',doi:'फसल, किस्म जां वनस्पति खोजो...',mni:'ফসল, জাত বা উদ্ভিদ খুঁজুন...',sat:'ᱵᱟᱹᱞᱤ, ᱡᱟᱛ ᱟᱨ ᱥᱟᱥᱟᱝ ᱯᱷᱟᱸᱫᱟᱹ'},
  agronomicFit: {en:'Agronomic Fit',hi:'कृषि अनुकूलता',mr:'कृषी अनुकूलता',bn:'কৃষি উপযোগিতা',te:'వ్యవసాయ అనుకూలత',ta:'வேளாண் பொருத்தம்',gu:'કૃષિ અનુકૂળતા',kn:'ಕೃಷಿ ಹೊಂದಾಣಿಕೆ',ml:'കൃഷി അനുയോജ്യത',pa:'ਖੇਤੀ ਅਨੁਕੂਲਤਾ',or:'କୃଷି ଉପଯୋଗିତା',as:'কৃষি উপযোগিতা',ur:'زرعی مطابقت',sa:'कृषियोग्यता',ne:'कृषि अनुकूलता',kok:'कृषी अनुकूलता',mai:'कृषि अनुकूलता',ks:'زرعی موافقت',sd:'زرعي مطابقت',brx:'कृषि अनुकूलता',doi:'कृषि अनुकूलता',mni:'কৃষি উপযোগিতা',sat:'ᱦᱟᱥᱟ ᱠᱟᱹᱢᱤ ᱢᱤᱞᱟᱱ'},
  mandiRates: {en:'Mandi Rates',hi:'मंडी भाव',mr:'मंडी भाव',bn:'মণ্ডির দাম',te:'మార్కెట్ ధర',ta:'சந்தை விலை',gu:'મંડી ભાવ',kn:'ಮಾರುಕಟ್ಟೆ ದರ',ml:'മാർക്കറ്റ് നിരക്ക്',pa:'ਮੰਡੀ ਭਾਅ',or:'ମଣ୍ଡି ଦର',as:'মণ্ডিৰ দাম',ur:'منڈی نرخ',sa:'मण्डीमूल्यम्',ne:'मण्डी दर',kok:'मंडी भाव',mai:'मंडी भाव',ks:'منڈی نرخ',sd:'منڊي اگهه',brx:'मंडी भाव',doi:'मंडी भाव',mni:'মণ্ডির দাম',sat:'ᱢᱟᱹᱱᱰᱤ ᱫᱟᱢ'},
  predictYield: {en:'Predict Harvest Yield',hi:'फसल उपज का अनुमान',mr:'कापणी उत्पादनाचा अंदाज',bn:'ফসল ফলনের পূর্বাভাস',te:'పంట దిగుబడి అంచనా',ta:'அறுவடை மகசூல் கணிப்பு',gu:'પાક ઉપજનો અંદાજ',kn:'ಕೊಯ್ಲು ಇಳುವರಿ ಅಂದಾಜು',ml:'വിളവെടുപ്പ് വിളവ് പ്രവചനം',pa:'ਫਸਲ ਪੈਦਾਵਾਰ ਦਾ ਅਨੁਮਾਨ',or:'ଅମଳ ପୂର୍ବାନୁମାନ',as:'ফচল উৎপাদন পূৰ্বানুমান',ur:'فصل پیداوار کا اندازہ',sa:'सस्योत्पादनानुमानम्',ne:'बाली उत्पादन अनुमान',kok:'पीक उत्पादन अंदाज',mai:'फसल उपज अनुमान',ks:'فصل پیداوار اندازٕ',sd:'فصل پيداوار اندازو',brx:'फसल उपज अनुमान',doi:'फसल उपज अनुमान',mni:'ফসল ফলন পূর্বাভাস',sat:'ᱵᱟᱹᱞᱤ ᱡᱟᱹᱛᱤ ᱢᱟᱹᱦᱤᱛ'},
  fertilizerPlan: {en:'Plan Fertilizers & IPM',hi:'खाद और कीट प्रबंधन योजना',mr:'खत व एकात्मिक कीड व्यवस्थापन योजना',bn:'সার ও সমন্বিত বালাই ব্যবস্থাপনা',te:'ఎరువులు మరియు సమగ్ర పురుగు నిర్వహణ',ta:'உரங்கள் மற்றும் ஒருங்கிணைந்த பூச்சி மேலாண்மை',gu:'ખાતર અને IPM યોજના',kn:'ರಸಗೊಬ್ಬರ ಮತ್ತು IPM ಯೋಜನೆ',ml:'വളം, കീടനിയന്ത്രണ പദ്ധതി',pa:'ਖਾਦ ਅਤੇ IPM ਯੋਜਨਾ',or:'ସାର ଓ IPM ଯୋଜନା',as:'সাৰ আৰু IPM পৰিকল্পনা',ur:'کھاد اور IPM منصوبہ',sa:'उर्वरक-समेकितकीटनियन्त्रण योजना',ne:'मल र IPM योजना',kok:'खत आनी IPM योजना',mai:'खाद आ कीट प्रबंधन योजना',ks:'کھاد تہٕ IPM منصوبہ',sd:'ڀاڻ ۽ IPM منصوبو',brx:'खाद और IPM योजना',doi:'खाद ते IPM योजना',mni:'সার ও IPM পরিকল্পনা',sat:'ᱥᱟᱨ ᱟᱨ IPM ᱯᱚᱨᱤᱠᱟᱞᱯᱚᱱᱟ'},
  viewDetails: {en:'View Details',hi:'विवरण देखें',mr:'तपशील पहा',bn:'বিস্তারিত দেখুন',te:'వివరాలు చూడండి',ta:'விவரங்களைப் பார்க்கவும்',gu:'વિગતો જુઓ',kn:'ವಿವರಗಳನ್ನು ನೋಡಿ',ml:'വിശദാംശങ്ങൾ കാണുക',pa:'ਵੇਰਵੇ ਵੇਖੋ',or:'ବିବରଣୀ ଦେଖନ୍ତୁ',as:'বিৱৰণ চাওক',ur:'تفصیلات دیکھیں',sa:'विवरणं पश्यतु',ne:'विवरण हेर्नुहोस्',kok:'तपशील पळोवप',mai:'विवरण देखू',ks:'تفصیل دِکھٲو',sd:'تفصيل ڏسو',brx:'विवरण देखें',doi:'विवरण देखो',mni:'বিস্তারিত দেখুন',sat:'ᱵᱤᱵᱨᱚᱬ ᱧᱮᱞ'},
  calculateProfit: {en:'Calculate Profit',hi:'मुनाफा निकालें',mr:'नफा मोजा',bn:'লাভ হিসাব করুন',te:'లాభం లెక్కించండి',ta:'லாபத்தை கணக்கிடுங்கள்',gu:'નફો ગણો',kn:'ಲಾಭ ಲೆಕ್ಕಿಸಿ',ml:'ലാഭം കണക്കാക്കുക',pa:'ਮੁਨਾਫ਼ਾ ਗਿਣੋ',or:'ଲାଭ ଗଣନା କରନ୍ତୁ',as:'লাভ গণনা কৰক',ur:'منافعہ حساب کریں',sa:'लाभं गणयतु',ne:'नाफा गणना गर्नुहोस्',kok:'नफा मोजा',mai:'मुनाफा गिनू',ks:'منٛافعہ حساب کرِو',sd:'منافعو ڳڻيو',brx:'मुनाफा गिनें',doi:'नफा गिणो',mni:'লাভ হিসাব করুন',sat:'ᱞᱟᱵᱷ ᱞᱮᱠᱷᱟ'},
};



// Additional farmer-facing Crop Recommendation UI phrases. These are local
// translations so switching language never calls Gemini and never consumes API quota.

export function translateSoilType(value: string, lang: LanguageCode = 'en'): string {
  const map: Record<string, Partial<Record<LanguageCode, string>>> = {
    'Deep Black Cotton Soil (Regur)': { en:'Deep Black Cotton Soil (Regur)', hi:'गहरी काली कपास मिट्टी (रेगुर)', mr:'गहिरी काळी कापूस माती (रेगूर)', bn:'গভীর কালো তুলা মাটি (রেগুর)', te:'లోతైన నల్ల పత్తి నేల (రేగూర్)', ta:'ஆழமான கருப்பு பருத்தி மண் (ரெகூர்)', gu:'ઊંડી કાળી કપાસની જમીન (રેગુર)', kn:'ಆಳವಾದ ಕಪ್ಪು ಹತ್ತಿ ಮಣ್ಣು (ರೇಗರ್)', ml:'ആഴമുള്ള കറുത്ത പരുത്തി മണ്ണ് (റെഗർ)', pa:'ਡੂੰਘੀ ਕਾਲੀ ਕਪਾਹ ਮਿੱਟੀ (ਰੇਗੁਰ)', or:'ଗଭୀର କଳା କପା ମାଟି (ରେଗୁର)', as:'গভীৰ ক’লা কপাহ মাটি (ৰেগুৰ)', ur:'گہری کالی کپاس کی مٹی (ریگور)', sa:'गम्भीरा कृष्णकार्पासमृदा (रेगुर)', ne:'गहिरो कालो कपास माटो (रेगुर)', kok:'खोल काळी कापूस माती (रेगूर)', mai:'गहीर कारी कपास माटि (रेगुर)', ks:'گٲڑ کٲلۍ کپاس مٲٹی (ریگُر)', sd:'اونهي ڪاري ڪپهه جي مٽي (ريگور)', brx:'गोजान गारो कपास माटि (रेगुर)', doi:'डूंगी काली कपाह माटी (रेगुर)', mni:'নম্বা কালো কাপাহ মাটী (রেগুর)', sat:'গাডা কালা কাপাস মাটি (রেগুর)' },
    'Black Soil': { en:'Black Soil', hi:'काली मिट्टी', mr:'काळी माती', bn:'কালো মাটি', te:'నల్ల నేల', ta:'கருப்பு மண்', gu:'કાળી જમીન', kn:'ಕಪ್ಪು ಮಣ್ಣು', ml:'കറുത്ത മണ്ണ്', pa:'ਕਾਲੀ ਮਿੱਟੀ', or:'କଳା ମାଟି', as:'ক’লা মাটি', ur:'کالی مٹی', sa:'कृष्णमृदा', ne:'कालो माटो', kok:'काळी माती', mai:'कारी माटि', ks:'کٲلۍ مٲٹی', sd:'ڪاري مٽي', brx:'गारो माटि', doi:'काली माटी', mni:'কালো মাটী', sat:'কালা মাটি' },
    'Alluvial Loam': { en:'Alluvial Loam', hi:'जलोढ़ दोमट मिट्टी', mr:'गाळाची दोमट माती', bn:'পলিমাটি দোআঁশ', te:'ఒండ్రు లోమ్ నేల', ta:'வண்டல் மணற்பாங்கு மண்', gu:'કાંપાળ દોળમટ જમીન', kn:'ಮೆಕ್ಕಲು ಲೋಮ್ ಮಣ್ಣು', ml:'എക്കൽ കലർന്ന മണ്ണ്', pa:'ਜਲੋਢ ਦੋਮਟ ਮਿੱਟੀ', or:'ପଟୁଆ ଦୋଆଶ ମାଟି', as:'পলসুৱা দোআঁশ মাটি', ur:'دریائی دوامی مٹی', sa:'जलोढद्विमृदा', ne:'जलोढ दोमट माटो', kok:'गाळाची दोमट माती', mai:'जलोढ़ दोमट माटि', ks:'دریٲی دوٗمٹ مٲٹی', sd:'دريائي دوآبي مٽي', brx:'दावसि दोमट माटि', doi:'जलोढ़ दोमट माटी', mni:'পলিমাটি দোআঁশ মাটী', sat:'নাদি দোআঁশ মাটি' },
    'Alluvial Loamy Sand': { en:'Alluvial Loamy Sand', hi:'जलोढ़ बलुई दोमट', mr:'गाळाची वालुकामय दोमट माती', bn:'পলিযুক্ত বেলে দোআঁশ', te:'ఒండ్రు ఇసుక లోమ్ నేల', ta:'வண்டல் மணல் கலந்த மண்', gu:'કાંપાળ રેતાળ દોળમટ', kn:'ಮೆಕ್ಕಲು ಮರಳು ಲೋಮ್', ml:'എക്കൽ മണൽ കലർന്ന മണ്ണ്', pa:'ਜਲੋਢ ਰੇਤਲੀ ਦੋਮਟ', or:'ପଟୁଆ ବାଲିଆ ଦୋଆଶ', as:'পলসুৱা বালিময় দোআঁশ', ur:'دریائی ریتیلی دوامی مٹی', sa:'जलोढवालुकाद्विमृदा', ne:'जलोढ बलौटे दोमट', kok:'गाळाची वालुकामय दोमट', mai:'जलोढ़ बालुमय दोमट', ks:'دریٲی رٮ۪تہٕ دوٗمٹ', sd:'دريائي ريتيلي دوآبي', brx:'दावसि बालुमय दोमट', doi:'जलोढ़ रेतली दोमट', mni:'পলিযুক্ত বালিময় দোআঁশ', sat:'নাদি বালি দোআঁশ' },
    'Clay Loam': { en:'Clay Loam', hi:'चिकनी दोमट मिट्टी', mr:'चिकण दोमट माती', bn:'কাদামাটি দোআঁশ', te:'బంకమట్టి లోమ్', ta:'களிமண் கலந்த மண்', gu:'ચીકણી દોળમટ જમીન', kn:'ಜೇಡಿ ಲೋಮ್ ಮಣ್ಣು', ml:'കളിമൺ കലർന്ന മണ്ണ്', pa:'ਚੀਕਣੀ ਦੋਮਟ ਮਿੱਟੀ', or:'ଚିକ୍କଣ ଦୋଆଶ ମାଟି', as:'বোকা দোআঁশ মাটি', ur:'چکنی دوامی مٹی', sa:'मृत्तिकाद्विमृदा', ne:'चिम्टे दोमट माटो', kok:'चिकण दोमट माती', mai:'चिकन दोमट माटि', ks:'چِکنٕ دوٗمٹ مٲٹی', sd:'چڪڻي دوآبي مٽي', brx:'गोजान दोमट माटि', doi:'चिकणी दोमट माटी', mni:'কাদামাটি দোআঁশ', sat:'চিকন দোআঁশ মাটি' },
    'Medium Deep Clay Loam': { en:'Medium Deep Clay Loam', hi:'मध्यम गहरी चिकनी दोमट मिट्टी', mr:'मध्यम खोल चिकण दोमट माती', bn:'মাঝারি গভীর কাদামাটি দোআঁশ', te:'మధ్యస్థ లోతైన బంకమట్టి లోమ్', ta:'நடுத்தர ஆழமான களிமண் மண்', gu:'મધ્યમ ઊંડી ચીકણી દોળમટ', kn:'ಮಧ್ಯಮ ಆಳದ ಜೇಡಿ ಲೋಮ್', ml:'ഇടത്തരം ആഴമുള്ള കളിമൺ മണ്ണ്', pa:'ਦਰਮਿਆਨੀ ਡੂੰਘੀ ਚੀਕਣੀ ਦੋਮਟ', or:'ମଧ୍ୟମ ଗଭୀର ଚିକ୍କଣ ଦୋଆଶ', as:'মধ্যম গভীৰ বোকা দোআঁশ', ur:'درمیانی گہری چکنی دوامی مٹی', sa:'मध्यमगम्भीरा मृत्तिकाद्विमृदा', ne:'मध्यम गहिरो चिम्टे दोमट', kok:'मध्यम खोल चिकण दोमट', mai:'मध्यम गहीर चिकन दोमट', ks:'درمیانہ گٲڑ چِکنٕ دوٗمٹ', sd:'وچولي اونهي چڪڻي دوآبي', brx:'मध्यम गोजान चिकन दोमट', doi:'मझली डूंगी चिकणी दोमट', mni:'মধ্যম নম্বা কাদামাটি দোআঁশ', sat:'মাঝা গাডা চিকন দোআঁশ' },
    'Sandy Loam': { en:'Sandy Loam', hi:'बलुई दोमट मिट्टी', mr:'वालुकामय दोमट माती', bn:'বেলে দোআঁশ মাটি', te:'ఇసుక లోమ్ నేల', ta:'மணல் கலந்த மண்', gu:'રેતાળ દોળમટ જમીન', kn:'ಮರಳು ಲೋಮ್ ಮಣ್ಣು', ml:'മണൽ കലർന്ന മണ്ണ്', pa:'ਰੇਤਲੀ ਦੋਮਟ ਮਿੱਟੀ', or:'ବାଲିଆ ଦୋଆଶ ମାଟି', as:'বালিময় দোআঁশ মাটি', ur:'ریتیلی دوامی مٹی', sa:'वालुकाद्विमृदा', ne:'बलौटे दोमट माटो', kok:'वालुकामय दोमट माती', mai:'बालुमय दोमट माटि', ks:'رٮ۪تہٕ دوٗمٹ مٲٹی', sd:'ريتيلي دوآبي مٽي', brx:'बालुमय दोमट माटि', doi:'रेतली दोमट माटी', mni:'বালিময় দোআঁশ মাটী', sat:'বালি দোআঁশ মাটি' },
    'Red Loam': { en:'Red Loam', hi:'लाल दोमट मिट्टी', mr:'लाल दोमट माती', bn:'লাল দোআঁশ মাটি', te:'ఎర్ర లోమ్ నేల', ta:'சிவப்பு மணற்பாங்கு மண்', gu:'લાલ દોળમટ જમીન', kn:'ಕೆಂಪು ಲೋಮ್ ಮಣ್ಣು', ml:'ചുവന്ന ദോആശ മണ്ണ്', pa:'ਲਾਲ ਦੋਮਟ ਮਿੱਟੀ', or:'ଲାଲ ଦୋଆଶ ମାଟି', as:'ৰঙা দোআঁশ মাটি', ur:'سرخ دوامی مٹی', sa:'रक्तद्विमृदा', ne:'रातो दोमट माटो', kok:'तांबडी दोमट माती', mai:'लाल दोमट माटि', ks:'سُرخ دوٗمٹ مٲٹی', sd:'ڳاڙهي دوآبي مٽي', brx:'सोमखो दोमट माटि', doi:'लाल दोमट माटी', mni:'লাল দোআঁশ মাটী', sat:'লাল দোআঁশ মাটি' }
  };
  return map[value]?.[lang] || map[value]?.en || value;
}

const CROP_UI_EXTRA: Record<string, Record<LanguageCode,string>> = {
  recommendationDescription: {
    en:'Matches crops to your soil, season and expected farm return using the entered soil report.',
    hi:'आपकी मिट्टी की रिपोर्ट, मौसम और संभावित लाभ के आधार पर उपयुक्त फसलों का मिलान करता है।', mr:'तुमच्या मातीच्या अहवाल, हंगाम आणि अपेक्षित नफ्यानुसार योग्य पिकांची जुळवणी करतो.', bn:'আপনার মাটির রিপোর্ট, মরসুম ও সম্ভাব্য লাভের ভিত্তিতে উপযুক্ত ফসল নির্বাচন করে।', te:'మీ నేల నివేదిక, సీజన్ మరియు అంచనా లాభం ఆధారంగా సరైన పంటలను సరిపోల్చుతుంది.', ta:'உங்கள் மண் அறிக்கை, பருவம் மற்றும் எதிர்பார்க்கப்படும் லாபத்தின் அடிப்படையில் பொருத்தமான பயிர்களைத் தேர்வு செய்கிறது.', gu:'તમારા જમીન અહેવાલ, ઋતુ અને અપેક્ષિત નફા આધારે યોગ્ય પાકો પસંદ કરે છે.', kn:'ನಿಮ್ಮ ಮಣ್ಣಿನ ವರದಿ, ಹಂಗಾಮು ಮತ್ತು ನಿರೀಕ್ಷಿತ ಲಾಭದ ಆಧಾರದ ಮೇಲೆ ಸೂಕ್ತ ಬೆಳೆಗಳನ್ನು ಹೊಂದಿಸುತ್ತದೆ.', ml:'നിങ്ങളുടെ മണ്ണ് റിപ്പോർട്ട്, സീസൺ, പ്രതീക്ഷിക്കുന്ന ലാഭം എന്നിവയുടെ അടിസ്ഥാനത്തിൽ അനുയോജ്യമായ വിളകൾ തിരഞ്ഞെടുക്കുന്നു.', pa:'ਤੁਹਾਡੀ ਮਿੱਟੀ ਰਿਪੋਰਟ, ਮੌਸਮ ਅਤੇ ਸੰਭਾਵਿਤ ਮੁਨਾਫ਼ੇ ਦੇ ਆਧਾਰ ਤੇ ਢੁਕਵੀਆਂ ਫਸਲਾਂ ਚੁਣਦਾ ਹੈ।', or:'ଆପଣଙ୍କ ମାଟି ରିପୋର୍ଟ, ଋତୁ ଓ ଆଶାକରା ଲାଭ ଆଧାରରେ ଉପଯୁକ୍ତ ଫସଲ ବାଛେ।', as:'আপোনাৰ মাটিৰ প্ৰতিবেদন, ঋতু আৰু সম্ভাব্য লাভৰ ভিত্তিত উপযুক্ত শস্য বাছনি কৰে।', ur:'آپ کی مٹی کی رپورٹ، موسم اور متوقع منافع کی بنیاد پر موزوں فصلوں کا انتخاب کرتا ہے۔', sa:'भवतः मृदारिपोर्ट्-ऋतु-अपेक्षितलाभाधारेण योग्यसस्यानि चयनयति।', ne:'तपाईंको माटो रिपोर्ट, मौसम र अपेक्षित नाफाका आधारमा उपयुक्त बाली छनोट गर्छ।', kok:'तुमच्या माती रिपोर्ट, हंगाम आनी अपेक्षित नफ्याचेर योग्य पीक निवडता.', mai:'अहाँक माटिक रिपोर्ट, मौसम आ अपेक्षित लाभक आधार पर उपयुक्त फसल चुनैत अछि।', ks:'تُہۍ ہٕند مٲٹی رپورٹ، موسم تہٕ متوقع منٛافعہِ ہُند بُنیادس پٮ۪ٹھ موزوں فصلہٕ ژارِتھ۔', sd:'توهان جي مٽي رپورٽ، موسم ۽ متوقع نفعي جي بنياد تي مناسب فصلون چونڊي ٿو.', brx:'नों माटि रिपोर्ट, सम आरो आसानाय नाफानि गोनांजों गोरोबनाय फसल सायखो।', doi:'तुंदे माटी रिपोर्ट, मौसम ते उम्मीद नफे दे आधार उप्पर ठीक फसलां चुंदा ऐ।', mni:'নহাক্কী মাটীগী ৱারোল, মরুম অমসুং আশা তৌবা লাভগী মতুং ইনশুংনা চান্না লৈবা মাটী শিংজিনবা।', sat:'আম মাটি রে রিপোর্ট, মরসুম আর আশা নাফা রে হিসাব তে ঠিক বাআড়ি বাছাও।'
  },
  syncedSoilCard:{en:'Synced with Soil Health Card',hi:'मृदा स्वास्थ्य कार्ड से जुड़ा है',mr:'मृदा आरोग्य कार्डशी जोडले आहे',bn:'মাটি স্বাস্থ্য কার্ডের সঙ্গে যুক্ত',te:'మట్టి ఆరోగ్య కార్డుతో అనుసంధానించబడింది',ta:'மண் சுகாதார அட்டையுடன் இணைக்கப்பட்டது',gu:'માટી આરોગ્ય કાર્ડ સાથે જોડાયેલ',kn:'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್‌ಗೆ ಸಂಪರ್ಕಿಸಲಾಗಿದೆ',ml:'മണ്ണ് ആരോഗ്യ കാർഡുമായി ബന്ധിപ്പിച്ചു',pa:'ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਨਾਲ ਜੁੜਿਆ',or:'ମୃତ୍ତିକା ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ ସହିତ ଯୋଡାଗଲା',as:'মাটি স্বাস্থ্য কাৰ্ডৰ সৈতে সংযুক্ত',ur:'مٹی صحت کارڈ سے منسلک',sa:'मृदास्वास्थ्यपत्रेण संयोजितम्',ne:'माटो स्वास्थ्य कार्डसँग जोडिएको',kok:'माती आरोग्य कार्डाक जोडिल्ले',mai:'माटि स्वास्थ्य कार्ड सँ जुड़ल',ks:'مٲٹی صحت کارڈس سۭتۍ جوڑمُت',sd:'مٽي صحت ڪارڊ سان ڳنڍيل',brx:'माटि स्वास्थ्य कार्डजों जोडाबनाय',doi:'माटी सेहत कार्ड कन्नै जुड़्या',mni:'মাটীগী হেল্থ কার্ডগা শমিল',sat:'মাটি সাস্থ্য কার্ড সাতে জোড়াওয়া'},
  analyzing:{en:'Analyzing soil...',hi:'मिट्टी का विश्लेषण हो रहा है...',mr:'मातीचे विश्लेषण सुरू आहे...',bn:'মাটি বিশ্লেষণ হচ্ছে...',te:'నేలను విశ్లేషిస్తున్నాం...',ta:'மண்ணை ஆய்வு செய்கிறது...',gu:'જમીનનું વિશ્લેષણ થઈ રહ્યું છે...',kn:'ಮಣ್ಣನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',ml:'മണ്ണ് വിശകലനം ചെയ്യുന്നു...',pa:'ਮਿੱਟੀ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...',or:'ମାଟି ବିଶ୍ଳେଷଣ ହେଉଛି...',as:'মাটি বিশ্লেষণ হৈ আছে...',ur:'مٹی کا تجزیہ ہو رہا ہے...',sa:'मृदाविश्लेषणं क्रियते...',ne:'माटो विश्लेषण हुँदैछ...',kok:'मातीचें विश्लेशण जाता...',mai:'माटिक विश्लेषण भऽ रहल अछि...',ks:'مٲٹی ہُند تجزیہ گژھان چھُ...',sd:'مٽي جو تجزيو ٿي رهيو آهي...',brx:'माटि फोरमानाय जाबाय...',doi:'माटी दा विश्लेषण होआ करदा ऐ...',mni:'মাটী বিশ্লেষণ তৌরি...',sat:'মাটি জাচাই কানায়...'},
  regenerate:{en:'Regenerate Recommendations',hi:'सिफारिशें फिर से बनाएं',mr:'शिफारसी पुन्हा तयार करा',bn:'সুপারিশ আবার তৈরি করুন',te:'సిఫారసులను మళ్లీ రూపొందించండి',ta:'பரிந்துரைகளை மீண்டும் உருவாக்கவும்',gu:'ભલામણો ફરી બનાવો',kn:'ಶಿಫಾರಸುಗಳನ್ನು ಮತ್ತೆ ರಚಿಸಿ',ml:'ശുപാർശകൾ വീണ്ടും തയ്യാറാക്കുക',pa:'ਸਿਫਾਰਸ਼ਾਂ ਮੁੜ ਬਣਾਓ',or:'ସୁପାରିଶ ପୁଣି ତିଆରି କରନ୍ତୁ',as:'পৰামৰ্শ পুনৰ সৃষ্টি কৰক',ur:'سفارشات دوبارہ بنائیں',sa:'सिफारिशाः पुनः निर्मीयन्ताम्',ne:'सिफारिसहरू फेरि बनाउनुहोस्',kok:'शिफारसी परत तयार करात',mai:'सिफारिश फेर सँ बनाउ',ks:'سفارشات دوبارہ تیار کریو',sd:'سفارشون ٻيهر ٺاهيو',brx:'सिफारिस फिन दोहराय',doi:'सिफारशां दोबारा बनाओ',mni:'শিংজিনবা ৱারোল অমুক হন্না শেমজিনৌ',sat:'সুপারিশ দোহড়া বানা'},
  generateRecommendations:{en:'Generate Recommendations',hi:'सिफारिशें बनाएं',mr:'शिफारसी तयार करा',bn:'সুপারিশ তৈরি করুন',te:'సిఫారసులు రూపొందించండి',ta:'பரிந்துரைகளை உருவாக்கவும்',gu:'ભલામણો બનાવો',kn:'ಶಿಫಾರಸುಗಳನ್ನು ರಚಿಸಿ',ml:'ശുപാർശകൾ തയ്യാറാക്കുക',pa:'ਸਿਫਾਰਸ਼ਾਂ ਬਣਾਓ',or:'ସୁପାରିଶ ତିଆରି କରନ୍ତୁ',as:'পৰামৰ্শ সৃষ্টি কৰক',ur:'سفارشات بنائیں',sa:'सिफारिशाः निर्मीयन्ताम्',ne:'सिफारिसहरू बनाउनुहोस्',kok:'शिफारसी तयार करात',mai:'सिफारिश बनाउ',ks:'سفارشات بنٲو',sd:'سفارشون ٺاهيو',brx:'सिफारिस सायखो',doi:'सिफारशां बनाओ',mni:'শিংজিনবা ৱারোল শেমজিনৌ',sat:'সুপারিশ বানা'},
  activeSoilCardSynced:{en:'Active Soil Health Card Synced',hi:'सक्रिय मृदा स्वास्थ्य कार्ड जुड़ा है',mr:'सक्रिय मृदा आरोग्य कार्ड जोडले आहे',bn:'সক্রিয় মাটি স্বাস্থ্য কার্ড যুক্ত',te:'యాక్టివ్ మట్టి ఆరోగ్య కార్డు అనుసంధానించబడింది',ta:'செயலில் உள்ள மண் சுகாதார அட்டை இணைக்கப்பட்டது',gu:'સક્રિય માટી આરોગ્ય કાર્ડ જોડાયેલ',kn:'ಸಕ್ರಿಯ ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಸಂಪರ್ಕಿಸಲಾಗಿದೆ',ml:'സജീവ മണ്ണ് ആരോഗ്യ കാർഡ് ബന്ധിപ്പിച്ചു',pa:'ਸਰਗਰਮ ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਜੁੜਿਆ',or:'ସକ୍ରିୟ ମୃତ୍ତିକା ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ ଯୋଡାଗଲା',as:'সক্ৰিয় মাটি স্বাস্থ্য কাৰ্ড সংযুক্ত',ur:'فعال مٹی صحت کارڈ منسلک',sa:'सक्रियमृदास्वास्थ्यपत्रं संयोजितम्',ne:'सक्रिय माटो स्वास्थ्य कार्ड जोडिएको',kok:'सक्रिय माती आरोग्य कार्ड जोडिल्ले',mai:'सक्रिय माटि स्वास्थ्य कार्ड जुड़ल',ks:'فعال مٲٹی صحت کارڈ جوڑمُت',sd:'فعال مٽي صحت ڪارڊ ڳنڍيل',brx:'सक्रिय माटि स्वास्थ्य कार्ड जोडाबनाय',doi:'सक्रिय माटी सेहत कार्ड जुड़्या',mni:'অ্যাক্টিভ মাটীগী হেল্থ কার্ড শমিল',sat:'সক্রিয় মাটি সাস্থ্য কার্ড জোড়াওয়া'},
  liveReportData:{en:'Live Report Data',hi:'रिपोर्ट का वास्तविक डेटा',mr:'रिपोर्टमधील प्रत्यक्ष डेटा',bn:'রিপোর্টের আসল তথ্য',te:'నివేదికలోని నిజమైన డేటా',ta:'அறிக்கையின் உண்மையான தரவு',gu:'રિપોર્ટનો વાસ્તવિક ડેટા',kn:'ವರದಿಯ ನೈಜ ಡೇಟಾ',ml:'റിപ്പോർട്ടിലെ യഥാർത്ഥ ഡാറ്റ',pa:'ਰਿਪੋਰਟ ਦਾ ਅਸਲ ਡਾਟਾ',or:'ରିପୋର୍ଟର ପ୍ରକୃତ ତଥ୍ୟ',as:'ৰিপৰ্টৰ বাস্তৱ তথ্য',ur:'رپورٹ کا اصل ڈیٹا',sa:'प्रतिवेदनस्य वास्तविकदत्तांशः',ne:'रिपोर्टको वास्तविक डेटा',kok:'रिपोर्टांतलो खरो डेटा',mai:'रिपोर्टक वास्तविक डेटा',ks:'رپورٹس ہُند اصل ڈیٹا',sd:'رپورٽ جو اصل ڊيٽا',brx:'रिपोर्टनि गोनां डाटा',doi:'रिपोर्ट दा असली डाटा',mni:'রিপোর্টগী অসল ডাটা',sat:'রিপোর্ট রে আসল ডাটা'},
  resyncReport:{en:'Re-sync from Report',hi:'रिपोर्ट से फिर जोड़ें',mr:'रिपोर्टमधून पुन्हा जोडा',bn:'রিপোর্ট থেকে আবার সংযুক্ত করুন',te:'నివేదిక నుండి మళ్లీ సింక్ చేయండి',ta:'அறிக்கையிலிருந்து மீண்டும் இணைக்கவும்',gu:'રિપોર્ટમાંથી ફરી સિંક કરો',kn:'ವರದಿಯಿಂದ ಮತ್ತೆ ಸಿಂಕ್ ಮಾಡಿ',ml:'റിപ്പോർട്ടിൽ നിന്ന് വീണ്ടും സമന്വയിപ്പിക്കുക',pa:'ਰਿਪੋਰਟ ਤੋਂ ਮੁੜ ਸਿੰਕ ਕਰੋ',or:'ରିପୋର୍ଟରୁ ପୁଣି ସିଙ୍କ କରନ୍ତୁ',as:'ৰিপৰ্টৰ পৰা পুনৰ ছিংক কৰক',ur:'رپورٹ سے دوبارہ سنک کریں',sa:'प्रतिवेदनात् पुनः संयोजयतु',ne:'रिपोर्टबाट पुनः सिङ्क गर्नुहोस्',kok:'रिपोर्टांतल्यान परत सिंक करात',mai:'रिपोर्ट सँ फेर जोड़ू',ks:'رپورٹس پیٹھ دوبارہ سنک کریو',sd:'رپورٽ مان ٻيهر سنڪ ڪريو',brx:'रिपोर्टनिफ्राय फिन सिंक खालाम',doi:'रिपोर्ट थमां दोबारा सिंक करो',mni:'রিপোর্টগী মথক্তা হন্না সিংক তৌরো',sat:'রিপোর্ট খোন সিংক দোহড়া'},
  soilFarmParameters:{en:'Soil & Farm Parameters',hi:'मिट्टी और खेत के मान',mr:'माती व शेताचे मापदंड',bn:'মাটি ও খামারের মান',te:'నేల మరియు పొలం పరామితులు',ta:'மண் மற்றும் பண்ணை அளவுருக்கள்',gu:'જમીન અને ખેતરના પરિમાણો',kn:'ಮಣ್ಣು ಮತ್ತು ಹೊಲದ ಅಂಶಗಳು',ml:'മണ്ണിന്റെയും കൃഷിയിടത്തിന്റെയും മാനങ്ങൾ',pa:'ਮਿੱਟੀ ਅਤੇ ਖੇਤ ਦੇ ਮਾਪਦੰਡ',or:'ମାଟି ଓ ଖେତର ମାନ',as:'মাটি আৰু খেতিৰ মান',ur:'مٹی اور کھیت کے پیرامیٹرز',sa:'मृदा-क्षेत्रमानानि',ne:'माटो र खेतका मापदण्ड',kok:'माती आनी शेताचे मापदंड',mai:'माटि आ खेतक मान',ks:'مٲٹی تہٕ کھیت ہُند معیار',sd:'مٽي ۽ کيت جا ماپ',brx:'माटि आरो फार्मनि मान',doi:'माटी ते खेत दे मापदंड',mni:'মাটী অমসুং ফার্মগী মাপ',sat:'মাটি আর খেত রে মান'},
  step1of2:{en:'Step 1 of 2',hi:'चरण 1 / 2',mr:'टप्पा 1 / 2',bn:'ধাপ ১ / ২',te:'దశ 1 / 2',ta:'படி 1 / 2',gu:'પગલું 1 / 2',kn:'ಹಂತ 1 / 2',ml:'ഘട്ടം 1 / 2',pa:'ਪੜਾਅ 1 / 2',or:'ପଦକ୍ଷେପ 1 / 2',as:'পদক্ষেপ ১ / ২',ur:'مرحلہ 1 / 2',sa:'चरणम् १ / २',ne:'चरण १ / २',kok:'टप्पो 1 / 2',mai:'चरण 1 / 2',ks:'مرحلہ ۱ / ۲',sd:'مرحلو 1 / 2',brx:'थाखो 1 / 2',doi:'चरण 1 / 2',mni:'ধাপ 1 / 2',sat:'ধাপ 1 / 2'},
  selectFarmLocation:{en:'Select Farm Location / Agricultural Belt',hi:'खेत का स्थान / कृषि क्षेत्र चुनें',mr:'शेताचे ठिकाण / कृषी पट्टा निवडा',bn:'খামারের স্থান / কৃষি অঞ্চল নির্বাচন করুন',te:'పొలం స్థానం / వ్యవసాయ ప్రాంతాన్ని ఎంచుకోండి',ta:'பண்ணை இடம் / வேளாண் பகுதியைத் தேர்ந்தெடுக்கவும்',gu:'ખેતરનું સ્થાન / કૃષિ વિસ્તાર પસંદ કરો',kn:'ಹೊಲದ ಸ್ಥಳ / ಕೃಷಿ ವಲಯ ಆಯ್ಕೆಮಾಡಿ',ml:'കൃഷിയിട സ്ഥലം / കാർഷിക മേഖല തിരഞ്ഞെടുക്കുക',pa:'ਖੇਤ ਦਾ ਸਥਾਨ / ਖੇਤੀਬਾੜੀ ਖੇਤਰ ਚੁਣੋ',or:'ଖେତ ସ୍ଥାନ / କୃଷି ଅଞ୍ଚଳ ବାଛନ୍ତୁ',as:'খেতিৰ স্থান / কৃষি অঞ্চল বাছক',ur:'کھیت کا مقام / زرعی علاقہ منتخب کریں',sa:'क्षेत्रस्थानं / कृषिक्षेत्रं चिनुत',ne:'खेतको स्थान / कृषि क्षेत्र छान्नुहोस्',kok:'शेताचें थळ / कृषी पट्टो निवडात',mai:'खेतक स्थान / कृषि क्षेत्र चुनू',ks:'کھیت ہُند مقام / زرعی علاقہ ژارِو',sd:'کيت جي جڳهه / زرعي علائقو چونڊيو',brx:'फार्मनि जायगा / फार्म जोनो सायखो',doi:'खेत दी थाह / कृषि पट्टा चुनो',mni:'ফার্মগী ফিৱম / কৃষি অঞ্চল খংদোকপা',sat:'খেত রে ঠাইন / চাষ রে এলাকা বাছাও'},
  accountSynced:{en:'Account Synced',hi:'खाता जुड़ा है',mr:'खाते जोडले आहे',bn:'অ্যাকাউন্ট যুক্ত',te:'ఖాతా అనుసంధానించబడింది',ta:'கணக்கு இணைக்கப்பட்டது',gu:'એકાઉન્ટ સિંક થયું',kn:'ಖಾತೆ ಸಂಪರ್ಕಿಸಲಾಗಿದೆ',ml:'അക്കൗണ്ട് സമന്വയിപ്പിച്ചു',pa:'ਖਾਤਾ ਸਿੰਕ ਕੀਤਾ ਗਿਆ',or:'ଖାତା ସିଙ୍କ ହୋଇଛି',as:'একাউণ্ট সংযুক্ত',ur:'اکاؤنٹ سنک ہے',sa:'लेखा संयोजितम्',ne:'खाता सिङ्क गरिएको',kok:'खातें सिंक जालें',mai:'खाता जुड़ल',ks:'اکاؤنٹ سنک چھُ',sd:'اڪائونٽ سنڪ ٿيل',brx:'अकाउन्ट सिंक',doi:'खाता सिंक ऐ',mni:'অ্যাকাউন্ট সিংক',sat:'আকাউন্ট সিংক'},
  locationHelp:{en:'Used to match regional agro-climatic zones and crop suitability benchmarks.',hi:'क्षेत्रीय कृषि-जलवायु और फसल उपयुक्तता के मानकों से मिलान करने के लिए उपयोग होता है।',mr:'प्रादेशिक कृषी-हवामान आणि पीक अनुकूलता मानकांशी जुळवण्यासाठी वापरले जाते.',bn:'আঞ্চলিক কৃষি-জলবায়ু ও ফসল উপযোগিতা মানের সঙ্গে মিলাতে ব্যবহার করা হয়।',te:'ప్రాంతీయ వ్యవసాయ-వాతావరణం మరియు పంట అనుకూలత ప్రమాణాలతో సరిపోల్చడానికి ఉపయోగిస్తారు.',ta:'பிராந்திய வேளாண்-காலநிலை மற்றும் பயிர் பொருத்தத்துடன் ஒப்பிட பயன்படுகிறது.',gu:'પ્રાદેશિક કૃષિ-આબોહવા અને પાક યોગ્યતા ધોરણો સાથે મેળ કરવા ઉપયોગ થાય છે.',kn:'ಪ್ರಾದೇಶಿಕ ಕೃಷಿ-ಹವಾಮಾನ ಮತ್ತು ಬೆಳೆ ಹೊಂದಾಣಿಕೆ ಮಾನದಂಡಗಳೊಂದಿಗೆ ಹೊಂದಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ.',ml:'പ്രാദേശിക കാർഷിക-കാലാവസ്ഥയും വിള അനുയോജ്യത മാനദണ്ഡങ്ങളും പൊരുത്തപ്പെടുത്താൻ ഉപയോഗിക്കുന്നു.',pa:'ਖੇਤਰੀ ਖੇਤੀ-ਮੌਸਮ ਅਤੇ ਫਸਲ ਅਨੁਕੂਲਤਾ ਮਾਪਦੰਡਾਂ ਨਾਲ ਮਿਲਾਉਣ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।',or:'ଆଞ୍ଚଳିକ କୃଷି-ଜଳବାୟୁ ଓ ଫସଲ ଉପଯୋଗିତା ମାନଦଣ୍ଡ ସହ ମେଳ କରିବାକୁ ବ୍ୟବହୃତ ହୁଏ।',as:'আঞ্চলিক কৃষি-জলবায়ু আৰু শস্য উপযোগিতা মানৰ সৈতে মিলাবলৈ ব্যৱহাৰ কৰা হয়।',ur:'علاقائی زرعی-آب و ہوا اور فصل کی موزونیت کے معیار سے ملانے کے لیے استعمال ہوتا ہے۔',sa:'प्रादेशिककृषि-जलवायुमण्डलस्य सस्ययोग्यतामानैः सह मेलयितुं प्रयुज्यते।',ne:'क्षेत्रीय कृषि-जलवायु र बाली उपयुक्तता मापदण्डसँग मिलाउन प्रयोग हुन्छ।',kok:'प्रादेशीक कृषी-हवामान आनी पीक अनुकूलताय जुळोवपाखातीर वापरतात.',mai:'क्षेत्रीय कृषि-जलवायु आ फसल उपयुक्तता मान सँ मिलाबै लेल उपयोग होइत अछि।',ks:'علاقٕچ زرعی آب و ہوا تہٕ فصلٕچ موزونیتس سۭتۍ میل کرنہٕ خٲطرٕ استعمال گژھان چھُ۔',sd:'علائقائي زرعي موسم ۽ فصل جي موزونيت جي معيار سان ملائڻ لاءِ استعمال ٿئي ٿو.',brx:'जोनारि फार्म-आबोहावा आरो फसल गोरलायनाय मानजों गोरोबनो बाहाय।',doi:'इलाके दे कृषि-मौसम ते फसल अनुकूलता मानक कन्नै मिलान लई ਵਰतदा ऐ।',mni:'এলাকাগী কৃষি-মরুম অমসুং ফসলগী চান্নবা মাপগা চান্ননা শিজিন্নায়।',sat:'এলাকা রে চাষ-মরসুম আর বাআড়ি মেল রে মাপ সাতে মিলাও।'},
  regionalBenchmarkActive:{en:'ICAR Regional Benchmark Active',hi:'ICAR क्षेत्रीय मानक सक्रिय है',mr:'ICAR प्रादेशिक मानक सक्रिय आहे',bn:'ICAR আঞ্চলিক মান সক্রিয়',te:'ICAR ప్రాంతీయ ప్రమాణం సక్రియంగా ఉంది',ta:'ICAR பிராந்திய அளவுகோல் செயல்பாட்டில் உள்ளது',gu:'ICAR પ્રાદેશિક ધોરણ સક્રિય છે',kn:'ICAR ಪ್ರಾದೇಶಿಕ ಮಾನದಂಡ ಸಕ್ರಿಯವಾಗಿದೆ',ml:'ICAR പ്രാദേശിക മാനദണ്ഡം സജീവമാണ്',pa:'ICAR ਖੇਤਰੀ ਮਾਪਦੰਡ ਸਰਗਰਮ ਹੈ',or:'ICAR ଆଞ୍ଚଳିକ ମାନଦଣ୍ଡ ସକ୍ରିୟ',as:'ICAR আঞ্চলিক মান সক্ৰিয়',ur:'ICAR علاقائی معیار فعال ہے',sa:'ICAR प्रादेशिकमानं सक्रियम्',ne:'ICAR क्षेत्रीय मापदण्ड सक्रिय छ',kok:'ICAR प्रादेशीक मानक सुरू आसा',mai:'ICAR क्षेत्रीय मान सक्रिय अछि',ks:'ICAR علاقٕچ معیار فعال چھُ',sd:'ICAR علائقائي معيار فعال آهي',brx:'ICAR जोनारि मान सक्रिय',doi:'ICAR क्षेत्रीय मानक चालू ऐ',mni:'ICAR এলাকাগী মাপ শিজিন্নারি',sat:'ICAR এলাকা রে মাপ চালু'},
  noSoilCardYet:{en:'No Soil Health Card Yet?',hi:'अभी मृदा स्वास्थ्य कार्ड नहीं है?',mr:'अजून मृदा आरोग्य कार्ड नाही?',bn:'এখনও মাটি স্বাস্থ্য কার্ড নেই?',te:'ఇంకా మట్టి ఆరోగ్య కార్డు లేదా?',ta:'இன்னும் மண் சுகாதார அட்டை இல்லையா?',gu:'હજુ માટી આરોગ્ય કાર્ડ નથી?',kn:'ಇನ್ನೂ ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಇಲ್ಲವೇ?',ml:'ഇനിയും മണ്ണ് ആരോഗ്യ കാർഡ് ഇല്ലേ?',pa:'ਹਾਲੇ ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਨਹੀਂ ਹੈ?',or:'ଏପର୍ଯ୍ୟନ୍ତ ମୃତ୍ତିକା ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ ନାହିଁ କି?',as:'এতিয়াও মাটি স্বাস্থ্য কাৰ্ড নাই নেকি?',ur:'ابھی مٹی صحت کارڈ نہیں ہے؟',sa:'अद्य मृदास्वास्थ्यपत्रं नास्ति किम्?',ne:'अहिले माटो स्वास्थ्य कार्ड छैन?',kok:'अजून माती आरोग्य कार्ड ना?',mai:'अखन माटि स्वास्थ्य कार्ड नहि अछि?',ks:'اَز کٲ مٲٹی صحت کارڈ چھُ نَہ؟',sd:'اڃا مٽي صحت ڪارڊ ناهي؟',brx:'दासिम फार्मनि माटि स्वास्थ्य कार्ड गैया?',doi:'अजें माटी सेहत कार्ड नेई ऐ?',mni:'হৌজিক মাটীগী হেল্থ কার্ড লৈত্রা?',sat:'এখন মাটি সাস্থ্য কার্ড বাংকুয়া?'},
  benchmarkCalibrated:{en:'Soil nutrients are calibrated with ICAR regional averages for',hi:'मिट्टी के पोषक तत्व ICAR क्षेत्रीय औसत के अनुसार समायोजित हैं:',mr:'मातीतील अन्नद्रव्ये ICAR प्रादेशिक सरासरीनुसार समायोजित आहेत:',bn:'মাটির পুষ্টি ICAR আঞ্চলিক গড় অনুযায়ী নির্ধারিত:',te:'నేల పోషకాలు ICAR ప్రాంతీయ సగటుల ప్రకారం సర్దుబాటు చేయబడ్డాయి:',ta:'மண் ஊட்டச்சத்துகள் ICAR பிராந்திய சராசரிக்கு ஏற்ப அமைக்கப்பட்டுள்ளன:',gu:'જમીનના પોષક તત્વો ICAR પ્રાદેશિક સરેરાશ મુજબ ગોઠવાયા છે:',kn:'ಮಣ್ಣಿನ ಪೋಷಕಾಂಶಗಳನ್ನು ICAR ಪ್ರಾದೇಶಿಕ ಸರಾಸರಿಗಳಂತೆ ಹೊಂದಿಸಲಾಗಿದೆ:',ml:'മണ്ണിലെ പോഷകങ്ങൾ ICAR പ്രാദേശിക ശരാശരിക്ക് അനുസരിച്ച് ക്രമീകരിച്ചിരിക്കുന്നു:',pa:'ਮਿੱਟੀ ਦੇ ਪੋਸ਼ਕ ਤੱਤ ICAR ਖੇਤਰੀ ਔਸਤ ਅਨੁਸਾਰ ਸੈੱਟ ਕੀਤੇ ਗਏ ਹਨ:',or:'ମାଟି ପୋଷକ ICAR ଆଞ୍ଚଳିକ ହାରାହାରି ଅନୁଯାୟୀ ସଜାଯାଇଛି:',as:'মাটিৰ পুষ্টি ICAR আঞ্চলিক গড় অনুসৰি ঠিক কৰা হৈছে:',ur:'مٹی کے غذائی اجزا ICAR علاقائی اوسط کے مطابق ترتیب دیے گئے ہیں:',sa:'मृदापोषकाः ICAR प्रादेशिकमध्यमानानुसारं समायोजिताः सन्ति:',ne:'माटोका पोषक तत्व ICAR क्षेत्रीय औसतअनुसार मिलाइएको छ:',kok:'मातींतले पोषक घटक ICAR प्रादेशीक सरासरी प्रमाणे जुळयले आसात:',mai:'माटिक पोषक ICAR क्षेत्रीय औसतक अनुसार समायोजित अछि:',ks:'مٲٹی ہٕند غذٲی اجزا ICAR علاقٕچ اوسطس مُطابق ترتیب دِتھ چھِ:',sd:'مٽي جا غذائي جزا ICAR علائقائي اوسط مطابق ترتيب ڏنا ويا آهن:',brx:'माटिनि पोषक ICAR जोनारि औसतजों गोरोब खालामनाय दं:',doi:'माटी दे पोषक ICAR क्षेत्रीय औसत मताबक सेट कीते गेदे न:',mni:'মাটীগী পুষ্টি ICAR এলাকাগী গড়গী মতুং ইনশুংনা শেমজিনরে:',sat:'মাটি রে পুষ্টি ICAR এলাকা রে গড় সাতে মিলাওয়া হে:'},
  adjustOrUpload:{en:'You can adjust these values manually or upload a lab test.',hi:'आप इन मानों को बदल सकते हैं या लैब रिपोर्ट अपलोड कर सकते हैं।',mr:'तुम्ही ही मूल्ये बदलू शकता किंवा प्रयोगशाळा अहवाल अपलोड करू शकता.',bn:'আপনি মানগুলি পরিবর্তন করতে বা ল্যাব রিপোর্ট আপলোড করতে পারেন।',te:'మీరు ఈ విలువలను మార్చవచ్చు లేదా ల్యాబ్ నివేదికను అప్‌లోడ్ చేయవచ్చు.',ta:'இந்த மதிப்புகளை மாற்றலாம் அல்லது ஆய்வக அறிக்கையைப் பதிவேற்றலாம்.',gu:'તમે આ મૂલ્યો બદલી શકો છો અથવા લેબ રિપોર્ટ અપલોડ કરી શકો છો.',kn:'ಈ ಮೌಲ್ಯಗಳನ್ನು ಬದಲಾಯಿಸಬಹುದು ಅಥವಾ ಲ್ಯಾಬ್ ವರದಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಬಹುದು.',ml:'ഈ മൂല്യങ്ങൾ മാറ്റുകയോ ലാബ് റിപ്പോർട്ട് അപ്‌ലോഡ് ചെയ്യുകയോ ചെയ്യാം.',pa:'ਤੁਸੀਂ ਇਹ ਮਾਪ ਬਦਲ ਸਕਦੇ ਹੋ ਜਾਂ ਲੈਬ ਰਿਪੋਰਟ ਅਪਲੋਡ ਕਰ ਸਕਦੇ ਹੋ।',or:'ଆପଣ ଏହି ମୂଲ୍ୟ ବଦଳାଇପାରିବେ କିମ୍ବା ଲାବ୍ ରିପୋର୍ଟ ଅପଲୋଡ୍ କରିପାରିବେ।',as:'আপুনি এই মান সলনি কৰিব পাৰে বা লেব প্ৰতিবেদন আপলোড কৰিব পাৰে।',ur:'آپ یہ قدریں بدل سکتے ہیں یا لیب رپورٹ اپ لوڈ کر سکتے ہیں۔',sa:'एतानि मानानि परिवर्तयितुं प्रयोगशालाप्रतिवेदनं अपलोड् कर्तुं वा शक्यते।',ne:'यी मानहरू परिवर्तन गर्न वा प्रयोगशाला रिपोर्ट अपलोड गर्न सक्नुहुन्छ।',kok:'ह्यो मोलां बदलूंक वा लॅब रिपोर्ट अपलोड करूंक शकता.',mai:'ई मान बदलि सकैत छी वा लैब रिपोर्ट अपलोड कऽ सकैत छी।',ks:'تُہۍ یِم قدر بدلِتھ یا لیب رپورٹ اپلوڈ کٔرِتھ ہیکیو۔',sd:'توهان هي قدرون بدلائي يا ليب رپورٽ اپلوڊ ڪري سگهو ٿا.',brx:'बे मानफोर सोलायनो एबा लाब रिपोर्ट अपलोड खालामनो हायो.',doi:'तुंदे एह मान बदली सकदे ओ जां लैब रिपोर्ट चढ़ाई सकदे ओ।',mni:'মসিগী মাপশিং হেনগৎপা নত্রগা ল্যাব রিপোর্ট আপলোড তৌবা যাই।',sat:'নোয়া মান বদলাও বা ল্যাব রিপোর্ট উঠাও।'},
  autoFillBenchmark:{en:'You can use verified ICAR regional soil benchmarks for',hi:'आप सत्यापित ICAR क्षेत्रीय मृदा मानक इस्तेमाल कर सकते हैं:',mr:'तुम्ही सत्यापित ICAR प्रादेशिक माती मानक वापरू शकता:',bn:'আপনি যাচাই করা ICAR আঞ্চলিক মাটি মান ব্যবহার করতে পারেন:',te:'ధృవీకరించిన ICAR ప్రాంతీయ నేల ప్రమాణాలను ఉపయోగించవచ్చు:',ta:'சரிபார்க்கப்பட்ட ICAR பிராந்திய மண் அளவுகோலைப் பயன்படுத்தலாம்:',gu:'ચકાસેલા ICAR પ્રાદેશિક જમીન ધોરણોનો ઉપયોગ કરી શકો છો:',kn:'ಪರಿಶೀಲಿಸಿದ ICAR ಪ್ರಾದೇಶಿಕ ಮಣ್ಣಿನ ಮಾನದಂಡಗಳನ್ನು ಬಳಸಬಹುದು:',ml:'പരിശോധിച്ച ICAR പ്രാദേശിക മണ്ണ് മാനദണ്ഡങ്ങൾ ഉപയോഗിക്കാം:',pa:'ਤੁਸੀਂ ਪ੍ਰਮਾਣਿਤ ICAR ਖੇਤਰੀ ਮਿੱਟੀ ਮਾਪਦੰਡ ਵਰਤ ਸਕਦੇ ਹੋ:',or:'ଯାଞ୍ଚିତ ICAR ଆଞ୍ଚଳିକ ମାଟି ମାନଦଣ୍ଡ ବ୍ୟବହାର କରିପାରିବେ:',as:'আপুনি পৰীক্ষিত ICAR আঞ্চলিক মাটি মান ব্যৱহাৰ কৰিব পাৰে:',ur:'آپ تصدیق شدہ ICAR علاقائی مٹی کے معیار استعمال کر سکتے ہیں:',sa:'सत्यापितानि ICAR प्रादेशिकमृदामानानि उपयोक्तुं शक्नोति:',ne:'प्रमाणित ICAR क्षेत्रीय माटो मापदण्ड प्रयोग गर्न सक्नुहुन्छ:',kok:'तुमी तपासिल्ले ICAR प्रादेशीक माती मानक वापरूंक शकतात:',mai:'अहाँ सत्यापित ICAR क्षेत्रीय माटि मान उपयोग कऽ सकैत छी:',ks:'تُہۍ تصدیق شُدٕ ICAR علاقٕچ مٲٹی معیار استعمال کٔرِتھ ہیکیو:',sd:'توهان تصديق ٿيل ICAR علائقائي مٽي معيار استعمال ڪري سگهو ٿا:',brx:'निरखाखौ ICAR जोनारि माटि मान बाहायनो हायो:',doi:'तुंदे जांचे-परखे ICAR क्षेत्रीय माटी मानक बरती सकदे ओ:',mni:'চেক তৌবা ICAR এলাকাগী মাটী মাপশিং শিজিন্নবা যাই:',sat:'ICAR এলাকা রে মাটি মাপ চেক কাতেয় বাআর।'},
  yourFarm:{en:'your farm',hi:'आपके खेत',mr:'तुमच्या शेतासाठी',bn:'আপনার খামার',te:'మీ పొలం',ta:'உங்கள் பண்ணை',gu:'તમારા ખેતર',kn:'ನಿಮ್ಮ ಹೊಲ',ml:'നിങ്ങളുടെ കൃഷിയിടം',pa:'ਤੁਹਾਡਾ ਖੇਤ',or:'ଆପଣଙ୍କ ଖେତ',as:'আপোনাৰ খেতি',ur:'آپ کا کھیت',sa:'भवतः क्षेत्रम्',ne:'तपाईंको खेत',kok:'तुमचें शेत',mai:'अहाँक खेत',ks:'تُہۍ ہُند کھیت',sd:'توهان جو کيت',brx:'नों फार्म',doi:'तुंदा खेत',mni:'নহাক্কী ফার্ম',sat:'আম খেত'},
  autoFillBenchmarkButton:{en:'Auto-fill Regional Soil Benchmark',hi:'क्षेत्रीय मृदा मानक भरें',mr:'प्रादेशिक माती मानक भरा',bn:'আঞ্চলিক মাটি মান পূরণ করুন',te:'ప్రాంతీయ నేల ప్రమాణం ఆటో-ఫిల్ చేయండి',ta:'பிராந்திய மண் அளவுகோலை தானாக நிரப்பவும்',gu:'પ્રાદેશિક જમીન ધોરણ આપમેળે ભરો',kn:'ಪ್ರಾದೇಶಿಕ ಮಣ್ಣಿನ ಮಾನದಂಡವನ್ನು ಸ್ವಯಂ ತುಂಬಿ',ml:'പ്രാദേശിക മണ്ണ് മാനദണ്ഡം സ്വയം പൂരിപ്പിക്കുക',pa:'ਖੇਤਰੀ ਮਿੱਟੀ ਮਾਪਦੰਡ ਆਪਣੇ ਆਪ ਭਰੋ',or:'ଆଞ୍ଚଳିକ ମାଟି ମାନଦଣ୍ଡ ଭରନ୍ତୁ',as:'আঞ্চলিক মাটি মান স্বয়ং পূৰণ কৰক',ur:'علاقائی مٹی کا معیار خود بھریں',sa:'प्रादेशिकमृदामानं स्वयमेव पूरयतु',ne:'क्षेत्रीय माटो मापदण्ड स्वतः भर्नुहोस्',kok:'प्रादेशीक माती मानक आपसूक भरात',mai:'क्षेत्रीय माटि मान स्वतः भरू',ks:'علاقٕچ مٲٹی معیار خودکار بھرو',sd:'علائقائي مٽي معيار پاڻ ڀريو',brx:'जोनारि माटि मान गोदान भराय',doi:'क्षेत्रीय माटी मानक आपूं भरो',mni:'এলাকাগী মাটী মাপ অটো-ফিল তৌরো',sat:'এলাকা রে মাটি মাপ আপনে ভরাও'},
  refreshBenchmark:{en:'Refresh ICAR Regional Soil Benchmark',hi:'ICAR क्षेत्रीय मृदा मानक फिर भरें',mr:'ICAR प्रादेशिक माती मानक ताजे करा',bn:'ICAR আঞ্চলিক মাটি মান আবার নিন',te:'ICAR ప్రాంతీయ నేల ప్రమాణం రিফ్రెష్ చేయండి',ta:'ICAR பிராந்திய மண் அளவுகோலைப் புதுப்பிக்கவும்',gu:'ICAR પ્રાદેશિક જમીન ધોરણ ફરી ભરો',kn:'ICAR ಪ್ರಾದೇಶಿಕ ಮಣ್ಣಿನ ಮಾನದಂಡವನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ',ml:'ICAR പ്രാദേശിക മണ്ണ് മാനദണ്ഡം പുതുക്കുക',pa:'ICAR ਖੇਤਰੀ ਮਿੱਟੀ ਮਾਪਦੰਡ ਤਾਜ਼ਾ ਕਰੋ',or:'ICAR ଆଞ୍ଚଳିକ ମାଟି ମାନଦଣ୍ଡ ରିଫ୍ରେଶ କରନ୍ତୁ',as:'ICAR আঞ্চলিক মাটি মান সতেজ কৰক',ur:'ICAR علاقائی مٹی کا معیار تازہ کریں',sa:'ICAR प्रादेशिकमृदामानं पुनः पूरयतु',ne:'ICAR क्षेत्रीय माटो मापदण्ड ताजा गर्नुहोस्',kok:'ICAR प्रादेशीक माती मानक ताजें करात',mai:'ICAR क्षेत्रीय माटि मान फेर भरू',ks:'ICAR علاقٕچ مٲٹی معیار تازٕ کریو',sd:'ICAR علائقائي مٽي معيار تازو ڪريو',brx:'ICAR जोनारि माटि मान फिन भराय',doi:'ICAR क्षेत्रीय माटी मानक फ्हेर भरो',mni:'ICAR এলাকাগী মাটী মাপ হন্না শেমজিনৌ',sat:'ICAR এলাকা মাটি মাপ দোহড়া ভরাও'},
  selectSoilType:{en:'Select Soil Type',hi:'मिट्टी का प्रकार चुनें',mr:'मातीचा प्रकार निवडा',bn:'মাটির ধরন নির্বাচন করুন',te:'నేల రకాన్ని ఎంచుకోండి',ta:'மண் வகையைத் தேர்ந்தெடுக்கவும்',gu:'જમીનનો પ્રકાર પસંદ કરો',kn:'ಮಣ್ಣಿನ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ',ml:'മണ്ണിന്റെ തരം തിരഞ്ഞെടുക്കുക',pa:'ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਚੁਣੋ',or:'ମାଟି ପ୍ରକାର ବାଛନ୍ତୁ',as:'মাটিৰ ধৰণ বাছক',ur:'مٹی کی قسم منتخب کریں',sa:'मृदाप्रकारं चिनुत',ne:'माटोको प्रकार छान्नुहोस्',kok:'मातीचो प्रकार निवडात',mai:'माटिक प्रकार चुनू',ks:'مٲٹی ہُند قٕسم ژارِو',sd:'مٽي جو قسم چونڊيو',brx:'माटिनि राइखो सायखो',doi:'माटी दा किस्म चुनो',mni:'মাটীগী মখল খংদোকপা',sat:'মাটি রে জাত বাছাও'},
  previousCrop:{en:'Previous Crop',hi:'पिछली फसल',mr:'मागील पीक',bn:'আগের ফসল',te:'మునుపటి పంట',ta:'முந்தைய பயிர்',gu:'પહેલાનો પાક',kn:'ಹಿಂದಿನ ಬೆಳೆ',ml:'മുൻ വിള',pa:'ਪਿਛਲੀ ਫਸਲ',or:'ପୂର୍ବ ଫସଲ',as:'আগৰ শস্য',ur:'پچھلی فصل',sa:'पूर्वसस्यम्',ne:'अघिल्लो बाली',kok:'फाटलें पीक',mai:'पछिला फसल',ks:'پٔٹھمٕت فصل',sd:'اڳيون فصل',brx:'गुबुन फसल',doi:'पिछली फसल',mni:'মমাংগী ফসল',sat:'মাদাং রে বাআড়ি'},
  previousCropHelp:{en:'Used to consider nutrient carryover and crop rotation benefits.',hi:'पोषक तत्वों के बचे प्रभाव और फसल चक्र के लाभ को ध्यान में रखने के लिए उपयोग होता है।',mr:'अन्नद्रव्यांचा शिल्लक परिणाम आणि पीक फेरपालटीचे फायदे विचारात घेण्यासाठी वापरले जाते.',bn:'পুষ্টির অবশিষ্ট প্রভাব ও ফসল পর্যায়ের সুবিধা বিবেচনা করতে ব্যবহার করা হয়।',te:'మిగిలిన పోషకాలు మరియు పంట మార్పిడి ప్రయోజనాలను పరిగణించడానికి ఉపయోగిస్తారు.',ta:'மீதமுள்ள ஊட்டச்சத்துகள் மற்றும் பயிர் சுழற்சி நன்மைகளை கருத்தில் கொள்ளப் பயன்படுகிறது.',gu:'બાકી રહેલા પોષક તત્વો અને પાક ફેરબદલીના લાભો ધ્યાનમાં લેવા ઉપયોગ થાય છે.',kn:'ಉಳಿದ ಪೋಷಕಾಂಶಗಳು ಮತ್ತು ಬೆಳೆ ಪರಿವರ್ತನೆಯ ಲಾಭಗಳನ್ನು ಪರಿಗಣಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ.',ml:'ശേഷിക്കുന്ന പോഷകങ്ങളും വിളപരിവർത്തനത്തിന്റെ ഗുണങ്ങളും പരിഗണിക്കാൻ ഉപയോഗിക്കുന്നു.',pa:'ਬਚੇ ਪੋਸ਼ਕ ਤੱਤਾਂ ਅਤੇ ਫਸਲ ਚੱਕਰ ਦੇ ਲਾਭਾਂ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖਣ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।',or:'ଅବଶିଷ୍ଟ ପୋଷକ ଓ ଫସଲ ପରିବର୍ତ୍ତନର ଲାଭ ବିଚାର ପାଇଁ ବ୍ୟବହୃତ ହୁଏ।',as:'বাকী পুষ্টি আৰু শস্য চক্ৰৰ সুবিধা বিবেচনা কৰিবলৈ ব্যৱহাৰ কৰা হয়।',ur:'باقی غذائی اجزا اور فصل کی گردش کے فائدے دیکھنے کے لیے استعمال ہوتا ہے۔',sa:'अवशिष्टपोषकाणां सस्यपरिवर्तनस्य च लाभं विचारयितुं प्रयुज्यते।',ne:'बाँकी पोषक तत्व र बाली चक्रका फाइदा विचार गर्न प्रयोग हुन्छ।',kok:'उरल्ली पोषक घटक आनी पीक फेरपालटीचे फायदें विचारांत घेवपाखातीर वापरतात.',mai:'बाँचल पोषक आ फसल चक्रक लाभक विचार लेल उपयोग होइत अछि।',ks:'باقی غذٲی اجزٕ تہٕ فصل گردشٕچ فٲیدٕ خیالہِ منٛز تھاونہٕ خٲطرٕ استعمال گژھان چھُ۔',sd:'باقي غذائي جزن ۽ فصل جي گردش جي فائدن کي نظر ۾ رکڻ لاءِ استعمال ٿئي ٿو.',brx:'उरलाय पोषक आरो फसल गोलायनायनि मोजांफोरखौ नायनो बाहाय।',doi:'बचे पोषक ते फसल बदली दे फायदे गिणने लई वरतदा ऐ।',mni:'থাজবা পুষ্টি অমসুং ফসল ঘূৰ্ণনগী মফম খংবা ৱারোল্লি শিজিন্নায়।',sat:'বাকী পুষ্টি আর বাআড়ি বদল রে মঙ্গল রে হিসাব তে শিজিন্নায়।'},
  soilNutrientAssay:{en:'Soil Nutrient Test',hi:'मिट्टी पोषक तत्व जांच',mr:'मातीतील अन्नद्रव्य तपासणी',bn:'মাটির পুষ্টি পরীক্ষা',te:'నేల పోషక పరీక్ష',ta:'மண் ஊட்டச்சத்து பரிசோதனை',gu:'જમીન પોષક પરીક્ષણ',kn:'ಮಣ್ಣಿನ ಪೋಷಕಾಂಶ ಪರೀಕ್ಷೆ',ml:'മണ്ണ് പോഷക പരിശോധന',pa:'ਮਿੱਟੀ ਪੋਸ਼ਕ ਜਾਂਚ',or:'ମାଟି ପୋଷକ ପରୀକ୍ଷା',as:'মাটিৰ পুষ্টি পৰীক্ষা',ur:'مٹی کے غذائی اجزا کی جانچ',sa:'मृदापोषकपरीक्षा',ne:'माटो पोषक परीक्षण',kok:'मातींतले पोषक तपासणी',mai:'माटि पोषक जाँच',ks:'مٲٹی غذٲی اجزٕ جانچ',sd:'مٽي غذائي جزن جي جاچ',brx:'माटि पोषक नायखाय',doi:'माटी दे पोषक दी जांच',mni:'মাটীগী পুষ্টি পরীক্ষা',sat:'মাটি পুষ্টি জাচাই'},
  evaluating:{en:'Evaluating agronomy rules...',hi:'कृषि नियमों का मूल्यांकन हो रहा है...',mr:'कृषी नियमांचे मूल्यांकन सुरू आहे...',bn:'কৃষি নিয়ম মূল্যায়ন হচ্ছে...',te:'వ్యవసాయ నియమాలను అంచనా వేస్తున్నాం...',ta:'வேளாண் விதிகளை மதிப்பிடுகிறது...',gu:'કૃષિ નિયમોનું મૂલ્યાંકન થઈ રહ્યું છે...',kn:'ಕೃಷಿ ನಿಯಮಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಾಗುತ್ತಿದೆ...',ml:'കാർഷിക നിയമങ്ങൾ വിലയിരുത്തുന്നു...',pa:'ਖੇਤੀ ਨਿਯਮਾਂ ਦਾ ਮੁਲਾਂਕਣ ਹੋ ਰਿਹਾ ਹੈ...',or:'କୃଷି ନିୟମ ମୂଲ୍ୟାଙ୍କନ ହେଉଛି...',as:'কৃষি নিয়ম মূল্যায়ন হৈ আছে...',ur:'زرعی اصولوں کا جائزہ لیا جا رہا ہے...',sa:'कृषिनियमाः मूल्याङ्किताः भवन्ति...',ne:'कृषि नियमहरू मूल्याङ्कन हुँदैछन्...',kok:'कृषी नेमांचें मोलांखन जाता...',mai:'कृषि नियमक मूल्यांकन भऽ रहल अछि...',ks:'زرعی اصولن ہُند جائزٕ گژھان چھُ...',sd:'زرعي قاعدن جو جائزو ورتو پيو وڃي...',brx:'फार्म नेमखौ नायखांनाय जाबाय...',doi:'कृषि नियमां दा मूल्यांकन होआ करदा ऐ...',mni:'কৃষি নিয়মগী মশিং তৌরি...',sat:'চাষ রে নিয়ম জাচাই কানায়...'},
  generateRecommendation:{en:'Generate Recommendation',hi:'सिफारिश बनाएं',mr:'शिफारस तयार करा',bn:'সুপারিশ তৈরি করুন',te:'సిఫారసు రూపొందించండి',ta:'பரிந்துரையை உருவாக்கவும்',gu:'ભલામણ બનાવો',kn:'ಶಿಫಾರಸು ರಚಿಸಿ',ml:'ശുപാർശ തയ്യാറാക്കുക',pa:'ਸਿਫਾਰਸ਼ ਬਣਾਓ',or:'ସୁପାରିଶ ତିଆରି କରନ୍ତୁ',as:'পৰামৰ্শ সৃষ্টি কৰক',ur:'سفارش بنائیں',sa:'सिफारिशां निर्मीयताम्',ne:'सिफारिस बनाउनुहोस्',kok:'शिफारस तयार करात',mai:'सिफारिश बनाउ',ks:'سفارش بنٲو',sd:'سفارش ٺاهيو',brx:'सिफारिस सायखो',doi:'सिफारश बनाओ',mni:'শিংজিনবা ৱারোল শেমজিনৌ',sat:'সুপারিশ বানা'},
  awaitingSoilData:{en:'Awaiting Soil & Farm Parameters',hi:'मिट्टी और खेत के डेटा की प्रतीक्षा',mr:'माती व शेताच्या डेटाची प्रतीक्षा',bn:'মাটি ও খামারের তথ্যের অপেক্ষায়',te:'నేల మరియు పొలం డేటా కోసం వేచి ఉంది',ta:'மண் மற்றும் பண்ணை தரவுக்காக காத்திருக்கிறது',gu:'જમીન અને ખેતરના ડેટાની રાહ જોવાઈ રહી છે',kn:'ಮಣ್ಣು ಮತ್ತು ಹೊಲದ ಡೇಟಾಕ್ಕಾಗಿ ಕಾಯುತ್ತಿದೆ',ml:'മണ്ണിന്റെയും കൃഷിയിടത്തിന്റെയും ഡാറ്റ കാത്തിരിക്കുന്നു',pa:'ਮਿੱਟੀ ਅਤੇ ਖੇਤ ਦੇ ਡਾਟੇ ਦੀ ਉਡੀਕ',or:'ମାଟି ଓ ଖେତ ତଥ୍ୟ ପାଇଁ ଅପେକ୍ଷା',as:'মাটি আৰু খেতিৰ তথ্যৰ অপেক্ষা',ur:'مٹی اور کھیت کے ڈیٹا کا انتظار',sa:'मृदा-क्षेत्रदत्तांशस्य प्रतीक्षा',ne:'माटो र खेतको डेटाको प्रतीक्षा',kok:'माती आनी शेत डेटाची वाट पळयता',mai:'माटि आ खेतक डेटाक प्रतीक्षा',ks:'مٲٹی تہٕ کھیت ہُند ڈیٹا آسہِ انتظار',sd:'مٽي ۽ کيت جي ڊيٽا جو انتظار',brx:'माटि आरो फार्म डाटा आव जोबोद',doi:'माटी ते खेत डेटा दी उडीक',mni:'মাটী অমসুং ফার্ম ডাটাগী ৱাকৎ',sat:'মাটি আর খেত ডাটা রে আড়ি'},
  uploadSoilCard:{en:'Upload Soil Health Card',hi:'मृदा स्वास्थ्य कार्ड अपलोड करें',mr:'मृदा आरोग्य कार्ड अपलोड करा',bn:'মাটি স্বাস্থ্য কার্ড আপলোড করুন',te:'మట్టి ఆరోగ్య కార్డు అప్‌లోడ్ చేయండి',ta:'மண் சுகாதார அட்டையைப் பதிவேற்றவும்',gu:'માટી આરોગ્ય કાર્ડ અપલોડ કરો',kn:'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',ml:'മണ്ണ് ആരോഗ്യ കാർഡ് അപ്‌ലോഡ് ചെയ്യുക',pa:'ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਅਪਲੋਡ ਕਰੋ',or:'ମୃତ୍ତିକା ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ ଅପଲୋଡ୍ କରନ୍ତୁ',as:'মাটি স্বাস্থ্য কাৰ্ড আপলোড কৰক',ur:'مٹی صحت کارڈ اپ لوڈ کریں',sa:'मृदास्वास्थ्यपत्रम् अपलोड् कुर्वन्तु',ne:'माटो स्वास्थ्य कार्ड अपलोड गर्नुहोस्',kok:'माती आरोग्य कार्ड अपलोड करात',mai:'माटि स्वास्थ्य कार्ड अपलोड करू',ks:'مٲٹی صحت کارڈ اپلوڈ کریو',sd:'مٽي صحت ڪارڊ اپلوڊ ڪريو',brx:'माटि स्वास्थ्य कार्ड अपलोड खालाम',doi:'माटी सेहत कार्ड अपलोड करो',mni:'মাটীগী হেল্থ কার্ড আপলোড তৌরো',sat:'মাটি সাস্থ্য কার্ড উঠাও'},
  loadSampleValues:{en:'Load Sample Values',hi:'नमूना मान लोड करें',mr:'नमुना मूल्ये लोड करा',bn:'নমুনা মান লোড করুন',te:'నమూనా విలువలు లోడ్ చేయండి',ta:'மாதிரி மதிப்புகளை ஏற்றவும்',gu:'નમૂના મૂલ્યો લોડ કરો',kn:'ಮಾದರಿ ಮೌಲ್ಯಗಳನ್ನು ಲೋಡ್ ಮಾಡಿ',ml:'സാമ്പിൾ മൂല്യങ്ങൾ ലോഡ് ചെയ്യുക',pa:'ਨਮੂਨਾ ਮਾਪ ਲੋਡ ਕਰੋ',or:'ନମୁନା ମୂଲ୍ୟ ଲୋଡ୍ କରନ୍ତୁ',as:'নমুনা মান লোড কৰক',ur:'نمونہ قدریں لوڈ کریں',sa:'नमूनामानानि भारयतु',ne:'नमुना मानहरू लोड गर्नुहोस्',kok:'नमुना मोलां लोड करात',mai:'नमूना मान लोड करू',ks:'نمونہ قدر لوڈ کریو',sd:'نموني قدرون لوڊ ڪريو',brx:'नमुना मान लोड खालाम',doi:'नमूना मान लोड करो',mni:'নমুনা মাপ লোড তৌরো',sat:'নমুনা মান উঠাও'},
  evaluatingAgronomy:{en:'Evaluating agronomic rules and crop fit...',hi:'कृषि नियमों और फसल अनुकूलता का मूल्यांकन हो रहा है...',mr:'कृषी नियम व पीक अनुकूलतेचे मूल्यांकन सुरू आहे...',bn:'কৃষি নিয়ম ও ফসলের উপযোগিতা মূল্যায়ন হচ্ছে...',te:'వ్యవసాయ నియమాలు మరియు పంట అనుకూలతను అంచనా వేస్తున్నాం...',ta:'வேளாண் விதிகள் மற்றும் பயிர் பொருத்தத்தை மதிப்பிடுகிறது...',gu:'કૃષિ નિયમો અને પાક યોગ્યતાનું મૂલ્યાંકન થઈ રહ્યું છે...',kn:'ಕೃಷಿ ನಿಯಮಗಳು ಮತ್ತು ಬೆಳೆ ಹೊಂದಾಣಿಕೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಾಗುತ್ತಿದೆ...',ml:'കാർഷിക നിയമങ്ങളും വിള അനുയോജ്യതയും വിലയിരുത്തുന്നു...',pa:'ਖੇਤੀ ਨਿਯਮਾਂ ਅਤੇ ਫਸਲ ਅਨੁਕੂਲਤਾ ਦਾ ਮੁਲਾਂਕਣ ਹੋ ਰਿਹਾ ਹੈ...',or:'କୃଷି ନିୟମ ଓ ଫସଲ ଉପଯୋଗିତା ମୂଲ୍ୟାଙ୍କନ ହେଉଛି...',as:'কৃষি নিয়ম আৰু শস্য উপযোগিতা মূল্যায়ন হৈ আছে...',ur:'زرعی اصولوں اور فصل کی موزونیت کا جائزہ لیا جا رہا ہے...',sa:'कृषिनियमेषु सस्ययोग्यतायां च मूल्याङ्कनं क्रियते...',ne:'कृषि नियम र बाली उपयुक्तताको मूल्याङ्कन हुँदैछ...',kok:'कृषी नेम आनी पीक अनुकूलताचें मोलांखन जाता...',mai:'कृषि नियम आ फसल उपयुक्तताक मूल्यांकन भऽ रहल अछि...',ks:'زرعی اصولن تہٕ فصلٕچ موزونیت ہُند جائزٕ گژھان چھُ...',sd:'زرعي قاعدن ۽ فصل جي موزونيت جو جائزو ورتو پيو وڃي...',brx:'फार्म नेम आरो फसल गोरलायनायखौ नायखांनाय जाबाय...',doi:'कृषि नियम ते फसल अनुकूलता दा मूल्यांकन होआ करदा ऐ...',mni:'কৃষি নিয়ম অমসুং ফসলগী চান্নবা শিংজিন্নবা...',sat:'চাষ রে নিয়ম আর বাআড়ি মেল জাচাই কানায়...'},
  comparingSoil:{en:'Comparing soil N-P-K, pH compatibility and seasonal margins',hi:'मिट्टी N-P-K, pH अनुकूलता और मौसम के लाभ की तुलना की जा रही है',mr:'मातीतील N-P-K, pH अनुकूलता व हंगामी नफा यांची तुलना केली जात आहे',bn:'মাটির N-P-K, pH উপযোগিতা ও মরসুমি লাভ তুলনা করা হচ্ছে',te:'నేల N-P-K, pH అనుకూలత మరియు సీజన్ లాభాలను పోల్చుతున్నాం',ta:'மண் N-P-K, pH பொருத்தம் மற்றும் பருவ லாபத்தை ஒப்பிடுகிறது',gu:'જમીન N-P-K, pH યોગ્યતા અને ઋતુ નફાની તુલના થાય છે',kn:'ಮಣ್ಣಿನ N-P-K, pH ಹೊಂದಾಣಿಕೆ ಮತ್ತು ಹಂಗಾಮಿ ಲಾಭವನ್ನು ಹೋಲಿಸಲಾಗುತ್ತಿದೆ',ml:'മണ്ണിലെ N-P-K, pH അനുയോജ്യത, സീസൺ ലാഭം എന്നിവ താരതമ്യം ചെയ്യുന്നു',pa:'ਮਿੱਟੀ N-P-K, pH ਅਨੁਕੂਲਤਾ ਅਤੇ ਮੌਸਮੀ ਮੁਨਾਫ਼ੇ ਦੀ ਤੁਲਨਾ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ',or:'ମାଟି N-P-K, pH ଉପଯୋଗିତା ଓ ଋତୁ ଲାଭ ତୁଳନା କରାଯାଉଛି',as:'মাটিৰ N-P-K, pH উপযোগিতা আৰু ঋতুভিত্তিক লাভ তুলনা কৰা হৈছে',ur:'مٹی N-P-K، pH موزونیت اور موسمی منافع کا موازنہ کیا جا رہا ہے',sa:'मृदा-N-P-K, pH-सामञ्जस्यं ऋतुलाभं च तुल्यते',ne:'माटो N-P-K, pH अनुकूलता र मौसमी नाफा तुलना हुँदैछ',kok:'मातींतले N-P-K, pH अनुकूलता आनी हंगामी नफा हांची तुलना जाता',mai:'माटिक N-P-K, pH उपयुक्तता आ मौसमी लाभक तुलना भऽ रहल अछि',ks:'مٲٹی N-P-K، pH موزونیت تہٕ موسمٕچ منٛافعہٕ ہُند موازنہ گژھان چھُ',sd:'مٽي N-P-K، pH موزونيت ۽ موسمي نفعي جو مقابلو ڪيو پيو وڃي',brx:'माटिनि N-P-K, pH गोरोबलायनाय आरो समनि नाफाखौ नायबाय',doi:'माटी N-P-K, pH अनुकूलता ते मौसम नफे दी तुलना होआ करदी ऐ',mni:'মাটীগী N-P-K, pH চান্নবা অমসুং মরুমগী লাভগী তুলনা তৌরি',sat:'মাটি N-P-K, pH মেল আর মরসুম নাফা রে তুলনা কানায়'},
  lowAffinityExcluded:{en:'Low-affinity crops (<70%) are excluded',hi:'कम अनुकूल फसलें (<70%) हटा दी गई हैं',mr:'कमी अनुकूल पिके (<70%) वगळली आहेत',bn:'কম উপযোগী ফসল (<70%) বাদ দেওয়া হয়েছে',te:'తక్కువ అనుకూలత పంటలు (<70%) తొలగించబడ్డాయి',ta:'குறைந்த பொருத்தம் கொண்ட பயிர்கள் (<70%) நீக்கப்பட்டுள்ளன',gu:'ઓછી યોગ્યતા ધરાવતા પાકો (<70%) દૂર કરાયા છે',kn:'ಕಡಿಮೆ ಹೊಂದಾಣಿಕೆಯ ಬೆಳೆಗಳನ್ನು (<70%) ತೆಗೆದುಹಾಕಲಾಗಿದೆ',ml:'കുറഞ്ഞ അനുയോജ്യതയുള്ള വിളകൾ (<70%) ഒഴിവാക്കി',pa:'ਘੱਟ ਅਨੁਕੂਲ ਫਸਲਾਂ (<70%) ਹਟਾਈਆਂ ਗਈਆਂ ਹਨ',or:'କମ ଉପଯୋଗୀ ଫସଲ (<70%) ବାହାର କରାଯାଇଛି',as:'কম উপযোগী শস্য (<70%) বাদ দিয়া হৈছে',ur:'کم موزوں فصلیں (<70%) خارج کر دی گئی ہیں',sa:'अल्पयोग्यसस्यानि (<70%) वर्जितानि',ne:'कम उपयुक्त बालीहरू (<70%) हटाइएका छन्',kok:'कमी अनुकूल पीकां (<70%) वगळल्यात',mai:'कम उपयुक्त फसल (<70%) हटा देल गेल अछि',ks:'کم موزوں فصلہٕ (<70%) خارج کرنہٕ آیہِ',sd:'گهٽ موزون فصلون (<70%) خارج ڪيون ويون آهن',brx:'गोरलायै नङा फसलफोरखौ (<70%) बोखारबाय',doi:'घट्ट मेल फसलां (<70%) कड्डी दिती गेदियां न',mni:'কম চান্নবা ফসলশিং (<70%) লৌথোক্লে',sat:'কম মেল বাআড়ি (<70%) বাদ দিয়া হে'},
};

export function translateCropUiTerm(key: string, lang: LanguageCode = 'en'): string {
  const extra = CROP_UI_EXTRA[key];
  if (extra) return extra[lang] || extra.en || key;
  const entry = CROP_UI_TERMS[key];
  if (!entry) return key;
  return entry[lang] || entry.en || key;
}

export function translateCropCategory(category: string, lang: LanguageCode = 'en'): string {
  const keyMap: Record<string,string> = {'Cereal':'categoryCereal','Pulse':'categoryPulse','Oilseed':'categoryOilseed','Cash Crop':'categoryCash','Vegetable':'categoryVegetable','Horticulture':'categoryHorticulture','Exotic Superfood':'categoryExotic','Plantation':'categoryPlantation','Spices':'categorySpices'};
  return translateCropUiTerm(keyMap[category] || '', lang) || category;
}

export function translateCropRisk(risk: string, lang: LanguageCode = 'en'): string {
  const map: Record<string, Partial<Record<LanguageCode,string>>> = {
    Low:{en:'Low',hi:'कम',mr:'कमी',bn:'কম',te:'తక్కువ',ta:'குறைவு',gu:'ઓછું',kn:'ಕಡಿಮೆ',ml:'കുറവ്',pa:'ਘੱਟ',or:'କମ',as:'কম',ur:'کم',sa:'न्यूनम्',ne:'कम',kok:'कमी',mai:'कम',ks:'کم',sd:'گهٽ',brx:'कम',doi:'घट्ट',mni:'কম',sat:'ᱠᱚᱢ'},
    Moderate:{en:'Moderate',hi:'मध्यम',mr:'मध्यम',bn:'মাঝারি',te:'మధ్యస్థ',ta:'மிதமான',gu:'મધ્યમ',kn:'ಮಧ್ಯಮ',ml:'മിതമായ',pa:'ਦਰਮਿਆਨਾ',or:'ମଧ୍ୟମ',as:'মধ্যম',ur:'درمیانہ',sa:'मध्यमम्',ne:'मध्यम',kok:'मध्यम',mai:'मध्यम',ks:'درمیانہ',sd:'وچولو',brx:'मध्यम',doi:'मध्यम',mni:'মাঝারি',sat:'ᱢᱟᱡᱷᱤ'},
    High:{en:'High',hi:'उच्च',mr:'जास्त',bn:'উচ্চ',te:'అధిక',ta:'அதிகம்',gu:'વધારે',kn:'ಹೆಚ್ಚು',ml:'ഉയർന്ന',pa:'ਉੱਚਾ',or:'ଅଧିକ',as:'উচ্চ',ur:'زیادہ',sa:'उच्चम्',ne:'उच्च',kok:'जास्त',mai:'उच्च',ks:'وٲل',sd:'وڌيڪ',brx:'उच्च',doi:'उच्च',mni:'উচ্চ',sat:'ᱵᱟᱹᱲᱦᱤ'},
  };
  return map[risk]?.[lang] || risk;
}

export function translateWaterNeed(value: string, lang: LanguageCode = 'en'): string {
  const map: Record<string, Partial<Record<LanguageCode,string>>> = {
    Low:{en:'Low',hi:'कम',mr:'कमी',bn:'কম',te:'తక్కువ',ta:'குறைவு',gu:'ઓછું',kn:'ಕಡಿಮೆ',ml:'കുറവ്',pa:'ਘੱਟ',or:'କମ',as:'কম',ur:'کم',sa:'न्यूनम्',ne:'कम',kok:'कमी',mai:'कम',ks:'کم',sd:'گهٽ',brx:'कम',doi:'घट्ट',mni:'কম',sat:'ᱠᱚᱢ'},
    Medium:{en:'Medium',hi:'मध्यम',mr:'मध्यम',bn:'মাঝারি',te:'మధ్యస్థ',ta:'நடுத்தரம்',gu:'મધ્યમ',kn:'ಮಧ್ಯಮ',ml:'മിതമായ',pa:'ਦਰਮਿਆਨਾ',or:'ମଧ୍ୟମ',as:'মজলীয়া',ur:'درمیانہ',sa:'मध्यमम्',ne:'मध्यम',kok:'मध्यम',mai:'मध्यम',ks:'درمیانہ',sd:'وچولو',brx:'मध्यम',doi:'मध्यम',mni:'মাঝারি',sat:'ᱢᱟᱡᱷᱤ'},
    High:{en:'High',hi:'अधिक',mr:'जास्त',bn:'উচ্চ',te:'అధిక',ta:'அதிகம்',gu:'વધારે',kn:'ಹೆಚ್ಚು',ml:'കൂടുതൽ',pa:'ਵੱਧ',or:'ଅଧିକ',as:'অধিক',ur:'زیادہ',sa:'उच्चम्',ne:'उच्च',kok:'जास्त',mai:'अधिक',ks:'وٲل',sd:'وڌيڪ',brx:'अधिक',doi:'अधिक',mni:'অধিক',sat:'ᱵᱟᱹᱲᱦᱤ'},
  };
  return map[value]?.[lang] || value;
}

export function localizedCropFitReason(crop: RankedCropRecommendationLike, lang: LanguageCode = 'en'): string {
  const soil = crop.soilType || '';
  const ph = crop.ph;
  const n = crop.n;
  const cropName = translateCropName(crop.cropName, lang);
  const reason: Record<LanguageCode,string> = {
    en:`${cropName} matches the entered soil and season conditions. Soil pH ${ph} and available nitrogen ${n} kg/ha are included in this recommendation.`,
    hi:`${cropName} आपके दर्ज मिट्टी और मौसम की स्थिति के अनुसार उपयुक्त है। मिट्टी का pH ${ph} और उपलब्ध नाइट्रोजन ${n} kg/ha इस सिफारिश में शामिल हैं।`,
    mr:`${cropName} तुमच्या नोंदवलेल्या माती व हंगामाच्या परिस्थितीशी जुळते. मातीचा pH ${ph} आणि उपलब्ध नत्र ${n} kg/ha या शिफारसीत समाविष्ट आहे।`,
    bn:`${cropName} আপনার দেওয়া মাটি ও মরসুমের অবস্থার সঙ্গে উপযুক্ত। মাটির pH ${ph} এবং উপলব্ধ নাইট্রোজেন ${n} kg/ha এই সুপারিশে বিবেচনা করা হয়েছে।`,
    te:`${cropName} మీరు నమోదు చేసిన నేల మరియు సీజన్ పరిస్థితులకు సరిపోతుంది. నేల pH ${ph} మరియు అందుబాటులో ఉన్న నత్రజని ${n} kg/ha ఈ సిఫారసులో పరిగణించబడ్డాయి.`,
    ta:`${cropName} நீங்கள் பதிவு செய்த மண் மற்றும் பருவ நிலைகளுக்கு ஏற்றது. மண் pH ${ph} மற்றும் கிடைக்கும் நைட்ரஜன் ${n} kg/ha இந்த பரிந்துரையில் கணக்கில் கொள்ளப்பட்டுள்ளன.`,
    gu:`${cropName} તમે દાખલ કરેલી જમીન અને ઋતુની સ્થિતિને અનુકૂળ છે. જમીનનું pH ${ph} અને ઉપલબ્ધ નાઇટ્રોજન ${n} kg/ha આ ભલામણમાં સામેલ છે.`,
    kn:`${cropName} ನೀವು ನಮೂದಿಸಿದ ಮಣ್ಣು ಮತ್ತು ಹಂಗಾಮಿನ ಪರಿಸ್ಥಿತಿಗಳಿಗೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ. ಮಣ್ಣಿನ pH ${ph} ಮತ್ತು ಲಭ್ಯ ನೈಟ್ರೋಜನ್ ${n} kg/ha ಈ ಶಿಫಾರಸಿನಲ್ಲಿ ಪರಿಗಣಿಸಲಾಗಿದೆ.`,
    ml:`${cropName} നിങ്ങൾ നൽകിയ മണ്ണിന്റെയും സീസണിന്റെയും സാഹചര്യങ്ങൾക്ക് അനുയോജ്യമാണ്. മണ്ണിന്റെ pH ${ph}, ലഭ്യമായ നൈട്രജൻ ${n} kg/ha എന്നിവ ഈ ശുപാർശയിൽ ഉൾപ്പെടുത്തിയിട്ടുണ്ട്.`,
    pa:`${cropName} ਤੁਹਾਡੇ ਦਰਜ ਕੀਤੇ ਮਿੱਟੀ ਅਤੇ ਮੌਸਮ ਦੀਆਂ ਸਥਿਤੀਆਂ ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਹੈ। ਮਿੱਟੀ ਦਾ pH ${ph} ਅਤੇ ਉਪਲਬਧ ਨਾਈਟ੍ਰੋਜਨ ${n} kg/ha ਇਸ ਸਿਫਾਰਸ਼ ਵਿੱਚ ਸ਼ਾਮਲ ਹਨ।`,
    or:`${cropName} ଆପଣ ଦେଇଥିବା ମାଟି ଓ ଋତୁର ପରିସ୍ଥିତି ସହିତ ଉପଯୁକ୍ତ। ମାଟିର pH ${ph} ଏବଂ ଉପଲବ୍ଧ ନାଇଟ୍ରୋଜେନ ${n} kg/ha ଏହି ସୁପାରିଶରେ ବିଚାର କରାଯାଇଛି।`,
    as:`${cropName} আপুনি দিয়া মাটি আৰু ঋতুৰ পৰিস্থিতিৰ সৈতে উপযুক্ত। মাটিৰ pH ${ph} আৰু উপলব্ধ নাইট্ৰজেন ${n} kg/ha এই পৰামৰ্শত ধৰা হৈছে।`,
    ur:`${cropName} آپ کی درج کردہ مٹی اور موسم کی صورتحال کے مطابق موزوں ہے۔ مٹی کا pH ${ph} اور دستیاب نائٹروجن ${n} kg/ha اس سفارش میں شامل ہیں۔`,
    sa:`${cropName} भवता निर्दिष्टमृदायाः ऋतोः च परिस्थितिभ्यः अनुकूलम् अस्ति। मृदायाः pH ${ph} तथा उपलब्धनाइट्रोजन ${n} kg/ha अस्यां सिफारिशायां समाविष्टौ स्तः।`,
    ne:`${cropName} तपाईंले प्रविष्ट गर्नुभएको माटो र मौसमको अवस्थासँग उपयुक्त छ। माटोको pH ${ph} र उपलब्ध नाइट्रोजन ${n} kg/ha यस सिफारिसमा समावेश छन्।`,
    kok:`${cropName} तुमी नोंद केल्ल्या मातये आनी हंगामाच्या परिस्थितीक योग्य आसा. मातयेचो pH ${ph} आनी उपलब्ध नायट्रोजन ${n} kg/ha ह्या शिफारसींत धरला आसा.`,
    mai:`${cropName} अहाँ द्वारा दर्ज माटि आ मौसमक स्थिति अनुसार उपयुक्त अछि। माटिक pH ${ph} आ उपलब्ध नाइट्रोजन ${n} kg/ha एहि सिफारिशमे शामिल अछि।`,
    ks:`${cropName} تُہۍ درج کٔرمُت مٲٹی تہٕ موسمٕچ حالتہِ مُطابق موزوں چھُ۔ مٲٹی ہُند pH ${ph} تہٕ دستیاب نائٹروجن ${n} kg/ha یہِ سفارشس منٛز شامل چھِ۔`,
    sd:`${cropName} توھان جي داخل ڪيل مٽي ۽ موسم جي حالتن سان مناسب آھي. مٽي جو pH ${ph} ۽ موجود نائٽروجن ${n} kg/ha هن سفارش ۾ شامل آھن.`,
    brx:`${cropName} नोंद खालामनाय माटि आरो समनि जाथायजों गोरोब। माटिनि pH ${ph} आरो उपलब्ध नाइट्रोजन ${n} kg/ha बे सिफारिसआव सामिल दं।`,
    doi:`${cropName} तुंदे दर्ज कीती माटी ते मौसम दी हालतां कन्नै ठीक मेल खांदी ऐ। माटी दा pH ${ph} ते उपलब्ध नाइट्रोजन ${n} kg/ha इस सिफारश च शामल ऐ।`,
    mni:`${cropName} নহাক্না মাটী অমসুং মরুমগী ফিৱমগা চান্না. মাটীগী pH ${ph} অমসুং লৈবা নাইট্রোজেন ${n} kg/ha অসি মখোয়গী শিংজিনগী ৱারোল অসিদা শমিল লৈ।`,
    sat:`${cropName} আম দারেকান মাটি আর মরসুম রে অবস্থা সাতে মানান। মাটি রে pH ${ph} আর মেলেন নাইট্রোজেন ${n} kg/ha নে এ সুপারিশ রে সামিল।`,
  };
  return reason[lang] || reason.en;
}

export type RankedCropRecommendationLike = { cropName:string; soilType?:string; ph:number; n:number };
