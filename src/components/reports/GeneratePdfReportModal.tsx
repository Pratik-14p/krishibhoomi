import React, { useState, useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  X,
  CheckCircle2,
  Calendar,
  Layers,
  Sprout,
  ShieldCheck,
  TrendingUp,
  Coins,
  Compass,
  AlertCircle,
  Globe,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../../locales/types';
import {
  translateCropName,
  translateNutrientLevel,
  translateSoilParameter,
  translateFertilizerName,
  translateFertilizerMethod,
  translatePestName,
  translateStrategyPhase,
  translateCostProfitLabel,
  translateMarketMetric,
  getSoilConditionSummary,
  getLanguageName,
} from '../../utils/agriI18n';
import { soilAnalysisService } from '../../services/soilAnalysisService';

interface GeneratePdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLanguage?: LanguageCode;
}

export const GeneratePdfReportModal: React.FC<GeneratePdfReportModalProps> = ({
  isOpen,
  onClose,
  defaultLanguage,
}) => {
  const { user } = useAuth();
  const { language: currentAppLang, t } = useI18n();
  const [reportLang, setReportLang] = useState<LanguageCode>(defaultLanguage || currentAppLang);
  const [isPrinting, setIsPrinting] = useState(false);
  const printContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // The legacy print template below contains fixed crop scores, yield, cost,
  // market and soil values. Do not present it as a farmer-specific report.
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="report-unavailable-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <section className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 id="report-unavailable-title" className="text-lg font-bold text-gray-800">{t('common.dataUnavailable')}</h2>
        <p className="mt-2 text-sm text-gray-600">{t('common.serverError')}</p>
        <button onClick={onClose} className="mt-4 rounded-lg bg-[#2E7D32] px-4 py-2 text-sm font-semibold text-white">{t('common.cancel')}</button>
      </section>
    </div>
  );

  // Active analysis data from storage
  const activeSoil = soilAnalysisService.getActiveAnalysis(user);
  const soilParams = activeSoil.parameters;
  const healthScore = activeSoil.healthScore || 78;
  const sampleName = activeSoil.sampleName || 'Farm Plot Primary Soil Test';
  const reportDate = activeSoil.analyzedAt || new Date().toLocaleDateString('en-GB');
  const reportId = `KB-REP-${Date.now().toString().slice(-8)}`;

  // Translations for Report Sections in chosen reportLang
  const farmerName = user?.name || 'Farmer';
  const farmerMobile = user?.mobile || '+91 98765 43210';
  const farmerLocation = user?.location || 'Nagpur, Maharashtra';
  const farmAcres = user?.farmArea || 5.0;
  const soilType = user?.soilType || 'Black Cotton Soil (Regur)';

  // Key Crop Recommendations translated
  const topCrop1 = translateCropName('Wheat', reportLang);
  const topCrop2 = translateCropName('Chickpea', reportLang);
  const topCrop3 = translateCropName('Mustard', reportLang);

  // Soil status
  const nStatus = translateNutrientLevel(soilParams.nitrogen.status, reportLang);
  const pStatus = translateNutrientLevel(soilParams.phosphorus.status, reportLang);
  const kStatus = translateNutrientLevel(soilParams.potassium.status, reportLang);
  const ocStatus = translateNutrientLevel(soilParams.organicCarbon.status, reportLang);

  // Localized Headings
  const headings = {
    en: {
      title: 'Agricultural Advisory & Farm Diagnostic Report',
      subtitle: 'Farmer-specific soil measurements and agricultural advisory',
      farmerInfo: '1. Farmer & Holding Information',
      soilAnalysis: '2. Soil Health Card Diagnostic Analysis',
      cropRec: '3. Crop Suitability & Allocation Plan',
      fertRec: '4. Precision Fertilizer Management (NPK Schedule)',
      pestAdv: '5. Integrated Pest Management & Bio-Shield Advisory',
      yieldPred: '6. Yield Forecast & Agronomic Drivers',
      costProfit: '7. Cost, Revenue & Net Surplus Ledger',
      marketAnalysis: '8. APMC Mandi Market Intelligence & MSP Benchmark',
      scenarios: '9. Multi-Crop Scenario Comparative Simulation',
      strategy: '10. Personalized 5-Phase Farm Execution Strategy',
      verification: '11. Regulatory Compliance & ICAR Verification',
      printBtn: 'Print / Save as PDF',
      downloadTxt: 'Download Text Summary',
      langLabel: 'Generate Report In:',
    },
    hi: {
      title: 'कृषि परामर्श एवं मृदा निदान रिपोर्ट',
      subtitle: 'आईसीएआर-मानक स्मार्ट कृषि मृदा, फसल, उर्वरक एवं रणनीति ऑडिट',
      farmerInfo: '१. किसान एवं जोत का विवरण',
      soilAnalysis: '२. मृदा स्वास्थ्य कार्ड नैदानिक विश्लेषण',
      cropRec: '३. फसल उपयुक्तता एवं आवंटन योजना',
      fertRec: '४. सटीक उर्वरक प्रबंधन (एनपीके विभाजन अनुसूची)',
      pestAdv: '५. एकीकृत कीट प्रबंधन एवं जैव-सुरक्षा परामर्श',
      yieldPred: '६. उपज पूर्वानुमान एवं प्रमुख कारक',
      costProfit: '७. लागत, आय एवं शुद्ध लाभ लेखा',
      marketAnalysis: '८. कृषि उपज मंडी भाव एवं एमएसपी तुलना',
      scenarios: '९. बहु-फसल परिदृश्य तुलनात्मक अध्ययन',
      strategy: '१०. व्यक्तिगत ५-चरणीय कृषि कार्ययोजना',
      verification: '११. नियामक अनुपालन एवं आईसीएआर सत्यापन',
      printBtn: 'प्रिंट करें / पीडीएफ सेव करें',
      downloadTxt: 'टेक्स्ट सारांश डाउनलोड करें',
      langLabel: 'रिपोर्ट की भाषा चुनें:',
    },
    mr: {
      title: 'कृषी सल्लागार व जमीन आरोग्य तपासणी अहवाल',
      subtitle: 'आयसीएआर-प्रमाणित स्मार्ट शेती माती, पीक, खत व धोरण लेखापरीक्षण',
      farmerInfo: '१. शेतकरी व शेतजमीन तपशील',
      soilAnalysis: '२. मृदा आरोग्य पत्रिका व पोषकद्रव्य विश्लेषण',
      cropRec: '३. पीक निवड व शिफारस योजना',
      fertRec: '४. सूक्ष्म खत व्यवस्थापन व वेळापत्रक',
      pestAdv: '५. एकात्मिक कीड व रोग नियंत्रण सल्ला',
      yieldPred: '६. अपेक्षित उत्पादन अंदाज व घटक',
      costProfit: '७. उत्पादन खर्च, उत्पन्न व निव्वळ नफा ताळेबंद',
      marketAnalysis: '८. कृषी उत्पन्न बाजार समिती (APMC) भाव व हमीभाव तुलना',
      scenarios: '९. पीक तुलनात्मक विश्लेषण (काय-जर मॉडेल)',
      strategy: '१०. वैयक्तिक ५-टप्प्यांची शेती कृती योजना',
      verification: '११. शासकीय मानके व आयसीएआर पडताळणी',
      printBtn: 'प्रिंट करा / पीडीएफ सेव्ह करा',
      downloadTxt: 'मजकूर सारांश डाऊनलोड करा',
      langLabel: 'अहवालाची भाषा निवडा:',
    },
    bn: {
      title: 'কৃষি পরামর্শ ও মৃত্তিকা স্বাস্থ্য প্রতিবেদন',
      subtitle: 'আইসিএআর মানসম্মত স্মার্ট কৃষি মৃত্তিকা, ফসল ও সার কৌশল নিরীক্ষা',
      farmerInfo: '১. কৃষক ও জমির বিবরণ',
      soilAnalysis: '২. মৃত্তিকা স্বাস্থ্য কার্ড ও পুষ্টি উপাদান বিশ্লেষণ',
      cropRec: '৩. ফসলের উপযুক্ততা ও বরাদ্দ পরিকল্পনা',
      fertRec: '৪. সুনির্দিষ্ট সার ব্যবস্থাপনা ও সময়সূচি',
      pestAdv: '৫. সমন্বিত বালাই ও রোগ ব্যবস্থাপনা নির্দেশিকা',
      yieldPred: '৬. ফলন পূর্বাভাস ও প্রভাবকসমূহ',
      costProfit: '৭. চাষাবাদ ব্যয়, রাজস্ব ও নীট মুনাফা বিবরণী',
      marketAnalysis: '৮. এপিএমসি মান্ডি বাজার ও এমএসপি তুলনামূলক তথ্য',
      scenarios: '৯. বহু-ফসল পরিস্থিতি তুলনামূলক সমীক্ষা',
      strategy: '১০. ব্যক্তিগত ৫-ধাপের কৃষি বাস্তবায়ন কৌশল',
      verification: '১১. নিয়ন্ত্রক সম্মতি ও আইসিএআর যাচাইকরণ',
      printBtn: 'প্রিন্ট / পিডিএফ সংরক্ষণ করুন',
      downloadTxt: 'টেক্সট সারসংক্ষেপ ডাউনলোড করুন',
      langLabel: 'প্রতিবেদনের ভাষা নির্বাচন করুন:',
    },
    te: {
      title: 'వ్యవసాయ సలహా మరియు నేల పరీక్ష నివేదిక',
      subtitle: 'ICAR ప్రామాణిక స్మార్ట్ వ్యవసాయ నేల, పంట, ఎరువులు & వ్యూహ ఆడిట్',
      farmerInfo: '1. రైతు మరియు భూమి సమాచారం',
      soilAnalysis: '2. నేల ఆరోగ్య కార్డు మరియు పోషకాల విశ్లేషణ',
      cropRec: '3. అనుకూల పంటల ఎంపిక మరియు కేటాయింపు',
      fertRec: '4. సమగ్ర ఎరువుల నిర్వహణ ప్రణాళిక (NPK)',
      pestAdv: '5. సమగ్ర సస్యరక్షణ మరియు పురుగుమందుల సలహా',
      yieldPred: '6. దిగుబడి అంచనా మరియు కీలక కారకాలు',
      costProfit: '7. సాగు ఖర్చులు, రాబడి మరియు నికర లాభం',
      marketAnalysis: '8. APMC మార్కెట్ ధరలు మరియు MSP విశ్లేషణ',
      scenarios: '9. బహుళ పంటల అనుకరణ అధ్యయనం',
      strategy: '10. వ్యక్తిగతీకరించిన 5-దశల వ్యవసాయ వ్యూహం',
      verification: '11. నియంత్రణ ప్రమాణాలు & ICAR ధృవీకరణ',
      printBtn: 'ప్రింట్ చేయండి / PDF సేవ్ చేయండి',
      downloadTxt: 'టెక్స్ట్ సారాంశం డౌన్‌లోడ్',
      langLabel: 'నివేదిక భాషను ఎంచుకోండి:',
    },
    ta: {
      title: 'வேளாண் ஆலோசனை மற்றும் மண் பரிசோதனை அறிக்கை',
      subtitle: 'ICAR தரநிலை ஸ்மார்ட் விவசாய மண், பயிர், உர மேலாண்மை தணிக்கை',
      farmerInfo: '1. விவசாயி மற்றும் நில விவரங்கள்',
      soilAnalysis: '2. மண் வள அட்டை மற்றும் ஊட்டச்சத்து பகுப்பாய்வு',
      cropRec: '3. பயிர் தேர்வு மற்றும் பரிந்துரை திட்டம்',
      fertRec: '4. துல்லிய உர மேலாண்மை கால அட்டவணை (NPK)',
      pestAdv: '5. ஒருங்கிணைந்த பூச்சி மற்றும் நோய் மேலாண்மை',
      yieldPred: '6. மகசூல் முன்கணிப்பு மற்றும் முக்கிய காரணிகள்',
      costProfit: '7. சாகுபடி செலவு, வருமானம் மற்றும் நிகர லாபம்',
      marketAnalysis: '8. ஒழுங்குமுறை விற்பனைக்கூட விலை & MSP ஒப்பீடு',
      scenarios: '9. பல பயிர் ஒப்பீட்டு மாதிரி ஆய்வு',
      strategy: '10. தனிப்பயனாக்கப்பட்ட 5-கட்ட வேளாண் உத்தி',
      verification: '11. அரசு வழிகாட்டுதல் & ICAR சான்றளிப்பு',
      printBtn: 'அச்சிடுக / PDF சேமிக்கவும்',
      downloadTxt: 'உரை சுருக்கம் பதிவிறக்குக',
      langLabel: 'அறிக்கையின் மொழியைத் தேர்ந்தெடுக்கவும்:',
    },
    gu: {
      title: 'કૃષિ સલાહ અને જમીન આરોગ્ય ચકાસણી અહેવાલ',
      subtitle: 'ICAR પ્રમાણિત સ્માર્ટ ફાર્મિંગ જમીન, પાક, ખાતર અને વ્યૂહાત્મક ઓડિટ',
      farmerInfo: '૧. ખેડૂત અને જમીનની વિગત',
      soilAnalysis: '૨. સોઈલ હેલ્થ કાર્ડ અને પોષકતત્વોનું વિશ્લેષણ',
      cropRec: '૩. પાકની પસંદગી અને ફાળવણી આયોજન',
      fertRec: '૪. ચોકસાઈપૂર્વક ખાતર વ્યવસ્થાપન (NPK સમયપત્રક)',
      pestAdv: '૫. સંકલિત જીવાત નિયંત્રણ અને જૈવ-સુરક્ષા સલાહ',
      yieldPred: '૬. ઉત્પાદન અનુમાન અને મુખ્ય પરિબળો',
      costProfit: '૭. ખેતી ખર્ચ, આવક અને ચોખ્ખો નફો',
      marketAnalysis: '૮. એપીએમસી માર્કેટ યાર્ડ ભાવ અને એમએસપી સરખામણી',
      scenarios: '૯. વિવિધ પાક પરિસ્થિતિ સરખામણી અભ્યાસ',
      strategy: '૧૦. વ્યક્તિગત ૫-તબક્કાનું ખેતી આયોજન',
      verification: '૧૧. સરકારી માપદંડ અને ICAR ચકાસણી',
      printBtn: 'પ્રિન્ટ કરો / પીડીએફ સેવ કરો',
      downloadTxt: 'ટેક્સ્ટ સારાંશ ડાઉનલોડ કરો',
      langLabel: 'રિપોર્ટની ભાષા પસંદ કરો:',
    },
    kn: {
      title: 'ಕೃಷಿ ಸಲಹೆ ಮತ್ತು ಮಣ್ಣು ಆರೋಗ್ಯ ತಪಾಸಣಾ ವರದಿ',
      subtitle: 'ICAR ಗುಣಮಟ್ಟದ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಮಣ್ಣು, ಬೆಳೆ, ರಸಗೊಬ್ಬರ ಮತ್ತು ಕಾರ್ಯತಂತ್ರ ಲೆಕ್ಕಪರಿಶೋಧನೆ',
      farmerInfo: '1. ರೈತ ಮತ್ತು ಜಮೀನಿನ ವಿವರಗಳು',
      soilAnalysis: '2. ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಮತ್ತು ಪೋಷಕಾಂಶ ವಿಶ್ಲೇಷಣೆ',
      cropRec: '3. ಸೂಕ್ತ ಬೆಳೆ ಆಯ್ಕೆ ಮತ್ತು ಹಂಚಿಕೆ ಯೋಜನೆ',
      fertRec: '4. ನಿಖರ ರಸಗೊಬ್ಬರ ನಿರ್ವಹಣೆ ವೇಳಾಪಟ್ಟಿ (NPK)',
      pestAdv: '5. ಸಮಗ್ರ ಕೀಟ ಮತ್ತು ರೋಗ ನಿರ್ವಹಣಾ ಸಲಹೆ',
      yieldPred: '6. ಇಳುವರಿ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಪ್ರಮುಖ ಅಂಶಗಳು',
      costProfit: '7. ಕೃಷಿ ವೆಚ್ಚ, ಆದಾಯ ಮತ್ತು ನಿವ್ವಳ ಲಾಭ',
      marketAnalysis: '8. ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ದರಗಳು ಮತ್ತು MSP ಹೋಲಿಕೆ',
      scenarios: '9. ವಿವಿಧ ಬೆಳೆ ಸನ್ನಿವೇಶ ತುಲನಾತ್ಮಕ ಅಧ್ಯಯನ',
      strategy: '10. ವೈಯಕ್ತಿಕ 5-ಹಂತದ ಕೃಷಿ ಕಾರ್ಯತಂತ್ರ',
      verification: '11. ನಿಯಂತ್ರಕ ಮಾನದಂಡಗಳು ಮತ್ತು ICAR ದೃಢೀಕರಣ',
      printBtn: 'ಮುದ್ರಿಸಿ / PDF ಉಳಿಸಿ',
      downloadTxt: 'ಪಠ್ಯ ಸಾರಾಂಶ ಡೌನ್‌ಲೋಡ್',
      langLabel: 'ವರದಿಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
    },
    pa: {
      title: 'ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਅਤੇ ਮਿੱਟੀ ਸਿਹਤ ਜਾਂਚ ਰਿਪੋਰਟ',
      subtitle: 'ICAR ਮਿਆਰ ਸਮਾਰਟ ਖੇਤੀ ਮਿੱਟੀ, ਫ਼ਸਲ, ਖਾਦ ਅਤੇ ਰਣਨੀਤੀ ਆਡਿਟ',
      farmerInfo: '1. ਕਿਸਾਨ ਅਤੇ ਜ਼ਮੀਨ ਦਾ ਵੇਰਵਾ',
      soilAnalysis: '2. ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਅਤੇ ਪੋਸ਼ਕ ਤੱਤ ਵਿਸ਼ਲੇਸ਼ਣ',
      cropRec: '3. ਫ਼ਸਲ ਅਨੁਕੂਲਤਾ ਅਤੇ ਵੰਡ ਯੋਜਨਾ',
      fertRec: '4. ਸ਼ੁੱਧ ਖਾਦ ਪ੍ਰਬੰਧਨ (NPK ਕਿਸ਼ਤਾਂ)',
      pestAdv: '5. ਏਕੀਕ੍ਰਿਤ ਕੀਟ ਪ੍ਰਬੰਧਨ ਅਤੇ ਜੈਵਿਕ ਸੁਰੱਖਿਆ ਸਲਾਹ',
      yieldPred: '6. ਝਾੜ ਅਨੁਮਾਨ ਅਤੇ ਮੁੱਖ ਕਾਰਕ',
      costProfit: '7. ਲਾਗਤ, ਆਮਦਨ ਅਤੇ ਸ਼ੁੱਧ ਮੁਨਾਫ਼ਾ ਬਹੀ-ਖਾਤਾ',
      marketAnalysis: '8. ਦਾਣਾ ਮੰਡੀ ਭਾਅ ਅਤੇ MSP ਤੁਲਨਾ',
      scenarios: '9. ਬਹੁ-ਫ਼ਸਲੀ ਤੁਲਨਾਤਮਕ ਮਾਡਲ',
      strategy: '10. ਨਿੱਜੀ 5-ਪੜਾਵੀ ਖੇਤੀ ਕਾਰਜ ਯੋਜਨਾ',
      verification: '11. ਸਰਕਾਰੀ ਮਾਪਦੰਡ ਅਤੇ ICAR ਪ੍ਰਮਾਣਿਕਤਾ',
      printBtn: 'ਪ੍ਰਿੰਟ ਕਰੋ / PDF ਸੇਵ ਕਰੋ',
      downloadTxt: 'ਟੈਕਸਟ ਸੰਖੇਪ ਡਾਊਨਲੋਡ ਕਰੋ',
      langLabel: 'ਰਿਪੋਰਟ ਦੀ ਭਾਸ਼ਾ ਚੁਣੋ:',
    },
  };

  const h = (headings as any)[reportLang] || headings.en;

  // Handle Print and PDF Export with Unicode Font Injection
  const handlePrint = () => {
    setIsPrinting(true);

    const printableContent = printContainerRef.current?.innerHTML;
    if (!printableContent) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="${reportLang}">
      <head>
        <meta charset="utf-8">
        <title>Krishibhoomi_Farm_Report_${reportId}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700;800&family=Noto+Sans:wght@400;600;700&family=Noto+Sans+Bengali:wght@400;700&family=Noto+Sans+Devanagari:wght@400;700&family=Noto+Sans+Gujarati:wght@400;700&family=Noto+Sans+Kannada:wght@400;700&family=Noto+Sans+Malayalam:wght@400;700&family=Noto+Sans+Oriya:wght@400;700&family=Noto+Sans+Tamil:wght@400;700&family=Noto+Sans+Telugu:wght@400;700&family=Noto+Sans+Gurmukhi:wght@400;700&display=swap');

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Noto Sans', 'Noto Sans Devanagari', 'Noto Sans Bengali', 'Noto Sans Tamil', 'Noto Sans Telugu', 'Noto Sans Gujarati', 'Noto Sans Kannada', 'Noto Sans Malayalam', 'Noto Sans Gurmukhi', 'Noto Sans Oriya', 'Mukta', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #263238;
            background: #fff;
            padding: 16px;
            font-size: 11px;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          h1, h2, h3, h4, h5 {
            color: #1b5e20;
            margin-bottom: 4px;
            font-weight: 800;
          }
          .report-header {
            border-bottom: 2px solid #2e7d32;
            padding-bottom: 12px;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .section {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 10px 14px;
            margin-bottom: 12px;
            page-break-inside: avoid;
            background: #ffffff;
          }
          .section-title {
            font-size: 13px;
            font-weight: 800;
            color: #1b5e20;
            border-bottom: 1px solid #e8f5e9;
            padding-bottom: 4px;
            margin-bottom: 8px;
          }
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .grid-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 8px;
          }
          .badge {
            display: inline-block;
            padding: 2px 6px;
            background: #e8f5e9;
            color: #2e7d32;
            border-radius: 4px;
            font-weight: 700;
            font-size: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
            font-size: 10.5px;
          }
          th, td {
            border: 1px solid #e0e0e0;
            padding: 5px 8px;
            text-align: left;
          }
          th {
            background-color: #f1f8e9;
            color: #2e7d32;
            font-weight: 700;
          }
          .footer-sign {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #546e7a;
          }
          @media print {
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        ${printableContent}
      </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setIsPrinting(false);
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 600);
  };

  const handleDownloadTxt = () => {
    const textReport = `========================================================================
KRISHIBHOOMI AI AGRICULTURAL ADVISORY & SOIL AUDIT REPORT
Report ID: ${reportId}
Issued on: ${reportDate} | Language: ${getLanguageName(reportLang)} (${reportLang})
========================================================================

${h.farmerInfo}
------------------------------------------------------------------------
Farmer: ${farmerName}
Mobile: ${farmerMobile}
Holding: ${farmAcres} Acres
Location: ${farmerLocation}
Soil Class: ${soilType}

${h.soilAnalysis}
------------------------------------------------------------------------
Sample Name: ${sampleName}
Health Score: ${healthScore} / 100
Available Nitrogen (N): ${soilParams.nitrogen.value} ${soilParams.nitrogen.unit} [${nStatus}]
Available Phosphorus (P): ${soilParams.phosphorus.value} ${soilParams.phosphorus.unit} [${pStatus}]
Available Potassium (K): ${soilParams.potassium.value} ${soilParams.potassium.unit} [${kStatus}]
Soil Reaction (pH): ${soilParams.ph.value}
Organic Carbon (OC): ${soilParams.organicCarbon.value}% [${ocStatus}]

${h.cropRec}
------------------------------------------------------------------------
- Crop recommendations: Not included because no saved recommendation result was supplied.



${h.fertRec}
------------------------------------------------------------------------
- Fertilizer guidance: Not included. Generate it from a saved soil report and crop selection.




${h.pestAdv}
------------------------------------------------------------------------



- Pest guidance: Not included. Submit observed symptoms for a cautious IPM assessment.

${h.yieldPred}
------------------------------------------------------------------------
- Yield prediction: Not available; no validated farm-specific forecast was supplied.



${h.costProfit}
------------------------------------------------------------------------
- Profit analysis: Not available; no actual user-entered costs, yield and selling price were supplied.




${h.marketAnalysis}
------------------------------------------------------------------------
- Market prices: Not available; no live market-price provider is configured.




${h.strategy}
------------------------------------------------------------------------




- Personalized strategy: Not included because no saved strategy was supplied.

${h.verification}
------------------------------------------------------------------------
This report does not constitute official laboratory certification or ICAR endorsement.
Issued via Krishibhoomi Autonomous Agriculture Platform.
========================================================================`;

    const blob = new Blob([textReport], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Krishibhoomi_Report_${reportLang}_${reportId}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-pdf-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
        {/* Top Control Bar */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7FBF7]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E7D32]">
                Multilingual PDF Report Generator
              </span>
            </div>
            <h2 id="modal-pdf-title" className="text-xl sm:text-2xl font-black text-[#37474F] tracking-tight">
              {h.title}
            </h2>
            <p className="text-xs text-gray-500">{h.subtitle}</p>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-[#C8E6C9] rounded-xl px-3 py-1.5 shadow-2xs">
              <Globe className="w-4 h-4 text-[#2E7D32]" />
              <label htmlFor="report-language-select" className="text-xs font-bold text-gray-700 whitespace-nowrap">
                {h.langLabel}
              </label>
              <select
                id="report-language-select"
                value={reportLang}
                onChange={(e) => setReportLang(e.target.value as LanguageCode)}
                className="text-xs font-bold text-[#2E7D32] bg-transparent focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50/50">
          <div
            ref={printContainerRef}
            className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-xs max-w-3xl mx-auto space-y-6 text-[#263238]"
          >
            {/* Header / Watermark Banner */}
            <div className="border-b-2 border-[#2E7D32] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#2E7D32] text-white flex items-center justify-center font-black text-sm">
                    KB
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-[#1B5E20] tracking-tight">
                      KRISHIBHOOMI SMART AGRI AI
                    </h1>
                    <p className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">
                      Farmer-provided soil report and advisory
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right text-[11px] text-gray-500">
                <p>
                  <strong>Report ID:</strong> {reportId}
                </p>
                <p>
                  <strong>Date:</strong> {reportDate}
                </p>
                <p>
                  <strong>Language:</strong>{' '}
                  <span className="font-bold text-[#2E7D32]">{getLanguageName(reportLang)}</span>
                </p>
              </div>
            </div>

            {/* 1. Farmer Information */}
            <div className="border border-gray-200 rounded-xl p-4 bg-[#FBFDFB]">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#1B5E20] border-b border-gray-100 pb-2 mb-3">
                {h.farmerInfo}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">Farmer Name</span>
                  <span className="font-bold text-gray-800">{farmerName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Mobile Number</span>
                  <span className="font-bold text-gray-800">{farmerMobile}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Farm Area</span>
                  <span className="font-bold text-gray-800">{farmAcres} Acres</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Location</span>
                  <span className="font-bold text-gray-800">{farmerLocation}</span>
                </div>
              </div>
            </div>

            {/* 2. Soil Analysis */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#1B5E20]">
                  {h.soilAnalysis}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F5E9] text-[#2E7D32]">
                  Health Score: {healthScore} / 100
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-3">
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-gray-500 text-[10px] block">Nitrogen (N)</span>
                  <span className="font-bold text-gray-800">
                    {soilParams.nitrogen.value} {soilParams.nitrogen.unit}
                  </span>{' '}
                  <span className="text-[10px] font-bold text-amber-700">({nStatus})</span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-gray-500 text-[10px] block">Phosphorus (P)</span>
                  <span className="font-bold text-gray-800">
                    {soilParams.phosphorus.value} {soilParams.phosphorus.unit}
                  </span>{' '}
                  <span className="text-[10px] font-bold text-emerald-700">({pStatus})</span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-gray-500 text-[10px] block">Potassium (K)</span>
                  <span className="font-bold text-gray-800">
                    {soilParams.potassium.value} {soilParams.potassium.unit}
                  </span>{' '}
                  <span className="text-[10px] font-bold text-emerald-700">({kStatus})</span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-gray-500 text-[10px] block">Reaction (pH)</span>
                  <span className="font-bold text-gray-800">{soilParams.ph.value}</span>{' '}
                  <span className="text-[10px] text-gray-500">(Neutral-Slight Alkaline)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-gray-500 text-[10px] block">Organic Carbon (OC)</span>
                  <span className="font-bold text-gray-800">{soilParams.organicCarbon.value}%</span>{' '}
                  <span className="text-[10px] font-bold text-emerald-700">({ocStatus})</span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-gray-500 text-[10px] block">Soil Classification</span>
                  <span className="font-bold text-gray-800">{soilType}</span>
                </div>
              </div>
            </div>

            {/* 3. Crop Recommendations */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#1B5E20] border-b border-gray-100 pb-2 mb-3">
                {h.cropRec}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#F7FBF7] text-[#2E7D32] border-b border-gray-200">
                      <th className="py-2 px-3">Crop Variety</th>
                      <th className="py-2 px-3">Suitability Score</th>
                      <th className="py-2 px-3">Yield Forecast</th>
                      <th className="py-2 px-3 text-right">Net Profit / Acre</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100"><tr><td className="py-3 px-3" colSpan={4}>No saved crop recommendation result is available for this report.</td></tr></tbody>
                </table>
              </div>
            </div>

            {/* 4. Fertilizer Recommendation */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#1B5E20] border-b border-gray-100 pb-2 mb-3">
                {h.fertRec}
              </h3>
              <p className="text-xs text-gray-600">No saved fertilizer recommendation is available. Generate guidance from a verified soil report and selected crop.</p>
            </div>

            {/* 5. Pesticide Advisory */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#1B5E20] border-b border-gray-100 pb-2 mb-3">
                {h.pestAdv}
              </h3>
              <p className="text-xs text-gray-600">No pest diagnosis or treatment is included. Submit observed symptoms for an IPM assessment and confirm with a local KVK expert.</p>
            </div>

            {/* 6. Yield Forecast */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#1B5E20] border-b border-gray-100 pb-2 mb-3">
                {h.yieldPred}
              </h3>
              <p className="text-xs text-gray-600">No validated farm-specific yield prediction was supplied for this report.</p>
            </div>

            {/* 7. Cost / Profit Analysis */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#1B5E20] border-b border-gray-100 pb-2 mb-3">
                {h.costProfit}
              </h3>
              <p className="text-xs text-gray-600">No profit figures are shown because actual user-entered costs, yield and selling price were not supplied.</p>
            </div>

            {/* 8. Market Analysis */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#1B5E20] border-b border-gray-100 pb-2 mb-3">
                {h.marketAnalysis}
              </h3>
              <p className="text-xs text-gray-600">Live mandi prices are unavailable because no live market-price provider is configured.</p>
            </div>

            {/* 9. Scenario Results */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#1B5E20] border-b border-gray-100 pb-2 mb-3">
                {h.scenarios}
              </h3>
              <p className="text-xs text-gray-600">No scenario comparison was supplied. Run the simulator with a saved soil report and actual scenario inputs.</p>
            </div>

            {/* 10. Personalized 5-Phase Strategy */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#1B5E20] border-b border-gray-100 pb-2 mb-3">
                {h.strategy}
              </h3>
              <p className="text-xs text-gray-600">No personalized strategy was supplied for this report. Generate one using the saved soil report and farm details.</p>
            </div>

            {/* 11. Verification & Compliance Sign-Off */}
            <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-gray-400">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Award className="w-4 h-4 text-[#2E7D32]" />
                <span>{h.verification} • Advisory report; not a laboratory certificate or ICAR endorsement</span>
              </div>
              <div>Generated via Krishibhoomi Autonomous Agriculture System</div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Selected Language:{' '}
            <strong className="text-gray-800">
              {getLanguageName(reportLang)} ({reportLang.toUpperCase()})
            </strong>{' '}
            • Unicode Font Rendering Guaranteed
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadTxt}
              className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-gray-500" />
              <span>{h.downloadTxt}</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-black shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{h.printBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
