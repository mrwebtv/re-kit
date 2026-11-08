import * as migration_20261108_220356_initial from './20261108_220356_initial';

export const migrations = [
  {
    up: migration_20261108_220356_initial.up,
    down: migration_20261108_220356_initial.down,
    name: '20261108_220356_initial'
  },
];
