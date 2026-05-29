declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"cases": {
"chevron.md": {
	id: "chevron.md";
  slug: "chevron";
  body: string;
  collection: "cases";
  data: InferEntrySchema<"cases">
} & { render(): Render[".md"] };
"cyrq.md": {
	id: "cyrq.md";
  slug: "cyrq";
  body: string;
  collection: "cases";
  data: InferEntrySchema<"cases">
} & { render(): Render[".md"] };
"digital-realty.md": {
	id: "digital-realty.md";
  slug: "digital-realty";
  body: string;
  collection: "cases";
  data: InferEntrySchema<"cases">
} & { render(): Render[".md"] };
"dolby.md": {
	id: "dolby.md";
  slug: "dolby";
  body: string;
  collection: "cases";
  data: InferEntrySchema<"cases">
} & { render(): Render[".md"] };
"genentech.md": {
	id: "genentech.md";
  slug: "genentech";
  body: string;
  collection: "cases";
  data: InferEntrySchema<"cases">
} & { render(): Render[".md"] };
"ideo.md": {
	id: "ideo.md";
  slug: "ideo";
  body: string;
  collection: "cases";
  data: InferEntrySchema<"cases">
} & { render(): Render[".md"] };
"informatica.md": {
	id: "informatica.md";
  slug: "informatica";
  body: string;
  collection: "cases";
  data: InferEntrySchema<"cases">
} & { render(): Render[".md"] };
"irhythm.md": {
	id: "irhythm.md";
  slug: "irhythm";
  body: string;
  collection: "cases";
  data: InferEntrySchema<"cases">
} & { render(): Render[".md"] };
"mozilla.md": {
	id: "mozilla.md";
  slug: "mozilla";
  body: string;
  collection: "cases";
  data: InferEntrySchema<"cases">
} & { render(): Render[".md"] };
"riot-games.md": {
	id: "riot-games.md";
  slug: "riot-games";
  body: string;
  collection: "cases";
  data: InferEntrySchema<"cases">
} & { render(): Render[".md"] };
"special-olympics.md": {
	id: "special-olympics.md";
  slug: "special-olympics";
  body: string;
  collection: "cases";
  data: InferEntrySchema<"cases">
} & { render(): Render[".md"] };
"visa.md": {
	id: "visa.md";
  slug: "visa";
  body: string;
  collection: "cases";
  data: InferEntrySchema<"cases">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
