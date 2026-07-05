/* Async Dataset Interfaces */
/* Non-standard asynchronous companions to https://rdf.js.org/dataset-spec/ */

import { Quad, BaseQuad, Term } from './data-model';
import { Stream } from './stream';

/**
 * An asynchronous variant of `DatasetCore`, for datasets whose contents cannot be accessed synchronously,
 * for example datasets backed by disk or by remote storage.
 *
 * Mutation and lookup methods return `Promise`s, and quads are consumed as an async iterable.
 */
export interface AsyncDatasetCore<OutQuad extends BaseQuad = Quad, InQuad extends BaseQuad = OutQuad> {
    /**
     * Resolves to a non-negative integer that specifies the number of quads in the set.
     */
    readonly size: Promise<number>;

    /**
     * Adds the specified quad to the dataset.
     *
     * Existing quads, as defined in `Quad.equals`, will be ignored.
     */
    add(quad: InQuad): Promise<this>;

    /**
     * Removes the specified quad from the dataset.
     */
    delete(quad: InQuad): Promise<this>;

    /**
     * Determines whether a dataset includes a certain quad.
     */
    has(quad: InQuad): Promise<boolean>;

    /**
     * Returns a new dataset that is comprised of all quads in the current instance matching the given arguments.
     *
     * The logic described in {@link https://rdf.js.org/dataset-spec/#quad-matching|Quad Matching} is applied for each
     * quad in this dataset to check if it should be included in the output dataset.
     *
     * This method always returns a new AsyncDatasetCore, even if that dataset contains no quads. The returned dataset
     * may be evaluated lazily, so the matching quads are not required to be computed before it is consumed.
     *
     * Since an `AsyncDatasetCore` is an unordered set, the order of the quads within the returned sequence is arbitrary.
     *
     * @param subject   The optional exact subject to match.
     * @param predicate The optional exact predicate to match.
     * @param object    The optional exact object to match.
     * @param graph     The optional exact graph to match.
     */
    match(subject?: Term | null, predicate?: Term | null, object?: Term | null, graph?: Term | null): AsyncDatasetCore<OutQuad, InQuad>;

    [Symbol.asyncIterator](): AsyncIterator<OutQuad>;
}

export interface AsyncDataset<OutQuad extends BaseQuad = Quad, InQuad extends BaseQuad = OutQuad> extends AsyncDatasetCore<OutQuad, InQuad> {
    /**
     * Imports the quads into this dataset.
     *
     * This method differs from `AsyncDataset.union` in that it adds all `quads` to the current instance, rather than
     * combining `quads` and the current instance to create a new instance.
     */
    addAll(quads: AsyncDataset<InQuad>|InQuad[]): Promise<this>;

    /**
     * Resolves to `true` if the current instance is a superset of the given dataset; differently put: if the given
     * dataset is a subset of, is contained in the current dataset.
     *
     * Blank Nodes will be normalized.
     */
    contains(other: AsyncDataset<InQuad>): Promise<boolean>;

    /**
     * This method removes the quads in the current instance that match the given arguments.
     *
     * The logic described in {@link https://rdf.js.org/dataset-spec/#quad-matching|Quad Matching} is applied for each
     * quad in this dataset to select the quads which will be deleted.
     *
     * @param subject   The optional exact subject to match.
     * @param predicate The optional exact predicate to match.
     * @param object    The optional exact object to match.
     * @param graph     The optional exact graph to match.
     */
    deleteMatches(subject?: Term, predicate?: Term, object?: Term, graph?: Term): Promise<this>;

    /**
     * Resolves to a new dataset that contains all quads from the current dataset, not included in the given dataset.
     */
    difference(other: AsyncDataset<InQuad>): Promise<AsyncDataset<OutQuad, InQuad>>;

    /**
     * Resolves to true if the current instance contains the same graph structure as the given dataset.
     *
     * Blank Nodes will be normalized.
     */
    equals(other: AsyncDataset<InQuad>): Promise<boolean>;

    /**
     * Universal quantification method, tests whether every quad in the dataset passes the test implemented by the
     * provided `iteratee`.
     *
     * This method immediately resolves to boolean `false` once a quad that does not pass the test is found.
     *
     * This method always resolves to boolean `true` on an empty dataset.
     *
     * This method is aligned with `Array.prototype.every()` in ECMAScript-262.
     */
    every(iteratee: (quad: OutQuad, dataset: this) => boolean): Promise<boolean>;

    /**
     * Resolves to a new dataset with all the quads that pass the test implemented by the provided `iteratee`.
     *
     * This method is aligned with Array.prototype.filter() in ECMAScript-262.
     */
    filter(iteratee: (quad: OutQuad, dataset: this) => boolean): Promise<AsyncDataset<OutQuad, InQuad>>;

    /**
     * Executes the provided `iteratee` once on each quad in the dataset.
     *
     * This method is aligned with `Array.prototype.forEach()` in ECMAScript-262.
     */
    forEach(callback: (quad: OutQuad, dataset: this) => void): Promise<void>;

    /**
     * Imports all quads from the given stream into the dataset.
     *
     * The stream events `end` and `error` are wrapped in a Promise.
     */
    import(stream: Stream<InQuad>): Promise<this>;

    /**
     * Resolves to a new dataset containing alls quads from the current dataset that are also included in the given dataset.
     */
    intersection(other: AsyncDataset<InQuad>): Promise<AsyncDataset<OutQuad, InQuad>>;

    /**
     * Resolves to a new dataset containing all quads returned by applying `iteratee` to each quad in the current dataset.
     */
    map(iteratee: (quad: OutQuad, dataset: AsyncDataset<OutQuad>) => OutQuad): Promise<AsyncDataset<OutQuad, InQuad>>;

    /**
     * This method calls the `iteratee` on each `quad` of the `AsyncDataset`. The first time the `iteratee` is called,
     * the `accumulator` value is the `initialValue` or, if not given, equals to the first quad of the `AsyncDataset`.
     * The return value of the `iteratee` is used as `accumulator` value for the next calls.
     *
     * This method resolves to the return value of the last `iteratee` call.
     *
     * This method is aligned with `Array.prototype.reduce()` in ECMAScript-262.
     */
    reduce<A = any>(callback: (accumulator: A, quad: OutQuad, dataset: this) => A, initialValue?: A): Promise<A>;

    /**
     * Existential quantification method, tests whether some quads in the dataset pass the test implemented by the
     * provided `iteratee`.
     *
     * This method immediately resolves to boolean `true` once a quad that passes the test is found.
     *
     * This method is aligned with `Array.prototype.some()` in ECMAScript-262.
     */
    some(iteratee: (quad: OutQuad, dataset: this) => boolean): Promise<boolean>;

    /**
     * Resolves to the set of quads within the dataset as a host language native sequence, for example an `Array` in
     * ECMAScript-262.
     *
     * Since an `AsyncDataset` is an unordered set, the order of the quads within the returned sequence is arbitrary.
     */
    toArray(): Promise<OutQuad[]>;

    /**
     * Resolves to an N-Quads string representation of the dataset, preprocessed with
     * {@link https://json-ld.github.io/normalization/spec/|RDF Dataset Normalization} algorithm.
     */
    toCanonical(): Promise<string>;

    /**
     * Returns a stream that contains all quads of the dataset.
     */
    toStream(): Stream<OutQuad>;

    /**
     * Resolves to an N-Quads string representation of the dataset.
     *
     * No prior normalization is required, therefore the results for the same quads may vary depending on the
     * `AsyncDataset` implementation.
     */
    toString(): Promise<string>;

    /**
     * Resolves to a new `AsyncDataset` that is a concatenation of this dataset and the quads given as an argument.
     */
    union(quads: AsyncDataset<InQuad>): Promise<AsyncDataset<OutQuad, InQuad>>;

    match(subject?: Term | null, predicate?: Term | null, object?: Term | null, graph?: Term | null): AsyncDataset<OutQuad, InQuad>;
}
