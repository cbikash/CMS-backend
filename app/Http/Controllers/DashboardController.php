<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Visitor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // PieChart: Visits by country
        $pieData = Visitor::select('country', DB::raw('COUNT(*) as value'))
            ->groupBy('country')
            ->whereNotNull('country')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->country,
                    'value' => $item->value,
                ];
            });

        // BarChart: Visits per day, split by browser (example: Chrome vs Others)
        $barData = Visitor::select(
            DB::raw('DATE(visited_at) as name'),
            DB::raw('SUM(CASE WHEN browser LIKE "%Chrome%" THEN 1 ELSE 0 END) as TeamA'),
            DB::raw('SUM(CASE WHEN browser NOT LIKE "%Chrome%" THEN 1 ELSE 0 END) as TeamB')
        )
            ->groupBy(DB::raw('DATE(visited_at)'))
            ->orderBy('name')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'TeamA' => $item->TeamA,
                    'TeamB' => $item->TeamB,
                ];
            });


        return Inertia::render('dashboard', [
            'pieData' => $pieData,
            'barData' => $barData,
            'stats' => [
                'message' => $this->getStatMessage(),
                'user' => $this->getStatUser()
            ]
        ]);
    }

    public function getStatMessage()
    {
        // Total unique visitors (distinct ip_address)
        $totalMessage = Message::count();

        // Calculate trend: Unique visitors in the last 30 days vs. previous 30 days
        $now = Carbon::now();
        $last30DaysCount = Visitor::whereBetween('visited_at', [
            $now->copy()->subDays(30),
            $now,
        ])->distinct('ip_address')->count('ip_address');

        $previous30DaysCount = Visitor::whereBetween('visited_at', [
            $now->copy()->subDays(60),
            $now->copy()->subDays(30),
        ])->distinct('ip_address')->count('ip_address');

        // Calculate percentage change, avoiding division by zero
        $trend = $previous30DaysCount > 0
            ? number_format((($last30DaysCount - $previous30DaysCount) / $previous30DaysCount) * 100, 1)
            : ($last30DaysCount > 0 ? '+100.0' : '0.0');

        // Prefix trend with "+" for positive values
        $trend = ($trend > 0 ? '+' : '') . $trend . '%';

        return [
            'value' => $totalMessage,
            'trend' => $trend,
        ];
    }

    public function getStatUser(): array
    {
        $last30DaysUniqueVisitors = Visitor::whereBetween('visited_at', [
            Carbon::now()->subDays(30),
            Carbon::now(),
        ])->distinct('ip_address')->count('ip_address');

        $value = $last30DaysUniqueVisitors >= 1000000
            ? number_format($last30DaysUniqueVisitors / 1000000, 2) . 'm'
            : ($last30DaysUniqueVisitors >= 1000
                ? number_format($last30DaysUniqueVisitors / 1000, 2) . 'k'
                : $last30DaysUniqueVisitors);

        $previous30DaysCount = Visitor::whereBetween('visited_at', [
            Carbon::now()->subDays(60),
            Carbon::now()->subDays(30),
        ])->distinct('ip_address')->count('ip_address');

        $trend = $previous30DaysCount > 0
            ? number_format((($last30DaysUniqueVisitors - $previous30DaysCount) / $previous30DaysCount) * 100, 1)
            : ($last30DaysUniqueVisitors > 0 ? '+100.0' : '0.0');

        // Prefix trend with "+" for positive values
        $trend = ($trend > 0 ? '+' : '') . $trend . '%';

        return [
            'value' => $value,
            'trend' => $trend,
        ];
    }
}
