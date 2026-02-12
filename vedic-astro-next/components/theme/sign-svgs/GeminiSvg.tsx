interface SignSvgProps {
  color?: string;
}

export default function GeminiSvg({ color = 'currentColor' }: SignSvgProps) {
  return (
    <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" fill="none">
      {/* Twin figure - Left (facing right) */}
      <g stroke={color} strokeWidth="1.5" opacity="0.8">
        {/* Left twin head */}
        <ellipse cx="820" cy="320" rx="40" ry="48" />
        {/* Face features - left twin */}
        <path d="M808 310 Q812 308 816 310" />
        <circle cx="812" cy="310" r="2" />
        <path d="M828 310 Q832 308 836 310" />
        <circle cx="832" cy="310" r="2" />
        <path d="M818 325 Q822 330 826 325" />
        <path d="M815 338 Q820 343 825 338" />
        {/* Left twin hair */}
        <path d="M780 315 Q778 290 785 270 Q795 250 815 245 Q835 242 850 255 Q860 268 862 290 Q863 300 860 315" />
        <path d="M785 275 Q790 265 800 258" />
        <path d="M840 255 Q850 262 855 275" />
        {/* Left twin neck */}
        <path d="M810 368 L810 390" />
        <path d="M830 368 L830 390" />
        {/* Left twin torso */}
        <path d="M790 390 Q785 420 780 460 Q775 500 778 540 Q780 570 785 600" />
        <path d="M850 390 Q855 420 858 460 Q860 500 857 540 Q855 570 852 600" />
        <path d="M790 390 Q810 385 830 385 Q850 385 850 390" />
        {/* Left twin dhoti/garment draping */}
        <path d="M785 600 Q780 630 778 660 Q776 690 780 720 Q785 750 790 780" />
        <path d="M852 600 Q856 630 858 660 Q860 690 856 720 Q852 750 848 780" />
        <path d="M785 600 Q810 610 835 610 Q852 608 852 600" />
        {/* Garment fold lines */}
        <path d="M800 620 Q810 640 808 660 Q806 680 810 700" />
        <path d="M835 620 Q830 640 832 660 Q834 680 830 700" />
        <path d="M790 680 Q810 690 830 690 Q848 688 852 680" />
        {/* Left twin left arm (reaching toward center) */}
        <path d="M850 400 Q870 420 885 440 Q900 460 910 480 Q918 495 920 510" />
        <path d="M920 510 Q922 515 918 520 Q914 518 916 512" />
        {/* Left twin right arm */}
        <path d="M790 400 Q770 420 755 445 Q740 470 730 490 Q725 500 720 510" />
        <path d="M720 510 Q715 520 710 515 Q712 508 718 505" />
        {/* Left twin feet */}
        <path d="M790 780 Q785 790 780 795 Q775 798 770 795" />
        <path d="M848 780 Q850 790 852 795 Q855 798 860 795" />
        {/* Left twin jewelry - necklace */}
        <path d="M800 392 Q810 398 820 400 Q830 398 840 392" />
        <circle cx="820" cy="402" r="3" />
        {/* Left twin arm bangles */}
        <ellipse cx="885" cy="442" rx="8" ry="5" transform="rotate(40 885 442)" />
        <ellipse cx="755" cy="448" rx="8" ry="5" transform="rotate(-40 755 448)" />
      </g>

      {/* Twin figure - Right (facing left, mirrored) */}
      <g stroke={color} strokeWidth="1.5" opacity="0.8">
        {/* Right twin head */}
        <ellipse cx="1100" cy="320" rx="40" ry="48" />
        {/* Face features - right twin */}
        <path d="M1088 310 Q1084 308 1080 310" />
        <circle cx="1084" cy="310" r="2" />
        <path d="M1112 310 Q1108 308 1104 310" />
        <circle cx="1108" cy="310" r="2" />
        <path d="M1092 325 Q1096 330 1100 325" />
        <path d="M1092 338 Q1096 343 1100 338" />
        {/* Right twin hair */}
        <path d="M1140 315 Q1142 290 1135 270 Q1125 250 1105 245 Q1085 242 1070 255 Q1060 268 1058 290 Q1057 300 1060 315" />
        <path d="M1135 275 Q1130 265 1120 258" />
        <path d="M1080 255 Q1070 262 1065 275" />
        {/* Right twin neck */}
        <path d="M1090 368 L1090 390" />
        <path d="M1110 368 L1110 390" />
        {/* Right twin torso */}
        <path d="M1070 390 Q1065 420 1062 460 Q1060 500 1063 540 Q1065 570 1068 600" />
        <path d="M1130 390 Q1135 420 1140 460 Q1145 500 1142 540 Q1140 570 1135 600" />
        <path d="M1070 390 Q1090 385 1110 385 Q1130 385 1130 390" />
        {/* Right twin dhoti/garment */}
        <path d="M1068 600 Q1064 630 1062 660 Q1060 690 1064 720 Q1068 750 1072 780" />
        <path d="M1135 600 Q1138 630 1140 660 Q1142 690 1138 720 Q1135 750 1132 780" />
        <path d="M1068 600 Q1090 610 1110 610 Q1132 608 1135 600" />
        <path d="M1080 620 Q1090 640 1088 660 Q1086 680 1090 700" />
        <path d="M1118 620 Q1112 640 1114 660 Q1116 680 1112 700" />
        <path d="M1070 680 Q1090 690 1110 690 Q1130 688 1135 680" />
        {/* Right twin left arm */}
        <path d="M1130 400 Q1150 420 1165 445 Q1180 470 1190 490 Q1195 500 1200 510" />
        <path d="M1200 510 Q1205 520 1210 515 Q1208 508 1202 505" />
        {/* Right twin right arm (reaching toward center) */}
        <path d="M1070 400 Q1050 420 1035 440 Q1020 460 1010 480 Q1002 495 1000 510" />
        <path d="M1000 510 Q998 515 1002 520 Q1006 518 1004 512" />
        {/* Right twin feet */}
        <path d="M1072 780 Q1070 790 1068 795 Q1065 798 1060 795" />
        <path d="M1132 780 Q1135 790 1138 795 Q1142 798 1148 795" />
        {/* Right twin jewelry */}
        <path d="M1080 392 Q1090 398 1100 400 Q1110 398 1120 392" />
        <circle cx="1100" cy="402" r="3" />
        <ellipse cx="1035" cy="442" rx="8" ry="5" transform="rotate(-40 1035 442)" />
        <ellipse cx="1165" cy="448" rx="8" ry="5" transform="rotate(40 1165 448)" />
      </g>

      {/* Connecting lines between twins */}
      <g stroke={color} strokeWidth="1" opacity="0.4">
        <path d="M920 510 Q940 500 960 498 Q980 500 1000 510" />
        <path d="M920 510 Q940 520 960 522 Q980 520 1000 510" />
        <path d="M860 320 Q900 310 960 308 Q1020 310 1060 320" />
        <line x1="860" y1="390" x2="1060" y2="390" strokeDasharray="4 8" />
        <line x1="852" y1="600" x2="1068" y2="600" strokeDasharray="4 8" />
        <line x1="848" y1="780" x2="1072" y2="780" strokeDasharray="4 8" />
        {/* Energy lines radiating from connection point */}
        <path d="M960 498 L960 460 L960 420" strokeDasharray="2 6" />
        <path d="M960 522 L960 560 L960 600" strokeDasharray="2 6" />
        <circle cx="960" cy="510" r="12" />
        <circle cx="960" cy="510" r="6" />
      </g>

      {/* Mercury yantra (geometric symbol) below */}
      <g stroke={color} strokeWidth="1" opacity="0.35">
        {/* Central hexagram */}
        <path d="M960 850 L920 920 L1000 920 Z" />
        <path d="M960 930 L920 860 L1000 860 Z" />
        <circle cx="960" cy="890" r="45" />
        <circle cx="960" cy="890" r="55" />
        {/* Yantra inner details */}
        <circle cx="960" cy="890" r="15" />
        <path d="M960 875 L960 905" />
        <path d="M945 890 L975 890" />
      </g>

      {/* Mirror pattern - symmetrical decorative arches */}
      <g stroke={color} strokeWidth="0.8" opacity="0.25">
        {/* Left arch */}
        <path d="M400 200 Q400 100 500 80 Q600 60 700 100 Q750 120 780 160" />
        <path d="M410 210 Q410 120 500 100 Q590 80 680 110 Q740 130 770 170" />
        {/* Right arch (mirrored) */}
        <path d="M1520 200 Q1520 100 1420 80 Q1320 60 1220 100 Q1170 120 1140 160" />
        <path d="M1510 210 Q1510 120 1420 100 Q1330 80 1240 110 Q1180 130 1150 170" />
        {/* Bottom mirror arches */}
        <path d="M400 880 Q400 980 500 1000 Q600 1020 700 980 Q750 960 780 920" />
        <path d="M1520 880 Q1520 980 1420 1000 Q1320 1020 1220 980 Q1170 960 1140 920" />
      </g>

      {/* Kolam dots and connecting patterns */}
      <g stroke={color} strokeWidth="0.5" opacity="0.15">
        {/* Grid of kolam dots - left side */}
        {Array.from({ length: 6 }, (_, i) =>
          Array.from({ length: 8 }, (_, j) => {
            const x = 150 + i * 50;
            const y = 300 + j * 60;
            return <circle key={`kl-${i}-${j}`} cx={x} cy={y} r="2" />;
          })
        )}
        {/* Grid of kolam dots - right side */}
        {Array.from({ length: 6 }, (_, i) =>
          Array.from({ length: 8 }, (_, j) => {
            const x = 1520 + i * 50;
            const y = 300 + j * 60;
            return <circle key={`kr-${i}-${j}`} cx={x} cy={y} r="2" />;
          })
        )}
        {/* Kolam connecting curves - left */}
        {Array.from({ length: 5 }, (_, i) =>
          Array.from({ length: 7 }, (_, j) => {
            const x = 150 + i * 50;
            const y = 300 + j * 60;
            return (
              <path key={`cl-${i}-${j}`} d={`M${x} ${y} Q${x + 25} ${y + 15} ${x + 50} ${y}`} />
            );
          })
        )}
        {/* Kolam connecting curves - right */}
        {Array.from({ length: 5 }, (_, i) =>
          Array.from({ length: 7 }, (_, j) => {
            const x = 1520 + i * 50;
            const y = 300 + j * 60;
            return (
              <path key={`cr-${i}-${j}`} d={`M${x} ${y} Q${x + 25} ${y + 15} ${x + 50} ${y}`} />
            );
          })
        )}
      </g>

      {/* Gemini glyph at top */}
      <g stroke={color} strokeWidth="2" opacity="0.5">
        <path d="M930 130 Q940 120 950 118 Q960 116 970 118 Q980 120 990 130" />
        <path d="M930 170 Q940 180 950 182 Q960 184 970 182 Q980 180 990 170" />
        <line x1="945" y1="130" x2="945" y2="170" />
        <line x1="975" y1="130" x2="975" y2="170" />
      </g>

      {/* Decorative border frame */}
      <g stroke={color} strokeWidth="0.8" opacity="0.2">
        <rect x="50" y="50" width="1820" height="980" rx="20" />
        <rect x="65" y="65" width="1790" height="950" rx="15" />
        {/* Corner flourishes */}
        <path d="M80 80 Q100 60 120 80 Q100 100 80 80" />
        <path d="M1840 80 Q1820 60 1800 80 Q1820 100 1840 80" />
        <path d="M80 1000 Q100 1020 120 1000 Q100 980 80 1000" />
        <path d="M1840 1000 Q1820 1020 1800 1000 Q1820 980 1840 1000" />
      </g>

      {/* Star/celestial accents */}
      <g stroke={color} strokeWidth="0.6" opacity="0.18">
        {[
          [200, 150], [350, 100], [1570, 110], [1720, 160],
          [150, 900], [300, 960], [1620, 950], [1770, 900],
          [480, 200], [1440, 190], [480, 880], [1440, 870],
        ].map(([x, y], i) => (
          <g key={`star-${i}`}>
            <line x1={x - 8} y1={y} x2={x + 8} y2={y} />
            <line x1={x} y1={y - 8} x2={x} y2={y + 8} />
            <line x1={x - 5} y1={y - 5} x2={x + 5} y2={y + 5} />
            <line x1={x + 5} y1={y - 5} x2={x - 5} y2={y + 5} />
          </g>
        ))}
      </g>
    </svg>
  );
}
