import { useRef } from 'react';

function useLock(init: boolean = false): any[] {
  const lockRef: any = useRef<boolean>(init);

  const isLocking = (): boolean => lockRef.current === true;

  const updateLock = (bool: boolean): void => {
    lockRef.current = bool;
  };

  return [isLocking, updateLock];
}

export default useLock;
