import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import configPromise from '@payload-config';
import '@payloadcms/next/css';
import { importMap } from '../importMap';

export { metadata } from '@payloadcms/next/layouts';

/**
 * Layout untuk admin dashboard Payload CMS.
 * Terpisah dari frontend layout — Payload mengelola UI admin-nya sendiri.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const serverFunction = async function (args: any) {
    'use server';
    return handleServerFunctions({
      ...args,
      config: configPromise,
      importMap,
    });
  };

  return (
    <RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
