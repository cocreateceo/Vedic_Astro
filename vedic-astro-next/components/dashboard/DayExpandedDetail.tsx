'use client';

import { DayDetailedReport } from '@/types';

interface DayExpandedDetailProps {
  detail: DayDetailedReport;
  dayName: string;
}

export default function DayExpandedDetail({ detail, dayName }: DayExpandedDetailProps) {
  return (
    <div className="mt-3 pt-3 border-t border-sign-primary/10 space-y-4">
      {/* Ratings */}
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(detail.ratings).map(([key, val]) => (
          <div key={key} className="text-center">
            <div className="text-sign-primary text-sm font-heading">{val}%</div>
            <div className="text-text-muted text-[10px] capitalize">{key}</div>
            <div className="mt-0.5 h-1 bg-cosmic-bg rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sign-primary to-sign-dark rounded-full rating-bar-fill-animate" style={{ width: `${val}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Predictions */}
      <div className="space-y-2">
        <div><span className="text-text-primary text-xs font-medium">General:</span> <span className="text-text-muted text-xs">{detail.general}</span></div>
        <div><span className="text-text-primary text-xs font-medium">Career:</span> <span className="text-text-muted text-xs">{detail.career}</span></div>
        <div><span className="text-text-primary text-xs font-medium">Love:</span> <span className="text-text-muted text-xs">{detail.love}</span></div>
        <div><span className="text-text-primary text-xs font-medium">Health:</span> <span className="text-text-muted text-xs">{detail.health}</span></div>
      </div>

      {/* Muhurat Timings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-2.5 bg-green-500/5 border border-green-500/15 rounded-lg">
          <h5 className="text-green-400 text-[11px] font-medium mb-1.5">Good Times</h5>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Abhijit Muhurat</span>
              <span className="text-green-400">{detail.timings.abhijitMuhurat.start} – {detail.timings.abhijitMuhurat.end}</span>
            </div>
            {detail.timings.bestHours.map((bh, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-text-muted truncate mr-2">{bh.activity}</span>
                <span className="text-green-400/80 whitespace-nowrap">{bh.start} – {bh.end}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-2.5 bg-red-500/5 border border-red-500/15 rounded-lg">
          <h5 className="text-red-400 text-[11px] font-medium mb-1.5">Avoid</h5>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Rahu Kaal</span>
              <span className="text-red-400">{detail.timings.rahuKaal.start} – {detail.timings.rahuKaal.end}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Yamagandam</span>
              <span className="text-red-400/80">{detail.timings.yamagandam.start} – {detail.timings.yamagandam.end}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Gulika Kaal</span>
              <span className="text-red-400/80">{detail.timings.gulikaKaal.start} – {detail.timings.gulikaKaal.end}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lucky Elements */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Number', value: String(detail.lucky.number) },
          { label: 'Color', value: detail.lucky.color },
          { label: 'Day', value: detail.lucky.day },
          { label: 'Direction', value: detail.lucky.direction },
        ].map((item) => (
          <div key={item.label} className="text-center p-1.5 bg-sign-primary/5 rounded-lg">
            <div className="text-sign-primary text-xs font-medium">{item.value}</div>
            <div className="text-text-muted text-[10px]">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Remedies */}
      {detail.remedies.length > 0 && (
        <div>
          <h5 className="text-text-primary text-xs font-medium mb-1">{dayName} Remedies</h5>
          <ul className="space-y-0.5">
            {detail.remedies.map((r, i) => (
              <li key={i} className="text-text-muted text-xs flex items-start gap-1.5">
                <span className="text-sign-primary mt-0.5 text-[8px]">&#9679;</span>{r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mantra */}
      {detail.mantra && (
        <div className="p-2.5 bg-sign-primary/5 border border-sign-primary/10 rounded-lg">
          <span className="text-sign-primary/60 text-[10px] block mb-0.5">Mantra</span>
          <p className="text-sign-primary text-xs font-devanagari">{detail.mantra}</p>
        </div>
      )}
    </div>
  );
}
