interface SignSvgProps {
  color?: string;
}

export default function LibraSvg({ color = 'currentColor' }: SignSvgProps) {
  return (
    <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" fill="none">
      {/* Balance scales silhouette - centered */}
      <g stroke={color} strokeWidth="1.5" opacity="0.8">
        {/* Central pillar */}
        <path d="M955 280 L955 750" />
        <path d="M965 280 L965 750" />
        {/* Pillar decorative bands */}
        <path d="M948 320 Q960 315 972 320" />
        <path d="M948 360 Q960 355 972 360" />
        <path d="M948 400 Q960 395 972 400" />
        <path d="M948 500 Q960 495 972 500" />
        <path d="M948 600 Q960 595 972 600" />
        <path d="M948 700 Q960 695 972 700" />
        {/* Top ornament / fulcrum */}
        <path d="M930 280 Q935 265 945 260 Q955 255 960 252 Q965 255 975 260 Q985 265 990 280" />
        <path d="M930 280 Q960 275 990 280" />
        <circle cx="960" cy="258" r="8" />
        <circle cx="960" cy="258" r="4" />
        {/* Crossbeam */}
        <path d="M620 310 Q700 295 780 288 Q840 283 900 280 Q960 278 960 278 Q960 278 1020 280 Q1080 283 1140 288 Q1220 295 1300 310" />
        <path d="M620 320 Q700 305 780 298 Q840 293 900 290 Q960 288 960 288 Q960 288 1020 290 Q1080 293 1140 298 Q1220 305 1300 320" />
        {/* Left chain */}
        <path d="M620 315 L620 400" />
        <path d="M615 330 Q620 325 625 330 Q620 335 615 330" />
        <path d="M615 350 Q620 345 625 350 Q620 355 615 350" />
        <path d="M615 370 Q620 365 625 370 Q620 375 615 370" />
        <path d="M615 390 Q620 385 625 390 Q620 395 615 390" />
        {/* Right chain */}
        <path d="M1300 315 L1300 400" />
        <path d="M1295 330 Q1300 325 1305 330 Q1300 335 1295 330" />
        <path d="M1295 350 Q1300 345 1305 350 Q1300 355 1295 350" />
        <path d="M1295 370 Q1300 365 1305 370 Q1300 375 1295 370" />
        <path d="M1295 390 Q1300 385 1305 390 Q1300 395 1295 390" />
        {/* Left scale pan */}
        <path d="M520 420 Q540 415 560 412 Q580 410 600 408 Q620 406 620 405 Q620 406 640 408 Q660 410 680 412 Q700 415 720 420" />
        <path d="M520 420 Q515 440 512 460 Q510 480 515 500 Q525 520 545 530 Q570 540 600 545 Q620 548 640 545 Q670 540 695 530 Q715 520 725 500 Q730 480 728 460 Q725 440 720 420" />
        {/* Pan details - left */}
        <path d="M540 450 Q580 445 620 443 Q660 445 700 450" />
        <path d="M530 480 Q580 475 620 473 Q660 475 710 480" />
        {/* Right scale pan */}
        <path d="M1200 420 Q1220 415 1240 412 Q1260 410 1280 408 Q1300 406 1300 405 Q1300 406 1320 408 Q1340 410 1360 412 Q1380 415 1400 420" />
        <path d="M1200 420 Q1195 440 1192 460 Q1190 480 1195 500 Q1205 520 1225 530 Q1250 540 1280 545 Q1300 548 1320 545 Q1350 540 1375 530 Q1395 520 1405 500 Q1410 480 1408 460 Q1405 440 1400 420" />
        {/* Pan details - right */}
        <path d="M1220 450 Q1260 445 1300 443 Q1340 445 1380 450" />
        <path d="M1210 480 Q1260 475 1300 473 Q1340 475 1390 480" />
        {/* Base pedestal */}
        <path d="M860 750 Q880 745 910 742 Q940 740 960 738 Q980 740 1010 742 Q1040 745 1060 750" />
        <path d="M840 765 Q880 758 920 755 Q960 752 1000 755 Q1040 758 1080 765" />
        <path d="M820 780 Q870 772 920 768 Q960 766 1000 768 Q1050 772 1100 780" />
        {/* Pedestal decorations */}
        <path d="M880 760 Q920 755 960 753 Q1000 755 1040 760" />
        <circle cx="960" cy="755" r="3" />
      </g>

      {/* Symmetrical lotus pattern on each side */}
      <g stroke={color} strokeWidth="1" opacity="0.35">
        {/* Left lotus cluster */}
        <g>
          {/* Central lotus */}
          <path d="M300 540 Q310 520 320 515 Q330 520 340 540" />
          <path d="M290 545 Q305 515 320 508 Q335 515 350 545" />
          <path d="M280 548 Q300 510 320 500 Q340 510 360 548" />
          <path d="M270 550 Q295 505 320 495 Q345 505 370 550" />
          <path d="M285 555 Q320 550 355 555" />
          {/* Left side petal */}
          <path d="M270 550 Q255 535 248 515 Q245 500 255 490 Q268 485 278 495 Q285 510 280 530" />
          {/* Right side petal */}
          <path d="M370 550 Q385 535 392 515 Q395 500 385 490 Q372 485 362 495 Q355 510 360 530" />
          {/* Stem */}
          <path d="M320 555 L320 600" />
          <path d="M320 580 Q310 588 305 595" />
          <path d="M320 580 Q330 588 335 595" />
        </g>
        {/* Right lotus cluster (mirrored) */}
        <g>
          <path d="M1580 540 Q1590 520 1600 515 Q1610 520 1620 540" />
          <path d="M1570 545 Q1585 515 1600 508 Q1615 515 1630 545" />
          <path d="M1560 548 Q1580 510 1600 500 Q1620 510 1640 548" />
          <path d="M1550 550 Q1575 505 1600 495 Q1625 505 1650 550" />
          <path d="M1565 555 Q1600 550 1635 555" />
          <path d="M1550 550 Q1535 535 1528 515 Q1525 500 1535 490 Q1548 485 1558 495 Q1565 510 1560 530" />
          <path d="M1650 550 Q1665 535 1672 515 Q1675 500 1665 490 Q1652 485 1642 495 Q1635 510 1640 530" />
          <path d="M1600 555 L1600 600" />
          <path d="M1600 580 Q1590 588 1585 595" />
          <path d="M1600 580 Q1610 588 1615 595" />
        </g>
      </g>

      {/* Harmony circles */}
      <g stroke={color} strokeWidth="0.8" opacity="0.2">
        {/* Concentric harmony rings around the scales */}
        <circle cx="960" cy="420" r="420" />
        <circle cx="960" cy="420" r="435" />
        <circle cx="960" cy="420" r="450" />
        {/* Yin-yang style balance within */}
        <path d="M960 50 Q1150 235 960 420 Q770 235 960 50" strokeDasharray="4 8" />
        <path d="M960 420 Q1150 605 960 790 Q770 605 960 420" strokeDasharray="4 8" />
        {/* Small harmony circles at cardinal points */}
        <circle cx="960" cy="50" r="10" />
        <circle cx="960" cy="790" r="10" />
        <circle cx="540" cy="420" r="10" />
        <circle cx="1380" cy="420" r="10" />
      </g>

      {/* Equal decorative borders */}
      <g stroke={color} strokeWidth="0.7" opacity="0.2">
        {/* Symmetric border pattern - top */}
        <path d="M100 40 L1820 40" />
        <path d="M100 50 L1820 50" />
        {Array.from({ length: 18 }, (_, i) => {
          const x = 100 + i * 100;
          return (
            <g key={`tb-${i}`}>
              <path d={`M${x + 50} 40 L${x + 50} 25 Q${x + 55} 15 ${x + 60} 25 L${x + 60} 40`} />
              <circle cx={x + 55} cy="18" r="3" />
            </g>
          );
        })}
        {/* Symmetric border pattern - bottom */}
        <path d="M100 1040 L1820 1040" />
        <path d="M100 1030 L1820 1030" />
        {Array.from({ length: 18 }, (_, i) => {
          const x = 100 + i * 100;
          return (
            <g key={`bb-${i}`}>
              <path d={`M${x + 50} 1040 L${x + 50} 1055 Q${x + 55} 1065 ${x + 60} 1055 L${x + 60} 1040`} />
              <circle cx={x + 55} cy="1062" r="3" />
            </g>
          );
        })}
        {/* Left border */}
        <path d="M60 100 L60 980" />
        <path d="M70 100 L70 980" />
        {Array.from({ length: 9 }, (_, i) => {
          const y = 100 + i * 100;
          return (
            <g key={`lb-${i}`}>
              <path d={`M60 ${y + 50} L45 ${y + 50} Q35 ${y + 55} 45 ${y + 60} L60 ${y + 60}`} />
              <circle cx="38" cy={y + 55} r="3" />
            </g>
          );
        })}
        {/* Right border */}
        <path d="M1860 100 L1860 980" />
        <path d="M1850 100 L1850 980" />
        {Array.from({ length: 9 }, (_, i) => {
          const y = 100 + i * 100;
          return (
            <g key={`rb-${i}`}>
              <path d={`M1860 ${y + 50} L1875 ${y + 50} Q1885 ${y + 55} 1875 ${y + 60} L1860 ${y + 60}`} />
              <circle cx="1882" cy={y + 55} r="3" />
            </g>
          );
        })}
      </g>

      {/* Kolam-style geometric pattern */}
      <g stroke={color} strokeWidth="0.5" opacity="0.15">
        {/* Left kolam grid */}
        {Array.from({ length: 5 }, (_, i) =>
          Array.from({ length: 5 }, (_, j) => {
            const x = 130 + i * 40;
            const y = 300 + j * 40;
            return (
              <g key={`kl-${i}-${j}`}>
                <circle cx={x} cy={y} r="1.5" />
                {i < 4 && <path d={`M${x} ${y} Q${x + 20} ${y - 8} ${x + 40} ${y}`} />}
                {j < 4 && <path d={`M${x} ${y} Q${x - 8} ${y + 20} ${x} ${y + 40}`} />}
              </g>
            );
          })
        )}
        {/* Right kolam grid (mirrored) */}
        {Array.from({ length: 5 }, (_, i) =>
          Array.from({ length: 5 }, (_, j) => {
            const x = 1630 + i * 40;
            const y = 300 + j * 40;
            return (
              <g key={`kr-${i}-${j}`}>
                <circle cx={x} cy={y} r="1.5" />
                {i < 4 && <path d={`M${x} ${y} Q${x + 20} ${y - 8} ${x + 40} ${y}`} />}
                {j < 4 && <path d={`M${x} ${y} Q${x + 8} ${y + 20} ${x} ${y + 40}`} />}
              </g>
            );
          })
        )}
      </g>

      {/* Feather of truth / Ma'at style accents */}
      <g stroke={color} strokeWidth="0.6" opacity="0.18">
        {[
          [620, 520], [1300, 520], [620, 470], [1300, 470],
        ].map(([x, y], i) => (
          <g key={`feather-${i}`}>
            <path d={`M${x} ${y} Q${x - 8} ${y - 5} ${x - 12} ${y - 15} Q${x - 5} ${y - 12} ${x} ${y}`} />
            <path d={`M${x} ${y} Q${x + 8} ${y - 5} ${x + 12} ${y - 15} Q${x + 5} ${y - 12} ${x} ${y}`} />
          </g>
        ))}
      </g>

      {/* Venus/Shukra yantra - hexagram */}
      <g stroke={color} strokeWidth="0.8" opacity="0.22">
        <path d="M960 830 L930 880 L990 880 Z" />
        <path d="M960 890 L930 840 L990 840 Z" />
        <circle cx="960" cy="860" r="35" />
        <circle cx="960" cy="860" r="42" />
        <circle cx="960" cy="860" r="10" />
      </g>

      {/* Libra glyph */}
      <g stroke={color} strokeWidth="2" opacity="0.5">
        <path d="M930 950 L990 950" />
        <path d="M935 940 L985 940" />
        <path d="M940 930 Q960 910 980 930" />
      </g>
    </svg>
  );
}
