
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/utils/formatPrice';

// Sample order data
const orders = [
  {
    id: 'ORD123456',
    date: '2023-05-20',
    totalAmount: 15000,
    status: 'Delivered',
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
    id: 'ORD789012',
    date: '2023-04-15',
    totalAmount: 22000,
    status: 'Processing',
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
];

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

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!user) {
    return null;
  }

  return (
    <div className="section-container">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">My Account</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user.name}!</p>
      
      <Tabs defaultValue="orders" className="w-full">
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
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium">Order #{order.id}</h3>
                            <p className="text-sm text-gray-500">
                              Placed on {new Date(order.date).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                            <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                              order.status === 'Delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
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
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    ))}
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
