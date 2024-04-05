import { ComponentProps } from "react";

interface TableHeaderProps extends ComponentProps<'th'>{}

export function TableHeader(props: TableHeaderProps) {
    return (
        <th className="py-3 px-4 text-sm text-zinc-300 text-left" {...props}/>
    )
}