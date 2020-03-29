import {UMLModel} from "@ls1intum/apollon";

export interface ApplicationState {
    model: UMLModel | null
    idGenerator: IterableIterator<number>
}
