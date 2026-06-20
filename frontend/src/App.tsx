import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const API_URL = "http://127.0.0.1:8000";

// Inline SVG Icons for absolute reliability without external library dependencies
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);
const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const ScanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/><path d="M12 7v10"/></svg>
);
const DropletsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/></svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
);
const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  analysis_type?: string;
  metrics?: any;
  recommendations?: any;
  ingredients?: any;
  summary?: any;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'skin-scan' | 'ing-scan' | 'routine' | 'encyclopedia'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Halo Cantik! ✨ Selamat datang di **GlowSkin AI**. Saya adalah asisten kecantikan personal Anda. Unggah foto wajah Anda untuk melakukan analisis kulit mendalam, atau foto label botol skincare untuk memindai tingkat kecocokan kandungannya dengan kulit Anda! Ada yang ingin ditanyakan hari ini?'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [skinType, setSkinType] = useState<string>('acne_prone');
const [skinProfile, setSkinProfile] = useState<any>({
  analyzed: false,
  hydration: null,
  sebum: null,
  sensitivity: null,
  acne: null,
  explanation: 'Belum ada analisis. Unggah foto wajah untuk memulai pemindaian kulit.'
});
  
  const [ingredientAnalysis, setIngredientAnalysis] = useState<any>(null);
  const [routineData, setRoutineData] = useState<any>(null);
  
  // Image attachments
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedImageName, setSelectedImageName] = useState<string>('');
  const [selectedImageType, setSelectedImageType] = useState<'face' | 'ingredients' | ''>('');
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [backendStatus, setBackendStatus] = useState<any>({ status: 'checking', ollama_connection: 'disconnected' });
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedImage]);

  // Check backend and fetch initial routine recommendations on load
  useEffect(() => {
    checkBackendStatus();
    fetchRecommendations(skinType);
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/health`);
      if (response.ok) {
       const data = await response.json();

console.log("API RESPONSE:", data);
        setBackendStatus(data);
      } else {
        setBackendStatus({ status: 'offline', ollama_connection: 'disconnected' });
      }
    } catch (error) {
      setBackendStatus({ status: 'offline', ollama_connection: 'disconnected' });
    }
  };

  const fetchRecommendations = async (type: string) => {
    try {
      const response = await fetch(`/api/rag/recommendations?skin_type=${type}`);
      if (response.ok) {
        const data = await response.json();
        setRoutineData(data);
      } else {
        useMockRecommendations(type);
      }
    } catch (error) {
      useMockRecommendations(type);
    }
  };

  const useMockRecommendations = (type: string) => {
    // Elegant fallbacks if API is offline
    const mockRoutines: Record<string, any> = {
      acne_prone: {
        skin_type: 'acne_prone',
        tips: [
          'Gunakan pembersih wajah gel lembut dua kali sehari untuk membersihkan minyak tanpa merusak skin barrier.',
          'Gunakan spot treatment mengandung Tea Tree Oil atau Benzoyl Peroxide langsung di area berjerawat.',
          'Lakukan eksfoliasi secara rutin menggunakan BHA (Salicylic Acid) 2-3 kali seminggu.'
        ],
        recommended_ingredients: [
          { name: 'Salicylic Acid', benefits: ['Eksfoliasi pori-pori', 'Mengurangi komedo'], tips: 'Gunakan 2-3 kali seminggu malam hari.' },
          { name: 'Niacinamide', benefits: ['Memudarkan bekas jerawat', 'Mengontrol minyak'], tips: 'Aman pagi dan malam hari.' },
          { name: 'Centella Asiatica', benefits: ['Menenangkan jerawat meradang'], tips: 'Gunakan dalam toner/moisturizer.' }
        ],
        products: [
          { name: 'Glow Facial Wash Cica + Panthenol', category: 'Cleanser', brand: 'GlowSkin Lab', key_ingredients: ['Centella Asiatica', 'Panthenol'] },
          { name: 'Acne Clearing Liquid BHA 2%', category: 'Toner', brand: 'GlowSkin Lab', key_ingredients: ['Salicylic Acid'] },
          { name: 'Barrier Recovery Cream 3:1:1', category: 'Moisturizer', brand: 'GlowSkin Lab', key_ingredients: ['Ceramides', 'Squalane'] },
          { name: 'Ultra Shield Physical Sunscreen SPF 50', category: 'Sunscreen', brand: 'GlowSkin Lab', key_ingredients: ['Zinc Oxide'] }
        ]
      },
      oily: {
        skin_type: 'oily',
        tips: [
          'Gunakan pelembap bertekstur gel ringan agar kulit terhidrasi tanpa terasa berat.',
          'Gunakan kertas minyak (blotting paper) hanya jika sangat mendesak agar kulit tidak memproduksi minyak lebih banyak.',
          'Double cleansing di malam hari sangat penting untuk membersihkan sisa sebum.'
        ],
        recommended_ingredients: [
          { name: 'Niacinamide', benefits: ['Mengontrol minyak', 'Mengecilkan pori-pori'], tips: 'Bagus untuk pemakaian pagi/malam.' },
          { name: 'Salicylic Acid', benefits: ['Membersihkan penyumbatan minyak'], tips: 'Gunakan secara teratur.' },
          { name: 'Zinc PCA', benefits: ['Menyeimbangkan sebum', 'Anti-inflamasi'], tips: 'Sering dipasangkan dengan Niacinamide.' }
        ],
        products: [
          { name: 'Glow Facial Wash Cica + Panthenol', category: 'Cleanser', brand: 'GlowSkin Lab', key_ingredients: ['Centella Asiatica'] },
          { name: 'Acne Clearing Liquid BHA 2%', category: 'Toner', brand: 'GlowSkin Lab', key_ingredients: ['Salicylic Acid'] },
          { name: 'Barrier Recovery Cream 3:1:1', category: 'Moisturizer', brand: 'GlowSkin Lab', key_ingredients: ['Ceramides'] },
          { name: 'Ultra Shield Physical Sunscreen SPF 50', category: 'Sunscreen', brand: 'GlowSkin Lab', key_ingredients: ['Zinc Oxide'] }
        ]
      },
      dry: {
        skin_type: 'dry',
        tips: [
          'Hindari mencuci wajah dengan air terlalu panas karena dapat melarutkan lemak alami kulit.',
          'Gunakan produk dengan kandungan humektan di atas kulit yang masih lembap.',
          'Pilih pelembap bertekstur cream tebal yang mengandung Ceramides.'
        ],
        recommended_ingredients: [
          { name: 'Hyaluronic Acid', benefits: ['Menghidrasi lapisan kulit terdalam'], tips: 'Gunakan pada kulit setengah basah.' },
          { name: 'Ceramides', benefits: ['Mengunci kelembapan', 'Memperbaiki barrier'], tips: 'Pilar utama kulit kering.' },
          { name: 'Panthenol', benefits: ['Menghidrasi', 'Mencegah dehidrasi'], tips: 'Menenangkan kulit kering mengelupas.' }
        ],
        products: [
          { name: 'Glow Facial Wash Cica + Panthenol', category: 'Cleanser', brand: 'GlowSkin Lab', key_ingredients: ['Panthenol', 'Glycerin'] },
          { name: 'Hydrating Water Drop Essence', category: 'Toner', brand: 'GlowSkin Lab', key_ingredients: ['Hyaluronic Acid'] },
          { name: 'Barrier Recovery Cream 3:1:1', category: 'Moisturizer', brand: 'GlowSkin Lab', key_ingredients: ['Ceramides', 'Squalane'] },
          { name: 'Ultra Shield Physical Sunscreen SPF 50', category: 'Sunscreen', brand: 'GlowSkin Lab', key_ingredients: ['Zinc Oxide'] }
        ]
      },
      sensitive: {
        skin_type: 'sensitive',
        tips: [
          'Hindari produk dengan kandungan alkohol denat, parfum tambahan (fragrance), dan essential oil.',
          'Selalu lakukan patch test di belakang telinga sebelum memakai produk baru.',
          'Fokuskan pada produk penenang (soothing) dan pemulihan skin barrier.'
        ],
        recommended_ingredients: [
          { name: 'Centella Asiatica', benefits: ['Meredakan kemerahan', 'Menyembuhkan iritasi'], tips: 'Sangat aman digunakan sesering mungkin.' },
          { name: 'Panthenol', benefits: ['Meredakan gatal dan perih'], tips: 'Bahan pelembap yang sangat aman.' },
          { name: 'Ceramides', benefits: ['Membangun kembali ketahanan kulit'], tips: 'Melindungi kulit dari paparan luar.' }
        ],
        products: [
          { name: 'Glow Facial Wash Cica + Panthenol', category: 'Cleanser', brand: 'GlowSkin Lab', key_ingredients: ['Centella Asiatica', 'Panthenol'] },
          { name: 'Hydrating Water Drop Essence', category: 'Toner', brand: 'GlowSkin Lab', key_ingredients: ['Hyaluronic Acid'] },
          { name: 'Barrier Recovery Cream 3:1:1', category: 'Moisturizer', brand: 'GlowSkin Lab', key_ingredients: ['Ceramides'] },
          { name: 'Ultra Shield Physical Sunscreen SPF 50', category: 'Sunscreen', brand: 'GlowSkin Lab', key_ingredients: ['Zinc Oxide'] }
        ]
      }
    };
    setRoutineData(mockRoutines[type] || mockRoutines['acne_prone']);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'face' | 'ingredients') => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageName(file.name);
      setSelectedImageType(type);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    setShowUploadMenu(false);
  };

  const triggerUploadClick = (type: 'face' | 'ingredients') => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // clear previous
      // Assign transient listener to trigger with correct type
      const fileListener = (e: Event) => {
        handleImageSelect(e as unknown as React.ChangeEvent<HTMLInputElement>, type);
        fileInputRef.current?.removeEventListener('change', fileListener);
      };
      fileInputRef.current.addEventListener('change', fileListener);
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage('');
    setSelectedImageName('');
    setSelectedImageType('');
  };

  const executeSkinAnalysis = async (imgBase64: string) => {
    setIsScanning(true);
    
    // Scan animation duration
    await new Promise((resolve) => setTimeout(resolve, 4000));
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Lakukan analisis foto wajah.' }],
          skin_type: skinType,
          image_base64: imgBase64,
          image_type: 'face'
        })
      });
      
      if (response.ok) {
        const data = await response.json();

  const res = data.response;
  const metrics = res.metrics || {};

  console.log("FULL RESPONSE =", data);
  console.log("RES =", res);
  console.log("METRICS =", metrics);
  console.log("HYDRATION =", metrics.hydration);
  console.log("SEBUM =", metrics.sebum);
  console.log("SENSITIVITY =", metrics.sensitivity);
  console.log("ACNE =", metrics.acne);


  setSkinProfile({
  analyzed: true,
  hydration: metrics.hydration ?? 0,
  sebum: metrics.sebum ?? 0,
  sensitivity: metrics.sensitivity ?? 0,
  acne: metrics.acne ?? 0,
  explanation: res.explanation || ''
});    
  console.log("SET PROFILE:", {
  hydration: metrics.hydration,
  sebum: metrics.sebum,
  sensitivity: metrics.sensitivity,
  acne: metrics.acne
});    // Add to chat history
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `**[Hasil Analisis Wajah]** Tipe Kulit Terdeteksi: **${data.skin_type.toUpperCase().replace('_', ' ')}**\n\n${res.explanation}`,
            analysis_type: 'skin_analysis',
            metrics: res.metrics,
            recommendations: res.recommendations
          }
        ]);
        
        // Update recommended routines UI
        fetchRecommendations(data.skin_type);
      } else {
        runMockSkinAnalysis();
      }
    } catch (e) {
      runMockSkinAnalysis();
    } finally {
      setIsScanning(false);
      handleRemoveImage();
    }
  };

  const runMockSkinAnalysis = () => {
    const mockProfile = {
      detected_skin_type: 'acne_prone',
      hydration: 55,
      sebum: 80,
      sensitivity: 45,
      acne: 70,
      explanation: 'Berdasarkan pemindaian wajah simulasi: Terlihat minyak berlebih di zona T (dahi dan hidung) serta beberapa sumbatan komedo dan jerawat aktif kemerahan di kedua pipi. Kulit Anda tergolong **Acne-Prone (Rentan Berjerawat)**. Hidrasi kulit Anda moderat, namun peradangan ringan menyebabkan skor sensitivitas sedikit meningkat.'
    };
    
    setSkinType(mockProfile.detected_skin_type);
    setSkinProfile({
      analyzed: true,
      hydration: mockProfile.hydration,
      sebum: mockProfile.sebum,
      sensitivity: mockProfile.sensitivity,
      acne: mockProfile.acne,
      explanation: mockProfile.explanation
    });
    
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `**[Hasil Analisis Wajah - Mode Simulasi]** Tipe Kulit Terdeteksi: **ACNE PRONE**\n\n${mockProfile.explanation}`,
        analysis_type: 'skin_analysis',
        metrics: {
          skin_type: mockProfile.detected_skin_type,
          hydration: mockProfile.hydration,
          sebum: mockProfile.sebum,
          sensitivity: mockProfile.sensitivity,
          acne: mockProfile.acne
        }
      }
    ]);
    
    useMockRecommendations(mockProfile.detected_skin_type);
  };

  const executeIngredientAnalysis = async (imgBase64: string) => {
    setIsScanning(true);
    await new Promise((resolve) => setTimeout(resolve, 4000));
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Lakukan analisis label ingredients.' }],
          skin_type: skinType,
          image_base64: imgBase64,
          image_type: 'ingredients'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const res = data.response;
        setIngredientAnalysis(res);
        
        // Add to chat history
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `**[Hasil Analisis Kandungan Skincare]** Skor Kecocokan: **${res.summary.compatibility_score}%** (Status: **${res.summary.compatibility_status}** untuk kulit ${skinType.replace('_', ' ')}).\n\nEkstraksi Bahan: ${res.extracted_text}\n\n*Silakan cek panel khusus untuk rincian kecocokan per bahan aktif.*`,
            analysis_type: 'ingredient_analysis',
            ingredients: res.ingredients,
            summary: res.summary
          }
        ]);
      } else {
        runMockIngredientAnalysis();
      }
    } catch (e) {
      runMockIngredientAnalysis();
    } finally {
      setIsScanning(false);
      handleRemoveImage();
    }
  };

  const runMockIngredientAnalysis = () => {
    // Generate mock results
    const mockRes = {
      analysis_type: 'ingredient_analysis',
      extracted_text: 'Water, Glycerin, Niacinamide, Salicylic Acid, Phenoxyethanol, Fragrance, Retinol, Ceramide NP',
      ingredients: [
        { matched_name: 'Glycerin', risk_rating: 1, risk_category: 'Safe', skin_suitability: 'Good', description: 'Zat hidrasi humektan alami yang menarik kelembapan ke kulit.', benefits: ['Menghidrasi'], found: true },
        { matched_name: 'Niacinamide', risk_rating: 1, risk_category: 'Safe', skin_suitability: 'Excellent', description: 'Vitamin B3 mencerahkan kulit dan mengontrol sebum.', benefits: ['Mencerahkan', 'Mengontrol minyak'], found: true },
        { matched_name: 'Salicylic Acid', risk_rating: 3, risk_category: 'Low Hazard', skin_suitability: 'Excellent', description: 'BHA eksfoliasi pori tersumbat untuk kulit berjerawat.', benefits: ['Eksfoliasi', 'Mengatasi jerawat'], found: true },
        { matched_name: 'Retinol', risk_rating: 9, risk_category: 'High Hazard', skin_suitability: 'Caution', description: 'Turunan Vitamin A untuk anti-aging, namun berisiko iritasi pada kulit sensitif.', benefits: ['Anti-aging'], found: true },
        { matched_name: 'Ceramide NP', risk_rating: 1, risk_category: 'Safe', skin_suitability: 'Good', description: 'Meniru lemak pelindung kulit untuk memulihkan skin barrier.', benefits: ['Barrier recovery'], found: true },
        { matched_name: 'Fragrance', risk_rating: 8, risk_category: 'High Hazard', skin_suitability: 'Avoid', description: 'Zat parfum sintetik, pemicu alergi umum untuk kulit sensitif/berjerawat.', benefits: [], found: true }
      ],
      summary: {
        total_ingredients: 6,
        safe_count: 4,
        warning_count: 1,
        hazard_count: 1,
        compatibility_score: 65,
        compatibility_status: 'Cocok dengan Catatan',
        avoid_ingredients: ['Fragrance'],
        caution_ingredients: ['Retinol']
      }
    };
    
    // Adjust based on active skin type
    if (skinType === 'sensitive') {
      mockRes.summary.compatibility_score = 45;
      mockRes.summary.compatibility_status = 'Tidak Cocok';
    } else if (skinType === 'dry') {
      mockRes.summary.compatibility_score = 55;
      mockRes.summary.compatibility_status = 'Cocok dengan Catatan';
    } else {
      mockRes.summary.compatibility_score = 80;
      mockRes.summary.compatibility_status = 'Cocok';
    }

    setIngredientAnalysis(mockRes);
    
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `**[Hasil Analisis Kandungan Skincare - Simulasi]** Skor Kecocokan: **${mockRes.summary.compatibility_score}%** (Status: **${mockRes.summary.compatibility_status}** untuk kulit ${skinType.replace('_', ' ')}).\n\nEkstraksi Bahan: ${mockRes.extracted_text}\n\n*Terdeteksi kandungan pewangi (Fragrance) yang berisiko memicu peradangan pada jenis kulit sensitif/acne-prone. Retinol di dalamnya juga memerlukan perhatian khusus.*`,
        analysis_type: 'ingredient_analysis',
        ingredients: mockRes.ingredients,
        summary: mockRes.summary
      }
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() && !selectedImage) return;

    const currentInput = chatInput;
    const currentImg = selectedImage;
    const currentImgType = selectedImageType;
    
    setChatInput('');
    handleRemoveImage();
    
    // 1. User Message
    const userMsg: ChatMessage = {
      role: 'user',
      content: currentInput || `[Mengirim gambar: ${selectedImageName}]`
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // If image is uploaded directly through the chat input
    if (currentImg && currentImgType === 'face') {
      await executeSkinAnalysis(currentImg);
      setLoading(false);
      return;
    } else if (currentImg && currentImgType === 'ingredients') {
      await executeIngredientAnalysis(currentImg);
      setLoading(false);
      return;
    }

    // Standard Chat call
    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          skin_type: skinType
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.response.chat_response
          }
        ]);
        if (data.skin_type && data.skin_type !== skinType) {
          setSkinType(data.skin_type);
          fetchRecommendations(data.skin_type);
        }
      } else {
        runMockChat(currentInput);
      }
    } catch (error) {
      runMockChat(currentInput);
    } finally {
      setLoading(false);
    }
  };

  const runMockChat = (input: string) => {
    let reply = `Terima kasih atas pertanyaan Anda Cantik! Mengenai masalah kulit Anda, untuk tipe kulit **${skinType.toUpperCase().replace('_', ' ')}**, kuncinya adalah menyeimbangkan kelembapan. `;
    
    const inputClean = input.toLowerCase();
    if (inputClean.includes('retinol')) {
      reply += 'Retinol sangat bagus untuk regenerasi kulit dan antipenuaan, tetapi pastikan untuk hanya menggunakannya di malam hari. Untuk tipe kulit Anda, mulailah dengan konsentrasi rendah (0.1%) dan hindari mencampurnya langsung dengan eksfoliator lain seperti AHA/BHA di malam yang sama agar tidak over-exfoliation. Selalu kunci dengan pelembap yang mengandung Ceramide.';
    } else if (inputClean.includes('jerawat') || inputClean.includes('acne')) {
      reply += 'Untuk mengatasi jerawat aktif, gunakan pembersih wajah gel yang lembut (pH balanced) diikuti toner eksfoliasi mengandung Salicylic Acid (BHA) 2% sebanyak 2-3 kali seminggu. Totolkan minyak pohon teh (Tea Tree Oil) atau Benzoyl Peroxide di atas jerawat meradang untuk menenangkan kemerahan.';
    } else if (inputClean.includes('kusam') || inputClean.includes('cerah')) {
      reply += 'Untuk mencerahkan kulit yang kusam, Anda bisa memasukkan Vitamin C atau Niacinamide ke dalam rutinitas pagi Anda. Vitamin C kaya antioksidan dan bekerja sinergis dengan sunscreen untuk melindungi kulit Anda dari radikal bebas sinar matahari, sedangkan Niacinamide membantu meratakan rona kulit.';
    } else {
      reply += 'Pastikan Anda menerapkan rutinitas dasar: Cleansing, Hydrating (Toner/Essence), Moisturizing, dan Protecting (Sunscreen di pagi hari). Apakah ada bahan aktif tertentu yang ingin Anda konsultasikan kecocokannya?';
    }

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: reply
      }
    ]);
  };

  const handleSearchIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
const response = await fetch(
  `http://127.0.0.1:8000/api/rag/search?q=${encodeURIComponent(searchQuery)}`
);      if (response.ok) {
        const data = await response.json();
        setSearchResult(data);
      } else {
        runMockSearch(searchQuery);
      }
    } catch (e) {
      runMockSearch(searchQuery);
    } finally {
      setLoading(false);
    }
  };

  const runMockSearch = (query: string) => {
    const q = query.toLowerCase();
    const mockDB: Record<string, any> = {
      niacinamide: {
        found: true,
        ingredient: {
          name: 'Niacinamide',
          aliases: ['Vitamin B3', 'Nicotinamide'],
          description: 'Vitamin larut air serbaguna yang bekerja memperkuat pelindung kulit (skin barrier), mengontrol produksi sebum, mencerahkan noda hitam, dan meredakan kemerahan akibat inflamasi.',
          benefits: ['Mencerahkan noda hitam', 'Memperkuat skin barrier', 'Mengontrol minyak', 'Meredakan kemerahan', 'Mengecilkan pori-pori'],
          risk_rating: 1,
          risk_category: 'Safe',
          safety_details: 'Sangat aman dan ditoleransi dengan baik oleh hampir semua jenis kulit termasuk kulit sensitif.',
          skin_suitability: { oily: 'Excellent', dry: 'Excellent', sensitive: 'Excellent', acne_prone: 'Excellent' },
          interactions: {
            'Retinol': 'Excellent - Mengurangi kemerahan dan kekeringan yang disebabkan oleh Retinol.',
            'Zinc PCA': 'Excellent - Kombinasi terbaik untuk mengontrol sebum dan mengatasi jerawat aktif tanpa membuat kulit kering.'
          },
          tips: 'Aman digunakan pagi dan malam hari. Konsentrasi optimal adalah 2% hingga 5% untuk pemula, sedangkan 10% untuk masalah kulit yang lebih membandel.'
        }
      },
      retinol: {
        found: true,
        ingredient: {
          name: 'Retinol',
          aliases: ['Vitamin A', 'Retinyl Palmitate'],
          description: 'Bahan turunan Vitamin A yang mempercepat regenerasi sel kulit, merangsang produksi kolagen, dan menyamarkan garis halus serta hiperpigmentasi.',
          benefits: ['Anti-aging', 'Menyamarkan kerutan', 'Regenerasi kulit', 'Memperbaiki tekstur kulit'],
          risk_rating: 9,
          risk_category: 'High Hazard',
          safety_details: 'Berisiko tinggi memicu iritasi, kemerahan, dan kulit kering jika digunakan pada konsentrasi tinggi. Dilarang bagi wanita hamil atau menyusui karena risiko teratogenik.',
          skin_suitability: { oily: 'Excellent', dry: 'Caution', sensitive: 'Avoid', acne_prone: 'Good' },
          interactions: {
            'Vitamin C': 'Avoid - Dapat memicu iritasi parah dan menetralkan efektivitas masing-masing karena perbedaan pH.',
            'Salicylic Acid (BHA)': 'Avoid - Kombinasi ini sangat mengikis skin barrier.'
          },
          tips: 'Hanya gunakan pada malam hari. Mulai dari konsentrasi rendah (0.1%). Wajib menggunakan sunscreen minimal SPF 30 pada pagi hari.'
        }
      },
      bha: {
        found: true,
        ingredient: {
          name: 'Salicylic Acid',
          aliases: ['BHA', 'Beta Hydroxy Acid'],
          description: 'Asam yang larut dalam minyak (lipid-soluble) sehingga mampu berpenetrasi ke dalam pori-pori untuk membersihkan sumbatan sebum, sel kulit mati, dan bakteri penyebab jerawat.',
          benefits: ['Eksfoliasi pori-pori', 'Mengatasi jerawat', 'Mengurangi komedo (blackheads/whiteheads)', 'Mengontrol minyak berlebih'],
          risk_rating: 3,
          risk_category: 'Low-Moderate Hazard',
          safety_details: 'Umumnya aman untuk penggunaan kosmetik hingga konsentrasi 2%. Dapat menyebabkan kekeringan ringan.',
          skin_suitability: { oily: 'Excellent', dry: 'Avoid', sensitive: 'Caution', acne_prone: 'Excellent' },
          interactions: {
            'Retinol': 'Avoid - Risiko iritasi dan pengikisan kulit yang parah.',
            'Hyaluronic Acid': 'Excellent - Menghidrasi kembali kulit setelah dieksfoliasi oleh BHA.'
          },
          tips: 'Gunakan 2-3 kali seminggu. Fokuskan pada area yang berminyak dan berjerawat (T-zone).'
        }
      }
    };

    const key = Object.keys(mockDB).find(k => q.includes(k) || k.includes(q));
    if (key) {
      setSearchResult(mockDB[key]);
    } else {
      setSearchResult({
        found: false,
        message: `Bahan '${query}' belum terindeks secara detail dalam database RAG lokal kami, namun terus dikembangkan oleh tim GlowSkin AI.`
      });
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Panel */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <SparklesIcon />
          </div>
          <h1 className="brand-name">GlowSkin AI</h1>
        </div>

        {/* AI Beauty Illustration Strip */}
        <div className="sidebar-hero">
          <div className="ai-orb"></div>
          <div>
            <div className="sidebar-hero-tagline">AI-Powered Beauty</div>
            <div className="sidebar-hero-sub">Analisis kulit & kandungan cerdas</div>
          </div>
        </div>

        {/* Decorative SVG Illustration */}
        <div className="deco-illustration">
          <svg width="232" height="54" viewBox="0 0 232 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Floating molecules / skincare drops */}
            <circle cx="20" cy="27" r="8" fill="rgba(212,115,127,0.12)" stroke="rgba(212,115,127,0.25)" strokeWidth="1"/>
            <circle cx="20" cy="27" r="4" fill="rgba(212,115,127,0.18)"/>
            <circle cx="55" cy="16" r="5" fill="rgba(217,184,122,0.15)" stroke="rgba(217,184,122,0.3)" strokeWidth="1"/>
            <circle cx="55" cy="16" r="2.5" fill="rgba(217,184,122,0.25)"/>
            <circle cx="90" cy="32" r="9" fill="rgba(212,115,127,0.08)" stroke="rgba(212,115,127,0.18)" strokeWidth="1"/>
            <circle cx="90" cy="32" r="4.5" fill="rgba(212,115,127,0.14)"/>
            {/* Connecting lines */}
            <line x1="28" y1="24" x2="50" y2="18" stroke="rgba(212,115,127,0.15)" strokeWidth="1" strokeDasharray="3 3"/>
            <line x1="60" y1="18" x2="81" y2="28" stroke="rgba(217,184,122,0.15)" strokeWidth="1" strokeDasharray="3 3"/>
            {/* AI nodes */}
            <circle cx="130" cy="20" r="6" fill="rgba(184,91,103,0.10)" stroke="rgba(184,91,103,0.22)" strokeWidth="1"/>
            <circle cx="150" cy="34" r="4" fill="rgba(212,115,127,0.12)" stroke="rgba(212,115,127,0.2)" strokeWidth="1"/>
            <circle cx="170" cy="15" r="7" fill="rgba(217,184,122,0.10)" stroke="rgba(217,184,122,0.22)" strokeWidth="1"/>
            <circle cx="195" cy="30" r="5" fill="rgba(212,115,127,0.08)" stroke="rgba(212,115,127,0.18)" strokeWidth="1"/>
            <circle cx="215" cy="18" r="4" fill="rgba(184,91,103,0.10)" stroke="rgba(184,91,103,0.20)" strokeWidth="1"/>
            <line x1="136" y1="20" x2="146" y2="30" stroke="rgba(212,115,127,0.12)" strokeWidth="0.8"/>
            <line x1="154" y1="31" x2="163" y2="20" stroke="rgba(212,115,127,0.12)" strokeWidth="0.8"/>
            <line x1="177" y1="18" x2="190" y2="27" stroke="rgba(212,115,127,0.12)" strokeWidth="0.8"/>
            <line x1="200" y1="27" x2="211" y2="21" stroke="rgba(212,115,127,0.12)" strokeWidth="0.8"/>
            {/* Sparkle stars */}
            <text x="108" y="12" fontSize="8" fill="rgba(212,115,127,0.3)" textAnchor="middle">✦</text>
            <text x="118" y="42" fontSize="6" fill="rgba(217,184,122,0.35)" textAnchor="middle">✦</text>
          </svg>
        </div>

        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <span className="nav-icon"><MessageIcon /></span>
            Chat Assistant
          </button>
          <button 
            className={`nav-item ${activeTab === 'skin-scan' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('skin-scan');
              handleRemoveImage();
            }}
          >
            <span className="nav-icon"><ScanIcon /></span>
            Skin Analyzer (Face)
          </button>
          <button 
            className={`nav-item ${activeTab === 'ing-scan' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('ing-scan');
              handleRemoveImage();
            }}
          >
            <span className="nav-icon"><ScanIcon /></span>
            Ingredient Scanner
          </button>
          <button 
            className={`nav-item ${activeTab === 'routine' ? 'active' : ''}`}
            onClick={() => setActiveTab('routine')}
          >
            <span className="nav-icon"><CalendarIcon /></span>
            AM/PM Routine Plan
          </button>
          <button 
            className={`nav-item ${activeTab === 'encyclopedia' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('encyclopedia');
              setSearchResult(null);
              setSearchQuery('');
            }}
          >
            <span className="nav-icon"><BookOpenIcon /></span>
            Encyclopedia (RAG)
          </button>
        </nav>

        {/* User Skin Profile Dashboard (Cohesive AI feeling) */}
        <div className="skin-profile-widget">
          <h3 className="profile-widget-title">
            <SparklesIcon /> Profil Kulit Anda
          </h3>
          <span className="skin-type-badge">
            {skinType.replace(/_/g, ' ')}
          </span>

          {skinProfile.analyzed ? (
            <div className="metric-bar-group">
              {[
                { label: 'Hidrasi', key: 'hydration', value: skinProfile.hydration },
                { label: 'Sebum / Minyak', key: 'sebum', value: skinProfile.sebum },
                { label: 'Kepekaan', key: 'sensitivity', value: skinProfile.sensitivity },
                { label: 'Risiko Jerawat', key: 'acne', value: skinProfile.acne },
              ].map(({ label, value }) => (
                <div className="metric-row" key={label}>
                  <div className="metric-label-container">
                    <span>{label}</span>
                    <span className="metric-value-text">{value}%</span>
                  </div>
                  <div className="metric-bar-track">
                    <div
                      className="metric-bar-fill"
                      style={{ width: `${value ?? 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="profile-not-analyzed">
              <div className="profile-not-analyzed-icon">✦</div>
              <p>Belum ada analisis.</p>
              <p>Unggah foto wajah di tab <strong>Skin Analyzer</strong> untuk memulai.</p>
            </div>
          )}
        </div>

        {/* Backend Connectivity Status */}
        <div className="status-bar">
          <div className="status-row">
            <span className={`status-dot ${backendStatus.status === 'online' ? 'online' : 'offline'}`}></span>
            <span>API: {backendStatus.status === 'online' ? 'Online' : 'Offline (Demo)'}</span>
          </div>
          {backendStatus.status === 'online' && (
            <div className="status-row">
              <span className={`status-dot ${backendStatus.ollama_connection === 'connected' ? 'online' : 'warning'}`}></span>
              <span>Ollama: {backendStatus.ollama_connection === 'connected' ? 'Ready' : 'Offline'}</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Workspace Panel */}
      <main className="main-content">
        <div className="bg-blob-1"></div>
        <div className="bg-blob-2"></div>
        
        <div className="workspace-panel">
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*" 
          />

          {/* TAB 1: CHAT ASSISTANT */}
          {activeTab === 'chat' && (
            <>
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Asisten AI GlowSkin</h2>
                  <p className="panel-subtitle">Konsultasikan masalah kulit Anda & analisis foto secara langsung.</p>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--accent-pink)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <SparklesIcon /> Aktif: Kulit {skinType.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              <div className="chat-messages-container">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`chat-bubble ${msg.role}`}>
                    <div className="avatar">
                      {msg.role === 'user' ? '👤' : '✨'}
                    </div>
                    <div className="message-content">
                      {/* Render markdown-like simple syntax */}
                      <div style={{ whiteSpace: 'pre-line' }}>
                        {msg.content.split('**').map((chunk, cIdx) => 
                          cIdx % 2 === 1 ? <strong key={cIdx}>{chunk}</strong> : chunk
                        )}
                      </div>
                      
                      {/* Integrated custom widget summaries inside chat history */}
                      {msg.analysis_type === 'skin_analysis' && msg.metrics && (
                        <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid rgba(232,162,176,0.2)' }}>
                          <div style={{ fontSize: '12px' }}>💧 Hydration: <strong>{msg.metrics.hydration}%</strong></div>
                          <div style={{ fontSize: '12px' }}>🧴 Sebum: <strong>{msg.metrics.sebum}%</strong></div>
                          <div style={{ fontSize: '12px' }}>🔴 Sensitivity: <strong>{msg.metrics.sensitivity}%</strong></div>
                          <div style={{ fontSize: '12px' }}>⚠️ Acne Risk: <strong>{msg.metrics.acne}%</strong></div>
                        </div>
                      )}

                      {msg.analysis_type === 'ingredient_analysis' && msg.summary && (
                        <div style={{ marginTop: '12px', background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid rgba(232,162,176,0.2)', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                          <div>Kecocokan: <strong style={{ color: msg.summary.compatibility_status === 'Cocok' ? 'var(--color-safe)' : 'var(--color-caution)' }}>{msg.summary.compatibility_score}% ({msg.summary.compatibility_status})</strong></div>
                          <div>Total Bahan: <strong>{msg.summary.total_ingredients}</strong></div>
                          {msg.summary.avoid_ingredients.length > 0 && (
                            <div style={{ color: 'var(--color-avoid)' }}>Hindari: {msg.summary.avoid_ingredients.join(', ')}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="chat-bubble assistant">
                    <div className="avatar">✨</div>
                    <div className="message-content" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>GlowSkin sedang mengetik</span>
                      <svg className="spinner" viewBox="0 0 50 50">
                        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                      </svg>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat attachment preview */}
              {selectedImage && (
                <div className="attachment-preview-container">
                  <img src={selectedImage} alt="Preview Attachment" className="attachment-preview" />
                  <div className="attachment-info">
                    <span className="attachment-type">{selectedImageType === 'face' ? 'Analisis Wajah' : 'Analisis Skincare'}</span>
                    <span className="attachment-name">{selectedImageName}</span>
                  </div>
                  <button className="remove-attachment" onClick={handleRemoveImage}><CloseIcon /></button>
                </div>
              )}

              {/* Chat input form */}
              <form onSubmit={handleSendMessage} className="chat-input-wrapper">
                <div className="chat-input-box">
                  <button 
                    type="button" 
                    className="input-action-btn"
                    onClick={() => setShowUploadMenu(!showUploadMenu)}
                    title="Unggah Foto untuk Analisis"
                  >
                    <LinkIcon />
                  </button>
                  
                  {/* Upload Selection Dropdown */}
                  {showUploadMenu && (
                    <div className="upload-menu">
                      <button type="button" className="upload-menu-item" onClick={() => triggerUploadClick('face')}>
                        <CameraIcon /> Foto Wajah (Scan Kulit)
                      </button>
                      <button type="button" className="upload-menu-item" onClick={() => triggerUploadClick('ingredients')}>
                        <DropletsIcon /> Foto Label Skincare (Scan Kandungan)
                      </button>
                    </div>
                  )}

                  <input 
                    type="text" 
                    className="chat-input"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={selectedImage ? "Tekan tombol kirim untuk menganalisis foto..." : "Konsultasikan seputar retinol, kulit kering, jerawat..."}
                    disabled={loading}
                  />
                </div>
                <button type="submit" className="send-btn" disabled={loading}>
                  <SparklesIcon />
                </button>
              </form>
            </>
          )}

          {/* TAB 2: SKIN ANALYZER (FACE) */}
          {activeTab === 'skin-scan' && (
            <>
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Skin Analyzer Profesional</h2>
                  <p className="panel-subtitle">Unggah foto wajah beresolusi jelas untuk memindai kondisi kulit terperinci.</p>
                </div>
              </div>

              <div className="analyzer-container">
                <div className="upload-section">
                  {!selectedImage ? (
                    <div className="dropzone" onClick={() => triggerUploadClick('face')}>
                      <div className="dropzone-icon"><CameraIcon /></div>
                      <span className="dropzone-title">Unggah Foto Wajah Anda</span>
                      <span className="dropzone-desc">Mendukung format PNG, JPG (maks 5MB). Pastikan wajah menghadap ke depan dengan cahaya terang.</span>
                    </div>
                  ) : (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div className={`image-preview-wrapper ${isScanning ? 'scanning' : ''}`}>
                        <img src={selectedImage} alt="Scanned Face" className="preview-img" />
                        {isScanning && (
                          <>
                            <div className="scanner-laser"></div>
                            <div className="scan-overlay-text">
                              Menganalisis Kulit Wajah...
                            </div>
                          </>
                        )}
                      </div>
                      {!isScanning && (
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button className="analyzer-btn" onClick={() => executeSkinAnalysis(selectedImage)}>
                            Mulai Pemindaian AI
                          </button>
                          <button className="analyzer-btn" style={{ background: '#ECEAEB', color: 'var(--text-main)', boxShadow: 'none' }} onClick={handleRemoveImage}>
                            Ganti Foto
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="results-section">
                  <div className="result-card">
                    <h4 className="result-card-title"><SparklesIcon /> Penjelasan Analisis Kulit</h4>
                    <p className="result-desc" style={{ whiteSpace: 'pre-line' }}>{skinProfile.explanation}</p>
                  </div>

                  <div className="result-card">
                    <h4 className="result-card-title"><DropletsIcon /> Metrik Kondisi Kulit</h4>
                    <div className="metrics-grid">
                      <div className="metric-card">
                        <span className="metric-card-label">Hidrasi (Kelembaban)</span>
                        <div className="metric-card-val-row">
                          <span className="metric-card-value">{skinProfile.hydration}%</span>
                          <span className="metric-card-status" style={{ backgroundColor: skinProfile.hydration > 60 ? 'var(--color-safe-bg)' : 'var(--color-caution-bg)', color: skinProfile.hydration > 60 ? 'var(--color-safe)' : 'var(--color-caution)' }}>
                            {skinProfile.hydration > 60 ? 'Optimal' : 'Dehidrasi'}
                          </span>
                        </div>
                      </div>
                      <div className="metric-card">
                        <span className="metric-card-label">Sebum (Minyak)</span>
                        <div className="metric-card-val-row">
                          <span className="metric-card-value">{skinProfile.sebum}%</span>
                          <span className="metric-card-status" style={{ backgroundColor: skinProfile.sebum < 70 ? 'var(--color-safe-bg)' : 'var(--color-caution-bg)', color: skinProfile.sebum < 70 ? 'var(--color-safe)' : 'var(--color-caution)' }}>
                            {skinProfile.sebum < 70 ? 'Seimbang' : 'Berlebih'}
                          </span>
                        </div>
                      </div>
                      <div className="metric-card">
                        <span className="metric-card-label">Sensitivitas (Kemerahan)</span>
                        <div className="metric-card-val-row">
                          <span className="metric-card-value">{skinProfile.sensitivity}%</span>
                          <span className="metric-card-status" style={{ backgroundColor: skinProfile.sensitivity < 40 ? 'var(--color-safe-bg)' : 'var(--color-caution-bg)', color: skinProfile.sensitivity < 40 ? 'var(--color-safe)' : 'var(--color-caution)' }}>
                            {skinProfile.sensitivity < 40 ? 'Rendah' : 'Sensitif'}
                          </span>
                        </div>
                      </div>
                      <div className="metric-card">
                        <span className="metric-card-label">Tingkat Kerentanan Jerawat</span>
                        <div className="metric-card-val-row">
                          <span className="metric-card-value">{skinProfile.acne}%</span>
                          <span className="metric-card-status" style={{ backgroundColor: skinProfile.acne < 50 ? 'var(--color-safe-bg)' : 'var(--color-avoid-bg)', color: skinProfile.acne < 50 ? 'var(--color-safe)' : 'var(--color-avoid)' }}>
                            {skinProfile.acne < 50 ? 'Rendah' : 'Tinggi'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 3: INGREDIENT SCANNER */}
          {activeTab === 'ing-scan' && (
            <>
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Ingredient Scanner Skincare</h2>
                  <p className="panel-subtitle">Unggah foto tulisan komposisi/bahan pada wadah skincare untuk dianalisis oleh RAG.</p>
                </div>
              </div>

              <div className="analyzer-container">
                <div className="upload-section">
                  {!selectedImage ? (
                    <div className="dropzone" onClick={() => triggerUploadClick('ingredients')}>
                      <div className="dropzone-icon"><DropletsIcon /></div>
                      <span className="dropzone-title">Unggah Foto Label Kandungan Skincare</span>
                      <span className="dropzone-desc">Mendukung format PNG, JPG (maks 5MB). Pastikan teks tulisan komposisi terlihat fokus dan terbaca.</span>
                    </div>
                  ) : (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div className={`image-preview-wrapper ${isScanning ? 'scanning' : ''}`}>
                        <img src={selectedImage} alt="Scanned Ingredients" className="preview-img" />
                        {isScanning && (
                          <>
                            <div className="scanner-laser"></div>
                            <div className="scan-overlay-text">
                              Melakukan OCR & Analisis RAG...
                            </div>
                          </>
                        )}
                      </div>
                      {!isScanning && (
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button className="analyzer-btn" onClick={() => executeIngredientAnalysis(selectedImage)}>
                            Mulai Analisis Bahan
                          </button>
                          <button className="analyzer-btn" style={{ background: '#ECEAEB', color: 'var(--text-main)', boxShadow: 'none' }} onClick={handleRemoveImage}>
                            Ganti Foto
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="results-section">
                  {ingredientAnalysis ? (
                    <>
                      <div className="result-card" style={{ background: 'linear-gradient(135deg, white 0%, var(--accent-pink-light) 100%)' }}>
                        <h4 className="result-card-title"><SparklesIcon /> Ringkasan Analisis Keamanan</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                          <div>
                            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>
                              Skor Kecocokan: <span style={{ color: ingredientAnalysis.summary.compatibility_score >= 80 ? 'var(--color-safe)' : (ingredientAnalysis.summary.compatibility_score >= 50 ? 'var(--color-caution)' : 'var(--color-avoid)') }}>{ingredientAnalysis.summary.compatibility_score}%</span>
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                              Status: <strong>{ingredientAnalysis.summary.compatibility_status}</strong> untuk kulit {skinType.replace('_', ' ')}.
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ background: 'var(--color-safe-bg)', color: 'var(--color-safe)', padding: '6px 12px', borderRadius: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>
                              {ingredientAnalysis.summary.safe_count} Aman
                            </div>
                            <div style={{ background: 'var(--color-caution-bg)', color: 'var(--color-caution)', padding: '6px 12px', borderRadius: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>
                              {ingredientAnalysis.summary.warning_count} Caution
                            </div>
                            {ingredientAnalysis.summary.hazard_count > 0 && (
                              <div style={{ background: 'var(--color-avoid-bg)', color: 'var(--color-avoid)', padding: '6px 12px', borderRadius: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>
                                {ingredientAnalysis.summary.hazard_count} Hazard
                              </div>
                            )}
                          </div>
                        </div>
                        {ingredientAnalysis.summary.avoid_ingredients.length > 0 && (
                          <div style={{ marginTop: '14px', padding: '10px', background: 'var(--color-avoid-bg)', borderRadius: '10px', fontSize: '12.5px', color: '#D26B6B', fontWeight: 500, borderLeft: '3px solid var(--color-avoid)' }}>
                            ⚠️ <strong>Kandungan dihindari:</strong> {ingredientAnalysis.summary.avoid_ingredients.join(', ')}. Disarankan cari produk alternatif.
                          </div>
                        )}
                      </div>

                      <div className="result-card">
                        <h4 className="result-card-title"><DropletsIcon /> Daftar Kandungan Terdeteksi</h4>
                        <div className="ingredient-list-scanned">
                          {ingredientAnalysis.ingredients.map((ing: any, idx: number) => (
                            <div key={idx} className="ingredient-scan-item" style={{ borderLeft: `4px solid ${ing.risk_rating >= 7 ? 'var(--color-avoid)' : (ing.risk_rating >= 3 ? 'var(--color-caution)' : 'var(--color-safe)')}` }}>
                              <div className="ing-name-group">
                                <span className="ing-scanned-name">{ing.matched_name}</span>
                                <span className="ing-matched-details">{ing.description.substring(0, 80)}...</span>
                              </div>
                              <div className="ing-badge-group">
                                <span className={`ewg-badge ${ing.risk_rating >= 7 ? 'avoid' : (ing.risk_rating >= 3 ? 'caution' : 'safe')}`} title="EWG Safety Scale">
                                  {ing.risk_rating}
                                </span>
                                <span className={`suitability-badge ${ing.skin_suitability.toLowerCase()}`}>
                                  {ing.skin_suitability}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state-icon">📄</div>
                      <h4 className="empty-state-title">Belum Ada Hasil Analisis</h4>
                      <p>Silakan unggah foto label skincare di panel kiri untuk dievaluasi oleh RAG GlowSkin.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB 4: AM/PM ROUTINE */}
          {activeTab === 'routine' && (
            <>
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Rencana Perawatan AM/PM GlowSkin</h2>
                  <p className="panel-subtitle">Rutinitas dasar dan kandungan yang dipersonalisasi sesuai profil kulit Anda.</p>
                </div>
                <div style={{ fontSize: '13px', background: 'var(--accent-pink-light)', padding: '6px 14px', borderRadius: '12px', color: 'var(--accent-pink-hover)', fontWeight: 600 }}>
                  Tipe: {skinType.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              <div style={{ padding: '24px', overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {routineData ? (
                  <>
                    <div className="routine-grid">
                      {/* AM ROUTINE */}
                      <div className="routine-column">
                        <h3 className="routine-column-header">
                          <span style={{ color: 'var(--accent-gold)' }}>☀️</span> Pagi Hari (AM Routine)
                        </h3>
                        
                        <div className="routine-step-card">
                          <div className="routine-step-number">1</div>
                          <div className="routine-step-details">
                            <span className="routine-step-type">Cleanser</span>
                            <span className="routine-step-name">Glow Facial Wash Cica + Panthenol</span>
                            <span className="routine-step-desc">Pembersihan wajah lembut tanpa merusak kelembapan kulit.</span>
                          </div>
                        </div>

                        <div className="routine-step-card">
                          <div className="routine-step-number">2</div>
                          <div className="routine-step-details">
                            <span className="routine-step-type">Toner / Hydration</span>
                            <span className="routine-step-name">Hydrating Water Drop Essence</span>
                            <span className="routine-step-desc">Gunakan toner hidrasi untuk mempersiapkan penyerapan skincare selanjutnya.</span>
                          </div>
                        </div>

                        <div className="routine-step-card">
                          <div className="routine-step-number">3</div>
                          <div className="routine-step-details">
                            <span className="routine-step-type">Protection</span>
                            <span className="routine-step-name">Ultra Shield Physical Sunscreen SPF 50</span>
                            <span className="routine-step-desc">Wajib lindungi kulit dari radiasi UV penyebab penuaan dini dan kemerahan.</span>
                            <span className="routine-step-active-ing">Zinc Oxide</span>
                          </div>
                        </div>
                      </div>

                      {/* PM ROUTINE */}
                      <div className="routine-column">
                        <h3 className="routine-column-header">
                          <span style={{ color: 'var(--accent-pink)' }}>🌙</span> Malam Hari (PM Routine)
                        </h3>
                        
                        <div className="routine-step-card">
                          <div className="routine-step-number">1</div>
                          <div className="routine-step-details">
                            <span className="routine-step-type">Double Cleanse</span>
                            <span className="routine-step-name">Glow Cleansing Oil & Gel Wash</span>
                            <span className="routine-step-desc">Bersihkan debu, kotoran, dan sisa sunscreen secara tuntas sebelum istirahat.</span>
                          </div>
                        </div>

                        {skinType === 'acne_prone' || skinType === 'oily' ? (
                          <div className="routine-step-card">
                            <div className="routine-step-number">2</div>
                            <div className="routine-step-details">
                              <span className="routine-step-type">Exfoliation / Treatment</span>
                              <span className="routine-step-name">Acne Clearing Liquid BHA 2%</span>
                              <span className="routine-step-desc">Fokuskan pada area komedo/jerawat untuk membersihkan pori.</span>
                              <span className="routine-step-active-ing">Salicylic Acid (BHA)</span>
                            </div>
                          </div>
                        ) : (
                          <div className="routine-step-card">
                            <div className="routine-step-number">2</div>
                            <div className="routine-step-details">
                              <span className="routine-step-type">Treatment / Hydration</span>
                              <span className="routine-step-name">Hydrating Water Drop Essence</span>
                              <span className="routine-step-desc">Layer hidrasi mendalam untuk mengembalikan kelembapan.</span>
                              <span className="routine-step-active-ing">Hyaluronic Acid</span>
                            </div>
                          </div>
                        )}

                        <div className="routine-step-card">
                          <div className="routine-step-number">3</div>
                          <div className="routine-step-details">
                            <span className="routine-step-type">Moisturizer</span>
                            <span className="routine-step-name">Barrier Recovery Cream 3:1:1</span>
                            <span className="routine-step-desc">Mengunci kelembapan semalaman dan memulihkan sel skin barrier yang rusak.</span>
                            <span className="routine-step-active-ing">Ceramides</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Skin Tips Card */}
                    <div className="result-card" style={{ marginTop: '12px' }}>
                      <h4 className="result-card-title"><SparklesIcon /> Tips Cantik Tambahan</h4>
                      <ul style={{ paddingLeft: '20px', fontSize: '13.5px', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                        {routineData.tips.map((tip: string, idx: number) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <svg className="spinner" viewBox="0 0 50 50">
                      <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                    </svg>
                    <span>Memuat rekomendasi...</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 5: ENCYCLOPEDIA (RAG SEARCH) */}
          {activeTab === 'encyclopedia' && (
            <>
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Skincare Encyclopedia (RAG)</h2>
                  <p className="panel-subtitle">Cari secara semantik bahan aktif kosmetik untuk mengetahui keamanan & manfaatnya.</p>
                </div>
              </div>

              <div className="search-wrapper">
                <form onSubmit={handleSearchIngredient} className="search-input-container">
                  <SearchIcon />
                  <input 
                    type="text" 
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ketik nama bahan aktif (contoh: Niacinamide, Retinol, BHA)..."
                  />
                  <button type="submit" className="analyzer-btn" style={{ padding: '8px 20px', margin: 0 }}>
                    Cari RAG
                  </button>
                </form>

                <div className="encyclopedia-results">
                  {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                      <svg className="spinner" viewBox="0 0 50 50">
                        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                      </svg>
                    </div>
                  ) : searchResult ? (
                    searchResult.found ? (
                      <div className="ingredient-detail-view">
                        <div className="ing-detail-header">
                          <div className="ing-detail-title-group">
                            <h3 className="ing-detail-title">{searchResult.ingredient.name}</h3>
                            <span className="ing-detail-aliases">Nama Lain: {searchResult.ingredient.aliases.join(', ')}</span>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>EWG Rating:</span>
                            <span className={`ewg-badge ${searchResult.ingredient.risk_rating >= 7 ? 'avoid' : (searchResult.ingredient.risk_rating >= 3 ? 'caution' : 'safe')}`}>
                              {searchResult.ingredient.risk_rating}
                            </span>
                            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: searchResult.ingredient.risk_rating >= 7 ? 'var(--color-avoid)' : (searchResult.ingredient.risk_rating >= 3 ? 'var(--color-caution)' : 'var(--color-safe)') }}>
                              ({searchResult.ingredient.risk_category})
                            </span>
                          </div>
                        </div>

                        <div>
                          <h5 className="ing-section-title">Deskripsi Kandungan</h5>
                          <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{searchResult.ingredient.description}</p>
                        </div>

                        <div>
                          <h5 className="ing-section-title">Manfaat Utama</h5>
                          <div className="benefits-pills">
                            {searchResult.ingredient.benefits.map((b: string, idx: number) => (
                              <span key={idx} className="benefit-pill">{b}</span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="ing-section-title">Kecocokan Jenis Kulit</h5>
                          <div className="ing-suitability-grid">
                            {Object.entries(searchResult.ingredient.skin_suitability).map(([k, v]: [string, any]) => (
                              <div key={k} className="suitability-box">
                                <span className="suitability-box-label">{k === 'acne_prone' ? 'Acne-Prone' : k}</span>
                                <span className={`suitability-box-val ${v}`}>{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {Object.keys(searchResult.ingredient.interactions).length > 0 && (
                          <div>
                            <h5 className="ing-section-title">Interaksi Kandungan (Do & Donts)</h5>
                            <div className="interaction-row">
                              {Object.entries(searchResult.ingredient.interactions).map(([withIng, desc]: [string, any]) => (
                                <div key={withIng} className="interaction-item">
                                  <span className="interaction-with">Dipadukan dengan: {withIng}</span>
                                  <span className="interaction-desc">{desc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchResult.ingredient.tips && (
                          <div style={{ marginTop: '10px', padding: '12px', background: 'var(--accent-gold-light)', borderRadius: '12px', fontSize: '13px', borderLeft: '3px solid var(--accent-gold)' }}>
                            💡 <strong>Tips Penggunaan:</strong> {searchResult.ingredient.tips}
                          </div>
                        )}
                        
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid rgba(232, 162, 176, 0.1)', paddingTop: '10px', marginTop: '10px' }}>
                          Sumber Rujukan: EWG Skin Deep, EU CosIng Database, & NIH PubChem.
                        </div>
                      </div>
                    ) : (
                      <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h4 className="empty-state-title">Bahan Tidak Ditemukan</h4>
                        <p>{searchResult.message}</p>
                      </div>
                    )
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state-icon">📖</div>
                      <h4 className="empty-state-title">Mulai Pencarian RAG</h4>
                      <p>Masukkan nama bahan aktif skincare untuk melihat deskripsi, skala bahaya, kecocokan tipe kulit, dan peringatan interaksi langsung dari RAG database.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
