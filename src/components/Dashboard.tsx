import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  CreditCard,
  LayoutGrid,
  List,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RAW_CSV_DATA } from '@/src/constants/raw-data';
import { 
  parseSalesData, 
  calculateMetrics, 
  getRevenueByDate, 
  getRevenueByProduct, 
  getPaymentMethodDistribution 
} from '@/src/lib/data-parser';
import { cn } from '@/lib/utils';

const COLORS = ['#141414', '#5A5A40', '#F27D26', '#FF4444', '#00FF00', '#000000'];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const data = useMemo(() => parseSalesData(RAW_CSV_DATA), []);
  const metrics = useMemo(() => calculateMetrics(data), [data]);
  const revenueByDate = useMemo(() => getRevenueByDate(data), [data]);
  const revenueByProduct = useMemo(() => getRevenueByProduct(data), [data]);
  const paymentMethodData = useMemo(() => getPaymentMethodDistribution(data), [data]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(order => 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Header */}
      <header className="border-b border-[#141414] bg-[#E4E3E0] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#141414] text-[#E4E3E0] flex items-center justify-center font-bold text-xl">
              I
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight uppercase">Insights</h1>
              <p className="text-[11px] font-mono opacity-50 uppercase tracking-widest">Global Sales Operations</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input 
                type="text" 
                placeholder="Search orders..."
                className="bg-transparent border-b border-[#141414] py-1 pl-10 pr-4 text-sm focus:outline-none focus:border-opacity-100 transition-all border-opacity-30 placeholder:opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 text-[10px] uppercase font-bold">
              <span className="opacity-50">Status:</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Live Data
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-8">
            <TabsList className="bg-transparent h-auto p-0 gap-8 border-none">
              <TabsTrigger 
                value="overview" 
                className="p-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold uppercase tracking-widest text-xs border-b-2 border-transparent data-[state=active]:border-[#141414] rounded-none pb-2 transition-all opacity-50 data-[state=active]:opacity-100"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="inventory" 
                className="p-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold uppercase tracking-widest text-xs border-b-2 border-transparent data-[state=active]:border-[#141414] rounded-none pb-2 transition-all opacity-50 data-[state=active]:opacity-100"
              >
                Inventory
              </TabsTrigger>
              <TabsTrigger 
                value="transactions" 
                className="p-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold uppercase tracking-widest text-xs border-b-2 border-transparent data-[state=active]:border-[#141414] rounded-none pb-2 transition-all opacity-50 data-[state=active]:opacity-100"
              >
                Transactions
              </TabsTrigger>
            </TabsList>
            
            <div className="text-[11px] font-mono opacity-50">
              LAST UPDATED: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <TabsContent value="overview">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12"
            >
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, idx) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <Card className="bg-[#E4E3E0] border-[#141414] rounded-none shadow-none group hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors duration-300">
                      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-[11px] font-mono uppercase tracking-[0.2em] opacity-60">
                          {metric.title}
                        </CardTitle>
                        {metric.title.includes('Revenue') ? <DollarSign className="w-4 h-4 opacity-40" /> : 
                         metric.title.includes('Orders') ? <ShoppingCart className="w-4 h-4 opacity-40" /> :
                         metric.title.includes('Avg') ? <TrendingUp className="w-4 h-4 opacity-40" /> :
                         <Package className="w-4 h-4 opacity-40" />}
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold tracking-tighter mb-1">{metric.value}</div>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] opacity-60 uppercase">{metric.description}</p>
                          {metric.change && (
                            <span className={cn(
                              "text-[10px] font-bold px-1 py-0.5",
                              metric.trend === 'up' ? "bg-green-500/20 text-green-700 group-hover:text-green-400" : "bg-red-500/20 text-red-700 group-hover:text-red-400"
                            )}>
                              {metric.change}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Main Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="lg:col-span-2">
                  <Card className="bg-[#E4E3E0] border-[#141414] rounded-none shadow-none h-full">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Revenue Performance Trend
                      </CardTitle>
                      <CardDescription className="text-[11px] font-mono italic opacity-50 uppercase">Daily revenue accumulation over reporting period</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueByDate}>
                          <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#141414" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#141414" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1d1d1" />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontFamily: 'monospace' }}
                            tickFormatter={(str) => str.split('-').slice(1).join('/')}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontFamily: 'monospace' }}
                            tickFormatter={(val) => `$${val}`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#141414', 
                              border: 'none', 
                              borderRadius: '0', 
                              color: '#E4E3E0',
                              fontFamily: 'monospace',
                              fontSize: '12px'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#141414" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#revenueGradient)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="bg-[#E4E3E0] border-[#141414] rounded-none shadow-none h-full">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Payment Logistics
                      </CardTitle>
                      <CardDescription className="text-[11px] font-mono italic opacity-50 uppercase">Distribution by transaction type</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] flex items-center justify-center pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={paymentMethodData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                          >
                            {paymentMethodData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                             contentStyle={{ 
                              backgroundColor: '#141414', 
                              border: 'none', 
                              borderRadius: '0', 
                              color: '#E4E3E0',
                              fontFamily: 'monospace',
                              fontSize: '12px'
                            }}
                          />
                          <Legend 
                            verticalAlign="bottom" 
                            align="center"
                            iconType="square"
                            wrapperStyle={{
                              fontSize: '10px',
                              textTransform: 'uppercase',
                              fontWeight: 'bold',
                              paddingTop: '20px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Bottom Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                <motion.div variants={itemVariants}>
                  <Card className="bg-[#E4E3E0] border-[#141414] rounded-none shadow-none">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold uppercase tracking-wider">Top Product Lines</CardTitle>
                      <CardDescription className="text-[11px] font-mono italic opacity-50 uppercase">Sorted by gross revenue contribution</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={revenueByProduct.slice(0, 7)}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#d1d1d1" />
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="product" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false} 
                            width={150} 
                            tick={{ fontSize: 9, fontFamily: 'sans-serif', fontWeight: 'bold', textAnchor: 'start' }}
                            dx={-140}
                          />
                          <Tooltip 
                            cursor={{ fill: 'transparent' }}
                             contentStyle={{ 
                              backgroundColor: '#141414', 
                              border: 'none', 
                              borderRadius: '0', 
                              color: '#E4E3E0',
                              fontFamily: 'monospace',
                              fontSize: '12px'
                            }}
                          />
                          <Bar dataKey="revenue" fill="#141414" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="bg-[#E4E3E0] border-[#141414] rounded-none shadow-none overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider">Recent Flow</CardTitle>
                        <CardDescription className="text-[11px] font-mono italic opacity-50 uppercase">Latest transactions added to registry</CardDescription>
                      </div>
                      <Badge variant="outline" className="border-[#141414] rounded-none text-[10px] uppercase font-bold px-2 py-1 flex items-center gap-1">
                        VIEW ALL <ArrowRight className="w-3 h-3" />
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-[#141414] hover:bg-transparent">
                            <TableHead className="text-[10px] font-mono uppercase font-bold text-[#141414] pl-6">ID</TableHead>
                            <TableHead className="text-[10px] font-mono uppercase font-bold text-[#141414]">Item</TableHead>
                            <TableHead className="text-[10px] font-mono uppercase font-bold text-[#141414] text-right pr-6">Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.slice(0, 6).map((order, i) => (
                            <TableRow key={i} className="border-[#141414] border-opacity-10 hover:bg-[#141414]/5 transition-colors cursor-pointer">
                              <TableCell className="font-mono text-xs pl-6">{order.orderNumber}</TableCell>
                              <TableCell className="text-xs font-medium uppercase tracking-tight">{order.product}</TableCell>
                              <TableCell className="text-right font-mono text-xs pr-6">${order.price.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="transactions">
            <motion.div 
               variants={containerVariants}
               initial="hidden"
               animate="visible"
            >
              <Card className="bg-[#E4E3E0] border-[#141414] rounded-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">Historical Registry</CardTitle>
                  <CardDescription className="text-[11px] font-mono italic opacity-50 uppercase">Full audit log of all sales records</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <Table>
                      <TableHeader className="sticky top-0 bg-[#E4E3E0] z-20">
                        <TableRow className="border-[#141414] hover:bg-transparent">
                          <TableHead className="text-[11px] font-bold text-[#141414] pl-6 italic font-serif opacity-50">STATION_ID</TableHead>
                          <TableHead className="text-[11px] font-bold text-[#141414] italic font-serif opacity-50">MODEL_DESCRIPTION</TableHead>
                          <TableHead className="text-[11px] font-bold text-[#141414] italic font-serif opacity-50">CURRENCY_VALUE</TableHead>
                          <TableHead className="text-[11px] font-bold text-[#141414] italic font-serif opacity-50">TIMESTAMP</TableHead>
                          <TableHead className="text-[11px] font-bold text-[#141414] italic font-serif opacity-50 pr-6">METHOD</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order, index) => (
                          <TableRow key={index} className="border-b border-[#141414] border-opacity-10 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors group cursor-pointer">
                            <TableCell className="font-mono text-xs pl-6 opacity-60 group-hover:opacity-100">{order.orderNumber}</TableCell>
                            <TableCell className="text-sm font-bold uppercase tracking-tighter">{order.product}</TableCell>
                            <TableCell className="font-mono text-xs">${order.price.toFixed(2)}</TableCell>
                            <TableCell className="text-xs">{order.formattedDate}</TableCell>
                            <TableCell className="text-[10px] font-bold uppercase pr-6">
                              <span className="border border-[#141414] group-hover:border-[#E4E3E0] px-2 py-0.5 rounded-full inline-block">
                                {order.paymentMethod}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="inventory">
            <motion.div 
               variants={containerVariants}
               initial="hidden"
               animate="visible"
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {revenueByProduct.map((item, idx) => {
                const count = data.filter(d => d.product === item.product).length;
                return (
                  <motion.div key={idx} variants={itemVariants}>
                    <Card className="bg-[#E4E3E0] border-[#141414] rounded-none shadow-none group transition-all duration-300">
                      <div className="h-2 bg-[#141414] w-full" style={{ opacity: (item.revenue / revenueByProduct[0].revenue) }} />
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold uppercase tracking-tight leading-tight">{item.product}</CardTitle>
                        <CardDescription className="text-[11px] font-mono opacity-50">SKU SERIES AC-392</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-end border-b border-[#141414] border-opacity-10 pb-4 mb-4">
                          <div className="text-xs uppercase font-bold opacity-40">Revenue Growth</div>
                          <div className="text-3xl font-bold tracking-tighter">${item.revenue.toLocaleString()}</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                             <div className="text-[10px] font-mono uppercase bg-[#141414] text-[#E4E3E0] px-2 py-0.5">{count} Units</div>
                             <div className="text-[10px] font-mono uppercase border border-[#141414] px-2 py-0.5">EST. STOCK: 42</div>
                          </div>
                          <TrendingUp className="w-4 h-4 opacity-30" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-[#141414] mt-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 bg-[#141414] text-[#E4E3E0] flex items-center justify-center font-bold text-lg">I</div>
           <p className="text-[10px] font-mono uppercase tracking-widest opacity-40">System Release 2.4.0 (2025 Prototype)</p>
        </div>
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest opacity-40">
          <a href="#" className="hover:opacity-100 transition-opacity">Protocol</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Architecture</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Security</a>
        </div>
        <div className="text-[10px] font-mono uppercase text-right opacity-30">
          DESIGNED FOR PRECISION DATA VISUALIZATION
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
