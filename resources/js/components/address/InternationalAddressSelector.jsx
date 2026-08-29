import React, { useState, useEffect } from 'react';
import { MapPin, Building, Home, Navigation, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export default function InternationalAddressSelector({
  data = {},
  onChange = () => {},
  errors = {},
  className = '',
}) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const API_KEY = import.meta.env.VITE_CSC_API_KEY;
  const headers = { 'X-CSCAPI-KEY': API_KEY };
  const BASE_URL = 'https://api.countrystatecity.in/v1';

  const [selectedCountryIso, setSelectedCountryIso] = useState('');
  const [selectedStateIso, setSelectedStateIso] = useState('');

  // Fetch Countries on mount
  useEffect(() => {
    if (!API_KEY) return;
    fetch(`${BASE_URL}/countries`, { headers })
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(err => console.error("Error fetching countries:", err));
  }, [API_KEY]);

  // Fetch States when Country changes
  useEffect(() => {
    if (!selectedCountryIso || !API_KEY) {
      setStates([]);
      return;
    }
    fetch(`${BASE_URL}/countries/${selectedCountryIso}/states`, { headers })
      .then(res => res.json())
      .then(data => setStates(data))
      .catch(err => console.error("Error fetching states:", err));
  }, [selectedCountryIso, API_KEY]);

  // Fetch Cities when State changes
  useEffect(() => {
    if (!selectedCountryIso || !selectedStateIso || !API_KEY) {
      setCities([]);
      return;
    }
    fetch(`${BASE_URL}/countries/${selectedCountryIso}/states/${selectedStateIso}/cities`, { headers })
      .then(res => res.json())
      .then(data => setCities(data))
      .catch(err => console.error("Error fetching cities:", err));
  }, [selectedCountryIso, selectedStateIso, API_KEY]);

  // Handle Country Selection
  const handleCountryChange = (iso2) => {
    const countryObj = countries.find(c => c.iso2 === iso2);
    setSelectedCountryIso(iso2);
    setSelectedStateIso('');
    onChange({
      ...data,
      country: countryObj ? countryObj.name : '',
      province: '', // we map state to province in DB
      city: '',
      region: '', // not used
      barangay: '', // not used
    });
  };

  // Handle State Selection
  const handleStateChange = (iso2) => {
    const stateObj = states.find(s => s.iso2 === iso2);
    setSelectedStateIso(iso2);
    onChange({
      ...data,
      province: stateObj ? stateObj.name : '',
      city: '',
    });
  };

  // Handle City Selection
  const handleCityChange = (cityName) => {
    onChange({ ...data, city: cityName });
  };

  const handleTextChange = (field, val) => {
    onChange({ ...data, [field]: val });
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* ── API KEY WARNING ── */}
      {!API_KEY && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
          <strong>Missing API Key!</strong> Please add <code>VITE_CSC_API_KEY</code> to your .env file to enable international address fetching.
        </div>
      )}

      {/* ── 1. Text Fields ── */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">
            Street Address / House Number / ZIP Code <span className="text-red-500">*</span>
          </label>
          <div className={`flex items-center gap-3 rounded-lg border bg-white px-4 py-2.5 transition-colors ${errors.street_address ? 'border-red-400' : 'border-gray-400 focus-within:border-blue-500'}`}>
            <Home className="h-4 w-4 text-gray-500 shrink-0" />
            <input
              type="text"
              name="street_address"
              placeholder="e.g. 123 Main St, 90210"
              value={data.street_address || ''}
              onChange={(e) => handleTextChange('street_address', e.target.value)}
              className="flex-1 text-sm text-black placeholder:text-gray-500 focus:outline-none bg-transparent"
            />
          </div>
          {errors.street_address && <p className="text-xs text-red-500 pl-1">{errors.street_address}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">
            Building / Apartment <span className="text-gray-400 text-[11px]">(Optional)</span>
          </label>
          <div className="flex items-center gap-3 rounded-lg border bg-white px-4 py-2.5 border-gray-400 focus-within:border-blue-500 transition-colors">
            <Building className="h-4 w-4 text-gray-500 shrink-0" />
            <input
              type="text"
              name="subdivision"
              placeholder="e.g. Apt 4B"
              value={data.subdivision || ''}
              onChange={(e) => handleTextChange('subdivision', e.target.value)}
              className="flex-1 text-sm text-black placeholder:text-gray-500 focus:outline-none bg-transparent"
            />
          </div>
          {errors.subdivision && <p className="text-xs text-red-500 pl-1">{errors.subdivision}</p>}
        </div>
      </div>

      {/* ── 2. Dropdowns ── */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700">
          Country <span className="text-red-500">*</span>
        </label>
        <div className={`flex items-center gap-3 rounded-lg border bg-white px-4 transition-colors ${errors.country ? 'border-red-400' : 'border-gray-400 focus-within:border-blue-500'}`}>
          <Globe className="h-4 w-4 text-gray-500 shrink-0" />
          <Select value={selectedCountryIso} onValueChange={handleCountryChange} disabled={countries.length === 0}>
            <SelectTrigger className="flex-1 border-0 shadow-none px-0 py-2.5 text-sm text-black focus:ring-0 [&>span]:truncate bg-transparent">
              <SelectValue placeholder={countries.length === 0 ? 'Loading Countries...' : 'Select Country'} />
            </SelectTrigger>
            <SelectContent className="max-h-56">
              {countries.map((c) => (
                <SelectItem key={c.iso2} value={c.iso2}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {errors.country && <p className="text-xs text-red-500 pl-1">{errors.country}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700">
          State / Province <span className="text-red-500">*</span>
        </label>
        <div className={`flex items-center gap-3 rounded-lg border bg-white px-4 transition-colors ${errors.province ? 'border-red-400' : 'border-gray-400 focus-within:border-blue-500'} ${!selectedCountryIso ? 'opacity-60 bg-gray-50' : ''}`}>
          <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
          {states.length > 0 ? (
            <Select value={selectedStateIso} onValueChange={handleStateChange} disabled={!selectedCountryIso}>
              <SelectTrigger className="flex-1 border-0 shadow-none px-0 py-2.5 text-sm text-black focus:ring-0 [&>span]:truncate bg-transparent">
                <SelectValue placeholder={!selectedCountryIso ? 'Select Country first' : 'Select State/Province'} />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {states.map((s) => (
                  <SelectItem key={s.iso2} value={s.iso2}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <input
              type="text"
              placeholder={!selectedCountryIso ? 'Select Country first' : 'Type State/Province'}
              value={data.province || ''}
              disabled={!selectedCountryIso}
              onChange={(e) => handleTextChange('province', e.target.value)}
              className="flex-1 text-sm text-black py-2.5 focus:outline-none bg-transparent"
            />
          )}
        </div>
        {errors.province && <p className="text-xs text-red-500 pl-1">{errors.province}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700">
          City <span className="text-red-500">*</span>
        </label>
        <div className={`flex items-center gap-3 rounded-lg border bg-white px-4 transition-colors ${errors.city ? 'border-red-400' : 'border-gray-400 focus-within:border-blue-500'} ${!selectedStateIso && states.length > 0 ? 'opacity-60 bg-gray-50' : ''}`}>
          <Building className="h-4 w-4 text-gray-500 shrink-0" />
          {cities.length > 0 ? (
            <Select value={data.city} onValueChange={handleCityChange} disabled={!selectedStateIso && states.length > 0}>
              <SelectTrigger className="flex-1 border-0 shadow-none px-0 py-2.5 text-sm text-black focus:ring-0 [&>span]:truncate bg-transparent">
                <SelectValue placeholder={!selectedStateIso ? 'Select State first' : 'Select City'} />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {cities.map((c) => (
                  <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <input
              type="text"
              placeholder={(!selectedStateIso && states.length > 0) ? 'Select State first' : 'Type City'}
              value={data.city || ''}
              disabled={!selectedStateIso && states.length > 0}
              onChange={(e) => handleTextChange('city', e.target.value)}
              className="flex-1 text-sm text-black py-2.5 focus:outline-none bg-transparent"
            />
          )}
        </div>
        {errors.city && <p className="text-xs text-red-500 pl-1">{errors.city}</p>}
      </div>
    </div>
  );
}
