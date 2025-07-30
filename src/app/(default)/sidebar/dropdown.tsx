"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { City } from "@/types";

export default function CitiesDropdown({
  cities,
  city,
  setCity,
}: {
  cities: City[];
  city: City | null;
  setCity: React.Dispatch<React.SetStateAction<City | null>>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{city?.title || "Select City"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Cities</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {cities.map((city) => (
          <DropdownMenuCheckboxItem
            key={city.id}
            checked={city?.id === city.id}
            onCheckedChange={() => setCity(city)}
          ></DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
