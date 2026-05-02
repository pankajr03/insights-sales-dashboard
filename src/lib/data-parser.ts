import { parse, format } from 'date-fns';

export interface SalesRecord {
  orderNumber: string;
  product: string;
  price: number;
  date: Date;
  paymentMethod: string;
  formattedDate: string;
}

export function parseSalesData(csv: string): SalesRecord[] {
  const lines = csv.trim().split('\n');
  const [header, ...rows] = lines;

  return rows.map(row => {
    // Simple CSV split (doesn't handle quotes, but our data is clean)
    const [orderNumber, product, priceStr, dateStr, paymentMethod] = row.split(',');
    
    const price = parseFloat(priceStr.replace('$', ''));
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    
    return {
      orderNumber,
      product,
      price,
      date,
      paymentMethod,
      formattedDate: format(date, 'MMM dd, yyyy'),
    };
  });
}

export interface MetricCardData {
  title: string;
  value: string;
  description: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function calculateMetrics(data: SalesRecord[]): MetricCardData[] {
  const totalRevenue = data.reduce((sum, item) => sum + item.price, 0);
  const totalOrders = new Set(data.map(d => d.orderNumber)).size;
  const avgOrderValue = totalRevenue / totalOrders;
  const uniqueProducts = new Set(data.map(d => d.product)).size;

  return [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: 'Gross revenue from all sales',
      trend: 'up',
      change: '+12.5%'
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      description: 'Number of unique order IDs',
      trend: 'neutral'
    },
    {
      title: 'Avg Order Value',
      value: `$${avgOrderValue.toFixed(2)}`,
      description: 'Average spent per order',
      trend: 'up',
      change: '+4.2%'
    },
    {
      title: 'Active Products',
      value: uniqueProducts.toString(),
      description: 'Number of unique SKUs sold',
      trend: 'neutral'
    }
  ];
}

export function getRevenueByDate(data: SalesRecord[]) {
  const grouped = data.reduce((acc, curr) => {
    const dateStr = format(curr.date, 'yyyy-MM-dd');
    acc[dateStr] = (acc[dateStr] || 0) + curr.price;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getRevenueByProduct(data: SalesRecord[]) {
  const grouped = data.reduce((acc, curr) => {
    acc[curr.product] = (acc[curr.product] || 0) + curr.price;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped)
    .map(([product, revenue]) => ({ product, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function getPaymentMethodDistribution(data: SalesRecord[]) {
  const grouped = data.reduce((acc, curr) => {
    acc[curr.paymentMethod] = (acc[curr.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped).map(([method, count]) => ({ name: method, value: count }));
}
