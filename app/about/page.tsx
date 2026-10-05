"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  Users,
  Award,
  Target,
  Eye,
  Heart,
  Zap,
  Activity,
  CheckCircle2,
  Stethoscope,
  Ambulance,
} from "lucide-react";
import Footer from "@/components/Footer";

const testimonials = [
  {
    quote:
      "The team was incredibly fast and professional. They arrived within minutes and took great care of my father. Truly grateful for their service!",
    author: "Rahim Ahmed",
    location: "Dhanmondi, Dhaka",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote:
      "During a critical medical emergency at midnight, their dispatch responded immediately. The paramedic onboard was calm and extremely skilled.",
    author: "Nusrat Jahan",
    location: "Uttara, Dhaka",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote:
      "Clean ambulance, life-saving ICU setup, and highly dedicated staff. They coordinated with the receiving hospital before we even arrived.",
    author: "Tanvir Hasan",
    location: "Mirpur, Dhaka",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
  },
];

export default function AboutContent() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <main className="w-full bg-slate-50 font-sans text-slate-800">
      
      {/* ================= 1. HERO BANNER ================= */}
      <section className="relative overflow-hidden bg-slate-900 py-16 md:py-24 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.ibb.co.com/DhbM5h1/Ambulance.jpg"
            alt="Ambulance Fleet"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            {/* Breadcrumb */}
            <div className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-3 flex items-center gap-2">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-red-400">About Us</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              About Us <br />
              <span className="text-red-500">Committed to Saving Lives</span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-300 font-light leading-relaxed">
              We are more than just an ambulance dispatch service — we are a team
              of dedicated professionals committed to saving lives and providing
              the best emergency care when it matters most.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 2. About Us SECTION ================= */}
      <section className="py-16 -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Card (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-200/40 space-y-5">
              <div>
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                  About Us <span className="h-[2px] w-6 bg-red-500 inline-block"></span>
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
                  Trusted Ambulance Service for a{" "}
                  <span className="text-red-600">Safer Tomorrow</span>
                </h2>
              </div>

              <div className="space-y-3.5 text-slate-600 text-sm leading-relaxed">
                <p>
                  Ambulance Dispatch is a 24/7 emergency ambulance service operating
                  across Dhaka and surrounding regions. We connect patients with
                  trained professionals, advanced medical equipment, and fast,
                  reliable transport — ensuring timely care when every second counts.
                </p>
                <p>
                  Our mission is to make emergency medical services accessible,
                  efficient, and dependable for everyone, always.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="tel:911"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md shadow-red-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Phone className="w-4 h-4 fill-white" />
                  <span>Call 911 / Request Ambulance</span>
                </a>

                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold px-5 py-3 rounded-xl transition"
                >
                  <span>Our Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Image Card (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-3 rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="rounded-2xl overflow-hidden h-[340px] md:h-[380px] relative">
                <img
                  src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1000&q=80"
                  alt="Paramedics Attending a Patient"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active Response Team
                  </div>
                  <span className="text-slate-500 font-medium">Dhaka Central</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 3. STATS CARDS ================= */}
      <section className="py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Stat 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 leading-none">24/7</span>
                <h3 className="font-semibold text-slate-800 text-sm mt-1">Availability</h3>
                <p className="text-xs text-slate-500 mt-0.5">Always ready, anytime, anywhere.</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 leading-none">500+</span>
                <h3 className="font-semibold text-slate-800 text-sm mt-1">Trained Staff</h3>
                <p className="text-xs text-slate-500 mt-0.5">Skilled paramedics and certified drivers.</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 leading-none">10,000+</span>
                <h3 className="font-semibold text-slate-800 text-sm mt-1">Lives Supported</h3>
                <p className="text-xs text-slate-500 mt-0.5">Making an impact every single day.</p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 fill-rose-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 leading-none">100%</span>
                <h3 className="font-semibold text-slate-800 text-sm mt-1">Commitment</h3>
                <p className="text-xs text-slate-500 mt-0.5">Your safety and health are our priority.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 4. MISSION, VISION, VALUES ================= */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest inline-flex items-center gap-2">
              Our Foundations <span className="h-[2px] w-6 bg-red-500 inline-block"></span>
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
              Guiding Principles of Our Service
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Mission */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider block">
                  Our Mission
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Save Lives, Serve with Compassion
                </h3>
                <p className="text-slate-500 text-xs md:text-sm mt-2.5 leading-relaxed">
                  To provide fast, reliable, and high-quality ambulance dispatch
                  services with unconditional focus on patient safety, care, and
                  community health.
                </p>
              </div>
            </div>

            {/* Card 2: Vision */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                  Our Vision
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  A Healthier Community for Everyone
                </h3>
                <p className="text-slate-500 text-xs md:text-sm mt-2.5 leading-relaxed">
                  To be the nation’s most reliable medical response platform,
                  leveraging technology to minimize wait times and maximize clinical
                  survival outcomes.
                </p>
              </div>
            </div>

            {/* Card 3: Values */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                  Our Core Values
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Care &bull; Professionalism &bull; Integrity
                </h3>
                <p className="text-slate-500 text-xs md:text-sm mt-2.5 leading-relaxed">
                  We maintain the highest clinical standards, transparency, and
                  ethical care in every emergency dispatch and patient interaction.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 5. WHY CHOOSE US ================= */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Image (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-3 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col">
              <div className="w-full h-full min-h-[340px] rounded-2xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80"
                  alt="Certified Paramedic"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white">
                    <h4 className="font-bold text-sm">Certified Emergency Medical Specialists</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">Equipped with Advanced Life Support (ALS) capabilities.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Features (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                  Why Choose Us <span className="h-[2px] w-6 bg-red-500 inline-block"></span>
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
                  Experienced Team. Advanced Care.
                </h2>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  We integrate technology, medical expertise, and rapid logistical
                  routing to provide unparalleled emergency care across urban centers.
                </p>

                {/* 2x2 Feature Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 fill-red-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Fast Response Time</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Quick dispatch algorithm and minimal wait times.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Certified Paramedics</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Highly experienced doctors, EMTs, and drivers.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Modern ICU Equipment</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Ventilators, ECG monitors, and oxygen systems onboard.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <Heart className="w-5 h-5 fill-rose-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Patient-First Care</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Dignity, safety, and continuous monitoring during transit.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Trust Row */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ministry of Health Compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Real-time GPS Tracking
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Medical Staff
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 6. TESTIMONIALS (WHAT PEOPLE SAY) ================= */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest inline-flex items-center gap-2">
            What People Say <span className="h-[2px] w-6 bg-red-500 inline-block"></span>
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
            Real Stories. Real Impact.
          </h2>

          <div className="mt-8 relative flex items-center justify-center">
            {/* Prev Button */}
            <button
              type="button"
              onClick={prevTestimonial}
              className="absolute left-0 -translate-x-2 sm:-translate-x-6 w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center shadow-sm transition z-10 cursor-pointer"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Testimonial Card */}
            <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-5 text-left">
              <img
                src={testimonials[activeTestimonial].avatar}
                alt={testimonials[activeTestimonial].author}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0"
              />
              <div className="space-y-2">
                <p className="text-xs md:text-sm text-slate-600 italic leading-relaxed">
                  &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
                </p>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    &mdash; {testimonials[activeTestimonial].author}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {testimonials[activeTestimonial].location}
                  </p>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={nextTestimonial}
              className="absolute right-0 translate-x-2 sm:translate-x-6 w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center shadow-sm transition z-10 cursor-pointer"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTestimonial(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeTestimonial === idx
                    ? "w-6 bg-red-600"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= 7. EMERGENCY CTA BANNER ================= */}
      <section className="py-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0d3463] to-[#0a2345] rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-5 z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
                <Activity className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-red-400">
                  EMERGENCY?
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                  Need an Ambulance Now?
                </h3>
                <p className="text-xs md:text-sm text-slate-300 mt-1">
                  Call 911 or request an ambulance in just a few clicks.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto z-10">
              <a
                href="tel:911"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg shadow-red-600/30 transition-all hover:scale-105"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>Call 911 / Request Ambulance</span>
              </a>

              <Link
                href="/services"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 border border-slate-600 hover:border-slate-400 text-white text-sm font-medium px-5 py-3 rounded-xl hover:bg-white/5 transition"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}