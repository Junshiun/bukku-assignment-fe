import { PropsWithChildren } from "react";

export const Table = (props: PropsWithChildren<{
    headings: string[];
}>) => {

    return (
        <table className="min-w-[45rem] max-w-full w-full border-collapse h-fit">
            <thead>
                <tr className="bg-black">
                {
                    props.headings.map(heading => {
                    return (
                        <th key={heading} className="border p-2">
                        {
                            heading
                        }
                        </th>
                    )
                    })
                }
                </tr>
            </thead>
            <tbody>
                {
                    props.children
                }
            </tbody>
        </table>
    )
}