import { useState, useEffect } from 'react';
import { PurchasesForm, TPurchase } from './purchases';
import { SalesForm, TSale } from './sales';
import "./App.css"
import { InventoryProvider } from './context';

// Main Component
const App = () => {
  const [tab, setTab] = useState<'purchases' | 'sales'>('purchases');

  // const [inventory, setInventory] = useState<TInventory>(() => {
  //   const saved = localStorage.getItem('inventory');
  //   return saved
  //     ? JSON.parse(saved)
  //     : { purchases: [], sales: [], stock: 0, wac: 0, totalValue: 0 };
  // });

  // // Save to localStorage
  // useEffect(() => {
  //   localStorage.setItem('inventory', JSON.stringify(inventory));
  // }, [inventory]);

 return (
    <div className="w-6xl max-w-full mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">WAC System</h1>
      <InventoryProvider>
        <div className="flex gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${tab === 'purchases' ? '!bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTab('purchases')}
          >
            Purchases
          </button>
          <button
            className={`px-4 py-2 rounded-md ${tab === 'sales' ? '!bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTab('sales')}
          >
            Sales
          </button>
        </div>

        <div className="w-full grid grid-cols-[20rem_1fr] gap-4">
        {tab === 'purchases' && <PurchasesForm />}

        {tab === 'sales' && <SalesForm />}
        </div>
      </InventoryProvider>
    </div>
  );
};

export default App;