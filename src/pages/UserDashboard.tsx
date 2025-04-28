import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/utils/formatPrice';
import { useToast } from "@/components/ui/use-toast";
import { getUserOrderHistory } from '@/services/paymentService';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

// Sample wishlist data
const wishlist = [
  {
    id: '5',
    title: 'Dance of Tradition',
    artistName: 'Meera Krishnan',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d',
    category: 'Cultural',
  },
  {
    id: '8',
    title: 'Cosmic Connections',
    artistName: 'Raj Patel',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb',
    category: 'Abstract',
  },
];

interface Order {
  id: string;
  order_id: string;
  amount: number;
  status: 'created' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
  items: Array<{
    id: string;
    title: string;
    artistName: string;
    price: number;
    image: string;
  }>;
}

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 3;
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Fetch orders when tab is active
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === 'orders' && user?.id) {
        setIsLoading(true);
        try {
          const { data, error, count } = await supabase
            .from('orders')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);
          
          if (error) throw error;
          
          setOrders(data || []);
          if (count) {
            setTotalPages(Math.ceil(count / pageSize));
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          toast({
            title: "Failed to load orders",
            description: "There was an error loading your orders. Please try again.",
            variant: "destructive"
          });
          // For demo purposes, we'll use the sample orders
          setOrders([
            {
              id: '1',
              order_id: 'ORD123456',
              amount: 15000,
              status: 'paid',
              created_at: '2023-05-20T00:00:00Z',
              updated_at: '2023-05-20T00:00:00Z',
              items: [
                {
                  id: '1',
                  title: 'Mystic Mountains',
                  artistName: 'Anika Sharma',
                  price: 15000,
                  image: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3',
                },
              ],
            },
            {
              id: '2',
              order_id: 'ORD789012',
              amount: 22000,
              status: 'created',
              created_at: '2023-04-15T00:00:00Z',
              updated_at: '2023-04-15T00:00:00Z',
              items: [
                {
                  id: '2',
                  title: 'Urban Symphony',
                  artistName: 'Raj Patel',
                  price: 22000,
                  image: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833',
                },
              ],
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchOrders();
  }, [activeTab, user?.id, currentPage, toast]);
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'paid':
        return (
          <div className="flex items-center text-green-800 bg-green-100 px-2 py-1 rounded-full text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </div>
        );
      case 'created':
        return (
          <div className="flex items-center text-blue-800 bg-blue-100 px-2 py-1 rounded-full text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center text-red-800 bg-red-100 px-2 py-1 rounded-full text-xs">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </div>
        );
      case 'refunded':
        return (
          <div className="flex items-center text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            Refunded
          </div>
        );
      default:
        return null;
    }
  };
  
  if (!user) {
    return null;
  }

  return (
    <div className="section-container">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">My Account</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user.name}!</p>
      
      <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>
        
        {/* Orders Tab */}
        <TabsContent value="orders">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View all your previous orders and their status.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  // Loading skeleton
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <div className="text-right">
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-3 w-16 rounded-full" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <Skeleton className="w-16 h-16 rounded-md" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-32 mb-2" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium">Order #{order.order_id}</h3>
                            <p className="text-sm text-gray-500">
                              Placed on {new Date(order.created_at).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(order.amount)}</p>
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-16 h-16 object-cover rounded-md" 
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.title}</h4>
                                <p className="text-sm text-gray-500">by {item.artistName}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{formatPrice(item.price)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/order/${order.id}`}>View Details</a>
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {totalPages > 1 && (
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={page === currentPage}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="font-medium mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-4">
                      You haven't placed any orders yet. Start shopping to see your orders here.
                    </p>
                    <Button asChild>
                      <a href="/gallery">Browse Gallery</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Wishlist Tab */}
        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
              <CardDescription>Artworks you've saved for later.</CardDescription>
            </CardHeader>
            <CardContent>
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlist.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 flex gap-4">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-20 h-20 object-cover rounded-md" 
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-500">by {item.artistName}</p>
                        <p className="text-artvista-purple-dark font-medium mt-1">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/artwork/${item.id}`}>View</a>
                          </Button>
                          <Button size="sm">Add to Cart</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="font-medium mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-500 mb-4">
                    Add items to your wishlist by clicking the heart icon on artwork pages.
                  </p>
                  <Button asChild>
                    <a href="/gallery">Browse Gallery</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Account Settings Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>View and update your account details.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p>{user.name}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p>{user.email}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                  <p className="capitalize">{user.role}</p>
                </div>
                <div className="pt-4">
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
