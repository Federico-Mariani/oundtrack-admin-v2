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

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
        HlmSidebarMenuButton
    ]
})
export class Sidebar {
    protected readonly _items = [
        {
            title: 'Getting Started',
            defaultOpen: true,
            items: [{title: 'Installation'}, {title: 'Project Structure'}],
        },
        {
            title: 'Building Your Application',
            defaultOpen: false,
            items: [
                {title: 'Routing'},
                {title: 'Data Fetching', isActive: true},
                {title: 'Rendering'},
                {title: 'Caching'},
                {title: 'Styling'},
                {title: 'Optimizing'},
                {title: 'Configuring'},
                {title: 'Testing'},
                {title: 'Authentication'},
                {title: 'Deploying'},
                {title: 'Upgrading'},
                {title: 'Examples'},
            ],
        },
        {
            title: 'API Reference',
            defaultOpen: false,
            items: [
                {title: 'Components'},
                {title: 'File Conventions'},
                {title: 'Functions'},
                {title: 'next.config.js Options'},
                {title: 'CLI'},
                {title: 'Edge Runtime'},
            ],
        },
        {
            title: 'Architecture',
            defaultOpen: false,
            items: [
                {title: 'Accessibility'},
                {title: 'Fast Refresh'},
                {title: 'Next.js Compiler'},
                {title: 'Supported Browsers'},
                {title: 'Turbopack'},
            ],
        },
    ];
}
