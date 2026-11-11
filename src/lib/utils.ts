import { createCn } from 'cn/config'

/**
 * Class merger that knows the NxtDealer design tokens, so custom utilities override
 * component defaults correctly (e.g. `text-page-title` replaces `text-base` instead of
 * both being kept). Register every custom font size / shadow from globals.css here.
 *
 * shadcn's CLI generates `import { cn } from "cn"` — switch new components to "@/lib/utils".
 */
export const cn = createCn({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display', 'page-title', 'section-title', 'metric', 'caption'] }],
      shadow: [{ shadow: ['card', 'raised', 'overlay'] }],
    },
  },
})
