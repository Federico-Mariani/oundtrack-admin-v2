import { TestBed } from '@angular/core/testing';
import { FileDropzone } from './file-dropzone';

function filesList(files: Array<File>): FileList {
  return {
    length: files.length,
    item: (index: number) => files.at(index) ?? null,
    [Symbol.iterator]: () => files.values(),
  };
}

async function setup() {
  const fixture = TestBed.createComponent(FileDropzone);
  fixture.componentRef.setInput('title', 'Drop your audio here');
  fixture.componentRef.setInput('description', 'One MP3 recording');
  fixture.componentRef.setInput('browseLabel', 'Browse files');
  fixture.componentRef.setInput('accept', '.mp3,audio/mpeg');
  const selected = vi.fn();
  const rejected = vi.fn();
  fixture.componentInstance.selected.subscribe(selected);
  fixture.componentInstance.multipleRejected.subscribe(rejected);
  await fixture.whenStable();
  const element = fixture.nativeElement as HTMLElement;
  const input = element.querySelector<HTMLInputElement>('input')!;
  const drop = (files: Array<File>) => {
    const event = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'dataTransfer', { value: { files: filesList(files) } });
    element.querySelector('div')!.dispatchEvent(event);
    return event;
  };
  return { fixture, element, input, selected, rejected, drop };
}

describe('Reusable file dropzone', () => {
  it('opens the native file picker from an accessible button and emits the selected file', async () => {
    const { element, input, selected } = await setup();
    const browse = vi.spyOn(input, 'click');
    element.querySelector('button')!.click();
    expect(browse).toHaveBeenCalledOnce();
    expect(input.accept).toBe('.mp3,audio/mpeg');
    const file = new File(['ID3audio'], 'track.mp3');
    Object.defineProperty(input, 'files', { value: filesList([file]), configurable: true });
    input.dispatchEvent(new Event('change'));
    expect(selected).toHaveBeenCalledExactlyOnceWith(file);
    expect(input.value).toBe('');
  });
  it('accepts one dropped file, rejects multiple files without silently choosing one, and prevents navigation', async () => {
    const { selected, rejected, drop } = await setup();
    const file = new File(['ID3audio'], 'track.mp3');
    expect(drop([file]).defaultPrevented).toBe(true);
    expect(selected).toHaveBeenCalledExactlyOnceWith(file);
    drop([file, new File(['ID3audio'], 'other.mp3')]);
    expect(selected).toHaveBeenCalledOnce();
    expect(rejected).toHaveBeenCalledOnce();
  });
  it('ignores selection and drops while disabled and clears drag feedback on drop', async () => {
    const { fixture, element, input, selected, drop } = await setup();
    element.querySelector('div')!.dispatchEvent(new Event('dragenter', { cancelable: true }));
    await fixture.whenStable();
    expect(element.querySelector('div')!.classList.contains('border-primary')).toBe(true);
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    const file = new File(['ID3audio'], 'track.mp3');
    expect(drop([file]).defaultPrevented).toBe(true);
    Object.defineProperty(input, 'files', { value: filesList([file]) });
    input.dispatchEvent(new Event('change'));
    expect(selected).not.toHaveBeenCalled();
    expect(element.querySelector('button')!.disabled).toBe(true);
    fixture.componentRef.setInput('disabled', false);
    await fixture.whenStable();
    expect(element.querySelector('div')!.classList.contains('border-primary')).toBe(false);
  });
});
