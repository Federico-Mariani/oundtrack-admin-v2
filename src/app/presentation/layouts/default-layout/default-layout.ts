import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Sidebar} from "@shared/ui/sidebar/sidebar";
import {HlmSidebarInset, HlmSidebarTrigger} from "@spartan-ng/helm/sidebar";

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, Sidebar, HlmSidebarInset, HlmSidebarTrigger],
})
export class DefaultLayout {}
