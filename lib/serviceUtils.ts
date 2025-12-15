export interface Service {
  id: string;
  title: string;
  priceFrom: number;
  category: 'time-based' | 'ongoing';
  serviceCategory: string;
  availability: 'instant' | 'scheduled';
  rating: number;
  reviews: number;
  provider: string;
  distance: string;
  image: string;
  duration?: string;
  featured?: boolean;
  departureTime?: Date;
  createdAt: Date;
}

export const getHoursUntilDeparture = (departureTime: Date): number => {
  const now = new Date();
  const diffMs = departureTime.getTime() - now.getTime();
  return diffMs / (1000 * 60 * 60);
};

export const getUrgencyScore = (service: Service): number => {
  if (service.category === 'ongoing') return 0;
  
  if (!service.departureTime) return 0;
  
  const hoursLeft = getHoursUntilDeparture(service.departureTime);
  
  // Higher score = more urgent
  if (hoursLeft < 0) return -1000; // Expired
  if (hoursLeft < 2) return 1000;
  if (hoursLeft < 6) return 500;
  if (hoursLeft < 12) return 200;
  if (hoursLeft < 24) return 100;
  return 50;
};

export const getUrgencyColor = (hoursLeft: number): string => {
  if (hoursLeft < 3) return 'red';
  if (hoursLeft < 6) return 'orange';
  if (hoursLeft < 12) return 'yellow';
  return 'green';
};

export const getUrgencyBadge = (hoursLeft: number): { color: string; label: string; icon: string } => {
  if (hoursLeft < 3) return { color: 'red', label: `${Math.floor(hoursLeft)}h left`, icon: '🔴' };
  if (hoursLeft < 6) return { color: 'orange', label: `${Math.floor(hoursLeft)}h left`, icon: '🟠' };
  if (hoursLeft < 12) return { color: 'yellow', label: 'Today', icon: '🟡' };
  if (hoursLeft < 24) return { color: 'green', label: 'Today', icon: '🟢' };
  return { color: 'blue', label: 'Upcoming', icon: '📅' };
};

export const formatTimeLeft = (departureTime: Date): string => {
  const hoursLeft = getHoursUntilDeparture(departureTime);
  
  if (hoursLeft < 1) {
    const minutesLeft = Math.floor(hoursLeft * 60);
    return `${minutesLeft}min`;
  }
  
  if (hoursLeft < 24) {
    return `${Math.floor(hoursLeft)}h`;
  }
  
  const daysLeft = Math.floor(hoursLeft / 24);
  return `${daysLeft}d`;
};

export const sortServices = (services: Service[]): Service[] => {
  return [...services].sort((a, b) => {
    // 1. Time-sensitive items ALWAYS come first
    if (a.category === 'time-based' && b.category !== 'time-based') return -1;
    if (a.category !== 'time-based' && b.category === 'time-based') return 1;
    
    // 2. Among time-sensitive: sort by urgency (soonest departure first)
    if (a.category === 'time-based' && b.category === 'time-based') {
      if (!a.departureTime || !b.departureTime) return 0;
      return a.departureTime.getTime() - b.departureTime.getTime();
    }
    
    // 3. Among permanent: sort by recency (most recent post first)
    if (a.category === 'ongoing' && b.category === 'ongoing') {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }
    
    return 0;
  });
};

export const getHottestItemInCategory = (services: Service[], categoryId: string): Service | null => {
  const categoryServices = services.filter(s => s.serviceCategory === categoryId);
  if (categoryServices.length === 0) return null;
  
  const sorted = sortServices(categoryServices);
  return sorted[0];
};

export const getCategoryHotnessScore = (services: Service[], categoryId: string): number => {
  const hottestItem = getHottestItemInCategory(services, categoryId);
  if (!hottestItem) return 0;
  return getUrgencyScore(hottestItem);
};

export const filterActiveServices = (services: Service[]): Service[] => {
  return services.filter(service => {
    if (service.category === 'ongoing') return true;
    if (!service.departureTime) return true;
    return getHoursUntilDeparture(service.departureTime) > 0;
  });
};
