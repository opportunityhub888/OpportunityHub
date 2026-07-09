import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Search,
  Award,
  GraduationCap,
  Building2,
  ExternalLink,
  Filter,
  X,
  Clock,
  TrendingUp,
  Star,
  ChevronDown,
} from 'lucide-react';

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

const categoryConfig: Record<string, { label: string; color: string; icon: typeof Award }> = {
  scholarship: { label: 'Scholarship', color: 'bg-emerald-100 text-emerald-700', icon: GraduationCap },
  olympiad: { label: 'Olympiad', color: 'bg-blue-100 text-blue-700', icon: Award },
  competition: { label: 'Competition', color: 'bg-orange-100 text-orange-700', icon: TrendingUp },
  internship: { label: 'Internship', color: 'bg-purple-100 text-purple-700', icon: Building2 },
  program: { label: 'Program', color: 'bg-teal-100 text-teal-700', icon: Star },
  grant: { label: 'Grant', color: 'bg-amber-100 text-amber-700', icon: Award },
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
  if (days === 0) return { text: 'Due today', urgent: true, past: false };
  if (days === 1) return { text: 'Due tomorrow', urgent: true, past: false };
  if (days <= 7) return { text: `${days} days left`, urgent: true, past: false };
  return { text: new Date(dateStr!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), urgent: false, past: false };
}

export default function App() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [deadlineFilter, setDeadlineFilter] = useState<'all' | 'week' | 'month' | 'passed'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, []);

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

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Search filter
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

      // Category filter
      if (selectedCategory && opp.category !== selectedCategory) {
        return false;
      }

      // Deadline filter
      const days = getDaysUntil(opp.deadline);
      if (deadlineFilter === 'week' && (days === null || days < 0 || days > 7)) {
        return false;
      }
      if (deadlineFilter === 'month' && (days === null || days < 0 || days > 30)) {
        return false;
      }
      if (deadlineFilter === 'passed' && (days === null || days >= 0)) {
        return false;
      }

      return true;
    });
  }, [opportunities, search, selectedCategory, deadlineFilter]);

  const featuredOpportunities = opportunities.filter((o) => o.featured);

  const categories = useMemo(() => {
    const cats = new Set(opportunities.map((o) => o.category));
    return Array.from(cats).sort();
  }, [opportunities]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchOpportunities}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">OpportunityHub</h1>
                <p className="text-sm text-gray-500">For high school students</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {opportunities.length} opportunities listed
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Find Opportunities to Grow
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover scholarships, competitions, internships, and programs to build your future.
            Filter by deadline, category, or search for what interests you.
          </p>
        </section>

        {/* Featured Section */}
        {featuredOpportunities.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl font-semibold text-gray-900">Featured Opportunities</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredOpportunities.slice(0, 3).map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} featured />
              ))}
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <section className="mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Filter Actions (Desktop) */}
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory(null);
                  setDeadlineFilter('all');
                }}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 transition"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            </div>

            {/* Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} sm:block mt-4 pt-4 border-t border-gray-200`}>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Category Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                  <select
                    value={deadlineFilter}
                    onChange={(e) => setDeadlineFilter(e.target.value as typeof deadlineFilter)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All deadlines</option>
                    <option value="week">Within 7 days</option>
                    <option value="month">Within 30 days</option>
                    <option value="passed">Passed deadlines</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(search || selectedCategory || deadlineFilter !== 'all') && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {search && (
                    <FilterTag label={`Search: "${search}"`} onRemove={() => setSearch('')} />
                  )}
                  {selectedCategory && (
                    <FilterTag
                      label={`${categoryConfig[selectedCategory]?.label || selectedCategory}`}
                      onRemove={() => setSelectedCategory(null)}
                    />
                  )}
                  {deadlineFilter !== 'all' && (
                    <FilterTag
                      label={
                        deadlineFilter === 'week'
                          ? 'Due within 7 days'
                          : deadlineFilter === 'month'
                          ? 'Due within 30 days'
                          : 'Passed deadlines'
                      }
                      onRemove={() => setDeadlineFilter('all')}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredOpportunities.length}</span>{' '}
            {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'}
          </p>
        </div>

        {/* Opportunities Grid */}
        {filteredOpportunities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No opportunities match your filters.</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory(null);
                setDeadlineFilter('all');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>OpportunityHub - Helping high school students discover their potential.</p>
            <p className="mt-2 text-sm text-gray-500">
              This is a non-profit resource for educational opportunities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
      {label}
      <button onClick={onRemove} className="hover:text-blue-900">
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
}

function OpportunityCard({ opportunity, featured = false }: { opportunity: Opportunity; featured?: boolean }) {
  const { text: deadlineText, urgent, past } = formatDeadline(opportunity.deadline);
  const catConfig = categoryConfig[opportunity.category] || {
    label: opportunity.category,
    color: 'bg-gray-100 text-gray-700',
    icon: Award,
  };
  const CatIcon = catConfig.icon;

  return (
    <div
      className={`bg-white rounded-xl border transition-all hover:shadow-lg ${
        featured
          ? 'border-amber-300 shadow-sm hover:shadow-md'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="p-6">
        {/* Category & Featured Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${catConfig.color}`}>
            <CatIcon className="w-3.5 h-3.5" />
            {catConfig.label}
          </span>
          {featured && (
            <span className="inline-flex items-center gap-1 text-amber-600">
              <Star className="w-4 h-4 fill-current" />
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {opportunity.title}
        </h3>

        {/* Organization */}
        <p className="text-sm text-gray-500 mb-3">{opportunity.organization}</p>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{opportunity.description}</p>

        {/* Amount */}
        {opportunity.amount && (
          <p className="text-sm text-emerald-600 font-medium mb-3">{opportunity.amount}</p>
        )}

        {/* Eligibility */}
        {opportunity.eligibility && (
          <p className="text-xs text-gray-500 mb-4 line-clamp-2">{opportunity.eligibility}</p>
        )}

        {/* Deadline */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className={`w-4 h-4 ${past ? 'text-gray-400' : urgent ? 'text-red-500' : 'text-gray-400'}`} />
          <span
            className={
              past
                ? 'text-gray-400 line-through'
                : urgent
                ? 'text-red-600 font-medium'
                : 'text-gray-600'
            }
          >
            {deadlineText}
          </span>
        </div>
      </div>

      {/* Link */}
      {opportunity.link && (
        <div className="px-6 pb-6 pt-2">
          <a
            href={opportunity.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition"
          >
            View details
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}
