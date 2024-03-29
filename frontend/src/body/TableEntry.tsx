import { useState } from "react";
import SizeSelect from "./SizeSelect";

interface InterfaceTableEntryProps {
  id: number;
  subnetName: string;
  size: number;
  ips: string;
  range: string;
  updateSubnetName: (id: number, description: string) => void;
  updateIps: (id: number, size: number) => void;
  deleteTableEntry: () => void;
  totalEntries: number;
}

function TableEntry({
  id,
  subnetName,
  size,
  ips,
  range,
  updateSubnetName,
  updateIps,
  deleteTableEntry,
  totalEntries,
}: InterfaceTableEntryProps) {
  const [error, setError] = useState("");
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateSubnetName(id, event.target.value);
  };

  const handleSizeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    try {
      await updateIps(id, parseInt(event.target.value));
      setError("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <>
      <div className="flex justify-center content-center w-full">
        <div className="flex items-center font-montserrat w-full max-w-screen-md bg-white mt-3 rounded-lg h-12 ml-10">
          <div className="flex pl-4 flex-initial w-5/12">
            <input
              value={subnetName}
              onChange={handleDescriptionChange}
              className="w-60 outline-none"
              placeholder="Name"
            ></input>
          </div>
          <div className="flex pl-6 flex-initial w-28 w-min-28">
            <SizeSelect
              elementID={"ip_size_input"}
              defaultValue={size}
              tailWindConfig={
                "w-18 h-8 outline-none border border-grey text-sm rounded-lg focus:border-orange-600"
              }
              onChangeFunction={handleSizeChange}
            ></SizeSelect>
          </div>
          <div className="flex pl-6 flex-initial w-28 text-blue-700 font-bold">
            {ips}
          </div>
          {error ? (
            <div className="flex pl-6 flex-initial w-80 text-red-500 font-bold">
              {error}
            </div>
          ) : (
            <div className="flex pl-6 flex-initial w-80 ">{range}</div>
          )}
        </div>

        <div className=" flex pl-2 items-center justify-center mt-3">
          <button
            className="inline-flex items-center justify-center w-6 h-6 mr-2 text-slate-50 transition-colors duration-150 bg-red-700 rounded-lg focus:shadow-outline hover:bg-orange-600"
            onClick={deleteTableEntry}
          >
            <span className="text-2xl h-10">-</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default TableEntry;
