export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { selected?: string; editing?: string }
}) {


  const editingProductId = searchParams?.editing

  useEffect(() => {
    if (editingProductId && products.length > 0) {
      const productToEdit = products.find(p => p.id === editingProductId)
      if (productToEdit) {
        setEditingProduct(productToEdit)
      }
    }
  }, [editingProductId, products])
