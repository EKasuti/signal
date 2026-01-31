export interface UserData {
  age_range: string;
  location: string;
  purchase_history: string[];
  content_engagement: Record<string, number>;
  identifiers?: Record<string, string>;
}

export interface Product {
  name: string;
  category: string;
  features: string[];
  price_tier: string;
}

export interface BehavioralProfile {
  decision_style: string;
  motivational_drivers: { name: string; score: number }[];
  preferred_tone: string;
  verbosity: string;
  emotional_triggers_allowed: string[];
  emotional_triggers_disallowed: string[];
  sensitive_exclusions: string[];
}

export interface AdVariant {
  headline: string;
  body: string;
  call_to_action: string;
  rationale: string;
  type: string;
}

export interface DemoResponse {
  profile: BehavioralProfile;
  personalized_ads: AdVariant[];
  generic_ad: AdVariant;
  explanation: string;
}

export interface LandingPage {
  headline: string;
  hero_subtext: string;
  key_benefits: string[];
  call_to_action: string;
  tone_match_explanation: string;
}
