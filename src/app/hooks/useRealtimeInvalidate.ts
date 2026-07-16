import { useEffect } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

/** Invalidates the given react-query keys whenever any of `tables` changes in Postgres. */
export function useRealtimeInvalidate(tables: string[], queryKeys: QueryKey[]) {
  const queryClient = useQueryClient();
  const tableKey = tables.join(",");
  const queryKeysKey = JSON.stringify(queryKeys);

  useEffect(() => {
    const channel = supabase.channel(`rt:${tableKey}:${Math.random().toString(36).slice(2)}`);
    for (const table of tables) {
      channel.on(
        "postgres_changes" as never,
        { event: "*", schema: "public", table },
        () => { for (const key of queryKeys) queryClient.invalidateQueries({ queryKey: key }); },
      );
    }
    channel.subscribe();
    return () => { void supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableKey, queryKeysKey]);
}
