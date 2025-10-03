// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { ApiResponse } from "../_shared/api-results.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabase } from "../_shared/supabase.ts";

export class PostSepayPaymentDto {
  id: string;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  code: null;
  content: string;
  transferType: string;
  transferAmount: number;
  accumulated: number;
  subAccount: string;
  referenceCode: number;
  description: number;
}

export const extractTokenFromHeader = (
  request: Request
): string | undefined => {
  const [type, token] = request.headers.get("Authorization")?.split(" ") ?? [];
  return type === "Apikey" ? token : undefined;
};

const postSepayPayment = async (request: Request): Promise<Response> => {
  const apiKey: string = Deno.env.get("APP_SEPAY_PAYMENT_API_KEY") ?? "";
  const accessToken = extractTokenFromHeader(request);

  if (apiKey !== accessToken) {
    return new Response(
      JSON.stringify(
        new ApiResponse({ success: false, message: "Unauthorized" })
      ),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const payment = (await request.json()) as PostSepayPaymentDto;

    const { data: order } = await supabase
      .from("orders")
      .select()
      .eq("payment_code", payment.code)
      .maybeSingle();

    if (!order) {
      console.log("Order not found");
      return new Response(
        JSON.stringify(new ApiResponse({ message: "Order not found" })),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    if (order.total === payment.transferAmount) {
      await supabase
        .from("orders")
        .update({ payment_status: "success" })
        .eq("id", order.id);
      return new Response(
          JSON.stringify(new ApiResponse({ message: "Pay Success" })),
          { headers: { "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify(new ApiResponse({ message: "Success" })),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify(
        new ApiResponse({ success: false, message: "Internal Server Error" })
      ),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

Deno.serve(async (request: Request) => {
  if (request.method === "POST") {
    return postSepayPayment(request);
  }

  if (request.method === "OPTIONS") {
    return new Response("OK", { headers: corsHeaders });
  }

  return new Response(
    JSON.stringify(new ApiResponse({ success: false, message: "Not Found" })),
    {
      status: 404,
      headers: { "Content-Type": "application/json" },
    }
  );
});
