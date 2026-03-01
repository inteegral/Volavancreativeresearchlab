import svgPaths from "../../imports/svg-oxszzwhiss";

export function Logo({ className }: { className?: string }) {
  // The original viewBox was "0 0 1630 3368" but the content is centered around the middle.
  // We crop it to reduce whitespace.
  // Estimated bounds based on path data: X: ~350-1300, Y: ~900-1400
  // Using a viewBox that covers this area with some padding.
  return (
    <svg 
      viewBox="250 850 1130 600" 
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        {Object.values(svgPaths).map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}
