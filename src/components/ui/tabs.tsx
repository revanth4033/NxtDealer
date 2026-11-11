import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Tabs as TabsPrimitive } from "radix-ui"

function Tabs({ className, orientation = "horizontal", ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn("group/tabs flex gap-4 data-[orientation=horizontal]:flex-col", className)}
      {...props}
    />
  )
}

/**
 * Variants
 *  - line:    underline tabs for page-level views. The list's bottom border doubles as a section divider.
 *  - segment: compact segmented control for switching views inside a section (e.g. 7d / 30d / 90d).
 */
// Lists scroll horizontally on narrow screens instead of overflowing the page.
const tabsListVariants = cva("group/tabs-list inline-flex max-w-full items-center overflow-x-auto text-muted-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", {
  variants: {
    variant: {
      line: "w-full gap-6 shadow-[inset_0_-1px_0_var(--border)]",
      segment: "h-9 w-fit gap-0.5 rounded-lg border bg-muted/70 p-0.5",
    },
  },
  defaultVariants: { variant: "line" },
})

function TabsList({
  className,
  variant = "line",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap outline-none transition-colors duration-150",
        "hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // line
        "group-data-[variant=line]/tabs-list:h-10 group-data-[variant=line]/tabs-list:shrink-0 group-data-[variant=line]/tabs-list:rounded-sm group-data-[variant=line]/tabs-list:px-0.5",
        "group-data-[variant=line]/tabs-list:after:absolute group-data-[variant=line]/tabs-list:after:inset-x-0 group-data-[variant=line]/tabs-list:after:bottom-0 group-data-[variant=line]/tabs-list:after:h-0.5 group-data-[variant=line]/tabs-list:after:rounded-full group-data-[variant=line]/tabs-list:after:bg-primary group-data-[variant=line]/tabs-list:after:opacity-0 group-data-[variant=line]/tabs-list:after:transition-opacity",
        "group-data-[variant=line]/tabs-list:data-[state=active]:text-foreground group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        // segment
        "group-data-[variant=segment]/tabs-list:h-full group-data-[variant=segment]/tabs-list:shrink-0 group-data-[variant=segment]/tabs-list:rounded-md group-data-[variant=segment]/tabs-list:px-3",
        "group-data-[variant=segment]/tabs-list:data-[state=active]:bg-card group-data-[variant=segment]/tabs-list:data-[state=active]:text-foreground group-data-[variant=segment]/tabs-list:data-[state=active]:shadow-card",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
