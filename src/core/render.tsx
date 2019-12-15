import {Renderer} from 'three';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import * as option from 'fp-ts/lib/Option';
import {useCanvas, UseFrameCallback} from './canvas';

export const defaultProps = {
  subscribers: [],
};

export type RendererProps = {
  renderer: option.Option<Renderer>;
} & typeof defaultProps;

export declare type RendererContext = {
  subscribers: Array<UseFrameCallback>;
};

export const RendererContext = createContext<RendererContext>({
  ...defaultProps,
});

export const useFrame = (cb: UseFrameCallback, deps: any[] = []) => {
  const {subscribers} = useContext(RendererContext);
  useEffect(() => {
    subscribers.push(cb);
    return () => {
      const index = subscribers.findIndex(c => c === cb);
      subscribers.splice(index, 1);
    };
  }, [deps]);
};
export const useAnimationFrame = () => {
  const requestId = useRef<number>(0);
  const timeRef = useRef(0);
  const {subscribers} = useContext(RendererContext);
  const [timeFrame, setTimeFrame] = useState(0);
  const animate = (cb: UseFrameCallback) => (t: number) => {
    const delta = timeRef.current ? (t - timeRef.current) / 1000 : 0;
    timeRef.current = t;
    subscribers.forEach((sub, index) => {
      sub({delta});
    });
    cb({delta});
    setTimeFrame(t);
  };
  return {
    animate: (cb: UseFrameCallback) => requestAnimationFrame(animate(cb)),
    endAnimate: () => cancelAnimationFrame(requestId.current),
    timeFrame,
  };
};
export const useRender = (cb: UseFrameCallback) => {
  const {animate, endAnimate, timeFrame} = useAnimationFrame();
  const {subscribers} = useContext(RendererContext);
  useEffect(() => {
    animate(cb);
    subscribers.slice(0, subscribers.length);
    return () => {
      endAnimate();
    };
  }, [timeFrame]);
};
