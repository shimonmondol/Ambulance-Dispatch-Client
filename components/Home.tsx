import Link from "next/link";
import {
  Phone,
  Zap,
  ShieldCheck,
  MapPin,
  Heart,
  ChevronRight,
  Siren,
  Ambulance,
  Bed,
  HeartHandshake,
  Mail,
  Clock,
  PhoneCall,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-red-500 selection:text-white flex flex-col justify-between">
      <div>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block text-xs font-bold tracking-widest text-slate-300 uppercase bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                24/7 Emergency Ambulance{" "}
                <span className="text-red-400">Dispatch</span>
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                When Every Second Matters,{" "}
                <span className="text-red-500">We&apos;re There.</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed">
                Quick, reliable, and professional ambulance dispatch services
                for emergencies and non-emergencies.
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
                  href="/services"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-slate-600 hover:border-white text-white font-semibold text-sm transition"
                >
                  Our Services <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-xl aspect-[16/11] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=1200&q=80"
                  alt="Emergency Ambulance"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Highlights Ribbon */}
        <section className="bg-white border-b border-slate-100 py-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            <div className="flex flex-col items-center p-3">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 fill-red-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Fast Response
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Under 15-minute response time.
              </p>
            </div>

            <div className="flex flex-col items-center p-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Certified Team
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Experienced paramedics.
              </p>
            </div>

            <div className="flex flex-col items-center p-3">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6 fill-red-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">GPS Tracking</h4>
              <p className="text-xs text-slate-500 mt-1">
                Live tracking on request.
              </p>
            </div>

            <div className="flex flex-col items-center p-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">24/7 Support</h4>
              <p className="text-xs text-slate-500 mt-1">
                Available 365 days a year.
              </p>
            </div>

            <div className="flex flex-col items-center p-3 col-span-2 md:col-span-1">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Quality Care</h4>
              <p className="text-xs text-slate-500 mt-1">
                Patient comfort & safety first.
              </p>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  WHAT WE DO
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                  Our Dispatch Services
                </h2>
              </div>
              <Link
                href="/services"
                className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                View All Services <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  <Siren className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Emergency Ambulance
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  ICU-equipped vehicles for life-threatening emergencies.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Ambulance className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Non-Emergency Transport
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Safe transit for routine doctor appointments & checkups.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Bed className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Patient Transfer
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  City-to-city or inter-hospital transfer arrangements.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Medical Support
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Oxygen supply, paramedic attendance & specialized gear.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
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
                  Available 24/7 across the country.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="tel:911"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
              >
                <Phone className="w-4 h-4" />
                Call 911 / Request
              </a>
              <Link
                href="/contact"
                className="flex items-center gap-1.5 px-6 py-3 rounded-lg border border-slate-700 hover:border-white text-white font-semibold text-xs transition"
              >
                Contact Support <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Ambulance<span className="text-red-600"> Dispatch</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              We are committed to providing fast, reliable, and professional
              ambulance services to our community.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold mb-4">Our Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services" className="hover:text-white transition">
                  Emergency Ambulance
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition">
                  Non-Emergency Transport
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition">
                  Patient Transfer
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition">
                  Medical Support
                </Link>
              </li>
            </ul>
          </div>

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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 gap-4">
          <p>© 2026 Ambulance Dispatch. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-slate-400">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-slate-400">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
