import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  PhoneCall,
  Clock,
  Users,
  ShieldCheck,
  Zap,
  MapPin,
  Heart,
  ChevronRight,
  ChevronLeft,
  Siren,
  Ambulance,
  Bed,
  HeartHandshake,
  Mail,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-red-500 selection:text-white">
      
      {/* ================= 1. NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-200">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block leading-tight">
                Ambulance<span className="text-red-600"> Dispatch</span>
              </span>
              <span className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
                Fast Response. Better Care.
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="#" className="text-red-600 border-b-2 border-red-600 pb-1">Home</Link>
            <Link href="#about" className="hover:text-red-600 transition-colors">About</Link>
            <Link href="#services" className="hover:text-red-600 transition-colors">Services</Link>
            <Link href="#how-it-works" className="hover:text-red-600 transition-colors">How It Works</Link>
            <Link href="#contact" className="hover:text-red-600 transition-colors">Contact</Link>
          </nav>

          {/* Top CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="tel:911"
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              Call 911 / Request
            </a>
            <a
              href="tel:911"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-200 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              Emergency Call
            </a>
          </div>
        </div>
      </header>

      {/* ================= 2. HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white py-16 lg:py-24">
        {/* City/Road Overlay Graphic Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block text-xs font-bold tracking-widest text-slate-300 uppercase bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
              24/7 Emergency Ambulance <span className="text-red-400">Dispatch</span>
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              When Every Second Matters,{" "}
              <span className="text-red-500">We&apos;re There.</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed">
              Quick, reliable, and professional ambulance dispatch services for
              emergencies and non-emergencies. Get the help you need, when you
              need it most.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="tel:911"
                className="flex items-center gap-2 px-6 py-3.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-900/50 transition-all hover:scale-105"
              >
                <Phone className="w-4 h-4" />
                Call 911 / Request Ambulance
              </a>
              <Link
                href="#about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-slate-600 hover:border-white text-white font-semibold text-sm transition"
              >
                Learn More <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Hero Image (Ambulance) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-xl aspect-[16/11] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=1200&q=80"
                alt="Emergency Ambulance on the road"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. HIGHLIGHTS RIBBON ================= */}
      <section className="bg-white border-b border-slate-100 py-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          {/* Feature 1 */}
          <div className="flex flex-col items-center p-3">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 fill-red-600" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Fast Response</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-[170px]">
              Get an ambulance quickly with our 24/7 dispatch service.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center p-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Trained Professionals</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-[170px]">
              Experienced and certified paramedics & drivers.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center p-3">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <MapPin className="w-6 h-6 fill-red-600" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Real-Time Tracking</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-[170px]">
              Track your ambulance in real time on mobile.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center p-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Multiple Options</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-[170px]">
              Emergency, non-emergency, patient transfer and more.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="flex flex-col items-center p-3">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Quality Care</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-[170px]">
              Your safety and well-being are our top priority.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 4. ABOUT US SECTION ================= */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Details */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              ABOUT US
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Trusted Ambulance Services <br />
              When It Matters Most
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We provide fast, safe, and reliable ambulance dispatch services to
              help people in critical situations. Our team is available 24/7 to
              ensure you get the right care, at the right time, with the right
              support.
            </p>

            {/* Metrics Counters */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">24/7</h4>
                  <p className="text-xs text-slate-500">Availability</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">500+</h4>
                  <p className="text-xs text-slate-500">Trained Staff</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">10,000+</h4>
                  <p className="text-xs text-slate-500">Lives Supported</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold transition"
              >
                Learn More About Us <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Paramedics Action Photo */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1000&q=80"
                alt="Paramedics team rushing a patient"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. OUR SERVICES ================= */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              OUR SERVICES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Comprehensive Ambulance Solutions
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              From emergencies to scheduled transport, we’ve got you covered.
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Siren className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Emergency Ambulance</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Immediate response for life-threatening situations with ICU equipment.
              </p>
              <Link href="#" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
                Learn More <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Ambulance className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Non-Emergency Transport</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Safe and comfortable transport for planned visits and appointments.
              </p>
              <Link href="#" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
                Learn More <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Bed className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Patient Transfer</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Specialized transport for hospitals and long-distance patient relocation.
              </p>
              <Link href="#" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
                Learn More <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Medical Support</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Trained staff and equipment for critical care throughout the transit.
              </p>
              <Link href="#" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
                Learn More <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. HOW IT WORKS ================= */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Get Help in 4 Simple Steps
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Fast, hassle-free procedure during your most critical hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </span>
              <h4 className="font-bold text-slate-900 text-base mb-2">Call or Request</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dial 911 or use our online service to request an ambulance instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </span>
              <h4 className="font-bold text-slate-900 text-base mb-2">Share Your Location</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Let us know your exact location and the nature of the emergency.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </span>
              <h4 className="font-bold text-slate-900 text-base mb-2">Ambulance Arrives</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our nearest available ambulance will reach you as rapidly as possible.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                4
              </span>
              <h4 className="font-bold text-slate-900 text-base mb-2">Get the Care You Need</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive prompt and professional medical assistance and transport.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. TESTIMONIAL ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            WHAT PEOPLE SAY
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-12">
            Real Stories. Real Impact.
          </h2>

          <div className="relative flex items-center justify-center">
            {/* Prev Arrow */}
            <button className="hidden sm:flex absolute left-0 p-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600">
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Testimonial Card */}
            <div className="bg-slate-50 p-8 rounded-2xl max-w-xl mx-auto border border-slate-100 flex flex-col items-center">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="Rahim Ahmed"
                className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-white shadow-md"
              />
              <p className="text-slate-700 italic text-sm sm:text-base leading-relaxed">
                “The team was incredibly fast and professional. They arrived within
                minutes and took great care of my father. Truly grateful for their service!”
              </p>
              <div className="mt-4">
                <h5 className="font-bold text-slate-900 text-sm">— Rahim Ahmed</h5>
                <p className="text-xs text-slate-500">Dhaka, Bangladesh</p>
              </div>
            </div>

            {/* Next Arrow */}
            <button className="hidden sm:flex absolute right-0 p-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
        </div>
      </section>

      {/* ================= 8. EMERGENCY CTA BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center shrink-0">
              <PhoneCall className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                NEED AN AMBULANCE NOW?
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                Call 911 or Request an Ambulance Online
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Our team is available 24/7, 365 days a year.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:911"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
            >
              <Phone className="w-4 h-4" />
              Call 911 / Request
            </a>
            <Link
              href="#about"
              className="flex items-center gap-1.5 px-6 py-3 rounded-lg border border-slate-700 hover:border-white text-white font-semibold text-xs transition"
            >
              Learn More <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 9. FOOTER ================= */}
      <footer id="contact" className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Ambulance<span className="text-red-600">Dispatch</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              We are committed to providing fast, reliable, and professional
              ambulance services to our community. Your health and safety are
              our priority.
            </p>
            {/* <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 bg-slate-900 hover:bg-slate-800 rounded-full text-slate-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-900 hover:bg-slate-800 rounded-full text-slate-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-900 hover:bg-slate-800 rounded-full text-slate-300">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-900 hover:bg-slate-800 rounded-full text-slate-300">
                <Youtube className="w-4 h-4" />
              </a>
            </div> */}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="#" className="hover:text-white transition">Home</Link></li>
              <li><Link href="#about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="#services" className="hover:text-white transition">Services</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white transition">How It Works</Link></li>
              <li><Link href="#contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-white text-sm font-bold mb-4">Our Services</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="#" className="hover:text-white transition">Emergency Ambulance</Link></li>
              <li><Link href="#" className="hover:text-white transition">Non-Emergency Transport</Link></li>
              <li><Link href="#" className="hover:text-white transition">Patient Transfer</Link></li>
              <li><Link href="#" className="hover:text-white transition">Medical Support</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white text-sm font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span>+880 1234 567890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>info@ambulancedispatch.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>24/7 Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 gap-4">
          <p>© 2025 AmbulanceDispatch. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-400">Terms & Conditions</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}