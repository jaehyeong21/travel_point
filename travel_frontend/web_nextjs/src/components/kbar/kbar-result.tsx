import { KBarResults, useMatches } from "kbar";
import { cn } from "@/libs/utils";

export default function RenderResults() {

  /* `const { results } = useMatches();` is using the `useMatches` hook from the `kbar` library to get
the search results. It destructures the `results` property from the object returned by the hook,
which contains an array of search results. These results can be used to render the search results in
the UI. */

  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div className="text-slate-700 dark:text-slate-300 mx-3 py-2 text-sm">{item}</div>
        ) : (
          <div
            className={cn(
              'mx-3 flex cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors',
              active && 'bg-slate-200/70 dark:bg-slate-800',
            )}
          >
            {item.icon && item.icon}
            <div className="flex flex-col font-medium">
              <div>{item.name}</div>
              {item.subtitle && (
                <span className="text-slate-700 dark:text-slate-300 text-xs font-normal">{item.subtitle}</span>
              )}
            </div>
            {item.shortcut?.length && (
              <div className="ml-auto flex gap-2">
                {item.shortcut.map((sc) => (
                  <kbd
                    key={sc}
                    className="rounded-md px-2 py-1 text-xs"
                    style={{
                      background: 'rgba(0 0 0 / .2)',
                    }}
                  >
                    {sc}
                  </kbd>
                ))}
              </div>
            )}
          </div>
        )
      }
    />
  );
}