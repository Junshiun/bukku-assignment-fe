import { MdDelete, MdEdit } from "react-icons/md"
import { TPurchase } from "../features/purchases"
import { InputHTMLAttributes, useState } from "react"
import { IoMdCheckmark, IoMdClose } from "react-icons/io"
import { TInventoryAction, useInventoryContext } from "../../context/inventoryContext"
import { TSale } from "../features/sales"

export const Row = (props: {
    transaction: TPurchase | TSale,
    columns: {
        nonEditable?: boolean,
        formatValue?: (value: string) => unknown, // convert string into other type for state update
        renderValue?: (value: unknown) => string, // convert value into string type for rendering
        attributes: InputHTMLAttributes<HTMLInputElement> & { // input attributes
            name: string,
            defaultValue: number | string,
        }
    }[]
}) => {

    const inventory = useInventoryContext();
    
    if (!inventory) {
        return;
    }

    const { inventoryDispatch } = inventory;

    const [form, setForm] = useState(props.transaction);
    const [action, setAction] = useState<TInventoryAction.delete | TInventoryAction.edit | null>(null);
    const [error, setError] = useState<string | null>(null);

    return (
        <tr>
            {
                props.columns.map(detail => {
                    return (
                        <td className="border p-2" key={detail.attributes.name}>{
                            (action === TInventoryAction.edit && !detail.nonEditable) ?
                            <input
                                onChange={(ev) => {
                                    setForm({ ...form, [detail.attributes.name]: detail.formatValue? detail.formatValue(ev.target.value): ev.target.value })
                                }}
                                {...detail.attributes}
                                required
                            />
                            :
                            (detail.renderValue? detail.renderValue(detail.attributes.defaultValue)
                                : detail.attributes.defaultValue)
                        }</td>
                    )
                })
            }
            <td className="border p-2 flex h-full gap-4">
                {
                    action? 
                    <>
                        <button onClick={() => { // confirm edit / delete
                            try {
                                inventoryDispatch({
                                    type: action,
                                    payload: {
                                        transaction: form
                                    }
                                });
                            } 
                            catch(err) {
                                setError((err as Error).message)
                            } finally {
                                setAction(null)
                            }
                        }}>
                            <IoMdCheckmark />
                        </button>
                        <button onClick={() => { // discard edit / delete
                            setError(null);
                            setAction(null)
                        }}>
                            <IoMdClose />
                        </button>
                    </>
                    :
                    <>
                        <button onClick={() => { // edit
                            setError(null);
                            setAction(TInventoryAction.edit)
                        }}>
                            <MdEdit />
                        </button>
                        <button onClick={() => { // delete
                            setError(null);
                            setAction(TInventoryAction.delete)
                        }}>
                            <MdDelete />
                        </button>
                        {
                            error && <span>{
                                error
                            }</span>
                        }
                    </>
                }
            </td>
        </tr>
    )
}