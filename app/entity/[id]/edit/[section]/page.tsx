import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ENTITIES } from '@/components/data'
import { SECTIONS } from '@/components/sections'
import DocumentEditor from '@/components/DocumentEditor'

export async function generateMetadata({ params }: { params: Promise<{ id: string; section: string }> }): Promise<Metadata> {
  const { id, section: sectionParam } = await params
  const entity = ENTITIES.find(e => e.id === Number(id))
  const section = SECTIONS[Number(sectionParam)]
  return { title: entity && section ? `${section.title} · ${entity.shortName}` : 'Edit' }
}

export function generateStaticParams() {
  const params: { id: string; section: string }[] = []
  for (const entity of ENTITIES) {
    for (let i = 0; i < SECTIONS.length; i++) {
      params.push({ id: String(entity.id), section: String(i) })
    }
  }
  return params
}

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string; section: string }>
}) {
  const { id, section: sectionParam } = await params
  const entity = ENTITIES.find(e => e.id === Number(id))
  if (!entity) notFound()

  const sectionIndex = Number(sectionParam)
  if (sectionIndex < 0 || sectionIndex >= SECTIONS.length) notFound()

  return <DocumentEditor entity={entity} sectionIndex={sectionIndex} />
}
