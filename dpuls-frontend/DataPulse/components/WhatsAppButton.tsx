import React from "react";
import {useLanguage} from "./LanguageContext";

export default function WhatsAppButton() {
  const {language} = useLanguage();
  const phoneNumber = "+966551958719";

  // Custom message for the chat
  const message =
    language === "ar"
      ? "مرحباً، أود الاستفسار عن خدماتكم."
      : "Hello, I would like to inquire about your services.";

  const whatsappUrl = `https://wa.me/${phoneNumber.replace(
    "+",
    ""
  )}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 end-8 z-[100] group flex items-center transition-all duration-300"
      aria-label="Chat on WhatsApp"
    >
      <div className="flex items-center gap-3">
        {/* Tooltip/Label */}
        <div className="bg-white px-4 py-2 rounded-full shadow-2xl border border-gray-100 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none hidden md:block">
          <p className="text-sm font-bold text-slate-800 whitespace-nowrap">
            {language === "ar" ? "تواصل معنا عبر واتساب" : "Chat with us on WhatsApp"}
          </p>
        </div>

        {/* Button */}
        <div className="relative">
          {/* Animated rings for attention */}
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 group-hover:opacity-0 transition-opacity"></div>
          <div className="absolute inset-[-4px] border-2 border-green-500/20 rounded-full group-hover:scale-110 transition-transform duration-500"></div>

          <div className="w-14 h-14 md:w-16 md:h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-[0_15px_30px_-5px_rgba(34,197,94,0.4)] group-hover:scale-110 group-hover:bg-green-600 transition-all duration-300 relative overflow-hidden group">
            {/* Glossy shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <i className="fa-brands fa-whatsapp text-3xl md:text-4xl drop-shadow-md"></i>
          </div>
        </div>
      </div>
    </a>
  );
}
