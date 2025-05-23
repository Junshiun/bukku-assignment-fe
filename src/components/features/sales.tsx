import { FormEvent, useState } from "react";
import { formatDate, generateId, validateTransactionDate } from "../../utils";
import { TInventoryAction, useInventoryContext } from "../../context/inventoryContext";
import { Row } from "../shared/row";
import { Table } from "../shared/table";
import { FormField } from "../shared/formField";
import { Input } from "../shared/input";

export type TSale = {
  type: "sale";
  id: number | string;
  date: string; // yyyy-mm-dd
  quantity: number;
  totalAmount: number;
  totalCost?: number;
  salesPricePerUnit?: number;
  accumulate?: {
    stock: number;
    value: number;
  }
}

const saleFormInitial = { date: "", quantity: 0, totalAmount: 0 }

export const SalesForm = () => {

    const inventory = useInventoryContext();
    
    if (!inventory) {
      return;
    }

    const { inventoryState, inventoryDispatch } = inventory;

    const [saleForm, setSaleForm] = useState(saleFormInitial);
    const [error, setError] = useState<string | null>(null);

    const handleSaleSubmit = (ev: FormEvent) => {
      try {
        ev.preventDefault();

        const { date, quantity, totalAmount } = saleForm;

        const qty = quantity;
        const totalSales = totalAmount;

        if (!validateTransactionDate(inventoryState, date)) { // disallowed multiple transactions in single day
          throw new Error("Multiple transaction per day is not allowed");
        } else if (qty > inventoryState.stock) { // disallowed when not enough stocks
          throw new Error("Insufficient stock for sale");
        }

        const newSale: TSale = { // create new sale
            type: "sale",
            id: generateId(),
            date,
            quantity: qty,
            totalAmount: totalSales,
        };

        inventoryDispatch({ // update inventory
          type: TInventoryAction.add,
          payload: {
            transaction: newSale
          }
        });

        setSaleForm(saleFormInitial); // reset form
      } catch(err) {
        setError((err as Error).message)
      }
    };

    return (
        <>
          <form onSubmit={handleSaleSubmit}>
            <FormField label="Date">
              <Input<TSale>
                type="date"
                name="date"
                value={saleForm.date}
                onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
                required
              />
            </FormField>
            <FormField label="Quantity">
              <Input<TSale>
                type="number"
                min="1"
                name="quantity"
                value={isNaN(saleForm.quantity)? "": saleForm.quantity} // avoid input value NaN error
                onChange={(e) => setSaleForm({ ...saleForm, quantity: parseInt(e.target.value) })}
                required
              />
            </FormField>
            <FormField label="Total Amount (RM)">
              <Input<TSale>
                type="number"
                step="0.01"
                min="0"
                name="totalAmount"
                value={isNaN(saleForm.totalAmount)? "": saleForm.totalAmount}
                onChange={(e) => setSaleForm({ ...saleForm, totalAmount: parseFloat(e.target.value) })}
                required
              />
            </FormField>
            <button type="submit">
              Add Sale
            </button>
            {
              error && <div>{
                error
              }</div> 
            }
        </form>

        <Table headings={["Date (mm/dd/yyyy)", "ID", "Quantity", "Sales Price/Unit (RM)", "Total Amount (RM)", "Total Cost (RM)", "Action"]}>
          {inventoryState.sales.map(s => (
              <Row<TSale> key={s.id} transaction={s} columns={[
                {
                  attributes: {
                    name: "date",
                    type: "date",
                    defaultValue: s.date
                  },
                  renderValue: (value) => formatDate(value as string)
                },
                {
                  attributes: {
                    name: "id",
                    defaultValue: s.id,
                  },
                  nonEditable: true
                },
                {
                  attributes: {
                    name: "quantity",
                    defaultValue: s.quantity,
                    type:"number",
                    step:"1",
                    min:"1"
                  },
                  formatValue: (value) => parseInt(value)
                },
                {
                  attributes: {
                    name: "salesPricePerUnit",
                    defaultValue: (s.totalAmount / s.quantity).toFixed(2),
                  },
                  nonEditable: true
                },
                {
                  attributes: {
                    name: "totalAmount",
                    defaultValue: parseFloat(`${s.totalAmount}`).toFixed(2),
                    type:"number",
                    step:"0.01",
                    min:"0",
                  },
                  formatValue: (value) => parseFloat(value)
                },
                {
                  attributes: {
                    name: "totalCost",
                    defaultValue: parseFloat(`${s.totalCost}`).toFixed(2),
                  },
                  nonEditable: true
                }
              ]}/>
            ))}
        </Table>
      </>
    )
}