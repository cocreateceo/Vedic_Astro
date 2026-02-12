interface SignSvgProps {
  color?: string;
}

export default function AriesSvg({ color = 'currentColor' }: SignSvgProps) {
  return (
    <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" fill="none">
      {/* Ram head silhouette - large centered */}
      <g stroke={color} strokeWidth="1.5" opacity="0.8">
        {/* Left horn - sweeping curve */}
        <path d="M860 540 Q820 420 780 340 Q740 260 700 220 Q660 180 620 170 Q580 160 560 180 Q540 200 540 240 Q540 280 560 320 Q580 360 610 390 Q640 420 680 440 Q720 460 760 470" />
        <path d="M860 540 Q830 440 800 370 Q770 300 740 260 Q710 220 680 210 Q650 200 630 220 Q610 240 610 280 Q610 320 630 360 Q650 400 680 420" />
        {/* Right horn - sweeping curve (mirrored) */}
        <path d="M1060 540 Q1100 420 1140 340 Q1180 260 1220 220 Q1260 180 1300 170 Q1340 160 1360 180 Q1380 200 1380 240 Q1380 280 1360 320 Q1340 360 1310 390 Q1280 420 1240 440 Q1200 460 1160 470" />
        <path d="M1060 540 Q1090 440 1120 370 Q1150 300 1180 260 Q1210 220 1240 210 Q1270 200 1290 220 Q1310 240 1310 280 Q1310 320 1290 360 Q1270 400 1240 420" />
        {/* Head shape */}
        <path d="M860 540 Q870 500 890 480 Q910 460 930 455 Q950 450 960 455 Q970 450 990 455 Q1010 460 1030 480 Q1050 500 1060 540" />
        {/* Forehead ridge */}
        <path d="M880 510 Q910 490 940 485 Q960 482 980 485 Q1010 490 1040 510" />
        {/* Left eye */}
        <ellipse cx="910" cy="540" rx="25" ry="15" />
        <ellipse cx="910" cy="540" rx="10" ry="10" />
        {/* Right eye */}
        <ellipse cx="1010" cy="540" rx="25" ry="15" />
        <ellipse cx="1010" cy="540" rx="10" ry="10" />
        {/* Nose bridge */}
        <path d="M940 530 Q945 560 950 580 Q955 600 960 610 Q965 600 970 580 Q975 560 980 530" />
        {/* Nostrils */}
        <path d="M940 610 Q935 620 940 625 Q945 630 950 625" />
        <path d="M980 610 Q985 620 980 625 Q975 630 970 625" />
        {/* Mouth line */}
        <path d="M930 650 Q945 660 960 665 Q975 660 990 650" />
        {/* Jaw / chin */}
        <path d="M860 540 Q855 580 860 620 Q865 660 880 690 Q900 720 920 740 Q940 755 960 760 Q980 755 1000 740 Q1020 720 1040 690 Q1055 660 1060 620 Q1065 580 1060 540" />
        {/* Ears */}
        <path d="M855 510 Q830 500 820 520 Q810 540 820 560 Q830 575 855 570" />
        <path d="M1065 510 Q1090 500 1100 520 Q1110 540 1100 560 Q1090 575 1065 570" />
        {/* Horn texture lines - left */}
        <path d="M810 340 Q800 350 810 360" />
        <path d="M770 290 Q760 300 770 310" />
        <path d="M730 250 Q720 260 730 270" />
        <path d="M680 220 Q670 230 680 240" />
        <path d="M630 200 Q620 210 630 220" />
        {/* Horn texture lines - right */}
        <path d="M1110 340 Q1120 350 1110 360" />
        <path d="M1150 290 Q1160 300 1150 310" />
        <path d="M1190 250 Q1200 260 1190 270" />
        <path d="M1240 220 Q1250 230 1240 240" />
        <path d="M1290 200 Q1300 210 1290 220" />
        {/* Third eye / tilak mark */}
        <path d="M952 480 L960 465 L968 480 L960 490 Z" />
        <circle cx="960" cy="478" r="4" />
      </g>

      {/* Flame border pattern along edges */}
      <g stroke={color} strokeWidth="1" opacity="0.35">
        {/* Top flame border */}
        {Array.from({ length: 32 }, (_, i) => {
          const x = 60 + i * 58;
          return (
            <g key={`tf-${i}`}>
              <path d={`M${x} 40 Q${x + 10} 15 ${x + 15} 5 Q${x + 20} 15 ${x + 29} 10 Q${x + 25} 25 ${x + 30} 40`} />
              <path d={`M${x + 5} 40 Q${x + 12} 22 ${x + 15} 12`} />
              <path d={`M${x + 25} 40 Q${x + 18} 22 ${x + 15} 12`} />
            </g>
          );
        })}
        {/* Bottom flame border */}
        {Array.from({ length: 32 }, (_, i) => {
          const x = 60 + i * 58;
          return (
            <g key={`bf-${i}`}>
              <path d={`M${x} 1040 Q${x + 10} 1065 ${x + 15} 1075 Q${x + 20} 1065 ${x + 29} 1070 Q${x + 25} 1055 ${x + 30} 1040`} />
              <path d={`M${x + 5} 1040 Q${x + 12} 1058 ${x + 15} 1068`} />
              <path d={`M${x + 25} 1040 Q${x + 18} 1058 ${x + 15} 1068`} />
            </g>
          );
        })}
        {/* Left flame border */}
        {Array.from({ length: 18 }, (_, i) => {
          const y = 60 + i * 56;
          return (
            <g key={`lf-${i}`}>
              <path d={`M40 ${y} Q15 ${y + 10} 5 ${y + 15} Q15 ${y + 20} 10 ${y + 28} Q25 ${y + 24} 40 ${y + 28}`} />
              <path d={`M40 ${y + 4} Q22 ${y + 12} 12 ${y + 15}`} />
            </g>
          );
        })}
        {/* Right flame border */}
        {Array.from({ length: 18 }, (_, i) => {
          const y = 60 + i * 56;
          return (
            <g key={`rf-${i}`}>
              <path d={`M1880 ${y} Q1905 ${y + 10} 1915 ${y + 15} Q1905 ${y + 20} 1910 ${y + 28} Q1895 ${y + 24} 1880 ${y + 28}`} />
              <path d={`M1880 ${y + 4} Q1898 ${y + 12} 1908 ${y + 15}`} />
            </g>
          );
        })}
      </g>

      {/* Trishul (trident) accents in corners */}
      <g stroke={color} strokeWidth="1.2" opacity="0.5">
        {/* Top-left trishul */}
        <path d="M100 100 L100 200" />
        <path d="M100 100 Q95 80 85 70 Q80 75 85 90 Q88 95 100 100" />
        <path d="M100 100 Q100 75 100 65 Q100 55 100 50 Q100 55 100 65 Q100 75 100 100" />
        <path d="M100 95 L100 50" />
        <path d="M100 100 Q105 80 115 70 Q120 75 115 90 Q112 95 100 100" />
        <path d="M85 70 Q80 60 82 50" />
        <path d="M115 70 Q120 60 118 50" />
        <path d="M90 130 Q100 125 110 130" />
        <path d="M92 145 Q100 140 108 145" />
        {/* Top-right trishul */}
        <path d="M1820 100 L1820 200" />
        <path d="M1820 100 Q1815 80 1805 70 Q1800 75 1805 90 Q1808 95 1820 100" />
        <path d="M1820 95 L1820 50" />
        <path d="M1820 100 Q1825 80 1835 70 Q1840 75 1835 90 Q1832 95 1820 100" />
        <path d="M1805 70 Q1800 60 1802 50" />
        <path d="M1835 70 Q1840 60 1838 50" />
        <path d="M1810 130 Q1820 125 1830 130" />
        <path d="M1812 145 Q1820 140 1828 145" />
        {/* Bottom-left trishul */}
        <path d="M100 980 L100 880" />
        <path d="M100 980 Q95 1000 85 1010 Q80 1005 85 990 Q88 985 100 980" />
        <path d="M100 985 L100 1030" />
        <path d="M100 980 Q105 1000 115 1010 Q120 1005 115 990 Q112 985 100 980" />
        <path d="M85 1010 Q80 1020 82 1030" />
        <path d="M115 1010 Q120 1020 118 1030" />
        <path d="M90 950 Q100 955 110 950" />
        <path d="M92 935 Q100 940 108 935" />
        {/* Bottom-right trishul */}
        <path d="M1820 980 L1820 880" />
        <path d="M1820 980 Q1815 1000 1805 1010 Q1800 1005 1805 990 Q1808 985 1820 980" />
        <path d="M1820 985 L1820 1030" />
        <path d="M1820 980 Q1825 1000 1835 1010 Q1840 1005 1835 990 Q1832 985 1820 980" />
        <path d="M1805 1010 Q1800 1020 1802 1030" />
        <path d="M1835 1010 Q1840 1020 1838 1030" />
        <path d="M1810 950 Q1820 955 1830 950" />
        <path d="M1812 935 Q1820 940 1828 935" />
      </g>

      {/* Fire triangles scattered throughout */}
      <g stroke={color} strokeWidth="0.8" opacity="0.2">
        {/* Small fire triangles scattered */}
        {[
          [200, 200], [400, 150], [600, 180], [1300, 170], [1500, 200], [1700, 160],
          [150, 400], [300, 600], [250, 800], [1650, 350], [1700, 600], [1680, 850],
          [500, 900], [700, 950], [1200, 920], [1400, 950],
          [350, 300], [1550, 280], [450, 750], [1450, 780],
          [200, 550], [1720, 540], [650, 300], [1270, 310],
          [500, 450], [1400, 430], [750, 800], [1170, 810],
        ].map(([x, y], i) => (
          <g key={`ft-${i}`}>
            <path d={`M${x} ${y} L${x - 8} ${y + 18} L${x + 8} ${y + 18} Z`} />
            <path d={`M${x} ${y + 3} L${x - 4} ${y + 14} L${x + 4} ${y + 14} Z`} />
          </g>
        ))}
      </g>

      {/* Mandala ring around the ram head */}
      <g stroke={color} strokeWidth="0.8" opacity="0.25">
        <circle cx="960" cy="540" r="280" />
        <circle cx="960" cy="540" r="290" />
        <circle cx="960" cy="540" r="300" />
        {/* Petal arcs on the mandala */}
        {Array.from({ length: 24 }, (_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          const x1 = 960 + 280 * Math.cos(angle);
          const y1 = 540 + 280 * Math.sin(angle);
          const x2 = 960 + 320 * Math.cos(angle + 0.08);
          const y2 = 540 + 320 * Math.sin(angle + 0.08);
          const x3 = 960 + 320 * Math.cos(angle - 0.08);
          const y3 = 540 + 320 * Math.sin(angle - 0.08);
          return (
            <path key={`mp-${i}`} d={`M${x1.toFixed(1)} ${y1.toFixed(1)} Q${x2.toFixed(1)} ${y2.toFixed(1)} ${(960 + 310 * Math.cos(angle + 0.13)).toFixed(1)} ${(540 + 310 * Math.sin(angle + 0.13)).toFixed(1)}`} />
          );
        })}
      </g>

      {/* Kolam dots pattern */}
      <g stroke={color} strokeWidth="0.5" opacity="0.15">
        {Array.from({ length: 20 }, (_, i) =>
          Array.from({ length: 12 }, (_, j) => {
            const x = 160 + i * 85;
            const y = 100 + j * 80;
            const dist = Math.sqrt((x - 960) ** 2 + (y - 540) ** 2);
            if (dist < 320 || dist > 800) return null;
            return <circle key={`kd-${i}-${j}`} cx={x} cy={y} r="2" />;
          })
        )}
      </g>

      {/* Decorative lotus at the base */}
      <g stroke={color} strokeWidth="1" opacity="0.3">
        <path d="M910 780 Q920 760 940 750 Q960 745 960 745 Q960 745 980 750 Q1000 760 1010 780" />
        <path d="M900 780 Q910 755 935 740 Q960 732 960 732 Q960 732 985 740 Q1010 755 1020 780" />
        <path d="M890 785 Q880 760 900 740 Q920 725 940 720" />
        <path d="M1030 785 Q1040 760 1020 740 Q1000 725 980 720" />
        <path d="M940 720 Q950 715 960 713 Q970 715 980 720" />
        <path d="M870 790 Q860 770 870 750 Q880 735 900 725" />
        <path d="M1050 790 Q1060 770 1050 750 Q1040 735 1020 725" />
        {/* Lotus stem */}
        <path d="M960 780 L960 820" />
        <path d="M960 800 Q945 810 940 820" />
        <path d="M960 800 Q975 810 980 820" />
      </g>

      {/* Aries glyph symbol */}
      <g stroke={color} strokeWidth="2" opacity="0.6">
        <path d="M930 850 Q940 830 950 825 Q960 830 960 840" />
        <path d="M990 850 Q980 830 970 825 Q960 830 960 840" />
        <path d="M960 840 L960 880" />
      </g>
    </svg>
  );
}
