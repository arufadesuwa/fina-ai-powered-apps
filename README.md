# Halo, ini fina-app (´｡• ᵕ •｡`) ♡
> **Project belajar AI Apps Development.** *"Dibangun sambil ngikutin course, isinya campur aduk dari Content Generation sampai AI Agent."* ┐(︶▽︶)┌

Project ini dibuat berdasarkan tutorial **[AI Apps — WPU Course](https://wpucourse.id/course/ai-apps)** (o^▽^o)

### ─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───

### apa aja yang dipelajari di sini
* **Content Generation:** Bikin AI menghasilkan teks/konten otomatis. `(つ✧ω✧)つ`
* **Prompt Engineering:** Ngoprek prompt sampai hasilnya sesuai ekspektasi. `(＃＞＜)`
* **RAG (Retrieval-Augmented Generation):** Gabungin pencarian data sama jawaban AI. `(o_ _)o`
* **AI Agent:** Bikin agent yang bisa ambil keputusan & jalanin aksi sendiri. `(ง 🛠️_🛠️)ง`

### catatan penting (｡•́︿•̀｡)
```text
Cuma jalan pakai Gemini API  :: @google/genai              (；^ω^)
Image & Video Generation     :: butuh paid tier Gemini      (＃`Д´)
```
Project ini dibangun pakai `@google/genai`, jadi **hanya kompatibel dengan Gemini API** (bukan OpenAI, Claude, dsb). Fitur **Image Generation** dan **Video Generation** butuh **API berbayar**, pastikan billing di Google AI Studio / Google Cloud udah aktif dulu.

### tools & environment
```text
Framework  :: Next.js 16 (React 19)          (✧ω✧)
AI SDK     :: @google/genai (Gemini API)     (o^▽^o)
Database   :: Supabase                       (｀_´)ゞ
Fetching   :: TanStack Query                 (＠_＠)
Form       :: React Hook Form + Zod          (ノ°∀°)ノ
UI         :: Radix UI, shadcn, Tailwind 4   (⌐■_■)
Chart      :: Recharts                       (✧ω✧)
```

### getting started 🍳
**1. Clone repository**
```bash
git clone https://github.com/arufadesuwa/fina-ai-powered-apps.git
cd fina-app
```

**2. Install dependencies**
```bash
bun i
```

**3. Siapin environment variables**

Buat file `.env.local` di root project/copy dari .env.example:
```bash
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
> Sesuaikan nama variable sama yang dipakai di kode project kamu ya `(o_ _)o`

**4. Jalanin file migration**
 
Sebelum nyalain server, jalanin dulu file migration di folder `/migrations` di supabase satu-satu ya, jangan diskip `(＃＞＜)`

> Urutannya penting! Jalanin dari nomor paling kecil ke paling besar biar database-nya gak berantakan `(o_ _)o`
 
**5. Jalanin development server**
```bash
bun dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser (づ｡◕‿‿◕｡)づ
 
### available scripts
- [x] `bun dev` — jalanin development server `(✧ω✧)`
- [x] `bun run build` — build project buat production `(๑˃̵ᴗ˂̵)و`
- [x] `bun run start` — jalanin production server `(≧∇≦)ﾉ`
### sumber belajar
* **Course:** [AI Apps — WPU Course](https://wpucourse.id/course/ai-apps) `(⌐■_■)`
* **Docs** [Gemini API Docs](https://ai.google.dev/gemini-api/docs) `(。U⁄ ⁄ω⁄ ⁄ U。)`
### license
Project ini pakai lisensi **GNU General Public License v3.0 (GPLv3)**.
Lihat file [LICENSE](./LICENSE) buat detail lengkapnya `(￣^￣)ゞ`
 
---
Dibuat sambil belajar, sambil ngoprek, sambil ngopi ( •̀ ω •́ )✧
