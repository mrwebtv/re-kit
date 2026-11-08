import * as migration_20261108_220356_initial from './20261108_220356_initial';
import * as migration_20261108_233357_realestate_v2 from './20261108_233357_realestate_v2';

export const migrations = [
  {
    up: migration_20261108_220356_initial.up,
    down: migration_20261108_220356_initial.down,
    name: '20261108_220356_initial',
  },
  {
    up: migration_20261108_233357_realestate_v2.up,
    down: migration_20261108_233357_realestate_v2.down,
    name: '20261108_233357_realestate_v2'
  },
];
