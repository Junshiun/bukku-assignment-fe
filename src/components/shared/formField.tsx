import { PropsWithChildren } from "react"

export const FormField = (props: PropsWithChildren<{
    label: string
}>) => {

    return (
        <div className="flex flex-col gap-2">
            <label>
                {
                    props.label
                }:
            </label>
            {
                props.children
            }
        </div>
    )
}