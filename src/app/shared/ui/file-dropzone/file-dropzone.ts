import {
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUpload } from '@ng-icons/lucide';
@Component({
  selector: 'app-file-dropzone',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButton, NgIcon],
  providers: [provideIcons({ lucideUpload })],
  host: { class: 'block min-w-0' },
  template: `
    <div
      (dragenter)="enter($event)"
      (dragover)="over($event)"
      (dragleave)="leave($event)"
      (drop)="drop($event)"
    >
      <input
        #picker
        type="file"
        class="hidden"
        tabindex="-1"
        [accept]="accept()"
        [disabled]="disabled()"
        (change)="choose($event)"
      />
      <button
        hlmBtn
        type="button"
        variant="ghost"
        class="h-auto min-h-40 w-full flex-col gap-3 whitespace-normal rounded-lg border-2 border-dashed p-6 text-center hover:bg-muted/40 disabled:opacity-60"
        [class.border-primary]="dragDepth() > 0 && !disabled()"
        [class.bg-primary/5]="dragDepth() > 0 && !disabled()"
        [class.border-destructive]="invalid()"
        [attr.aria-invalid]="invalid()"
        [attr.aria-describedby]="describedBy()"
        [disabled]="disabled()"
        (click)="browse()"
      >
        <span
          class="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground"
          ><ng-icon name="lucideUpload" class="text-xl" aria-hidden="true"
        /></span>
        <span class="space-y-1.5"
          ><span class="block text-sm font-medium">{{ title() }}</span
          ><span class="block text-sm font-normal text-muted-foreground">{{
            description()
          }}</span></span
        >
        <span class="text-sm font-medium text-primary underline underline-offset-4">{{
          browseLabel()
        }}</span>
      </button>
    </div>
  `,
})
export class FileDropzone {
  readonly accept = input('');
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly browseLabel = input.required<string>();
  readonly disabled = input(false);
  readonly invalid = input(false);
  readonly describedBy = input<string | null>(null);
  readonly selected = output<File>();
  readonly multipleRejected = output();
  protected readonly dragDepth = signal(0);
  private readonly picker = viewChild.required<ElementRef<HTMLInputElement>>('picker');
  protected browse(): void {
    if (!this.disabled()) {
      this.picker().nativeElement.click();
    }
  }
  protected choose(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    this.select(event.target.files);
    event.target.value = '';
  }
  protected enter(event: DragEvent): void {
    event.preventDefault();
    if (!this.disabled()) {
      this.dragDepth.update((depth) => depth + 1);
    }
  }
  protected over(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = this.disabled() ? 'none' : 'copy';
    }
  }
  protected leave(event: DragEvent): void {
    event.preventDefault();
    this.dragDepth.update((depth) => Math.max(0, depth - 1));
  }
  protected drop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragDepth.set(0);
    this.select(event.dataTransfer?.files ?? null);
  }
  private select(files: FileList | null): void {
    if (this.disabled() || !files?.length) {
      return;
    }
    if (files.length !== 1) {
      this.multipleRejected.emit();
      return;
    }
    const file = files.item(0);
    if (file) {
      this.selected.emit(file);
    }
  }
}
