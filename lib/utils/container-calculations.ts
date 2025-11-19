export interface ContainerSpecs {
  type: string
  minPallets: number
  maxPallets: number
  label: string
}

export const CONTAINER_TYPES: ContainerSpecs[] = [
  { type: '20ft', minPallets: 10, maxPallets: 11, label: "20' GP (General Purpose)" },
  { type: '40ft', minPallets: 20, maxPallets: 21, label: "40' GP (General Purpose)" },
  { type: '40ft_hc', minPallets: 22, maxPallets: 23, label: "40' HC (High Cube)" },
  { type: 'reefer_40', minPallets: 20, maxPallets: 20, label: "Reefer 40' (Refrigerated)" },
]

export function getContainerSpecs(containerType: string): ContainerSpecs | undefined {
  return CONTAINER_TYPES.find((c) => c.type === containerType)
}

export function getMaxPallets(containerType: string, palletType: 'euro' | 'industrial'): number {
  const specs = getContainerSpecs(containerType)
  if (!specs) return 0
  
  // Euro pallets are smaller, so they can sometimes fit +1 pallet
  // Industrial pallets are larger, so use the minimum capacity
  if (palletType === 'euro') {
    return specs.maxPallets
  } else {
    // Industrial pallets → lower count
    return specs.minPallets
  }
}

export function calculateLoad(
  cartonWeight: number,
  cartonsPerPallet: number,
  numPallets: number
) {
  const totalCartons = numPallets * cartonsPerPallet
  const totalWeight = totalCartons * cartonWeight
  
  return {
    totalCartons,
    totalWeight,
  }
}

export function calculateContainerFill(
  numPallets: number,
  containerType: string,
  palletType: 'euro' | 'industrial' = 'euro'
): number {
  const maxCapacity = getMaxPallets(containerType, palletType)
  if (maxCapacity === 0) return 0
  
  return (numPallets / maxCapacity) * 100
}

export function recommendFreightMode(
  totalWeight: number,
  containerType: string,
  isPerishable: boolean
): string {
  if (isPerishable || containerType === 'reefer_40') {
    return 'Reefer (Refrigerated)'
  }
  
  if (totalWeight < 1000) {
    return 'Road Freight'
  }
  
  if (totalWeight < 5000) {
    return 'Road / LTL (Less Than Load)'
  }
  
  return 'Sea Freight (FCL - Full Container Load)'
}
