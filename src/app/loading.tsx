import { LoadingCard } from "@/components/Loading";

/**
 * Next.js Loading UI
 *
 * Automatically shown while page content is loading (with Suspense).
 * This is the default loading state for the entire app.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/loading
 */
export default function Loading() {
  return <LoadingCard message="Loading..." />;
}
