import {Renderer, Scene} from 'three';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  DependencyList,
} from 'react';
import * as option from 'fp-ts/lib/Option';
import {UseFrameCallback} from './canvas';
import {map} from './scene/map';

export const defaultProps = {
  subscribers: [],
  scene: option.some(new Scene()),
};

export type RendererProps = {
  renderer: option.Option<Renderer>;
} & typeof defaultProps;

export declare type RendererContext = {
  subscribers: Array<UseFrameCallback>;
  scene: option.Option<Scene>;
};

export const RendererContext = createContext<RendererContext>({
  ...defaultProps,
  scene: option.some(new Scene()),
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
  const {subscribers} = useContext(RendererContext);
  const [timeFrame, setTimeFrame] = useState(0);

  const animate = (cb: UseFrameCallback) => (t: number) => {
    const delta = timeFrame ? (t - timeFrame) / 1000 : 0;
    var i = subscribers.length;
    while (i--) {
      subscribers[i]({delta: delta});
    }
    cb({delta});
    setTimeFrame(t);
  };
  return {
    animate: (cb: UseFrameCallback) => requestAnimationFrame(animate(cb)),
    endAnimate: () => cancelAnimationFrame(requestId.current),
    timeFrame,
    subscribers,
  };
};
export const useRender = (cb: UseFrameCallback, deps: DependencyList = []) => {
  const {animate, endAnimate, timeFrame} = useAnimationFrame();
  useEffect(() => {
    animate(cb);
    return () => {
      endAnimate();
    };
  }, [timeFrame]);

  return {
    animate: () => animate(cb),
  };
};

export const useRendererScene = (cb: (scene: Scene) => void = () => {}) => {
  const {scene} = useContext(RendererContext);
  useEffect(() => {
    map(scene)(cb);
  }, [scene]);
  return {
    scene,
    isSome: option.isSome(scene),
  };
};
