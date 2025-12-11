export interface GithubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
  location: string | null;
  company: string | null;
  twitter_username: string | null;
  blog: string | null;
  hireable: boolean | null;
}

export interface GithubRepo {
  name: string;
  stargazers_count: number;
  language: string | null;
  forks_count: number;
  updated_at: string;
  description: string | null;
  topics: string[];
  fork: boolean;
}

export interface StatAttribute {
  label: string;
  value: number; // 0 - 100 or specific value
  unit?: string;
}

export interface SpecialAbility {
  name: string;
  description: string;
}

export interface CardData {
  id: string; // e.g., "A1"
  archetype: string; // e.g., "Frontend Wizard", "Fullstack Titan"
  description: string; // Short flavor text
  stats: StatAttribute[];
  specialAbility: SpecialAbility;
  superTrunfoAttribute: string; // The "Trump" stat
}

export interface CombinedProfile {
  user: GithubUser;
  cardData: CardData;
  aiImageUrl?: string; // New field for the generated image
}