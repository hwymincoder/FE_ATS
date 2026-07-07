import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/page-header';
import { useAuth } from '@/hooks/use-auth';

const STATS = [
    { key: 'orders', label: 'Tổng đơn hàng', value: 0, icon: ShoppingCart, suffix: '' },
    { key: 'revenue', label: 'Doanh thu', value: 0, icon: DollarSign, suffix: ' ₫' },
    { key: 'customers', label: 'Khách hàng', value: 0, icon: Users, suffix: '' },
    { key: 'products', label: 'Sản phẩm', value: 0, icon: Package, suffix: '' },
];

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div>
            <PageHeader
                title="Dashboard"
                description={`Chào mừng trở lại, ${user?.fullName || user?.username || 'bạn'}!`}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {STATS.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.key}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stat.value.toLocaleString()}
                                    {stat.suffix}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
