import EditItemFormClient from '../../../../components/EditItemFormClient';

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditItemFormClient itemId={id} />;
}
