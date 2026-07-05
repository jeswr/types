import { AsyncDataset, AsyncDatasetCore, BaseQuad, Dataset, DatasetCore, EventfulDataset, EventfulDatasetCore,
  Quad, Stream, Term } from ".";
import { EventEmitter } from "events";

async function test_asyncdatasetcore() {
    // Only types are checked in these tests,
    // so this does not have to be functional.
    const quad: Quad = <any> {};
    const term: Term = <any> {};

    interface QuadBnode extends BaseQuad {
        subject: Term;
        predicate: Term;
        object: Term;
        graph: Term;
    }
    const quadBnode: QuadBnode = <any> {};

    const dataset1: AsyncDatasetCore = <any> {};
    const dataset2: AsyncDatasetCore<QuadBnode, QuadBnode> = <any> {};

    const dataset1Size: number = await dataset1.size;
    const dataset1Add: AsyncDatasetCore = await dataset1.add(quad);
    const dataset1Delete: AsyncDatasetCore = await dataset1.delete(quad);
    const dataset1Has: boolean = await dataset1.has(quad);
    const dataset1Match1: AsyncDatasetCore = dataset1.match();
    const dataset1Match2: AsyncDatasetCore = dataset1.match(term);
    const dataset1Match3: AsyncDatasetCore = dataset1.match(term, term);
    const dataset1Match4: AsyncDatasetCore = dataset1.match(term, term, term);
    const dataset1Match5: AsyncDatasetCore = dataset1.match(term, term, term, term);
    const dataset1MatchWithNull1: AsyncDatasetCore = dataset1.match(null, term);
    const dataset1MatchWithNull2: AsyncDatasetCore = dataset1.match(term, null, term);
    const dataset1Iterable: AsyncIterable<Quad> = dataset1;
    for await (const q of dataset1) {
        const outQuad: Quad = q;
    }

    const dataset2Add: AsyncDatasetCore<QuadBnode> = await dataset2.add(quadBnode);
    const dataset2Has: boolean = await dataset2.has(quadBnode);
    const dataset2Iterable: AsyncIterable<QuadBnode> = dataset2;
}

async function test_asyncdataset() {
    const quad: Quad = <any> {};
    const term: Term = <any> {};
    const stream: Stream = <any> {};

    const dataset1: AsyncDataset = <any> {};
    const dataset2: AsyncDataset = <any> {};

    const dataset1Core: AsyncDatasetCore = dataset1;

    const dataset1AddAll1: AsyncDataset = await dataset1.addAll(dataset2);
    const dataset1AddAll2: AsyncDataset = await dataset1.addAll([quad, quad]);
    const dataset1Contains: boolean = await dataset1.contains(dataset2);
    const dataset1DeleteMatches: AsyncDataset = await dataset1.deleteMatches(term, term);
    const dataset1Difference: AsyncDataset = await dataset1.difference(dataset2);
    const dataset1Equals: boolean = await dataset1.equals(dataset2);
    const dataset1Every: boolean = await dataset1.every((quad: Quad, dataset: AsyncDataset) => true);
    const dataset1Filter: AsyncDataset = await dataset1.filter((quad: Quad, dataset: AsyncDataset) => true);
    const dataset1ForEach: void = await dataset1.forEach((quad: Quad, dataset: AsyncDataset) => { return; });
    const dataset1Import: AsyncDataset = await dataset1.import(stream);
    const dataset1Intersection: AsyncDataset = await dataset1.intersection(dataset2);
    const dataset1Map: AsyncDataset = await dataset1.map((quad: Quad, dataset: AsyncDataset) => quad);
    const dataset1Reduce: number = await dataset1.reduce((accumulator: number, quad: Quad, dataset: AsyncDataset) => accumulator, 0);
    const dataset1Some: boolean = await dataset1.some((quad: Quad, dataset: AsyncDataset) => true);
    const dataset1ToArray: Quad[] = await dataset1.toArray();
    const dataset1ToCanonical: string = await dataset1.toCanonical();
    const dataset1ToStream: Stream = dataset1.toStream();
    const dataset1ToString: string = await dataset1.toString();
    const dataset1Union: AsyncDataset = await dataset1.union(dataset2);
    const dataset1Match: AsyncDataset = dataset1.match(term, null, term);
    const dataset1Iterable: AsyncIterable<Quad> = dataset1;
}

function test_eventfuldatasetcore() {
    const quad: Quad = <any> {};
    const term: Term = <any> {};

    const dataset1: EventfulDatasetCore = <any> {};

    const dataset1Core: DatasetCore = dataset1;
    const dataset1Emitter: EventEmitter = dataset1;

    const dataset1Size: number = dataset1.size;
    const dataset1Add: EventfulDatasetCore = dataset1.add(quad);
    const dataset1Delete: EventfulDatasetCore = dataset1.delete(quad);
    const dataset1Has: boolean = dataset1.has(quad);
    const dataset1Match: DatasetCore = dataset1.match(term, null, term);
    const dataset1Iterable: Iterable<Quad> = dataset1;

    const dataset1On: EventfulDatasetCore = dataset1.on('add', (quad: Quad) => { return; });
    const dataset1Once: EventfulDatasetCore = dataset1.once('delete', (quad: Quad) => { return; });
    const dataset1Emit: boolean = dataset1.emit('add', quad);
}

function test_eventfuldataset() {
    const quad: Quad = <any> {};
    const term: Term = <any> {};

    const dataset1: EventfulDataset = <any> {};
    const dataset2: EventfulDataset = <any> {};

    const dataset1Dataset: Dataset = dataset1;
    const dataset1Core: EventfulDatasetCore = dataset1;
    const dataset1Emitter: EventEmitter = dataset1;

    const dataset1AddAll: EventfulDataset = dataset1.addAll([quad, quad]);
    const dataset1Union: Dataset = dataset1.union(dataset2);
    const dataset1Match: Dataset = dataset1.match(term, null, term);

    const dataset1On: EventfulDataset = dataset1.on('add', (quad: Quad) => { return; });
    const dataset1Emit: boolean = dataset1.emit('delete', quad);
}
