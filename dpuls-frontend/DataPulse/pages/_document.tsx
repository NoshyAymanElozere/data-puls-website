import {Html, Head, Main, NextScript} from "next/document";

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W5SMKHM3');`,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-D9ES7BDT7Z"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-D9ES7BDT7Z');
            `,
          }}
        />
        {/* End Google tag */}

        <link rel="icon" type="image/png" href="/fav.png" />
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        {/* Tailwind CSS CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: "class",
                theme: {
                  extend: {
                    colors: {
                      brand: {
                        50: "#f0f4ff",
                        100: "#e0eaff",
                        200: "#c7d9ff",
                        300: "#9cbaff",
                        400: "#6e91ff",
                        500: "#4361ee",
                        600: "#2b3ff0",
                        700: "#222ec2",
                        800: "#192652",
                        900: "#0f172a",
                        950: "#020617",
                      },
                    },
                    fontFamily: {
                      sans: ["var(--font-primary)", "Inter", "sans-serif"],
                      arabic: ["IBM Plex Sans Arabic", "sans-serif"],
                    },
                    animation: {
                      "reveal-up": "revealUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                      "fade-in": "fadeIn 1s ease-out forwards",
                      "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                      glow: "glow 3s ease-in-out infinite alternate",
                      shimmer: "shimmer 2s infinite",
                      marquee: "marquee 40s linear infinite",
                      "spin-slow": "spin 15s linear infinite",
                    },
                    keyframes: {
                      revealUp: {
                        "0%": {opacity: "0", transform: "translateY(40px)"},
                        "100%": {opacity: "1", transform: "translateY(0)"},
                      },
                      fadeIn: {
                        "0%": {opacity: "0"},
                        "100%": {opacity: "1"},
                      },
                      glow: {
                        "0%": {boxShadow: "0 0 5px rgba(67, 97, 238, 0.2)"},
                        "100%": {
                          boxShadow: "0 0 20px rgba(67, 97, 238, 0.6), 0 0 10px rgba(67, 97, 238, 0.4)",
                        },
                      },
                      shimmer: {
                        "0%": {transform: "translateX(-100%)"},
                        "100%": {transform: "translateX(100%)"},
                      },
                      marquee: {
                        "0%": {transform: "translateX(0%)"},
                        "100%": {transform: "translateX(-50%)"},
                      },
                    },
                  },
                },
              };
            `,
          }}
        />

        {/* Global Styles */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --font-primary: "Inter", sans-serif;
              }
              :root[dir="rtl"],
              [dir="rtl"] {
                --font-primary: "IBM Plex Sans Arabic", sans-serif;
              }
              body {
                font-family: var(--font-primary);
              }
              .scroll-smooth {
                scroll-behavior: smooth;
              }
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .hide-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              @media (prefers-reduced-motion: reduce) {
                .animate-reveal-up,
                .animate-fade-in,
                .animate-pulse-slow,
                .animate-glow,
                .animate-shimmer,
                .animate-marquee,
                .animate-spin-slow {
                  animation: none;
                  opacity: 1;
                  transform: none;
                }
              }
              .hero-text-glow {
                text-shadow: 0 0 40px rgba(67, 97, 238, 0.3);
              }
            `,
          }}
        />
      </Head>
      <body className="bg-gray-50 text-slate-800 antialiased selection:bg-brand-200 selection:text-brand-900">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W5SMKHM3"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
