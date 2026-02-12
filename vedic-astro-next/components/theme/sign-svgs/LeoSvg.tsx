interface SignSvgProps {
  color?: string;
}

export default function LeoSvg({ color = 'currentColor' }: SignSvgProps) {
  return (
    <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" fill="none">
      {/* Majestic lion head silhouette with flowing mane */}
      <g stroke={color} strokeWidth="1.5" opacity="0.8">
        {/* Mane - outer flowing strands */}
        <path d="M960 200 Q940 210 920 240 Q900 270 890 310 Q885 340 888 370" />
        <path d="M960 200 Q980 210 1000 240 Q1020 270 1030 310 Q1035 340 1032 370" />
        <path d="M930 210 Q900 220 870 250 Q845 280 830 320 Q820 350 825 385" />
        <path d="M990 210 Q1020 220 1050 250 Q1075 280 1090 320 Q1100 350 1095 385" />
        <path d="M910 225 Q870 235 840 270 Q815 305 800 345 Q790 380 798 410" />
        <path d="M1010 225 Q1050 235 1080 270 Q1105 305 1120 345 Q1130 380 1122 410" />
        <path d="M895 245 Q855 260 825 295 Q800 330 788 370 Q780 405 790 435" />
        <path d="M1025 245 Q1065 260 1095 295 Q1120 330 1132 370 Q1140 405 1130 435" />
        <path d="M880 270 Q845 290 818 325 Q795 360 785 400 Q778 435 788 460" />
        <path d="M1040 270 Q1075 290 1102 325 Q1125 360 1135 400 Q1142 435 1132 460" />
        {/* Mane - inner layers */}
        <path d="M870 300 Q840 325 822 360 Q810 395 815 430 Q820 455 835 475" />
        <path d="M1050 300 Q1080 325 1098 360 Q1110 395 1105 430 Q1100 455 1085 475" />
        <path d="M858 340 Q835 370 825 405 Q818 435 825 460 Q832 480 845 495" />
        <path d="M1062 340 Q1085 370 1095 405 Q1102 435 1095 460 Q1088 480 1075 495" />
        {/* Face outline */}
        <path d="M860 420 Q855 450 858 480 Q862 510 870 535 Q880 555 895 570 Q910 582 930 590 Q950 595 960 596 Q970 595 990 590 Q1010 582 1025 570 Q1040 555 1050 535 Q1058 510 1062 480 Q1065 450 1060 420" />
        {/* Forehead */}
        <path d="M880 400 Q900 385 920 380 Q940 378 960 377 Q980 378 1000 380 Q1020 385 1040 400" />
        {/* Eyes - expressive */}
        <path d="M895 445 Q905 435 920 435 Q935 435 940 445 Q935 455 920 456 Q905 455 895 445" />
        <circle cx="918" cy="445" r="6" />
        <circle cx="916" cy="444" r="2.5" />
        <path d="M980 445 Q990 435 1005 435 Q1020 435 1025 445 Q1020 455 1005 456 Q990 455 980 445" />
        <circle cx="1003" cy="445" r="6" />
        <circle cx="1001" cy="444" r="2.5" />
        {/* Eyebrow ridges */}
        <path d="M890 432 Q905 425 920 424 Q935 425 945 432" />
        <path d="M975 432 Q990 425 1005 424 Q1020 425 1030 432" />
        {/* Nose */}
        <path d="M945 460 Q948 475 950 485 Q952 495 955 500 Q958 505 960 508 Q962 505 965 500 Q968 495 970 485 Q972 475 975 460" />
        <path d="M948 505 Q952 512 956 515 Q958 516 960 516 Q962 516 964 515 Q968 512 972 505" />
        {/* Nose bridge highlight */}
        <path d="M955 465 L960 500" />
        {/* Mouth / jaw */}
        <path d="M930 535 Q940 540 950 542 Q960 543 970 542 Q980 540 990 535" />
        <path d="M935 548 Q945 555 955 558 Q960 559 965 558 Q975 555 985 548" />
        {/* Chin tuft */}
        <path d="M940 570 Q948 580 955 590 Q958 600 960 610" />
        <path d="M980 570 Q972 580 965 590 Q962 600 960 610" />
        <path d="M960 596 L960 630" />
        {/* Whisker dots */}
        <circle cx="920" cy="520" r="1.5" />
        <circle cx="912" cy="525" r="1.5" />
        <circle cx="928" cy="528" r="1.5" />
        <circle cx="1000" cy="520" r="1.5" />
        <circle cx="1008" cy="525" r="1.5" />
        <circle cx="992" cy="528" r="1.5" />
        {/* Ears */}
        <path d="M868 380 Q858 360 855 340 Q854 320 862 310 Q870 305 878 315 Q885 330 882 350 Q880 365 875 380" />
        <path d="M1052 380 Q1062 360 1065 340 Q1066 320 1058 310 Q1050 305 1042 315 Q1035 330 1038 350 Q1040 365 1045 380" />
        {/* Inner ear lines */}
        <path d="M865 345 Q868 330 872 320" />
        <path d="M1055 345 Q1052 330 1048 320" />
      </g>

      {/* Royal crown above */}
      <g stroke={color} strokeWidth="1.2" opacity="0.6">
        <path d="M900 200 L895 160 L910 180 L920 140 L935 175 L960 120 L985 175 L1000 140 L1010 180 L1025 160 L1020 200" />
        <path d="M900 200 Q910 205 920 207 Q940 210 960 210 Q980 210 1000 207 Q1010 205 1020 200" />
        <path d="M900 195 Q960 190 1020 195" />
        {/* Crown jewel circles */}
        <circle cx="960" cy="130" r="5" />
        <circle cx="920" cy="150" r="4" />
        <circle cx="1000" cy="150" r="4" />
        <circle cx="895" cy="168" r="3" />
        <circle cx="1025" cy="168" r="3" />
        {/* Crown band details */}
        <path d="M905 200 Q910 195 920 193 Q940 190 960 190 Q980 190 1000 193 Q1010 195 1015 200" />
      </g>

      {/* Sun ray border radiating from center */}
      <g stroke={color} strokeWidth="0.8" opacity="0.25">
        {Array.from({ length: 36 }, (_, i) => {
          const angle = (i * 10 * Math.PI) / 180;
          const innerR = 340;
          const outerR = 480;
          const x1 = 960 + innerR * Math.cos(angle);
          const y1 = 450 + innerR * Math.sin(angle) * 0.7;
          const x2 = 960 + outerR * Math.cos(angle);
          const y2 = 450 + outerR * Math.sin(angle) * 0.7;
          return <line key={`ray-${i}`} x1={x1.toFixed(0)} y1={y1.toFixed(0)} x2={x2.toFixed(0)} y2={y2.toFixed(0)} />;
        })}
        {/* Sun circle rings */}
        <ellipse cx="960" cy="450" rx="340" ry="238" />
        <ellipse cx="960" cy="450" rx="355" ry="248" />
        <ellipse cx="960" cy="450" rx="480" ry="336" />
        <ellipse cx="960" cy="450" rx="495" ry="346" />
      </g>

      {/* Lotus throne below */}
      <g stroke={color} strokeWidth="1" opacity="0.4">
        {/* Main lotus */}
        <path d="M860 780 Q880 750 910 740 Q940 735 960 733 Q980 735 1010 740 Q1040 750 1060 780" />
        <path d="M840 785 Q870 745 910 730 Q950 722 960 720 Q970 722 1010 730 Q1050 745 1080 785" />
        <path d="M820 790 Q855 740 900 722 Q940 712 960 710 Q980 712 1020 722 Q1065 740 1100 790" />
        {/* Outer petals */}
        <path d="M800 795 Q810 760 840 735 Q870 715 900 708 Q940 700 960 698" />
        <path d="M1120 795 Q1110 760 1080 735 Q1050 715 1020 708 Q980 700 960 698" />
        <path d="M780 800 Q795 770 820 745 Q850 720 890 705" />
        <path d="M1140 800 Q1125 770 1100 745 Q1070 720 1030 705" />
        {/* Lotus base / seat */}
        <path d="M780 800 Q820 810 880 815 Q920 818 960 820 Q1000 818 1040 815 Q1100 810 1140 800" />
        <path d="M800 820 Q850 830 910 835 Q940 837 960 838 Q980 837 1010 835 Q1070 830 1120 820" />
        {/* Stem */}
        <path d="M960 838 L960 880" />
        {/* Base platform */}
        <path d="M820 880 Q870 870 920 868 Q940 867 960 866 Q980 867 1000 868 Q1050 870 1100 880" />
        <path d="M810 895 Q870 885 920 883 Q960 881 1000 883 Q1050 885 1110 895" />
      </g>

      {/* Decorative corner mandala elements */}
      <g stroke={color} strokeWidth="0.6" opacity="0.2">
        {/* Top-left corner */}
        <path d="M80 80 Q120 60 160 80 Q140 120 160 160 Q120 140 80 160 Q100 120 80 80" />
        <circle cx="120" cy="120" r="20" />
        <circle cx="120" cy="120" r="10" />
        {/* Top-right corner */}
        <path d="M1840 80 Q1800 60 1760 80 Q1780 120 1760 160 Q1800 140 1840 160 Q1820 120 1840 80" />
        <circle cx="1800" cy="120" r="20" />
        <circle cx="1800" cy="120" r="10" />
        {/* Bottom-left corner */}
        <path d="M80 1000 Q120 980 160 1000 Q140 1040 160 1060 Q120 1040 80 1060 Q100 1020 80 1000" />
        <circle cx="120" cy="1030" r="20" />
        <circle cx="120" cy="1030" r="10" />
        {/* Bottom-right corner */}
        <path d="M1840 1000 Q1800 980 1760 1000 Q1780 1040 1760 1060 Q1800 1040 1840 1060 Q1820 1020 1840 1000" />
        <circle cx="1800" cy="1030" r="20" />
        <circle cx="1800" cy="1030" r="10" />
      </g>

      {/* Small sun symbols scattered */}
      <g stroke={color} strokeWidth="0.5" opacity="0.15">
        {[
          [200, 300], [350, 200], [500, 150], [1420, 150], [1570, 200], [1720, 300],
          [150, 500], [180, 700], [200, 900], [1720, 500], [1740, 700], [1720, 900],
          [400, 950], [600, 980], [1320, 980], [1520, 950],
        ].map(([x, y], i) => (
          <g key={`sun-${i}`}>
            <circle cx={x} cy={y} r="8" />
            {Array.from({ length: 8 }, (_, j) => {
              const a = (j * 45 * Math.PI) / 180;
              return (
                <line
                  key={`sr-${i}-${j}`}
                  x1={x + 10 * Math.cos(a)}
                  y1={y + 10 * Math.sin(a)}
                  x2={x + 16 * Math.cos(a)}
                  y2={y + 16 * Math.sin(a)}
                />
              );
            })}
          </g>
        ))}
      </g>

      {/* Leo glyph */}
      <g stroke={color} strokeWidth="2" opacity="0.5">
        <path d="M930 950 Q920 940 920 930 Q920 920 930 915 Q940 910 950 915 Q955 920 955 930" />
        <path d="M955 930 Q955 945 965 955 Q975 960 985 955 Q990 950 990 940 Q990 930 985 920 Q978 910 970 905 Q960 900 950 905" />
        <path d="M990 940 Q1000 950 1010 945 Q1015 935 1010 925" />
      </g>
    </svg>
  );
}
