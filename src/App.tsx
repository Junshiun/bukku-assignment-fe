import { useState } from "react";
import { PurchasesForm } from "./components/features/purchases";
import { SalesForm } from "./components/features/sales";
import "./App.css"
import { InventoryProvider } from "./context/inventoryContext";

// Main Component
const App = () => {
  const [tab, setTab] = useState<"purchases" | "sales">("purchases");

 return (
    <div className="w-fit max-w-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center">WAC System</h1>
      <InventoryProvider>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-md ${tab === "purchases" ? "!bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setTab("purchases")}
          >
            Purchases
          </button>
          <button
            className={`px-4 py-2 rounded-md ${tab === "sales" ? "!bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setTab("sales")}
          >
            Sales
          </button>
        </div>

        <div className="w-full md:grid md:grid-cols-[20rem_1fr] gap-4">
        {tab === "purchases" && <PurchasesForm />}

        {tab === "sales" && <SalesForm />}
        </div>
      </InventoryProvider>
    </div>
  );
};

export default App;