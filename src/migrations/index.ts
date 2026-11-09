import * as migration_20261108_220356_initial from './20261108_220356_initial';
import * as migration_20261108_233357_realestate_v2 from './20261108_233357_realestate_v2';
import * as migration_20261109_002202_pro_features from './20261109_002202_pro_features';
import * as migration_20261109_014904_houzez_parity from './20261109_014904_houzez_parity';
import * as migration_20261109_021553_admin_designs from './20261109_021553_admin_designs';
import * as migration_20261109_201316_brand_colours from './20261109_201316_brand_colours';

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
    name: '20261109_014904_houzez_parity',
  },
  {
    up: migration_20261109_021553_admin_designs.up,
    down: migration_20261109_021553_admin_designs.down,
    name: '20261109_021553_admin_designs',
  },
  {
    up: migration_20261109_201316_brand_colours.up,
    down: migration_20261109_201316_brand_colours.down,
    name: '20261109_201316_brand_colours'
  },
];
