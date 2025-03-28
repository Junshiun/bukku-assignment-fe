import { ActionDispatch, createContext, Dispatch, PropsWithChildren, useContext, useEffect, useReducer, useState } from "react";
import { TPurchase } from "./purchases";
import { TSale } from "./sales";
import { isPurchase, recalculate } from "./utils";

export type TInventory = {
  purchases: TPurchase[];
  sales: TSale[];
  stock: number;
  wac: number; // Weighted Average Cost
  accumulateValue: number;
}

export const InventoryInitial: TInventory = { purchases: [], sales: [], stock: 0, wac: 0, accumulateValue: 0 }

export enum TInventoryAction {
    add = "addTransaction",
    edit = "editTransaction",
    delete = "deleteTransaction"
}

type TTransactionAction<T> = {
    type: T;
    payload: {
        transaction: TPurchase | TSale
    }
}

type TAction = TTransactionAction<TInventoryAction.add> | TTransactionAction<TInventoryAction.edit> | TTransactionAction<TInventoryAction.delete>

const InventoryContext = createContext<{
    inventoryState: TInventory,
    // setInventoryState: Dispatch<TInventory>
    // inventoryDispatch: Dispatch<TAction>
    inventoryDispatch: (props: {type: TInventoryAction, payload: {
        transaction: TPurchase | TSale
    }}) => void
} | null>(null);

// const InventoryReducer = (state: TInventory, action: TAction) => {

//     const transaction = action.payload.transaction;

//     switch(action.type) {
//         case TInventoryAction.add:
//             return recalculate(state, transaction, TInventoryAction.add)
//         case TInventoryAction.delete:
//             return recalculate(state, transaction, TInventoryAction.delete)
//         case TInventoryAction.edit:
//             return recalculate(state, transaction, TInventoryAction.edit)
//         default:
//             return state;
//     }
// }

export const InventoryProvider = (props: PropsWithChildren) => {

    const [inventoryState, setInventoryState] = useState(() => {
        const saved = localStorage.getItem('inventory');
        return saved
          ? JSON.parse(saved)
          : { purchases: [], sales: [], stock: 0, wac: 0, totalValue: 0 };
    })

    // const [inventoryState, inventoryDispatch] = useReducer(InventoryReducer, null, () => {
    //     const saved = localStorage.getItem('inventory');
    //     return saved
    //       ? JSON.parse(saved)
    //       : InventoryInitial;
    // });
    
    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('inventory', JSON.stringify(inventoryState));
    }, [inventoryState]);

    const inventoryDispatch = (props: {
        type: TInventoryAction, payload: {
        transaction: TPurchase | TSale
    }}) => {

        const transaction = props.payload.transaction;
    
        switch(props.type) {
            case TInventoryAction.add:
                setInventoryState(recalculate(inventoryState, transaction, TInventoryAction.add));
                break;
            case TInventoryAction.delete:
                setInventoryState(recalculate(inventoryState, transaction, TInventoryAction.delete));
                break;
            case TInventoryAction.edit:
                setInventoryState(recalculate(inventoryState, transaction, TInventoryAction.edit));
                break;
            default:
                break;
        }
    }

    return (
        <InventoryContext.Provider value={{
            inventoryState,
            inventoryDispatch
        }}>
            <div className="text-center mb-4">
                Current WAC: RM{inventoryState.wac.toFixed(2)} | Current Stock: {inventoryState.stock} items
            </div>
            {props.children}
        </InventoryContext.Provider>
    )
}

export const useInventoryContext = () => useContext(InventoryContext)