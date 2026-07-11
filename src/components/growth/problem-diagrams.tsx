/*
  The three explanatory diagrams from the "Why Startups Don't Grow" section,
  drawn as inline SVG so they stay crisp and scale down cleanly on mobile.
*/

const INK = '#1c1710'
const CREAM = '#f7f1de'
const GRAY = '#747474'
const caslon = { fontFamily: 'var(--font-caslon)' }
const fellItalic = { fontFamily: 'var(--font-fell)', fontStyle: 'italic' }

type BoxProps = {
  x: number
  y: number
  w: number
  h?: number
  variant: 'dashed' | 'solid' | 'filled'
  title: string
  sub: string
}

function DiagramBox({ x, y, w, h = 65, variant, title, sub }: BoxProps) {
  const filled = variant === 'filled'
  const cx = x + w / 2
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={filled ? INK : CREAM}
        stroke={INK}
        strokeWidth={1}
        strokeDasharray={variant === 'dashed' ? '4 3' : undefined}
      />
      <text
        x={cx}
        y={y + h / 2 - 3}
        textAnchor="middle"
        style={caslon}
        fontSize={16}
        fill={filled ? CREAM : INK}
      >
        {title}
      </text>
      <text
        x={cx}
        y={y + h / 2 + 16}
        textAnchor="middle"
        style={fellItalic}
        fontSize={14}
        fill={GRAY}
      >
        {sub}
      </text>
    </g>
  )
}

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0,0 L10,5 L0,10 z" fill={INK} />
      </marker>
    </defs>
  )
}

/* Row 1 — Channel / System / Operator stack. */
export function ChannelsDiagram() {
  const boxW = 200
  const x = 40
  return (
    <svg
      viewBox="0 0 446 330"
      className="h-auto w-full"
      role="img"
      aria-label="Channel is temporary and rented, System is engineered, Operator is decisive"
    >
      <ArrowDefs />
      <DiagramBox
        x={x}
        y={0}
        w={boxW}
        variant="dashed"
        title="Channel"
        sub="( temporary )"
      />
      <DiagramBox
        x={x}
        y={131}
        w={boxW}
        variant="filled"
        title="System"
        sub="(Engineered)"
      />
      <DiagramBox
        x={x}
        y={262}
        w={boxW}
        variant="solid"
        title="Operator"
        sub="(Decisive)"
      />

      <line
        x1={x + boxW / 2}
        y1={65}
        x2={x + boxW / 2}
        y2={126}
        stroke={INK}
        strokeWidth={1.2}
        markerEnd="url(#arrow)"
      />
      <line
        x1={x + boxW / 2}
        y1={196}
        x2={x + boxW / 2}
        y2={257}
        stroke={INK}
        strokeWidth={1.2}
        markerEnd="url(#arrow)"
      />

      {[
        { y: 32, label: 'Rented' },
        { y: 163, label: 'Engine' },
        { y: 294, label: 'Human' },
      ].map((row) => (
        <g key={row.label}>
          <line
            x1={x + boxW}
            y1={row.y}
            x2={x + boxW + 100}
            y2={row.y}
            stroke={INK}
            strokeWidth={1}
            strokeDasharray="4 3"
          />
          <text
            x={x + boxW + 108}
            y={row.y + 5}
            style={fellItalic}
            fontSize={18}
            fill={INK}
          >
            {row.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

/* Row 2 — Research / Distribute / Convert / Measure cycle. */
export function CycleDiagram() {
  const cx = 248
  const cy = 172
  return (
    <svg
      viewBox="0 0 497 344"
      className="h-auto w-full"
      role="img"
      aria-label="The growth system cycle: Research, Distribute, Convert, Measure"
    >
      <ArrowDefs />
      {/* dashed orbit */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={165}
        ry={110}
        fill="none"
        stroke={GRAY}
        strokeWidth={1}
        strokeDasharray="5 5"
      />
      {/* directional arrowheads on the orbit */}
      <path d="M 413 150 l 0 0" />
      <polygon points="418,120 428,132 412,134" fill={INK} />
      <polygon points="250,285 236,278 236,292" fill={INK} />
      <polygon points="78,150 68,138 84,136" fill={INK} />

      <DiagramBox
        x={148}
        y={23}
        w={200}
        variant="filled"
        title="Research"
        sub="(Find Truth)"
      />
      <DiagramBox
        x={148}
        y={256}
        w={200}
        variant="solid"
        title="Convert"
        sub="(Drive Action)"
      />
      <DiagramBox
        x={0}
        y={132}
        w={150}
        variant="solid"
        title="Measure"
        sub="(Feedback)"
      />
      <DiagramBox
        x={347}
        y={132}
        w={150}
        variant="solid"
        title="Distribute"
        sub="(Create Reach)"
      />

      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        style={caslon}
        fontSize={16}
        fill={GRAY}
      >
        The
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        style={caslon}
        fontSize={16}
        fill={GRAY}
      >
        Growth
      </text>
      <text
        x={cx}
        y={cy + 28}
        textAnchor="middle"
        style={caslon}
        fontSize={16}
        fill={GRAY}
      >
        System
      </text>
    </svg>
  )
}

/* Row 3 — Compound growth vs. campaign spike chart. */
export function CompoundChart() {
  return (
    <svg
      viewBox="0 0 467 344"
      className="h-auto w-full"
      role="img"
      aria-label="Compound growth curve rising exponentially versus a flat campaign spike"
    >
      <ArrowDefs />
      {/* axes */}
      <line
        x1={25}
        y1={324}
        x2={25}
        y2={13}
        stroke={INK}
        strokeWidth={1.4}
        markerEnd="url(#arrow)"
      />
      <line
        x1={25}
        y1={324}
        x2={442}
        y2={324}
        stroke={INK}
        strokeWidth={1.4}
        markerEnd="url(#arrow)"
      />
      {/* gridlines */}
      <line
        x1={25}
        y1={96}
        x2={436}
        y2={96}
        stroke={GRAY}
        strokeWidth={0.8}
        strokeDasharray="4 4"
      />
      <line
        x1={25}
        y1={196}
        x2={436}
        y2={196}
        stroke={GRAY}
        strokeWidth={0.8}
        strokeDasharray="4 4"
      />
      {/* x ticks */}
      {[135, 272, 409].map((tx) => (
        <line
          key={tx}
          x1={tx}
          y1={324}
          x2={tx}
          y2={332}
          stroke={INK}
          strokeWidth={1}
        />
      ))}
      {/* y ticks */}
      <line x1={22} y1={96} x2={29} y2={96} stroke={INK} strokeWidth={1} />
      <line x1={22} y1={196} x2={29} y2={196} stroke={INK} strokeWidth={1} />

      {/* campaign spike (dashed, flat) */}
      <path
        d="M 26 312 C 120 300, 180 268, 260 262 C 330 258, 390 258, 434 258"
        fill="none"
        stroke={GRAY}
        strokeWidth={1.4}
        strokeDasharray="5 4"
      />
      {/* compound growth (solid, exponential) */}
      <path
        d="M 26 314 C 180 306, 300 270, 436 54"
        fill="none"
        stroke={INK}
        strokeWidth={1.6}
      />

      <text x={356} y={52} style={caslon} fontSize={20} fill={INK}>
        Compound
      </text>
      <text x={356} y={76} style={caslon} fontSize={20} fill={INK}>
        Growth
      </text>
      <text x={367} y={244} style={fellItalic} fontSize={15} fill={GRAY}>
        Campaign spike
      </text>
      <text
        x={16}
        y={230}
        style={caslon}
        fontSize={15}
        fill={INK}
        transform="rotate(-90 16 230)"
      >
        Business Impact
      </text>
      <text x={410} y={340} style={caslon} fontSize={15} fill={INK}>
        Time
      </text>
    </svg>
  )
}
