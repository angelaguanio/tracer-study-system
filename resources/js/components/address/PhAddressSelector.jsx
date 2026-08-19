import React, { useMemo } from 'react';
import { MapPin, Building, Home, Navigation } from 'lucide-react';
import {
  REGIONS,
  PROVINCES_BY_REGION,
  CITIES_BY_PROVINCE,
  BARANGAYS_BY_CITY,
} from '@/data/philippine-locations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PhAddressSelector({
  data = {},
  onChange = () => {},
  errors = {},
  className = '',
  isEditMode = false,
}) {

  // Available provinces based on region
  const availableProvinces = useMemo(() => {
    if (!data.region) return [];
    return PROVINCES_BY_REGION[data.region] || [];
  }, [data.region]);

  // Available cities based on province
  const availableCities = useMemo(() => {
    if (!data.province) return [];
    return CITIES_BY_PROVINCE[data.province] || [];
  }, [data.province]);

  // Available barangays based on city
  const availableBarangays = useMemo(() => {
    if (!data.city) return [];
    return BARANGAYS_BY_CITY[data.city] || [];
  }, [data.city]);

  // Handle Region Change -> Auto update province if NCR or clear subsequent selections
  const handleRegionChange = (val) => {
    const provinces = PROVINCES_BY_REGION[val] || [];
    let newProvince = '';
    if (val === 'NCR - National Capital Region') {
      newProvince = 'Metro Manila';
    } else if (provinces.length === 1) {
      newProvince = provinces[0];
    }
    onChange({
      ...data,
      region: val,
      province: newProvince,
      city: '',
      barangay: '',
    });
  };

  // Handle Province Change
  const handleProvinceChange = (val) => {
    onChange({
      ...data,
      province: val,
      city: '',
      barangay: '',
    });
  };

  // Handle City Change
  const handleCityChange = (val) => {
    onChange({
      ...data,
      city: val,
      barangay: '',
    });
  };

  // Handle Barangay Change
  const handleBarangayChange = (val) => {
    onChange({
      ...data,
      barangay: val,
    });
  };

  // Text inputs
  const handleTextChange = (field, val) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* ── 1. Text Fields (Manual Typing) ── */}
      <div className="flex flex-col gap-3">
        {/* Street Address / House Number */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">
            Street Address / House Number <span className="text-red-500">*</span>
          </label>
          <div
            className={`flex items-center gap-3 rounded-lg border bg-white px-3.5 py-2.5 transition-colors
              ${errors.street_address ? 'border-red-400' : 'border-gray-300 focus-within:border-blue-500'}`}
          >
            <Home className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type="text"
              name="street_address"
              placeholder="e.g. Blk 2 Lot 3, Avocado St."
              value={data.street_address || ''}
              onChange={(e) => handleTextChange('street_address', e.target.value)}
              className="flex-1 text-sm text-black placeholder:text-gray-400 focus:outline-none bg-transparent"
            />
          </div>
          {errors.street_address && (
            <p className="text-xs text-red-500 pl-1">{errors.street_address}</p>
          )}
        </div>

        {/* Subdivision / Village / Condo */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">
            Subdivision / Village / Condo <span className="text-gray-400 text-[11px]">(Optional)</span>
          </label>
          <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 focus-within:border-blue-500 transition-colors">
            <Building className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type="text"
              name="subdivision"
              placeholder="e.g. Greenfields Subdivision"
              value={data.subdivision || ''}
              onChange={(e) => handleTextChange('subdivision', e.target.value)}
              className="flex-1 text-sm text-black placeholder:text-gray-400 focus:outline-none bg-transparent"
            />
          </div>
          {errors.subdivision && (
            <p className="text-xs text-red-500 pl-1">{errors.subdivision}</p>
          )}
        </div>
      </div>

      {/* ── 2. Drop-Down Menus (Selection Fields) ── */}

        {/* Region */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">
            Region <span className="text-red-500">*</span>
          </label>
          <div className={`flex items-center gap-3 rounded-lg border bg-white px-3.5 transition-colors ${errors.region ? 'border-red-400' : 'border-gray-300'}`}>
            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
            <Select value={data.region || undefined} onValueChange={handleRegionChange}>
              <SelectTrigger className="flex-1 border-0 shadow-none px-0 py-2.5 text-sm text-black focus:ring-0 [&>span]:truncate bg-transparent">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {REGIONS.map((reg) => (
                  <SelectItem key={reg} value={reg}>
                    {reg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.region && <p className="text-xs text-red-500 pl-1">{errors.region}</p>}
        </div>

        {/* Province */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">
            Province <span className="text-red-500">*</span>
          </label>
          <div className={`flex items-center gap-3 rounded-lg border bg-white px-3.5 transition-colors ${errors.province ? 'border-red-400' : 'border-gray-300'} ${!data.region ? 'opacity-60 bg-gray-50' : ''}`}>
            <Navigation className="h-4 w-4 text-gray-400 shrink-0" />
            <Select
              value={data.province || undefined}
              onValueChange={handleProvinceChange}
              disabled={!data.region}
            >
              <SelectTrigger className="flex-1 border-0 shadow-none px-0 py-2.5 text-sm text-black focus:ring-0 [&>span]:truncate bg-transparent">
                <SelectValue placeholder={data.region ? 'Select Province' : 'Select Region first'} />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {availableProvinces.map((prov) => (
                  <SelectItem key={prov} value={prov}>
                    {prov}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.province && <p className="text-xs text-red-500 pl-1">{errors.province}</p>}
        </div>

        {/* City / Municipality */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">
            City / Municipality <span className="text-red-500">*</span>
          </label>
          <div className={`flex items-center gap-3 rounded-lg border bg-white px-3.5 transition-colors ${errors.city ? 'border-red-400' : 'border-gray-300'} ${!data.province ? 'opacity-60 bg-gray-50' : ''}`}>
            <Building className="h-4 w-4 text-gray-400 shrink-0" />
            {availableCities.length > 0 ? (
              <Select
                value={data.city || undefined}
                onValueChange={handleCityChange}
                disabled={!data.province}
              >
                <SelectTrigger className="flex-1 border-0 shadow-none px-0 py-2.5 text-sm text-black focus:ring-0 [&>span]:truncate bg-transparent">
                  <SelectValue placeholder={data.province ? 'Select City / Municipality' : 'Select Province first'} />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {availableCities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <input
                type="text"
                placeholder="Type City / Municipality"
                value={data.city || ''}
                disabled={!data.province}
                onChange={(e) => handleTextChange('city', e.target.value)}
                className="flex-1 text-sm text-black py-2.5 focus:outline-none bg-transparent"
              />
            )}
          </div>
          {errors.city && <p className="text-xs text-red-500 pl-1">{errors.city}</p>}
        </div>

        {/* Barangay */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">
            Barangay <span className="text-red-500">*</span>
          </label>
          <div className={`flex items-center gap-3 rounded-lg border bg-white px-3.5 transition-colors ${errors.barangay ? 'border-red-400' : 'border-gray-300'} ${!data.city ? 'opacity-60 bg-gray-50' : ''}`}>
            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
            {availableBarangays.length > 0 ? (
              <Select
                value={data.barangay || undefined}
                onValueChange={handleBarangayChange}
                disabled={!data.city}
              >
                <SelectTrigger className="flex-1 border-0 shadow-none px-0 py-2.5 text-sm text-black focus:ring-0 [&>span]:truncate bg-transparent">
                  <SelectValue placeholder={data.city ? 'Select Barangay' : 'Select City first'} />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {availableBarangays.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <input
                type="text"
                placeholder="Type Barangay"
                value={data.barangay || ''}
                disabled={!data.city}
                onChange={(e) => handleTextChange('barangay', e.target.value)}
                className="flex-1 text-sm text-black py-2.5 focus:outline-none bg-transparent"
              />
            )}
          </div>
          {errors.barangay && <p className="text-xs text-red-500 pl-1">{errors.barangay}</p>}
        </div>
      </div>
  );
}
