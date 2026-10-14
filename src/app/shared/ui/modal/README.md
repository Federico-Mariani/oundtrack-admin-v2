# Component modals

`ModalService` is the global, feature-agnostic entry point. A caller opens a dedicated
component, without a dialog element or template in its page HTML. Feature-specific modals
live in that feature's `presentation/components/` folder; reusable modals live in `shared/ui`.
`ListFiltersModal` is the working example.

A modal implements `ModalContent<Params, Result>`, injects its parameters with
`injectBrnDialogContext<{ params: Params }>().params` and its reference with `inject<BrnDialogRef<Result>>(BrnDialogRef)`.
Render `ModalFrame` inside the modal for a translated close button, title, description,
scrollable content and consistent styling. Supply translated title and description.

```ts
// In the opening component; CreateNewMovieModal is an example feature component.
private readonly modals = inject(ModalService);
private readonly viewContainerRef = inject(ViewContainerRef);

openCreate(): void {
  const ref = this.modals.open(CreateNewMovieModal, { collectionId: 'favorites' }, {
    viewContainerRef: this.viewContainerRef,
  });
  ref.closed$.subscribe(result => {
    // undefined means dismissed. A modal can call ref.close(result).
  });
}
```

Parameters and result are inferred from the component contract. Pass signals when a modal
must observe changing values, as the filters modal does; do not copy form state. Pass the
caller's view container so feature-scoped dependencies remain available. Each opening has a unique
ID, injector and reference. Keep the reference to prevent duplicate openings of the same UI,
as demonstrated by `ListControls`. The service automatically closes an overlay when the
opening component is destroyed. The completion of
`closed$` releases subscriptions. Spartan owns focus trapping/restoration, Escape/backdrop dismissal,
scroll blocking, stacking and overlay disposal. `disableClose` suppresses Escape/backdrop;
the component decides whether its own explicit close action is appropriate.

No feature registry or global store is needed. Pagination remains in the table footer.

The service wraps `HlmDialogService`; `HlmDialogContent` supplies the visual surface,
backdrop and animations. `ModalFrame` uses `HlmDialogTitle` and `HlmDialogDescription`
for accessible associations and keeps the shared, reactively translated close button.
No direct CDK Dialog or DIALOG_DATA is used by application modals.

The local Helm service accepts an optional `viewContainerRef` and forwards it to
`BrnDialogService.open`. This small extension preserves feature-scoped providers when
opening a component globally; retain it when regenerating the Helm primitive.
