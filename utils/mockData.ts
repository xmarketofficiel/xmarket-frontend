import { User, Item, Category, Conversation, Message } from '../types';

export const categories: Category[] = [
  { id: 'all', name: 'All', icon: '📱' },
  { id: 'books', name: 'Books', icon: '📚' },
  { id: 'electronics', name: 'Electronics', icon: '💻' },
  { id: 'furniture', name: 'Furniture', icon: '🪑' },
  { id: 'services', name: 'Services', icon: '🔧' },
  { id: 'other', name: 'Other', icon: '📦' },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmed Benali',
    program: 'L3 Informatique',
    year: '2024',
    verified: true,
  },
  {
    id: '2',
    name: 'Fatima Zahra',
    program: 'M1 Data Science',
    year: '2024',
    verified: true,
  },
  {
    id: '3',
    name: 'Youssef El Mansouri',
    program: 'L2 Génie Civil',
    year: '2025',
    verified: false,
  },
  {
    id: '4',
    name: 'Aicha Berbère',
    program: 'M2 Finance',
    year: '2024',
    verified: true,
  },
  {
    id: '5',
    name: 'Mehdi Rami',
    program: 'L1 Prépa Intégrée',
    year: '2026',
    verified: false,
  },
  {
    id: '6',
    name: 'Salma Idrissi',
    program: 'L3 Management',
    year: '2024',
    verified: true,
  },
];

export const mockItems: Item[] = [
  {
    id: '1',
    title: 'MacBook Air M2 - Excellent État',
    description: 'MacBook Air M2 13" en excellent état, utilisé pendant 6 mois seulement. Parfait pour les études et le développement.',
    price: 8500,
    category: categories[2],
    photos: [
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    sellerId: '1',
    seller: mockUsers[0],
    createdAt: '2024-01-15T10:30:00Z',
    featured: true,
  },
  {
    id: '2',
    title: 'Cours Mathématiques L1-L2',
    description: 'Collection complète de livres de mathématiques pour L1 et L2. Algèbre, analyse, probabilités.',
    price: 200,
    category: categories[1],
    photos: [
      'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    sellerId: '2',
    seller: mockUsers[1],
    createdAt: '2024-01-14T15:45:00Z',
  },
  {
    id: '3',
    title: 'Bureau d\'étudiant + Chaise',
    description: 'Bureau en bois massif avec tiroirs + chaise ergonomique. Parfait pour chambre étudiante.',
    price: 450,
    category: categories[3],
    photos: [
      'https://images.pexels.com/photos/4050314/pexels-photo-4050314.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    sellerId: '3',
    seller: mockUsers[2],
    createdAt: '2024-01-13T09:20:00Z',
  },
  {
    id: '4',
    title: 'Cours Particuliers Python',
    description: 'Cours particuliers de programmation Python pour débutants et intermédiaires. Tarif étudiant.',
    price: 80,
    category: categories[4],
    photos: [
      'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    sellerId: '4',
    seller: mockUsers[3],
    createdAt: '2024-01-12T14:10:00Z',
  },
  {
    id: '5',
    title: 'iPhone 14 Pro - 128GB',
    description: 'iPhone 14 Pro en parfait état, acheté il y a 8 mois. Avec boîte et accessoires d\'origine.',
    price: 7200,
    category: categories[2],
    photos: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    sellerId: '5',
    seller: mockUsers[4],
    createdAt: '2024-01-11T16:30:00Z',
    featured: true,
  },
  {
    id: '6',
    title: 'Canapé 2 Places - Bon État',
    description: 'Canapé confortable pour chambre ou salon. Couleur gris clair, très bon état.',
    price: 800,
    category: categories[3],
    photos: [
      'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    sellerId: '6',
    seller: mockUsers[5],
    createdAt: '2024-01-10T11:15:00Z',
  },
  {
    id: '7',
    title: 'Tablette iPad Air',
    description: 'iPad Air 4ème génération, 64GB, parfait pour prendre des notes et dessiner.',
    price: 3500,
    category: categories[2],
    photos: [
      'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    sellerId: '1',
    seller: mockUsers[0],
    createdAt: '2024-01-09T13:45:00Z',
  },
  {
    id: '8',
    title: 'Livres Économie L3',
    description: 'Ensemble de livres d\'économie niveau L3: microéconomie, macroéconomie, économétrie.',
    price: 150,
    category: categories[1],
    photos: [
      'https://images.pexels.com/photos/256559/pexels-photo-256559.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    sellerId: '2',
    seller: mockUsers[1],
    createdAt: '2024-01-08T08:20:00Z',
  },
  {
    id: '9',
    title: 'Vélo VTT - État Neuf',
    description: 'VTT presque neuf, utilisé 3 fois seulement. Parfait pour se déplacer sur le campus.',
    price: 1200,
    category: categories[5],
    photos: [
      'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    sellerId: '3',
    seller: mockUsers[2],
    createdAt: '2024-01-07T17:10:00Z',
  },
  {
    id: '10',
    title: 'Aide aux Devoirs Math/Physique',
    description: 'Étudiant en M2 propose aide aux devoirs en mathématiques et physique pour tous niveaux.',
    price: 60,
    category: categories[4],
    photos: [
      'https://images.pexels.com/photos/3768126/pexels-photo-3768126.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    sellerId: '4',
    seller: mockUsers[3],
    createdAt: '2024-01-06T12:30:00Z',
  },
];

const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: '2',
    sender: mockUsers[1],
    content: 'Salut ! Le MacBook est-il toujours disponible ?',
    timestamp: '2024-01-15T14:30:00Z',
    read: true,
  },
  {
    id: 'm2',
    senderId: '1',
    sender: mockUsers[0],
    content: 'Salut ! Oui il est toujours disponible. Tu peux passer le voir quand tu veux.',
    timestamp: '2024-01-15T14:32:00Z',
    read: true,
  },
  {
    id: 'm3',
    senderId: '2',
    sender: mockUsers[1],
    content: 'Parfait ! Je peux passer demain après-midi ?',
    timestamp: '2024-01-15T14:35:00Z',
    read: false,
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    participants: [mockUsers[0], mockUsers[1]],
    lastMessage: mockMessages[2],
    unreadCount: 1,
    messages: mockMessages,
    itemId: '1',
    item: mockItems[0],
  },
  {
    id: 'c2',
    participants: [mockUsers[0], mockUsers[2]],
    lastMessage: {
      id: 'm4',
      senderId: '3',
      sender: mockUsers[2],
      content: 'Merci pour les infos sur les cours !',
      timestamp: '2024-01-14T16:20:00Z',
      read: true,
    },
    unreadCount: 0,
    messages: [
      {
        id: 'm4',
        senderId: '3',
        sender: mockUsers[2],
        content: 'Merci pour les infos sur les cours !',
        timestamp: '2024-01-14T16:20:00Z',
        read: true,
      },
    ],
  },
];

export const currentUser = mockUsers[0];