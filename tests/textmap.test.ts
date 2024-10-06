import { writeFileSync } from "fs";

import Textmap from "../src/Lumps/Textmap";
import Wad from "../src/Wad";

const TEST_WAD_FILENAME = "./tests/wads/udmf.wad";

function loadTestWad(): Wad
{
	const fs = require("fs");
	const file = fs.readFileSync(TEST_WAD_FILENAME);

	const wad = new Wad();

	wad.load(file.buffer);

	return wad;
}

const wad = loadTestWad();

test("WAD parses TEXTMAP lump", () => expect(wad.lumps.find(lump => lump instanceof Textmap)).not.toBeUndefined());
