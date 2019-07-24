/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { MutableRefObject, useRef } from 'react';

interface Props {
  children?: React.ReactNode;
}

const header = css`
  transition: all 0.3s;
`;

const container = css`
  width: 300px;
  height: 300px;
  perspective: 500px;
`;

const card = css`
  box-sizing: border-box;
  display: flex;
  height: 300px;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 40px hsla(200, 50%, 50%, 0.8),
    1px 1px 10px 10px rgba(100, 0, 0, 0.2) inset;
  border-radius: 10px;
  background: white;
  background-image: url('/static/img/camping-2x.webp'), url('/static/img/camping.jpg');
  background-position: center;
  background-size: cover;
  font-size: 32px;
  font-weight: bold;
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-style: preserve-3d;
  will-change: transform;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.9);
  color: white;
`;

function TiltCard(props: Props) {
  let cardRef = useRef<HTMLDivElement>();
  let { children } = props;

  /**
   * Lower is *more* sensitive.
   */
  const SENSITIVITY = 20;

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (cardRef.current) {
      let container = event.currentTarget;
      let cardElement = cardRef.current;
      let containerRect = container.getBoundingClientRect();

      let transformOrigin = {
        x: containerRect.left + container.offsetWidth / 2,
        y: containerRect.top + container.offsetHeight / 2,
      };

      let pointerPosition = {
        x: event.clientX,
        y: event.clientY,
      };

      let angle = {
        x: (transformOrigin.y - pointerPosition.y) / SENSITIVITY,
        y: (transformOrigin.x - pointerPosition.x) / -SENSITIVITY,
      };

      cardElement.style.transform = `rotateX(${angle.x}deg) rotateY(${angle.y}deg)`;
    }
  }

  function handleReset() {
    if (cardRef.current) {
      cardRef.current.style.transform = 'none';
    }
  }

  return (
    <div css={container} onMouseMove={handlePointerMove} onMouseLeave={handleReset}>
      <div css={card} ref={cardRef as MutableRefObject<HTMLDivElement>}>
        {children}
      </div>
    </div>
  );
}

export default TiltCard;
