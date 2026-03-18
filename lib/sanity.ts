import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "53l346w4",
  dataset: "production",
  apiVersion: "2026-03-01",
  useCdn: true,
});

// --- GROQ Queries ---

export async function getVisualizations() {
  return client.fetch(`
    *[_type == "visualisation"] | order(orderRank asc) {
      title,
      description,
      slug,
      gallery[] {
        asset-> {
          _id,
          url,
          metadata { dimensions }
        },
        alt
      }
    }
  `);
}

export async function getVisualization(slug: string) {
  return client.fetch(
    `
    *[_type == "visualisation" && slug.current == $slug][0] {
      title,
      description,
      slug,
      gallery[] {
        asset-> {
          _id,
          url,
          metadata { dimensions }
        },
        alt,
        caption
      }
    }
  `,
    { slug }
  );
}

export async function getVisualizationSlugs() {
  return client.fetch<{ slug: { current: string } }[]>(`
    *[_type == "visualisation" && defined(slug.current)] {
      slug
    }
  `);
}

export async function getInteriors() {
  return client.fetch(`
    *[_type == "interior"] | order(orderRank asc) {
      title,
      description,
      location,
      livingArea,
      slug,
      gallery[] {
        asset-> {
          _id,
          url,
          metadata { dimensions }
        },
        alt
      }
    }
  `);
}

export async function getInterior(slug: string) {
  return client.fetch(
    `
    *[_type == "interior" && slug.current == $slug][0] {
      title,
      description,
      location,
      livingArea,
      slug,
      gallery[] {
        asset-> {
          _id,
          url,
          metadata { dimensions }
        },
        alt,
        caption
      }
    }
  `,
    { slug }
  );
}

export async function getInteriorSlugs() {
  return client.fetch<{ slug: { current: string } }[]>(`
    *[_type == "interior" && defined(slug.current)] {
      slug
    }
  `);
}

export async function getAllSlugs() {
  return client.fetch<
    { _type: string; slug: { current: string }; _updatedAt: string }[]
  >(`
    *[_type in ["visualisation", "interior"] && defined(slug.current)] {
      _type,
      slug,
      _updatedAt
    }
  `);
}
