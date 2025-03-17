import { Menu, Transition } from "@headlessui/react";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { Fragment } from "react";
import Link from "next/link";

const AddNewDropdown = () => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="bg-[#1E4DB7] text-white px-2 py-2 rounded-lg hover:bg-[#173F98] text-sm flex items-center gap-1">
        <HiOutlinePlusSmall className="text-lg" />
        Add new
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow-lg focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link href="/product/create-single-product">
                <button
                  className={`${
                    active ? "bg-gray-100" : ""
                  } w-full text-left px-4 py-2 text-sm text-gray-700`}
                  onClick={() => console.log("Import a single product")}
                >
                  Import a single product
                </button>
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link href="/product/bulk-create-products">
                <button
                  className={`${
                    active ? "bg-gray-100" : ""
                  } w-full text-left px-4 py-2 text-sm text-gray-700`}
                  onClick={() => console.log("Import bulk file")}
                >
                  Import product file
                </button>
              </Link>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default AddNewDropdown;
