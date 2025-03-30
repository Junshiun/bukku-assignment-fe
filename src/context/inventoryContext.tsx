import { ActionDispatch, createContext, Dispatch, PropsWithChildren, useContext, useEffect, useReducer, useState } from "react";
import { TPurchase } from "../components/features/purchases";
import { TSale } from "../components/features/sales";
import { isPurchase, recalculate } from "../utils";

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

const InventoryContext = createContext<{
    inventoryState: TInventory,
    inventoryDispatch: (props: { // update inventory state
        type: TInventoryAction, 
        payload: {
            transaction: TPurchase | TSale
        }
    }) => void
} | null>(null);

export const InventoryProvider = (props: PropsWithChildren) => {

    const [inventoryState, setInventoryState] = useState(() => { // get from local storage as initial value, if local storage is empty, initialize with default inventory state
        const saved = localStorage.getItem('inventory');
        return saved
          ? JSON.parse(saved)
          : { purchases: [], sales: [], stock: 0, wac: 0, totalValue: 0 };
    })

    useEffect(() => { // save to local storage whenever inventory state change
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