import { queryBuilderOperation } from "./queryBuilder";
import { recordCompareOperation } from "./recordCompare"
import { Operation } from "./Operation"

export const operations: Operation[] = [
    queryBuilderOperation,
    recordCompareOperation
]