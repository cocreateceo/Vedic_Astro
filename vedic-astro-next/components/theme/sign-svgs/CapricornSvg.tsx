interface SignSvgProps {
  color?: string;
}

export default function CapricornSvg({ color = 'currentColor' }: SignSvgProps) {
  return (
    <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" fill="none">
      {/* Sea-goat silhouette (goat body, fish tail) */}
      <g stroke={color} strokeWidth="1.5" opacity="0.8">
        {/* Goat head */}
        <path d="M760 380 Q755 360 752 340 Q750 320 755 305 Q762 290 775 285 Q788 282 800 290 Q810 300 812 315 Q814 330 810 345 Q805 360 800 375" />
        {/* Eye */}
        <ellipse cx="780" cy="330" rx="10" ry="7" />
        <circle cx="782" cy="330" r="3" />
        {/* Nose/muzzle */}
        <path d="M758 340 Q752 348 748 355 Q745 362 750 368 Q756 372 762 368 Q766 362 764 355" />
        <circle cx="755" cy="358" r="3" />
        {/* Mouth */}
        <path d="M758 368 Q765 375 772 370" />
        {/* Ear */}
        <path d="M795 295 Q805 280 815 278 Q822 282 820 295 Q815 305 808 310" />
        {/* Horns - long curved goat horns */}
        <path d="M775 285 Q770 260 768 235 Q766 210 770 190 Q778 170 790 158 Q805 148 820 145 Q835 145 845 155 Q852 168 848 185 Q842 200 830 210 Q818 218 808 215" />
        <path d="M800 290 Q798 268 800 248 Q804 228 812 212 Q822 198 835 190 Q848 185 858 188 Q865 195 862 210 Q856 225 845 232 Q835 238 825 235" />
        {/* Horn ridges */}
        <path d="M770 250 Q775 248 780 252" />
        <path d="M770 225 Q776 222 782 226" />
        <path d="M775 200 Q782 196 788 200" />
        <path d="M785 180 Q792 176 798 180" />
        {/* Beard */}
        <path d="M758 368 Q750 380 745 395 Q742 410 745 420" />
        <path d="M762 370 Q755 385 752 400 Q750 415 755 425" />
        <path d="M745 420 Q740 430 742 440" />
        {/* Neck */}
        <path d="M800 375 Q810 390 818 405 Q825 420 828 440" />
        <path d="M760 380 Q768 395 775 415 Q780 435 782 455" />
        {/* Goat body - front */}
        <path d="M782 455 Q778 485 780 515 Q782 545 788 570 Q795 595 805 615" />
        <path d="M828 440 Q840 470 850 500 Q858 530 862 558 Q865 580 862 600" />
        {/* Body top line */}
        <path d="M828 440 Q860 445 890 450 Q920 458 950 470 Q980 485 1010 505" />
        {/* Belly line */}
        <path d="M782 455 Q790 470 800 480 Q815 495 835 505 Q860 515 890 520" />
        {/* Front left leg */}
        <path d="M800 580 Q795 620 792 660 Q790 695 788 730 Q786 758 785 780" />
        <path d="M785 780 Q782 790 778 795 Q774 798 770 795 Q768 790 772 785 Q778 780 785 778" />
        {/* Front right leg */}
        <path d="M835 560 Q832 600 830 640 Q828 675 826 710 Q824 738 824 760" />
        <path d="M824 760 Q820 770 816 775 Q812 778 808 775 Q806 770 810 765 Q816 760 824 758" />
        {/* Hoof details */}
        <path d="M785 778 L785 795 Q790 798 795 795 L795 780" />
        <path d="M824 758 L824 775 Q829 778 834 775 L834 760" />
        {/* Transition zone - goat to fish */}
        <path d="M1010 505 Q1040 520 1065 540 Q1088 560 1105 585 Q1118 610 1125 640" />
        <path d="M890 520 Q920 535 950 555 Q978 575 1000 600 Q1020 625 1032 655" />
        {/* Fish tail section - scales and curves */}
        <path d="M1125 640 Q1140 670 1150 705 Q1158 740 1160 775 Q1158 810 1148 840 Q1135 865 1115 880 Q1095 892 1072 895" />
        <path d="M1032 655 Q1048 685 1060 720 Q1070 755 1075 790 Q1075 825 1068 850 Q1055 872 1038 885 Q1020 895 1000 898" />
        {/* Tail fin */}
        <path d="M1072 895 Q1090 910 1110 930 Q1130 950 1155 965 Q1180 975 1200 970 Q1215 960 1220 945 Q1218 930 1205 920" />
        <path d="M1000 898 Q1020 915 1040 935 Q1060 955 1080 970 Q1105 982 1125 980 Q1142 972 1148 958 Q1145 942 1132 932" />
        {/* Upper fin */}
        <path d="M1072 895 Q1060 910 1045 920 Q1030 928 1015 925 Q1005 918 1008 905 Q1015 895 1028 892" />
        <path d="M1000 898 Q990 912 978 918 Q968 922 958 918 Q952 912 958 902 Q965 895 978 895" />
        {/* Scale pattern on tail */}
        <path d="M1060 680 Q1070 690 1060 700" />
        <path d="M1080 710 Q1090 720 1080 730" />
        <path d="M1095 745 Q1105 755 1095 765" />
        <path d="M1105 780 Q1115 790 1105 800" />
        <path d="M1108 815 Q1118 825 1108 835" />
        <path d="M1105 850 Q1112 860 1100 870" />
        {/* Inner scale row */}
        <path d="M1035 690 Q1045 700 1035 710" />
        <path d="M1050 725 Q1060 735 1050 745" />
        <path d="M1060 760 Q1070 770 1060 780" />
        <path d="M1065 795 Q1075 805 1065 815" />
        <path d="M1060 830 Q1070 840 1058 850" />
      </g>

      {/* Mountain range pattern along bottom */}
      <g stroke={color} strokeWidth="1" opacity="0.3">
        <path d="M0 1080 L80 920 L120 960 L200 850 L260 900 L340 800 L400 860 L480 780 L540 830 L620 750 L680 800 L740 730 L780 770 L840 700 L880 740 L920 690 L960 720 L1000 690 L1040 740 L1080 700 L1120 770 L1160 730 L1240 800 L1300 750 L1380 830 L1440 780 L1520 860 L1580 800 L1660 900 L1720 850 L1800 960 L1840 920 L1920 1080" />
        <path d="M0 1080 L100 950 L160 980 L240 890 L300 930 L380 845 L440 890 L520 820 L580 860 L660 790 L720 830 L780 775 L820 800 L880 745 L920 780 L960 740 L1000 780 L1040 745 L1080 800 L1120 775 L1200 830 L1260 790 L1340 860 L1400 820 L1480 890 L1540 845 L1620 930 L1680 890 L1760 980 L1820 950 L1920 1080" />
        {/* Snow on peaks */}
        <path d="M340 800 Q350 795 360 800" />
        <path d="M620 750 Q630 745 640 750" />
        <path d="M840 700 Q850 695 860 700" />
        <path d="M920 690 Q930 685 940 690" />
        <path d="M1080 700 Q1090 695 1100 700" />
        <path d="M1300 750 Q1310 745 1320 750" />
      </g>

      {/* Saturn yantra (square in circle) */}
      <g stroke={color} strokeWidth="1" opacity="0.35">
        <circle cx="400" cy="400" r="60" />
        <circle cx="400" cy="400" r="70" />
        <rect x="358" y="358" width="84" height="84" />
        <rect x="370" y="370" width="60" height="60" />
        {/* Cross inside */}
        <line x1="400" y1="358" x2="400" y2="442" />
        <line x1="358" y1="400" x2="442" y2="400" />
        {/* Bindu */}
        <circle cx="400" cy="400" r="6" />
        {/* Triangle within */}
        <path d="M400 368 L430 425 L370 425 Z" />
      </g>

      {/* Snow/dot accents scattered */}
      <g stroke={color} strokeWidth="0.5" opacity="0.15">
        {[
          [180, 200], [250, 150], [320, 180], [1600, 180], [1670, 150], [1740, 200],
          [150, 350], [130, 500], [160, 650], [1760, 350], [1780, 500], [1760, 650],
          [500, 150], [600, 120], [700, 140], [1220, 140], [1320, 120], [1420, 150],
          [300, 550], [250, 700], [350, 650], [1570, 550], [1620, 700], [1670, 650],
          [550, 300], [620, 250], [1300, 250], [1370, 300],
        ].map(([x, y], i) => (
          <g key={`snow-${i}`}>
            <circle cx={x} cy={y} r="2" />
            <circle cx={x + 10} cy={y - 5} r="1.5" />
            <circle cx={x - 8} cy={y + 7} r="1" />
            <circle cx={x + 5} cy={y + 10} r="1.5" />
          </g>
        ))}
      </g>

      {/* Decorative mandala ring */}
      <g stroke={color} strokeWidth="0.6" opacity="0.18">
        {/* Top center mandala */}
        <circle cx="960" cy="100" r="50" />
        <circle cx="960" cy="100" r="40" />
        <circle cx="960" cy="100" r="30" />
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x1 = 960 + 30 * Math.cos(angle);
          const y1 = 100 + 30 * Math.sin(angle);
          const x2 = 960 + 50 * Math.cos(angle);
          const y2 = 100 + 50 * Math.sin(angle);
          return <line key={`mr-${i}`} x1={x1.toFixed(0)} y1={y1.toFixed(0)} x2={x2.toFixed(0)} y2={y2.toFixed(0)} />;
        })}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = ((i * 45 + 22.5) * Math.PI) / 180;
          const x = 960 + 45 * Math.cos(angle);
          const y = 100 + 45 * Math.sin(angle);
          return <circle key={`md-${i}`} cx={x.toFixed(0)} cy={y.toFixed(0)} r="4" />;
        })}
      </g>

      {/* Temple pillar borders */}
      <g stroke={color} strokeWidth="0.6" opacity="0.15">
        {/* Left pillar */}
        <line x1="80" y1="80" x2="80" y2="1000" />
        <line x1="95" y1="80" x2="95" y2="1000" />
        <path d="M72 80 Q88 70 103 80" />
        <path d="M72 1000 Q88 1010 103 1000" />
        {/* Right pillar */}
        <line x1="1825" y1="80" x2="1825" y2="1000" />
        <line x1="1840" y1="80" x2="1840" y2="1000" />
        <path d="M1817 80 Q1833 70 1848 80" />
        <path d="M1817 1000 Q1833 1010 1848 1000" />
        {/* Pillar bands */}
        {[200, 350, 500, 650, 800].map((y) => (
          <g key={`pb-${y}`}>
            <path d={`M75 ${y} Q88 ${y - 5} 100 ${y}`} />
            <path d={`M1820 ${y} Q1833 ${y - 5} 1845 ${y}`} />
          </g>
        ))}
      </g>

      {/* Kolam pattern - bottom corners */}
      <g stroke={color} strokeWidth="0.4" opacity="0.12">
        {Array.from({ length: 4 }, (_, i) =>
          Array.from({ length: 4 }, (_, j) => {
            const x = 140 + i * 25;
            const y = 920 + j * 25;
            return (
              <g key={`kbl-${i}-${j}`}>
                <circle cx={x} cy={y} r="1.5" />
                {i < 3 && <path d={`M${x} ${y} Q${x + 12} ${y - 5} ${x + 25} ${y}`} />}
                {j < 3 && <path d={`M${x} ${y} Q${x - 5} ${y + 12} ${x} ${y + 25}`} />}
              </g>
            );
          })
        )}
        {Array.from({ length: 4 }, (_, i) =>
          Array.from({ length: 4 }, (_, j) => {
            const x = 1730 + i * 25;
            const y = 920 + j * 25;
            return (
              <g key={`kbr-${i}-${j}`}>
                <circle cx={x} cy={y} r="1.5" />
                {i < 3 && <path d={`M${x} ${y} Q${x + 12} ${y - 5} ${x + 25} ${y}`} />}
                {j < 3 && <path d={`M${x} ${y} Q${x + 5} ${y + 12} ${x} ${y + 25}`} />}
              </g>
            );
          })
        )}
      </g>

      {/* Capricorn glyph */}
      <g stroke={color} strokeWidth="2" opacity="0.5">
        <path d="M1500 130 Q1500 110 1510 105 Q1520 102 1520 115 Q1520 128 1515 138" />
        <path d="M1515 138 Q1510 150 1508 165 Q1508 180 1515 190 Q1525 198 1535 192 Q1540 182 1535 172 Q1528 165 1520 170" />
        <path d="M1520 115 Q1520 95 1530 90 Q1540 87 1540 100 Q1540 115 1535 125" />
      </g>
    </svg>
  );
}
