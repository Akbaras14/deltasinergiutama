import { Storefront, type CustomerView } from "./storefront";
/** Public demo storefront, available in development and deployed builds. */
export function CustomerPage({
  view,
  id,
}: {
  view: CustomerView;
  id?: string;
}) {
  return <Storefront view={view} id={id} />;
}
