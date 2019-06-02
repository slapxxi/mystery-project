function BurgerIcon(props) {
  return (
    <svg viewBox="0 0 10 10" {...props}>
      <rect width="10" height="2" rx="1" />
      <rect y="4" width="10" height="2" rx="1" />
      <rect y="8" width="10" height="2" rx="1" />
    </svg>
  );
}

export default BurgerIcon;
