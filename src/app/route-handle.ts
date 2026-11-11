/** Metadata attached to routes via `handle`, read with useRouteMeta() / useBreadcrumbs(). */
export interface RouteHandle {
  /** Page title. Used for the document title and as the breadcrumb label. */
  title: string
  /** Override the breadcrumb label when it should differ from the title. */
  breadcrumb?: string
}
