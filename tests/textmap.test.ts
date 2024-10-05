import Textmap from "../src/Lumps/Textmap";
import Wad from "../src/Wad";

const TEST_WAD_FILENAME = "./tests/udmf.wad";

function loadTestWad(): Wad
{
	const fs = require("fs");
	const file = fs.readFileSync(TEST_WAD_FILENAME);

	const wad = new Wad();

	wad.load(file.buffer);

	return wad;
}

const wad = loadTestWad();
const textmap = wad.lumps.find(lump => lump instanceof Textmap);

test("WAD contains TEXTMAP lump", () => expect(textmap).not.toBeUndefined());

// test("Parses namespace correctly", () => )