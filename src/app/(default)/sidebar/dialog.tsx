import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { City } from "@/types";
import { useEffect } from "react";
import { supabase } from "@/supabase-digital-twin";
import CitiesDropdown from "./dropdown";

export default function CityDialog({
  city,
  setCity,
}: {
  city: City | null;
  setCity: React.Dispatch<React.SetStateAction<City | null>>;
}) {
  // Fetching Cities from SupaBase
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      const { data, error } = await supabase.from("city").select("*");
      if (error) {
        console.error("Error fetching cities:", error);
      } else {
        setCities(data);
      }
    };
    fetchCities();
  }, []);
  return (
    <Dialog open={city === null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select City</DialogTitle>
          <DialogDescription>
            Please select the city you want to visualize. This selection will
            determine which data is shown in the 3D visualization.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <CitiesDropdown cities={cities} city={city} setCity={setCity} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
