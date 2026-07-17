// Bandhan Bank mark — a red gradient disc with a white leaf/flame negative
// space. Rendered as inline SVG so it stays crisp at any size and inherits no
// external assets. Pass a unique `id` when several logos share a page so their
// gradient defs don't collide.
export default function BandhanLogo({ size = 44, id = "bbLogo", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Bandhan Bank" style={style}>
      <defs>
        <linearGradient id={id} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F1583B" />
          <stop offset="55%" stopColor="#DA2824" />
          <stop offset="100%" stopColor="#A81616" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill={`url(#${id})`} />
      {/* white leaf */}
      <path d="M50 13 C 31 30 31 68 50 87 C 69 68 69 30 50 13 Z" fill="#fff" />
      {/* red central vein splits the leaf into two petals */}
      <path d="M50 17 C 44 40 44 60 50 83 C 56 60 56 40 50 17 Z" fill={`url(#${id})`} />
    </svg>
  );
}
