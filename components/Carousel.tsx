/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { AppTheme } from '@self/lib/types';
import { useMachine } from '@xstate/react';
import { useEffect } from 'react';
import { assign, Machine } from 'xstate';

interface Context {
  numberOfSlides: number;
  currentSlide: number;
}

interface State {
  states: {
    idle: {};
    changing: {};
  };
}

type Event =
  | { type: 'CHANGE_SLIDE'; payload: number }
  | { type: 'NEXT_SLIDE' }
  | { type: 'PREV_SLIDE' };

interface Props {
  assets: string[];
}

let carouselMachine = Machine<Context, State, Event>({
  id: 'carousel',
  initial: 'idle',
  context: {
    numberOfSlides: null,
    currentSlide: null,
  },
  states: {
    idle: {
      on: {
        NEXT_SLIDE: { target: 'changing' },
        PREV_SLIDE: { target: 'changing' },
        CHANGE_SLIDE: { target: 'changing', cond: 'inBoundaries' },
      },
    },
    changing: {
      invoke: {
        src: 'changeSlide',
        onDone: {
          target: 'idle',
          actions: assign({ currentSlide: (_context, event) => event.data }),
        },
      },
    },
  },
});

function Carousel(props: Props) {
  let { assets } = props;
  let [state, send] = useMachine(carouselMachine, {
    context: { numberOfSlides: assets.length, currentSlide: 0 },
    services: { changeSlide },
    guards: { inBoundaries },
  });
  let { currentSlide } = state.context;

  useEffect(() => {
    function keyboardListener(event: KeyboardEvent) {
      switch (event.key) {
        case 'ArrowRight':
          return send('NEXT_SLIDE');
        case 'ArrowLeft':
          return send('PREV_SLIDE');
        default:
          return;
      }
    }

    window.addEventListener('keydown', keyboardListener);
    return () => window.removeEventListener('keydown', keyboardListener);
  }, []);

  function handleClick(index: number) {
    send('CHANGE_SLIDE', { payload: index });
  }

  return (
    <div>
      <div css={viewportStyles}>
        <ul
          css={[
            slidesStyles,
            css`
              transform: translate(
                ${currentSlide === 0 ? '0' : `-${currentSlide * 100}%`}
              );
            `,
          ]}
        >
          {assets.map((asset, index) => (
            <li key={index}>
              <img src={asset} alt="slide" />
            </li>
          ))}
        </ul>
      </div>
      <ul css={listStyles}>
        {assets.map((asset, index) => (
          <li css={listItemStyles} key={`${index}`}>
            <input
              id={`slide-${index}`}
              type="radio"
              name="slide"
              defaultChecked={currentSlide === index}
              onClick={() => handleClick(index)}
              css={inputStyles}
            />
            <label htmlFor={`slide-${index}`} css={labelStyles}>
              <img src={asset} alt="Image" css={imageStyles} />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

const viewportStyles = css`
  overflow-x: hidden;
`;

const slidesStyles = css`
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
  transition: transform 0.3s ease-out;

  & > li {
    flex: 1 0 100%;

    & > img {
      width: 100%;
    }
  }
`;

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

function changeSlide(context: Context, event: Event) {
  let { numberOfSlides, currentSlide } = context;

  return new Promise((res, rej) => {
    switch (event.type) {
      case 'NEXT_SLIDE':
        return res((currentSlide + 1 + numberOfSlides) % numberOfSlides);
      case 'PREV_SLIDE':
        return res((currentSlide - 1 + numberOfSlides) % numberOfSlides);
      case 'CHANGE_SLIDE':
        return res(event.payload);
      default:
        return rej('Unknown event');
    }
  });
}

function inBoundaries(context: Context, event: Event) {
  if (event.type === 'CHANGE_SLIDE') {
    return context.numberOfSlides - 1 >= event.payload;
  }
}

export default Carousel;
