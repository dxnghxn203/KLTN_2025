import { useState, useCallback } from "react";
import TipTapEditor from "../../TextEditer.tsx/textEditer";

const General = () => {
  return (
    <div>
      <span>General</span>
      {/* Product Name */}
      <div className="space-y-5">
        <div className="pt-5">
          <label className="block font-medium mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Product Name"
            className="px-6 py-4 w-full rounded-xl border border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none basis-0 placeholder:font-normal"
          />
          <p className="text-sm mt-1">
            A product name is required and recommended to be unique.
          </p>
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <TipTapEditor />
          <p className="text-sm mt-1">
            Set a description to the product for better visibility.
          </p>
        </div>
      </div>
    </div>
  );
};

export default General;
