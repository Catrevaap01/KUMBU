import { Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { LocationFilterOptions } from "@/lib/sellers/getLocationFilterOptions";
import type { CountryCode } from "@/lib/validation/country";

export function LocationFilterBar({
  action,
  hiddenFields,
  options,
  selectedCountry,
  selectedCity,
}: {
  action: string;
  hiddenFields?: Record<string, string>;
  options: LocationFilterOptions;
  selectedCountry?: CountryCode;
  selectedCity?: string;
}) {
  return (
    <div>
      <form action={action} method="GET" className="flex flex-wrap items-end gap-3">
        {Object.entries(hiddenFields ?? {}).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}

        <div className="min-w-[9rem] flex-1">
          <label htmlFor="country" className="text-xs font-medium text-slate-600">
            País
          </label>
          <Select id="country" name="country" defaultValue={selectedCountry ?? "ANGOLA"} className="mt-1">
            {options.countries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="min-w-[11rem] flex-1">
          <label htmlFor="city" className="text-xs font-medium text-slate-600">
            Província / Cidade
          </label>
          <Select id="city" name="city" defaultValue={selectedCity ?? ""} className="mt-1">
            <option value="">Todas as províncias</option>
            {options.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </div>

        <Button type="submit" variant="ghost" className="!px-4 !py-2.5 text-sm">
          Filtrar
        </Button>
      </form>
      <p className="mt-1.5 text-xs text-slate-500">
        Filtre por província para comparar preços na sua região em Angola.
      </p>
    </div>
  );
}
