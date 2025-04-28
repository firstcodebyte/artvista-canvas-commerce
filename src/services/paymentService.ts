
import { supabase } from '@/integrations/supabase/client';
import { loadRazorpayScript, RAZORPAY_KEY_ID, RazorpayOptions, RazorpayResponse } from '@/utils/razorpay';
import { toast } from '@/components/ui/use-toast';

interface CreateOrderParams {
  amount: number;
  currency: string;
  receipt: string;
}

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export interface PaymentDetails {
  orderId: string;
  amount: number;
  items: OrderItem[];
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

// Function to initiate payment
export const initiatePayment = async (paymentDetails: PaymentDetails): Promise<boolean> => {
  try {
    // Check if Razorpay is loaded
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast({
        title: "Payment Error",
        description: "Could not load payment gateway. Please try again.",
        variant: "destructive"
      });
      return false;
    }

    // Create order in your database
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_id: paymentDetails.orderId,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        status: 'created',
        customer_name: paymentDetails.customerName,
        customer_email: paymentDetails.customerEmail,
        customer_phone: paymentDetails.customerPhone,
        items: paymentDetails.items
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Order Creation Failed",
        description: "We couldn't process your order. Please try again.",
        variant: "destructive"
      });
      return false;
    }

    // Configure payment options
    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: paymentDetails.amount * 100, // Convert to paise
      currency: paymentDetails.currency,
      name: 'ArtVista',
      description: `Purchase of artwork(s)`,
      order_id: paymentDetails.orderId,
      handler: function(response: RazorpayResponse) {
        handlePaymentSuccess(response, order.id);
      },
      prefill: {
        name: paymentDetails.customerName,
        email: paymentDetails.customerEmail,
        contact: paymentDetails.customerPhone
      },
      theme: {
        color: '#6c5ce7'
      }
    };

    // Open Razorpay checkout
    const razorpay = new window.Razorpay(options);
    
    razorpay.on('payment.failed', function (response: any) {
      handlePaymentFailure(response, order.id);
    });
    
    razorpay.open();
    return true;
  } catch (error) {
    console.error('Payment initiation error:', error);
    toast({
      title: "Payment Error",
      description: "There was an error initiating the payment. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};

// Function to handle successful payment
const handlePaymentSuccess = async (response: RazorpayResponse, orderId: string): Promise<void> => {
  try {
    // Update order status in database
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_id: response.razorpay_payment_id,
        payment_signature: response.razorpay_signature,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Payment Verification Error",
        description: "Your payment was received but we couldn't update your order. Our team will contact you.",
        variant: "destructive"
      });
      return;
    }

    // Show success message
    toast({
      title: "Payment Successful",
      description: "Your payment has been processed successfully. Thank you for your purchase!",
    });

    // Redirect to order confirmation page or refresh current page
    setTimeout(() => {
      window.location.href = '/user-dashboard';
    }, 2000);
  } catch (error) {
    console.error('Payment success handling error:', error);
  }
};

// Function to handle payment failure
const handlePaymentFailure = async (response: any, orderId: string): Promise<void> => {
  try {
    // Update order status in database
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'failed',
        error_code: response.error?.code,
        error_description: response.error?.description,
        error_source: response.error?.source,
        error_step: response.error?.step,
        error_reason: response.error?.reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating failed order:', error);
    }

    // Show failure message
    toast({
      title: "Payment Failed",
      description: response.error?.description || "Your payment couldn't be processed. Please try again.",
      variant: "destructive"
    });
  } catch (error) {
    console.error('Payment failure handling error:', error);
  }
};

// Function to generate a unique order ID
export const generateOrderId = (): string => {
  return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
};

// Function to get user's order history
export const getUserOrderHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching order history:', error);
    return [];
  }

  return data || [];
};
