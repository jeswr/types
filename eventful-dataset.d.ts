/* Eventful Dataset Interfaces */
/* Non-standard event-emitting companions to https://rdf.js.org/dataset-spec/ */

import { EventEmitter } from "events";

import { Quad, BaseQuad, Term } from './data-model';
import { Dataset, DatasetCore } from './dataset';

/**
 * A DatasetCore that emits events whenever its contents change.
 *
 * Events:
 * * `add(quad: OutQuad)`:    This event is emitted every time a quad that was not yet included in the dataset,
 *                            as defined in `Quad.equals`, is added to it.
 * * `delete(quad: OutQuad)`: This event is emitted every time a quad that was included in the dataset is removed
 *                            from it.
 */
export interface EventfulDatasetCore<OutQuad extends BaseQuad = Quad, InQuad extends BaseQuad = OutQuad>
    extends DatasetCore<OutQuad, InQuad>, EventEmitter {
}

/**
 * A Dataset that emits events whenever its contents change.
 *
 * The `add` and `delete` events, as described in `EventfulDatasetCore`, are emitted once for every quad that is
 * effectively added to or removed from the dataset, including by bulk methods such as `addAll`, `deleteMatches`
 * and `import`.
 */
export interface EventfulDataset<OutQuad extends BaseQuad = Quad, InQuad extends BaseQuad = OutQuad>
    extends Dataset<OutQuad, InQuad>, EventfulDatasetCore<OutQuad, InQuad> {
    match(subject?: Term | null, predicate?: Term | null, object?: Term | null, graph?: Term | null): Dataset<OutQuad, InQuad>;
}
