import { InventoryInitial, TInventory, TInventoryAction } from "./context/inventoryContext";
import { TPurchase } from "./components/features/purchases";
import { TSale } from "./components/features/sales";

export const formatDate = (date: string) => { // mm/dd/yyyy (same as default date input)
  const newDate = new Date(date);

  return `${(newDate.getMonth() + 1).toString().padStart(2, "0")}/${newDate.getDate().toString().padStart(2, "0")}/${newDate.getFullYear()}` 
};

export const generateId = () => Date.now();

export const isPurchase = (transaction: TPurchase | TSale): transaction is TPurchase => {
  return (transaction as TPurchase).type === 'purchase';
}

export const isSale = (transaction: TPurchase | TSale): transaction is TSale => {
  return (transaction as TSale).type === 'sale';
}

export const recalculate = (inventory: TInventory, newTransaction: TPurchase | TSale, type: TInventoryAction) => {

  let updateTransaction = [...inventory.purchases, ...inventory.sales]; // combine all previous transaction

  switch (type) {
    case TInventoryAction.add:
      updateTransaction.push(newTransaction); // add new transaction
      break;
    case TInventoryAction.edit:
      updateTransaction[updateTransaction.findIndex(transaction => transaction.id === newTransaction.id)] = newTransaction; // replace old transaction with new transaction
      break;
    case TInventoryAction.delete:
      updateTransaction = updateTransaction.filter(transaction => transaction.id !== newTransaction.id); // delete target transaction
      if (updateTransaction.length < 1) { // return if no transaction after deletion
        return InventoryInitial
      }
      break;
  }

  const allTransactions = updateTransaction.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let affectedTransactionsStartIndex = allTransactions.findIndex(transaction => new Date(transaction.date).getTime() >= new Date(newTransaction.date).getTime());

  affectedTransactionsStartIndex = affectedTransactionsStartIndex >= 0? affectedTransactionsStartIndex: allTransactions.length;

  const lastUnaffectedTransaction = allTransactions[affectedTransactionsStartIndex - 1];

  const updatedPurchases: TPurchase[] = [];
  const updatedSales: TSale[] = [];

  allTransactions.slice(0, affectedTransactionsStartIndex).forEach(transaction => { // collect and categorise all unaffected transactions
    if (isPurchase(transaction)) {
      updatedPurchases.push(transaction);
    } else {
      updatedSales.push(transaction);
    }
  })

  let accumulateStock = lastUnaffectedTransaction?.accumulate?.stock || 0;
  let accumulateValue = lastUnaffectedTransaction?.accumulate?.value || 0;
  let wac = accumulateStock > 0? (accumulateValue / accumulateStock): 0;

  if (affectedTransactionsStartIndex >= 0) { // skip below logic for delete action
    for (let i=affectedTransactionsStartIndex; i<allTransactions.length; i++) { // starts from new transaction
      const transaction = allTransactions[i];

      if (isPurchase(transaction)) {
        accumulateStock += +transaction.quantity;
        accumulateValue += +transaction.totalCost;
        wac = accumulateValue / accumulateStock;
        updatedPurchases.push({ ...transaction,
          accumulate: {
            stock: accumulateStock,
            value: accumulateValue
        }});
      } else {
        if (accumulateStock >= transaction.quantity) {
          const totalCost = transaction.quantity * wac;
          accumulateStock -= transaction.quantity;
          accumulateValue -= totalCost;
          updatedSales.push({ 
            ...transaction, 
            totalCost,
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

export const validateTransactionDate = (inventory: TInventory, date: string) => { // only one transaction per day is allowed
  return ![...inventory.purchases, ...inventory.sales].some((transaction) => transaction.date === date);
};