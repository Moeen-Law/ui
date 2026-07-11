import type { LucideIcon } from "lucide-react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskErrorStateProps { title: string; description: string; retryLabel?: string; onRetry?: () => void; }
export function TaskErrorState({ title, description, retryLabel, onRetry }: TaskErrorStateProps) {
    return <Card className="border-destructive/40 bg-destructive/5 shadow-xl shadow-destructive/5"><CardHeader><CardTitle className="flex items-center gap-2 text-destructive"><AlertCircle />{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader>{onRetry && retryLabel ? <CardContent><Button type="button" variant="destructive" onClick={onRetry}><RotateCcw data-icon="inline-start" />{retryLabel}</Button></CardContent> : null}</Card>;
}

interface TaskExampleEmptyStateProps { icon: LucideIcon; title: string; description: string; examples: string[]; exampleIcon?: LucideIcon; onSelectExample: (value: string) => void; }
export function TaskExampleEmptyState({ icon: Icon, title, description, examples, exampleIcon: ExampleIcon, onSelectExample }: TaskExampleEmptyStateProps) {
    return <Card className="min-h-[360px] justify-center border-dashed border-blue-500/25 bg-card/75 shadow-xl shadow-blue-500/5"><CardContent className="flex flex-col items-center gap-6 py-14 text-center"><div className="flex size-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 shadow-inner"><Icon /></div><div className="flex max-w-xl flex-col gap-3"><h2 className="text-2xl font-black md:text-3xl">{title}</h2><p className="text-sm leading-7 text-muted-foreground md:text-base">{description}</p></div><div className="flex flex-wrap justify-center gap-2">{examples.map((example) => <Button key={example} type="button" variant="outline" size="sm" className="cursor-pointer border-blue-500/20 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-500" onClick={() => onSelectExample(example)}>{ExampleIcon ? <ExampleIcon data-icon="inline-start" /> : null}{example}</Button>)}</div></CardContent></Card>;
}
