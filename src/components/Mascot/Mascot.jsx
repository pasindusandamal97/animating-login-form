import styles from './Mascot.module.css';

const MOUTHS = {
  idle: 'M89 125 Q94.5 132 100 126 Q105.5 132 111 125',
  watching: 'M89 125 Q94.5 132 100 126 Q105.5 132 111 125',
  peek: 'M91 126 Q95.5 131 100 126.5 Q104.5 131 109 126',
  shy: 'M96 130 a4 3.5 0 1 0 8 0 a4 3.5 0 1 0 -8 0',
  thinking: 'M95 130 Q101 128.5 107 129',
  happy: 'M88 125 Q100 143 112 125 Z',
  sad: 'M91 133 Q100 125 109 133',
};

// Radial gradient stops (centre to edge) for each plush material.
const GRADIENTS = {
  // Head, cheeks and chin share one gradient so they blend without seams.
  head: {
    units: 'userSpaceOnUse',
    cx: 84,
    cy: 66,
    r: 92,
    stops: ['#dcab76', '#b47b44', '#6f4320'],
  },
  body: { cx: '50%', cy: '20%', r: '80%', stops: ['#c8915a', '#a56c39', '#6e421f'] },
  ear: { cx: '45%', cy: '40%', r: '65%', stops: ['#c99159', '#a46a37', '#6b411f'] },
  innerEar: { cx: '55%', cy: '60%', r: '62%', stops: ['#7a4630', '#b0734f', '#d6a07c'] },
  muzzle: { cx: '45%', cy: '28%', r: '78%', stops: ['#fcefd8', '#efd3a6', '#c99f6c'] },
  paw: { cx: '42%', cy: '28%', r: '78%', stops: ['#d6a26b', '#ae743f', '#70441f'] },
  eye: { cx: '35%', cy: '30%', r: '70%', stops: ['#6a5448', '#1e1410', '#060303'] },
  noseShade: { cx: '35%', cy: '20%', r: '90%', stops: ['#ffffff55', '#00000000', '#00000088'] },
};

function RadialGradient({ id, units = 'objectBoundingBox', cx, cy, r, stops }) {
  return (
    <radialGradient id={`mascot-${id}`} gradientUnits={units} cx={cx} cy={cy} r={r}>
      {stops.map((color, i) => (
        <stop key={color} offset={i / (stops.length - 1)} stopColor={color} />
      ))}
    </radialGradient>
  );
}

// Ruffles the outline, then lights a fibre bump map from the top left so the fur looks real.
function FurFilter({ id, ruffle, fibres, depth }) {
  return (
    <filter id={id} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
      <feTurbulence
        type="fractalNoise"
        baseFrequency={ruffle.frequency}
        numOctaves="2"
        seed="7"
        result="ruffle"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="ruffle"
        scale={ruffle.scale}
        xChannelSelector="R"
        yChannelSelector="G"
        result="fuzzy"
      />
      <feTurbulence
        type="fractalNoise"
        baseFrequency={fibres}
        numOctaves="3"
        seed="2"
        result="fibres"
      />
      <feDiffuseLighting
        in="fibres"
        surfaceScale={depth}
        diffuseConstant="1.3"
        lightingColor="#fff"
        result="lit"
      >
        <feDistantLight azimuth="235" elevation="50" />
      </feDiffuseLighting>
      {/* fur × (0.55 + 0.5 × light) gives a soft sheen instead of a hard texture. */}
      <feComposite in="lit" in2="fuzzy" operator="arithmetic" k1="0.5" k2="0" k3="0.55" k4="0" />
    </filter>
  );
}

const fill = (id) => `url(#mascot-${id})`;

const ARM_X = { left: 62, right: 138 };

// Forearm that rises from behind the card; the parent clips it at the card edge.
function Arm({ side }) {
  const cx = ARM_X[side];
  return (
    <g className={`${styles.arm} ${styles[side]}`}>
      <rect
        x={cx - 17}
        y="176"
        width="34"
        height="130"
        rx="17"
        fill="url(#mascot-arm)"
        filter="url(#mascot-fur)"
      />
    </g>
  );
}

// Drawn outside the clip path so the paw can overlap the card edge or cover the eyes.
function Paw({ side }) {
  const cx = ARM_X[side];
  return (
    <g className={`${styles.arm} ${styles[side]}`}>
      <ellipse cx={cx} cy="172" rx="22" ry="19" fill={fill('paw')} filter="url(#mascot-fur)" />
      <g className={styles.fingers}>
        <path d={`M${cx - 10} 155.5 q-1.2 5 -0.4 9.5`} />
        <path d={`M${cx} 153.5 v10.5`} />
        <path d={`M${cx + 10} 155.5 q1.2 5 0.4 9.5`} />
      </g>
    </g>
  );
}

function ButtonEye({ cx, cy }) {
  return (
    <>
      <circle cx={cx} cy={cy} r="8" fill={fill('eye')} />
      <ellipse className={styles.glint} cx={cx - 2.8} cy={cy - 3} rx="2.6" ry="2" />
      <circle className={styles.glintSoft} cx={cx + 3} cy={cy + 3.2} r="1.1" />
    </>
  );
}

const NOSE = 'M89.5 106 Q100 100 110.5 106 Q109 114.5 100 117 Q91 114.5 89.5 106 Z';

/**
 * Decorative teddy bear that reacts to the login form.
 * @param {'idle'|'watching'|'peek'|'shy'|'thinking'|'happy'|'sad'} mood
 * @param {number} gaze 0 (left) to 1 (right): where the bear looks while watching.
 */
export default function Mascot({ mood = 'idle', gaze = 0 }) {
  return (
    <svg
      className={`${styles.mascot} ${styles[mood]}`}
      style={{ '--gaze': gaze }}
      viewBox="0 0 200 170"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="mascot-card-edge">
          <rect width="200" height="170" />
        </clipPath>

        <FurFilter
          id="mascot-fur"
          ruffle={{ frequency: 0.75, scale: 4.5 }}
          fibres="2.2 1.3"
          depth="1.2"
        />
        <FurFilter
          id="mascot-pile"
          ruffle={{ frequency: 1.1, scale: 2.2 }}
          fibres="3"
          depth="0.6"
        />

        {Object.entries(GRADIENTS).map(([id, gradient]) => (
          <RadialGradient key={id} id={id} {...gradient} />
        ))}

        {/* Dark edges and a light middle make the flat forearm look round. */}
        <linearGradient id="mascot-arm" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#6e421f" />
          <stop offset="0.4" stopColor="#c48d55" />
          <stop offset="1" stopColor="#74471f" />
        </linearGradient>

        {/* Thin stripes imitate the satin stitches of an embroidered nose. */}
        <pattern id="mascot-satin" width="1.5" height="10" patternUnits="userSpaceOnUse">
          <rect width="1.5" height="10" fill="#24150d" />
          <rect x="0.15" width="0.4" height="10" fill="#6b4a38" opacity="0.6" />
          <rect x="1.05" width="0.45" height="10" fill="#000" opacity="0.55" />
        </pattern>

        <radialGradient id="mascot-blush">
          <stop offset="0" stopColor="#e9877d" stopOpacity="0.7" />
          <stop offset="1" stopColor="#e9877d" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="mascot-shadow">
          <stop offset="0" stopColor="#2a160a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#2a160a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* The bear sits behind the card: nothing below its top edge shows except the paws. */}
      <g clipPath="url(#mascot-card-edge)">
        <ellipse cx="100" cy="200" rx="64" ry="54" fill={fill('body')} filter="url(#mascot-fur)" />
        <ellipse
          cx="100"
          cy="196"
          rx="32"
          ry="32"
          fill={fill('muzzle')}
          filter="url(#mascot-pile)"
        />
        <ellipse cx="100" cy="151" rx="50" ry="13" fill="url(#mascot-shadow)" />

        <g className={styles.head}>
          <g filter="url(#mascot-fur)">
            <circle cx="52" cy="46" r="20" fill={fill('ear')} />
            <circle cx="148" cy="46" r="20" fill={fill('ear')} />
            <circle cx="100" cy="90" r="59" fill={fill('head')} />
            {/* Wide cheeks give a bear-like face shape instead of a plain ball. */}
            <ellipse cx="66" cy="114" rx="27" ry="24" fill={fill('head')} />
            <ellipse cx="134" cy="114" rx="27" ry="24" fill={fill('head')} />
            <ellipse cx="100" cy="120" rx="40" ry="28" fill={fill('head')} />
          </g>
          <ellipse
            cx="54"
            cy="48"
            rx="11"
            ry="10.5"
            fill={fill('innerEar')}
            filter="url(#mascot-pile)"
          />
          <ellipse
            cx="146"
            cy="48"
            rx="11"
            ry="10.5"
            fill={fill('innerEar')}
            filter="url(#mascot-pile)"
          />

          <g className={styles.tufts}>
            <path d="M90 36 q3 -6 8 -3" />
            <path d="M99 34 q4 -6 9 -2" />
            <path d="M108 37 q4 -5 8 -1" />
          </g>

          <ellipse
            className={styles.blush}
            cx="63"
            cy="114"
            rx="12"
            ry="7"
            fill="url(#mascot-blush)"
          />
          <ellipse
            className={styles.blush}
            cx="137"
            cy="114"
            rx="12"
            ry="7"
            fill="url(#mascot-blush)"
          />

          {/* The muzzle sticks out, so it casts a soft shadow on the chin. */}
          <ellipse cx="100" cy="129" rx="30" ry="18" fill="url(#mascot-shadow)" />
          <ellipse
            cx="100"
            cy="121"
            rx="29"
            ry="21.5"
            fill={fill('muzzle')}
            filter="url(#mascot-pile)"
          />
          <ellipse className={styles.stitch} cx="100" cy="121" rx="25.5" ry="18" />

          <ellipse className={styles.socket} cx="78" cy="93" rx="12" ry="11" />
          <ellipse className={styles.socket} cx="122" cy="93" rx="12" ry="11" />

          {mood === 'happy' ? (
            <g className={styles.happyEyes}>
              <path d="M69 95 Q78 84 87 95" />
              <path d="M113 95 Q122 84 131 95" />
            </g>
          ) : (
            <g className={styles.eyes}>
              <g className={styles.pupils}>
                <ButtonEye cx={78} cy={92} />
                <ButtonEye cx={122} cy={92} />
              </g>
            </g>
          )}

          <path d={NOSE} fill="url(#mascot-satin)" />
          <path d={NOSE} fill={fill('noseShade')} />
          <ellipse className={styles.noseShine} cx="96.5" cy="105.5" rx="3.6" ry="1.6" />
          <path className={styles.thread} d="M100 117 V126" />
          <path className={`${styles.thread} ${styles.mouth}`} d={MOUTHS[mood]} />
        </g>

        <Arm side="left" />
        <Arm side="right" />
      </g>

      <Paw side="left" />
      <Paw side="right" />
    </svg>
  );
}
