import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
import configPromise from '@payload-config';
import { importMap } from '../importMap';

export const generateMetadata = ({
  params,
  searchParams,
}: {
  params: Promise<{ segments?: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) =>
  generatePageMetadata({
    config: configPromise,
    params,
    searchParams,
  });

/**
 * Catch-all page handler untuk seluruh halaman admin Payload CMS.
 * Payload mengelola routing internal admin-nya sendiri via RootPage.
 */
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ segments?: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  return (
    <RootPage
      config={configPromise}
      params={params}
      searchParams={searchParams}
      importMap={importMap}
    />
  );
}
