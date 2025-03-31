import { FormEvent, useState } from "react";
import { formatDate, generateId, validateTransactionDate } from "../../utils";
import { Row } from "../shared/row";
import { TInventoryAction, useInventoryContext } from "../../context/inventoryContext";
import { Table } from "../shared/table";
import { FormField } from "../shared/formField";

export type TPurchase = {
  type: "purchase";
  id: number | string;
  date: string; // "yyyy-mm-dd"
  quantity: number;
  totalCost: number;
  accumulate?: {
    stock: number;
    value: number;
  }
}

export const purchaseFormInitial = { date: "", quantity: 0, totalCost: 0 }

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

        const { date, quantity, totalCost } = purchaseForm;
        const qty = quantity;
        const cost = totalCost;

        if (!validateTransactionDate(inventoryState, date)) { // disallow multiple transactions in single day
          throw new Error("Multiple transaction per day is not allowed");
        }

        const newPurchase: TPurchase = { // create new purchase
            type: "purchase",
            id: generateId(),
            date,
            quantity: qty,
            totalCost: cost,
        };

        inventoryDispatch({ // update inventory
          type: TInventoryAction.add,
          payload: {
            transaction: newPurchase
          }
        })

        setPurchaseForm(purchaseFormInitial) // reset form
      } catch(err) {
        setError((err as Error).message)
      }
    };

    return (
        <>
          <form onSubmit={handlePurchaseSubmit}>
            <FormField label="Date">
              <input
                  type="date"
                  name="date"
                  value={purchaseForm.date}
                  onChange={ev => setPurchaseForm({ ...purchaseForm, date: ev.target.value })}
                  required
                />
            </FormField>
            <FormField label="Quantity">
              <input
                  type="number"
                  step="1"
                  min="1"
                  name="quantity"
                  value={purchaseForm.quantity}
                  onChange={ev => setPurchaseForm({ ...purchaseForm, quantity: parseInt(ev.target.value) })}
                  required
                />
            </FormField>
            <FormField label="Total Cost (RM)">
              <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="totalCost"
                  value={purchaseForm.totalCost}
                  onChange={ev => setPurchaseForm({ ...purchaseForm, totalCost: parseFloat(ev.target.value) })}
                  required
                />
            </FormField>
            <button type="submit">
              Add Purchase
            </button>
            {
              error && <div>{
                error
              }</div> 
            }
        </form>

        <Table headings={["Date (mm/dd/yyyy)", "ID", "Quantity", "Cost/Unit (RM)", "Total Cost (RM)", "WAC (Cumulative) (RM)", "Action"]}>
          {inventoryState.purchases.map((p) => (
              <Row key={p.id} transaction={p} columns={[
                {
                  attributes: {
                    name: "date",
                    type: "date",
                    defaultValue: p.date
                  },
                  renderValue: (value) => formatDate(value as string)
                },
                {
                  attributes: {
                    name: "id",
                    defaultValue: p.id
                  },
                  nonEditable: true
                },
                {
                  attributes: {
                    name: "quantity",
                    defaultValue: p.quantity,
                    type:"number",
                    step:"1",
                    min:"1"
                  },
                  formatValue: (value) => parseInt(value)
                },
                {
                  attributes: {
                    name: "costPerUnit",
                    defaultValue: (p.totalCost / p.quantity).toFixed(2)
                  },
                  nonEditable: true
                },
                {
                  attributes: {
                    name: "totalCost",
                    defaultValue: p.totalCost.toFixed(2),
                    type:"number",
                    step:"0.01",
                    min:"0.01",
                  },
                  formatValue: (value) => parseFloat(value)
                },
                {
                  attributes: {
                    name: "wac",
                    defaultValue: ((p.accumulate?.value || 0) / (p.accumulate?.stock || 0)).toFixed(2),
                  },
                  nonEditable: true
                }
              ]}/>
            ))}
        </Table>
      </>
    )
}