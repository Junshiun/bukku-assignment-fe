import { InventoryInitial, TInventory, TInventoryAction } from "./context";
import { TPurchase } from "./purchases";
import { TSale } from "./sales";

export const formatDate = (date: string) => new Date(date).toLocaleDateString('en-GB');
export const generateId = () => Date.now();

export const isPurchase = (transaction: TPurchase | TSale): transaction is TPurchase => {
  return (transaction as TPurchase).type === 'purchase';
}

export const isSale = (transaction: TPurchase | TSale): transaction is TSale => {
  return (transaction as TSale).type === 'sale';
}

export const recalculate = (inventory: TInventory, newTransaction: TPurchase | TSale, type: TInventoryAction) => {

  let updateTransaction = [...inventory.purchases, ...inventory.sales];

  switch (type) {
    case TInventoryAction.add:
      updateTransaction.push(newTransaction);
      break;
    case TInventoryAction.edit:
      updateTransaction[updateTransaction.findIndex(transaction => transaction.id === newTransaction.id)] = newTransaction;
      break;
    case TInventoryAction.delete:
      updateTransaction = updateTransaction.filter(transaction => transaction.id !== newTransaction.id);
      if (updateTransaction.length < 1) {
        return InventoryInitial
      }
      break;
  }

  const allTransactions = updateTransaction.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const affectedTransactionsStartIndex = allTransactions.findIndex(transaction => new Date(transaction.date).getTime() >= new Date(newTransaction.date).getTime());

  const lastUnaffectedTransaction = affectedTransactionsStartIndex > 0 ? allTransactions[affectedTransactionsStartIndex - 1] : null;

  const updatedPurchases: TPurchase[] = [];
  const updatedSales: TSale[] = [];

  allTransactions.slice(0, affectedTransactionsStartIndex).forEach(transaction => {
    if (isPurchase(transaction)) {
      updatedPurchases.push(transaction);
    } else {
      updatedSales.push(transaction);
    }
  })

  let accumulateStock = lastUnaffectedTransaction?.accumulate?.stock || 0;
  let accumulateValue = lastUnaffectedTransaction?.accumulate?.value || 0;
  let wac = accumulateStock > 0? (accumulateValue / accumulateStock): 0;

  if (affectedTransactionsStartIndex > 0) {
    for (let i=affectedTransactionsStartIndex; i<allTransactions.length; i++) {
      const transaction = allTransactions[i];

      if (isPurchase(transaction)) {
        accumulateStock += +transaction.quantity;
        const totalValue = transaction.costPerUnit * transaction.quantity;

        accumulateValue += totalValue;
        wac = accumulateValue / accumulateStock;
        updatedPurchases.push({ ...transaction,
          costPerUnit: transaction.costPerUnit,
          totalValue: totalValue,
          accumulate: {
            stock: accumulateStock,
            value: accumulateValue
        }});
      } else {
        if (accumulateStock >= transaction.quantity) {
          const totalCost = transaction.quantity * wac; // Recalculate totalCost based on current WAC
          accumulateStock -= transaction.quantity;
          accumulateValue -= totalCost;
          updatedSales.push({ 
            ...transaction, 
            totalCost,
            totalAmount: transaction.quantity * transaction.salesPricePerUnit,
            accumulate: { 
              stock: accumulateStock, 
              value: accumulateValue 
            } });
        } else {
          throw new Error('Insufficient stock for sale');
        }
      }
    }
  }

  return {
    purchases: updatedPurchases,
    sales: updatedSales,
    stock: accumulateStock,
    wac,
    accumulateValue,
  };
}

// only one transaction per day is allowed
export const validateTransactionDate = (inventory: TInventory, date: string) => {
  return ![...inventory.purchases, ...inventory.sales].some((transaction) => transaction.date === date);
};