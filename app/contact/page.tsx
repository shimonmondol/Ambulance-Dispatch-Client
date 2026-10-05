"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar"
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Headphones,
  ShieldCheck,
  Clock,
  Send,
  ArrowRight,
  Maximize2,
  Plus,
  Minus,
  Activity,
  ChevronDown,
} from "lucide-react";
import Footer from "@/components/Footer";

export default function ContactContent() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <main className="w-full bg-slate-50 font-sans text-slate-800">
      {/* ================= 1. HERO BANNER ================= */}
      <section className="relative overflow-hidden bg-slate-900 py-16 md:py-24 text-white">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.ibb.co.com/DhbM5h1/Ambulance.jpg"
            alt="Ambulance Emergency"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            {/* Breadcrumb */}
            <div className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-3 flex items-center gap-2">
              <span>Home</span>
              <span>/</span>
              <span className="text-red-400">Contact</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Get in Touch <br />
              <span className="text-red-500">We&apos;re Here to Help</span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-300 font-light leading-relaxed">
              Have a question, need assistance, or want to request an ambulance?
              Our team is available 24/7 to assist you. Reach out to us anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 2. CONTACT INFO & FORM SECTION ================= */}
      <section className="py-16 -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Contact Info Cards (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                  Contact Us <span className="h-[2px] w-6 bg-red-500 inline-block"></span>
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
                  Multiple Ways to Reach Us
                </h2>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  We&apos;re available 24/7 for your emergencies, inquiries, and support.
                  Choose the option that works best for you.
                </p>
              </div>

              {/* Cards List */}
              <div className="space-y-3 pt-3">
                {/* Phone Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 fill-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Call Us Anytime</h3>
                    <p className="text-xs text-slate-500 mt-0.5">For immediate assistance and emergency requests.</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-red-600">911</span>
                      <span className="text-xs text-slate-400 font-medium">(Free & 24/7)</span>
                    </div>
                  </div>
                </div>

                {/* Email Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Email Us</h3>
                    <p className="text-xs text-slate-500 mt-0.5">For non-urgent questions and support.</p>
                    <a
                      href="mailto:info@ambulancedispatch.com"
                      className="text-sm font-bold text-blue-600 hover:underline mt-1 inline-block"
                    >
                      info@ambulancedispatch.com
                    </a>
                  </div>
                </div>

                {/* Office Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-red-500 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Our Office</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      123 Health Care Avenue <br />
                      Dhaka 1207, Bangladesh
                    </p>
                  </div>
                </div>

                {/* Live Support Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Live Support</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Chat with our support team for quick help.</p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Available 24/7
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-200/40">
              <h2 className="text-2xl font-bold text-slate-900">Send Us a Message</h2>
              <p className="text-slate-500 text-xs md:text-sm mt-1">
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                    />
                  </div>

                  {/* Subject Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 appearance-none bg-white transition cursor-pointer"
                      >
                        <option value="">Select a subject</option>
                        <option value="ambulance">Emergency Ambulance Request</option>
                        <option value="transport">Non-Emergency Transport</option>
                        <option value="inquiry">General Inquiry</option>
                        <option value="feedback">Feedback / Support</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Type your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition resize-none"
                  ></textarea>
                  <div className="text-right text-[11px] text-slate-400 mt-1">
                    {formData.message.length}/500
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 cursor-pointer bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Secure &amp; Reliable</h4>
                    <p className="text-[11px] text-slate-500 leading-tight">Your information is safe with us.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Quick Response</h4>
                    <p className="text-[11px] text-slate-500 leading-tight">We reply as soon as possible.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">24/7 Support</h4>
                    <p className="text-[11px] text-slate-500 leading-tight">Always here for you.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 3. MAP & OFFICE HOURS ================= */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Map Preview Area (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-3 shadow-sm relative overflow-hidden flex flex-col min-h-[360px]">
              <div className="w-full h-full min-h-[340px] rounded-2xl overflow-hidden relative">
                <iframe
                  title="Dhaka Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116834.00977789319!2d90.3492858591322!3d23.780777744383437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                  className="w-full h-full border-0 absolute inset-0 filter contrast-[1.05]"
                  loading="lazy"
                ></iframe>

                {/* Floating Location Info Box */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-200/70 max-w-xs z-10">
                  <h4 className="text-xs font-bold text-slate-900">Our Location</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    123 Health Care Avenue <br />
                    Dhaka 1207, Bangladesh
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 mt-2.5"
                  >
                    Get Directions <ArrowRight className="w-3 h-3" />
                  </a>
                </div>

                {/* Map Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
                  <button className="w-8 h-8 bg-white shadow rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-50">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 bg-white shadow rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-50">
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 z-10">
                  <button className="w-8 h-8 bg-white shadow rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-50">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Office Hours (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Our Office Hours</h3>
                </div>

                {/* Timetable */}
                <div className="mt-6 divide-y divide-slate-100 text-sm">
                  <div className="py-3 flex justify-between items-center text-slate-600">
                    <span className="font-medium">Monday – Friday</span>
                    <span className="font-semibold text-slate-900">24 Hours</span>
                  </div>
                  <div className="py-3 flex justify-between items-center text-slate-600">
                    <span className="font-medium">Saturday</span>
                    <span className="font-semibold text-slate-900">24 Hours</span>
                  </div>
                  <div className="py-3 flex justify-between items-center text-slate-600">
                    <span className="font-medium">Sunday</span>
                    <span className="font-semibold text-slate-900">24 Hours</span>
                  </div>
                  <div className="py-3 flex justify-between items-center text-slate-600">
                    <span className="font-medium">Holidays</span>
                    <span className="font-semibold text-slate-900">24 Hours</span>
                  </div>
                </div>
              </div>

              {/* Notice Box */}
              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  i
                </div>
                <p className="text-xs text-blue-900 font-medium leading-relaxed">
                  For emergency medical services, please call <strong>911</strong> at any time.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 4. EMERGENCY CTA BANNER ================= */}
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
      <Footer/>
    </main>
  );
}