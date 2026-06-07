import React, { useEffect, useRef, useState, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Droplets, Bell, Play, ArrowRight, Cpu, CloudHail, 
  Monitor, ShieldCheck, ChevronRight, Activity, 
  Wifi, Database, BatteryCharging, Waves, AlertTriangle,
  Siren
} from "lucide-react";

import LogoRainGuard from "@/component/asset/logo rain-guard.png";

// KOMPONEN ANIMASI SCROLL 
// Komponen kecil ini membuat efek "muncul perlahan dari bawah" saat di-scroll
const AnimateOnScroll = ({ children, delay = 0 }: { children: ReactNode, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setIsVisible(entry.isIntersecting));
    }, { threshold: 0.1 }); // Muncul saat 10% elemen masuk layar

    const current = domRef.current;
    if (current) observer.observe(current);
    return () => { if (current) observer.unobserve(current); };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// HALAMAN UTAMA
export default function LandingPage() {
  const videoSectionRef = useRef<HTMLDivElement>(null);

  const scrollToVideo = () => {
    videoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-slate-800 font-sans antialiased overflow-x-hidden">
      
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 relative group-hover:scale-105 transition-transform duration-300">
              <Image src={LogoRainGuard} alt="Logo" layout="fill" objectFit="contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Rain<span className="text-blue-600 font-extrabold">Guard</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/guest">
              <span className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer hidden sm:block">
                Dasbor Publik
              </span>
            </Link>
            <Link href="/auth/login">
              <button className="text-xs font-bold text-white bg-slate-800 hover:bg-blue-600 px-5 py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-blue-600/30 active:scale-95">
                Admin Panel
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION DENGAN VISUAL */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
        {/* Dekorasi Latar Belakang */}
        <div className="absolute top-20 left-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl -z-10" />

        {/* Teks Kiri */}
        <div className="flex-1 text-center lg:text-left z-10">
          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold mb-6 shadow-sm">
              <ShieldCheck size={14} className="text-blue-600" />
              Tugas Akhir / Prototype IoT Polinema
            </div>
          </AnimateOnScroll>
          
          <AnimateOnScroll delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
              Deteksi Dini, <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-clip-text text-transparent bg-300% animate-gradient">
                Cegah Bencana Nanti.
              </span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <p className="text-base sm:text-lg text-slate-500 font-normal leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
              Sistem peringatan dini banjir berbasis Internet of Things. Menggunakan sensor presisi tinggi di atas aliran air untuk respons lingkungan yang lebih cerdas dan sigap.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/guest">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1">
                  Buka Dasbor
                  <ArrowRight size={18} />
                </button>
              </Link>
              <button 
                onClick={scrollToVideo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-sm hover:-translate-y-1"
              >
                <Play size={18} className="text-blue-600 fill-blue-600" />
                Demo Alat
              </button>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Visual Kanan (Custom Abstract SVG) */}
        <div className="flex-1 w-full max-w-lg hidden md:block">
          <AnimateOnScroll delay={400}>
            <div className="relative w-full aspect-square bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 flex items-center justify-center p-8 overflow-hidden group">
              {/* Latar Belakang UI Dashboard Mockup */}
              <div className="absolute top-4 left-4 right-4 h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center px-4 gap-2 opacity-50">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
              </div>
              
              {/* Ilustrasi Sensor IoT Custom */}
              <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl group-hover:scale-105 transition-transform duration-700 ease-out" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Awan & Hujan */}
                <path d="M120 130C120 110 140 90 165 90C180 90 195 100 200 110C210 100 230 100 240 115C255 115 270 130 270 150C270 170 250 185 225 185H145C125 185 120 165 120 130Z" fill="#E2E8F0" />
                <rect x="150" y="200" width="4" height="15" rx="2" fill="#3B82F6" className="animate-pulse" />
                <rect x="190" y="195" width="4" height="20" rx="2" fill="#3B82F6" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
                <rect x="230" y="205" width="4" height="12" rx="2" fill="#3B82F6" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
                
                {/* Tiang Sensor & Box ESP32 */}
                <rect x="195" y="180" width="10" height="120" fill="#94A3B8" />
                <rect x="175" y="150" width="50" height="40" rx="4" fill="#1E293B" />
                
                {/* Sensor Ultrasonik */}
                <path d="M185 280L165 310H235L215 280H185Z" fill="#64748B" opacity="0.8" />
                <path d="M165 310 C165 330, 235 330, 235 310" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                
                {/* Air Sungai */}
                <path d="M50 340Q125 320 200 340T350 340L350 400L50 400Z" fill="#3B82F6" opacity="0.2" />
                <path d="M50 350Q125 370 200 350T350 350L350 400L50 400Z" fill="#2563EB" opacity="0.4" />
              </svg>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* 3. METRIK & STATISTIK (HIGHLIGHT KAPABILITAS) */}
      <section className="relative -mt-10 z-20 max-w-5xl mx-auto px-6">
        <AnimateOnScroll delay={500}>
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-10 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
            <div className="flex flex-col items-center text-center px-4">
              <Activity className="text-blue-500 mb-3" size={28} />
              <h3 className="text-3xl font-black text-slate-800">10s</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Interval Update</p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <Wifi className="text-blue-500 mb-3" size={28} />
              <h3 className="text-3xl font-black text-slate-800">Multi</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Arsitektur Node</p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <Database className="text-blue-500 mb-3" size={28} />
              <h3 className="text-3xl font-black text-slate-800">NoSQL</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Cloud Firebase</p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <BatteryCharging className="text-blue-500 mb-3" size={28} />
              <h3 className="text-3xl font-black text-slate-800">24/7</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Battery Backed</p>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* 4. SPESIFIKASI HARDWARE */}
      <section className="py-24 bg-[#FAFBFC]">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900">Otak di Balik Sistem</h2>
              <p className="text-slate-500 mt-3 max-w-2xl mx-auto">Sistem hardware prototype dibangun menggunakan komponen elektronik presisi untuk menjamin akurasi data di lapangan.</p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimateOnScroll delay={100}><HardwareCard icon={<Cpu />} title="ESP32 MCU" desc="Mikrokontroler utama dengan modul Wi-Fi bawaan untuk pemrosesan dan transmisi data ke Cloud." /></AnimateOnScroll>
            <AnimateOnScroll delay={200}><HardwareCard icon={<Waves />} title="HC-SR04" desc="Sensor ultrasonik yang mengukur jarak permukaan air sungai dengan tingkat akurasi hingga centimeter." /></AnimateOnScroll>
            <AnimateOnScroll delay={300}><HardwareCard icon={<CloudHail />} title="YL-83 / FC-37" desc="Modul sensor pendeteksi tetesan air hujan untuk mengklasifikasikan intensitas cuaca secara real-time." /></AnimateOnScroll>
            <AnimateOnScroll delay={400}><HardwareCard icon={<Siren />} title="Active Buzzer" desc="Modul peringatan suara (alarm) yang otomatis menyala ketika debit air melewati batas maksimal." /></AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* 5. FITUR DENGAN SEMANTIC COLORS (HIJAU, KUNING, MERAH) */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900">Kondisi Terpantau Sepenuhnya</h2>
              <p className="text-slate-500 mt-3 max-w-xl mx-auto">Indikator visual dasbor dirancang menggunakan standar warna keamanan untuk mempercepat pengambilan keputusan.</p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kartu Hijau (Aman) */}
            <AnimateOnScroll delay={100}>
              <div className="group rounded-2xl border border-emerald-100 bg-emerald-50/30 p-8 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Status: Aman (Normal)</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Pemantauan berlanjut secara senyap. Ketinggian air dan curah hujan dicatat ke dalam database riwayat tanpa memicu peringatan.</p>
              </div>
            </AnimateOnScroll>

            {/* Kartu Kuning (Waspada) */}
            <AnimateOnScroll delay={200}>
              <div className="group rounded-2xl border border-amber-100 bg-amber-50/30 p-8 hover:bg-amber-50 hover:border-amber-200 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                  <AlertTriangle size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Status: Siaga (Waspada)</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Sistem mendeteksi anomali kenaikan air atau hujan deras berkepanjangan. Dasbor memberikan sinyal kuning peringatan awal.</p>
              </div>
            </AnimateOnScroll>

            {/* Kartu Merah (Bahaya) */}
            <AnimateOnScroll delay={300}>
              <div className="group rounded-2xl border border-rose-100 bg-rose-50/30 p-8 hover:bg-rose-50 hover:border-rose-200 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                  <Bell size={28} className="group-hover:animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Status: Bahaya (Kritis)</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Ketinggian melampaui batas aman. Buzzer alarm pada hardware menyala otomatis dan indikator web berkedip merah terang.</p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* 6. PIPELINE ALUR KERJA */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative">
          {/* Latar belakang abstrak */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
          
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-white">Alur Data (Pipeline)</h2>
              <p className="text-slate-400 mt-3">Perjalanan data dari sungai hingga ke layar monitormu.</p>
            </div>
          </AnimateOnScroll>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative z-10">
            {/* Step 1 */}
            <AnimateOnScroll delay={100}>
              <div className="bg-slate-800/80 backdrop-blur border border-slate-700 p-6 rounded-2xl w-64 text-center">
                <Cpu className="text-blue-400 mx-auto mb-4" size={32} />
                <h4 className="font-bold mb-2">1. Akuisisi Data</h4>
                <p className="text-xs text-slate-400">Sensor membaca lingkungan fisik</p>
              </div>
            </AnimateOnScroll>

            <ChevronRight className="text-slate-600 hidden md:block rotate-90 md:rotate-0" size={32} />

            {/* Step 2 */}
            <AnimateOnScroll delay={200}>
              <div className="bg-slate-800/80 backdrop-blur border border-slate-700 p-6 rounded-2xl w-64 text-center">
                <Database className="text-amber-400 mx-auto mb-4" size={32} />
                <h4 className="font-bold mb-2">2. Realtime Cloud</h4>
                <p className="text-xs text-slate-400">Sinkronisasi ESP32 ke Firebase</p>
              </div>
            </AnimateOnScroll>

            <ChevronRight className="text-slate-600 hidden md:block rotate-90 md:rotate-0" size={32} />

            {/* Step 3 */}
            <AnimateOnScroll delay={300}>
              <div className="bg-slate-800/80 backdrop-blur border border-slate-700 p-6 rounded-2xl w-64 text-center">
                <Monitor className="text-emerald-400 mx-auto mb-4" size={32} />
                <h4 className="font-bold mb-2">3. Visualisasi Dasbor</h4>
                <p className="text-xs text-slate-400">Web Next.js merender grafik & alarm</p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* 7. VIDEO PROMOSI SECTION */}
      <section ref={videoSectionRef} className="py-24 bg-[#FAFBFC] scroll-mt-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimateOnScroll>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Video Demonstrasi</h2>
            <div className="relative aspect-video w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl shadow-slate-300 border-4 border-white group cursor-pointer">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-transparent z-10" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 transition-transform duration-500 group-hover:scale-105">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-600/40 mb-4 group-hover:bg-blue-500">
                  <Play size={32} className="ml-2 fill-white" />
                </div>
                <p className="text-white font-bold text-lg">Tonton Pengujian Alat</p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* 8. BOTTOM CTA SECTION */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <AnimateOnScroll>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl shadow-blue-600/20">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Siap Memantau Secara Langsung?</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Eksplorasi antarmuka Dasbor Publik RainGuard. Pantau perubahan tinggi air dan pergerakan grafik sensor saat ini juga tanpa perlu mendaftar.
              </p>
              <Link href="/">
                <button className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-slate-50 transition-all hover:scale-105 active:scale-95">
                  Buka Dasbor Sekarang
                </button>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative opacity-80">
              <Image src={LogoRainGuard} alt="Logo" layout="fill" objectFit="contain" />
            </div>
            <div>
              <p className="font-bold text-slate-800 tracking-tight">RainGuard IoT</p>
              <p className="text-xs text-slate-400">Sistem Peringatan Dini Banjir</p>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm font-semibold text-slate-600">Dikembangkan oleh Kelompok 3</p>
            <p className="text-xs text-slate-400 mt-1">© 2026 Politeknik Negeri Malang. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sub-komponen kecil untuk Kartu Hardware agar rapi
function HardwareCard({ icon, title, desc }: { icon: ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 mb-4 border border-slate-200">
        {icon}
      </div>
      <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}