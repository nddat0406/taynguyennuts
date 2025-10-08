"use client";

import { createClient } from "@/utils/supabase/client";
import React, { useEffect } from "react";

type Props = {
  paymentCode: string;
  setIsPaid: (paid: boolean) => void;
};

const RealtimeOrders = ({ paymentCode, setIsPaid }: Props) => {
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          const pl = payload.new as any;
          if (
            pl.payment_code === paymentCode &&
            pl.payment_status === "success"
          ) {
            setIsPaid(true); 
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") console.log("Realtime subscribed");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [paymentCode, setIsPaid]);

  return null;
};

export default RealtimeOrders;
