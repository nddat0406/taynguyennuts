"use client";

import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import React, { useEffect } from "react";

type Props = {
  paymentCode: string;
};

const RealtimeOrders = (props: Props) => {
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          const pl = payload.new as any;
          console.log(pl, props.paymentCode);
          if (
            pl.payment_code === props.paymentCode &&
            pl.payment_status === "success"
          ) {
            toast({
              title: "Thanh toán thành công!!!",
              description:
                "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.",
            });
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") console.log("Realtime subscribed");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return <div></div>;
};

export default RealtimeOrders;
