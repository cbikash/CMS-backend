import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { LineChart, UserPlus, ShoppingCart, Mail, Pen, Users, Eye } from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Legend,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

const pieData = [
    { name: 'America', value: 400 },
    { name: 'Asia', value: 300 },
    { name: 'Europe', value: 300 },
    { name: 'Africa', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const barData = [
    { name: 'Jan', TeamA: 40, TeamB: 24 },
    { name: 'Feb', TeamA: 30, TeamB: 13 },
    { name: 'Mar', TeamA: 20, TeamB: 98 },
    { name: 'Apr', TeamA: 27, TeamB: 39 },
    { name: 'May', TeamA: 18, TeamB: 48 },
    { name: 'Jun', TeamA: 23, TeamB: 38 },
    { name: 'Jul', TeamA: 34, TeamB: 43 },
];

const radarData = [
    { subject: 'Math', A: 120, B: 110, fullMark: 150 },
    { subject: 'Chinese', A: 98, B: 130, fullMark: 150 },
    { subject: 'English', A: 86, B: 130, fullMark: 150 },
    { subject: 'Geography', A: 99, B: 100, fullMark: 150 },
    { subject: 'Physics', A: 85, B: 90, fullMark: 150 },
    { subject: 'History', A: 65, B: 85, fullMark: 150 },
];

const renderEmptyState = (message) => (
    <div className="flex items-center justify-center h-[250px] text-gray-500 dark:text-gray-400">
        {message}
    </div>
);

export default function Dashboard(props) {
    const user = props.auth.user
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-10 p-6">
                {/* Hero Section */}
                <section className="rounded-xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-6 shadow-inner">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome back, {user.name} 👋
                    </h1>
                    <p className="text-gray-600 mt-2">Here’s what’s happening with your blog today.</p>
                </section>

                {/* Stats */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Weekly Sales" value="714k" trend="+2.6%" color="blue" icon={<LineChart />} />
                    {props.stats.user &&
                        <StatCard title="New Users" value={props.stats.user.value} trend={props.stats.user.trend} color="purple" icon={<UserPlus />} />
                    }
                    <StatCard title="Purchase Orders" value="1.72m" trend="+2.8%" color="yellow" icon={<ShoppingCart />} />
                    {props.stats.message &&
                        <StatCard title="Messages" value={props.stats.message.value} trend={`${props.stats.message.trend}`} color="pink" icon={<Mail />} />
                    }
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {props.pieData.length > 0 ? (
                        <Card title="Current Visits">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={props.pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={80}
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        labelLine={true}
                                    >
                                        {props.pieData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [value, name]} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    ) : (
                        renderEmptyState('No visit data available.')
                    )}


                    <Card title="Website Visits">
                        {props.barData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={props.barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: '#4B5563' }}
                                        axisLine={{ stroke: '#4B5563' }}
                                    />
                                    <YAxis
                                        tick={{ fill: '#4B5563' }}
                                        axisLine={{ stroke: '#4B5563' }}
                                    />
                                    <Tooltip
                                        formatter={(value, name) => [value, name]}
                                        labelFormatter={(label) => `Date: ${label}`}
                                    />
                                    <Legend
                                        formatter={(value) => (
                                            <span className="text-gray-800 dark:text-gray-200">{value}</span>
                                        )}
                                    />
                                    <Bar dataKey="TeamA" fill="#8884d8" name="Chrome" />
                                    <Bar dataKey="TeamB" fill="#82ca9d" name="Others" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            renderEmptyState('No website visit data available.')
                        )}
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Conversion Rates">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={barData} layout="vertical">
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" />
                                <Tooltip />
                                <Bar dataKey="TeamA" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card title="Current Subject">
                        <ResponsiveContainer width="100%" height={250}>
                            <RadarChart data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis />
                                <Radar name="Series 1" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                <Radar name="Series 2" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, trend, color, icon }: any) {
    const bg  = {
        blue: 'from-blue-100 to-blue-200',
        purple: 'from-purple-100 to-purple-200',
        yellow: 'from-yellow-100 to-yellow-200',
        pink: 'from-pink-100 to-pink-200',
    }[color];

    return (
        <div className={`rounded-xl p-5 bg-gradient-to-br ${bg} shadow-sm`}>
            <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium text-gray-700">{title}</div>
                <div className="text-xs text-green-600">{trend}</div>
            </div>
            <div className="flex justify-between items-center">
                <div className="text-xl font-bold">{value}</div>
                <div className="text-blue-600">{icon}</div>
            </div>
        </div>
    );
}

function Card({ title, children }: any) {
    return (
        <div className="rounded-xl border bg-white shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">{title}</h3>
            {children}
        </div>
    );
}
