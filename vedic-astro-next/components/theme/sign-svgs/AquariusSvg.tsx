interface SignSvgProps {
  color?: string;
}

export default function AquariusSvg({ color = 'currentColor' }: SignSvgProps) {
  return (
    <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" fill="none">
      {/* Water bearer silhouette pouring water */}
      <g stroke={color} strokeWidth="1.5" opacity="0.8">
        {/* Head */}
        <ellipse cx="920" cy="210" rx="36" ry="44" />
        {/* Face features */}
        <path d="M906 200 Q910 198 914 200" />
        <circle cx="910" cy="200" r="2" />
        <path d="M926 200 Q930 198 934 200" />
        <circle cx="930" cy="200" r="2" />
        <path d="M916 218 Q920 222 924 218" />
        <path d="M914 230 Q920 235 926 230" />
        {/* Hair */}
        <path d="M884 205 Q880 185 885 165 Q895 148 912 142 Q928 138 942 145 Q955 155 958 175 Q960 190 956 205" />
        <path d="M888 175 Q892 162 902 152 Q912 146 922 145" />
        <path d="M950 175 Q948 165 942 155 Q935 148 928 146" />
        {/* Hair flowing back */}
        <path d="M956 200 Q968 195 978 198 Q988 205 992 218 Q995 232 990 248" />
        <path d="M955 210 Q965 208 975 212 Q984 220 986 235 Q988 250 984 262" />
        {/* Neck */}
        <path d="M908 254 L908 278" />
        <path d="M932 254 L932 278" />
        {/* Necklace */}
        <path d="M898 280 Q908 286 918 288 Q928 286 938 280" />
        <circle cx="918" cy="290" r="3" />
        {/* Torso */}
        <path d="M892 280 Q885 310 880 345 Q876 380 878 415 Q880 445 885 470" />
        <path d="M948 280 Q955 310 958 345 Q960 380 958 415 Q956 445 952 470" />
        <path d="M892 280 Q905 275 920 273 Q935 275 948 280" />
        {/* Garment draping lines */}
        <path d="M885 340 Q900 335 920 333 Q940 335 952 340" />
        <path d="M880 400 Q900 395 920 393 Q940 395 958 400" />
        {/* Waist */}
        <path d="M885 470 Q900 475 915 477 Q930 475 952 470" />
        {/* Lower garment / dhoti */}
        <path d="M885 470 Q878 520 874 570 Q870 620 868 670 Q867 710 868 750" />
        <path d="M952 470 Q958 520 962 570 Q966 620 968 670 Q969 710 968 750" />
        {/* Garment folds */}
        <path d="M895 500 Q900 550 898 600 Q896 650 895 700" />
        <path d="M918 490 Q920 540 919 590 Q918 640 918 690" />
        <path d="M940 500 Q938 550 939 600 Q940 650 940 700" />
        {/* Feet */}
        <path d="M868 750 Q865 760 862 765 Q858 768 854 765" />
        <path d="M968 750 Q972 760 975 765 Q978 768 982 765" />
        {/* Left arm - holding vessel up */}
        <path d="M892 295 Q870 300 852 310 Q835 322 822 340 Q812 358 808 378" />
        {/* Hand gripping vessel */}
        <path d="M808 378 Q805 385 808 390 Q812 388 814 382" />
        {/* Right arm - supporting vessel */}
        <path d="M948 295 Q960 288 972 285 Q985 284 995 290 Q1005 298 1010 310" />
        <path d="M1010 310 Q1012 318 1008 322 Q1004 320 1005 314" />
        {/* Water vessel / pot (kumbh) */}
        <path d="M780 340 Q775 360 772 380 Q770 400 775 420 Q782 440 798 452 Q818 462 840 465 Q860 466 878 460 Q895 452 905 438 Q912 420 912 400 Q910 380 905 360 Q900 340 895 325" />
        <path d="M780 340 Q810 330 840 328 Q870 330 895 340" />
        {/* Vessel neck */}
        <path d="M798 328 Q810 318 825 315 Q840 314 855 318 Q868 324 878 335" />
        {/* Vessel rim */}
        <path d="M808 316 Q820 308 835 306 Q850 308 862 316" />
        <path d="M812 310 Q825 303 838 302 Q850 304 858 310" />
        {/* Vessel decorative band */}
        <path d="M778 370 Q808 362 840 360 Q872 362 902 370" />
        <path d="M775 395 Q808 387 840 385 Q872 387 905 395" />
        {/* Vessel lotus decoration */}
        <path d="M820 410 Q830 400 840 398 Q850 400 860 410" />
        <path d="M815 415 Q828 400 840 395 Q852 400 865 415" />
        {/* Water pouring from tilted vessel */}
        <path d="M808 316 Q790 300 778 285 Q768 272 762 260" />
        <path d="M812 310 Q796 295 785 280 Q776 268 770 255" />
        {/* Water stream */}
        <path d="M762 260 Q755 240 750 220 Q748 200 752 185 Q758 170 768 165" />
        <path d="M770 255 Q764 235 760 215 Q758 195 762 180 Q768 165 778 160" />
        {/* Water splashing/flowing down */}
        <path d="M762 260 Q750 280 740 310 Q732 340 728 375 Q725 410 728 450 Q732 490 740 530 Q750 570 762 600" />
        <path d="M770 255 Q758 275 748 305 Q740 335 736 370 Q733 405 736 445 Q740 485 748 525 Q758 565 770 595" />
        {/* Water droplet details */}
        <path d="M745 320 Q740 325 742 332 Q745 338 750 335 Q752 328 748 322" />
        <path d="M730 400 Q725 405 727 412 Q730 418 735 415 Q737 408 733 402" />
        <path d="M732 480 Q727 485 729 492 Q732 498 737 495 Q739 488 735 482" />
        <path d="M740 550 Q735 555 737 562 Q740 568 745 565 Q747 558 743 552" />
      </g>

      {/* Flowing wave geometry pattern */}
      <g stroke={color} strokeWidth="0.8" opacity="0.25">
        {/* Geometric wave bands - right side */}
        {Array.from({ length: 6 }, (_, row) => {
          const baseY = 200 + row * 120;
          return (
            <g key={`gw-${row}`}>
              <path d={`M1200 ${baseY} Q1250 ${baseY - 25} 1300 ${baseY} Q1350 ${baseY + 25} 1400 ${baseY} Q1450 ${baseY - 25} 1500 ${baseY} Q1550 ${baseY + 25} 1600 ${baseY} Q1650 ${baseY - 25} 1700 ${baseY} Q1750 ${baseY + 25} 1800 ${baseY}`} />
              <path d={`M1200 ${baseY + 15} Q1250 ${baseY - 10} 1300 ${baseY + 15} Q1350 ${baseY + 40} 1400 ${baseY + 15} Q1450 ${baseY - 10} 1500 ${baseY + 15} Q1550 ${baseY + 40} 1600 ${baseY + 15} Q1650 ${baseY - 10} 1700 ${baseY + 15} Q1750 ${baseY + 40} 1800 ${baseY + 15}`} />
            </g>
          );
        })}
        {/* Left side wave geometry */}
        {Array.from({ length: 3 }, (_, row) => {
          const baseY = 700 + row * 80;
          return (
            <path key={`lwg-${row}`} d={`M120 ${baseY} Q170 ${baseY - 20} 220 ${baseY} Q270 ${baseY + 20} 320 ${baseY} Q370 ${baseY - 20} 420 ${baseY} Q470 ${baseY + 20} 520 ${baseY}`} />
          );
        })}
      </g>

      {/* Cosmic circle patterns */}
      <g stroke={color} strokeWidth="0.7" opacity="0.2">
        {/* Large cosmic ring */}
        <circle cx="960" cy="540" r="420" />
        <circle cx="960" cy="540" r="430" />
        {/* Orbital circles */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x = 960 + 425 * Math.cos(angle);
          const y = 540 + 425 * Math.sin(angle);
          return <circle key={`oc-${i}`} cx={x.toFixed(0)} cy={y.toFixed(0)} r="8" />;
        })}
        {/* Inner cosmic rings */}
        <circle cx="960" cy="540" r="350" strokeDasharray="5 10" />
        <circle cx="960" cy="540" r="280" strokeDasharray="3 8" />
        {/* Small celestial bodies */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = ((i * 45 + 15) * Math.PI) / 180;
          const x = 960 + 350 * Math.cos(angle);
          const y = 540 + 350 * Math.sin(angle);
          return <circle key={`cb-${i}`} cx={x.toFixed(0)} cy={y.toFixed(0)} r="4" />;
        })}
      </g>

      {/* Raindrop/water accents */}
      <g stroke={color} strokeWidth="0.5" opacity="0.15">
        {[
          [200, 180], [300, 120], [450, 160], [580, 130], [1340, 130], [1470, 160], [1620, 120], [1740, 180],
          [150, 350], [130, 520], [160, 690], [1770, 350], [1790, 520], [1760, 690],
          [350, 950], [500, 980], [650, 960], [1270, 960], [1420, 980], [1570, 950],
          [280, 450], [250, 600], [320, 800], [1640, 450], [1670, 600], [1600, 800],
        ].map(([x, y], i) => (
          <g key={`rd-${i}`}>
            <path d={`M${x} ${y} Q${x - 5} ${y + 8} ${x} ${y + 14} Q${x + 5} ${y + 8} ${x} ${y}`} />
            <path d={`M${x} ${y + 4} Q${x - 2} ${y + 8} ${x} ${y + 11}`} />
          </g>
        ))}
      </g>

      {/* Kolam/rangoli pattern */}
      <g stroke={color} strokeWidth="0.4" opacity="0.12">
        {/* Center bottom kolam */}
        {Array.from({ length: 7 }, (_, i) =>
          Array.from({ length: 3 }, (_, j) => {
            const x = 870 + i * 30;
            const y = 920 + j * 30;
            return (
              <g key={`kb-${i}-${j}`}>
                <circle cx={x} cy={y} r="1.5" />
                {i < 6 && <path d={`M${x} ${y} Q${x + 15} ${y - 6} ${x + 30} ${y}`} />}
                {j < 2 && <path d={`M${x} ${y} Q${x - 6} ${y + 15} ${x} ${y + 30}`} />}
              </g>
            );
          })
        )}
      </g>

      {/* Hindu decorative border */}
      <g stroke={color} strokeWidth="0.6" opacity="0.18">
        {/* Temple arch top */}
        <path d="M500 40 Q600 20 700 15 Q800 10 900 8 Q960 7 1020 8 Q1120 10 1220 15 Q1320 20 1420 40" />
        <path d="M510 50 Q610 30 710 25 Q810 20 900 18 Q960 17 1020 18 Q1110 20 1210 25 Q1310 30 1410 50" />
        {/* Lotus finial */}
        <path d="M950 8 Q955 0 960 -3 Q965 0 970 8" />
        <circle cx="960" cy="-3" r="4" />
        {/* Decorative swags */}
        {Array.from({ length: 8 }, (_, i) => {
          const x1 = 300 + i * 180;
          const x2 = x1 + 180;
          const mid = (x1 + x2) / 2;
          return (
            <g key={`swag-${i}`}>
              <path d={`M${x1} ${45 - Math.abs(i - 3.5) * 2} Q${mid} ${70 - Math.abs(i - 3.5) * 2} ${x2} ${45 - Math.abs(i - 3.5) * 2}`} />
              <circle cx={mid} cy={68 - Math.abs(i - 3.5) * 2} r="3" />
            </g>
          );
        })}
      </g>

      {/* Aquarius glyph */}
      <g stroke={color} strokeWidth="2" opacity="0.5">
        <path d="M930 90 Q945 80 960 90 Q975 100 990 90" />
        <path d="M930 105 Q945 95 960 105 Q975 115 990 105" />
      </g>
    </svg>
  );
}
