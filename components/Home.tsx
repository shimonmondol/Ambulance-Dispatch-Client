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
  Clock,
  PhoneCall,
  CheckCircle2,
  Users,
} from "lucide-react";
import Footer from "./Footer";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-red-500 selection:text-white flex flex-col justify-between">
        <div>
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-slate-50 text-white py-16 lg:py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6 mb-20">
                <span className="inline-block text-xs font-bold tracking-widest text-slate-800 uppercase bg-white/10 px-3 rounded-full backdrop-blur-sm border border-white/10">
                  24/7 Emergency Ambulance{" "}
                  <span className="text-red-400">Dispatch</span>
                </span>
                <h1 className="text-4xl text-gray-800 sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                  When Every Second Matters,{" "}
                  <span className="text-red-500">We are There.</span>
                </h1>
                <p className="text-slate-800 text-base sm:text-lg max-w-lg leading-relaxed">
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
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition hover:scale-105"
                  >
                    Our Services <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 flex justify-center">
                <div className="relative w-full max-w-xl aspect-16/11 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src="https://i.ibb.co.com/DhbM5h1/Ambulance.jpg"
                    alt="Emergency Ambulance"
                    className="w-full h-full object-cover bg-black/60"
                  />
                </div>
              </div>
            </div>
          </section>
          {/* About Section */}
          <section className="py-20 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Image */}
                <div className="relative order-2 lg:order-1">
                  <div className="overflow-hidden rounded-2xl shadow-xl">
                    <img
                      src="https://i.ibb.co.com/TDvP2qP5/Ambulance2.jpg"
                      alt="Paramedics team with patient and ambulance"
                      className="w-full h-90 md:h-105 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Right Content */}
                <div className="space-y-6 order-1 lg:order-2">
                  <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                    About Us
                  </span>

                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 leading-tight">
                    Trusted Ambulance Services When It Matters Most
                  </h2>

                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    We provide fast, safe, and reliable ambulance dispatch
                    services to help people in critical situations. Our team is
                    available 24/7 to ensure you get the right care, at the
                    right time, with the right support.
                  </p>

                  {/* Stats / Badges */}
                  <div className="grid grid-cols-3 gap-4 pt-4 pb-2">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-7 h-7 text-blue-600 shrink-0" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm md:text-base">
                          24/7
                        </h4>
                        <p className="text-xs text-slate-500">Availability</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Users className="w-7 h-7 text-blue-600 shrink-0" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm md:text-base">
                          500+
                        </h4>
                        <p className="text-xs text-slate-500">Trained Staff</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-7 h-7 text-blue-600 shrink-0" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm md:text-base">
                          10,000+
                        </h4>
                        <p className="text-xs text-slate-500">
                          Lives Supported
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* About Us Button */}
                  <div className="pt-2">
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#0a2540] hover:bg-[#081e33] text-white font-medium text-sm rounded-lg transition-colors duration-200">
                      <span>Learn More About Us</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
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
                <h4 className="font-bold text-slate-900 text-sm">
                  GPS Tracking
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Live tracking on request.
                </p>
              </div>

              <div className="flex flex-col items-center p-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  24/7 Support
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Available 365 days a year.
                </p>
              </div>

              <div className="flex flex-col items-center p-3 col-span-2 md:col-span-1">
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Quality Care
                </h4>
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
            <div className="rounded-2xl bg-linear-to-r from-slate-900 via-slate-950 to-blue-950 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
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
      </div>
      <Footer/>
    </>
  );
}
