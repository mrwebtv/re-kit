import * as migration_20261108_220356_initial from './20261108_220356_initial';
import * as migration_20261108_233357_realestate_v2 from './20261108_233357_realestate_v2';
import * as migration_20261109_002202_pro_features from './20261109_002202_pro_features';
import * as migration_20261109_014904_houzez_parity from './20261109_014904_houzez_parity';

export const migrations = [
  {
    up: migration_20261108_220356_initial.up,
    down: migration_20261108_220356_initial.down,
    name: '20261108_220356_initial',
  },
  {
    up: migration_20261108_233357_realestate_v2.up,
    down: migration_20261108_233357_realestate_v2.down,
    name: '20261108_233357_realestate_v2',
  },
  {
    up: migration_20261109_002202_pro_features.up,
    down: migration_20261109_002202_pro_features.down,
    name: '20261109_002202_pro_features',
  },
  {
    up: migration_20261109_014904_houzez_parity.up,
    down: migration_20261109_014904_houzez_parity.down,
    name: '20261109_014904_houzez_parity'
  },
];
