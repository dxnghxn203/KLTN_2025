import React from "react";

interface Customer {
  name: string;
  phone: string;
  amount: number;
}

const customers: Customer[] = [
  { name: "Susan Williams", phone: "879487946", amount: 834.74 },
  { name: "Jacob Peralta", phone: "879487946", amount: 354.53 },
  { name: "Bentley Howard", phone: "879487946", amount: 745.39 },
  { name: "Evelyn Johnson", phone: "879487946", amount: 293.54 },
  { name: "Susan Williams", phone: "879487946", amount: 546.34 },
];

const TopCustomers: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Top khách hàng</h2>
      <ul className="space-y-2">
        {customers.map((c, i) => (
          <li
            key={i}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-2">
              <img
                src={`https://i.pravatar.cc/150?u=${i}`}
                alt={c.name}
                className="w-10 h-10 rounded-full"
              />
            </div>
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-gray-500">{c.phone}</p>
            </div>
            <p className="font-semibold text-right">${c.amount.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopCustomers;
