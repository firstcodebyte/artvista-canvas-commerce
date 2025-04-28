
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Indian } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/utils/formatPrice';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().regex(/^[6-9]\d{9}$/, { 
    message: 'Please enter a valid 10 digit Indian mobile number.' 
  }),
  address: z.string().min(10, { 
    message: 'Address must be at least 10 characters.' 
  }),
  city: z.string().min(2, { message: 'City is required.' }),
  state: z.string().min(2, { message: 'State is required.' }),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, { 
    message: 'Please enter a valid 6 digit pincode.' 
  }),
  paymentMethod: z.enum(['razorpay', 'cod'], {
    required_error: 'Please select a payment method.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const Checkout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, totalAmount, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize form with user data if available
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      paymentMethod: 'razorpay',
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (items.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Your cart is empty. Add some items before checkout.',
        variant: 'destructive',
      });
      navigate('/gallery');
      return;
    }

    setIsProcessing(true);

    if (data.paymentMethod === 'razorpay') {
      // Simulate Razorpay integration
      setTimeout(() => {
        simulateRazorpayPayment(data);
      }, 1000);
    } else {
      // Cash on Delivery
      setTimeout(() => {
        setIsProcessing(false);
        processSuccessfulOrder('COD');
      }, 1000);
    }
  };

  // Simulate Razorpay payment
  const simulateRazorpayPayment = (data: FormValues) => {
    // This is a simulation of Razorpay - in a real implementation,
    // you would initialize the Razorpay SDK with actual credentials
    const options = {
      key: 'rzp_test_YOUR_KEY_ID', // Replace with actual Razorpay key in production
      amount: totalAmount * 100, // Amount in paisa
      currency: 'INR',
      name: 'ArtVista',
      description: 'Purchase of Artwork',
      image: 'https://your-logo-url.png',
      handler: function () {
        setIsProcessing(false);
        processSuccessfulOrder('Razorpay');
      },
      prefill: {
        name: data.name,
        email: data.email,
        contact: data.phone,
      },
      theme: {
        color: '#9b87f5',
      },
    };

    // Since we can't actually initialize Razorpay in this demo,
    // we'll simulate a successful payment
    setTimeout(() => {
      setIsProcessing(false);
      processSuccessfulOrder('Razorpay');
    }, 1000);

    // In a real implementation, you would do:
    // const rzp = new window.Razorpay(options);
    // rzp.open();
  };

  // Process successful order
  const processSuccessfulOrder = (paymentMethod: string) => {
    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    toast({
      title: 'Order Placed Successfully!',
      description: `Your order #${orderId} has been placed. Thank you for shopping with ArtVista!`,
    });
    
    clearCart();
    navigate('/');
  };

  // If cart is empty, redirect to gallery
  if (items.length === 0) {
    return (
      <div className="section-container text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="mb-6">Add some items to your cart before proceeding to checkout.</p>
        <Button asChild>
          <a href="/gallery">Browse Gallery</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="section-container">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                  <CardDescription>
                    Enter your shipping details to complete your order.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your 10-digit phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter your complete address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PIN Code</FormLabel>
                          <FormControl>
                            <Input placeholder="6-digit PIN code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>
                    Choose your preferred payment method.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div
                            className={`border rounded-md p-4 cursor-pointer transition-all ${
                              field.value === 'razorpay'
                                ? 'border-artvista-purple bg-artvista-purple/5'
                                : 'hover:border-artvista-purple hover:bg-gray-50'
                            }`}
                            onClick={() => field.onChange('razorpay')}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="h-6 w-6 rounded-full border-2 flex items-center justify-center border-artvista-purple">
                                {field.value === 'razorpay' && (
                                  <div className="h-3 w-3 rounded-full bg-artvista-purple" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">Online Payment</h3>
                                <p className="text-sm text-gray-500">
                                  Pay securely with Razorpay - Credit/Debit Card, UPI, Net Banking
                                </p>
                              </div>
                              <div className="text-gray-400">
                                <img
                                  src="https://razorpay.com/favicon.png"
                                  alt="Razorpay"
                                  className="h-8 w-8"
                                />
                              </div>
                            </div>
                          </div>

                          <div
                            className={`border rounded-md p-4 cursor-pointer transition-all ${
                              field.value === 'cod'
                                ? 'border-artvista-purple bg-artvista-purple/5'
                                : 'hover:border-artvista-purple hover:bg-gray-50'
                            }`}
                            onClick={() => field.onChange('cod')}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="h-6 w-6 rounded-full border-2 flex items-center justify-center border-artvista-purple">
                                {field.value === 'cod' && (
                                  <div className="h-3 w-3 rounded-full bg-artvista-purple" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">Cash on Delivery</h3>
                                <p className="text-sm text-gray-500">
                                  Pay cash when your artwork is delivered
                                </p>
                              </div>
                              <div className="text-gray-400">
                                <Indian className="h-6 w-6" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-artvista-purple hover:bg-artvista-purple-dark"
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? 'Processing...'
                      : `Place Order • ${formatPrice(totalAmount)}`}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-14 w-14 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.title}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price Details */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>{formatPrice(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span>{formatPrice(0)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-artvista-purple-dark">{formatPrice(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
