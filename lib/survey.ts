export const INTEREST_OPTIONS = [
  "Personalized gifts",
  "Home decor",
  "Tech & gadgets",
  "Jewelry & accessories",
  "Art & crafts",
  "Experiences & travel",
  "Food & gourmet",
  "Fashion",
  "Sports & fitness",
  "Pet gifts",
] as const;

export const OCCASION_OPTIONS = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Farewell",
  "Homecoming",
  "Friendship Day",
  "Festivals",
  "Corporate / work milestone",
] as const;

export type InterestOption = (typeof INTEREST_OPTIONS)[number];
export type OccasionOption = (typeof OCCASION_OPTIONS)[number];

export type SurveyPayload = {
  phone: string;
  interests: string[];
  gift_husband: string;
  gift_best_friend: string;
  gift_mother: string;
  gift_father: string;
  occasions: string[];
  additional_notes: string;
  shared_location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
};
