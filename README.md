
```
  ✦ G L O W S K I N   A I ✦
```

### *Asisten Kecantikan Berbasis AI untuk Analisis Kulit & Skincare*
<img width="1600" height="751" alt="image" src="https://github.com/user-attachments/assets/719abee1-b648-4e3a-8887-e4eb52ee52e5" />
<img width="1600" height="757" alt="image" src="https://github.com/user-attachments/assets/251b50f1-595e-40e8-ad9c-7180424d05fe" />
<img width="1600" height="753" alt="image" src="https://github.com/user-attachments/assets/9a9de8ed-75c9-44da-aa5a-7127a9d77d93" />
<img width="1600" height="765" alt="image" src="https://github.com/user-attachments/assets/22405e88-890d-4374-9184-9308ce653a21" />
<img width="1600" height="766" alt="image" src="https://github.com/user-attachments/assets/c535bf96-241a-47ed-8b57-1acfda066157" />
<img width="1600" height="748" alt="image" src="https://github.com/user-attachments/assets/b38d5904-0427-4621-bbfb-f3a405b23da9" />
<img width="1600" height="756" alt="image" src="https://github.com/user-attachments/assets/2861dbb4-5624-4a66-95df-b7eea2255a00" />



> **GlowSkin AI** adalah aplikasi web kecantikan bertenaga AI yang mampu menganalisis kondisi kulit wajah dari foto, memindai kandungan bahan aktif kosmetik, merekomendasikan rutinitas AM/PM yang personal, dan menjawab pertanyaan skincare secara cerdas melalui chatbot.


---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 💬 **Chat Assistant** | Konsultasi skincare personal dengan AI |
| 🔬 **Skin Analyzer** | Analisis kondisi kulit dari foto wajah |
| 💧 **Ingredient Scanner** | Pindai & cek keamanan bahan kosmetik |
| ☀️ **AM/PM Routine** | Rekomendasi rutinitas skincare harian |
| 📖 **Encyclopedia** | Database bahan aktif kosmetik lengkap |

---

## 🛠️ Teknologi

**Backend** — FastAPI · LangGraph · LangSmith · Langchain · Ollama (Qwen2.5-VL)

**Frontend** — React · TypeScript · Vite

**AI Model** — `qwen2.5vl:7b` via Ollama (berjalan secara lokal, privasi terjaga)

---

## 📋 Prasyarat

Sebelum memulai, pastikan hal-hal berikut sudah terinstall di komputer kamu:

- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [Ollama](https://ollama.com/download)
- [Git](https://git-scm.com/)

---

## 🚀 Cara Menjalankan Proyek

> Buka **3 terminal terpisah** — masing-masing untuk Ollama, Backend, dan Frontend.



### Terminal 1 — Jalankan Ollama + Download Model

```bash
# Jalankan Ollama (biarkan terminal ini tetap berjalan)
ollama serve
```

Buka terminal baru, lalu download model Qwen:

```bash
ollama pull qwen2.5vl:3b
```

> ⏳ Proses download sekitar 4–8 GB, tergantung koneksi internet.



### Terminal 2 — Backend (FastAPI)

```bash
# 1. Masuk ke folder backend
cd glowskin-ai/backend

# 2. Install semua dependensi (hanya perlu sekali)
pip install -r requirements.txt

# 3. Salin file konfigurasi environment
cp .env.example .env

# 4. Jalankan server backend
python main.py
```

Jika berhasil, terminal akan menampilkan:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
```



### Terminal 3 — Frontend (React + Vite)

```bash
# 1. Masuk ke folder frontend
cd glowskin-ai/frontend

# 2. Install semua package (hanya perlu sekali)
npm install

# 3. Jalankan server development
npm run dev
```

Jika berhasil, terminal akan menampilkan:

```
  VITE  Local:   http://localhost:5173/
```



### 🎉 Buka Aplikasi

Buka browser dan kunjungi:

```
http://localhost:5173
```

---

## ⚙️ Konfigurasi Environment

Buat file `.env` di dalam folder `backend/` dengan isi berikut:

```env
# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5vl:3b

# LangSmith (opsional, untuk monitoring)
LANGCHAIN_TRACING_V2=false
LANGCHAIN_API_KEY=your_api_key_here
LANGCHAIN_PROJECT=glowskin-ai
```

> 💡 LangSmith bersifat opsional. Jika tidak diisi, aplikasi tetap berjalan normal.

---

## 📁 Struktur Proyek

```
glowskin-ai/
│
├── backend/
│   ├── main.py              ← Entry point FastAPI
│   ├── agent_graph.py       ← LangGraph AI agent
│   ├── rag_service.py       ← Retrieval-Augmented Generation
│   ├── dataset.json         ← Database bahan kosmetik
│   ├── requirements.txt     ← Dependensi Python
│   └── .env                 ← Konfigurasi (buat sendiri)
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx          ← Komponen utama React
│   │   ├── App.css          ← Styling aplikasi
│   │   └── main.tsx         ← Entry point React
│   ├── public/
│   │   └── favicon.svg      ← Logo aplikasi
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 🔄 Urutan Menjalankan (Ringkas)

```
1. ollama serve              → Terminal 1 (biarkan berjalan)
2. cd backend                → Terminal 2
   pip install -r requirements.txt  (hanya sekali)
   python main.py
3. cd frontend               → Terminal 3
   npm install               (hanya sekali)
   npm run dev
4. Buka http://localhost:5173
```

---

## ❓ Troubleshooting

**Model tidak merespons / error Ollama**
```bash
# Pastikan Ollama sudah berjalan
ollama serve

# Cek model sudah terdownload
ollama list
```

**Backend error saat start**
```bash
# Pastikan semua dependensi terinstall
pip install -r requirements.txt

# Cek file .env sudah dibuat
ls .env
```

**Frontend tidak muncul**
```bash
# Hapus cache dan install ulang
rm -rf node_modules
npm install
npm run dev
```

**Port sudah digunakan**

Backend default: `8000` · Frontend default: `5173`

Jika ada konflik, Vite akan otomatis pindah ke port berikutnya (`5174`, dst).

---

## 📦 Dependensi Python

```
fastapi          — Web framework backend
uvicorn          — ASGI server
python-dotenv    — Manajemen environment variable
httpx            — HTTP client async
langgraph        — Orkestrasi AI agent
langsmith        — Monitoring & tracing
python-multipart — Upload file & form data
langchain-core   — Core LangChain utilities
```

---


*Dibuat dengan ❤️ untuk kulit yang lebih sehat*

```
✦  GlowSkin AI  ✦
```

OLEH: SYNTIA ADHISTI - 233510759
