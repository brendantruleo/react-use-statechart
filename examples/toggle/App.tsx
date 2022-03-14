import React from 'react';
import Statechart from '@corey.burrows/statechart';
import useStatechart from '../../src/useStatechart';

type Evt = {type: 'TOGGLE'};

const toggle = new Statechart<{}, Evt>({}, s => {
  s.state('off', s => {
    s.on('TOGGLE', '../on');
  });

  s.state('on', s => {
    s.on('TOGGLE', '../off');
  });
});

interface AppProps {}

const App: React.FC<AppProps> = ({}) => {
  const [state, send] = useStatechart(toggle, {trace: true, inspect: true});

  return (
    <div>
      <button
        onClick={() => {
          send({type: 'TOGGLE'});
        }}>
        TOGGLE
      </button>
      <p>{state.matches('/on') ? 'On' : 'Off'}</p>
    </div>
  );
};

export default App;
