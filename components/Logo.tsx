import { ComponentProps } from 'react';

interface Props extends ComponentProps<'svg'> {}

function Logo(props: Props) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <path d="M14.4 49.5l7 7a2 2 0 0 1 .7 1.4v33.6h-7.7v-42zm71.3 0l-7.1 7a2 2 0 0 0-.6 1.4v33.6h7.7v-42z" />
      <path d="M0 12l54 53.7a1 1 0 0 1-.7 1.7h-7.7a2 2 0 0 1-1.4-.5L7.7 30.4v61H0V12zm93.3-3.3l-10-.1A2 2 0 0 0 82 9L56.4 34.7a2 2 0 0 0 0 2.8l2.7 2.6a2 2 0 0 0 2.8 0L93.3 8.7z" />
      <path d="M59.3 50.2a2 2 0 0 0 2.8 0L100 12.5v79h-7.7V31L62.8 60.4a3 3 0 0 1-4.2 0L6.6 8.5h10.2c.5 0 1 .2 1.4.6l41 41.1z" />
    </svg>
  );
}

export default Logo;
