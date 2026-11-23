'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock, ChevronDown } from 'lucide-react';

interface CustomTimePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  autoOpen?: boolean;
  selectedDate?: Date | null; // The date selected in the date picker, used to disable past times
}

export default function CustomTimePicker({ value, onChange, autoOpen = false, selectedDate }: CustomTimePickerProps) {
  // Helper function to get first available time
  const getFirstAvailableTime = (): { hour: number; minute: number; period: 'AM' | 'PM' } => {
    const now = new Date();
    const isToday = selectedDate?.toDateString() === now.toDateString();
    
    if (!isToday || !selectedDate) {
      // Not today, default to first time slot (12:00 AM)
      return { hour: 12, minute: 0, period: 'AM' };
    }
    
    // Today - find first available time after current time
    const currentHour24 = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Round up to next 30-minute slot
    let nextMinute = currentMinute <= 0 ? 30 : 0;
    let nextHour24 = currentMinute <= 0 ? currentHour24 : currentHour24 + 1;
    
    // If we've gone past 11:30 PM, default to 12:00 AM tomorrow (shouldn't happen for today)
    if (nextHour24 >= 24) {
      return { hour: 12, minute: 0, period: 'AM' };
    }
    
    // Convert to 12-hour format
    const nextPeriod: 'AM' | 'PM' = nextHour24 >= 12 ? 'PM' : 'AM';
    const nextHour = nextHour24 === 0 ? 12 : nextHour24 > 12 ? nextHour24 - 12 : nextHour24;
    
    return { hour: nextHour, minute: nextMinute, period: nextPeriod };
  };

  const initialTime = value ? {
    hour: value.getHours() === 0 ? 12 : value.getHours() > 12 ? value.getHours() - 12 : value.getHours(),
    minute: value.getMinutes(),
    period: value.getHours() >= 12 ? 'PM' as const : 'AM' as const
  } : getFirstAvailableTime();

  const [isOpen, setIsOpen] = useState(autoOpen);
  const [selectedHour, setSelectedHour] = useState(initialTime.hour);
  const [selectedMinute, setSelectedMinute] = useState(initialTime.minute);
  const [period, setPeriod] = useState<'AM' | 'PM'>(initialTime.period);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const firstAvailableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (autoOpen) {
      setIsOpen(true);
    }
  }, [autoOpen]);

  // Auto-scroll to first available time when picker opens
  useEffect(() => {
    if (isOpen && firstAvailableRef.current && scrollContainerRef.current) {
      setTimeout(() => {
        firstAvailableRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [isOpen, period]);

  useEffect(() => {
    if (value) {
      const hours = value.getHours();
      setSelectedHour(hours === 0 ? 12 : hours > 12 ? hours - 12 : hours);
      setSelectedMinute(value.getMinutes());
      setPeriod(hours >= 12 ? 'PM' : 'AM');
    } else if (selectedDate) {
      // Re-calculate first available time when selectedDate changes
      const firstAvailable = getFirstAvailableTime();
      setSelectedHour(firstAvailable.hour);
      setSelectedMinute(firstAvailable.minute);
      setPeriod(firstAvailable.period as 'AM' | 'PM');
    }
  }, [value, selectedDate]);

  const handleTimeSelect = (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    
    let hour24 = hour;
    if (period === 'PM' && hour !== 12) {
      hour24 = hour + 12;
    } else if (period === 'AM' && hour === 12) {
      hour24 = 0;
    }
    
    const newDate = value ? new Date(value) : new Date();
    newDate.setHours(hour24, minute, 0, 0);
    onChange(newDate);
    setIsOpen(false);
  };

  const formatDisplayTime = () => {
    if (!value) return '00:00 AM';
    const hours = value.getHours();
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const minutes = value.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${displayHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  // Generate time slots for 12-hour format (12:00, 12:30, 1:00, 1:30... 11:00, 11:30)
  const generateTimeSlots = () => {
    const slots = [];
    // Start with 12:00, 12:30
    slots.push({ hour: 12, minute: 0 });
    slots.push({ hour: 12, minute: 30 });
    // Then 1:00 through 11:30
    for (let hour = 1; hour <= 11; hour++) {
      slots.push({ hour, minute: 0 });
      slots.push({ hour, minute: 30 });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="relative">
      {/* Input Display Field */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border-2 border-blue-500 rounded-xl focus:outline-none transition-colors flex items-center gap-3 bg-white hover:border-blue-600"
      >
        <Clock className="w-5 h-5 text-gray-400" />
        <div className="flex-1 text-left">
          <div className="text-[10px] text-blue-500 font-medium leading-tight">Start with</div>
          <div className="text-sm font-bold text-gray-900 leading-tight">
            {formatDisplayTime()}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-900 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/20" 
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 w-[90vw] max-w-sm">
            {/* AM/PM Toggle */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setPeriod('AM')}
                className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                  period === 'AM'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => setPeriod('PM')}
                className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                  period === 'PM'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                PM
              </button>
            </div>

            {/* Time Slots List */}
            <div ref={scrollContainerRef} className="space-y-1 max-h-60 overflow-y-auto">
              {timeSlots.map(({ hour, minute }, index) => {
                const isSelected = selectedHour === hour && selectedMinute === minute;
                const displayTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                
                // Check if this time slot is in the past (only if selected date is today)
                let isPast = false;
                if (selectedDate) {
                  const now = new Date();
                  const isToday = selectedDate.toDateString() === now.toDateString();
                  if (isToday) {
                    // Convert to 24-hour format for comparison
                    let hour24 = hour;
                    if (period === 'PM' && hour !== 12) {
                      hour24 = hour + 12;
                    } else if (period === 'AM' && hour === 12) {
                      hour24 = 0;
                    }
                    const slotTime = new Date(selectedDate);
                    slotTime.setHours(hour24, minute, 0, 0);
                    isPast = slotTime <= now;
                  }
                }
                
                // Determine if this is the first available (non-past) time slot
                const isFirstAvailable = !isPast && selectedHour === hour && selectedMinute === minute;
                
                return (
                  <button
                    key={`${hour}-${minute}`}
                    ref={isFirstAvailable ? firstAvailableRef : null}
                    type="button"
                    onClick={() => !isPast && handleTimeSelect(hour, minute)}
                    disabled={isPast}
                    className={`w-full py-3 px-4 text-center rounded-lg font-semibold text-lg transition-all ${
                      isPast
                        ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                        : isSelected
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    {displayTime}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
