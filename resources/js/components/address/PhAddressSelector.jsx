import React, { useState, useEffect } from 'react';
import { MapPin, Building, Home, Navigation } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export default function PhAddressSelector({
  data = {},
  onChange = () => {},
  errors = {},
  className = '',
  isEditMode = false, // If needed for future pre-filling
  variant = 'default',
}) {
  const labelClass = variant === 'profile' 
    ? 'block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2' 
    : 'text-xs font-medium text-gray-700';
    
  const getContainerClass = (hasError) => {
    if (variant === 'profile') {
      return `flex items-center w-full border ${hasError ? 'border-red-400' : 'border-gray-200'} rounded-md px-4 py-1.5 text-[14px] text-gray-900 focus-within:ring-1 focus-within:ring-[#008542] focus-within:border-[#008542] transition shadow-sm bg-white`;
    }
    return `flex items-center gap-3 rounded-lg border bg-white px-4 py-2.5 transition-colors ${hasError ? 'border-red-400' : 'border-gray-400 focus-within:border-blue-500'}`;
  };

  const getSelectContainerClass = (hasError, isDisabled) => {
    let base = getContainerClass(hasError);
    // Adjust padding for select container to match select trigger
    if (variant === 'profile') base = base.replace('py-1.5', ''); 
    else base = base.replace('py-2.5', '');
    if (isDisabled) base += ' opacity-60 bg-gray-50';
    return base;
  };

  const inputClass = variant === 'profile'
    ? 'flex-1 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent w-full py-1.5'
    : 'flex-1 text-sm text-black placeholder:text-gray-500 focus:outline-none bg-transparent w-full py-1.5';
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [selectedRegionCode, setSelectedRegionCode] = useState('');
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
  const [selectedCityCode, setSelectedCityCode] = useState('');
  const [selectedBarangayCode, setSelectedBarangayCode] = useState('');

  const BASE_URL = 'https://psgc.gitlab.io/api';

  useEffect(() => {
    fetch(`${BASE_URL}/regions/`)
      .then(res => res.json())
      .then(data => setRegions(data.sort((a,b) => a.name.localeCompare(b.name))))
      .catch(err => console.error("Error fetching regions:", err));
  }, []);

  useEffect(() => {
    if (!selectedRegionCode) { setProvinces([]); setCities([]); setBarangays([]); return; }
    
    // NCR Edge Case (Code: 130000000)
    if (selectedRegionCode === '130000000') {
      setProvinces([{ code: 'NCR', name: 'Metro Manila' }]);
      fetch(`${BASE_URL}/regions/130000000/cities-municipalities/`)
        .then(res => res.json())
        .then(data => setCities(data.sort((a,b) => a.name.localeCompare(b.name))));
      return;
    }

    fetch(`${BASE_URL}/regions/${selectedRegionCode}/provinces/`)
      .then(res => res.json())
      .then(data => setProvinces(data.sort((a,b) => a.name.localeCompare(b.name))))
      .catch(err => console.error("Error fetching provinces:", err));
  }, [selectedRegionCode]);

  useEffect(() => {
    if (!selectedProvinceCode || selectedRegionCode === '130000000') {
       if (selectedRegionCode !== '130000000') setCities([]); 
       return; 
    }
    fetch(`${BASE_URL}/provinces/${selectedProvinceCode}/cities-municipalities/`)
      .then(res => res.json())
      .then(data => setCities(data.sort((a,b) => a.name.localeCompare(b.name))))
      .catch(err => console.error("Error fetching cities:", err));
  }, [selectedProvinceCode, selectedRegionCode]);

  useEffect(() => {
    if (!selectedCityCode) { setBarangays([]); return; }
    fetch(`${BASE_URL}/cities-municipalities/${selectedCityCode}/barangays/`)
      .then(res => res.json())
      .then(data => setBarangays(data.sort((a,b) => a.name.localeCompare(b.name))))
      .catch(err => console.error("Error fetching barangays:", err));
  }, [selectedCityCode]);

  const handleRegionChange = (code) => {
    const regionObj = regions.find(r => r.code === code);
    setSelectedRegionCode(code);
    setSelectedProvinceCode('');
    setSelectedCityCode('');
    onChange({
      ...data,
      country: 'Philippines',
      region: regionObj ? regionObj.name : '',
      province: '',
      city: '',
      barangay: '',
    });
  };

  const handleProvinceChange = (code) => {
    if (selectedRegionCode === '130000000') {
        setSelectedProvinceCode('NCR');
        onChange({ ...data, province: 'Metro Manila', city: '', barangay: '' });
        return;
    }
    const provObj = provinces.find(p => p.code === code);
    setSelectedProvinceCode(code);
    setSelectedCityCode('');
    onChange({
      ...data,
      province: provObj ? provObj.name : '',
      city: '',
      barangay: '',
    });
  };

  const handleCityChange = (code) => {
    const cityObj = cities.find(c => c.code === code);
    setSelectedCityCode(code);
    onChange({
      ...data,
      city: cityObj ? cityObj.name : '',
      barangay: '',
    });
  };

  const handleBarangayChange = (code) => {
    const brgyObj = barangays.find(b => b.code === code);
    setSelectedBarangayCode(code);
    onChange({
      ...data,
      barangay: brgyObj ? brgyObj.name : '',
    });
  };

  const handleTextChange = (field, val) => {
    onChange({ ...data, [field]: val });
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* ── 1. Text Fields (Manual Typing) ── */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className={labelClass}>
            Street Address / House Number <span className="text-red-500">*</span>
          </label>
          <div className={getContainerClass(errors.street_address)}>
            {variant !== 'profile' && <Home className="h-4 w-4 text-gray-500 shrink-0" />}
            <input
              type="text"
              name="street_address"
              placeholder="e.g. Blk 2 Lot 3, Avocado St."
              value={data.street_address || ''}
              onChange={(e) => handleTextChange('street_address', e.target.value)}
              className={inputClass}
            />
          </div>
          {errors.street_address && <p className="text-xs text-red-500 pl-1">{errors.street_address}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>
            Subdivision / Village / Condo <span className="text-gray-400 text-[11px]">(Optional)</span>
          </label>
          <div className={getContainerClass(errors.subdivision)}>
            {variant !== 'profile' && <Building className="h-4 w-4 text-gray-500 shrink-0" />}
            <input
              type="text"
              name="subdivision"
              placeholder="e.g. Greenfields Subdivision"
              value={data.subdivision || ''}
              onChange={(e) => handleTextChange('subdivision', e.target.value)}
              className={inputClass}
            />
          </div>
          {errors.subdivision && <p className="text-xs text-red-500 pl-1">{errors.subdivision}</p>}
        </div>
      </div>

      {/* ── 2. Drop-Down Menus (Selection Fields) ── */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>
          Region <span className="text-red-500">*</span>
        </label>
        <div className={getSelectContainerClass(errors.region, false)}>
          {variant !== 'profile' && <MapPin className="h-4 w-4 text-gray-500 shrink-0" />}
          <Select value={selectedRegionCode} onValueChange={handleRegionChange} disabled={regions.length === 0}>
            <SelectTrigger className="flex-1 border-0 shadow-none px-0 py-2.5 text-sm text-black focus:ring-0 [&>span]:truncate bg-transparent">
              <SelectValue placeholder={regions.length === 0 ? 'Loading Regions...' : 'Select Region'} />
            </SelectTrigger>
            <SelectContent className="max-h-56">
              {regions.map((reg) => (
                <SelectItem key={reg.code} value={reg.code}>{reg.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {errors.region && <p className="text-xs text-red-500 pl-1">{errors.region}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>
          Province <span className="text-red-500">*</span>
        </label>
        <div className={getSelectContainerClass(errors.province, !selectedRegionCode)}>
          {variant !== 'profile' && <Navigation className="h-4 w-4 text-gray-500 shrink-0" />}
          <Select value={selectedProvinceCode} onValueChange={handleProvinceChange} disabled={!selectedRegionCode}>
            <SelectTrigger className="flex-1 border-0 shadow-none px-0 py-2.5 text-sm text-black focus:ring-0 [&>span]:truncate bg-transparent">
              <SelectValue placeholder={!selectedRegionCode ? 'Select Region first' : 'Select Province'} />
            </SelectTrigger>
            <SelectContent className="max-h-56">
              {provinces.map((prov) => (
                <SelectItem key={prov.code} value={prov.code}>{prov.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {errors.province && <p className="text-xs text-red-500 pl-1">{errors.province}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>
          City / Municipality <span className="text-red-500">*</span>
        </label>
        <div className={getSelectContainerClass(errors.city, !selectedProvinceCode)}>
          {variant !== 'profile' && <Building className="h-4 w-4 text-gray-500 shrink-0" />}
          {cities.length > 0 ? (
            <Select value={selectedCityCode} onValueChange={handleCityChange} disabled={!selectedProvinceCode}>
              <SelectTrigger className="flex-1 border-0 shadow-none px-0 py-2.5 text-sm text-black focus:ring-0 [&>span]:truncate bg-transparent">
                <SelectValue placeholder={!selectedProvinceCode ? 'Select Province first' : 'Select City / Municipality'} />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {cities.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <input
              type="text"
              placeholder={!selectedProvinceCode ? 'Select Province first' : 'Type City / Municipality'}
              value={data.city || ''}
              disabled={!selectedProvinceCode}
              onChange={(e) => handleTextChange('city', e.target.value)}
              className={inputClass}
            />
          )}
        </div>
        {errors.city && <p className="text-xs text-red-500 pl-1">{errors.city}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>
          Barangay <span className="text-red-500">*</span>
        </label>
        <div className={getSelectContainerClass(errors.barangay, !selectedCityCode)}>
          {variant !== 'profile' && <MapPin className="h-4 w-4 text-gray-500 shrink-0" />}
          {barangays.length > 0 ? (
            <Select value={selectedBarangayCode} onValueChange={handleBarangayChange} disabled={!selectedCityCode}>
              <SelectTrigger className="flex-1 border-0 shadow-none px-0 py-2.5 text-sm text-black focus:ring-0 [&>span]:truncate bg-transparent">
                <SelectValue placeholder={!selectedCityCode ? 'Select City first' : 'Select Barangay'} />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {barangays.map((b) => (
                  <SelectItem key={b.code} value={b.code}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <input
              type="text"
              placeholder={!selectedCityCode ? 'Select City first' : 'Type Barangay'}
              value={data.barangay || ''}
              disabled={!selectedCityCode}
              onChange={(e) => handleTextChange('barangay', e.target.value)}
              className={inputClass}
            />
          )}
        </div>
        {errors.barangay && <p className="text-xs text-red-500 pl-1">{errors.barangay}</p>}
      </div>
    </div>
  );
}
