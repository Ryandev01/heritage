import { InventoryAssociationType, InventoryAssociationType_Event } from "./SearchResultsTabsProps"

export type AddPlaceAssociationTypes = {
    list: Array<InventoryAssociationType>
}

export type PlaceInventoryItemTypes = {
    item: InventoryAssociationType
    handleRemoveItem: (e: React.MouseEvent, id: number) =>  void
}
export type AddEventAssociationTypes = {
    list: Array<InventoryAssociationType_Event>
}

export type EventInventoryItemTypes = {
    item: InventoryAssociationType_Event
    handleRemoveItem: (e: React.MouseEvent, id: string) =>  void
}