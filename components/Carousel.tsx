/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { AppTheme } from '@self/lib/types';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';

interface Context {
  numberOfSlides: number;
  currentSlide: number;
}

interface State {
  states: {
    showing: {};
    changing: {};
  };
}

type Event = { type: 'CHANGE_SLIDE'; payload: number };

interface Props {
  assets: string[];
}

let carouselMachine = Machine<Context, State, Event>({
  id: 'carousel',
  initial: 'showing',
  context: {
    numberOfSlides: null,
    currentSlide: null,
  },
  states: {
    showing: {
      on: {
        CHANGE_SLIDE: { target: 'changing', cond: 'inBoundaries' },
      },
    },
    changing: {
      invoke: {
        src: 'changeSlide',
        onDone: { target: 'showing', actions: ['setSlide'] },
      },
    },
  },
});

function Carousel(props: Props) {
  let { assets } = props;
  let [state, send] = useMachine(carouselMachine, {
    context: { numberOfSlides: assets.length, currentSlide: 0 },
    actions: { setSlide },
    services: { changeSlide },
    guards: { inBoundaries },
  });

  function inBoundaries(context: Context, event: Event) {
    return context.numberOfSlides - 1 >= event.payload;
  }

  function setSlide(context: Context, event: any) {
    context.currentSlide = event.data;
  }

  function changeSlide(context: Context, event: Event) {
    return new Promise((res) => {
      res(event.payload);
    });
  }

  return (
    <div>
      <img src={assets[state.context.currentSlide]} alt="" css={imageStyles} />
      <ul css={listStyles}>
        {assets.map((asset, index) => (
          <li css={listItemStyles} key={`${asset}+${index}`}>
            <input
              id={`image-${index}`}
              type="radio"
              name="image"
              defaultChecked={state.context.currentSlide === index}
              onChange={() => send('CHANGE_SLIDE', { payload: index })}
              css={inputStyles}
            />
            <label htmlFor={`image-${index}`} css={labelStyles}>
              <img src={asset} alt="Image" key={index} css={imageStyles} />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

const listStyles = css`
  display: flex;
  padding: 0;
  margin: 0;
  list-style: none;
`;

const listItemStyles = css`
  flex: 1 auto;
`;

const imageStyles = css`
  width: 100%;
`;

const inputStyles = (theme: AppTheme) => css`
  display: none;

  &[checked] + label {
    border-color: ${theme.colors.textEm};
  }
`;

const labelStyles = css`
  display: inline-block;
  line-height: 0;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
`;

export default Carousel;
