export interface TwitterCookie {
	domain: string;
	expirationDate: number;
	hostOnly: boolean;
	httpOnly: boolean;
	name: string;
	path: string;
	sameSite: string;
	secure: boolean;
	session: boolean;
	storeId: string | null;
	value: string;
}

export interface TwitterVariables {
	userId: string;
	cursor: string | null;
	count: number;
	includePromotedContent: boolean;
}

export interface TwitterResponse {
	data: {
		data: {
			user: {
				result: {
					timeline: {
						timeline: {
							instructions: Instruction[];
						};
					};
				};
			};
		};
	}
}

export interface Instruction {
	type: string;
	entries?: TimelineEntry[];
	direction?: 'Top' | 'Bottom';
}

export type TimelineEntry = UserTimelineEntry | CursorTimelineEntry;

export interface BaseTimelineEntry {
	entryId: string;
	sortIndex: string;
	clientEventInfo: {
		component: string;
		element: string;
	};
}

export interface UserTimelineEntry extends BaseTimelineEntry {
	content: {
		entryType: "TimelineTimelineItem";
		__typename: "TimelineTimelineItem";
		itemContent: {
			itemType: "TimelineUser";
			__typename: "TimelineUser";
			user_results: {
				result: UserResult;
			};
			userDisplayType: string;
		};
	};
}

export interface CursorTimelineEntry extends BaseTimelineEntry {
	content: {
		entryType: "TimelineTimelineCursor";
		__typename: "TimelineTimelineCursor";
		value: string;
		cursorType: 'Top' | 'Bottom';
	};
}

export interface UserResult {
	__typename: string;
	id: string;
	rest_id: string;
	affiliates_highlighted_label: {
		label?: {
			url?: {
				url: string;
				urlType: string;
			};
			badge?: {
				url: string;
			};
			description?: string;
			userLabelType?: string;
			userLabelDisplayType?: string;
			longDescription?: {
				text: string;
				entities: Array<{
					fromIndex: number;
					toIndex: number;
					ref: {
						type: string;
						screen_name: string;
						mention_results: {
							result: {
								__typename: string;
								legacy: {
									screen_name: string;
								};
								rest_id: string;
							};
						};
					};
				}>;
			};
		};
	};
	has_graduated_access: boolean;
	is_blue_verified: boolean;
	profile_image_shape: string;
	legacy: UserLegacy;
	professional?: {
		rest_id: string;
		professional_type: string;
		category: ProfessionalCategory[];
	};
}

export interface UserLegacy {
	following?: boolean;
	notifications?: boolean;
	protected?: boolean;
	can_dm: boolean;
	can_media_tag: boolean;
	created_at: string;
	default_profile: boolean;
	default_profile_image: boolean;
	description: string;
	entities: {
		description: {
			urls: UrlEntity[];
		};
		url?: {
			urls: UrlEntity[];
		};
	};
	fast_followers_count: number;
	favourites_count: number;
	followers_count: number;
	friends_count: number;
	has_custom_timelines: boolean;
	is_translator: boolean;
	listed_count: number;
	location: string;
	media_count: number;
	name: string;
	normal_followers_count: number;
	pinned_tweet_ids_str: string[];
	possibly_sensitive: boolean;
	profile_banner_url?: string;
	profile_image_url_https: string;
	profile_interstitial_type: string;
	screen_name: string;
	statuses_count: number;
	translator_type: string;
	url?: string;
	verified: boolean;
	verified_type?: string;
	want_retweets: boolean;
	withheld_in_countries: string[];
}

export interface UrlEntity {
	display_url: string;
	expanded_url: string;
	url: string;
	indices: number[];
}

export interface ProfessionalCategory {
	id: number;
	name: string;
	icon_name: string;
}