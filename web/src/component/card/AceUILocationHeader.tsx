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
      {/* Container utama dibuat items-center agar Kiri dan Kanan sejajar vertikal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* KIRI: Judul dan Dropdown */}
        <div className="flex flex-col justify-center">
          
          {/* Baris ini kita buat items-center agar teks dan dropdown benar-benar lurus */}
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-medium text-text/80 leading-none m-0">
              Stasiun Pemantau:
            </h2>
            
            {/* Bungkus dropdown agar tidak terpengaruh margin luar */}
            <div className="flex items-center">
              <AceUIDropdown 
                title={activeName} 
                actions={dropdownActions} 
              />
            </div>
          </div>
        </div>

        {/* KANAN: Ikon MapPin dan Kota */}
        <div className="flex items-center gap-2 bg-primary text-background px-4 py-3 rounded-xl text-sm font-bold w-fit shadow-sm">
          <MapPin size={18} />
          {city}
        </div>

      </div>
    </AceUICard>
  );
}