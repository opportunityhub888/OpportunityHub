import { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Award, GraduationCap, Building2, ExternalLink, X, Clock, TrendingUp, Star, LayoutGrid, List, Calendar as CalendarIcon, Sparkles, Target, Users, ArrowRight, Bookmark, Filter, Import as SortAsc, Dessert as SortDesc, Rocket, DollarSign } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  category: string;
  deadline: string | null;
  eligibility: string | null;
  amount: string | null;
  link: string | null;
  featured: boolean;
  created_at: string;
}

const categoryConfig: Record<string, { label: string; gradient: string; icon: typeof Award }> = {
  scholarship: { label: 'Scholarship', gradient: 'from-emerald-500 to-teal-600', icon: GraduationCap },
  olympiad: { label: 'Olympiad', gradient: 'from-blue-500 to-indigo-600', icon: Award },
  competition: { label: 'Competition', gradient: 'from-orange-500 to-red-500', icon: TrendingUp },
  internship: { label: 'Internship', gradient: 'from-violet-500 to-purple-600', icon: Building2 },
  program: { label: 'Program', gradient: 'from-cyan-500 to-blue-600', icon: Rocket },
  grant: { label: 'Grant', gradient: 'from-amber-500 to-orange-600', icon: DollarSign },
};

function getDaysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const deadline = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  return Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDeadline(dateStr: string | null): { text: string; urgent: boolean; past: boolean } {
  const days = getDaysUntil(dateStr);
  if (days === null) return { text: 'Rolling basis', urgent: false, past: false };
  if (days < 0) return { text: 'Deadline passed', urgent: false, past: true };
  if (days === 0) return { text: 'Due today!', urgent: true, past: false };
  if (days === 1) return { text: 'Due tomorrow', urgent: true, past: false };
  if (days <= 7) return { text: `${days} days left`, urgent: true, past: false };
  if (days <= 30) return { text: `${days} days left`, urgent: false, past: false };
  return { text: new Date(dateStr!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), urgent: false, past: false };
}

const backgroundImage = 'https://images.unsplash.com/photo-1523050854058-8df90110a9d6?auto=format&fit=crop&w=2000&q=80';

export default function App() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [deadlineFilter, setDeadlineFilter] = useState<'all' | 'week' | 'month' | 'passed'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [sortBy, setSortBy] = useState<'deadline' | 'title' | 'created'>('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('bookmarked');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  useEffect(() => {
    localStorage.setItem('bookmarked', JSON.stringify([...bookmarked]));
  }, [bookmarked]);

  async function fetchOpportunities() {
    try {
      const { data, error: fetchError } = await supabase
        .from('opportunities')
        .select('*')
        .order('deadline', { ascending: true, nullsFirst: false });

      if (fetchError) throw fetchError;
      setOpportunities(data || []);
    } catch (err) {
      setError('Failed to load opportunities. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const toggleBookmark = useCallback((id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const filteredOpportunities = useMemo(() => {
    let result = opportunities.filter((opp) => {
      if (search) {
        const searchLower = search.toLowerCase();
        if (
          !opp.title.toLowerCase().includes(searchLower) &&
          !opp.organization.toLowerCase().includes(searchLower) &&
          !opp.description.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      if (selectedCategory && opp.category !== selectedCategory) return false;

      if (showOnlyBookmarked && !bookmarked.has(opp.id)) return false;

      const days = getDaysUntil(opp.deadline);
      if (deadlineFilter === 'week' && (days === null || days < 0 || days > 7)) return false;
      if (deadlineFilter === 'month' && (days === null || days < 0 || days > 30)) return false;
      if (deadlineFilter === 'passed' && (days === null || days >= 0)) return false;

      return true;
    });

    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'deadline') {
        const aDays = getDaysUntil(a.deadline) ?? Infinity;
        const bDays = getDaysUntil(b.deadline) ?? Infinity;
        cmp = aDays - bDays;
      } else if (sortBy === 'title') {
        cmp = a.title.localeCompare(b.title);
      } else if (sortBy === 'created') {
        cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [opportunities, search, selectedCategory, deadlineFilter, sortBy, sortOrder, showOnlyBookmarked, bookmarked]);

  const featuredOpportunities = opportunities.filter((o) => o.featured);
  const categories = useMemo(() => Array.from(new Set(opportunities.map((o) => o.category))).sort(), [opportunities]);
  const upcomingDeadlines = opportunities
    .filter((o) => {
      const days = getDaysUntil(o.deadline);
      return days !== null && days >= 0 && days <= 30;
    })
    .sort((a, b) => (getDaysUntil(a.deadline) ?? 0) - (getDaysUntil(b.deadline) ?? 0))
    .slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
            <Award className="absolute inset-0 m-auto w-8 h-8 text-blue-400" />
          </div>
          <p className="text-slate-400 text-lg">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700 max-w-md">
          <Award className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg mb-6">{error}</p>
          <button
            onClick={fetchOpportunities}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-900" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiA2em0wIDNjLTEuNjU3IDAtMyAxLjM0My0zIDNzMS4zNDMgMyAzIDMgMy0xLjM0MyAzLTMtMS4zNDMtMy0zLTN6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Free resource for high school students</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Next{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Opportunity
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Discover scholarships, competitions, internships, and programs to build your future.
              All in one place, completely free.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#opportunities"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                Browse Opportunities
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#upcoming"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-all"
              >
                <CalendarIcon className="w-4 h-4" />
                View Calendar
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Award, value: opportunities.length, label: 'Opportunities' },
              { icon: GraduationCap, value: opportunities.filter(o => o.category === 'scholarship').length, label: 'Scholarships' },
              { icon: DollarSign, value: '$3M+', label: 'In Prizes' },
              { icon: Users, value: '50K+', label: 'Students Helped' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 text-center hover:border-blue-500/50 transition-all group"
              >
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Find opportunities in three easy steps</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: 1, icon: Search, title: 'Browse', desc: 'Explore our curated database of scholarships, competitions, and programs' },
              { step: 2, icon: Filter, title: 'Filter', desc: 'Find opportunities that match your interests and timeline' },
              { step: 3, icon: Target, title: 'Apply', desc: 'Click through to official pages and submit your application' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative bg-slate-800/30 rounded-2xl p-6 sm:p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all group">
                <div className="absolute -top-4 left-6 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-white text-sm font-bold">
                  Step {step}
                </div>
                <Icon className="w-10 h-10 text-blue-400 mb-4 mt-2 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      {featuredOpportunities.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Star className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Featured Opportunities</h2>
                <p className="text-sm text-slate-400">Top picks hand-selected by our team</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredOpportunities.slice(0, 3).map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  featured
                  bookmarked={bookmarked.has(opp.id)}
                  onToggleBookmark={toggleBookmark}
                  onClick={() => setSelectedOpp(opp)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Deadlines */}
      <section id="upcoming" className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Upcoming Deadlines</h2>
                <p className="text-sm text-slate-400">Don't miss these closing soon</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto -mx-4 px-4 pb-2">
            <div className="flex gap-4 min-w-max">
              {upcomingDeadlines.map((opp) => {
                const days = getDaysUntil(opp.deadline);
                const catConfig = categoryConfig[opp.category] || categoryConfig.program;
                return (
                  <div
                    key={opp.id}
                    onClick={() => setSelectedOpp(opp)}
                    className="flex-shrink-0 w-64 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4 cursor-pointer hover:border-slate-600 hover:bg-slate-800/70 transition-all group"
                  >
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${catConfig.gradient} text-white mb-3`}>
                      {days !== null && days <= 7 && <Clock className="w-3 h-3" />}
                      {catConfig.label}
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">{opp.organization}</p>
                    <div className={`text-xs font-medium ${days !== null && days <= 7 ? 'text-red-400' : 'text-slate-400'}`}>
                      {formatDeadline(opp.deadline).text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Browse Section */}
      <section id="opportunities" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Controls */}
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-4 sm:p-6 mb-8 sticky top-20 z-40">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1">
                {[
                  { mode: 'grid' as const, icon: LayoutGrid, label: 'Grid' },
                  { mode: 'list' as const, icon: List, label: 'List' },
                  { mode: 'calendar' as const, icon: CalendarIcon, label: 'Calendar' },
                ].map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      viewMode === mode
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:border-slate-600 transition-all"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {(selectedCategory || deadlineFilter !== 'all' || showOnlyBookmarked) && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                    <select
                      value={selectedCategory || ''}
                      onChange={(e) => setSelectedCategory(e.target.value || null)}
                      className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">All categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {categoryConfig[cat]?.label || cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Deadline Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Deadline</label>
                    <select
                      value={deadlineFilter}
                      onChange={(e) => setDeadlineFilter(e.target.value as typeof deadlineFilter)}
                      className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All deadlines</option>
                      <option value="week">Within 7 days</option>
                      <option value="month">Within 30 days</option>
                      <option value="passed">Passed deadlines</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Sort by</label>
                    <div className="flex gap-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        className="flex-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="deadline">Deadline</option>
                        <option value="title">Title</option>
                        <option value="created">Recently added</option>
                      </select>
                      <button
                        onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
                        className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                      >
                        {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Bookmarked Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Bookmarks</label>
                    <button
                      onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
                      className={`w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        showOnlyBookmarked
                          ? 'bg-blue-600 text-white border border-blue-500'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white hover:border-slate-600'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${showOnlyBookmarked ? 'fill-current' : ''}`} />
                      {showOnlyBookmarked ? 'Show only bookmarked' : 'All opportunities'}
                    </button>
                  </div>
                </div>

                {/* Clear Filters */}
                {(search || selectedCategory || deadlineFilter !== 'all' || showOnlyBookmarked) && (
                  <button
                    onClick={() => {
                      setSearch('');
                      setSelectedCategory(null);
                      setDeadlineFilter('all');
                      setShowOnlyBookmarked(false);
                    }}
                    className="mt-4 text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-400">
              <span className="font-semibold text-white">{filteredOpportunities.length}</span>{' '}
              {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'} found
            </p>
          </div>

          {/* Opportunities Display */}
          {filteredOpportunities.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
              <Award className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">No opportunities found</p>
              <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or search terms</p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory(null);
                  setDeadlineFilter('all');
                  setShowOnlyBookmarked(false);
                }}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  bookmarked={bookmarked.has(opp.id)}
                  onToggleBookmark={toggleBookmark}
                  onClick={() => setSelectedOpp(opp)}
                />
              ))}
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-3">
              {filteredOpportunities.map((opp) => (
                <OpportunityListItem
                  key={opp.id}
                  opportunity={opp}
                  bookmarked={bookmarked.has(opp.id)}
                  onToggleBookmark={toggleBookmark}
                  onClick={() => setSelectedOpp(opp)}
                />
              ))}
            </div>
          ) : (
            <CalendarView opportunities={filteredOpportunities} onSelect={setSelectedOpp} />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">OpportunityHub</div>
                <div className="text-sm text-slate-500">Helping students succeed</div>
              </div>
            </div>
            <p className="text-sm text-slate-500 text-center md:text-right">
              A free, non-profit resource for high school students worldwide.
            </p>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedOpp && (
        <OpportunityModal
          opportunity={selectedOpp}
          bookmarked={bookmarked.has(selectedOpp.id)}
          onToggleBookmark={toggleBookmark}
          onClose={() => setSelectedOpp(null)}
        />
      )}
    </div>
  );
}

function OpportunityCard({
  opportunity: opp,
  featured = false,
  bookmarked,
  onToggleBookmark,
  onClick,
}: {
  opportunity: Opportunity;
  featured?: boolean;
  bookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onClick: () => void;
}) {
  const { text: deadlineText, urgent, past } = formatDeadline(opp.deadline);
  const catConfig = categoryConfig[opp.category] || categoryConfig.program;
  const CatIcon = catConfig.icon;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-slate-900/50 backdrop-blur border rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] ${
        featured ? 'border-amber-500/30 hover:border-amber-500/50' : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Category Badge */}
      <div className={`h-1 bg-gradient-to-r ${catConfig.gradient}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${catConfig.gradient} text-white`}>
            <CatIcon className="w-3.5 h-3.5" />
            {catConfig.label}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(opp.id);
            }}
            className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-800 transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-2">
          {opp.title}
        </h3>
        <p className="text-sm text-slate-500 mb-3">{opp.organization}</p>

        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{opp.description}</p>

        {opp.amount && (
          <p className="text-sm font-medium text-emerald-400 mb-4">{opp.amount}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Clock className={`w-4 h-4 ${past ? 'text-slate-600' : urgent ? 'text-red-400' : 'text-slate-500'}`} />
            <span className={`${past ? 'text-slate-600 line-through' : urgent ? 'text-red-400 font-medium' : 'text-slate-400'}`}>
              {deadlineText}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>View details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function OpportunityListItem({
  opportunity: opp,
  bookmarked,
  onToggleBookmark,
  onClick,
}: {
  opportunity: Opportunity;
  bookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onClick: () => void;
}) {
  const { text: deadlineText, urgent, past } = formatDeadline(opp.deadline);
  const catConfig = categoryConfig[opp.category] || categoryConfig.program;
  const CatIcon = catConfig.icon;

  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-4 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 cursor-pointer hover:border-slate-700 hover:bg-slate-900/70 transition-all"
    >
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${catConfig.gradient} flex items-center justify-center`}>
        <CatIcon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-slate-500">{catConfig.label}</span>
          {opp.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />}
        </div>
        <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
          {opp.title}
        </h3>
        <p className="text-sm text-slate-500 truncate">{opp.organization}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        {opp.amount && <p className="text-sm font-medium text-emerald-400 mb-1">{opp.amount}</p>}
        <div className={`flex items-center justify-end gap-1.5 text-xs ${past ? 'text-slate-600' : urgent ? 'text-red-400' : 'text-slate-400'}`}>
          <Clock className="w-3.5 h-3.5" />
          <span className={past ? 'line-through' : urgent ? 'font-medium' : ''}>{deadlineText}</span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleBookmark(opp.id);
        }}
        className="flex-shrink-0 p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-800 transition-colors"
      >
        <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
      </button>
    </div>
  );
}

function CalendarView({
  opportunities,
  onSelect,
}: {
  opportunities: Opportunity[];
  onSelect: (opp: Opportunity) => void;
}) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const byDate = useMemo(() => {
    const map = new Map<string, Opportunity[]>();
    opportunities.forEach((opp) => {
      if (!opp.deadline) return;
      const key = opp.deadline;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(opp);
    });
    return map;
  }, [opportunities]);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800">
        <h3 className="text-lg font-semibold text-white">
          {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
      </div>
      <div className="grid grid-cols-7 gap-px bg-slate-800">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="p-3 text-center text-xs font-medium text-slate-500 bg-slate-900">
            {d}
          </div>
        ))}
        {days.map((day, i) => {
          if (!day) return <div key={i} className="h-24 bg-slate-900/50" />;
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const opps = byDate.get(dateStr) || [];
          const isToday = day === now.getDate();
          return (
            <div
              key={i}
              className={`h-24 p-2 bg-slate-900 ${isToday ? 'ring-1 ring-blue-500 ring-inset' : ''}`}
            >
              <div className={`text-xs font-medium mb-1 ${isToday ? 'text-blue-400' : 'text-slate-500'}`}>
                {day}
              </div>
              <div className="space-y-1">
                {opps.slice(0, 2).map((opp) => (
                  <button
                    key={opp.id}
                    onClick={() => onSelect(opp)}
                    className="block w-full text-left px-1.5 py-0.5 rounded text-xs truncate bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-300 hover:from-blue-600/30 hover:to-cyan-600/30"
                  >
                    {opp.title}
                  </button>
                ))}
                {opps.length > 2 && (
                  <div className="text-xs text-slate-500 px-1">+{opps.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OpportunityModal({
  opportunity: opp,
  bookmarked,
  onToggleBookmark,
  onClose,
}: {
  opportunity: Opportunity;
  bookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onClose: () => void;
}) {
  const { text: deadlineText, urgent, past } = formatDeadline(opp.deadline);
  const catConfig = categoryConfig[opp.category] || categoryConfig.program;
  const CatIcon = catConfig.icon;
  const days = getDaysUntil(opp.deadline);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className={`h-2 bg-gradient-to-r ${catConfig.gradient}`} />
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${catConfig.gradient} flex items-center justify-center`}>
                <CatIcon className="w-7 h-7 text-white" />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${catConfig.gradient} text-white`}>
                {catConfig.label}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2">{opp.title}</h2>
          <p className="text-lg text-slate-400 mb-6">{opp.organization}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {days !== null && (
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  Deadline
                </div>
                <div className={`text-lg font-semibold ${past ? 'text-slate-600 line-through' : urgent ? 'text-red-400' : 'text-white'}`}>
                  {deadlineText}
                </div>
              </div>
            )}
            {opp.amount && (
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                  <DollarSign className="w-4 h-4" />
                  Amount
                </div>
                <div className="text-lg font-semibold text-emerald-400">{opp.amount}</div>
              </div>
            )}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Award className="w-4 h-4" />
                  Type
                </div>
                <div className="text-lg font-semibold text-white">{catConfig.label}</div>
              </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-400 mb-2">About</h3>
            <p className="text-slate-300">{opp.description}</p>
          </div>

          {/* Eligibility */}
          {opp.eligibility && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Eligibility</h3>
              <p className="text-slate-300">{opp.eligibility}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
            {opp.link && (
              <a
                href={opp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Official Page
              </a>
            )}
            <button
              onClick={() => onToggleBookmark(opp.id)}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                bookmarked
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-800 text-white border border-slate-700 hover:border-slate-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
