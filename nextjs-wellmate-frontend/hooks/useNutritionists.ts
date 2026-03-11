import { useState, useEffect } from "react";
import { nutritionistApi } from "@/services/nutritionists";

export function useNutritionistAvailability(id: string, date: string) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!id || !date) return;

    const fetchAvailability = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const res = await nutritionistApi.getAvailability(id, date);
        setData(res);
      } catch (error) {
        console.error("Failed to fetch availability:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [id, date]);

  return { data, isLoading, isError };
}
