import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { formatDate, generateId, validateTransactionDate } from "./utils";
import { TInventory, TInventoryAction, useInventoryContext } from "./context";
import { Row } from "./row";
import { Table } from "./table";
import { Form } from "./form";

export type TSale = {
  type: "sale";
  id: number;
  date: string;
  quantity: number;
  salesPricePerUnit: number;
  totalAmount: number;
  totalCost?: number;
  accumulate?: {
    stock: number;
    value: number;
  }
}

const saleFormInitial = { date: '', quantity: '', salesPricePerUnit: '' }

export const SalesForm = () => {

    const inventory = useInventoryContext();
    
    if (!inventory) {
      return;
    }

    const { inventoryState, inventoryDispatch } = inventory;

    const [saleForm, setSaleForm] = useState(saleFormInitial);
    const [error, setError] = useState<string | null>(null);

    // Handle Sale Submission
    const handleSaleSubmit = (ev: FormEvent) => {
      try {
        ev.preventDefault();

        const { date, quantity, salesPricePerUnit } = saleForm;

        const qty = parseInt(quantity);
        const price = parseFloat(salesPricePerUnit);

        if (!validateTransactionDate(inventoryState, date)) {
          throw new Error("Multiple transaction per day is not allowed");
        } else if (qty > inventoryState.stock) {
          throw new Error("Insufficient stock for sale");
        }

        // if (!date || qty <= 0 || price <= 0 || qty > inventoryState.stock) return;

        // const totalCost = qty * inventoryState.wac;
        const totalAmount = qty * price;
        const newSale: TSale = {
            type: "sale",
            id: generateId(),
            date,
            quantity: qty,
            salesPricePerUnit: price,
            totalAmount,
            // totalCost,
        };

        // setInventory({
        //     ...inventory,
        //     sales: [...inventory.sales, newSale],
        //     stock: inventory.stock - qty,
        //     totalValue: inventory.totalValue - totalCost,
        // });

        inventoryDispatch({
          type: TInventoryAction.add,
          payload: {
            transaction: newSale
          }
        });

        setSaleForm(saleFormInitial);
      } catch(err) {
        setError((err as Error).message)
      }
    };

    return (
        <>
          <Form submit={handleSaleSubmit} inputs={[
            {
              label: "Date",
              element: <input
                type="date"
                name="date"
                value={saleForm.date}
                onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
                required
              />
            },
            {
              label: "Quantity",
              element: <input
                type="number"
                min="1"
                name="quantity"
                value={saleForm.quantity}
                onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                required
              />
            },
            {
              label: "Sales Price/Unit (RM)",
              element: <input
                type="number"
                step="0.01"
                min="0.01"
                name="cost"
                value={saleForm.salesPricePerUnit}
                onChange={(e) => setSaleForm({ ...saleForm, salesPricePerUnit: e.target.value })}
                required
              />
            }
          ]} button={{
            text: "Add Sale"
          }} error={{
            message: error
          }}/>
          
          {/* <form onSubmit={handleSaleSubmit}>
            <div className="flex flex-col">
              <label className="mb-1">Date:</label>
              <input
                type="date"
                name="date"
                value={saleForm.date}
                onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1">Quantity:</label>
              <input
                type="number"
                min="1"
                name="quantity"
                value={saleForm.quantity}
                onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1">Sales Price/Unit (RM):</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                name="cost"
                value={saleForm.salesPricePerUnit}
                onChange={(e) => setSaleForm({ ...saleForm, salesPricePerUnit: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
            >
              Add Sale
            </button>
            {
              error && <div>{error}</div> 
            }
          </form> */}

          <Table headings={["Date (yyyy-mm-dd)", "ID", "Quantity", "Sales/Unit (RM)", "Total Amount (RM)", "Total Cost (RM)", "Action"]}>
            {inventoryState.sales.map(s => (
                <Row key={s.id} transaction={s} initialValue={[
                  {
                    name: "date",
                    type: "date",
                    defaultValue: s.date
                  },
                  {
                    name: "id",
                    defaultValue: s.id,
                    nonEditable: true
                  },
                  {
                    name: "quantity",
                    defaultValue: s.quantity
                  },
                  {
                    name: "salesPricePerUnit",
                    defaultValue: parseFloat(`${s.salesPricePerUnit}`).toFixed(2)
                  },
                  {
                    name: "totalAmount",
                    defaultValue: parseFloat(`${s.totalAmount}`).toFixed(2),
                    nonEditable: true
                  },
                  {
                    name: "totalCost",
                    defaultValue: parseFloat(`${s.totalCost}`).toFixed(2),
                    nonEditable: true
                  }
                ]}/>
              ))}
          </Table>
        </>
    )
}