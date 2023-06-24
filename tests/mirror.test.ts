import ParseError from "../src/ParseError";
import Wad, { WadType } from "../src/Wad";

const TEST_WAD_FILENAME = "./tests/freedoom1.wad";

function getTestWadFilesize(): number
{
	const fs = require('fs');
	const { size } = fs.statSync(TEST_WAD_FILENAME);

	return size;
}

function loadTestWad(): Wad
{
	const fs = require("fs");
	const file = fs.readFileSync(TEST_WAD_FILENAME);

	const wad = new Wad();

	wad.load(file.buffer);

	return wad;
}

function loadEmptyFile(): void
{
	const buffer = new ArrayBuffer(0);
	const wad = new Wad();

	wad.load(buffer);
}

function loadInvalidWad(): void
{
	const buffer = new ArrayBuffer(512);
	const wad = new Wad();

	wad.load(buffer);
}

const wad = loadTestWad();

test("Reads WAD type correctly",	() => expect(wad.type).toBe(WadType.IWAD));
test("Throws on empty file",		() => expect(loadEmptyFile).toThrow(ParseError));
test("Throws on invalid WAD type",	() => expect(loadInvalidWad).toThrow(ParseError));
test("Has 3,081 lumps",				() => expect(wad.lumps.length).toBe(3081));

test("Output filesize to be equal",	() => expect(wad.save().byteLength).toBe(getTestWadFilesize()));