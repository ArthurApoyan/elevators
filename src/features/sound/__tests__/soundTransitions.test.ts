import { getElevatorSoundEvents } from '../soundTransitions';

test('moving to doorsOpen plays arrival and doorOpen', () => {
  const events = getElevatorSoundEvents(
    { id: 'e1', status: 'moving' },
    { id: 'e1', status: 'doorsOpen' }
  );
  expect(events).toEqual(['arrival', 'doorOpen']);
});

test('doorsOpen to moving plays doorClose', () => {
  const events = getElevatorSoundEvents(
    { id: 'e1', status: 'doorsOpen' },
    { id: 'e1', status: 'moving' }
  );
  expect(events).toEqual(['doorClose']);
});
