'use client';

import { useEffect, useState } from "react";
import {
  X,
  MapPin,
  Building2,
  CheckCircle2,
  Lock
} from "lucide-react";
import { DEFAULT_LOCATION } from "../constants";

const LOCATIONS = [
  {
    id: "manaparai",
    name: "Manaparai",
    display_name: "Manaparai, Tiruchirappalli, Tamil Nadu, India",
    lat: "10.6024",
    lng: "78.6135",
    status: "active"
  },
  {
    id: "trichy",
    name: "Trichy",
    display_name: "Tiruchirappalli, Tamil Nadu, India",
    status: "upcoming"
  },
  {
    id: "coimbatore",
    name: "Coimbatore",
    display_name: "Coimbatore, Tamil Nadu, India",
    status: "upcoming"
  }
];

export default function LocationPopup({ isOpen, onClose, onSelect }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    setSelectedLocation(saved ? JSON.parse(saved) : DEFAULT_LOCATION);
  }, []);

  const saveLocation = (loc) => {
    if (loc.status !== "active") return;

    const location = {
      name: loc.display_name,
      area: loc.name,
      coordinates: {
        lat: loc.lat,
        lng: loc.lng
      }
    };

    localStorage.setItem("userLocation", JSON.stringify(location));
    setSelectedLocation(location);
    onSelect(location);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-start pt-24">

      {/* 🔹 BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 🔹 POPUP CARD */}
+ <div className="bg-white text-gray-900 w-full max-w-md rounded-2xl shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold">Select Location</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Locations */}
        <div className="p-4 space-y-3">
          {LOCATIONS.map((loc) => {
            const isActive = loc.status === "active";
            const isSelected = selectedLocation?.area === loc.name;

            return (
              <div
                key={loc.id}
                onClick={() => saveLocation(loc)}
                className={`p-4 rounded-xl border flex justify-between items-center transition
                  ${
                    isActive
                      ? "cursor-pointer hover:bg-orange-50"
                      : "opacity-60 cursor-not-allowed"
                  }
                  ${isSelected ? "border-orange-400 bg-orange-50" : ""}
                `}
              >
                <div className="flex gap-3 items-center">
                  {isActive ? (
                    <MapPin className="text-orange-500" />
                  ) : (
                    <Building2 className="text-gray-400" />
                  )}
                  <div>
                    <p className="font-semibold">{loc.name}</p>
                    <p className="text-xs text-gray-500">
                      {loc.display_name}
                    </p>
                  </div>
                </div>

                {isActive ? (
                  isSelected && (
                    <CheckCircle2 className="text-orange-500" />
                  )
                ) : (
                  <span className="flex items-center gap-1 text-xs bg-gray-200 px-2 py-1 rounded">
                    <Lock className="w-3 h-3" /> Coming Soon
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
