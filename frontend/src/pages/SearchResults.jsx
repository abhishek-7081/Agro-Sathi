import { useSearchParams, Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, TrendingUp, FileSearch } from 'lucide-react';
import { globalSearch } from '../services/search.service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import SchemeCard from '../components/schemes/SchemeCard';
import Loader from '../components/ui/loader';
import { ROUTES } from '../lib/routes';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ schemes: [], commodities: [], markets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!query) {
      setResults({ schemes: [], commodities: [], markets: [] });
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    globalSearch(query)
      .then((data) => {
        if (active) {
          setResults({
            schemes: data?.schemes || [],
            commodities: data?.commodities || [],
            markets: data?.markets || [],
          });
        }
      })
      .catch(() => {
        if (active) {
          setResults({ schemes: [], commodities: [], markets: [] });
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [query]);

  const totalCount = useMemo(
    () => results.schemes.length + results.commodities.length + results.markets.length,
    [results]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 animate-fade-in">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="theme-panel rounded-[32px] p-6 shadow-premium-lg md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-primary-600">
                <Search size={14} />
                Unified Search
              </div>
              <h1 className="mt-4 text-3xl font-black uppercase tracking-tight theme-heading md:text-5xl">
                Results for "{query || 'your search'}"
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 theme-subtle md:text-base">
                Browse matching schemes, commodity mentions, and market locations from one place.
              </p>
            </div>

            <div className="theme-panel-muted rounded-[24px] px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">Matches Found</p>
              <p className="mt-1 text-3xl font-black text-primary-600">{totalCount}</p>
            </div>
          </div>
        </header>

        {!query ? (
          <div className="theme-panel rounded-[32px] p-10 text-center shadow-premium-lg">
            <FileSearch size={28} className="mx-auto text-primary-600" />
            <p className="mt-4 text-lg font-bold theme-heading">Start by searching for a scheme, commodity, or market.</p>
          </div>
        ) : (
          <Tabs defaultValue="schemes" className="space-y-6">
            <TabsList className="theme-panel flex w-full flex-wrap gap-2 rounded-[24px] p-2 shadow-premium-lg">
              <TabsTrigger value="schemes" className="rounded-full px-4 py-3 text-xs font-black uppercase tracking-[0.16em]">
                Schemes ({results.schemes.length})
              </TabsTrigger>
              <TabsTrigger value="commodities" className="rounded-full px-4 py-3 text-xs font-black uppercase tracking-[0.16em]">
                Commodities ({results.commodities.length})
              </TabsTrigger>
              <TabsTrigger value="markets" className="rounded-full px-4 py-3 text-xs font-black uppercase tracking-[0.16em]">
                Markets ({results.markets.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schemes">
              {results.schemes.length ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {results.schemes.map((scheme) => (
                    <SchemeCard key={scheme.id} scheme={scheme} />
                  ))}
                </div>
              ) : (
                <EmptyState message="No scheme results matched this query." />
              )}
            </TabsContent>

            <TabsContent value="commodities">
              {results.commodities.length ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {results.commodities.map((commodity) => (
                    <Link
                      key={commodity}
                      to={`${ROUTES.markets}?commodity=${encodeURIComponent(commodity)}`}
                      className="theme-panel flex items-center gap-3 rounded-[24px] p-5 shadow-premium-lg transition-transform hover:-translate-y-1"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                        <TrendingUp size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">Commodity</p>
                        <p className="text-base font-bold theme-heading">{commodity}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState message="No commodity mentions matched this query." />
              )}
            </TabsContent>

            <TabsContent value="markets">
              {results.markets.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {results.markets.map((market) => (
                    <Link
                      key={`${market.market}-${market.state}`}
                      to={`${ROUTES.markets}?market=${encodeURIComponent(market.market || '')}`}
                      className="theme-panel flex items-center gap-3 rounded-[24px] p-5 shadow-premium-lg transition-transform hover:-translate-y-1"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">Market</p>
                        <p className="text-base font-bold theme-heading">{market.market}</p>
                        <p className="text-sm theme-subtle">{market.state}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState message="No market locations matched this query." />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="theme-panel rounded-[28px] p-10 text-center shadow-premium-lg">
      <p className="text-base font-semibold theme-subtle">{message}</p>
    </div>
  );
}
