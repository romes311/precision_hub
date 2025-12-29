export interface ImageAsset {
  identityId: number;
  fileId: string;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  bigUrl: string | null;
  originalUrl: string | null;
}

export interface Club {
  id: number;
  name: string;
  city: string;
  state: string;
  logoImage?: ImageAsset;
  logoUrl?: string; // Derived or fallback
  description?: string; // 'about' in API
  about?: string;
  contactEmail?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  slug?: string;
  creatorSocialIdentityId?: number;
  source?: "PRS" | "NRL_HUNTER" | "RIMFIRE" | "GAS_GUN";
}

export interface Match {
  id: number;
  name: string;
  startDate: string;
  city: string;
  state: string;
  matchTypeReadableName: string; // e.g. "Rimfire"
  clubId: number | null;
  clubName?: string;
  seriesId?: number;
  seriesName?: string;
  registrationEnabled: boolean;
  matchEnded: boolean;
  logoImage?: ImageAsset;
  clubLogoImage?: ImageAsset;
  creatorSocialIdentityId?: number;
  source?: "PRS" | "NRL_HUNTER" | "RIMFIRE" | "GAS_GUN";
  url?: string;
}

export interface Shooter {
  id: number;
  firstName: string;
  lastName: string;
  handleName?: string;
  rank: number;
  points: number;
  divisionId: number;
  classificationId: number;
  profileImage?: ImageAsset;
}

export interface Division {
  id: number;
  name: string;
}

export interface Classification {
  id: number;
  name: string;
  hexColor: string;
}

export interface MatchResult {
  match: Match & {
    shootersCount: number;
  };
  shooters: Shooter[];
  divisions: Division[];
  classifications: Classification[];
}
