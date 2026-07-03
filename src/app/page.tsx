import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-body-md text-on-surface">
      {/* Background Decorative Dark Red Blur Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-primary-container/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-surface/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="w-9 h-9 rounded-xl border border-white/10 object-contain" alt="Royal Hostels Logo" />
          <div>
            <h1 className="text-lg font-bold font-headline-md text-primary-container tracking-tight leading-none">Royal Hostels</h1>
            <span className="text-[9px] font-semibold text-on-surface-variant/80 tracking-wider">GIRLS CAMPUS</span>
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <a href="#about" className="hover:text-primary transition-colors">About & History</a>
          <a href="#portals" className="hover:text-primary transition-colors">Portals</a>
          <a href="#amenities" className="hover:text-primary transition-colors">Amenities</a>
        </div>

        <div className="flex items-center gap-3">
          <a href="#portals" className="px-4 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-semibold hover:bg-primary-container/85 transition-all text-xs shadow-lg shadow-primary/10">
            Sign In Portal
          </a>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center px-6 pt-28 pb-16 max-w-[1200px] mx-auto z-10 w-full">
        
        {/* Section 1: Hero - Owner Profile & History (AT THE START) */}
        <section id="about" className="w-full py-8 scroll-mt-24">
          <div className="glass-card w-full p-8 md:p-12 rounded-3xl glow-shadow relative overflow-hidden flex flex-col md:flex-row gap-8 md:gap-12 items-center text-left">
            {/* Background Spotlights */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-full pointer-events-none"></div>

            {/* Owner Picture (Left Column) */}
            <div className="w-56 h-56 md:w-72 md:h-72 flex-shrink-0 relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl">
              <img 
                src="/owner.png" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt="Chaudry Akhlaq Meharban" 
              />
              <div className="absolute bottom-0 left-0 w-full p-3.5 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-center">
                <span className="text-xs font-bold text-white tracking-widest uppercase">Chairman</span>
              </div>
            </div>

            {/* History and Details (Right Column) */}
            <div className="flex-1 space-y-5">
              <div className="flex flex-col gap-2">
                <img src="/logo-tagline.png" className="max-w-[160px] md:max-w-[180px] h-auto object-contain drop-shadow-md mb-2" alt="Royal Hostels Tagline" />
                <span className="inline-block max-w-max text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                  Hostel City Leadership
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold font-headline-md text-on-surface mt-2 tracking-tight leading-none">
                  Chaudry Akhlaq Meharban
                </h2>
                <p className="text-sm text-primary font-semibold tracking-wide">
                  Chairman of Hostel City, Islamabad
                </p>
              </div>

              <div className="space-y-4 text-on-surface-variant text-sm md:text-base leading-relaxed">
                <p>
                  Chaudry Akhlaq Meharban is an esteemed leader, visionary, and a highly experienced administrator in the student accommodation sector. Officially appointed as the **Chairman of Hostel City, Islamabad**, he supervises the entire management operations with high standards of professionalism.
                </p>
                <p>
                  Under his dedicated leadership, Royal Girls Hostels has established a reputation for providing the **best service and experienced management** in the region. We ensure students are provided with secure, clean, academic-focused, and comfortable environments tailored to meet all their requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: History & Location Map (Map on the Right Side, Below History) */}
        <section id="location" className="w-full py-6 scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* Left side: Highlights / Stats */}
            <div className="md:col-span-5 flex flex-col justify-between gap-6">
              <div className="glass-card p-6 rounded-2xl flex-1 flex flex-col justify-center text-left">
                <span className="text-xs font-bold text-primary-container uppercase tracking-wider mb-2">Our Standard</span>
                <h4 className="text-xl font-bold mb-3">Premium Student Living</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Strategically located just minutes away from COMSATS University, Branch 3 offers unmatched convenience and a safe residential neighborhood for girls.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-on-surface-variant">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                    Close proximity to COMSATS Islamabad
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                    Biometric & guard security protocols
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                    Supervised by Chairman Ch Akhlaq Meharban
                  </li>
                </ul>
              </div>

              {/* Mini Stats Banner */}
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-3.5 rounded-xl flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-extrabold text-primary">98%</span>
                  <span className="text-[9px] font-semibold text-on-surface-variant uppercase tracking-wider">Occupancy</span>
                </div>
                <div className="glass-card p-3.5 rounded-xl flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-extrabold text-secondary">1200+</span>
                  <span className="text-[9px] font-semibold text-on-surface-variant uppercase tracking-wider">Housed</span>
                </div>
                <div className="glass-card p-3.5 rounded-xl flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-extrabold text-tertiary">4.8★</span>
                  <span className="text-[9px] font-semibold text-on-surface-variant uppercase tracking-wider">Rating</span>
                </div>
              </div>
            </div>

            {/* Right side: Location Map (Directly below/alongside the history) */}
            <div className="md:col-span-7">
              <div className="glass-card p-5 rounded-3xl h-full flex flex-col justify-between gap-4">
                <div className="w-full h-64 rounded-2xl overflow-hidden border border-white/5 relative shadow-inner">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.641774390632!2d73.15734977626915!3d33.656885638531195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfebc93b30a725%3A0x169f6c3b55679e5c!2sRoyal%20Girls%20Hostel%20(Branch%203)!5e0!3m2!1sen!2spk!4v1783099999999!5m2!1sen!2spk"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full filter invert-[90%] hue-rotate-[180deg] contrast-[85%]"
                  ></iframe>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-1">
                  <div className="text-center sm:text-left">
                    <h5 className="text-xs font-bold text-on-surface flex items-center justify-center sm:justify-start gap-1">
                      <span className="material-symbols-outlined text-primary text-[16px]">location_on</span>
                      Royal Girls Hostel (Branch 3)
                    </h5>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">
                      Hostel City, Near COMSATS University, Islamabad, Pakistan
                    </p>
                  </div>
                  <a 
                    href="https://www.google.com/maps/place/Royal+Girls+Hostel+(Branch+3)/@33.6568366,73.1597717,16.79z/data=!4m6!3m5!1s0x38dfebc93b30a725:0x169f6c3b55679e5c!8m2!3d33.6568812!4d73.1595384!16s%2Fg%2F11l1p5sc91?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface text-[11px] font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    Directions
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Section 3: Portal Sign In Options (STARTING BELOW MAP & HISTORY) */}
        <section id="portals" className="w-full py-12 scroll-mt-24 border-t border-white/5 mt-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold font-headline-md text-on-surface">Portal Sign In</h3>
            <p className="text-xs text-on-surface-variant mt-1">Select your portal to access your management dashboard.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch w-full max-w-[800px] mx-auto">
            {/* Student Portal Card */}
            <Link 
              href="/login" 
              className="w-full sm:w-1/2 p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/45 hover:bg-white/10 transition-all duration-300 text-left group shadow-lg flex flex-col justify-between gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
              <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[26px]">school</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-on-surface flex items-center gap-2 group-hover:text-primary transition-colors">
                  Student Portal
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </h4>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Submit monthly hostel fees, view room details, check announcements, and file maintenance or dining complaints.
                </p>
              </div>
            </Link>

            {/* Admin Portal Card */}
            <Link 
              href="/admin/login" 
              className="w-full sm:w-1/2 p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-secondary/45 hover:bg-white/10 transition-all duration-300 text-left group shadow-lg flex flex-col justify-between gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full pointer-events-none group-hover:bg-secondary/10 transition-colors"></div>
              <div className="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[26px]">admin_panel_settings</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-on-surface flex items-center gap-2 group-hover:text-secondary transition-colors">
                  Admin Portal
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </h4>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Manage branches, oversee student records, verify monthly fee submissions, register staff, and resolve complaints.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Section 4: Detailed Key Features / Amenities */}
        <section id="amenities" className="w-full py-12 scroll-mt-24 border-t border-white/5 mt-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold font-headline-md text-on-surface">Hostel Amenities</h3>
            <p className="text-xs text-on-surface-variant mt-1">We provide everything necessary for a secure, focused, and premium student life.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-[950px] mx-auto">
            <div className="glass-card p-8 rounded-2xl text-left group">
              <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">wifi</span>
              </div>
              <h4 className="text-lg font-bold mb-2">High-Speed WiFi</h4>
              <p className="text-sm text-on-surface-variant">Dedicated fiber broadband coverage across all rooms and study lounges.</p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl text-left group">
              <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">electric_bolt</span>
              </div>
              <h4 className="text-lg font-bold mb-2">Generator Backup</h4>
              <p className="text-sm text-on-surface-variant">24/7 automatic generator standby to ensure continuous power and comfort.</p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl text-left group">
              <div className="w-12 h-12 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">directions_bus</span>
              </div>
              <h4 className="text-lg font-bold mb-2">COMSATS Transport</h4>
              <p className="text-sm text-on-surface-variant">Daily shuttle service coordinated with university class timings.</p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl text-left group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-on-surface mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">local_laundry_service</span>
              </div>
              <h4 className="text-lg font-bold mb-2">Laundry Services</h4>
              <p className="text-sm text-on-surface-variant">Commercial-grade washing machines and professional weekly ironing.</p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl text-left group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-on-surface mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">restaurant</span>
              </div>
              <h4 className="text-lg font-bold mb-2">Daily Mess Facility</h4>
              <p className="text-sm text-on-surface-variant">Hygienic and healthy meals prepared by professional chefs, served daily.</p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl text-left group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-on-surface mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">security</span>
              </div>
              <h4 className="text-lg font-bold mb-2">24/7 Security & CCTV</h4>
              <p className="text-sm text-on-surface-variant">Guard deployment, biometric entry system, and full CCTV surveillance.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest/80 border-t border-white/5 px-6 py-8 mt-auto z-10">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <h5 className="font-bold text-sm text-primary-container">Royal Group of Hostels</h5>
            <p className="text-xs text-on-surface-variant mt-1">© 2026 Royal Group of Hostel. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-xs text-on-surface-variant">
            <a href="#" className="hover:text-primary-container transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-container transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-container transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
