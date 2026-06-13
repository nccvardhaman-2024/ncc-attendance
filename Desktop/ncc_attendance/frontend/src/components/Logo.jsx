import logoImage from '../assets/ncc-vardhaman-logo.png';

export default function Logo({ className = 'h-10 w-10', muted = false, decorative = true }) {
  return (
    <div className={className}>
      <img
        src={logoImage}
        alt={decorative ? '' : 'NCC Vardhaman logo'}
        className={`h-full w-full rounded-full object-contain ${muted ? 'grayscale' : ''}`}
        aria-hidden={decorative}
      />
    </div>
  );
}
