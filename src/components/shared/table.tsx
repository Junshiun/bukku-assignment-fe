import { PropsWithChildren } from "react";

export const Table = (props: PropsWithChildren<{
    headings: string[];
}>) => {

    return (
        <table className="block w-full overflow-x-auto border-collapse h-fit">
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