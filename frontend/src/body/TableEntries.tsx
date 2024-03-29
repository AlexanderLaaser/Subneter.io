import TableEntry from "./TableEntry";
import { generateNextSubnet, getIpaddressesCount } from "../api/calls";
import UsedSubnetIpAddressCidrStore from "../store/UsedSubnetIpAddressCidrStore";
import VnetIpStartStore from "../store/VnetInputStore";
import useTableEntriesStore from "../store/TabelEntriesStore";
import { useEffect } from "react";

function AddButton() {
  useEffect(() => {
    console.log("TableEntries:");
    console.log(tableEntriesStore);
    console.log("UsedRanges");
    console.log(usedIpaddressesCidr);
  });

  // Store functions
  const { vnet } = VnetIpStartStore((state) => ({
    vnet: state.vnet,
  }));

  const {
    addUsedIpAddressCidrStore,
    usedIpaddressesCidr,
    removeIpAddressCidrStore,
  } = UsedSubnetIpAddressCidrStore((state) => ({
    addUsedIpAddressCidrStore: state.addIpAddressCidr,
    removeIpAddressCidrStore: state.removeIpAddressCidr,
    usedIpaddressesCidr: state.usedIpaddressesCidr,
  }));

  const {
    addTableEntryStore,
    deleteTableEntryStore,
    updateTableEntryStore,
    tableEntriesStore,
  } = useTableEntriesStore((state) => ({
    addTableEntryStore: state.addTableEntry,
    deleteTableEntryStore: state.deleteTableEntry,
    getTableEntryStore: state.getTableEntry,
    updateTableEntryStore: state.updateTableEntry,
    tableEntriesStore: state.tableEntries,
  }));

  const handleAddClick = async () => {
    const size = 26;
    const newTableEntry = await createNewTableEntry(size);

    addTableEntryStore(newTableEntry);
    addUsedIpAddressCidrStore(newTableEntry.range.split(" - ")[0] + "/" + size);
  };

  const createNewTableEntry = async (size: number) => {
    const ips = await getIpaddressesCount(size);
    const range = await generateNextSubnet(
      vnet.vnetIpStart + "/" + vnet.vnetSuffix,
      size,
      usedIpaddressesCidr
    );

    const newTableEntry = {
      ips,
      range,
      size,
      subnetName: "",
    };

    return newTableEntry;
  };

  const updateSubnetName = (id: number, subnetName: string) => {
    updateTableEntryStore({ id, subnetName });
  };

  // Adding ips to tableEntry state
  const updateIps = async (id: number, size: number) => {
    try {
      const ips = await getIpaddressesCount(size);

      const usedIpAddressesWithoutOwnRange = usedIpaddressesCidr.filter(
        (ele, ind) => ind !== id
      );

      // Calling backend api to receive ip range for given cidr
      const range = await generateNextSubnet(
        vnet.vnetIpStart + "/" + vnet.vnetSuffix,
        size,
        usedIpAddressesWithoutOwnRange
      );

      updateTableEntryStore({ id, size, ips, range });
      addUsedIpAddressCidrStore(range.split(" - ")[0] + "/" + size, id);
    } catch (error) {
      throw error;
    }
  };

  // not used at the moment -> Meant for updating exisiting ip ranges when clicked on delete
  const refreshSizeOfExistingEntries = async () => {
    tableEntriesStore.forEach((entry) => {
      updateIps(entry.id, entry.size);
    });
  };

  const deleteTableEntry = (id: number) => {
    deleteTableEntryStore(id);
    removeIpAddressCidrStore(id);
    //console.log("ausgeführt!");
    //refreshSizeOfExistingEntries();
  };

  // Rendering TableEntries depending on amount of value of Table Entries
  const renderTableEntries = () => {
    return tableEntriesStore.map((entry) => (
      <TableEntry
        key={entry.id}
        id={entry.id}
        subnetName={entry.subnetName}
        size={entry.size}
        ips={entry.ips}
        range={entry.range}
        updateSubnetName={updateSubnetName}
        updateIps={updateIps}
        deleteTableEntry={() => deleteTableEntry(entry.id)}
        totalEntries={tableEntriesStore.length}
      />
    ));
  };

  return (
    <>
      {renderTableEntries()}{" "}
      <div className="flex justify-center">
        <div className=" flex pl-2 content-center items-center mt-4 font-montserrat">
          <button
            className="inline-flex items-center justify-center w-32 h-10 mr-2 text-slate-50 transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-orange-600"
            onClick={handleAddClick}
          >
            <span className="text-l">Add Subnet</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default AddButton;
