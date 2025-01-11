import { mdxComponents } from "@/src/components/mdx-components";
import { docsSource } from "@/src/lib/source";
import { MDXContent } from '@content-collections/mdx/react';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";

import type { Metadata } from "next";
import type { MDXComponents } from "mdx/types";
import Author from "@/src/components/Author";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default async function Page(props: any) {
  const { slug } = props.params as { slug?: string[] };
  const page = docsSource.getPage(slug);
  if (!page) notFound();

  const authors = page.data.authors || [];
  
  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      {page.data.updatedAt ?
        <span className="text-sm text-gray-500">해당 글은 {page.data.updatedAt}에 수정되었습니다.</span> :
        page.data.createdAt ? <span className="text-sm text-gray-500">해당 글은 {page.data.createdAt}에 작성되었습니다.</span> : null
      }
      <div className="flex gap-4">
        {authors.map((author) => (
          <Author key={author} name={author} />
        ))}
      </div>
      <DocsBody>
        <MDXContent
          code={page.data.body}
          components={{ ...mdxComponents as MDXComponents }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return docsSource.generateParams();
}

// NOTE: This is a workaround to fix the type error.
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function generateMetadata(props: any) {
  const { slug } = props.params as { slug?: string[] };
  const page = docsSource.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  } satisfies Metadata;
}