'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Calendar as CalendarIcon } from 'lucide-react';

interface CustomDatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  minDate?: Date;
}

export default function CustomDatePicker({ value, onChange, minDate = new Date() }: CustomDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const [isOpen, setIsOpen] = useState(false);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    date.setHours(0, 0, 0, 0);
    const min = new Date(minDate);
    min.setHours(0, 0, 0, 0);
    return date < min;
  };

  const isDateSelected = (day: number) => {
    if (!value) return false;
    return (
      value.getDate() === day &&
      value.getMonth() === currentMonth.getMonth() &&
      value.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (day: number) => {
    if (isDateDisabled(day)) return;
    
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (value) {
      selectedDate.setHours(value.getHours(), value.getMinutes());
    }
    onChange(selectedDate);
    setIsOpen(false);
  };

  const formatDisplayDate = () => {
    if (!value) return '';
    const day = value.getDate().toString().padStart(2, '0');
    const month = (value.getMonth() + 1).toString().padStart(2, '0');
    const year = value.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="relative">
      {/* Input Display Field */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border-2 border-blue-500 rounded-xl focus:outline-none transition-colors flex items-center gap-3 bg-white hover:border-blue-600"
      >
        <CalendarIcon className="w-5 h-5 text-gray-400" />
        <div className="flex-1 text-left">
          <div className="text-[10px] text-blue-500 font-medium leading-tight">Select a day</div>
          <div className="text-sm font-bold text-gray-900 leading-tight">
            {value ? formatDisplayDate() : 'DD.MM.YYYY'}
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
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-[90vw] max-w-sm">
            {/* Month/Year Header with Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-900" />
              </button>
              
              <div className="text-xl font-bold text-gray-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </div>
              
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-900" />
              </button>
            </div>

            {/* Day Names - Single Letters */}
            <div className="grid grid-cols-7 gap-1 mb-3">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <div key={idx} className="text-center text-sm font-bold text-gray-900 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="invisible" />;
                }
                
                const today = isToday(day);
                const selected = value && 
                  value.getDate() === day &&
                  value.getMonth() === currentMonth.getMonth() &&
                  value.getFullYear() === currentMonth.getFullYear();
                const disabled = isDateDisabled(day);
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    disabled={disabled}
                    className={`
                      w-9 h-9 flex items-center justify-center rounded-full text-sm transition-all
                      ${disabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                      ${selected ? 'bg-blue-500 text-white font-bold shadow-lg' : ''}
                      ${!selected && !disabled ? 'text-gray-900 font-semibold hover:bg-blue-100' : ''}
                      ${!selected && disabled ? 'font-normal' : ''}
                    `}
                  >
                    {day}
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
