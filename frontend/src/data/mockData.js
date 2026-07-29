// Fallback demo data used when the FastAPI backend isn't running,
// so the dashboard is always explorable out of the box.

export const mockProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300',
    current_price: 134900,
    ai_price: 129900,
    change_pct: -3.7,
    demand_level: 'High',
    stock_quantity: 34,
  },
  {
    id: 2,
    name: 'Sony WH-1000XM5',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300',
    current_price: 29990,
    ai_price: 31490,
    change_pct: 5.0,
    demand_level: 'Medium',
    stock_quantity: 120,
  },
  {
    id: 3,
    name: 'Nike Air Max',
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
    current_price: 8995,
    ai_price: 9395,
    change_pct: 4.4,
    demand_level: 'High',
    stock_quantity: 210,
  },
  {
    id: 4,
    name: 'Fossil Smartwatch',
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
    current_price: 15995,
    ai_price: 14995,
    change_pct: -6.3,
    demand_level: 'Low',
    stock_quantity: 340,
  },
  {
    id: 5,
    name: 'Titan Perfume',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300',
    current_price: 1995,
    ai_price: 1895,
    change_pct: -5.0,
    demand_level: 'Low',
    stock_quantity: 480,
  },
  {
    id: 6,
    name: 'MacBook Air M2',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300',
    current_price: 104990,
    ai_price: 97490,
    change_pct: -7.1,
    demand_level: 'High',
    stock_quantity: 18,
  },
]

export const revenueTrend = [
  { month: 'Feb', revenue: 1980000, profit: 480000 },
  { month: 'Mar', revenue: 2150000, profit: 510000 },
  { month: 'Apr', revenue: 2020000, profit: 495000 },
  { month: 'May', revenue: 2350000, profit: 560000 },
  { month: 'Jun', revenue: 2600000, profit: 640000 },
  { month: 'Jul', revenue: 2845320, profit: 732850 },
]

export const priceChangeOverview = [
  { name: 'Price Increased', value: 62, color: '#22e6a3' },
  { name: 'Price Decreased', value: 54, color: '#f43f5e' },
  { name: 'No Change', value: 36, color: '#8b5cf6' },
]

export const demandForecast = [
  { week: 'W1', demand: 62 },
  { week: 'W2', demand: 68 },
  { week: 'W3', demand: 71 },
  { week: 'W4', demand: 80 },
  { week: 'W5', demand: 85 },
  { week: 'W6', demand: 88 },
]

export const competitorData = {
  ourPrice: 97490,
  amazon: 99999,
  flipkart: 98500,
}
