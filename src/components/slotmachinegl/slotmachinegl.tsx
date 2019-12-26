import * as option from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';
import React, {useEffect, useState} from 'react';
import {useCamera} from '../../core/camera';
import {useFrame, useRendererScene} from '../../core/render';
import {UseFrameCallback} from '../../core/canvas';
import {MeshComponent} from '../../core/components/Object3D';
import {
  Camera,
  Math,
  Object3D,
  Vector3,
  SphereBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  SphereGeometry,
  Sphere,
} from 'three';
import addOption from '../../core/scene/addOption';
import removeOption from '../../core/scene/removeOptions';

export interface WheelProps {
  index: number;
  goTo: {
    numberOfTurn: number;
    value: number;
  };
  size?: number;
  value?: number;
  onFinish?: (value: number) => void;
  finished: boolean;
  rolling: boolean;
  loading: boolean;
}
export type GoTo =
  | {
      numberOfTurn: number;
      value: number;
    }
  | false;
type UseRowProps = {
  row: option.Option<THREE.Object3D>;
  goTo: GoTo;
  rolling: boolean;
  loading: boolean;
} & WheelProps;

const useRow = ({
  row: someRow,
  goTo,
  value,
  onFinish,
  rolling,
  loading,
}: UseRowProps) => {
  const symbols = [
    1.16785,
    0.90785,
    0.60785,
    0.30785,
    0.02785,
    -0.27215,
    -0.54215,
    -0.85215,
  ];
  const lastSymbol = () => {
    return symbols[symbols.length - 1];
  };
  const [turn, setTurn] = useState(0);
  const [symbol, setSymbol] = useState(0);
  const [finished, setFinished] = useState(false);
  useFrame(() => {
    pipe(
      someRow,
      option.fold(
        () => {},
        row => {
          const speed = 2 * 0.005;
          const updateOnce = () => {
            if (row.position.y <= lastSymbol()) {
              row.position.y = symbols[0];
              setTurn(turn + 1);
              setSymbol(0);
            }
            if (row.position.y <= symbols[symbol + 1]) {
              row.position.y = symbols[symbol + 1];
              setSymbol(symbol + 1);
            }
            row.position.y -= speed;
          };
          if (loading || rolling) {
            console.log('rolling');
            updateOnce();
          }

          if (
            turn === goTo.numberOfTurn &&
            symbol === goTo.value &&
            goTo.numberOfTurn !== 0 &&
            rolling
          ) {
            setFinished(true);
          }
          if (finished) {
            if (onFinish) {
              onFinish(goTo.value);
            }
            setTurn(0);
            setSymbol(0);
            setFinished(false);
          }
        },
      ),
    );
  });
  useEffect(() => {
    if (rolling || loading) {
      setTurn(0);
      setSymbol(0);
    }
  }, [rolling, loading]);
  useEffect(() => {
    pipe(
      someRow,
      option.map(row => {
        row.position.y = symbols[value ? value : 0];
      }),
    );
  }, [loading, rolling, value, option.isSome(someRow)]);
};

const Row = ({
  row: someRow,
  wheel: {goTo, value, onFinish, rolling, loading},
}: {
  row: option.Option<THREE.Object3D>;
  wheel: WheelProps;
}) => {
  const symbols = [
    1.16785,
    0.90785,
    0.60785,
    0.30785,
    0.02785,
    -0.27215,
    -0.54215,
    -0.85215,
  ];
  const lastSymbol = () => {
    return symbols[symbols.length - 1];
  };
  const [turn, setTurn] = useState(0);
  const [symbol, setSymbol] = useState(0);
  const [rollInBetween, setRollInBetween] = useState(0);
  const speed = 0.07;
  const rollAtSpeed = (speed: number) => {
    pipe(
      someRow,
      option.map(row => {
        if (row.position.y <= lastSymbol()) {
          row.position.y = symbols[0] - speed;
          setTurn(turn + 1);
          setSymbol(0);
          setRollInBetween(0);
          return;
        }
        if (row.position.y < symbols[symbol + 1]) {
          row.position.y = symbols[symbol + 1] - speed;
          setSymbol(symbol + 1);
          setRollInBetween(0);
          return;
        }
        row.position.y -= speed;
        setRollInBetween(rollInBetween - speed);
      }),
    );
  };
  const isFinish = () => turn >= goTo.numberOfTurn && symbol === goTo.value;
  const animateRolling: UseFrameCallback = ({delta}) =>
    pipe(
      someRow,
      option.fold(
        () => {},
        row => {
          if (rolling && !loading) {
            if (isFinish()) {
              if (onFinish) {
                onFinish(goTo.value);
                row.position.y = symbols[goTo.value];
              }
              return;
            }
            if (rolling) {
              rollAtSpeed(speed);
            }
          }
        },
      ),
    );
  const loadingAnimation: UseFrameCallback = ({delta}) => {
    if (loading && !rolling) {
      rollAtSpeed(speed);
    }
  };
  /*   useEffect(() => {
    if (rolling) {
      requestAnimationFrame(animateRolling);
    }
  }, [rolling, rollInBetween]);

  useEffect(() => {
    if (loading) {
      requestAnimationFrame(loadingAnimation);
    }
  }, [loading, rollInBetween]); */
  useFrame(loadingAnimation, [loading]);
  useFrame(animateRolling, [rolling]);
  useEffect(() => {
    if (rolling) {
      setTurn(0);
    }
  }, [rolling]);
  useEffect(() => {
    pipe(
      someRow,
      option.map(row => {
        row.position.y = symbols[value ? value : 0];
      }),
    );
  }, [value, option.isSome(someRow)]);
  return <MeshComponent object={someRow} />;
};
const initNotZoomed = (c: Camera) => {
  c.position.z = 0.83;
  c.position.x = -0.04;
  c.position.y = 0.25;
  c.rotation.x = Math.degToRad(5);
  c.updateMatrixWorld();
};
export interface SlotMachineProps {
  wheels: WheelProps[];
  getObjectByName: (name: string) => option.Option<Object3D>;
}
export const SlotMachineGL = ({wheels, getObjectByName}: SlotMachineProps) => {
  useCamera(initNotZoomed);
  return (
    <>
      <MeshComponent object={getObjectByName('SlotMachine')} />
      <MeshComponent object={getObjectByName('Background')} />
      <Button object={getObjectByName('Empty')} />
      {[
        getObjectByName('Row1'),
        getObjectByName('Row2'),
        getObjectByName('Row3'),
      ].map((r, index) => {
        return <Row row={r} wheel={wheels[index]} />;
      })}
    </>
  );
};

export const Button = ({object}: {object: option.Option<Object3D>}) => {
  const {scene} = useRendererScene();
  const [sphere] = useState(
    new Mesh(
      new SphereGeometry(0.1, 32, 32),
      new MeshBasicMaterial({color: 0xffff00}),
    ),
  );
  useEffect(() => {
    pipe(
      object,
      option.map(o => {
        const vector = o.position.clone();
        sphere.position.x = vector.x;
        sphere.position.y = vector.y;
        sphere.position.y = vector.z;
        addOption(scene)(option.some(sphere));
      }),
    );
    addOption(scene)(object);
    return () => {
      removeOption(scene)(object);
      removeOption(scene)(option.some(sphere));
    };
  }, [scene, object]);
  return <></>;
};
