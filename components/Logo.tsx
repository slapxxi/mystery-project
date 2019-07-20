import { ComponentProps } from 'react';

interface Props extends ComponentProps<'svg'> {}

function Logo(props: Props) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <path
        d="M28.6 24.9c-.7-2.2-1.1-4.6-1-7C27.8 7.9 37 .7 37 .7s9 8.8 8.7 18.8a24.3 24.3 0 01-7 14.9l1 1.6s-10.3 8.5-20.2 7C9.5 41.5 3.6 30.6 3.6 30.6s10-9 19.9-7.4c1.8.2 3.5.8 5.1 1.7z"
        fill="#292534"
      />
      <path
        d="M35.8 32a34.4 34.4 0 0157.6 36.4l-13.3 31-1.6-34A34.4 34.4 0 0035.8 32z"
        fill="#fca6a7"
      />
      <path d="M45.7 99.3A34.4 34.4 0 1180 65v34.4H45.7z" fill="#ff6865" />
    </svg>
  );
}

export default Logo;
