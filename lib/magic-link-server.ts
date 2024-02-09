import { Magic } from '@magic-sdk/admin';

const magicServer = async () =>
  await Magic.init(process.env.MAGIC_LINK_SERVER_KEY);

export const magicAdmin = magicServer();
