interface SignSvgProps {
  color?: string;
}

export default function SagittariusSvg({ color = 'currentColor' }: SignSvgProps) {
  return (
    <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" fill="none">
      {/* Archer drawing bow silhouette - centaur */}
      <g stroke={color} strokeWidth="1.5" opacity="0.8">
        {/* Human head */}
        <ellipse cx="880" cy="220" rx="35" ry="42" />
        {/* Face */}
        <path d="M868 210 Q872 208 876 210" />
        <circle cx="872" cy="210" r="2" />
        <path d="M888 210 Q892 208 896 210" />
        <circle cx="892" cy="210" r="2" />
        <path d="M878 228 Q882 232 886 228" />
        <path d="M876 240 Q880 244 884 240" />
        {/* Hair / headband */}
        <path d="M845 215 Q842 195 848 178 Q858 162 875 158 Q892 155 905 165 Q915 178 918 195 Q920 210 915 220" />
        <path d="M848 205 Q846 195 850 185 Q856 172 872 168 Q888 165 900 172 Q910 182 912 195" />
        {/* Headband */}
        <path d="M848 200 Q870 195 892 195 Q910 196 918 200" />
        {/* Feather on headband */}
        <path d="M905 195 Q912 178 918 165 Q922 155 920 148 Q915 145 912 152 Q910 160 910 175" />
        {/* Neck */}
        <path d="M870 262 L870 285" />
        <path d="M890 262 L890 285" />
        {/* Human torso - turned for aiming */}
        <path d="M855 285 Q845 315 840 350 Q838 380 840 410" />
        <path d="M905 285 Q912 315 915 350 Q918 380 916 410" />
        <path d="M855 285 Q870 280 880 278 Q890 280 905 285" />
        {/* Chest / waist detail */}
        <path d="M845 350 Q860 345 880 343 Q900 345 915 350" />
        {/* Left arm - holding bow */}
        <path d="M855 300 Q830 310 810 325 Q792 342 778 360 Q768 375 760 392" />
        {/* Hand on bow grip */}
        <path d="M760 392 Q755 400 758 405 Q762 408 766 402 Q768 395 765 390" />
        {/* Right arm - pulling bowstring */}
        <path d="M905 300 Q920 295 935 288 Q948 282 958 275" />
        {/* Hand on string */}
        <path d="M958 275 Q962 272 965 276 Q963 280 958 280" />
        {/* Bow */}
        <path d="M760 395 Q720 350 700 300 Q688 260 685 220 Q684 190 690 165 Q698 140 712 125" />
        <path d="M760 395 Q730 430 715 470 Q705 510 702 545 Q700 575 705 600 Q712 625 725 640" />
        {/* Bow string */}
        <path d="M712 125 Q800 200 880 250 Q920 270 958 275" />
        <path d="M725 640 Q800 580 880 530 Q920 505 958 275" strokeDasharray="2 4" opacity="0.5" />
        {/* Arrow */}
        <path d="M958 275 L640 115" />
        {/* Arrow head */}
        <path d="M640 115 L630 125 L628 108 L640 115 L648 105 L640 115" />
        {/* Arrow fletching */}
        <path d="M940 268 Q945 262 950 268 Q945 274 940 268" />
        <path d="M935 270 Q940 264 945 270 Q940 276 935 270" />
        {/* Horse body - where human torso meets */}
        <path d="M840 410 Q830 420 820 435 Q810 455 808 480 Q806 510 810 540 Q815 570 825 595 Q835 615 850 630" />
        <path d="M916 410 Q930 425 945 445 Q960 470 970 500 Q978 530 980 560 Q980 590 975 615 Q968 635 955 650" />
        {/* Horse back line */}
        <path d="M840 410 Q860 405 880 403 Q900 405 916 410" />
        {/* Horse barrel/belly */}
        <path d="M850 630 Q880 650 920 648 Q945 645 955 635" />
        <path d="M810 540 Q820 570 835 595" />
        <path d="M980 540 Q975 570 965 595" />
        {/* Front left leg */}
        <path d="M830 600 Q825 640 822 680 Q820 710 818 740 Q816 770 815 800 Q814 820 818 830 Q825 835 832 828 Q835 818 834 800" />
        {/* Front right leg */}
        <path d="M868 640 Q865 670 862 700 Q860 730 858 760 Q856 785 855 805 Q854 820 858 830 Q865 835 872 828 Q875 818 874 800" />
        {/* Rear left leg */}
        <path d="M935 640 Q930 670 928 700 Q926 730 925 760 Q924 785 924 805 Q923 820 927 830 Q934 835 941 828 Q944 818 943 800" />
        {/* Rear right leg */}
        <path d="M960 620 Q958 660 955 700 Q953 730 952 760 Q951 785 951 805 Q950 820 954 830 Q961 835 968 828 Q971 818 970 800" />
        {/* Hooves */}
        <path d="M815 828 Q812 838 818 842 Q825 845 832 838" />
        <path d="M855 828 Q852 838 858 842 Q865 845 872 838" />
        <path d="M924 828 Q921 838 927 842 Q934 845 941 838" />
        <path d="M951 828 Q948 838 954 842 Q961 845 968 838" />
        {/* Tail */}
        <path d="M975 615 Q1000 610 1020 615 Q1040 625 1050 645 Q1055 665 1045 680 Q1035 690 1025 685 Q1020 675 1025 665" />
        <path d="M1025 685 Q1015 700 1005 710 Q995 718 985 720" />
        <path d="M1025 685 Q1020 698 1010 705" />
      </g>

      {/* Arrow trajectory line pattern */}
      <g stroke={color} strokeWidth="0.8" opacity="0.25">
        <path d="M640 115 Q500 80 350 55 Q250 40 150 35" strokeDasharray="8 12" />
        <path d="M640 115 Q510 70 370 40 Q260 20 160 10" strokeDasharray="8 12" />
        {/* Motion lines behind arrow */}
        <path d="M660 120 L700 135" strokeDasharray="3 6" />
        <path d="M670 110 L710 125" strokeDasharray="3 6" />
        <path d="M665 130 L705 145" strokeDasharray="3 6" />
        {/* Target circle far left */}
        <circle cx="120" cy="35" r="30" />
        <circle cx="120" cy="35" r="20" />
        <circle cx="120" cy="35" r="10" />
        <circle cx="120" cy="35" r="3" />
      </g>

      {/* Temple arch frame border */}
      <g stroke={color} strokeWidth="0.8" opacity="0.25">
        {/* Main arch */}
        <path d="M200 1060 L200 200 Q200 120 300 80 Q400 50 500 40 Q600 32 700 28 Q800 25 900 24 Q960 23 1020 24 Q1120 25 1220 28 Q1320 32 1420 40 Q1520 50 1620 80 Q1720 120 1720 200 L1720 1060" />
        <path d="M215 1060 L215 210 Q215 135 310 98 Q405 68 500 58 Q600 50 700 46 Q800 43 900 42 Q960 41 1020 42 Q1120 43 1220 46 Q1320 50 1420 58 Q1515 68 1610 98 Q1705 135 1705 210 L1705 1060" />
        {/* Arch decorations */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = Math.PI + (i * Math.PI) / 11;
          const cx = 960 + 760 * Math.cos(angle);
          const cy = 200 + 180 * Math.sin(angle);
          return <circle key={`ad-${i}`} cx={cx.toFixed(0)} cy={cy.toFixed(0)} r="4" />;
        })}
        {/* Pillar details */}
        <path d="M200 400 Q208 395 215 400" />
        <path d="M200 600 Q208 595 215 600" />
        <path d="M200 800 Q208 795 215 800" />
        <path d="M1705 400 Q1712 395 1720 400" />
        <path d="M1705 600 Q1712 595 1720 600" />
        <path d="M1705 800 Q1712 795 1720 800" />
      </g>

      {/* Wisdom flame above archer's head */}
      <g stroke={color} strokeWidth="1" opacity="0.4">
        <path d="M880 155 Q875 135 878 118 Q882 100 890 90 Q895 82 895 72 Q892 62 885 65 Q880 72 882 82 Q885 92 878 100" />
        <path d="M880 155 Q884 130 888 112 Q892 95 898 85 Q902 75 900 65 Q896 58 890 62" />
        <path d="M880 155 Q870 138 868 122 Q866 108 872 95 Q876 85 874 75 Q870 68 865 72 Q862 80 866 90 Q870 100 866 110" />
        {/* Flame inner */}
        <path d="M880 150 Q878 138 880 125 Q882 115 886 108" />
        {/* Halo ring */}
        <ellipse cx="880" cy="160" rx="30" ry="12" />
      </g>

      {/* Scattered decorative elements */}
      <g stroke={color} strokeWidth="0.5" opacity="0.15">
        {/* Stars */}
        {[
          [300, 300], [350, 450], [280, 600], [320, 750],
          [1580, 300], [1620, 450], [1650, 600], [1600, 750],
          [500, 950], [700, 980], [1220, 980], [1420, 950],
          [400, 180], [550, 140], [1370, 140], [1520, 180],
        ].map(([x, y], i) => (
          <g key={`s-${i}`}>
            <circle cx={x} cy={y} r="2" />
            <line x1={x - 6} y1={y} x2={x + 6} y2={y} />
            <line x1={x} y1={y - 6} x2={x} y2={y + 6} />
          </g>
        ))}
        {/* Kolam dots */}
        {Array.from({ length: 5 }, (_, i) =>
          Array.from({ length: 5 }, (_, j) => {
            const x = 1100 + i * 35;
            const y = 880 + j * 35;
            return <circle key={`kd-${i}-${j}`} cx={x} cy={y} r="1.5" />;
          })
        )}
      </g>

      {/* Jupiter yantra */}
      <g stroke={color} strokeWidth="0.7" opacity="0.2">
        <rect x="1380" y="860" width="80" height="80" rx="2" transform="rotate(45 1420 900)" />
        <circle cx="1420" cy="900" r="45" />
        <circle cx="1420" cy="900" r="30" />
        <path d="M1420 870 L1420 930" />
        <path d="M1390 900 L1450 900" />
        <circle cx="1420" cy="900" r="8" />
      </g>

      {/* Sagittarius glyph */}
      <g stroke={color} strokeWidth="2" opacity="0.5">
        <path d="M940 960 L980 930" />
        <path d="M980 930 L970 930 M980 930 L980 940" />
        <path d="M948 948 L972 972" />
      </g>
    </svg>
  );
}
