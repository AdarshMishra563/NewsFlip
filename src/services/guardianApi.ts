export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  source: string;
  author?: string;
  publishedAt: string;
}

interface GuardianField {
  thumbnail?: string;
  trailText?: string;
}

interface GuardianResult {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  sectionName: string;
  fields?: GuardianField;
}

interface GuardianResponse {
  response: {
    status: string;
    results: GuardianResult[];
    pages: number;
    currentPage: number;
  };
}

const GUARDIAN_BASE = 'https://content.guardianapis.com/search';
const API_KEY = 'test';
const PAGE_SIZE = 10;

const CATEGORY_MAP: Record<string, string> = {
  general: 'news',
  technology: 'technology',
  sports: 'sport',
  business: 'business',
  health: 'society',
};

const MOCK_AUTHORS = [
  'Emma Waverman',
  'David Rosenberg',
  'Sarah Phillips',
  'Michael Owen',
  'Alex Hern',
  'Jane Martinson',
  'Simon Tisdall',
  'Polly Toynbee',
  'Jonathan Freedland',
  'Marina Hyde'
];

function getMockAuthor(id: string): string {
  // Deterministically select an author based on string hash
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % MOCK_AUTHORS.length;
  return MOCK_AUTHORS[index];
}

function mapGuardianArticle(item: GuardianResult): NewsArticle {
  return {
    id: item.id,
    title: item.webTitle,
    description: item.fields?.trailText ?? '',
    image: item.fields?.thumbnail ?? '',
    url: item.webUrl,
    source: item.sectionName,
    author: getMockAuthor(item.id),
    publishedAt: item.webPublicationDate,
  };
}

export interface FetchNewsParams {
  page?: number;
  query?: string;
  category?: string;
}

export interface FetchNewsResult {
  articles: NewsArticle[];
  page: number;
  totalPages: number;
}

export async function fetchGuardianNews({
  page = 1,
  query,
  category,
}: FetchNewsParams): Promise<FetchNewsResult> {
  let url = `${GUARDIAN_BASE}?page=${page}&page-size=${PAGE_SIZE}&show-fields=thumbnail,trailText&api-key=${API_KEY}`;

  if (query && query.trim().length > 0) {
    url += `&q=${encodeURIComponent(query.trim())}`;
  }

  if (category && category !== 'general') {
    const section = CATEGORY_MAP[category] || category;
    url += `&section=${section}`;
  } else if (!query) {
    // Default to news section for general/no query
    url += `&section=news`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const json: GuardianResponse = await res.json();

  return {
    articles: json.response.results.map(mapGuardianArticle),
    page: json.response.currentPage,
    totalPages: json.response.pages,
  };
}
