interface SignSvgProps {
  color?: string;
}

export default function ScorpioSvg({ color = 'currentColor' }: SignSvgProps) {
  return (
    <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" fill="none">
      {/* Scorpion silhouette with raised tail */}
      <g stroke={color} strokeWidth="1.5" opacity="0.8">
        {/* Body - main cephalothorax */}
        <ellipse cx="900" cy="540" rx="120" ry="80" />
        {/* Body segments (abdomen) */}
        <ellipse cx="900" cy="540" rx="95" ry="60" />
        <path d="M900 480 Q940 475 960 485 Q975 495 980 510" />
        <path d="M900 600 Q940 605 960 595 Q975 585 980 570" />
        {/* Tail segments curving up and over */}
        <path d="M1020 540 Q1060 535 1090 520 Q1120 500 1140 475 Q1160 445 1170 410 Q1180 375 1185 340 Q1188 310 1185 280 Q1180 255 1170 235 Q1160 220 1148 215 Q1135 212 1125 220 Q1118 230 1120 245" />
        {/* Tail outer edge */}
        <path d="M1020 555 Q1065 555 1098 540 Q1130 520 1152 495 Q1175 465 1190 430 Q1202 395 1208 360 Q1212 330 1210 300 Q1205 270 1195 248 Q1185 232 1172 225 Q1158 220 1145 228 Q1135 238 1138 255" />
        {/* Tail segment lines */}
        <path d="M1040 530 Q1045 540 1040 550" />
        <path d="M1070 515 Q1078 525 1070 538" />
        <path d="M1100 495 Q1110 505 1105 518" />
        <path d="M1130 470 Q1142 478 1138 492" />
        <path d="M1155 438 Q1168 445 1165 460" />
        <path d="M1175 400 Q1188 405 1186 420" />
        <path d="M1188 360 Q1200 362 1200 378" />
        <path d="M1192 320 Q1205 318 1208 335" />
        <path d="M1188 280 Q1200 275 1205 290" />
        {/* Stinger */}
        <path d="M1120 245 Q1110 230 1105 218 Q1102 210 1108 200 Q1115 195 1122 200 Q1130 210 1125 225" />
        <path d="M1138 255 Q1128 238 1122 225 Q1118 215 1122 205 Q1128 198 1135 205 Q1142 215 1138 232" />
        {/* Stinger point */}
        <path d="M1108 200 L1098 185 L1115 192" />
        {/* Venom drop */}
        <path d="M1098 185 Q1095 175 1098 170 Q1102 168 1105 175" />
        {/* Left pincer/claw */}
        <path d="M780 510 Q740 480 710 460 Q680 440 650 425 Q625 415 600 412" />
        <path d="M780 530 Q735 510 700 490 Q670 475 640 465 Q615 458 590 458" />
        {/* Left claw pincers */}
        <path d="M600 412 Q580 405 565 400 Q550 398 540 405 Q535 415 545 425 Q555 430 570 425 Q582 418 590 410" />
        <path d="M590 458 Q575 462 560 460 Q545 455 540 445 Q538 435 548 428 Q558 425 568 432 Q575 440 580 450" />
        {/* Right pincer/claw */}
        <path d="M780 570 Q740 600 710 620 Q680 640 650 655 Q625 665 600 668" />
        <path d="M780 550 Q735 570 700 590 Q670 605 640 615 Q615 622 590 622" />
        {/* Right claw pincers */}
        <path d="M600 668 Q580 675 565 680 Q550 682 540 675 Q535 665 545 655 Q555 650 570 655 Q582 662 590 670" />
        <path d="M590 622 Q575 618 560 620 Q545 625 540 635 Q538 645 548 652 Q558 655 568 648 Q575 640 580 630" />
        {/* Walking legs - left side */}
        <path d="M840 480 Q810 450 790 430 Q775 415 760 405 Q752 400 745 405" />
        <path d="M860 478 Q835 445 815 420 Q800 402 785 390 Q778 385 772 390" />
        <path d="M880 475 Q862 440 845 415 Q832 398 818 385 Q812 380 806 385" />
        <path d="M900 480 Q888 445 878 418 Q870 400 858 388 Q852 383 846 388" />
        {/* Walking legs - right side */}
        <path d="M840 600 Q810 630 790 650 Q775 665 760 675 Q752 680 745 675" />
        <path d="M860 602 Q835 635 815 660 Q800 678 785 690 Q778 695 772 690" />
        <path d="M880 605 Q862 640 845 665 Q832 682 818 695 Q812 700 806 695" />
        <path d="M900 600 Q888 635 878 662 Q870 680 858 692 Q852 697 846 692" />
        {/* Eyes */}
        <circle cx="820" cy="520" r="8" />
        <circle cx="820" cy="520" r="4" />
        <circle cx="820" cy="560" r="8" />
        <circle cx="820" cy="560" r="4" />
        {/* Smaller median eyes */}
        <circle cx="840" cy="535" r="4" />
        <circle cx="840" cy="545" r="4" />
      </g>

      {/* Intensity spiral patterns */}
      <g stroke={color} strokeWidth="0.8" opacity="0.25">
        {/* Large spiral - top left */}
        <path d="M300 250 Q320 230 340 240 Q360 260 350 280 Q330 300 300 290 Q270 270 280 240 Q300 210 330 220 Q370 240 360 290 Q340 330 290 320 Q250 300 260 250 Q280 200 340 210 Q390 230 380 300" />
        {/* Large spiral - top right */}
        <path d="M1620 250 Q1600 230 1580 240 Q1560 260 1570 280 Q1590 300 1620 290 Q1650 270 1640 240 Q1620 210 1590 220 Q1550 240 1560 290 Q1580 330 1630 320 Q1670 300 1660 250 Q1640 200 1580 210 Q1530 230 1540 300" />
        {/* Medium spiral - bottom left */}
        <path d="M250 750 Q265 735 280 742 Q295 755 288 770 Q272 782 255 775 Q238 760 245 742 Q260 725 282 732 Q302 748 295 772 Q278 792 252 785 Q232 768 240 745" />
        {/* Medium spiral - bottom right */}
        <path d="M1670 750 Q1655 735 1640 742 Q1625 755 1632 770 Q1648 782 1665 775 Q1682 760 1675 742 Q1660 725 1638 732 Q1618 748 1625 772 Q1642 792 1668 785 Q1688 768 1680 745" />
      </g>

      {/* Mars yantra (triangle in circle) */}
      <g stroke={color} strokeWidth="1" opacity="0.35">
        {/* Outer circle */}
        <circle cx="960" cy="880" r="60" />
        <circle cx="960" cy="880" r="70" />
        {/* Upward triangle */}
        <path d="M960 825 L920 910 L1000 910 Z" />
        {/* Inner inverted triangle */}
        <path d="M960 915 L940 870 L980 870 Z" />
        {/* Center point */}
        <circle cx="960" cy="880" r="5" />
        {/* Bindu dots at triangle vertices */}
        <circle cx="960" cy="825" r="3" />
        <circle cx="920" cy="910" r="3" />
        <circle cx="1000" cy="910" r="3" />
      </g>

      {/* Small star accents scattered */}
      <g stroke={color} strokeWidth="0.6" opacity="0.18">
        {[
          [200, 150], [400, 100], [550, 180], [1370, 160], [1520, 100], [1720, 150],
          [150, 350], [180, 550], [140, 750], [1770, 350], [1750, 550], [1780, 750],
          [350, 900], [550, 950], [750, 930], [1170, 930], [1370, 950], [1570, 900],
          [300, 450], [280, 650], [1640, 450], [1640, 650],
          [450, 300], [500, 200], [1420, 200], [1470, 300],
        ].map(([x, y], i) => (
          <g key={`star-${i}`}>
            <path d={`M${x} ${y - 8} L${x + 2} ${y - 2} L${x + 8} ${y} L${x + 2} ${y + 2} L${x} ${y + 8} L${x - 2} ${y + 2} L${x - 8} ${y} L${x - 2} ${y - 2} Z`} />
            <circle cx={x} cy={y} r="1.5" />
          </g>
        ))}
      </g>

      {/* Mandala border ring */}
      <g stroke={color} strokeWidth="0.5" opacity="0.15">
        <rect x="80" y="60" width="1760" height="960" rx="15" />
        <rect x="90" y="70" width="1740" height="940" rx="12" />
        {/* Decorative scallops on border */}
        {Array.from({ length: 30 }, (_, i) => {
          const x = 90 + i * 60;
          return (
            <path key={`st-${i}`} d={`M${x} 60 Q${x + 30} 48 ${x + 60} 60`} />
          );
        })}
        {Array.from({ length: 30 }, (_, i) => {
          const x = 90 + i * 60;
          return (
            <path key={`sb-${i}`} d={`M${x} 1020 Q${x + 30} 1032 ${x + 60} 1020`} />
          );
        })}
      </g>

      {/* Intensity dots - kolam pattern */}
      <g stroke={color} strokeWidth="0.4" opacity="0.12">
        {Array.from({ length: 8 }, (_, i) =>
          Array.from({ length: 5 }, (_, j) => {
            const x = 130 + i * 30;
            const y = 200 + j * 30;
            return <circle key={`kdl-${i}-${j}`} cx={x} cy={y} r="1.5" />;
          })
        )}
        {Array.from({ length: 8 }, (_, i) =>
          Array.from({ length: 5 }, (_, j) => {
            const x = 1600 + i * 30;
            const y = 200 + j * 30;
            return <circle key={`kdr-${i}-${j}`} cx={x} cy={y} r="1.5" />;
          })
        )}
      </g>

      {/* Scorpio glyph */}
      <g stroke={color} strokeWidth="2" opacity="0.5">
        <path d="M910 155 Q910 135 920 130 Q930 127 930 140 Q930 150 925 160" />
        <path d="M930 140 Q930 120 940 115 Q950 112 950 125 Q950 135 945 145" />
        <path d="M950 125 Q950 105 960 100 Q970 97 970 110 Q970 120 965 130" />
        <path d="M925 160 L925 175" />
        <path d="M945 145 L945 175" />
        <path d="M965 130 L965 175" />
        <path d="M965 175 L975 165 L980 175" />
      </g>
    </svg>
  );
}
