import format from 'date-fns/format';

interface Props {
  date: Date | string;
}

function ReadableDate(props: Props) {
  let { date, ...rest } = props;
  return <time {...rest}>{format(new Date(date), 'MMMM dd, y', {})}</time>;
}

export default ReadableDate;
