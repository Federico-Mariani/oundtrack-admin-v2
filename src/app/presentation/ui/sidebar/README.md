# Sidebar

The layout composes `DEFAULT_SIDEBAR_GROUPS`; feature public navigation APIs own the destinations. Movies, TvSeries and GameCategories use direct `hlmSidebarMenuButton` anchors with icons and translated labels, without creation submenus.

The links use RouterLink and RouterLinkActive, support keyboard navigation and opening in a new tab, and expose aria-current for the active destination. Catalog filters and detail query parameters keep their section active. Normal selection closes the mobile panel; modifier clicks preserve it.

Create actions belong to the catalog page headers and open dedicated modal components through the shared ModalService. Movie and TvSeries creation share CatalogCreationForm and CatalogCreationDialog. Successful creation closes the dialog and refreshes the current query; cancellation does not reload the list. The form preserves values on errors and disables dismissal while a request is pending.

The reusable renderer still supports optional child links for other configurations. Shell translations are scoped to the sidebar through viewProviders; the renderer does not import features, Store or imperative navigation services.
