import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
import configPromise from '@payload-config';
import { importMap } from '../importMap';

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  params: Promise<{ segments?: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) =>
  generatePageMetadata({
    config: configPromise,
    params: await params,
    searchParams: await searchParams,
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
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <RootPage
      config={configPromise}
      params={resolvedParams}
      searchParams={resolvedSearchParams}
      importMap={importMap}
    />
  );
}
