
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { artworks } from '@/data/artworks';
import { formatPrice } from '@/utils/formatPrice';

// Sample orders data
const orders = [
  {
    id: 'ORD123456',
    userId: '3',
    userName: 'Regular User',
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
    userId: '3',
    userName: 'Regular User',
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
  {
    id: 'ORD345678',
    userId: '3',
    userName: 'Regular User',
    date: '2023-03-10',
    totalAmount: 35000,
    status: 'Shipped',
    items: [
      {
        id: '3',
        title: 'Golden Temple Reflections',
        artistName: 'Gurpreet Singh',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1527576539890-dfa815648363',
      },
    ],
  },
];

// Sample users data
const users = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@artvista.com',
    role: 'admin',
    joined: '2023-01-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Artist User',
    email: 'artist@artvista.com',
    role: 'artist',
    joined: '2023-02-20',
    status: 'active',
  },
  {
    id: '3',
    name: 'Regular User',
    email: 'user@artvista.com',
    role: 'user',
    joined: '2023-03-10',
    status: 'active',
  },
  {
    id: '4',
    name: 'Meera Krishnan',
    email: 'meera@artvista.com',
    role: 'artist',
    joined: '2023-02-05',
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Vikram Mehta',
    email: 'vikram@artvista.com',
    role: 'artist',
    joined: '2023-01-25',
    status: 'active',
  },
  {
    id: '6',
    name: 'Arjun Desai',
    email: 'arjun@artvista.com',
    role: 'artist',
    joined: '2023-03-05',
    status: 'active',
  },
];

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for search queries
  const [artworkSearchQuery, setArtworkSearchQuery] = React.useState('');
  const [userSearchQuery, setUserSearchQuery] = React.useState('');
  const [orderSearchQuery, setOrderSearchQuery] = React.useState('');
  
  // Filter artworks based on search
  const filteredArtworks = React.useMemo(() => {
    if (!artworkSearchQuery) return artworks;
    const query = artworkSearchQuery.toLowerCase();
    return artworks.filter(
      (artwork) =>
        artwork.title.toLowerCase().includes(query) ||
        artwork.artistName.toLowerCase().includes(query) ||
        artwork.id.toLowerCase().includes(query)
    );
  }, [artworkSearchQuery]);
  
  // Filter users based on search
  const filteredUsers = React.useMemo(() => {
    if (!userSearchQuery) return users;
    const query = userSearchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
  }, [userSearchQuery]);
  
  // Filter orders based on search
  const filteredOrders = React.useMemo(() => {
    if (!orderSearchQuery) return orders;
    const query = orderSearchQuery.toLowerCase();
    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.userName.toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query)
    );
  }, [orderSearchQuery]);
  
  // Calculate dashboard metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter((order) => order.status === 'Processing').length;
  const totalUsers = users.length;
  const totalArtworks = artworks.length;
  
  // Function to approve an artwork (simulation)
  const handleApproveArtwork = (artworkId: string) => {
    toast({
      title: 'Artwork Approved',
      description: `Artwork #${artworkId} has been approved and is now visible in the gallery.`,
    });
  };
  
  // Function to reject an artwork (simulation)
  const handleRejectArtwork = (artworkId: string) => {
    toast({
      title: 'Artwork Rejected',
      description: `Artwork #${artworkId} has been rejected. The artist has been notified.`,
      variant: 'destructive',
    });
  };
  
  // Function to update order status (simulation)
  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    toast({
      title: 'Order Updated',
      description: `Order #${orderId} status has been updated to ${status}.`,
    });
  };
  
  // Function to change user status (simulation)
  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    toast({
      title: 'User Status Updated',
      description: `User #${userId} status has been changed to ${newStatus}.`,
    });
  };
  
  // Redirect if not authenticated or not an admin
  React.useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);
  
  if (!user || user.role !== 'admin') {
    return null;
  }
  
  return (
    <div className="section-container">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage users, artworks, and orders</p>
      
      {/* Dashboard Overview */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-artvista-purple-dark">
              {formatPrice(totalRevenue)}
            </div>
            <p className="text-sm text-gray-500">Across all sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-artvista-purple-dark">
              {pendingOrders}
            </div>
            <p className="text-sm text-gray-500">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-artvista-purple-dark">
              {totalUsers}
            </div>
            <p className="text-sm text-gray-500">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Artworks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-artvista-purple-dark">
              {totalArtworks}
            </div>
            <p className="text-sm text-gray-500">Listed on platform</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="artworks" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="artworks">Manage Artworks</TabsTrigger>
          <TabsTrigger value="orders">Manage Orders</TabsTrigger>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
        </TabsList>
        
        {/* Artworks Tab */}
        <TabsContent value="artworks">
          <Card>
            <CardHeader>
              <CardTitle>Artworks</CardTitle>
              <CardDescription>Review and manage all artworks on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search artworks by title, artist, or ID..."
                  value={artworkSearchQuery}
                  onChange={(e) => setArtworkSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="p-3 text-sm font-medium text-gray-500">ID</th>
                      <th className="p-3 text-sm font-medium text-gray-500">Artwork</th>
                      <th className="p-3 text-sm font-medium text-gray-500">Artist</th>
                      <th className="p-3 text-sm font-medium text-gray-500">Price</th>
                      <th className="p-3 text-sm font-medium text-gray-500">Status</th>
                      <th className="p-3 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredArtworks.map((artwork) => (
                      <tr key={artwork.id} className="hover:bg-gray-50">
                        <td className="p-3 text-sm">{artwork.id}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <img 
                              src={artwork.image} 
                              alt={artwork.title} 
                              className="w-10 h-10 object-cover rounded-md" 
                            />
                            <div>
                              <p className="font-medium text-sm">{artwork.title}</p>
                              <p className="text-xs text-gray-500">{artwork.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm">{artwork.artistName}</td>
                        <td className="p-3 text-sm font-medium">
                          {formatPrice(artwork.price)}
                        </td>
                        <td className="p-3">
                          <Badge 
                            variant={artwork.sold ? "destructive" : "outline"}
                            className={artwork.sold ? "" : "bg-green-50 text-green-700"}
                          >
                            {artwork.sold ? "Sold" : "Available"}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              asChild
                            >
                              <a href={`/artwork/${artwork.id}`}>View</a>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredArtworks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No artworks found matching your search criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Track and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search orders by ID, customer, or status..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="p-3 text-sm font-medium text-gray-500">Order ID</th>
                      <th className="p-3 text-sm font-medium text-gray-500">Customer</th>
                      <th className="p-3 text-sm font-medium text-gray-500">Date</th>
                      <th className="p-3 text-sm font-medium text-gray-500">Amount</th>
                      <th className="p-3 text-sm font-medium text-gray-500">Status</th>
                      <th className="p-3 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="p-3 text-sm font-medium">{order.id}</td>
                        <td className="p-3 text-sm">{order.userName}</td>
                        <td className="p-3 text-sm">{new Date(order.date).toLocaleDateString('en-IN')}</td>
                        <td className="p-3 text-sm font-medium">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="p-3">
                          <Badge 
                            variant="outline"
                            className={
                              order.status === 'Delivered' 
                                ? 'bg-green-50 text-green-700' 
                                : order.status === 'Processing'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-amber-50 text-amber-700'
                            }
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              View Details
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleUpdateOrderStatus(order.id, 'Shipped')}
                              className={
                                order.status === 'Delivered' ? 'hidden' : ''
                              }
                            >
                              {order.status === 'Processing' ? 'Ship Order' : 'Mark Delivered'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No orders found matching your search criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage users and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search users by name, email, or role..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="p-3 text-sm font-medium text-gray-500">ID</th>
                      <th className="p-3 text-sm font-medium text-gray-500">Name</th>
                      <th className="p-3 text-sm font-medium text-gray-500">Email</th>
                      <th className="p-3 text-sm font-medium text-gray-500">Role</th>
                      <th className="p-3 text-sm font-medium text-gray-500">Joined</th>
                      <th className="p-3 text-sm font-medium text-gray-500">Status</th>
                      <th className="p-3 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="p-3 text-sm">{user.id}</td>
                        <td className="p-3 text-sm font-medium">{user.name}</td>
                        <td className="p-3 text-sm">{user.email}</td>
                        <td className="p-3">
                          <Badge 
                            variant="outline"
                            className={
                              user.role === 'admin' 
                                ? 'bg-purple-50 text-purple-700' 
                                : user.role === 'artist'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-gray-50 text-gray-700'
                            }
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm">{new Date(user.joined).toLocaleDateString('en-IN')}</td>
                        <td className="p-3">
                          <Badge 
                            variant="outline"
                            className={
                              user.status === 'active' 
                                ? 'bg-green-50 text-green-700' 
                                : 'bg-red-50 text-red-700'
                            }
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant={user.status === 'active' ? 'destructive' : 'default'}
                              onClick={() => handleToggleUserStatus(user.id, user.status)}
                            >
                              {user.status === 'active' ? 'Deactivate' : 'Activate'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No users found matching your search criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
