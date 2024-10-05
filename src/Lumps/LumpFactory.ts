import Lump from "./Lump";
import Textmap from "./Textmap";

export default class LumpFactory
{
	static createFromName(name: string)
	{
		let result: Lump;

		switch(name.replace(/\0.*$/g,''))
		{
			case "TEXTMAP":
				result = new Textmap();
				break;

			default:
				result = new Lump();
				break;
		}

		result.name = name;

		return result;
	}
}