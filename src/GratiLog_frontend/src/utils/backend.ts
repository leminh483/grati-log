import { HttpAgent, Identity } from '@dfinity/agent';
import { createActor as createBackendActor, canisterId as defaultCanisterId } from '../declarations/GratiLog_backend';

const canisterId = process.env.CANISTER_ID_GRATILOG_BACKEND || defaultCanisterId;

export const createActor = (identity?: Identity) => {
  const agent = new HttpAgent({
    host: process.env.DFX_NETWORK === 'ic' ? 'https://ic0.app' : 'http://localhost:4943',
    identity,
  });

  // Only fetch root key in development
  if (process.env.DFX_NETWORK !== 'ic') {
    agent.fetchRootKey().catch(err => {
      console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
      console.error(err);
    });
  }

  return createBackendActor(canisterId, {
    agent,
  });
};

export { canisterId };