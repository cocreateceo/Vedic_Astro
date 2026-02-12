interface SignSvgProps {
  color?: string;
}

export default function PiscesSvg({ color = 'currentColor' }: SignSvgProps) {
  return (
    <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" fill="none">
      {/* Two fish swimming in circle - yin-yang style */}
      <g stroke={color} strokeWidth="1.5" opacity="0.8">
        {/* Fish 1 - swimming right/upward (top fish) */}
        <g>
          {/* Body */}
          <path d="M780 380 Q820 350 870 335 Q920 325 970 330 Q1020 340 1060 365 Q1095 390 1115 420 Q1130 450 1130 480 Q1125 510 1110 530 Q1090 550 1065 560 Q1035 568 1000 565 Q970 560 940 545" />
          {/* Belly */}
          <path d="M780 380 Q800 400 830 415 Q860 428 895 432 Q930 434 960 428 Q990 420 1010 405 Q1025 392 1032 378" />
          {/* Head detail */}
          <path d="M1095 390 Q1110 400 1120 415 Q1128 430 1130 445" />
          {/* Eye */}
          <ellipse cx="1085" cy="420" rx="12" ry="9" />
          <circle cx="1088" cy="418" r="4" />
          <circle cx="1090" cy="417" r="1.5" />
          {/* Mouth */}
          <path d="M1125 450 Q1135 455 1140 462 Q1138 468 1130 470" />
          {/* Gill lines */}
          <path d="M1060 400 Q1055 420 1058 440" />
          <path d="M1050 405 Q1045 425 1048 445" />
          {/* Dorsal fin */}
          <path d="M920 330 Q935 305 955 295 Q975 290 990 300 Q1000 312 1005 330" />
          <path d="M940 318 Q955 305 968 300" />
          <path d="M960 312 Q972 304 982 302" />
          {/* Pectoral fin */}
          <path d="M1040 440 Q1055 455 1060 475 Q1058 490 1045 495 Q1032 492 1025 478 Q1022 465 1028 452" />
          {/* Ventral fin */}
          <path d="M960 432 Q968 448 965 465 Q958 475 948 470 Q942 460 945 448" />
          {/* Tail */}
          <path d="M780 380 Q755 365 735 345 Q720 328 710 310 Q705 295 712 285 Q722 280 732 290 Q740 302 745 318" />
          <path d="M780 380 Q760 395 742 415 Q728 432 720 450 Q715 465 722 475 Q732 480 742 470 Q750 458 752 442" />
          {/* Tail connection detail */}
          <path d="M745 318 Q758 340 780 380" />
          <path d="M752 442 Q765 420 780 380" />
          {/* Scale pattern */}
          {[
            [850, 365], [890, 358], [930, 355], [970, 358], [1010, 370],
            [860, 395], [900, 390], [940, 388], [980, 392],
            [870, 420], [910, 415], [950, 413],
          ].map(([x, y], i) => (
            <path key={`s1-${i}`} d={`M${x} ${y} Q${x + 10} ${y - 5} ${x + 20} ${y} Q${x + 10} ${y + 5} ${x} ${y}`} />
          ))}
        </g>

        {/* Fish 2 - swimming left/downward (bottom fish) */}
        <g>
          {/* Body */}
          <path d="M1140 700 Q1100 730 1050 745 Q1000 755 950 750 Q900 740 860 715 Q825 690 805 660 Q790 630 790 600 Q795 570 810 550 Q830 530 855 520 Q885 512 920 515 Q950 520 980 535" />
          {/* Belly */}
          <path d="M1140 700 Q1120 680 1090 665 Q1060 652 1025 648 Q990 646 960 652 Q930 660 910 675 Q895 688 888 702" />
          {/* Head detail */}
          <path d="M825 690 Q810 680 800 665 Q792 650 790 635" />
          {/* Eye */}
          <ellipse cx="835" cy="660" rx="12" ry="9" />
          <circle cx="832" cy="662" r="4" />
          <circle cx="830" cy="663" r="1.5" />
          {/* Mouth */}
          <path d="M795 630 Q785 625 780 618 Q782 612 790 610" />
          {/* Gill lines */}
          <path d="M860 680 Q865 660 862 640" />
          <path d="M870 675 Q875 655 872 635" />
          {/* Dorsal fin */}
          <path d="M1000 750 Q985 775 965 785 Q945 790 930 780 Q920 768 915 750" />
          <path d="M980 762 Q965 775 952 780" />
          <path d="M960 768 Q948 776 938 778" />
          {/* Pectoral fin */}
          <path d="M880 640 Q865 625 860 605 Q862 590 875 585 Q888 588 895 602 Q898 615 892 628" />
          {/* Ventral fin */}
          <path d="M960 648 Q952 632 955 615 Q962 605 972 610 Q978 620 975 632" />
          {/* Tail */}
          <path d="M1140 700 Q1165 715 1185 735 Q1200 752 1210 770 Q1215 785 1208 795 Q1198 800 1188 790 Q1180 778 1175 762" />
          <path d="M1140 700 Q1160 685 1178 665 Q1192 648 1200 630 Q1205 615 1198 605 Q1188 600 1178 610 Q1170 622 1168 638" />
          {/* Tail connection */}
          <path d="M1175 762 Q1162 740 1140 700" />
          <path d="M1168 638 Q1155 660 1140 700" />
          {/* Scale pattern */}
          {[
            [1070, 715], [1030, 722], [990, 725], [950, 722], [910, 710],
            [1060, 685], [1020, 690], [980, 692], [940, 688],
            [1050, 660], [1010, 665], [970, 667],
          ].map(([x, y], i) => (
            <path key={`s2-${i}`} d={`M${x} ${y} Q${x - 10} ${y + 5} ${x - 20} ${y} Q${x - 10} ${y - 5} ${x} ${y}`} />
          ))}
        </g>

        {/* Connecting circle between fish (vesica piscis) */}
        <circle cx="960" cy="540" r="220" strokeDasharray="6 8" opacity="0.4" />
        {/* Yin-yang dot */}
        <circle cx="960" cy="420" r="8" />
        <circle cx="960" cy="660" r="8" />
      </g>

      {/* Ocean wave pattern */}
      <g stroke={color} strokeWidth="1" opacity="0.3">
        {/* Bottom waves */}
        {Array.from({ length: 4 }, (_, row) => {
          const y = 920 + row * 35;
          return (
            <path key={`ow-${row}`} d={`M0 ${y} ${Array.from({ length: 20 }, (_, i) => {
              const x = i * 100;
              const dir = i % 2 === 0 ? -1 : 1;
              return `Q${x + 50} ${y + dir * 18} ${x + 100} ${y}`;
            }).join(' ')}`} opacity={1 - row * 0.15} />
          );
        })}
        {/* Top waves */}
        {Array.from({ length: 3 }, (_, row) => {
          const y = 60 + row * 30;
          return (
            <path key={`tw-${row}`} d={`M0 ${y} ${Array.from({ length: 20 }, (_, i) => {
              const x = i * 100;
              const dir = i % 2 === 0 ? 1 : -1;
              return `Q${x + 50} ${y + dir * 15} ${x + 100} ${y}`;
            }).join(' ')}`} opacity={0.6 - row * 0.1} />
          );
        })}
      </g>

      {/* Lotus pond with lily pads */}
      <g stroke={color} strokeWidth="0.8" opacity="0.25">
        {/* Central lotus */}
        <path d="M940 880 Q948 862 955 858 Q962 862 970 880" />
        <path d="M932 883 Q945 858 958 852 Q970 858 982 883" />
        <path d="M924 886 Q942 854 960 846 Q978 854 996 886" />
        <path d="M918 888 Q938 850 960 840 Q982 850 1002 888" />
        {/* Side petals */}
        <path d="M912 890 Q900 870 895 852 Q895 840 905 838 Q915 840 920 855 Q922 870 918 888" />
        <path d="M1008 890 Q1020 870 1025 852 Q1025 840 1015 838 Q1005 840 1000 855 Q998 870 1002 888" />
        {/* Lotus seat base */}
        <path d="M910 892 Q930 898 950 900 Q960 901 970 900 Q990 898 1010 892" />
        {/* Lily pads scattered */}
        {[
          { cx: 400, cy: 920, r: 35 },
          { cx: 550, cy: 940, r: 28 },
          { cx: 700, cy: 930, r: 32 },
          { cx: 1220, cy: 930, r: 32 },
          { cx: 1370, cy: 940, r: 28 },
          { cx: 1520, cy: 920, r: 35 },
        ].map((pad, i) => (
          <g key={`lp-${i}`}>
            <path d={`M${pad.cx} ${pad.cy - pad.r} A${pad.r} ${pad.r * 0.7} 0 1 1 ${pad.cx} ${pad.cy + pad.r * 0.5}`} />
            <path d={`M${pad.cx} ${pad.cy - pad.r} A${pad.r} ${pad.r * 0.7} 0 1 0 ${pad.cx} ${pad.cy + pad.r * 0.5}`} />
            <path d={`M${pad.cx} ${pad.cy - pad.r} L${pad.cx} ${pad.cy + pad.r * 0.3}`} />
            {/* Vein lines */}
            <path d={`M${pad.cx} ${pad.cy - pad.r * 0.3} Q${pad.cx - pad.r * 0.5} ${pad.cy} ${pad.cx - pad.r * 0.8} ${pad.cy + pad.r * 0.2}`} />
            <path d={`M${pad.cx} ${pad.cy - pad.r * 0.3} Q${pad.cx + pad.r * 0.5} ${pad.cy} ${pad.cx + pad.r * 0.8} ${pad.cy + pad.r * 0.2}`} />
          </g>
        ))}
        {/* Small lotus buds on pads */}
        <path d="M400 900 Q405 890 410 888 Q415 890 420 900" />
        <path d="M400 900 L410 880" />
        <path d="M1520 900 Q1525 890 1530 888 Q1535 890 1540 900" />
        <path d="M1520 900 L1530 880" />
      </g>

      {/* Bubble/circle accents */}
      <g stroke={color} strokeWidth="0.5" opacity="0.15">
        {[
          [200, 200, 8], [250, 300, 5], [180, 450, 7], [220, 580, 4], [190, 700, 6],
          [300, 150, 6], [350, 380, 4], [280, 520, 5], [340, 680, 7], [260, 800, 4],
          [400, 250, 5], [420, 480, 6], [380, 620, 3], [440, 770, 5],
          [1520, 200, 7], [1580, 350, 5], [1550, 500, 6], [1600, 650, 4],
          [1680, 250, 5], [1720, 400, 6], [1700, 550, 4], [1660, 720, 7],
          [1750, 180, 4], [1770, 480, 5], [1740, 630, 6], [1760, 800, 3],
          [600, 160, 4], [700, 130, 5], [1220, 130, 5], [1320, 160, 4],
          [500, 850, 5], [650, 870, 4], [1270, 870, 4], [1420, 850, 5],
        ].map(([x, y, r], i) => (
          <g key={`bub-${i}`}>
            <circle cx={x} cy={y} r={r} />
            <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.25} />
          </g>
        ))}
      </g>

      {/* Mandala ring */}
      <g stroke={color} strokeWidth="0.6" opacity="0.18">
        <circle cx="960" cy="540" r="380" />
        <circle cx="960" cy="540" r="390" />
        <circle cx="960" cy="540" r="400" />
        {/* Petal details on outer ring */}
        {Array.from({ length: 20 }, (_, i) => {
          const angle = (i * 18 * Math.PI) / 180;
          const x1 = 960 + 390 * Math.cos(angle);
          const y1 = 540 + 390 * Math.sin(angle);
          const x2 = 960 + 415 * Math.cos(angle);
          const y2 = 540 + 415 * Math.sin(angle);
          const cx1 = 960 + 410 * Math.cos(angle + 0.08);
          const cy1 = 540 + 410 * Math.sin(angle + 0.08);
          const cx2 = 960 + 410 * Math.cos(angle - 0.08);
          const cy2 = 540 + 410 * Math.sin(angle - 0.08);
          return (
            <g key={`rp-${i}`}>
              <path d={`M${x1.toFixed(0)} ${y1.toFixed(0)} Q${cx1.toFixed(0)} ${cy1.toFixed(0)} ${x2.toFixed(0)} ${y2.toFixed(0)} Q${cx2.toFixed(0)} ${cy2.toFixed(0)} ${x1.toFixed(0)} ${y1.toFixed(0)}`} />
            </g>
          );
        })}
      </g>

      {/* Hindu decorative corners */}
      <g stroke={color} strokeWidth="0.6" opacity="0.2">
        {/* Corner paisleys */}
        <path d="M100 100 Q120 80 140 85 Q155 95 150 115 Q140 130 120 128 Q105 122 105 108" />
        <path d="M108 108 Q115 100 125 100 Q132 105 130 115 Q125 120 118 118" />
        <path d="M1820 100 Q1800 80 1780 85 Q1765 95 1770 115 Q1780 130 1800 128 Q1815 122 1815 108" />
        <path d="M1812 108 Q1805 100 1795 100 Q1788 105 1790 115 Q1795 120 1802 118" />
        <path d="M100 980 Q120 1000 140 995 Q155 985 150 965 Q140 950 120 952 Q105 958 105 972" />
        <path d="M108 972 Q115 980 125 980 Q132 975 130 965 Q125 960 118 962" />
        <path d="M1820 980 Q1800 1000 1780 995 Q1765 985 1770 965 Q1780 950 1800 952 Q1815 958 1815 972" />
        <path d="M1812 972 Q1805 980 1795 980 Q1788 975 1790 965 Q1795 960 1802 962" />
      </g>

      {/* Pisces glyph */}
      <g stroke={color} strokeWidth="2" opacity="0.5">
        <path d="M940 160 Q930 145 930 130 Q930 115 940 105" />
        <path d="M980 160 Q990 145 990 130 Q990 115 980 105" />
        <line x1="925" y1="132" x2="995" y2="132" />
      </g>
    </svg>
  );
}
