import { InstanceWithExtensions, SDKBase } from '@magic-sdk/provider';
import { Magic, MagicSDKExtensionsOption } from 'magic-sdk';

export let magic: InstanceWithExtensions<
  SDKBase,
  MagicSDKExtensionsOption<string>
>;
if (typeof window !== 'undefined') {
  magic = new Magic(`${process.env.NEXT_PUBLIC_MAGIC_LINK_PUBLISHABLE_KEY}`);
}
