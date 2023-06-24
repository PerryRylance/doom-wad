import Wad from "./Wad";

export default class Writer
{
	private wad: Wad;
	private output: ArrayBuffer;
	private view: DataView;

	private cursor: number;

	constructor(wad: Wad)
	{
		this.wad = wad;
	}

	getBufferSize(): number
	{
		let result = 0xC;	// NB: Start with header size

		for(const lump of this.wad.lumps)
		{
			// NB: Add the dictionary entry position, length, and name
			result += 0x10;

			// NB: Add the payload of the lump
			result += lump.content.byteLength;
		}

		return result;
	}

	private rewind(): void
	{
		this.cursor = 0;
	}

	private writeUint8(value: number): void
	{
		if(value < 0 || value > 0xFF)
			throw new RangeError(`Invalid byte value ${value}`);
		
		this.view.setUint8(this.cursor, value);

		this.cursor++;
	}

	private writeUint32(value: number): void
	{
		if(value < 0 || value > 0xFFFFFFFF)
			throw new RangeError(`Invalid 32-bit value ${value}`);
		
		this.view.setUint32(this.cursor, value, true);

		this.cursor += 4;
	}

	private writeString(string: string): void
	{
		for(let i = 0; i < string.length; i++)
		{
			const charCode = string.charCodeAt(i);

			if(charCode > 0xFF)
			{
				const character = String.fromCharCode(charCode);

				throw new RangeError(`Character ${character} cannot be represented by an ASCII byte`);
			}

			this.writeUint8(charCode);
		}
	}

	private writePaddedString(string: string, length: number): void
	{
		if(string.length > length)
			throw new RangeError("String exceeds maximum specified padded string length");
		
		this.writeString(string);

		for(let i = string.length; i < length; i++)
			this.writeUint8(0);
	}

	private writeHeader(): void
	{
		this.writeString(this.wad.type);
		this.writeUint32(this.wad.lumps.length);

		// NB: Add four bytes to account for the dictionary size 32-bit uint itself
		console.log("Calculated dictionary offset is " + (this.cursor + 4 + this.wad.lumpsTotalByteLength));
		this.writeUint32(this.cursor + 4 + this.wad.lumpsTotalByteLength);
	}

	private writeArrayBuffer(data: ArrayBuffer)
	{
		const view = new Uint8Array(this.output, 0, this.output.byteLength);

		view.set(new Uint8Array(data), this.cursor);

		this.cursor += data.byteLength;
	}

	private writeLumpsAndDictionary(): void
	{
		const lumpPositions: number[] = [];

		for(const lump of this.wad.lumps)
		{
			lumpPositions.push(this.cursor);

			this.writeArrayBuffer(lump.content);
		}

		// NB: Now write the dictionary
		let index = 0;

		for(const lump of this.wad.lumps)
		{
			this.writeUint32(lumpPositions[index++]);
			this.writeUint32(lump.content.byteLength);
			this.writePaddedString(lump.name, 8);
		}
	}

	write(output: ArrayBuffer)
	{
		this.output = output;
		this.view = new DataView(output);

		this.rewind();
		this.writeHeader();
		this.writeLumpsAndDictionary();
		
		// TODO: Remove temporary code
		const { writeFileSync } = require("fs");
		writeFileSync("./temp.wad", this.view);

	}
}