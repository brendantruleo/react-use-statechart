import {useCallback, useEffect, useState} from 'react';
import Statechart, {Event, State, SendFn} from '@corey.burrows/statechart';

const useStatechart = <C, E extends Event>(
  statechart: Statechart<C, E>,
): [State<C, E>, SendFn<E>] => {
  const [state, setState] = useState(statechart.initialState);

  const send = useCallback(
    (evt: E): void => {
      setState(state => statechart.send(state, evt));
    },
    [setState],
  );

  useEffect(() => {
    state.activities.start.forEach(a => a.start(send));
    state.activities.stop.forEach(a => a.stop());
    state.actions.forEach(a => {
      if ('exec' in a) {
        a.exec(send);
      } else {
        a(send);
      }
    });
  }, [state]);

  return [state, send];
};

export default useStatechart;
