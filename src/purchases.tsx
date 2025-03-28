import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { formatDate, generateId, recalculate, validateTransactionDate } from "./utils";
import { MdDelete, MdEdit } from "react-icons/md";
import { Row } from "./row";
import { TInventoryAction, useInventoryContext } from "./context";
import { Table } from "./table";
import { Form } from "./form";

export type TPurchase = {
  type: "purchase";
  id: number;
  date: string; // ISO date string (e.g., "2022-01-01")
  quantity: number;
  costPerUnit: number;
  totalValue: number;
  accumulate?: {
    stock: number;
    value: number;
  }
}

export const purchaseFormInitial = { date: '', quantity: '', costPerUnit: '' }

export const PurchasesForm = () => {

    const inventory = useInventoryContext();

    if (!inventory) {
      return;
    }

    const { inventoryState, inventoryDispatch } = inventory;

    const [purchaseForm, setPurchaseForm] = useState(purchaseFormInitial);
    const [error, setError] = useState<string | null>(null);

    const handlePurchaseSubmit = (ev: FormEvent) => {
      try {
        ev.preventDefault();

        const { date, quantity, costPerUnit } = purchaseForm;
        const qty = parseInt(quantity);
        const cost = parseFloat(costPerUnit);

        if (!validateTransactionDate(inventoryState, date)) {
          throw new Error("Multiple transaction per day is not allowed");
        }

        // if (!date || qty <= 0 || cost <= 0) return;

        const newPurchase: TPurchase = {
            type: "purchase",
            id: generateId(),
            date,
            quantity: qty,
            totalValue: cost * qty,
            costPerUnit: cost
        };

        // const newTotalValue = inventory.totalValue + totalValue;
        // const newStock = inventory.stock + qty;
        // const newWac = newTotalValue / newStock;

        // setInventory({
        //     ...inventory,
        //     purchases: [...inventory.purchases, newPurchase],
        //     stock: newStock,
        //     wac: newWac,
        //     totalValue: newTotalValue,
        // });


        // setInventoryState(recalculate(inventoryState, newPurchase, TInventoryAction.add));
        inventoryDispatch({
          type: TInventoryAction.add,
          payload: {
            transaction: newPurchase
          }
        })

        setPurchaseForm(purchaseFormInitial)
      } catch(err) {
        setError((err as Error).message)
      }
    };

    return (
        <>
          <Form submit={handlePurchaseSubmit} inputs={[
            {
              label: "Date",
              element: <input
                type="date"
                name="date"
                value={purchaseForm.date}
                onChange={ev => setPurchaseForm({ ...purchaseForm, date: ev.target.value })}
                required
              />
            },
            {
              label: "Quantity",
              element: <input
                type="number"
                step="1"
                min="1"
                name="quantity"
                value={purchaseForm.quantity}
                onChange={ev => setPurchaseForm({ ...purchaseForm, quantity: ev.target.value })}
                required
              />
            },
            {
              label: "Cost per Unit (RM)",
              element: <input
                type="number"
                step="0.01"
                min="0.01"
                name="cost"
                value={purchaseForm.costPerUnit}
                onChange={ev => setPurchaseForm({ ...purchaseForm, costPerUnit: ev.target.value })}
                required
              />
            }
          ]} button={{
            text: "Add Purchase"
          }} error={{
            message: error
          }}/>
          {/* <form className="[&>div]:flex [&>div]:flex-col [&>div]:gap-2" onSubmit={handlePurchaseSubmit}>
            <div>
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={purchaseForm.date}
                onChange={ev => setPurchaseForm({ ...purchaseForm, date: ev.target.value })}
                required
              />
            </div>
            <div>
              <label>Quantity:</label>
              <input
                type="number"
                step="1"
                min="1"
                name="quantity"
                value={purchaseForm.quantity}
                onChange={ev => setPurchaseForm({ ...purchaseForm, quantity: ev.target.value })}
                required
              />
            </div>
            <div>
              <label>Cost per Unit (RM):</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                name="cost"
                value={purchaseForm.costPerUnit}
                onChange={ev => setPurchaseForm({ ...purchaseForm, costPerUnit: ev.target.value })}
                required
              />
            </div>
            <button type="submit">
              Add Purchase
            </button>
            {
              error && <div>{error}</div> 
            }
          </form> */}

          <Table headings={["Date (yyyy-mm-dd)", "ID", "Quantity", "Cost/Unit (RM)", "Total (RM)", "Action"]}>
            {inventoryState.purchases.map((p) => (
                <Row key={p.id} transaction={p} initialValue={[
                  {
                      name: "date",
                      type: "date",
                      defaultValue: p.date
                  },
                  {
                      name: "id",
                      defaultValue: p.id,
                      nonEditable: true
                  },
                  {
                      name: "quantity",
                      defaultValue: p.quantity
                  },
                  {
                      name: "costPerUnit",
                      defaultValue: parseFloat(`${p.costPerUnit}`).toFixed(2)
                  },
                  {
                      name: "totalValue",
                      defaultValue: parseFloat(`${p.totalValue}`).toFixed(2),
                      nonEditable: true
                  }
                ]}/>
              ))}
          </Table>
        </>
    )
}