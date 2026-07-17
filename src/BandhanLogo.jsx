// Bandhan Bank logo (the actual brand mark added to the repo, served from
// /public). Rendered as an <img> so it stays crisp and needs no inline data.
export default function BandhanLogo({ size = 44, style }) {
  return (
    <img
      src="/bandhan-logo.png"
      alt="Bandhan Bank"
      width={size}
      height={size}
      style={{ display: "block", objectFit: "contain", flexShrink: 0, ...style }}
    />
  );
}
