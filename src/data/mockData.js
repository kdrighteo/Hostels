// Mock data for the Hostel Booking App

export const mockHostels = [
  {
    id: 'h1',
    name: 'Sunrise Hostel',
    image: 'https://source.unsplash.com/400x300/?hostel,building',
    address: '123 Main St, Cityville',
    manager: 'Alice Smith',
    phone: '555-1234',
    description: 'A modern, clean hostel in the city center.',
  },
  {
    id: 'h2',
    name: 'Lakeside Hostel',
    image: 'https://source.unsplash.com/400x300/?hostel,lake',
    address: '456 Lake Rd, Townsville',
    manager: 'Bob Johnson',
    phone: '555-5678',
    description: 'Enjoy lakeside views and cozy rooms.',
  },
];

export const mockRooms = [
  { id: 'r1', hostelId: 'h1', number: '101', floor: 1, type: 'Single', status: 'available' },
  { id: 'r2', hostelId: 'h1', number: '102', floor: 1, type: 'Double', status: 'taken' },
  { id: 'r3', hostelId: 'h2', number: '201', floor: 2, type: 'Single', status: 'available' },
  { id: 'r4', hostelId: 'h2', number: '202', floor: 2, type: 'Double', status: 'taken' },
];

export const mockBookings = [
  { id: 'b1', userId: 'u1', hostelId: 'h1', roomId: 'r2', status: 'pending', date: '2024-07-10', name: 'Jane Doe' },
  { id: 'b2', userId: 'u2', hostelId: 'h2', roomId: 'r4', status: 'approved', date: '2024-07-12', name: 'John Smith' },
];

export const mockPayments = [
  { id: 'p1', bookingId: 'b2', amount: 120, date: '2024-07-12', method: 'Credit Card', status: 'paid' },
  { id: 'p2', bookingId: 'b1', amount: 100, date: '2024-07-10', method: 'PayPal', status: 'pending' },
];

export const mockUser = {
  id: 'u1',
  name: 'Jane Doe',
  email: 'jane@example.com',
  avatar: '',
  bookings: ['b1'],
}; 