import { MapPin } from "lucide-react";
import AceUIDropdown, { DropdownAction } from "../input/AceUIDropdown";
import AceUICard from "./AceUICard";

export interface DeviceData {
  device_id: string;
  lokasi: string;
}

interface AceUILocationHeaderProps {
  devices: DeviceData[];
  selectedDevice: string;
  onDeviceChange: (deviceId: string) => void;
  city?: string;
}

export default function AceUILocationHeader({
  devices,
  selectedDevice,
  onDeviceChange,
  city = "Malang", 
}: AceUILocationHeaderProps) {
  
  const activeDevice = devices?.find((d) => d.device_id === selectedDevice);
  const activeName = activeDevice
    ? activeDevice.lokasi.replace(/\b\w/g, (l) => l.toUpperCase()) 
    : "Pilih titik pemantau";

  // Optional chaining (?.) dipakai untuk jaga-jaga kalau devices kosong agar tidak error
  const dropdownActions: DropdownAction[] = devices?.map((dev) => ({
    title: dev.lokasi.replace(/\b\w/g, (l) => l.toUpperCase()),
    onClick: () => onDeviceChange(dev.device_id),
  })) || [];

  return (
    <AceUICard>
      <div className="flex flex-row flex-wrap items-center gap-3">
        <h2 className="text-xl font-medium text-text/80 whitespace-nowrap">Lokasi:</h2>
        <div className="max-w-[130px] sm:max-w-none min-w-0">
          <AceUIDropdown title={activeName} actions={dropdownActions} />
        </div>
        <div className="ml-auto flex items-center gap-2 bg-primary text-background px-4 py-3 rounded-xl text-sm font-bold shadow-sm whitespace-nowrap">
          <MapPin size={18} />
          {city}
        </div>
      </div>
    </AceUICard>
  );
}