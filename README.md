# useStatechart

`useStatechart` is a React hook that allows you to use a [`Statechart`](https://github.com/burrows/statechart)
to maintain the state of a component.

## Installation

```
npm install @corey.burrows/react-use-statechart
```

## Usage

```typescript
import React from 'react';
import Statechart from '@corey.burrows/statechart';
import useStatechart from '@corey.burrows/react-use-statechart';

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
  const [state, send] = useStatechart(toggle);

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
```

## License

useStatechart is [MIT licensed](./LICENSE).
