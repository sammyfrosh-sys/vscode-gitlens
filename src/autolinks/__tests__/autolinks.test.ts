import * as assert from 'assert';
import { suite, test } from 'mocha';
import { map } from '../../system/iterable';
import type { Autolink, RefSet } from '../autolinks';
import { Autolinks } from '../autolinks';

const mockRefSets = (prefixes: string[] = ['']): RefSet[] =>
	prefixes.map(prefix => [
		{ domain: 'test', icon: '1', id: '1', name: 'test' },
		[
			{
				alphanumeric: false,
				ignoreCase: false,
				prefix: prefix,
				title: 'test',
				url: 'test/<num>',
				description: 'test',
			},
		],
	]);

function assertAutolinks(actual: Map<string, Autolink>, expected: Array<string>): void {
	assert.deepEqual([...map(actual.values(), x => x.url)], expected);
}

suite('Autolinks Test Suite', () => {
	test('Branch name autolinks', () => {
		assertAutolinks(Autolinks._getBranchAutolinks('123', mockRefSets()), ['test/123']);
		assertAutolinks(Autolinks._getBranchAutolinks('feature/123', mockRefSets()), ['test/123']);
		assertAutolinks(Autolinks._getBranchAutolinks('feature/PRE-123', mockRefSets()), ['test/123']);
		assertAutolinks(Autolinks._getBranchAutolinks('123.2', mockRefSets()), ['test/123', 'test/2']);
		assertAutolinks(Autolinks._getBranchAutolinks('123', mockRefSets(['PRE-'])), []);
		assertAutolinks(Autolinks._getBranchAutolinks('feature/123', mockRefSets(['PRE-'])), []);
		assertAutolinks(Autolinks._getBranchAutolinks('feature/2-fa/123', mockRefSets([''])), ['test/123', 'test/2']);
		assertAutolinks(Autolinks._getBranchAutolinks('feature/2-fa/123', mockRefSets([''])), ['test/123', 'test/2']);
		// incorrectly solved case, maybe it worths to compare the blocks length so that the less block size (without possible link) is more likely a link
		assertAutolinks(Autolinks._getBranchAutolinks('feature/2-fa/3', mockRefSets([''])), ['test/2', 'test/3']);
		assertAutolinks(Autolinks._getBranchAutolinks('feature/PRE-123', mockRefSets(['PRE-'])), ['test/123']);
		assertAutolinks(Autolinks._getBranchAutolinks('feature/PRE-123.2', mockRefSets(['PRE-'])), ['test/123']);
		assertAutolinks(Autolinks._getBranchAutolinks('feature/3-123-PRE-123', mockRefSets(['PRE-'])), ['test/123']);
		assertAutolinks(
			Autolinks._getBranchAutolinks('feature/3-123-PRE-123', mockRefSets(['', 'PRE-'])),

			['test/123', 'test/3'],
		);
	});

	test('Commit message autolinks', () => {
		assertAutolinks(Autolinks._getAutolinks('test message 123 sd', mockRefSets()), ['test/123']);
	});
});
