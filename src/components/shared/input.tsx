import { ChangeEvent, InputHTMLAttributes } from "react"
import { TPurchase } from "../features/purchases"
import { TSale } from "../features/sales"

export const Input = <T extends (TPurchase | TSale),>(props: InputHTMLAttributes<HTMLInputElement> & { // input attributes
    name: keyof T, // ensure only relevant property is set
    onChange: (ev: ChangeEvent<HTMLInputElement>) => void
}) => {

    return (
        <input
            {...props}
            required
        />
    )
}