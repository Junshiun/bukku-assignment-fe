import { InventoryInitial, TInventory, TInventoryAction } from "../context/inventoryContext";
import { TPurchase } from "../components/features/purchases";
import { TSale } from "../components/features/sales";
import { recalculate } from "../utils";

describe('recalculate', () => {
  const initialInventory: TInventory = {
    purchases: [],
    sales: [],
    stock: 0,
    wac: 0,
    accumulateValue: 0,
  };

  describe('add action', () => {
    it('adds a new purchase correctly', () => {
      const newPurchase: TPurchase = {
        type: "purchase",
        id: '1',
        date: '2025-01-01',
        quantity: 10,
        // costPerUnit: 5,
        totalCost: 50
      };
      const result = recalculate(initialInventory, newPurchase, TInventoryAction.add);

      expect(result.purchases).toHaveLength(1);
      expect(result.purchases[0]).toEqual({
        ...newPurchase,
        accumulate: { stock: 10, value: 50 },
      });
      expect(result.sales).toHaveLength(0);
      expect(result.stock).toBe(10);
      expect(result.wac).toBe(5);
      expect(result.accumulateValue).toBe(50);
    });

    it('adds a new sale correctly with existing stock', () => {
      const inventoryWithStock: TInventory = {
        ...InventoryInitial,
        purchases: [{ 
            type: "purchase",
            id: '1', 
            date: '2025-01-01', 
            quantity: 10, 
            // costPerUnit: 5, 
            totalCost: 50, 
            accumulate: { 
                stock: 10, 
                value: 50 
            } 
        }],
      };
      const newSale: TSale = {
        type: "sale",
        id: '2',
        date: '2025-01-02',
        quantity: 4,
        // salesPricePerUnit: 10,
        totalAmount: 40
      };
      const result = recalculate(inventoryWithStock, newSale, TInventoryAction.add);

      expect(result.sales).toHaveLength(1);
      expect(result.sales[0]).toEqual({
        ...newSale,
        totalCost: 20, // 4 * 5 (wac from purchase)
        accumulate: { stock: 6, value: 30 },
      });
      expect(result.stock).toBe(6);
      expect(result.wac).toBe(5);
      expect(result.accumulateValue).toBe(30);
    });

    it('throws error when adding sale with insufficient stock', () => {
      const newSale: TSale = {
        type: "sale",
        id: '1',
        date: '2025-01-01',
        quantity: 5,
        // salesPricePerUnit: 10,
        totalAmount: 50
      };
      expect(() => recalculate(initialInventory, newSale, TInventoryAction.add)).toThrow('Insufficient stock for sale');
    });
  });

  describe('edit action', () => {
    it('edits an existing purchase', () => {
      const inventory: TInventory = {
        ...InventoryInitial,
        purchases: [{ 
            type: "purchase",
            id: '1', 
            date: '2025-01-01', 
            quantity: 10, 
            // costPerUnit: 5, 
            totalCost: 50, 
            accumulate: { 
                stock: 10, 
                value: 50 
            } 
        }]
      };
      const editedPurchase: TPurchase = {
        type: "purchase",
        id: '1',
        date: '2025-01-01',
        quantity: 20,
        // costPerUnit: 6,
        totalCost: 120
      };
      const result = recalculate(inventory, editedPurchase, TInventoryAction.edit);

      expect(result.purchases[0]).toEqual({
        ...editedPurchase,
        accumulate: { stock: 20, value: 120 },
      });
      expect(result.stock).toBe(20);
      expect(result.wac).toBe(6);
      expect(result.accumulateValue).toBe(120);
    });
  });

  describe('delete action', () => {
    it('deletes a transaction and returns initial inventory if empty', () => {
      const inventory: TInventory = {
        ...initialInventory,
        purchases: [{
            type: "purchase",
            id: '1', 
            date: '2025-01-01', 
            quantity: 10, 
            // costPerUnit: 5, 
            totalCost: 50, 
            accumulate: {
                stock: 10, 
                value: 50 
            } }],
      };
      const transactionToDelete: TPurchase = { 
        type: "purchase",
        id: '1', 
        date: '2025-01-01', 
        quantity: 10,
        // costPerUnit: 5,
        totalCost: 50
      };
      const result = recalculate(inventory, transactionToDelete, TInventoryAction.delete);

      expect(result).toEqual(InventoryInitial);
    });

    it('deletes a sale and recalculates remaining transactions', () => {
      const inventory: TInventory = {
        ...initialInventory,
        purchases: [{
            type: "purchase",
            id: '1', 
            date: '2025-01-01', 
            quantity: 10, 
            // costPerUnit: 5, 
            totalCost: 50, 
            accumulate: { 
                stock: 10, 
                value: 50 
            } 
        }],
        sales: [{ 
            type: "sale",
            id: '2', 
            date: '2025-01-02', 
            quantity: 4, 
            // salesPricePerUnit: 10, 
            totalCost: 20, 
            totalAmount: 40, 
            accumulate: { 
                stock: 6, 
                value: 30 
            } }],
      };
      const transactionToDelete: TSale = { 
        type: "sale",
        id: '2', 
        date: '2025-01-02', 
        quantity: 4, 
        // salesPricePerUnit: 10,
        totalAmount: 40
      };
      const result = recalculate(inventory, transactionToDelete, TInventoryAction.delete);

      expect(result.sales).toHaveLength(0);
      expect(result.purchases[0].accumulate).toEqual({ stock: 10, value: 50 });
      expect(result.stock).toBe(10);
      expect(result.wac).toBe(5);
      expect(result.accumulateValue).toBe(50);
    });
  });

  describe('combined action', () => {
    it('sample scenario from question', () => {
      const inventoryWithStock: TInventory = InventoryInitial;

      const newPurchase01: TPurchase = {
        type: "purchase",
        id: '1',
        date: '2022-01-01',
        quantity: 150,
        // costPerUnit: 5,
        totalCost: 300
      };

      let result = recalculate(inventoryWithStock, newPurchase01, TInventoryAction.add);
      expect(result.wac).toBe(2);

      const newPurchase02: TPurchase = {
        type: "purchase",
        id: '2',
        date: '2022-01-05',
        quantity: 10,
        // costPerUnit: 5,
        totalCost: 15
      };

      result = recalculate(result, newPurchase02, TInventoryAction.add);
      expect(Number(result.wac.toFixed(2))).toBe(1.97);

      const newSale: TSale = {
        type: "sale",
        id: '3',
        date: '2025-01-07',
        quantity: 5,
        // salesPricePerUnit: 10,
        totalAmount: 9.85
      };

      result = recalculate(result, newSale, TInventoryAction.add);
      expect(Number(result.wac.toFixed(2))).toBe(1.97);
      expect(result.stock).toBe(155);
      expect(Number(result.accumulateValue.toFixed(2))).toBe(305.16);
    })
  })
});