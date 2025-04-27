import { treeQueryOperation } from "./treeQuery";
import { recordAnalysisOperation } from "./recordAnalysis"
import { Operation } from "./Operation"

export const operations: Operation[] = [
    treeQueryOperation,
    recordAnalysisOperation
]