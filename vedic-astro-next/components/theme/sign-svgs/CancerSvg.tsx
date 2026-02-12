interface SignSvgProps {
  color?: string;
}

export default function CancerSvg({ color = 'currentColor' }: SignSvgProps) {
  return (
    <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" fill="none">
      {/* Crab silhouette - large centered */}
      <g stroke={color} strokeWidth="1.5" opacity="0.8">
        {/* Main body / carapace */}
        <ellipse cx="960" cy="520" rx="180" ry="130" />
        <ellipse cx="960" cy="520" rx="150" ry="105" />
        {/* Carapace details - ridge lines */}
        <path d="M860 480 Q910 460 960 455 Q1010 460 1060 480" />
        <path d="M840 520 Q900 500 960 495 Q1020 500 1080 520" />
        <path d="M860 560 Q910 545 960 540 Q1010 545 1060 560" />
        {/* Central line */}
        <path d="M960 400 Q960 450 960 520 Q960 590 960 650" />
        {/* Left claw */}
        <path d="M780 490 Q730 460 690 430 Q660 410 640 390 Q620 370 610 350 Q600 330 610 315 Q625 305 640 315 Q655 330 660 350" />
        <path d="M660 350 Q670 340 680 335 Q695 332 705 340 Q710 350 700 360 Q690 365 680 360" />
        <path d="M610 350 Q605 340 600 335 Q590 332 580 340 Q575 350 585 360 Q595 365 605 360" />
        {/* Claw pincers - left upper */}
        <path d="M640 315 Q650 295 665 285 Q680 280 690 290 Q695 305 685 315 Q675 320 665 315" />
        {/* Claw pincers - left lower */}
        <path d="M610 315 Q600 295 590 285 Q575 280 565 290 Q560 305 570 315 Q580 320 590 315" />
        {/* Right claw */}
        <path d="M1140 490 Q1190 460 1230 430 Q1260 410 1280 390 Q1300 370 1310 350 Q1320 330 1310 315 Q1295 305 1280 315 Q1265 330 1260 350" />
        <path d="M1260 350 Q1250 340 1240 335 Q1225 332 1215 340 Q1210 350 1220 360 Q1230 365 1240 360" />
        <path d="M1310 350 Q1315 340 1320 335 Q1330 332 1340 340 Q1345 350 1335 360 Q1325 365 1315 360" />
        {/* Claw pincers - right upper */}
        <path d="M1280 315 Q1270 295 1255 285 Q1240 280 1230 290 Q1225 305 1235 315 Q1245 320 1255 315" />
        {/* Claw pincers - right lower */}
        <path d="M1310 315 Q1320 295 1330 285 Q1345 280 1355 290 Q1360 305 1350 315 Q1340 320 1330 315" />
        {/* Walking legs - left side */}
        <path d="M810 580 Q770 610 740 640 Q720 660 700 685 Q690 700 685 720" />
        <path d="M685 720 Q680 730 675 725 Q678 718 683 715" />
        <path d="M830 610 Q800 650 775 680 Q760 700 745 725 Q738 740 735 755" />
        <path d="M735 755 Q730 765 725 760 Q728 753 733 750" />
        <path d="M850 630 Q830 670 810 700 Q795 725 785 750 Q780 770 778 785" />
        <path d="M778 785 Q773 795 768 790 Q771 783 776 780" />
        <path d="M870 640 Q860 680 850 710 Q842 735 838 760 Q835 780 835 800" />
        <path d="M835 800 Q830 810 825 805 Q828 798 833 795" />
        {/* Walking legs - right side */}
        <path d="M1110 580 Q1150 610 1180 640 Q1200 660 1220 685 Q1230 700 1235 720" />
        <path d="M1235 720 Q1240 730 1245 725 Q1242 718 1237 715" />
        <path d="M1090 610 Q1120 650 1145 680 Q1160 700 1175 725 Q1182 740 1185 755" />
        <path d="M1185 755 Q1190 765 1195 760 Q1192 753 1187 750" />
        <path d="M1070 630 Q1090 670 1110 700 Q1125 725 1135 750 Q1140 770 1142 785" />
        <path d="M1142 785 Q1147 795 1152 790 Q1149 783 1144 780" />
        <path d="M1050 640 Q1060 680 1070 710 Q1078 735 1082 760 Q1085 780 1085 800" />
        <path d="M1085 800 Q1090 810 1095 805 Q1092 798 1087 795" />
        {/* Eyes on stalks */}
        <path d="M920 400 Q915 375 910 360 Q905 345 910 335" />
        <circle cx="910" cy="330" r="8" />
        <circle cx="910" cy="330" r="4" />
        <path d="M1000 400 Q1005 375 1010 360 Q1015 345 1010 335" />
        <circle cx="1010" cy="330" r="8" />
        <circle cx="1010" cy="330" r="4" />
        {/* Mouth parts */}
        <path d="M940 395 Q950 400 960 402 Q970 400 980 395" />
        <path d="M945 405 Q955 410 960 412 Q965 410 975 405" />
      </g>

      {/* Wave/water ripple pattern along bottom */}
      <g stroke={color} strokeWidth="1" opacity="0.3">
        {Array.from({ length: 5 }, (_, row) => {
          const y = 900 + row * 30;
          const opacity = 0.3 - row * 0.04;
          return (
            <g key={`wave-${row}`} opacity={opacity / 0.3}>
              <path d={`M0 ${y} ${Array.from({ length: 20 }, (_, i) => {
                const x = i * 100;
                const dir = i % 2 === 0 ? -1 : 1;
                return `Q${x + 50} ${y + dir * 20} ${x + 100} ${y}`;
              }).join(' ')}`} />
            </g>
          );
        })}
        {/* Additional wave details */}
        <path d="M0 880 Q50 870 100 880 Q150 890 200 880 Q250 870 300 880 Q350 890 400 880 Q450 870 500 880 Q550 890 600 880 Q650 870 700 880 Q750 890 800 880 Q850 870 900 880 Q950 890 1000 880 Q1050 870 1100 880 Q1150 890 1200 880 Q1250 870 1300 880 Q1350 890 1400 880 Q1450 870 1500 880 Q1550 890 1600 880 Q1650 870 1700 880 Q1750 890 1800 880 Q1850 870 1920 880" />
      </g>

      {/* Moon phases arc across top */}
      <g stroke={color} strokeWidth="1" opacity="0.4">
        {/* New moon (far left) */}
        <circle cx="360" cy="120" r="25" />
        {/* Waxing crescent */}
        <circle cx="510" cy="90" r="25" />
        <path d="M510 65 Q525 90 510 115" />
        {/* First quarter */}
        <circle cx="660" cy="75" r="25" />
        <line x1="660" y1="50" x2="660" y2="100" />
        {/* Waxing gibbous */}
        <circle cx="810" cy="68" r="25" />
        <path d="M810 43 Q795 68 810 93" />
        {/* Full moon */}
        <circle cx="960" cy="65" r="28" />
        <circle cx="960" cy="65" r="22" />
        <circle cx="960" cy="65" r="16" />
        {/* Waning gibbous */}
        <circle cx="1110" cy="68" r="25" />
        <path d="M1110 43 Q1125 68 1110 93" />
        {/* Last quarter */}
        <circle cx="1260" cy="75" r="25" />
        <line x1="1260" y1="50" x2="1260" y2="100" />
        {/* Waning crescent */}
        <circle cx="1410" cy="90" r="25" />
        <path d="M1410 65 Q1395 90 1410 115" />
        {/* New moon (far right) */}
        <circle cx="1560" cy="120" r="25" />
        {/* Arc connecting moons */}
        <path d="M360 120 Q500 40 660 75 Q810 30 960 65 Q1110 30 1260 75 Q1420 40 1560 120" strokeDasharray="5 10" opacity="0.5" />
      </g>

      {/* Pearl/circle decorations */}
      <g stroke={color} strokeWidth="0.7" opacity="0.25">
        {/* Pearl strings */}
        {[
          { x1: 200, y1: 250, x2: 400, y2: 800, count: 12 },
          { x1: 1520, y1: 250, x2: 1720, y2: 800, count: 12 },
        ].map((line, li) =>
          Array.from({ length: line.count }, (_, i) => {
            const t = i / (line.count - 1);
            const x = line.x1 + (line.x2 - line.x1) * t;
            const y = line.y1 + (line.y2 - line.y1) * t;
            return (
              <g key={`pearl-${li}-${i}`}>
                <circle cx={x} cy={y} r="6" />
                <circle cx={x} cy={y} r="3" />
              </g>
            );
          })
        )}
        {/* Scattered pearls */}
        {[
          [300, 400], [250, 600], [350, 700], [180, 500],
          [1620, 400], [1670, 600], [1570, 700], [1740, 500],
          [500, 200], [600, 850], [1420, 200], [1320, 850],
        ].map(([x, y], i) => (
          <g key={`sp-${i}`}>
            <circle cx={x} cy={y} r="5" />
            <circle cx={x} cy={y} r="2.5" />
          </g>
        ))}
      </g>

      {/* Lotus pattern at corners */}
      <g stroke={color} strokeWidth="0.8" opacity="0.2">
        {/* Top-left lotus */}
        <path d="M120 180 Q130 160 140 155 Q150 160 160 180" />
        <path d="M110 185 Q125 155 140 148 Q155 155 170 185" />
        <path d="M100 188 Q120 150 140 140 Q160 150 180 188" />
        <path d="M115 195 Q140 190 165 195" />
        {/* Top-right lotus */}
        <path d="M1760 180 Q1770 160 1780 155 Q1790 160 1800 180" />
        <path d="M1750 185 Q1765 155 1780 148 Q1795 155 1810 185" />
        <path d="M1740 188 Q1760 150 1780 140 Q1800 150 1820 188" />
        <path d="M1755 195 Q1780 190 1805 195" />
        {/* Bottom-left lotus */}
        <path d="M120 900 Q130 920 140 925 Q150 920 160 900" />
        <path d="M110 895 Q125 925 140 932 Q155 925 170 895" />
        <path d="M100 892 Q120 930 140 940 Q160 930 180 892" />
        <path d="M115 885 Q140 890 165 885" />
        {/* Bottom-right lotus */}
        <path d="M1760 900 Q1770 920 1780 925 Q1790 920 1800 900" />
        <path d="M1750 895 Q1765 925 1780 932 Q1795 925 1810 895" />
        <path d="M1740 892 Q1760 930 1780 940 Q1800 930 1820 892" />
        <path d="M1755 885 Q1780 890 1805 885" />
      </g>

      {/* Temple arch frame */}
      <g stroke={color} strokeWidth="0.6" opacity="0.18">
        <path d="M300 1080 L300 250 Q300 150 400 100 Q500 60 600 50 Q700 42 800 40 Q860 38 960 36 Q1060 38 1120 40 Q1220 42 1320 50 Q1420 60 1520 100 Q1620 150 1620 250 L1620 1080" />
        <path d="M320 1080 L320 260 Q320 170 410 125 Q500 85 600 75 Q700 67 800 65 Q860 63 960 61 Q1060 63 1120 65 Q1220 67 1320 75 Q1420 85 1510 125 Q1600 170 1600 260 L1600 1080" />
        {/* Arch keystone */}
        <path d="M940 36 L960 20 L980 36" />
        <circle cx="960" cy="28" r="5" />
      </g>

      {/* Cancer glyph */}
      <g stroke={color} strokeWidth="2" opacity="0.5">
        <path d="M930 980 Q940 970 955 968 Q970 970 975 980" />
        <path d="M930 980 Q920 985 918 995 Q920 1005 930 1008" />
        <path d="M990 1000 Q980 1010 965 1012 Q950 1010 945 1000" />
        <path d="M990 1000 Q1000 995 1002 985 Q1000 975 990 972" />
      </g>
    </svg>
  );
}
