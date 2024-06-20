export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    availability_status: 'available' | 'not available';
    created_at: Date;
    updated_at: Date;
  }