import { useCallback, useEffect, useRef, useState } from "react";
import Statechart, { Event, State, SendFn } from "@corey.burrows/statechart";

export interface UseStatechartOpts {
  trace?: boolean;
  inspect?: boolean;
  clear?: boolean;
}

const inspect = (
  statechart: Statechart<any, any>,
  state: State<any, any>
): void => {
  console.info(statechart.inspect(state));
};

const trace = (
  event: Event | null,
  from: State<any, any> | null,
  to: State<any, any>
): void => {
  const e = event ? event.type : "__init__";
  const f = from ? JSON.stringify(from.current.map((n) => n.path)) : "(null)";
  const t = JSON.stringify(to.current.map((n) => n.path));
  console.info(`[${e}]: ${f} -> ${t}`);
};

const useStatechart = <C, E extends Event>(
  statechart: Statechart<C, E>,
  opts: UseStatechartOpts = {}
): [State<C, E>, SendFn<E>] => {
  const [state, setState] = useState(statechart.initialState);
  const eventRef = useRef<Event | null>(null);
  const stateRef = useRef<State<any, any> | null>(null);

  const send = useCallback(
    (evt: E): void => {
      eventRef.current = evt;
      setState((state) => {
        state.activities.start.forEach((a) => a.start(send));
        state.activities.stop.forEach((a) => a.stop());
        state.actions.forEach((a) => {
          if ("exec" in a) {
            a.exec(send);
          } else {
            a(send);
          }
        });

        if (opts.clear) console.clear();
        if (opts.trace) trace(eventRef.current, stateRef.current, state);
        if (opts.inspect) inspect(statechart, state);

        stateRef.current = state;
        return statechart.send(state, evt);
      });
    },
    [setState]
  );

  useEffect(() => {
    return () => {
      if (stateRef.current) {
        const nextState = statechart.stop(stateRef.current);
        nextState.activities.stop.forEach((a) => a.stop());
        nextState.actions.forEach((a) => {
          if ("exec" in a) {
            a.exec(send);
          } else {
            a(send);
          }
        });
      }
    };
  }, []);

  return [state, send];
};

export default useStatechart;
