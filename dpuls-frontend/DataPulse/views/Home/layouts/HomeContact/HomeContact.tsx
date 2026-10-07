import React, {useState, useRef} from "react";
import {Section} from "./../../../../components/UI";
import {useLanguage} from "./../../../../components/LanguageContext";
import {Reveal} from "./../../../../components/Reveal";
import {API_BASE_URL} from "./../../../../config/api";

interface HomeContactProps {
  content: {
    contact: {
      badge: string;
      title: string;
      subtitle: string;
      selectOffice: string;
      contactCards: Array<{
        id: string;
        title: string;
        badge: string;
        address: string;
        email: string;
        phone: string;
        coordinates: {cx: number; cy: number};
      }>;
      form: {
        name: string;
        email: string;
        subject: string;
        message: string;
        submit: string;
      };
    };
  };
}

export default function HomeContact({content}: HomeContactProps) {
  const {t, dir, language} = useLanguage();
  const displayContent = content.contact;
  const locations = displayContent.contactCards;
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);
  const activeLocation = locations[activeLocationIndex];
  const tabsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{type: "success" | "error"; msg: string} | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({
        type: "error",
        msg: language === "ar" ? "يرجى ملء جميع الحقول المطلوبة (الاسم، البريد، الرسالة)." : "Please fill in all required fields (Name, Email, Message).",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({
          type: "success",
          msg: result.message || (language === "ar" ? "تم إرسال رسالتك بنجاح!" : "Your message has been sent successfully!"),
        });
        setFormData({name: "", email: "", subject: "", message: ""});
      } else {
        setStatus({
          type: "error",
          msg: result.message || (language === "ar" ? "حدث خطأ أثناء الإرسال." : "Failed to send message."),
        });
      }
    } catch (err: any) {
      setStatus({
        type: "error",
        msg: language === "ar" ? "تعذر الاتصال بالسيرفر. يرجى المحاولة لاحقاً." : "Could not connect to server. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      if (direction === "left") {
        tabsRef.current.scrollBy({left: -scrollAmount, behavior: "smooth"});
      } else {
        tabsRef.current.scrollBy({left: scrollAmount, behavior: "smooth"});
      }
    }
  };

  const labelClass =
    "block text-xs font-bold uppercase tracking-widest text-white mb-2 transition-colors duration-300 group-focus-within:text-brand-400";
  const inputClass =
    "w-full bg-brand-950/50 border border-brand-800 text-white text-base rounded-lg px-4 py-3.5 transition-all duration-300 placeholder-[#323a4d] focus:bg-brand-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none hover:border-brand-700";

  return (
    <Section
      className="bg-[#0b1021] py-24 lg:py-32 relative overflow-hidden"
      id="contact"
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full object-cover md:object-contain text-brand-500"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="world-dots"
              x="0"
              y="0"
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="1.5"
                cy="1.5"
                r="1.2"
                fill="currentColor"
                opacity="0.5"
              />
            </pattern>

            <mask id="world-mask">
              <rect width="100%" height="100%" fill="black" />
              <g transform="translate(50,50) scale(0.9)" fill="white">
                <path d="M100,50 Q150,30 200,60 L240,100 L200,160 L120,150 L80,80 Z" />
                <path d="M220,190 L270,200 L260,320 L230,380 L190,260 Z" />
                <path d="M430,60 L490,50 L510,90 L460,120 L420,100 Z" />
                <path d="M420,150 L500,140 L540,240 L470,300 L400,220 Z" />
                <path d="M550,50 L720,40 L780,140 L700,220 L550,180 Z" />
                <path d="M780,280 L860,270 L880,340 L800,360 Z" />
              </g>
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#world-dots)"
            mask="url(#world-mask)"
          />
          {locations.map((loc, index) => {
            const isActive = index === activeLocationIndex;
            return (
              <g key={loc.id}>
                <circle
                  cx={loc.coordinates.cx}
                  cy={loc.coordinates.cy}
                  r={isActive ? 4 : 2}
                  className={`transition-all duration-500 ${isActive ? "fill-white shadow-[0_0_10px_white]" : "fill-brand-400 opacity-50"}`}
                />
                {!isActive && (
                  <path
                    d={`M${activeLocation.coordinates.cx},${activeLocation.coordinates.cy} Q${(activeLocation.coordinates.cx + loc.coordinates.cx) / 2},${Math.min(activeLocation.coordinates.cy, loc.coordinates.cy) - 50} ${loc.coordinates.cx},${loc.coordinates.cy}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                    className="opacity-20"
                  />
                )}
              </g>
            );
          })}
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0b1021_90%)]"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 backdrop-blur-sm mb-6 shadow-[0_0_20px_-5px_rgba(67,97,238,0.3)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              <span className="text-brand-300 text-[10px] font-bold uppercase tracking-widest">
                {displayContent.badge}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-brand-200">
                {displayContent.title}
              </span>
              <br />
              {displayContent.subtitle}
            </h2>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-[#131c35]/60 backdrop-blur-xl border border-brand-800/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-70"></div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {displayContent.title}
                      </h3>
                      <p className="text-white text-sm leading-relaxed">
                        {displayContent.selectOffice}
                      </p>
                    </div>

                    <div className="hidden sm:flex gap-1.5">
                      <button
                        onClick={() => scrollTabs("left")}
                        className="w-8 h-8 rounded-full bg-brand-900/40 border border-brand-800 text-brand-300 hover:bg-brand-800 hover:text-white flex items-center justify-center transition-colors"
                      >
                        <i
                          className={`fa-solid ${dir === "rtl" ? "fa-chevron-right" : "fa-chevron-left"} text-xs`}
                        ></i>
                      </button>
                      <button
                        onClick={() => scrollTabs("right")}
                        className="w-8 h-8 rounded-full bg-brand-900/40 border border-brand-800 text-brand-300 hover:bg-brand-800 hover:text-white flex items-center justify-center transition-colors"
                      >
                        <i
                          className={`fa-solid ${dir === "rtl" ? "fa-chevron-left" : "fa-chevron-right"} text-xs`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  <div className="w-full relative group/tabs">
                    <div
                      ref={tabsRef}
                      className="flex gap-3 overflow-x-auto pb-6 pt-2 px-1 hide-scrollbar scroll-smooth w-full"
                    >
                      {locations.map((loc, index) => (
                        <button
                          key={loc.id}
                          onClick={() => setActiveLocationIndex(index)}
                          className={`group relative flex-shrink-0 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 border whitespace-nowrap ${
                            index === activeLocationIndex
                              ? "bg-brand-600 border-brand-500 text-white shadow-[0_4px_20px_-5px_rgba(67,97,238,0.5)] scale-100 translate-y-0 z-10"
                              : "bg-brand-900/40 border-brand-800 text-brand-300 hover:bg-brand-800 hover:text-white z-0"
                          }`}
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {loc.title}
                            {index === activeLocationIndex && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            )}
                          </span>

                          <div
                            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-600 rotate-45 transform transition-all duration-300 ease-out z-[-1] ${
                              index === activeLocationIndex
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-2"
                            }`}
                          ></div>
                        </button>
                      ))}
                      <div className="w-2 flex-shrink-0"></div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden min-h-[300px] -mt-2">
                    {locations.map((loc, index) => (
                      <div
                        key={loc.id}
                        className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                          index === activeLocationIndex
                            ? "opacity-100 translate-y-0 z-10"
                            : "opacity-0 -translate-y-4 pointer-events-none z-0"
                        }`}
                      >
                        <div className="bg-brand-900/30 rounded-2xl p-6 sm:p-6 border border-brand-800/50 space-y-6 backdrop-blur-sm relative shadow-xl">
                          <div className="flex flex-wrap justify-between items-center border-b border-brand-800/50 pb-5 gap-2">
                            <span className="text-white font-bold text-lg flex items-center gap-2">
                              {loc.title}
                              <span className="text-brand-500 text-xs font-normal opacity-60 hidden sm:inline-block">
                                / Regional Office
                              </span>
                            </span>
                            <span className="px-2.5 py-1 bg-brand-500/20 text-brand-300 text-[10px] font-bold uppercase tracking-widest rounded border border-brand-500/30">
                              {loc.badge}
                            </span>
                          </div>

                          <div className="space-y-5">
                            <div className="flex items-start gap-4">
                              <div className="mt-1 w-9 h-9 rounded-lg flex items-center justify-center bg-brand-800/50 text-brand-400 text-sm shrink-0 border border-brand-700/30 shadow-inner shadow-black/20">
                                <i className="fa-solid fa-location-dot"></i>
                              </div>
                              <p className="text-white text-sm leading-relaxed pt-1.5">
                                {loc.address}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-brand-800/50 text-brand-400 text-sm shrink-0 border border-brand-700/30 shadow-inner shadow-black/20">
                                <i className="fa-solid fa-envelope"></i>
                              </div>
                              <a
                                href={`mailto:${loc.email}`}
                                className="text-white text-sm hover:text-white transition-colors"
                              >
                                {loc.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-brand-800/50 text-brand-400 text-sm shrink-0 border border-brand-700/30 shadow-inner shadow-black/20">
                                <i className="fa-solid fa-phone"></i>
                              </div>
                              <a
                                href={`tel:${loc.phone}`}
                                className="text-white text-sm hover:text-white transition-colors "
                              >
                                {loc.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <form
                    className="space-y-6 bg-brand-900/20 p-6 md:p-8 rounded-2xl border border-brand-800/30"
                    onSubmit={handleSubmit}
                  >
                    {status && (
                      <div
                        className={`p-4 rounded-lg text-sm font-medium border transition-all ${
                          status.type === "success"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                            : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                        }`}
                      >
                        {status.msg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="group">
                        <label className={labelClass}>
                          {displayContent.form.name} *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={inputClass}
                          placeholder={displayContent.form.name}
                          required
                        />
                      </div>
                      <div className="group">
                        <label className={labelClass}>
                          {displayContent.form.email} *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={inputClass}
                          placeholder="work@company.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className={labelClass}>
                        {displayContent.form.subject}
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="General Inquiry"
                      />
                    </div>
                    <div className="group">
                      <label className={labelClass}>
                        {displayContent.form.message} *
                      </label>
                      <textarea
                        rows={4}
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`${inputClass} resize-none`}
                        placeholder={`Message for ${activeLocation.title} Team...`}
                        required
                      ></textarea>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-lg uppercase tracking-widest text-sm transition-all shadow-[0_0_25px_-5px_rgba(67,97,238,0.4)] hover:shadow-[0_0_35px_-5px_rgba(67,97,238,0.6)] hover:-translate-y-0.5 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading
                          ? (language === "ar" ? "جاري الإرسال..." : "Sending...")
                          : displayContent.form.submit}
                        <i
                          className={`fa-solid ${dir === "rtl" ? "fa-arrow-left" : "fa-arrow-right"} transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1`}
                        ></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
