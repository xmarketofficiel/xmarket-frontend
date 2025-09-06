import { z } from 'zod';

export const addItemSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .trim(),
  price: z.string()
    .min(1, 'Price is required')
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Price must be a positive number'
    })
    .transform(val => Number(val)),
  category: z.string()
    .min(1, 'Category is required'),
  condition: z.enum(["New", "Like New", "Good", "Fair"], {
    required_error: "Condition is required"
  }),
  photos: z.array(z.instanceof(File))
    .min(1, 'At least one photo is required')
    .max(5, 'Maximum 5 photos allowed')
    .refine(files => files.every(file => file.size <= 10 * 1024 * 1024), {
      message: 'Each photo must be less than 10MB'
    })
    .refine(files => files.every(file => 
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    ), {
      message: 'Only JPEG, PNG, and WebP images are allowed'
    }),
  showIdentity: z.boolean()
});

// Form data type (before validation/transformation)
export type AddItemFormData = {
  title: string;
  description: string;
  price: string; // Raw string input
  category: string;
  condition: "New" | "Like New" | "Good" | "Fair";
  photos: File[];
  showIdentity: boolean;
};

// Validated data type (after transformation)
export type AddItemValidatedData = z.infer<typeof addItemSchema>;

export const searchSchema = z.object({
  query: z.string()
    .max(100, 'Search query too long')
    .trim()
    .optional(),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional()
}).refine(data => !data.minPrice || !data.maxPrice || data.minPrice <= data.maxPrice, {
  message: 'Minimum price must be less than maximum price'
});

export type SearchFormData = z.infer<typeof searchSchema>;
