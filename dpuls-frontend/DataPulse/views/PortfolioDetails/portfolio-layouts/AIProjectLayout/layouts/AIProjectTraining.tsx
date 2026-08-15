import React from "react";
import {Reveal} from "../../../../../components/Reveal";
import {PortfolioItem} from "../../data/portfolio";

interface Props {
  project: PortfolioItem;
  content: any;
}

export default function AIProjectTraining({project, content}: Props) {
  // Safe replacement of the placeholder in description
  const description = content?.training?.desc_template?.replace(
    "{trainingData}",
    project.aiSpec?.trainingData || content?.training?.default_data || "Data",
  );

  return (
    <section className="py-32 bg-slate-900 overflow-hidden relative border-y border-white/5">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tighter">
            {content?.training?.title}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{description}</p>
        </Reveal>

        {/* Simulated Training Pipeline SVG */}
        <div className="relative max-w-4xl mx-auto py-0">
          <svg viewBox="0 0 800 200" className="w-full h-auto">
            <defs>
              <linearGradient id="pipe-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4361ee" stopOpacity="0" />
                <stop offset="50%" stopColor="#4361ee" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#4361ee" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Flow Lines */}
            <path
              d="M0,100 L800,100"
              stroke="url(#pipe-grad)"
              strokeWidth="40"
              strokeLinecap="round"
            />
            <g className="animate-reveal-up" style={{animationDuration: "2s"}}>
              {[...Array(20)].map((_, i) => (
                <circle key={i} r="2" fill="#fff" opacity="0.8">
                  <animateMotion
                    path="M0,100 L800,100"
                    dur={`${1 + Math.random() * 2}s`}
                    repeatCount="indefinite"
                    begin={`${Math.random() * 2}s`}
                  />
                </circle>
              ))}
            </g>
            {/* Node Blocks */}
            <rect
              x="50"
              y="70"
              width="100"
              height="60"
              rx="8"
              fill="#1e293b"
              stroke="#4361ee"
            />
            <text
              x="100"
              y="105"
              textAnchor="middle"
              fill="#fff"
              className="text-[10px] "
            >
              {content?.training?.svg?.raw}
            </text>

            <rect
              x="350"
              y="70"
              width="100"
              height="60"
              rx="8"
              fill="#1e293b"
              stroke="#4361ee"
            />
            <text
              x="400"
              y="105"
              textAnchor="middle"
              fill="#fff"
              className="text-[10px] "
            >
              {content?.training?.svg?.encoder}
            </text>

            <rect
              x="650"
              y="70"
              width="100"
              height="60"
              rx="8"
              fill="#1e293b"
              stroke="#4361ee"
            />
            <text
              x="700"
              y="105"
              textAnchor="middle"
              fill="#fff"
              className="text-[10px] "
            >
              {content?.training?.svg?.inference}
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
