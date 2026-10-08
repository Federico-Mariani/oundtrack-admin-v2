import {ChangeDetectionStrategy, Component} from '@angular/core';
import {
    HlmSidebar,
    HlmSidebarContent,
    HlmSidebarFooter,
    HlmSidebarGroup,
    HlmSidebarGroupContent,
    HlmSidebarHeader,
    HlmSidebarMenu,
    HlmSidebarMenuButton,
    HlmSidebarMenuItem,
    HlmSidebarWrapper
} from "@spartan-ng/helm/sidebar";
import {NgIcon, provideIcons} from "@ng-icons/core";
import {lucideChevronsUpDown} from "@ng-icons/lucide";
import {
    HlmDropdownMenu,
    HlmDropdownMenuGroup,
    HlmDropdownMenuItem,
    HlmDropdownMenuLabel,
    HlmDropdownMenuSeparator,
    HlmDropdownMenuTrigger
} from "@spartan-ng/helm/dropdown-menu";
import {Avatar} from "@shared/ui/avatar/avatar";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideIcons({lucideChevronsUpDown}),
    ],
    imports: [
        HlmSidebarWrapper,
        HlmSidebar,
        HlmSidebarHeader,
        HlmSidebarContent,
        HlmSidebarGroup,
        HlmSidebarGroupContent,
        HlmSidebarFooter,
        HlmSidebarMenu,
        HlmSidebarMenuItem,
        HlmSidebarMenuButton,
        NgIcon,
        HlmDropdownMenuTrigger,
        HlmDropdownMenuItem,
        HlmDropdownMenuGroup,
        HlmDropdownMenuSeparator,
        HlmDropdownMenu,
        HlmDropdownMenuLabel,
        Avatar
    ]
})
export class Sidebar {
}
