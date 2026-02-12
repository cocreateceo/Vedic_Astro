interface SignSvgProps {
  color?: string;
}

export default function VirgoSvg({ color = 'currentColor' }: SignSvgProps) {
  return (
    <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" fill="none">
      {/* Maiden figure silhouette holding wheat */}
      <g stroke={color} strokeWidth="1.5" opacity="0.8">
        {/* Head */}
        <ellipse cx="960" cy="220" rx="38" ry="45" />
        {/* Hair - flowing */}
        <path d="M922 210 Q915 190 912 170 Q910 150 918 135 Q930 125 945 122 Q960 120 975 122 Q990 125 1002 135 Q1010 150 1008 170 Q1005 190 998 210" />
        <path d="M912 200 Q905 210 900 230 Q895 255 898 280 Q900 300 908 320" />
        <path d="M1008 200 Q1015 210 1020 230 Q1025 255 1022 280 Q1020 300 1012 320" />
        {/* Hair detail strands */}
        <path d="M925 140 Q930 135 940 132" />
        <path d="M995 140 Q990 135 980 132" />
        <path d="M910 180 Q908 195 908 210" />
        <path d="M1010 180 Q1012 195 1012 210" />
        {/* Face features */}
        <path d="M945 210 Q950 208 955 210" />
        <circle cx="950" cy="210" r="2" />
        <path d="M965 210 Q970 208 975 210" />
        <circle cx="970" cy="210" r="2" />
        <path d="M955 228 Q958 232 962 228" />
        <path d="M952 240 Q958 245 964 240" />
        {/* Bindi / tilak */}
        <circle cx="960" cy="195" r="3" />
        {/* Neck */}
        <path d="M948 265 L948 290" />
        <path d="M972 265 L972 290" />
        {/* Necklace */}
        <path d="M935 295 Q945 300 955 302 Q960 303 965 302 Q975 300 985 295" />
        <circle cx="960" cy="305" r="4" />
        {/* Torso - saree draping */}
        <path d="M928 295 Q922 330 918 370 Q915 410 918 450 Q920 480 925 510" />
        <path d="M992 295 Q998 330 1002 370 Q1005 410 1002 450 Q1000 480 995 510" />
        <path d="M928 295 Q940 290 960 288 Q980 290 992 295" />
        {/* Saree pallu drape across */}
        <path d="M992 320 Q1010 330 1020 345 Q1030 360 1025 380 Q1015 395 1000 400 Q985 405 970 400 Q960 395 955 385" />
        <path d="M1020 345 Q1035 355 1040 370 Q1042 385 1035 395" />
        {/* Saree border pattern */}
        <path d="M918 380 Q925 378 932 380 Q939 382 946 380" />
        <path d="M918 420 Q925 418 932 420 Q939 422 946 420" />
        {/* Waist / belt */}
        <path d="M925 510 Q940 515 955 517 Q960 518 965 517 Q980 515 995 510" />
        {/* Skirt / lower saree */}
        <path d="M925 510 Q918 560 912 620 Q908 680 905 740 Q903 790 902 840" />
        <path d="M995 510 Q1002 560 1008 620 Q1012 680 1015 740 Q1017 790 1018 840" />
        {/* Skirt fold lines */}
        <path d="M935 540 Q940 600 938 660 Q935 720 932 780" />
        <path d="M955 530 Q958 600 956 670 Q954 740 952 810" />
        <path d="M975 530 Q978 600 980 670 Q982 740 984 810" />
        {/* Feet */}
        <path d="M902 840 Q898 850 895 855 Q890 858 885 855" />
        <path d="M1018 840 Q1022 850 1025 855 Q1030 858 1035 855" />
        {/* Left arm - holding wheat sheaf */}
        <path d="M928 310 Q910 330 895 355 Q882 380 875 405 Q870 425 868 445" />
        <path d="M868 445 Q865 455 862 450 Q864 442 868 438" />
        {/* Right arm - extended slightly */}
        <path d="M992 310 Q1010 325 1025 340 Q1038 355 1045 370 Q1050 385 1052 400" />
        <path d="M1052 400 Q1055 410 1058 405 Q1056 398 1052 394" />
        {/* Wheat sheaf held in left hand */}
        <path d="M862 448 Q855 420 850 380 Q845 340 842 300 Q840 270 840 240" />
        <path d="M862 448 Q852 425 845 390 Q840 355 838 320 Q836 290 838 260" />
        <path d="M862 448 Q848 428 838 398 Q832 368 830 340 Q828 310 830 280" />
        {/* Wheat grain heads */}
        <path d="M840 240 Q835 230 830 225 Q835 220 840 225 Q845 220 850 225 Q845 230 840 240" />
        <path d="M838 260 Q833 250 828 245 Q833 240 838 245 Q843 240 848 245 Q843 250 838 260" />
        <path d="M830 280 Q825 270 820 265 Q825 260 830 265 Q835 260 840 265 Q835 270 830 280" />
        <path d="M840 230 Q840 218 840 210 Q840 200 842 195" />
        <path d="M838 250 Q836 238 835 230 Q834 222 835 215" />
        <path d="M830 270 Q828 258 826 250 Q825 242 826 235" />
        {/* Additional wheat stalks */}
        <path d="M850 380 Q848 360 847 340 Q846 320 846 300 Q846 280 848 260" />
        <path d="M848 260 Q843 250 838 245 Q843 240 848 245 Q853 240 858 245 Q853 250 848 260" />
        <path d="M855 340 Q855 320 856 300 Q857 280 858 260 Q860 245 862 235" />
        <path d="M862 235 Q857 225 852 220 Q857 215 862 220 Q867 215 872 220 Q867 225 862 235" />
      </g>

      {/* Wheat/harvest stalks pattern - sides */}
      <g stroke={color} strokeWidth="0.8" opacity="0.3">
        {/* Left wheat field */}
        {[180, 250, 320, 390].map((x, i) => (
          <g key={`lw-${i}`}>
            <path d={`M${x} 900 L${x} ${650 - i * 20}`} />
            <path d={`M${x} ${650 - i * 20} Q${x - 5} ${635 - i * 20} ${x - 10} ${630 - i * 20} Q${x - 5} ${625 - i * 20} ${x} ${630 - i * 20} Q${x + 5} ${625 - i * 20} ${x + 10} ${630 - i * 20} Q${x + 5} ${635 - i * 20} ${x} ${650 - i * 20}`} />
            <path d={`M${x} ${680 - i * 20} Q${x - 8} ${670 - i * 20} ${x} ${660 - i * 20} Q${x + 8} ${670 - i * 20} ${x} ${680 - i * 20}`} />
            <path d={`M${x} ${710 - i * 20} Q${x - 8} ${700 - i * 20} ${x} ${690 - i * 20} Q${x + 8} ${700 - i * 20} ${x} ${710 - i * 20}`} />
          </g>
        ))}
        {/* Right wheat field */}
        {[1530, 1600, 1670, 1740].map((x, i) => (
          <g key={`rw-${i}`}>
            <path d={`M${x} 900 L${x} ${650 - i * 20}`} />
            <path d={`M${x} ${650 - i * 20} Q${x - 5} ${635 - i * 20} ${x - 10} ${630 - i * 20} Q${x - 5} ${625 - i * 20} ${x} ${630 - i * 20} Q${x + 5} ${625 - i * 20} ${x + 10} ${630 - i * 20} Q${x + 5} ${635 - i * 20} ${x} ${650 - i * 20}`} />
            <path d={`M${x} ${680 - i * 20} Q${x - 8} ${670 - i * 20} ${x} ${660 - i * 20} Q${x + 8} ${670 - i * 20} ${x} ${680 - i * 20}`} />
            <path d={`M${x} ${710 - i * 20} Q${x - 8} ${700 - i * 20} ${x} ${690 - i * 20} Q${x + 8} ${700 - i * 20} ${x} ${710 - i * 20}`} />
          </g>
        ))}
      </g>

      {/* Lotus mandala base */}
      <g stroke={color} strokeWidth="0.8" opacity="0.25">
        <circle cx="960" cy="940" r="80" />
        <circle cx="960" cy="940" r="65" />
        <circle cx="960" cy="940" r="50" />
        <circle cx="960" cy="940" r="35" />
        {/* Lotus petals around mandala */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 960 + 50 * Math.cos(angle);
          const y1 = 940 + 50 * Math.sin(angle);
          const x2 = 960 + 85 * Math.cos(angle);
          const y2 = 940 + 85 * Math.sin(angle);
          const cx1 = 960 + 75 * Math.cos(angle + 0.15);
          const cy1 = 940 + 75 * Math.sin(angle + 0.15);
          const cx2 = 960 + 75 * Math.cos(angle - 0.15);
          const cy2 = 940 + 75 * Math.sin(angle - 0.15);
          return (
            <g key={`lp-${i}`}>
              <path d={`M${x1.toFixed(0)} ${y1.toFixed(0)} Q${cx1.toFixed(0)} ${cy1.toFixed(0)} ${x2.toFixed(0)} ${y2.toFixed(0)} Q${cx2.toFixed(0)} ${cy2.toFixed(0)} ${x1.toFixed(0)} ${y1.toFixed(0)}`} />
            </g>
          );
        })}
      </g>

      {/* Small grain dots scattered */}
      <g stroke={color} strokeWidth="0.5" opacity="0.15">
        {[
          [200, 200], [300, 150], [400, 180], [500, 130], [600, 170],
          [1320, 170], [1420, 130], [1520, 180], [1620, 150], [1720, 200],
          [150, 400], [180, 550], [160, 700], [200, 850],
          [1760, 400], [1740, 550], [1760, 700], [1720, 850],
          [450, 950], [550, 970], [650, 960], [1270, 960], [1370, 970], [1470, 950],
          [350, 350], [420, 500], [380, 650], [1540, 350], [1500, 500], [1540, 650],
          [280, 300], [320, 450], [300, 580], [1620, 300], [1600, 450], [1620, 580],
        ].map(([x, y], i) => (
          <g key={`gd-${i}`}>
            <circle cx={x} cy={y} r="2" />
            <circle cx={x + 8} cy={y - 3} r="1.5" />
            <circle cx={x - 6} cy={y + 5} r="1.5" />
          </g>
        ))}
      </g>

      {/* Temple arch border */}
      <g stroke={color} strokeWidth="0.7" opacity="0.2">
        {/* Top arch */}
        <path d="M400 50 Q500 30 600 25 Q700 20 800 18 Q860 16 960 15 Q1060 16 1120 18 Q1220 20 1320 25 Q1420 30 1520 50" />
        <path d="M380 60 Q500 35 600 30 Q700 25 800 23 Q860 21 960 20 Q1060 21 1120 23 Q1220 25 1320 30 Q1420 35 1540 60" />
        {/* Finial at top */}
        <path d="M955 15 L960 5 L965 15" />
        <circle cx="960" cy="8" r="3" />
        {/* Side pillars */}
        <line x1="380" y1="60" x2="380" y2="1020" />
        <line x1="395" y1="55" x2="395" y2="1020" />
        <line x1="1525" y1="55" x2="1525" y2="1020" />
        <line x1="1540" y1="60" x2="1540" y2="1020" />
        {/* Pillar base decorations */}
        <path d="M370 1020 Q380 1010 395 1008 Q410 1010 420 1020" />
        <path d="M1515 1020 Q1525 1010 1540 1008 Q1555 1010 1565 1020" />
      </g>

      {/* Virgo glyph */}
      <g stroke={color} strokeWidth="2" opacity="0.5">
        <path d="M920 100 Q920 80 930 75 Q940 72 940 85 Q940 95 935 105" />
        <path d="M940 85 Q940 65 950 60 Q960 57 960 70 Q960 80 955 90" />
        <path d="M960 70 Q960 50 970 45 Q980 42 980 55 Q980 65 975 75" />
        <path d="M975 75 Q985 80 990 90 Q995 100 990 110 Q985 115 978 112" />
        <path d="M935 105 L935 120" />
        <path d="M955 90 L955 120" />
        <path d="M975 75 L975 120" />
      </g>
    </svg>
  );
}
