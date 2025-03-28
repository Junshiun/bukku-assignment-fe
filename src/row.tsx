import { MdDelete, MdEdit } from "react-icons/md"
import { formatDate, recalculate } from "./utils"
import { purchaseFormInitial, TPurchase } from "./purchases"
import { useRef, useState } from "react"
import { IoMdCheckmark, IoMdClose } from "react-icons/io"
import { TInventoryAction, useInventoryContext } from "./context"
import { TSale } from "./sales"

export const Row = (props: {
    transaction: TPurchase | TSale,
    initialValue: {
        name: string,
        type?: string,
        defaultValue?: number | string,
        nonEditable?: boolean
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
                props.initialValue.map(detail => {
                    return (
                        <td className="border p-2" key={detail.name}>{
                            (action === TInventoryAction.edit && !detail.nonEditable) ?
                            <input
                                type={detail.type}
                                name={detail.name}
                                defaultValue={detail.defaultValue}
                                onChange={(ev) => setForm({ ...form, [detail.name]: ev.target.value })}
                                required
                            />
                            :
                            detail.defaultValue
                        }</td>
                    )
                })
            }
            <td className="border p-2 flex h-full gap-4">
                {
                    action? 
                    <>
                        <button onClick={() => {
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
                        <button onClick={() => {
                            setError(null);
                            setAction(null)
                        }}>
                            <IoMdClose />
                        </button>
                    </>
                    :
                    <>
                        <button onClick={() => {
                            setError(null);
                            setAction(TInventoryAction.edit)
                        }}>
                            <MdEdit />
                        </button>
                        <button onClick={() => {
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