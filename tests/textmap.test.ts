import { writeFileSync } from "fs";

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

test("WAD parses TEXTMAP lump", () => expect(textmap).not.toBeUndefined());

let tag = 1;

textmap?.blocks
	.filter(block => block.type === "sector" && "id" in block.properties && block.properties.id === 1)
	.forEach(block => block.properties.id = tag++);

writeFileSync("experiment.wad", new DataView(wad.save()));