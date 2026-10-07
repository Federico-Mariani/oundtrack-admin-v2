import { hlm } from '@spartan-ng/helm/utils';
import type { ChartTooltipInput, ChartTooltipOptions, ChartValue } from '@tanstack/charts';
import { tooltip } from '@tanstack/charts/tooltip';

/** Enables TanStack's DOM tooltip with Spartan styling. */
export function hlmChartTooltip<
  TDatum = unknown,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>(
  options: ChartTooltipOptions<TDatum, TXValue, TYValue> = {},
): ChartTooltipInput<TDatum, TXValue, TYValue, 'dom'> {
  return {
    use: tooltip,
    ...options,
    className: hlm(
      '[--ts-chart-tooltip-background:var(--popover)] [--ts-chart-tooltip-border-radius:calc(var(--radius)*1.4)] [--ts-chart-tooltip-border:0_solid_transparent] [--ts-chart-tooltip-color:var(--popover-foreground)] [--ts-chart-tooltip-font:500_var(--text-xs)/var(--text-xs--line-height)_var(--font-sans)] [--ts-chart-tooltip-padding:--spacing(1.5)_--spacing(2.5)] [--ts-chart-tooltip-shadow:var(--shadow-lg),0_0_0_1px_color-mix(in_oklab,var(--foreground)_5%,transparent)] dark:[--ts-chart-tooltip-shadow:var(--shadow-lg),0_0_0_1px_color-mix(in_oklab,var(--foreground)_10%,transparent)]',
      options.className,
    ),
  };
}
